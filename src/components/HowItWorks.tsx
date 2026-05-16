"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { ClipboardList, GraduationCap, Rocket } from "lucide-react";
import { ScrollReveal } from "./ScrollReveal";

const steps = [
  {
    number: "01",
    icon: ClipboardList,
    title: "Apply",
    description:
      "Fill out a quick application. Our admissions team reviews your profile and schedules a free career discovery call to match you with the right program.",
  },
  {
    number: "02",
    icon: GraduationCap,
    title: "Learn",
    description:
      "Dive into live classes, AI-personalized practice, hands-on projects, and weekly mentor sessions. Learn at your own pace, backed by a structured roadmap.",
  },
  {
    number: "03",
    icon: Rocket,
    title: "Get Placed",
    description:
      "Our placement team works with you on resume polishing, mock interviews, and direct referrals to 500+ hiring companies. Most students get placed within 90 days.",
  },
];

export default function HowItWorks() {
  const lineRef = useRef<HTMLDivElement>(null);
  const isLineVisible = useInView(lineRef, { once: true, margin: "-80px 0px" });

  return (
    <section id="how-it-works" className="py-24 lg:py-32 px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <ScrollReveal className="text-center mb-20">
          <span
            className="text-xs font-semibold tracking-[0.15em] uppercase text-[#C9A84C] mb-4 block"
            style={{ fontFamily: "var(--font-space-grotesk)" }}
          >
            How It Works
          </span>
          <h2
            className="font-extrabold text-[#F0F0F0] leading-tight tracking-[-0.02em]"
            style={{
              fontFamily: "var(--font-space-grotesk)",
              fontSize: "clamp(2rem, 5vw, 3.5rem)",
            }}
          >
            Three Steps to
            <span className="text-[#C9A84C]"> Your New Career</span>
          </h2>
          <p
            className="mt-4 text-[#888888] max-w-xl mx-auto"
            style={{ fontFamily: "var(--font-inter)", fontSize: "clamp(0.95rem, 1.5vw, 1.05rem)" }}
          >
            A streamlined process designed to get you from where you are to where you want to be.
          </p>
        </ScrollReveal>

        {/* Desktop: Horizontal timeline */}
        <div className="hidden lg:block">
          {/* Connecting animated line */}
          <div ref={lineRef} className="relative mb-12">
            <div
              className="absolute top-1/2 left-[calc(16.67%+24px)] right-[calc(16.67%+24px)] h-px -translate-y-1/2"
              style={{ background: "rgba(255,255,255,0.07)" }}
            />
            {isLineVisible && (
              <motion.div
                className="absolute top-1/2 left-[calc(16.67%+24px)] h-px -translate-y-1/2"
                style={{ background: "linear-gradient(to right, #C9A84C, #00D4FF)" }}
                initial={{ width: 0 }}
                animate={{ width: "calc(66.66% - 48px)" }}
                transition={{ duration: 1.4, delay: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
              />
            )}
          </div>

          <div className="grid grid-cols-3 gap-8">
            {steps.map((step, i) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={step.number}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px 0px" }}
                  transition={{ duration: 0.7, delay: i * 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
                  className="relative text-center"
                >
                  {/* Number circle */}
                  <div className="flex justify-center mb-6">
                    <div
                      className="relative w-16 h-16 rounded-full border-2 flex items-center justify-center"
                      style={{ borderColor: "#C9A84C" }}
                    >
                      <Icon size={22} className="text-[#C9A84C]" />
                      {/* Step number — ghost overlaid */}
                      <span
                        className="absolute -top-4 -right-3 text-5xl font-extrabold leading-none select-none pointer-events-none"
                        style={{
                          fontFamily: "var(--font-space-grotesk)",
                          color: "rgba(201,168,76,0.12)",
                          fontSize: "4rem",
                        }}
                      >
                        {step.number}
                      </span>
                    </div>
                  </div>

                  <h3
                    className="text-2xl font-bold text-[#F0F0F0] mb-3"
                    style={{ fontFamily: "var(--font-space-grotesk)" }}
                  >
                    {step.title}
                  </h3>
                  <p
                    className="text-[#888888] leading-relaxed text-sm max-w-xs mx-auto"
                    style={{ fontFamily: "var(--font-inter)" }}
                  >
                    {step.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Mobile: Vertical timeline */}
        <div className="lg:hidden relative">
          {/* Vertical line */}
          <div
            className="absolute left-8 top-0 bottom-0 w-px"
            style={{ background: "rgba(255,255,255,0.07)" }}
          />

          <div className="flex flex-col gap-12">
            {steps.map((step, i) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={step.number}
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-40px 0px" }}
                  transition={{ duration: 0.6, delay: i * 0.15 }}
                  className="relative pl-20"
                >
                  {/* Circle on the line */}
                  <div
                    className="absolute left-3.5 top-0 w-9 h-9 rounded-full border-2 flex items-center justify-center bg-[#080808]"
                    style={{ borderColor: "#C9A84C" }}
                  >
                    <Icon size={16} className="text-[#C9A84C]" />
                  </div>

                  {/* Ghost number */}
                  <span
                    className="block text-7xl font-extrabold text-[#C9A84C] leading-none mb-2 select-none"
                    style={{
                      fontFamily: "var(--font-space-grotesk)",
                      opacity: 0.1,
                      position: "absolute",
                      top: "-1rem",
                      left: "3.5rem",
                    }}
                  >
                    {step.number}
                  </span>

                  <h3
                    className="text-xl font-bold text-[#F0F0F0] mb-2"
                    style={{ fontFamily: "var(--font-space-grotesk)" }}
                  >
                    {step.title}
                  </h3>
                  <p
                    className="text-[#888888] leading-relaxed text-sm"
                    style={{ fontFamily: "var(--font-inter)" }}
                  >
                    {step.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
