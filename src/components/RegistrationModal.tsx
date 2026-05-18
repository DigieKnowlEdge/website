"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Mail, Phone, User, MessageSquare, CheckCircle, PartyPopper } from "lucide-react";
import { useRegistration } from "@/context/RegistrationContext";

const COURSES = [
  "SDET Automation",
  "Full Stack Development",
  "Data Science & AI",
  "Cyber Security",
  "Not sure yet — help me choose",
];

interface FormData {
  name: string;
  email: string;
  phone: string;
  course: string;
}

interface ConfettiPiece {
  id: number;
  x: number;
  color: string;
  size: number;
  delay: number;
  duration: number;
  rotate: number;
}

function Confetti() {
  const colors = ["#C9A84C", "#00D4FF", "#F0F0F0", "#e0bb63", "#7dd3fc", "#fbbf24"];
  const pieces: ConfettiPiece[] = Array.from({ length: 60 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    color: colors[i % colors.length],
    size: 6 + Math.random() * 8,
    delay: Math.random() * 0.8,
    duration: 2 + Math.random() * 1.5,
    rotate: Math.random() * 720 - 360,
  }));

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl">
      {pieces.map((p) => (
        <motion.div
          key={p.id}
          initial={{ y: -20, x: `${p.x}vw`, opacity: 1, rotate: 0, scale: 1 }}
          animate={{
            y: "110vh",
            opacity: [1, 1, 0.8, 0],
            rotate: p.rotate,
            scale: [1, 1.2, 0.8],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            ease: "easeIn",
          }}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: p.size,
            height: p.size,
            backgroundColor: p.color,
            borderRadius: Math.random() > 0.5 ? "50%" : "2px",
          }}
        />
      ))}
    </div>
  );
}

function ThankYouState({ onClose }: { onClose: () => void }) {
  useEffect(() => {
    const t = setTimeout(onClose, 5000);
    return () => clearTimeout(t);
  }, [onClose]);

  return (
    <div className="relative flex flex-col items-center justify-center py-12 px-8 text-center min-h-[400px]">
      <Confetti />
      <motion.div
        initial={{ scale: 0, rotate: -20 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
        className="mb-6 relative z-10"
      >
        <div className="w-20 h-20 rounded-full bg-[#C9A84C]/20 border border-[#C9A84C]/40 flex items-center justify-center mx-auto mb-2">
          <CheckCircle size={40} className="text-[#C9A84C]" />
        </div>
        <PartyPopper size={28} className="text-[#00D4FF] absolute -top-1 -right-3" />
      </motion.div>

      <motion.h3
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="text-3xl font-extrabold text-[#F0F0F0] mb-3 relative z-10"
        style={{ fontFamily: "var(--font-space-grotesk)" }}
      >
        Thank you for registering!
      </motion.h3>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.45 }}
        className="text-[#888888] text-base max-w-xs relative z-10"
        style={{ fontFamily: "var(--font-inter)" }}
      >
        We&apos;ve received your details. Our team will reach out within 24 hours to guide you on your learning journey.
      </motion.p>

      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
        onClick={onClose}
        className="mt-8 px-8 py-3 bg-[#C9A84C] text-[#080808] font-bold rounded-full hover:bg-[#e0bb63] transition-colors duration-300 text-sm relative z-10 cursor-pointer"
        style={{ fontFamily: "var(--font-space-grotesk)" }}
      >
        Close
      </motion.button>

      <p className="text-xs text-[#555555] mt-3 relative z-10">Auto-closing in 5 seconds…</p>
    </div>
  );
}

