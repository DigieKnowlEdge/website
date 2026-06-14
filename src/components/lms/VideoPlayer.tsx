"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  Loader2,
} from "lucide-react";

interface VideoPlayerProps {
  src: string;
  lessonId: string;
  onProgress?: (pct: number) => void;
  onComplete?: () => void;
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export default function VideoPlayer({
  src,
  lessonId,
  onProgress,
  onComplete,
}: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const hideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isBuffering, setIsBuffering] = useState(true);
  const [showControls, setShowControls] = useState(true);
  const [completedFired, setCompletedFired] = useState(false);

  // Initialize HLS or native video
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !src) return;

    let destroyed = false;

    const setup = async () => {
      if (src.includes(".m3u8")) {
        const HlsModule = await import("hls.js");
        const Hls = HlsModule.default;
        if (Hls.isSupported()) {
          const hls = new Hls({ enableWorker: true, lowLatencyMode: false });
          hls.loadSource(src);
          hls.attachMedia(video);
          return () => { if (!destroyed) hls.destroy(); };
        }
      }
      // Native HLS (Safari) or regular MP4
      video.src = src;
      return () => {};
    };

    let cleanup: (() => void) | undefined;
    setup().then((fn) => { cleanup = fn; });

    return () => {
      destroyed = true;
      cleanup?.();
    };
  }, [src]);

  // Track progress and fire completion
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const onTimeUpdate = () => {
      setCurrentTime(video.currentTime);
      if (video.duration && onProgress) {
        const pct = (video.currentTime / video.duration) * 100;
        onProgress(pct);
        if (pct >= 90 && !completedFired) {
          setCompletedFired(true);
          onComplete?.();
        }
      }
    };

    const onLoadedMetadata = () => setDuration(video.duration);
    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    const onWaiting = () => setIsBuffering(true);
    const onCanPlay = () => setIsBuffering(false);
    const onEnded = () => {
      setIsPlaying(false);
      if (!completedFired) {
        setCompletedFired(true);
        onComplete?.();
      }
    };

    video.addEventListener("timeupdate", onTimeUpdate);
    video.addEventListener("loadedmetadata", onLoadedMetadata);
    video.addEventListener("play", onPlay);
    video.addEventListener("pause", onPause);
    video.addEventListener("waiting", onWaiting);
    video.addEventListener("canplay", onCanPlay);
    video.addEventListener("ended", onEnded);

    return () => {
      video.removeEventListener("timeupdate", onTimeUpdate);
      video.removeEventListener("loadedmetadata", onLoadedMetadata);
      video.removeEventListener("play", onPlay);
      video.removeEventListener("pause", onPause);
      video.removeEventListener("waiting", onWaiting);
      video.removeEventListener("canplay", onCanPlay);
      video.removeEventListener("ended", onEnded);
    };
  }, [completedFired, onProgress, onComplete]);

  // Fullscreen change listener
  useEffect(() => {
    const onFsChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", onFsChange);
    return () => document.removeEventListener("fullscreenchange", onFsChange);
  }, []);

  const resetHideTimer = useCallback(() => {
    setShowControls(true);
    if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    hideTimerRef.current = setTimeout(() => {
      if (isPlaying) setShowControls(false);
    }, 3000);
  }, [isPlaying]);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) video.play();
    else video.pause();
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    setIsMuted(video.muted);
  };

  const toggleFullscreen = () => {
    const el = containerRef.current;
    if (!el) return;
    if (!document.fullscreenElement) el.requestFullscreen();
    else document.exitFullscreen();
  };

  const seekTo = (e: React.MouseEvent<HTMLDivElement>) => {
    const bar = progressBarRef.current;
    const video = videoRef.current;
    if (!bar || !video || !video.duration) return;
    const rect = bar.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    video.currentTime = ratio * video.duration;
  };

  const progress = duration ? (currentTime / duration) * 100 : 0;

  return (
    <div
      ref={containerRef}
      className="relative w-full bg-black aspect-video select-none rounded-lg overflow-hidden group"
      onMouseMove={resetHideTimer}
      onMouseLeave={() => { if (isPlaying) setShowControls(false); }}
    >
      {/* Video element */}
      <video
        ref={videoRef}
        className="w-full h-full object-contain"
        onContextMenu={(e) => e.preventDefault()}
        playsInline
        onClick={togglePlay}
      />

      {/* Buffering spinner */}
      {isBuffering && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/40 pointer-events-none">
          <Loader2 className="w-12 h-12 text-[#C9A84C] animate-spin" />
        </div>
      )}

      {/* Controls overlay */}
      <div
        className={`absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent px-4 pb-3 pt-8 transition-opacity duration-300 ${
          showControls ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        {/* Progress bar */}
        <div
          ref={progressBarRef}
          className="w-full h-1.5 bg-white/20 rounded-full cursor-pointer mb-3 hover:h-2.5 transition-all"
          onClick={seekTo}
        >
          <div
            className="h-full bg-[#C9A84C] rounded-full relative"
            style={{ width: `${progress}%` }}
          >
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-[#C9A84C] rounded-full shadow-lg" />
          </div>
        </div>

        {/* Bottom row */}
        <div className="flex items-center gap-4">
          <button
            onClick={togglePlay}
            className="text-white hover:text-[#C9A84C] transition-colors"
          >
            {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
          </button>

          <button
            onClick={toggleMute}
            className="text-white hover:text-[#C9A84C] transition-colors"
          >
            {isMuted || volume === 0 ? (
              <VolumeX className="w-5 h-5" />
            ) : (
              <Volume2 className="w-5 h-5" />
            )}
          </button>

          <span className="text-white/70 text-xs tabular-nums">
            {formatTime(currentTime)} / {formatTime(duration)}
          </span>

          <div className="flex-1" />

          <button
            onClick={toggleFullscreen}
            className="text-white hover:text-[#C9A84C] transition-colors"
          >
            {isFullscreen ? (
              <Minimize className="w-5 h-5" />
            ) : (
              <Maximize className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
