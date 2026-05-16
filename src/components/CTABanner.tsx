"use client";

import { motion } from "framer-motion";
import { ArrowRight, Zap } from "lucide-react";
import { ScrollReveal } from "./ScrollReveal";

export default function CTABanner() {
  const handleEnroll = () => {
    const el = document.querySelector("#programs");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative py-24 px-6 lg:px-8 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-[#080808]">
        {/* Gold glow left */}
        <div
          className="absolute -left-32 top-1/2 -translate-y-1/2 rounded-full pointer-events-none"
          style={{
            width: "600px",
            height: "600px",
            background: "radial-gradient(circle, rgba(201,168,76,0.15) 0%, transparent 65%)",
          }}
        />
        {/* Cyan glow right */}
        <div
          className="absolute -right-32 top-1/2 -translate-y-1/2 rounded-full pointer-events-none"
          style={{
            width: "600px",
            height: "600px",
            background: "radial-gradient(circle, rgba(0,212,255,0.1) 0%, transparent 65%)",
          }}
        />
        {/* Grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)
            `,
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto text-center">
        <ScrollReveal>
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#C9A84C]/30 bg-[#C9A84C]/10 mb-8">
            <Zap size={13} className="text-[#C9A84C]" />
            <span
              className="text-xs text-[#C9A84C] font-semibold tracking-[0.15em] uppercase"
              style={{ fontFamily: "var(--font-space-grotesk)" }}
            >
              Limited Seats Available
            </span>
          </div>

          {/* Headline */}
          <h2
            className="font-extrabold text-[#F0F0F0] leading-tight tracking-[-0.02em] mb-4"
            style={{
              fontFamily: "var(--font-space-grotesk)",
              fontSize: "clamp(2.2rem, 6vw, 4.5rem)",
            }}
          >
            Ready to Start Your
            <br />
            <span className="text-transparent bg-clip-text" style={{
              backgroundImage: "linear-gradient(135deg, #C9A84C 0%, #e0bb63 50%, #00D4FF 100%)"
            }}>
              Journey?
            </span>
          </h2>

          {/* Sub */}
          <p
            className="text-[#888888] mb-10 max-w-lg mx-auto"
            style={{
              fontFamily: "var(--font-inter)",
              fontSize: "clamp(0.95rem, 1.8vw, 1.15rem)",
              lineHeight: "1.7",
            }}
          >
            Enroll today and join the next cohort starting soon. Seats fill up fast — don&apos;t miss your window.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.button
              onClick={handleEnroll}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="group inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#C9A84C] text-[#080808] font-bold rounded-full text-base transition-all duration-300 hover:bg-[#e0bb63] hover:shadow-[0_0_50px_rgba(201,168,76,0.4)] min-h-[44px] cursor-pointer"
              style={{ fontFamily: "var(--font-space-grotesk)" }}
            >
              Enroll Now — It&apos;s Free to Apply
              <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              className="inline-flex items-center justify-center gap-2 px-8 py-4 border border-white/15 text-[#F0F0F0] font-semibold rounded-full text-base hover:border-white/30 hover:bg-white/5 transition-all duration-300 min-h-[44px] cursor-pointer"
              style={{ fontFamily: "var(--font-space-grotesk)" }}
            >
              Talk to Admissions
            </motion.button>
          </div>

          {/* Trust notes */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-[#888888]">
            {["No credit card required", "Free career consultation", "Money-back guarantee"].map(
              (note) => (
                <span key={note} className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C9A84C] inline-block" />
                  {note}
                </span>
              )
            )}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
