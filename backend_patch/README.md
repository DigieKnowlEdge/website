# Backend Video Streaming Patch

## What this fixes

| Problem | Root Cause | Fix |
|---|---|---|
| Large video uploads timeout | `await file.read()` loads entire file into RAM | Stream in 1 MB chunks |
| Students can't seek in videos | `stream_lesson` doesn't support HTTP `Range` headers | Forward Range header to storage, return 206 Partial Content |
| Uploads fail on slow connections | Single large PUT to object storage times out | Chunked upload: split into 5 MB pieces, reassemble on server |

## How to apply

1. Open your `server.py` (FastAPI backend)
2. Replace `upload_file` with the version in `video_streaming.py`
3. Replace `stream_lesson` with the version in `video_streaming.py`
4. Add `_chunk_store`, `upload_chunk`, and `complete_chunked_upload` functions
5. Register the new routes (see comments at bottom of `video_streaming.py`)
6. Restart your FastAPI server

## Production upgrade path

For a production LMS with many concurrent students:

1. **Replace `_chunk_store`** (in-memory dict) with Redis — it's lost on restart and doesn't work across multiple server instances

2. **Transcode to HLS** for true adaptive streaming:
   ```bash
   # Install ffmpeg, then for each uploaded video:
   ffmpeg -i input.mp4 \
     -profile:v baseline -level 3.0 \
     -start_number 0 -hls_time 10 -hls_list_size 0 \
     -f hls output.m3u8
   ```
   Or use a managed service: **Mux**, **Bunny.net Stream**, or **Cloudflare Stream** — they handle transcoding, CDN delivery, and DRM automatically.

3. **Use pre-signed URLs** instead of proxying through FastAPI — let students download directly from object storage with a time-limited signed URL to reduce server load.
