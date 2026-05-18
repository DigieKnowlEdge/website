"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import {
  TestTube2,
  Code2,
  BrainCircuit,
  ShieldCheck,
  ArrowRight,
  Clock,
  BarChart3,
} from "lucide-react";
import { ScrollReveal, StaggerContainer, staggerChild } from "./ScrollReveal";
import { useRegistration } from "@/context/RegistrationContext";

const programs = [
  {
    id: "sdet",
    icon: TestTube2,
    category: "Quality Engineering",
    title: "SDET Automation",
    description:
      "Master test automation with Selenium, Playwright, Cypress, API testing with Postman & RestAssured, and CI/CD pipelines used by top QA teams.",
    duration: "6 Months",
    level: "Beginner to Advanced",
    accentColor: "#C9A84C",
    tags: ["Selenium", "Playwright", "API Testing", "CI/CD"],
  },
  {
    id: "fullstack",
    icon: Code2,
    category: "Web Development",
    title: "Full Stack Development",
    description:
      "Build production-grade apps with React, Next.js, Node.js, PostgreSQL, Docker & cloud deployment. From concept to scalable product.",
    duration: "8 Months",
    level: "Beginner to Pro",
    accentColor: "#00D4FF",
    tags: ["React", "Next.js", "Node.js", "AWS"],
  },
  {
    id: "datascience",
    icon: BrainCircuit,
    category: "Data & AI",
    title: "Data Science & AI",
    description:
      "Dive into Python, ML algorithms, deep learning, NLP, and LLMs. Build real AI products and data pipelines used at Fortune 500 companies.",
    duration: "9 Months",
    level: "Intermediate+",
    accentColor: "#C9A84C",
    tags: ["Python", "ML", "LLMs", "TensorFlow"],
  },
  {
    id: "cybersec",
    icon: ShieldCheck,
    category: "Security",
    title: "Cyber Security",
    description:
      "Learn ethical hacking, penetration testing, cloud security, SOC operations, and compliance frameworks. Become a certified security engineer.",
    duration: "7 Months",
    level: "Beginner to Advanced",
    accentColor: "#00D4FF",
    tags: ["Ethical Hacking", "Pen Testing", "Cloud Sec", "SOC"],
  },
];

interface ProgramCardProps {
  program: (typeof programs)[0];
  index: number;
  onEnroll: (title: string) => void;
}

