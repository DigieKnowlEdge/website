"use client";

import { useRef, useState, useCallback } from "react";
import { Upload, FileVideo, CheckCircle, XCircle, Loader2 } from "lucide-react";

const CHUNK_SIZE = 5 * 1024 * 1024; // 5 MB

interface FileDoc {
  id: string;
  storage_path: string;
  content_type: string;
  original_filename?: string;
  size?: number;
}

interface ChunkedVideoUploadProps {
  apiBase: string;
  authToken: string;
  onUploadComplete: (fileDoc: FileDoc) => void;
}

type UploadState = "idle" | "uploading" | "done" | "error";

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function ChunkedVideoUpload({
  apiBase,
  authToken,
  onUploadComplete,
}: ChunkedVideoUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [state, setState] = useState<UploadState>("idle");
  const [progress, setProgress] = useState(0);
  const [statusMsg, setStatusMsg] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState("");

  const headers = { Authorization: `Bearer ${authToken}` };

  const uploadChunked = useCallback(
    async (f: File) => {
      const totalChunks = Math.ceil(f.size / CHUNK_SIZE);
      const uploadId = crypto.randomUUID();

      // Try chunked upload first
      try {
        for (let i = 0; i < totalChunks; i++) {
          const start = i * CHUNK_SIZE;
          const chunk = f.slice(start, start + CHUNK_SIZE);
          const fd = new FormData();
          fd.append("chunk", chunk, f.name);
          fd.append("upload_id", uploadId);
          fd.append("chunk_index", String(i));
          fd.append("total_chunks", String(totalChunks));
          fd.append("filename", f.name);
          fd.append("content_type", f.type);

          setStatusMsg(`Uploading part ${i + 1} of ${totalChunks}…`);

          const res = await fetch(`${apiBase}/api/admin/upload/chunk`, {
            method: "POST",
            headers,
            body: fd,
          });

          // If chunked endpoint not available, fall back to single upload
          if (res.status === 404 || res.status === 405) {
            return uploadSingle(f);
          }
          if (!res.ok) throw new Error(`Chunk ${i} failed: ${res.statusText}`);

          setProgress(Math.round(((i + 1) / totalChunks) * 90));
        }

        // Finalize
        setStatusMsg("Finalizing upload…");
        const completeRes = await fetch(`${apiBase}/api/admin/upload/complete`, {
          method: "POST",
          headers: { ...headers, "Content-Type": "application/json" },
          body: JSON.stringify({
            upload_id: uploadId,
            filename: f.name,
            content_type: f.type,
            total_chunks: totalChunks,
          }),
        });
        if (!completeRes.ok) throw new Error(`Finalize failed: ${completeRes.statusText}`);
        const doc: FileDoc = await completeRes.json();
        setProgress(100);
        setState("done");
        setStatusMsg("Upload complete!");
        onUploadComplete(doc);
      } catch (err) {
        // If chunked failed partway through, try single
        return uploadSingle(f);
      }
    },
    [apiBase, authToken, onUploadComplete]
  );

  const uploadSingle = useCallback(
    async (f: File) => {
      setStatusMsg("Uploading file…");
      const fd = new FormData();
      fd.append("file", f, f.name);

      const xhr = new XMLHttpRequest();
      xhr.open("POST", `${apiBase}/api/admin/upload`);
      xhr.setRequestHeader("Authorization", `Bearer ${authToken}`);

      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable) {
          setProgress(Math.round((e.loaded / e.total) * 100));
        }
      };

      await new Promise<void>((resolve, reject) => {
        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            const doc: FileDoc = JSON.parse(xhr.responseText);
            setState("done");
            setStatusMsg("Upload complete!");
            onUploadComplete(doc);
            resolve();
          } else {
            reject(new Error(`Upload failed: ${xhr.statusText}`));
          }
        };
        xhr.onerror = () => reject(new Error("Network error"));
        xhr.send(fd);
      });
    },
    [apiBase, authToken, onUploadComplete]
  );

  const startUpload = async () => {
    if (!file) return;
    setState("uploading");
    setProgress(0);
    setError("");
    try {
      if (file.size > CHUNK_SIZE) {
        await uploadChunked(file);
      } else {
        await uploadSingle(file);
      }
    } catch (err: unknown) {
      setState("error");
      setError(err instanceof Error ? err.message : "Upload failed");
    }
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const f = e.dataTransfer.files[0];
    if (f && f.type.startsWith("video/")) {
      setFile(f);
      setState("idle");
      setError("");
    }
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) {
      setFile(f);
      setState("idle");
      setError("");
    }
  };

  return (
    <div className="w-full max-w-xl">
      {/* Drop zone */}
      <div
        className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
          isDragging
            ? "border-[#C9A84C] bg-[#C9A84C]/5"
            : "border-white/20 hover:border-[#C9A84C]/50 bg-[#111111]"
        }`}
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={onDrop}
        onClick={() => inputRef.current?.click()}
      >
        <input
          ref={inputRef}
          type="file"
          accept="video/*"
          className="hidden"
          onChange={onFileChange}
        />
        {file ? (
          <div className="flex items-center gap-3 justify-center text-left">
            <FileVideo className="w-8 h-8 text-[#C9A84C] shrink-0" />
            <div>
              <p className="text-white font-medium text-sm">{file.name}</p>
              <p className="text-white/50 text-xs">{formatBytes(file.size)}</p>
            </div>
          </div>
        ) : (
          <>
            <Upload className="w-10 h-10 text-white/30 mx-auto mb-3" />
            <p className="text-white/70 text-sm mb-1">
              Drag & drop a video here, or click to select
            </p>
            <p className="text-white/30 text-xs">MP4, WebM, MOV — up to 2 GB</p>
          </>
        )}
      </div>

      {/* Upload button */}
      {file && state === "idle" && (
        <button
          onClick={startUpload}
          className="mt-4 w-full py-3 rounded-lg bg-[#C9A84C] text-black font-semibold hover:bg-[#d4b05a] transition-colors"
        >
          Upload Video
        </button>
      )}

      {/* Progress */}
      {state === "uploading" && (
        <div className="mt-4 space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-white/60 flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin text-[#C9A84C]" />
              {statusMsg}
            </span>
            <span className="text-[#C9A84C] font-medium">{progress}%</span>
          </div>
          <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-[#C9A84C] rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {/* Done */}
      {state === "done" && (
        <div className="mt-4 flex items-center gap-2 text-green-400 text-sm">
          <CheckCircle className="w-5 h-5" />
          {statusMsg}
        </div>
      )}

      {/* Error */}
      {state === "error" && (
        <div className="mt-4 space-y-2">
          <div className="flex items-center gap-2 text-red-400 text-sm">
            <XCircle className="w-5 h-5" />
            {error}
          </div>
          <button
            onClick={startUpload}
            className="text-[#C9A84C] text-sm hover:underline"
          >
            Retry upload
          </button>
        </div>
      )}
    </div>
  );
}
