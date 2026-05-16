"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { Star, ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { ScrollReveal, StaggerContainer, staggerChild } from "./ScrollReveal";

const testimonials = [
  {
    id: 1,
    name: "Priya Sharma",
    role: "QA Automation Engineer",
    company: "Infosys",
    avatar: "PS",
    avatarColor: "#C9A84C",
    rating: 5,
    quote:
      "DigieKnowledge's SDET program completely transformed my career. Within 3 months of graduating, I landed a role at Infosys with a 70% salary jump. The live mentorship sessions with industry experts were invaluable.",
  },
  {
    id: 2,
    name: "Rahul Mehta",
    role: "Full Stack Developer",
    company: "Wipro",
    avatar: "RM",
    avatarColor: "#00D4FF",
    rating: 5,
    quote:
      "The Full Stack program is incredibly comprehensive. I went from knowing basic HTML to building full-scale React + Node.js applications in 6 months. The AI-assisted learning really adapts to where you're struggling.",
  },
  {
    id: 3,
    name: "Anika Patel",
    role: "Data Scientist",
    company: "Amazon",
    avatar: "AP",
    avatarColor: "#C9A84C",
    rating: 5,
    quote:
      "I applied to DigieKnowledge after struggling to break into data science on my own. The projects were real, the mentors were senior engineers from top companies, and the placement team helped me ace Amazon's interview process.",
  },
  {
    id: 4,
    name: "Vikram Nair",
    role: "Security Engineer",
    company: "Deloitte",
    avatar: "VN",
    avatarColor: "#00D4FF",
    rating: 5,
    quote:
      "The Cyber Security program at DigieKnowledge is hands-on and industry-aligned. I earned my CEH certification alongside the course and joined Deloitte's security team within 2 months of completion.",
  },
  {
    id: 5,
    name: "Sneha Kulkarni",
    role: "SDET Lead",
    company: "Microsoft",
    avatar: "SK",
    avatarColor: "#C9A84C",
    rating: 5,
    quote:
      "What sets DigieKnowledge apart is the community. Even after graduating, I'm still connected with my batch — and the alumni network helped me get my current role at Microsoft. Worth every penny.",
  },
  {
    id: 6,
    name: "Arjun Reddy",
    role: "ML Engineer",
    company: "Google",
    avatar: "AR",
    avatarColor: "#00D4FF",
    rating: 5,
    quote:
      "I was skeptical about online programs but DigieKnowledge proved me wrong. The Data Science curriculum is deep, current, and taught by engineers who work with these models every day. Now I'm at Google.",
  },
];

interface TestimonialCardProps {
  testimonial: (typeof testimonials)[0];
  animate?: boolean;
}

function TestimonialCard({ testimonial, animate = true }: TestimonialCardProps) {
  const isGold = testimonial.avatarColor === "#C9A84C";
  const Wrapper = animate ? motion.div : "div";

  return (
    <Wrapper
      {...(animate ? { variants: staggerChild } : {})}
      className="bg-[#111111] border rounded-2xl p-7 flex flex-col gap-4 h-full relative overflow-hidden"
      style={{ borderColor: "rgba(255,255,255,0.07)" }}
    >
      {/* Gold left accent border */}
      <div
        className="absolute left-0 top-0 bottom-0 w-0.5"
        style={{ background: isGold ? "#C9A84C" : "#00D4FF" }}
      />

      {/* Quote icon */}
      <Quote
        size={28}
        className="opacity-15"
        style={{ color: testimonial.avatarColor }}
      />

      {/* Stars */}
      <div className="flex gap-1">
        {Array.from({ length: testimonial.rating }).map((_, i) => (
          <Star key={i} size={13} className="text-[#C9A84C] fill-[#C9A84C]" />
        ))}
      </div>

      {/* Quote */}
      <p
        className="text-[#888888] text-sm leading-relaxed flex-1"
        style={{ fontFamily: "var(--font-inter)" }}
      >
        &ldquo;{testimonial.quote}&rdquo;
      </p>

      {/* Author */}
      <div className="flex items-center gap-3 pt-3 border-t" style={{ borderColor: "rgba(255,255,255,0.07)" }}>
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
          style={{
            background: isGold ? "rgba(201,168,76,0.15)" : "rgba(0,212,255,0.12)",
            color: testimonial.avatarColor,
            fontFamily: "var(--font-space-grotesk)",
          }}
        >
          {testimonial.avatar}
        </div>
        <div>
          <div
            className="text-sm font-semibold text-[#F0F0F0]"
            style={{ fontFamily: "var(--font-space-grotesk)" }}
          >
            {testimonial.name}
          </div>
          <div className="text-xs text-[#888888]">
            {testimonial.role} at {testimonial.company}
          </div>
        </div>
      </div>
    </Wrapper>
  );
}