function ProgramCard({ program, index, onEnroll }: ProgramCardProps) {
  const Icon = program.icon;
  const isGold = program.accentColor === "#C9A84C";

  return (
    <motion.div
      variants={staggerChild}
      className="group relative bg-[#111111] border rounded-2xl p-8 cursor-pointer flex flex-col gap-5 transition-all duration-400 hover:-translate-y-1.5"
      style={{
        borderColor: "rgba(255,255,255,0.07)",
      }}
      whileHover={{
        y: -6,
        boxShadow: isGold
          ? "0 20px 60px rgba(201,168,76,0.15), 0 0 0 1px rgba(201,168,76,0.25)"
          : "0 20px 60px rgba(0,212,255,0.12), 0 0 0 1px rgba(0,212,255,0.2)",
        borderColor: isGold
          ? "rgba(201,168,76,0.4)"
          : "rgba(0,212,255,0.3)",
      }}
      transition={{ duration: 0.3 }}
    >
      {/* Left accent border on hover */}
      <div
        className="absolute left-0 top-6 bottom-6 w-0.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{ background: program.accentColor }}
      />

      {/* Card number */}
      <span
        className="absolute top-6 right-6 text-xs font-bold tracking-[0.15em] uppercase"
        style={{ color: "rgba(255,255,255,0.12)", fontFamily: "var(--font-space-grotesk)" }}
      >
        0{index + 1}
      </span>

      {/* Icon */}
      <div
        className="w-12 h-12 rounded-xl flex items-center justify-center"
        style={{
          background: isGold
            ? "rgba(201,168,76,0.1)"
            : "rgba(0,212,255,0.08)",
        }}
      >
        <Icon size={22} style={{ color: program.accentColor }} />
      </div>

      {/* Category label */}
      <span
        className="text-xs font-semibold tracking-[0.15em] uppercase"
        style={{ color: program.accentColor, fontFamily: "var(--font-space-grotesk)" }}
      >
        {program.category}
      </span>

      {/* Title */}
      <h3
        className="text-2xl font-bold text-[#F0F0F0] leading-tight -mt-2"
        style={{ fontFamily: "var(--font-space-grotesk)" }}
      >
        {program.title}
      </h3>

      {/* Description */}
      <p className="text-[#888888] text-sm leading-relaxed flex-1" style={{ fontFamily: "var(--font-inter)" }}>
        {program.description}
      </p>

      {/* Tags */}
      <div className="flex flex-wrap gap-2">
        {program.tags.map((tag) => (
          <span
            key={tag}
            className="px-2.5 py-1 text-xs rounded-md font-medium"
            style={{
              background: "rgba(255,255,255,0.05)",
              color: "#888888",
              fontFamily: "var(--font-inter)",
            }}
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Meta row */}
      <div className="flex items-center gap-4 pt-2 border-t" style={{ borderColor: "rgba(255,255,255,0.07)" }}>
        <div className="flex items-center gap-1.5 text-xs text-[#888888]">
          <Clock size={12} />
          <span>{program.duration}</span>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-[#888888]">
          <BarChart3 size={12} />
          <span>{program.level}</span>
        </div>
      </div>

      {/* CTA */}
      <button
        onClick={() => onEnroll(program.title)}
        className="flex items-center gap-2 text-sm font-semibold transition-colors duration-300 group/cta -mt-1 cursor-pointer"
        style={{
          color: "#888888",
          fontFamily: "var(--font-space-grotesk)",
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLButtonElement).style.color = program.accentColor;
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLButtonElement).style.color = "#888888";
        }}
      >
        Enroll Now
        <ArrowRight size={14} className="transition-transform duration-300 group-hover/cta:translate-x-1" />
      </button>
    </motion.div>
  );
}

export default function Programs() {
  const { openModal } = useRegistration();

  const handleEnroll = (title: string) => {
    // Pre-fill course in modal via sessionStorage so RegistrationModal can pick it up
    sessionStorage.setItem("prefillCourse", title);
    openModal();
  };

  return (
    <section id="programs" className="py-24 lg:py-32 px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <ScrollReveal className="mb-16 text-center">
          <span
            className="inline-block text-xs font-semibold tracking-[0.15em] uppercase text-[#C9A84C] mb-4"
            style={{ fontFamily: "var(--font-space-grotesk)" }}
          >
            Our Programs
          </span>
          <h2
            className="font-extrabold text-[#F0F0F0] leading-tight tracking-[-0.02em]"
            style={{
              fontFamily: "var(--font-space-grotesk)",
              fontSize: "clamp(2rem, 5vw, 3.5rem)",
            }}
          >
            Choose Your Path
          </h2>
          <p
            className="mt-4 text-[#888888] max-w-xl mx-auto"
            style={{ fontFamily: "var(--font-inter)", fontSize: "clamp(0.95rem, 1.5vw, 1.1rem)" }}
          >
            Four industry-aligned programs designed to launch you into high-demand tech careers. Each built with top employers.
          </p>
        </ScrollReveal>

        {/* Cards Grid — desktop 2x2, mobile horizontal scroll */}
        <StaggerContainer staggerDelay={0.12} className="hidden sm:grid sm:grid-cols-2 gap-6">
          {programs.map((program, i) => (
            <ProgramCard key={program.id} program={program} index={i} onEnroll={handleEnroll} />
          ))}
        </StaggerContainer>

        {/* Mobile: horizontal scroll carousel */}
        <div className="sm:hidden -mx-6 px-6">
          <div
            className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {programs.map((program, i) => (
              <div key={program.id} className="snap-start shrink-0 w-[85vw] max-w-sm">
                <div
                  className="bg-[#111111] border rounded-2xl p-6 flex flex-col gap-4 h-full"
                  style={{ borderColor: "rgba(255,255,255,0.07)" }}
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{
                      background: program.accentColor === "#C9A84C"
                        ? "rgba(201,168,76,0.1)"
                        : "rgba(0,212,255,0.08)",
                    }}
                  >
                    <program.icon size={18} style={{ color: program.accentColor }} />
                  </div>
                  <span
                    className="text-xs font-semibold tracking-[0.15em] uppercase"
                    style={{ color: program.accentColor, fontFamily: "var(--font-space-grotesk)" }}
                  >
                    {program.category}
                  </span>
                  <h3
                    className="text-xl font-bold text-[#F0F0F0]"
                    style={{ fontFamily: "var(--font-space-grotesk)" }}
                  >
                    {program.title}
                  </h3>
                  <p className="text-[#888888] text-sm leading-relaxed flex-1">
                    {program.description}
                  </p>
                  <div className="flex items-center gap-4 pt-2 border-t" style={{ borderColor: "rgba(255,255,255,0.07)" }}>
                    <div className="flex items-center gap-1.5 text-xs text-[#888888]">
                      <Clock size={12} />
                      <span>{program.duration}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleEnroll(program.title)}
                    className="flex items-center gap-2 text-sm font-semibold cursor-pointer"
                    style={{ color: program.accentColor, fontFamily: "var(--font-space-grotesk)" }}
                  >
                    Enroll Now <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
