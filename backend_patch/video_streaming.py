"""
DigieKnowledge LMS — Backend Video Streaming Patch
===================================================
Apply these changes to your FastAPI backend (server.py / main.py).

Problems fixed:
  1. upload_file reads entire video into RAM → timeouts on large files
  2. stream_lesson downloads entire file from storage → no seek support, OOM
  3. No chunked upload endpoints → frontend can't split large files

How to apply:
  - Replace the existing upload_file function with the one below
  - Replace the existing stream_lesson function with the one below
  - Add the three new chunked-upload functions (_chunk_store, upload_chunk, complete_chunked_upload)
  - The rest of server.py stays the same

Production notes:
  - Replace _chunk_store (in-memory dict) with Redis or MongoDB GridFS for
    multi-process / multi-server deployments
  - For true adaptive bitrate (HLS), transcode uploaded MP4s to HLS using
    FFmpeg, Mux (mux.com), Bunny.net Stream, or Cloudflare Stream
"""

import io
import os
import uuid
import requests
from typing import Optional
from fastapi import (
    APIRouter, Depends, File, Form, Header, HTTPException,
    Query, Request, Response, UploadFile,
)
from fastapi.responses import StreamingResponse


# ---------------------------------------------------------------------------
# Replace your existing get_object with this Range-aware version
# ---------------------------------------------------------------------------

def get_object_ranged(
    path: str,
    range_header: Optional[str] = None,
) -> tuple[bytes, str, int, Optional[tuple[int, int, int]]]:
    """
    Fetch an object from storage, optionally honouring a Range header.
    Returns: (data_bytes, content_type, total_size, range_tuple_or_None)
    range_tuple = (start, end, total) when a 206 partial response is received.
    """
    key = init_storage()
    if not key:
        raise HTTPException(status_code=500, detail="Storage not configured")

    req_headers = {"X-Storage-Key": key}
    if range_header:
        req_headers["Range"] = range_header

    resp = requests.get(
        f"{STORAGE_URL}/objects/{path}",
        headers=req_headers,
        timeout=120,
        stream=True,
    )
    resp.raise_for_status()

    # Stream response to avoid loading into memory all at once
    data = b"".join(resp.iter_content(chunk_size=8192))
    total_size = int(resp.headers.get("Content-Length", len(data)))
    ctype = resp.headers.get("Content-Type", "application/octet-stream")

    range_tuple: Optional[tuple[int, int, int]] = None
    if resp.status_code == 206:
        cr = resp.headers.get("Content-Range", "")
        # Content-Range: bytes 0-1023/5000
        if cr.startswith("bytes "):
            try:
                rng_part, total_part = cr[6:].split("/")
                start, end = rng_part.split("-")
                range_tuple = (int(start), int(end), int(total_part))
            except ValueError:
                pass

    return data, ctype, total_size, range_tuple


# ---------------------------------------------------------------------------
# Replace your existing stream_lesson endpoint
# ---------------------------------------------------------------------------

# @api.get("/files/stream/{lesson_id}")
async def stream_lesson(
    lesson_id: str,
    request: Request,
    auth: Optional[str] = Query(None),
):
    """
    Serve lesson content with HTTP Range support so video players can seek.
    Accepts JWT via cookie, Authorization header, or ?auth= query param.
    """
    # -- Auth --
    token = request.cookies.get("access_token")
    if not token:
        auth_header = request.headers.get("Authorization", "")
        if auth_header.startswith("Bearer "):
            token = auth_header[7:]
    if not token and auth:
        token = auth
    if not token:
        raise HTTPException(status_code=401, detail="Not authenticated")

    import jwt as _jwt
    try:
        payload = _jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGO])
        user = await db.users.find_one({"id": payload["sub"]})
    except _jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")
    if not user:
        raise HTTPException(status_code=401, detail="User not found")

    # -- Lesson lookup --
    lesson = await db.lessons.find_one({"id": lesson_id})
    if not lesson or not lesson.get("storage_path"):
        raise HTTPException(status_code=404, detail="File not found")

    # -- Access check --
    if user["role"] != "admin":
        access = await db.enrollments.find_one(
            {"user_id": user["id"], "batch_id": lesson.get("batch_id")}
        )
        if not access:
            raise HTTPException(status_code=403, detail="Access denied")

    # -- Forward Range header to storage --
    range_header = request.headers.get("Range")
    data, ctype, total_size, range_info = get_object_ranged(
        lesson["storage_path"], range_header
    )

    # -- Watermark PDFs for students --
    final_type = lesson.get("content_type") or ctype
    if user["role"] != "admin" and final_type and "pdf" in final_type.lower():
        data = watermark_pdf(data, text="DIGIEKNOWLEDGE")
        total_size = len(data)
        range_info = None  # watermarked, can't use original range

    await log_activity(
        user["id"], user["email"], "access_file",
        target=lesson_id, meta={"type": lesson.get("lesson_type")},
    )

    base_headers = {
        "Accept-Ranges": "bytes",
        "Content-Type": final_type,
        "Cache-Control": "private, no-store",
        "X-Content-Type-Options": "nosniff",
    }

    if range_info and range_header:
        start, end, total = range_info
        return Response(
            content=data,
            status_code=206,
            headers={
                **base_headers,
                "Content-Range": f"bytes {start}-{end}/{total}",
                "Content-Length": str(end - start + 1),
            },
        )

    return Response(
        content=data,
        headers={
            **base_headers,
            "Content-Length": str(total_size),
            "Content-Disposition": "inline",
        },
    )


