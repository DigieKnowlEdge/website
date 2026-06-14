"use client";

import { useState } from "react";
import ChunkedVideoUpload from "@/components/lms/ChunkedVideoUpload";
import { CheckCircle, Film } from "lucide-react";

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL || "https://lms.digieknowledge.com";

function getCookie(name: string): string {
  if (typeof document === "undefined") return "";
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : "";
}

interface FileDoc {
  id: string;
  storage_path: string;
  content_type: string;
  original_filename?: string;
  size?: number;
}

interface LessonForm {
  title: string;
  description: string;
  module_id: string;
  order: string;
  duration_minutes: string;
}

export default function AdminUploadPage() {
  const token = getCookie("access_token");
  const [uploadedFile, setUploadedFile] = useState<FileDoc | null>(null);
  const [form, setForm] = useState<LessonForm>({
    title: "",
    description: "",
    module_id: "",
    order: "1",
    duration_minutes: "0",
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState("");

  const handleUploadComplete = (doc: FileDoc) => {
    setUploadedFile(doc);
    if (doc.original_filename) {
      const name = doc.original_filename.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " ");
      setForm((f) => ({ ...f, title: name }));
    }
  };

  const handleSave = async () => {
    if (!uploadedFile || !form.module_id || !form.title) return;
    setSaving(true);
    setSaveError("");
    try {
      const res = await fetch(`${API_BASE}/api/admin/modules/${form.module_id}/lessons`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          title: form.title,
          description: form.description,
          lesson_type: "video",
          storage_path: uploadedFile.storage_path,
          content_type: uploadedFile.content_type,
          order: parseInt(form.order) || 1,
          duration_minutes: parseInt(form.duration_minutes) || 0,
        }),
      });
      if (!res.ok) throw new Error(await res.text());
      setSaved(true);
    } catch (e: unknown) {
      setSaveError(e instanceof Error ? e.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#080808] text-white p-6 lg:p-12">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <Film className="w-6 h-6 text-[#C9A84C]" />
          <h1 className="text-2xl font-semibold" style={{ fontFamily: "var(--font-space-grotesk)" }}>
            Upload Video Lesson
          </h1>
        </div>

        {/* Step 1 — Upload */}
        <section className="mb-8">
          <h2 className="text-white/50 text-xs uppercase tracking-widest mb-4">
            Step 1 — Upload Video
          </h2>
          <ChunkedVideoUpload
            apiBase={API_BASE}
            authToken={token}
            onUploadComplete={handleUploadComplete}
          />
        </section>

        {/* Step 2 — Lesson details (shown after upload) */}
        {uploadedFile && !saved && (
          <section>
            <h2 className="text-white/50 text-xs uppercase tracking-widest mb-4">
              Step 2 — Lesson Details
            </h2>
            <div className="bg-[#111111] border border-white/10 rounded-xl p-6 space-y-4">
              <div>
                <label className="text-white/50 text-xs uppercase tracking-wider block mb-1.5">
                  Lesson Title *
                </label>
                <input
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full bg-[#1a1a1a] border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#C9A84C]/50"
                  placeholder="e.g. Introduction to React Hooks"
                />
              </div>

              <div>
                <label className="text-white/50 text-xs uppercase tracking-wider block mb-1.5">
                  Description
                </label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  rows={3}
                  className="w-full bg-[#1a1a1a] border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#C9A84C]/50 resize-none"
                  placeholder="Optional lesson description…"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-white/50 text-xs uppercase tracking-wider block mb-1.5">
                    Module ID *
                  </label>
                  <input
                    value={form.module_id}
                    onChange={(e) => setForm({ ...form, module_id: e.target.value })}
                    className="w-full bg-[#1a1a1a] border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#C9A84C]/50 font-mono"
                    placeholder="paste module UUID"
                  />
                </div>
                <div>
                  <label className="text-white/50 text-xs uppercase tracking-wider block mb-1.5">
                    Order
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={form.order}
                    onChange={(e) => setForm({ ...form, order: e.target.value })}
                    className="w-full bg-[#1a1a1a] border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#C9A84C]/50"
                  />
                </div>
              </div>

              <div>
                <label className="text-white/50 text-xs uppercase tracking-wider block mb-1.5">
                  Duration (minutes)
                </label>
                <input
                  type="number"
                  min={0}
                  value={form.duration_minutes}
                  onChange={(e) => setForm({ ...form, duration_minutes: e.target.value })}
                  className="w-full bg-[#1a1a1a] border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#C9A84C]/50"
                />
              </div>

              {saveError && (
                <p className="text-red-400 text-sm">{saveError}</p>
              )}

              <button
                onClick={handleSave}
                disabled={saving || !form.module_id || !form.title}
                className="w-full py-3 rounded-lg bg-[#C9A84C] text-black font-semibold hover:bg-[#d4b05a] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {saving ? "Saving…" : "Save Lesson"}
              </button>
            </div>
          </section>
        )}

        {saved && (
          <div className="flex items-center gap-3 text-green-400 bg-green-400/10 border border-green-400/20 rounded-xl p-4">
            <CheckCircle className="w-5 h-5 shrink-0" />
            <div>
              <p className="font-medium text-sm">Lesson saved successfully!</p>
              <button
                onClick={() => { setUploadedFile(null); setSaved(false); setForm({ title: "", description: "", module_id: "", order: "1", duration_minutes: "0" }); }}
                className="text-green-400/70 text-xs hover:text-green-400 mt-0.5"
              >
                Upload another video →
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
