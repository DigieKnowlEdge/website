"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ChevronDown, Sparkles, Play } from "lucide-react";

// CSS-only floating particles configuration
const PARTICLES = Array.from({ length: 25 }, (_, i) => ({
  id: i,
  left: `${(i * 37 + 11) % 100}%`,
  width: `${2 + (i % 3)}px`,
  height: `${2 + (i % 3)}px`,
  duration: `${12 + (i % 15)}s`,
  delay: `${(i * 1.3) % 12}s`,
  opacity: 0.15 + (i % 5) * 0.07,
}));

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check, { passive: true });
    return () => window.removeEventListener("resize", check);
  }, []);

  const { scrollY } = useScroll();
  // Disable parallax on mobile to avoid iOS jank
  const bgY = useTransform(scrollY, [0, 800], isMobile ? [0, 0] : [0, 120]);

  const handleScroll = (href: string) => {
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      ref={containerRef}
      className="relative min-h-[100svh] flex items-center justify-center overflow-hidden"
      id="hero"
    >
      {/* Parallax Background */}
      <motion.div
        style={{ y: bgY }}
        className="absolute inset-0 w-full h-full pointer-events-none"
      >
        {/* Base gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#080808] via-[#0d0d0d] to-[#080808]" />

        {/* Radial glow — gold */}
        <div
          className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none"
          style={{
            width: "70vw",
            height: "70vw",
            maxWidth: "900px",
            maxHeight: "900px",
            background:
              "radial-gradient(circle, rgba(201,168,76,0.08) 0%, transparent 65%)",
          }}
        />

        {/* Radial glow — cyan */}
        <div
          className="absolute bottom-0 right-0 rounded-full pointer-events-none"
          style={{
            width: "50vw",
            height: "50vw",
            maxWidth: "700px",
            maxHeight: "700px",
            background:
              "radial-gradient(circle, rgba(0,212,255,0.05) 0%, transparent 65%)",
          }}
        />

        {/* Grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)
            `,
            backgroundSize: "80px 80px",
          }}
        />

        {/* Floating particles (CSS-only) */}
        {PARTICLES.map((p) => (
          <div
            key={p.id}
            className="absolute rounded-full particle"
            style={{
              left: p.left,
              bottom: "-10px",
              width: p.width,
              height: p.height,
              background: p.id % 3 === 0 ? "#C9A84C" : p.id % 3 === 1 ? "#00D4FF" : "#F0F0F0",
              opacity: p.opacity,
              animationDuration: p.duration,
              animationDelay: p.delay,
            }}
          />
        ))}
      </motion.div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 text-center pt-20">
        {/* AI Badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#C9A84C]/30 bg-[#C9A84C]/10 mb-8 badge-float"
        >
          <Sparkles size={14} className="text-[#C9A84C]" />
          <span
            className="text-xs text-[#C9A84C] font-semibold tracking-[0.15em] uppercase"
            style={{ fontFamily: "var(--font-space-grotesk)" }}
          >
            AI-Powered Platform
          </span>
        </motion.div>

        {/* Main Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="font-extrabold text-[#F0F0F0] leading-[1.05] tracking-[-0.02em] mb-6"
          style={{
            fontFamily: "var(--font-space-grotesk)",
            fontSize: "clamp(2.8rem, 7vw, 6rem)",
          }}
        >
          Transform Your Career
          <br />
          <span className="text-transparent bg-clip-text" style={{
            backgroundImage: "linear-gradient(135deg, #C9A84C 0%, #e0bb63 40%, #00D4FF 100%)"
          }}>
            With AI-Powered
          </span>
          <br />
          Learning
        </motion.h1>

        {/* Sub-headline */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="text-[#888888] max-w-2xl mx-auto mb-10"
          style={{
            fontSize: "clamp(1rem, 2vw, 1.2rem)",
            fontFamily: "var(--font-inter)",
            lineHeight: "1.7",
          }}
        >
          Join 10,000+ professionals mastering SDET, Full Stack, Data Science &amp; Cyber Security with industry-led mentors and AI-driven learning paths.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.65 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
        >
          <button
            onClick={() => handleScroll("#programs")}
            className="group relative px-8 py-4 bg-[#C9A84C] text-[#080808] font-bold rounded-full text-base transition-all duration-300 hover:bg-[#e0bb63] hover:shadow-[0_0_40px_rgba(201,168,76,0.4)] glow-pulse min-h-[44px] cursor-pointer w-full sm:w-auto"
            style={{ fontFamily: "var(--font-space-grotesk)" }}
          >
            Explore Programs
          </button>
          <button
            onClick={() => handleScroll("#how-it-works")}
            className="group flex items-center gap-3 px-8 py-4 border border-white/20 text-[#F0F0F0] font-semibold rounded-full text-base hover:border-white/40 hover:bg-white/5 transition-all duration-300 min-h-[44px] cursor-pointer w-full sm:w-auto justify-center"
            style={{ fontFamily: "var(--font-space-grotesk)" }}
          >
            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors duration-300">
              <Play size={12} className="text-[#F0F0F0] translate-x-0.5" />
            </div>
            Watch Demo
          </button>
        </motion.div>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.8 }}
          className="flex flex-wrap items-center justify-center gap-8 text-center"
        >
          {[
            { value: "10K+", label: "Students" },
            { value: "94%", label: "Placement Rate" },
            { value: "4.9★", label: "Average Rating" },
            { value: "500+", label: "Hiring Partners" },
          ].map((stat) => (
            <div key={stat.label} className="flex flex-col items-center">
              <span
                className="text-2xl font-bold text-[#C9A84C]"
                style={{ fontFamily: "var(--font-space-grotesk)" }}
              >
                {stat.value}
              </span>
              <span className="text-xs text-[#888888] uppercase tracking-[0.1em] mt-0.5">
                {stat.label}
              </span>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 animate-bounce-slow">
        <button
          onClick={() => handleScroll("#marquee")}
          className="flex flex-col items-center gap-2 text-[#888888] hover:text-[#C9A84C] transition-colors duration-300 cursor-pointer"
          aria-label="Scroll down"
        >
          <span className="text-xs tracking-[0.15em] uppercase font-medium">
            Scroll
          </span>
          <ChevronDown size={18} />
        </button>
      </div>
    </section>
  );
}
