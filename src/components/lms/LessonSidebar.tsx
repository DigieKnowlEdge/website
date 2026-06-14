"use client";

import { useState } from "react";
import { Play, FileText, BookOpen, CheckCircle, ChevronDown, ChevronRight, ClipboardList } from "lucide-react";

interface Lesson {
  id: string;
  title: string;
  lesson_type: "video" | "pdf" | "ppt" | "document" | "assignment" | "quiz";
  duration_minutes?: number;
  completed?: boolean;
  progress?: number;
}

interface Module {
  id: string;
  title: string;
  lessons: Lesson[];
}

interface LessonSidebarProps {
  modules: Module[];
  currentLessonId: string;
  onSelectLesson: (lesson: Lesson) => void;
}

const lessonIcon = (type: Lesson["lesson_type"]) => {
  switch (type) {
    case "video": return <Play className="w-3.5 h-3.5" />;
    case "pdf":
    case "ppt":
    case "document": return <FileText className="w-3.5 h-3.5" />;
    case "assignment": return <ClipboardList className="w-3.5 h-3.5" />;
    case "quiz": return <BookOpen className="w-3.5 h-3.5" />;
  }
};

export default function LessonSidebar({
  modules,
  currentLessonId,
  onSelectLesson,
}: LessonSidebarProps) {
  const [openModules, setOpenModules] = useState<Set<string>>(() => {
    const s = new Set<string>();
    for (const m of modules) {
      if (m.lessons.some((l) => l.id === currentLessonId)) s.add(m.id);
    }
    // Open first module by default if none is current
    if (s.size === 0 && modules[0]) s.add(modules[0].id);
    return s;
  });

  const toggle = (id: string) => {
    setOpenModules((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div className="h-full overflow-y-auto bg-[#0e0e0e] border-r border-white/5">
      <div className="p-4 border-b border-white/5">
        <p className="text-xs text-white/40 uppercase tracking-widest font-medium">Course Content</p>
      </div>

      {modules.map((module, mi) => {
        const isOpen = openModules.has(module.id);
        const completed = module.lessons.filter((l) => l.completed).length;
        const total = module.lessons.length;

        return (
          <div key={module.id} className="border-b border-white/5">
            {/* Module header */}
            <button
              onClick={() => toggle(module.id)}
              className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-white/5 transition-colors"
            >
              <div className="flex-1 min-w-0">
                <p className="text-white/50 text-[10px] uppercase tracking-wider mb-0.5">
                  Module {mi + 1}
                </p>
                <p className="text-white/90 text-sm font-medium truncate">{module.title}</p>
                <p className="text-white/30 text-xs mt-0.5">{completed}/{total} completed</p>
              </div>
              {isOpen ? (
                <ChevronDown className="w-4 h-4 text-white/40 shrink-0 ml-2" />
              ) : (
                <ChevronRight className="w-4 h-4 text-white/40 shrink-0 ml-2" />
              )}
            </button>

            {/* Module progress bar */}
            <div className="h-0.5 bg-white/5 mx-4">
              <div
                className="h-full bg-[#C9A84C]/50 transition-all duration-500"
                style={{ width: total ? `${(completed / total) * 100}%` : "0%" }}
              />
            </div>

            {/* Lessons */}
            {isOpen && (
              <div className="pb-1">
                {module.lessons.map((lesson) => {
                  const isCurrent = lesson.id === currentLessonId;
                  return (
                    <button
                      key={lesson.id}
                      onClick={() => onSelectLesson(lesson)}
                      className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors ${
                        isCurrent
                          ? "bg-[#C9A84C]/10 border-l-2 border-[#C9A84C]"
                          : "border-l-2 border-transparent hover:bg-white/5"
                      }`}
                    >
                      <span
                        className={`shrink-0 ${
                          isCurrent ? "text-[#C9A84C]" : "text-white/40"
                        }`}
                      >
                        {lessonIcon(lesson.lesson_type)}
                      </span>
                      <span
                        className={`flex-1 text-sm truncate ${
                          isCurrent ? "text-[#C9A84C] font-medium" : "text-white/70"
                        }`}
                      >
                        {lesson.title}
                      </span>
                      {lesson.completed && (
                        <CheckCircle className="w-3.5 h-3.5 text-green-500 shrink-0" />
                      )}
                      {lesson.duration_minutes ? (
                        <span className="text-white/30 text-xs shrink-0">
                          {lesson.duration_minutes}m
                        </span>
                      ) : null}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
