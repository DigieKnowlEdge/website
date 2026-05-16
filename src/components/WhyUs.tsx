"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { Video, Briefcase, Handshake, BrainCircuit } from "lucide-react";
import { ScrollReveal, StaggerContainer, staggerChild } from "./ScrollReveal";

const features = [
  {
    icon: Video,
    title: "Live Mentorship",
    description:
      "Weekly 1-on-1 and group sessions with senior engineers from top tech companies. Real feedback, real growth.",
    accentColor: "#C9A84C",
  },
  {
    icon: Briefcase,
    title: "Industry Projects",
    description:
      "Build a portfolio of 8–12 production-grade projects sourced from real company briefs. Employers notice portfolios.",
    accentColor: "#00D4FF",
  },
  {
    icon: Handshake,
    title: "Placement Support",
    description:
      "Dedicated placement team, mock interviews, resume reviews, and direct referrals to 500+ hiring partners.",
    accentColor: "#C9A84C",
  },
  {
    icon: BrainCircuit,
    title: "AI-Assisted Learning",
    description:
      "Our AI adapts your learning pace, surfaces weak spots, generates practice problems, and tracks real progress.",
    accentColor: "#00D4FF",
  },
];

const counters = [
  { value: 10000, suffix: "K+", display: "10K+", label: "Students Enrolled" },
  { value: 94, suffix: "%", display: "94%", label: "Placement Rate" },
  { value: 20, suffix: "+", display: "20+", label: "Courses Available" },
  { value: 500, suffix: "+", display: "500+", label: "Hiring Partners" },
];

function AnimatedCounter({ item, isVisible }: { item: (typeof counters)[0]; isVisible: boolean }) {
  const [count, setCount] = useState(0);
  const started = useRef(false);

  useEffect(() => {
    if (!isVisible || started.current) return;
    started.current = true;

    const target = item.value;
    const duration = 2000;
    const steps = 60;
    const increment = target / steps;
    let current = 0;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      current = Math.min(current + increment, target);
      setCount(Math.round(current));
      if (step >= steps) clearInterval(timer);
    }, duration / steps);

    return () => clearInterval(timer);
  }, [isVisible, item.value]);

  const formatCount = (n: number) => {
    if (item.value >= 1000) return `${Math.round(n / 1000)}${item.suffix}`;
    return `${n}${item.suffix}`;
  };

  return (
    <div className="text-center">
      <div
        className="text-4xl lg:text-5xl font-extrabold text-[#C9A84C] leading-none"
        style={{ fontFamily: "var(--font-space-grotesk)" }}
      >
        {isVisible ? formatCount(count) : "0" + item.suffix}
      </div>
      <div className="mt-2 text-xs text-[#888888] uppercase tracking-[0.1em]">
        {item.label}
      </div>
    </div>
  );
}

export default function WhyUs() {
  const counterRef = useRef<HTMLDivElement>(null);
  const isVisible = useInView(counterRef, { once: true, margin: "-100px 0px" });

  return (
    <section id="why-us" className="py-24 lg:py-32 px-6 lg:px-8 bg-[#111111]">
      <div className="max-w-7xl mx-auto">

        {/* Section label */}
        <ScrollReveal className="text-center mb-4">
          <span
            className="text-xs font-semibold tracking-[0.15em] uppercase text-[#C9A84C]"
            style={{ fontFamily: "var(--font-space-grotesk)" }}
          >
            Why DigieKnowledge
          </span>
        </ScrollReveal>

        {/* Main layout: left big statement + right features */}
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-start">

          {/* Left: Big statement */}
          <ScrollReveal>
            <h2
              className="font-extrabold text-[#F0F0F0] leading-tight tracking-[-0.02em]"
              style={{
                fontFamily: "var(--font-space-grotesk)",
                fontSize: "clamp(2rem, 4.5vw, 3.5rem)",
              }}
            >
              We don&apos;t just teach.
              <br />
              <span className="text-transparent bg-clip-text" style={{
                backgroundImage: "linear-gradient(135deg, #C9A84C 0%, #00D4FF 100%)"
              }}>
                We launch careers.
              </span>
            </h2>
            <p
              className="mt-6 text-[#888888] leading-relaxed max-w-lg"
              style={{
                fontFamily: "var(--font-inter)",
                fontSize: "clamp(0.95rem, 1.5vw, 1.05rem)",
              }}
            >
              DigieKnowledge was built by engineers who know what hiring managers actually want. Our curriculum is co-designed with industry — updated every quarter, taught by practitioners, and backed by a placement guarantee.
            </p>
            <p className="mt-4 text-[#888888] leading-relaxed max-w-lg" style={{ fontFamily: "var(--font-inter)" }}>
              Whether you&apos;re switching careers or leveling up, we provide the structure, mentorship, and community you need to land — and thrive — in your dream role.
            </p>

            {/* CTA */}
            <button
              onClick={() => {
                const el = document.querySelector("#programs");
                if (el) el.scrollIntoView({ behavior: "smooth" });
              }}
              className="mt-8 inline-flex items-center gap-2 px-6 py-3 bg-[#C9A84C] text-[#080808] font-bold rounded-full text-sm hover:bg-[#e0bb63] transition-all duration-300 hover:shadow-[0_0_30px_rgba(201,168,76,0.3)] cursor-pointer"
              style={{ fontFamily: "var(--font-space-grotesk)" }}
            >
              Explore Programs
            </button>
          </ScrollReveal>

          {/* Right: Feature cards */}
          <StaggerContainer staggerDelay={0.1} className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {features.map((feature) => {
              const Icon = feature.icon;
              const isGold = feature.accentColor === "#C9A84C";
              return (
                <motion.div
                  key={feature.title}
                  variants={staggerChild}
                  className="bg-[#1A1A1A] rounded-xl p-6 border transition-all duration-300 group hover:-translate-y-1"
                  style={{ borderColor: "rgba(255,255,255,0.07)" }}
                  whileHover={{
                    borderColor: isGold ? "rgba(201,168,76,0.3)" : "rgba(0,212,255,0.25)",
                    boxShadow: isGold
                      ? "0 10px 40px rgba(201,168,76,0.1)"
                      : "0 10px 40px rgba(0,212,255,0.08)",
                  }}
                >
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center mb-4"
                    style={{
                      background: isGold ? "rgba(201,168,76,0.1)" : "rgba(0,212,255,0.08)",
                    }}
                  >
                    <Icon size={18} style={{ color: feature.accentColor }} />
                  </div>
                  <h3
                    className="text-base font-bold text-[#F0F0F0] mb-2"
                    style={{ fontFamily: "var(--font-space-grotesk)" }}
                  >
                    {feature.title}
                  </h3>
                  <p className="text-sm text-[#888888] leading-relaxed" style={{ fontFamily: "var(--font-inter)" }}>
                    {feature.description}
                  </p>
                </motion.div>
              );
            })}
          </StaggerContainer>
        </div>

        {/* Counter row */}
        <div ref={counterRef} className="mt-20 pt-12 border-t" style={{ borderColor: "rgba(255,255,255,0.07)" }}>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-10">
            {counters.map((item) => (
              <AnimatedCounter key={item.label} item={item} isVisible={isVisible} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