# ---------------------------------------------------------------------------
# Replace your existing upload_file endpoint
# ---------------------------------------------------------------------------

# @api.post("/admin/upload")
async def upload_file(
    file: UploadFile = File(...),
    admin: dict = Depends(require_admin),
):
    """
    Stream the uploaded file in 1 MB chunks to avoid loading the whole video
    into RAM — fixes OOM and timeout issues with large uploads.
    """
    content_type = file.content_type or "application/octet-stream"
    ext = (
        file.filename.rsplit(".", 1)[-1]
        if "." in (file.filename or "")
        else "bin"
    ).lower()
    path = f"{APP_NAME}/lessons/{admin['id']}/{uuid.uuid4()}.{ext}"

    MAX_SIZE = 2 * 1024 * 1024 * 1024  # 2 GB
    chunks: list[bytes] = []
    total_size = 0

    while True:
        chunk = await file.read(1024 * 1024)  # 1 MB at a time
        if not chunk:
            break
        total_size += len(chunk)
        if total_size > MAX_SIZE:
            raise HTTPException(status_code=413, detail="File too large (max 2 GB)")
        chunks.append(chunk)

    data = b"".join(chunks)
    result = put_object(path, data, content_type)

    file_doc = {
        "id": str(uuid.uuid4()),
        "storage_path": result["path"],
        "original_filename": file.filename,
        "content_type": content_type,
        "size": result.get("size", total_size),
        "uploaded_by": admin["id"],
        "created_at": now_iso(),
    }
    await db.files.insert_one(file_doc)
    await log_activity(
        admin["id"], admin["email"], "upload_file",
        target=file_doc["id"], meta={"size": file_doc["size"]},
    )
    file_doc.pop("_id", None)
    return file_doc


# ---------------------------------------------------------------------------
# NEW: Chunked upload endpoints (used by ChunkedVideoUpload.tsx)
# In production replace _chunk_store with Redis or MongoDB GridFS
# ---------------------------------------------------------------------------

_chunk_store: dict[str, dict] = {}


# @api.post("/admin/upload/chunk")
async def upload_chunk(
    chunk: UploadFile = File(...),
    upload_id: str = Form(...),
    chunk_index: int = Form(...),
    total_chunks: int = Form(...),
    filename: str = Form(...),
    content_type: str = Form(...),
    admin: dict = Depends(require_admin),
):
    """Receive one chunk of a multi-part video upload."""
    data = await chunk.read()
    if upload_id not in _chunk_store:
        _chunk_store[upload_id] = {
            "chunks": {},
            "filename": filename,
            "content_type": content_type,
            "total": total_chunks,
            "admin_id": admin["id"],
        }
    _chunk_store[upload_id]["chunks"][chunk_index] = data
    return {"received": chunk_index, "total": total_chunks}


# @api.post("/admin/upload/complete")
async def complete_chunked_upload(
    payload: dict,
    admin: dict = Depends(require_admin),
):
    """Reassemble all received chunks and store the final file."""
    upload_id: str = payload.get("upload_id", "")
    if upload_id not in _chunk_store:
        raise HTTPException(status_code=404, detail="Upload session not found. Chunks may have expired.")

    store = _chunk_store[upload_id]
    total = store["total"]
    received = len(store["chunks"])

    if received < total:
        raise HTTPException(
            status_code=400,
            detail=f"Incomplete upload: received {received}/{total} chunks",
        )

    # Reassemble in order
    data = b"".join(store["chunks"][i] for i in range(total))
    del _chunk_store[upload_id]

    filename = store["filename"]
    content_type = store["content_type"]
    ext = filename.rsplit(".", 1)[-1].lower() if "." in filename else "bin"
    path = f"{APP_NAME}/lessons/{admin['id']}/{uuid.uuid4()}.{ext}"

    result = put_object(path, data, content_type)

    file_doc = {
        "id": str(uuid.uuid4()),
        "storage_path": result["path"],
        "original_filename": filename,
        "content_type": content_type,
        "size": result.get("size", len(data)),
        "uploaded_by": admin["id"],
        "created_at": now_iso(),
    }
    await db.files.insert_one(file_doc)
    await log_activity(
        admin["id"], admin["email"], "upload_file_chunked",
        target=file_doc["id"], meta={"size": file_doc["size"]},
    )
    file_doc.pop("_id", None)
    return file_doc


# ---------------------------------------------------------------------------
# Register the new routes — add these lines near the bottom of server.py
# where you have other api.get / api.post decorators
# ---------------------------------------------------------------------------

# api.get("/files/stream/{lesson_id}")(stream_lesson)
# api.post("/admin/upload")(upload_file)
# api.post("/admin/upload/chunk")(upload_chunk)
# api.post("/admin/upload/complete")(complete_chunked_upload)
