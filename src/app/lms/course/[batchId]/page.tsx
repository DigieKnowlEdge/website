"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import { Menu, X, ChevronRight, Award, AlertCircle } from "lucide-react";
import VideoPlayer from "@/components/lms/VideoPlayer";
import LessonSidebar from "@/components/lms/LessonSidebar";

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL || "https://lms.digieknowledge.com";

function getCookie(name: string): string {
  if (typeof document === "undefined") return "";
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : "";
}

interface Lesson {
  id: string;
  title: string;
  description?: string;
  lesson_type: "video" | "pdf" | "ppt" | "document" | "assignment" | "quiz";
  duration_minutes?: number;
  text_content?: string;
  completed?: boolean;
  progress?: number;
}

interface Module {
  id: string;
  title: string;
  lessons: Lesson[];
}

interface BatchData {
  course: { id: string; title: string; description?: string };
  batch: { id: string; name: string };
  modules: Module[];
}

export default function CoursePlayerPage() {
  const { batchId } = useParams<{ batchId: string }>();
  const [data, setData] = useState<BatchData | null>(null);
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [certAvailable, setCertAvailable] = useState(false);

  const token = getCookie("access_token");

  const fetchBatch = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/student/batches/${batchId}`, {
        headers: { Authorization: `Bearer ${token}` },
        credentials: "include",
      });
      if (!res.ok) throw new Error(res.status === 403 ? "Access denied" : "Failed to load course");
      const json: BatchData = await res.json();
      setData(json);

      // Auto-select first incomplete lesson
      const firstLesson = json.modules
        .flatMap((m) => m.lessons)
        .find((l) => !l.completed) ?? json.modules[0]?.lessons[0];
      if (firstLesson) setCurrentLesson(firstLesson);

      // Check if all lessons are complete
      const allLessons = json.modules.flatMap((m) => m.lessons);
      if (allLessons.length > 0 && allLessons.every((l) => l.completed)) {
        setCertAvailable(true);
      }
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to load");
    } finally {
      setLoading(false);
    }
  }, [batchId, token]);

  useEffect(() => { fetchBatch(); }, [fetchBatch]);

  const markProgress = useCallback(
    async (lessonId: string, pct: number, completed: boolean) => {
      await fetch(`${API_BASE}/api/student/progress`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ lesson_id: lessonId, progress: pct, completed }),
      });

      // Update local state
      setData((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          modules: prev.modules.map((m) => ({
            ...m,
            lessons: m.lessons.map((l) =>
              l.id === lessonId
                ? { ...l, progress: pct, completed: completed || l.completed }
                : l
            ),
          })),
        };
      });
    },
    [token]
  );

  const onLessonComplete = useCallback(async () => {
    if (!currentLesson) return;
    await markProgress(currentLesson.id, 100, true);

    // Auto-advance to next lesson
    if (!data) return;
    const allLessons = data.modules.flatMap((m) => m.lessons);
    const idx = allLessons.findIndex((l) => l.id === currentLesson.id);
    if (idx >= 0 && idx < allLessons.length - 1) {
      setCurrentLesson(allLessons[idx + 1]);
    } else {
      setCertAvailable(true);
    }
  }, [currentLesson, data, markProgress]);

  const streamUrl = currentLesson
    ? `${API_BASE}/api/files/stream/${currentLesson.id}?auth=${encodeURIComponent(token)}`
    : "";

  // --- Render ---
  if (loading) {
    return (
      <div className="min-h-screen bg-[#080808] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#C9A84C] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-[#080808] flex items-center justify-center text-center px-4">
        <div>
          <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <p className="text-white/70">{error || "Course not found"}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#080808] flex flex-col">
      {/* Top bar */}
      <header className="flex items-center gap-4 px-4 py-3 bg-[#0e0e0e] border-b border-white/5 shrink-0">
        <button
          className="lg:hidden text-white/60 hover:text-white"
          onClick={() => setSidebarOpen(true)}
        >
          <Menu className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-2 text-sm text-white/50">
          <span>{data.course.title}</span>
          <ChevronRight className="w-3 h-3" />
          <span className="text-white/80">{data.batch.name}</span>
        </div>
        {certAvailable && (
          <a
            href={`${API_BASE}/api/student/batches/${batchId}/certificate?auth=${encodeURIComponent(token)}`}
            target="_blank"
            rel="noreferrer"
            className="ml-auto flex items-center gap-1.5 text-xs bg-[#C9A84C]/10 text-[#C9A84C] border border-[#C9A84C]/30 rounded-full px-3 py-1 hover:bg-[#C9A84C]/20 transition-colors"
          >
            <Award className="w-3.5 h-3.5" />
            Download Certificate
          </a>
        )}
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar — desktop always visible, mobile slide-in */}
        <aside
          className={`fixed lg:static inset-0 z-40 lg:z-auto lg:flex lg:w-80 lg:shrink-0 ${
            sidebarOpen ? "flex" : "hidden"
          }`}
        >
          <div className="flex-1 lg:max-w-80 h-full overflow-hidden flex flex-col">
            <div className="lg:hidden flex items-center justify-between px-4 py-3 bg-[#0e0e0e] border-b border-white/5">
              <span className="text-white/60 text-sm">Course Content</span>
              <button onClick={() => setSidebarOpen(false)} className="text-white/60 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <LessonSidebar
              modules={data.modules}
              currentLessonId={currentLesson?.id ?? ""}
              onSelectLesson={(l) => {
                setCurrentLesson(l);
                setSidebarOpen(false);
              }}
            />
          </div>
          {/* Mobile backdrop */}
          <div
            className="flex-1 lg:hidden bg-black/60"
            onClick={() => setSidebarOpen(false)}
          />
        </aside>

        {/* Main content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-8">
          {currentLesson ? (
            <div className="max-w-4xl mx-auto">
              {/* Lesson title */}
              <h1 className="text-white text-xl font-semibold mb-4">
                {currentLesson.title}
              </h1>

              {/* Video */}
              {currentLesson.lesson_type === "video" && (
                <VideoPlayer
                  src={streamUrl}
                  lessonId={currentLesson.id}
                  onProgress={(pct) => markProgress(currentLesson.id, pct, false)}
                  onComplete={onLessonComplete}
                />
              )}

              {/* PDF / document */}
              {(currentLesson.lesson_type === "pdf" ||
                currentLesson.lesson_type === "ppt" ||
                currentLesson.lesson_type === "document") && (
                <div className="w-full aspect-[4/3] rounded-xl overflow-hidden bg-[#111111] border border-white/10">
                  <iframe
                    src={streamUrl}
                    className="w-full h-full"
                    title={currentLesson.title}
                    onLoad={() => markProgress(currentLesson.id, 100, true)}
                  />
                </div>
              )}

              {/* Assignment / quiz */}
              {(currentLesson.lesson_type === "assignment" ||
                currentLesson.lesson_type === "quiz") && (
                <div className="bg-[#111111] border border-white/10 rounded-xl p-6">
                  <p className="text-white/70 leading-relaxed whitespace-pre-wrap">
                    {currentLesson.text_content || "No instructions provided."}
                  </p>
                  <button
                    className="mt-6 px-5 py-2 rounded-lg bg-[#C9A84C] text-black font-semibold text-sm hover:bg-[#d4b05a] transition-colors"
                    onClick={() => markProgress(currentLesson.id, 100, true)}
                  >
                    Mark as Complete
                  </button>
                </div>
              )}

              {/* Description */}
              {currentLesson.description && (
                <p className="mt-4 text-white/50 text-sm leading-relaxed">
                  {currentLesson.description}
                </p>
              )}
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-white/30">
              Select a lesson to begin
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