export default function Testimonials() {
  const [activeIndex, setActiveIndex] = useState(0);
  const maxIndex = testimonials.length - 1;

  const prev = () => setActiveIndex((i) => Math.max(i - 1, 0));
  const next = () => setActiveIndex((i) => Math.min(i + 1, maxIndex));

  return (
    <section id="testimonials" className="py-24 lg:py-32 px-6 lg:px-8 bg-[#111111]">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <ScrollReveal className="text-center mb-16">
          <span
            className="text-xs font-semibold tracking-[0.15em] uppercase text-[#C9A84C] mb-4 block"
            style={{ fontFamily: "var(--font-space-grotesk)" }}
          >
            Student Stories
          </span>
          <h2
            className="font-extrabold text-[#F0F0F0] leading-tight tracking-[-0.02em]"
            style={{
              fontFamily: "var(--font-space-grotesk)",
              fontSize: "clamp(2rem, 5vw, 3.5rem)",
            }}
          >
            Hear From Our Graduates
          </h2>
          <p
            className="mt-4 text-[#888888] max-w-xl mx-auto"
            style={{ fontFamily: "var(--font-inter)", fontSize: "clamp(0.95rem, 1.5vw, 1.05rem)" }}
          >
            Over 10,000 students have transformed their careers with DigieKnowledge. Here&apos;s what they say.
          </p>
        </ScrollReveal>

        {/* Desktop: 3-column grid */}
        <div className="hidden lg:block">
          <StaggerContainer staggerDelay={0.1} className="grid grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <TestimonialCard key={t.id} testimonial={t} />
            ))}
          </StaggerContainer>
        </div>

        {/* Mobile: Single-card carousel */}
        <div className="lg:hidden">
          <div className="overflow-hidden">
            <motion.div
              className="flex"
              animate={{ x: `-${activeIndex * 100}%` }}
              transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              {testimonials.map((t) => (
                <div key={t.id} className="w-full shrink-0 px-0.5">
                  <TestimonialCard testimonial={t} animate={false} />
                </div>
              ))}
            </motion.div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-between mt-6">
            <button
              onClick={prev}
              disabled={activeIndex === 0}
              className="w-11 h-11 rounded-full border flex items-center justify-center text-[#888888] hover:text-[#C9A84C] hover:border-[#C9A84C] transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
              style={{ borderColor: "rgba(255,255,255,0.12)" }}
              aria-label="Previous"
            >
              <ChevronLeft size={18} />
            </button>

            {/* Dots */}
            <div className="flex gap-2">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveIndex(i)}
                  className="transition-all duration-300 rounded-full cursor-pointer"
                  style={{
                    width: i === activeIndex ? "24px" : "8px",
                    height: "8px",
                    background: i === activeIndex ? "#C9A84C" : "rgba(255,255,255,0.2)",
                  }}
                  aria-label={`Go to slide ${i + 1}`}
                />
              ))}
            </div>

            <button
              onClick={next}
              disabled={activeIndex === maxIndex}
              className="w-11 h-11 rounded-full border flex items-center justify-center text-[#888888] hover:text-[#C9A84C] hover:border-[#C9A84C] transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
              style={{ borderColor: "rgba(255,255,255,0.12)" }}
              aria-label="Next"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