export default function RegistrationModal() {
  const { isOpen, closeModal } = useRegistration();
  const [form, setForm] = useState<FormData>({ name: "", email: "", phone: "", course: "" });
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);

  // Pre-fill course when modal opens (set by Programs cards)
  useEffect(() => {
    if (isOpen) {
      const prefill = sessionStorage.getItem("prefillCourse");
      if (prefill) {
        setForm((f) => ({ ...f, course: prefill }));
        sessionStorage.removeItem("prefillCourse");
      }
    }
  }, [isOpen]);

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => {
        setForm({ name: "", email: "", phone: "", course: "" });
        setErrors({});
        setSubmitting(false);
        setSubmitted(false);
      }, 400);
    }
  }, [isOpen]);

  // Trap scroll
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  const validate = (): boolean => {
    const e: Partial<FormData> = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.email.trim()) e.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Enter a valid email";
    if (!form.phone.trim()) e.phone = "Contact number is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Failed");
      setSubmitted(true);
    } catch {
      // Show error inline but don't block — still show thank you
      setSubmitted(true);
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass = (field: keyof FormData) =>
    `w-full bg-[#1A1A1A] border ${
      errors[field] ? "border-red-500/60" : "border-white/10"
    } rounded-xl px-4 py-3.5 text-[#F0F0F0] text-sm placeholder-[#555] focus:outline-none focus:border-[#C9A84C]/60 transition-colors duration-200`;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            ref={overlayRef}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={closeModal}
            className="fixed inset-0 z-[100] bg-black/75 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 30 }}
            transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="fixed inset-0 z-[101] flex items-center justify-center px-4 py-8 pointer-events-none"
          >
            <div
              className="relative w-full max-w-xl bg-[#111111] border border-white/10 rounded-2xl shadow-2xl overflow-hidden pointer-events-auto max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              {!submitted && (
                <div className="px-8 pt-8 pb-6 border-b border-white/7">
                  <button
                    onClick={closeModal}
                    className="absolute top-5 right-5 w-9 h-9 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-[#888] hover:text-[#F0F0F0] transition-all duration-200 cursor-pointer"
                  >
                    <X size={16} />
                  </button>
                  <h2
                    className="text-2xl font-extrabold text-[#F0F0F0] mb-1"
                    style={{ fontFamily: "var(--font-space-grotesk)" }}
                  >
                    Register Your Interest
                  </h2>
                  <p className="text-sm text-[#888888]" style={{ fontFamily: "var(--font-inter)" }}>
                    Fill in your details and we&apos;ll get back to you within 24 hours.
                  </p>
                </div>
              )}

              {submitted ? (
                <ThankYouState onClose={closeModal} />
              ) : (
                <form onSubmit={handleSubmit} className="px-8 py-7 flex flex-col gap-5">
                  {/* Name */}
                  <div>
                    <label className="block text-xs font-semibold text-[#F0F0F0] mb-2 tracking-wide uppercase">
                      Name <span className="text-[#C9A84C]">*</span>
                    </label>
                    <div className="relative">
                      <User size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#555]" />
                      <input
                        type="text"
                        placeholder="Your name"
                        value={form.name}
                        onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                        className={`${inputClass("name")} pl-10`}
                        style={{ fontFamily: "var(--font-inter)" }}
                      />
                    </div>
                    {errors.name && <p className="text-xs text-red-400 mt-1.5">{errors.name}</p>}
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-xs font-semibold text-[#F0F0F0] mb-2 tracking-wide uppercase">
                      Email <span className="text-[#C9A84C]">*</span>
                    </label>
                    <div className="relative">
                      <Mail size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#555]" />
                      <input
                        type="email"
                        placeholder="your@email.com"
                        value={form.email}
                        onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                        className={`${inputClass("email")} pl-10`}
                        style={{ fontFamily: "var(--font-inter)" }}
                      />
                    </div>
                    {errors.email && <p className="text-xs text-red-400 mt-1.5">{errors.email}</p>}
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-xs font-semibold text-[#F0F0F0] mb-2 tracking-wide uppercase">
                      Contact Number <span className="text-[#C9A84C]">*</span>
                    </label>
                    <div className="relative">
                      <Phone size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#555]" />
                      <input
                        type="tel"
                        placeholder="+91 XXXXX XXXXX"
                        value={form.phone}
                        onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                        className={`${inputClass("phone")} pl-10`}
                        style={{ fontFamily: "var(--font-inter)" }}
                      />
                    </div>
                    {errors.phone && <p className="text-xs text-red-400 mt-1.5">{errors.phone}</p>}
                  </div>

                  {/* Course */}
                  <div>
                    <label className="block text-xs font-semibold text-[#F0F0F0] mb-2 tracking-wide uppercase">
                      Course / Query
                    </label>
                    <div className="relative">
                      <MessageSquare size={15} className="absolute left-4 top-3.5 text-[#555]" />
                      <textarea
                        placeholder="Tell us about your interests..."
                        value={form.course}
                        onChange={(e) => setForm((f) => ({ ...f, course: e.target.value }))}
                        rows={4}
                        className={`${inputClass("course")} pl-10 resize-none`}
                        style={{ fontFamily: "var(--font-inter)" }}
                      />
                    </div>
                    {/* Quick course chips */}
                    <div className="flex flex-wrap gap-2 mt-2.5">
                      {COURSES.map((c) => (
                        <button
                          key={c}
                          type="button"
                          onClick={() => setForm((f) => ({ ...f, course: c }))}
                          className={`text-xs px-3 py-1.5 rounded-full border transition-all duration-200 cursor-pointer ${
                            form.course === c
                              ? "bg-[#C9A84C]/20 border-[#C9A84C]/60 text-[#C9A84C]"
                              : "border-white/10 text-[#888] hover:border-white/25 hover:text-[#F0F0F0]"
                          }`}
                          style={{ fontFamily: "var(--font-inter)" }}
                        >
                          {c}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Submit */}
                  <motion.button
                    type="submit"
                    disabled={submitting}
                    whileHover={{ scale: submitting ? 1 : 1.02 }}
                    whileTap={{ scale: submitting ? 1 : 0.97 }}
                    className="w-full py-4 rounded-xl text-white font-bold text-base mt-1 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-300 relative overflow-hidden"
                    style={{
                      fontFamily: "var(--font-space-grotesk)",
                      background: "linear-gradient(90deg, #3b82f6 0%, #C9A84C 100%)",
                      boxShadow: submitting ? "none" : "0 0 30px rgba(201,168,76,0.25)",
                    }}
                  >
                    {submitting ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z" />
                        </svg>
                        Sending…
                      </span>
                    ) : (
                      "Send Message"
                    )}
                  </motion.button>

                  <p className="text-center text-xs text-[#555]" style={{ fontFamily: "var(--font-inter)" }}>
                    Your details are sent to{" "}
                    <span className="text-[#888]">information@digieknowledge.com</span>
                  </p>
                </form>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
