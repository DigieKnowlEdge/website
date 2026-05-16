"use client";

import { Users, TrendingUp, BookOpen, Star, Building2 } from "lucide-react";

const items = [
  { icon: Users, text: "10,000+ Students" },
  { icon: TrendingUp, text: "94% Placement Rate" },
  { icon: BookOpen, text: "20+ Courses" },
  { icon: Star, text: "4.9★ Rating" },
  { icon: Building2, text: "500+ Hiring Partners" },
];

// Duplicate for seamless loop
const allItems = [...items, ...items, ...items, ...items];

export default function Marquee() {
  return (
    <section
      id="marquee"
      className="relative py-5 overflow-hidden border-y"
      style={{ borderColor: "rgba(255,255,255,0.07)" }}
    >
      {/* Fade masks */}
      <div
        className="absolute left-0 top-0 bottom-0 w-24 z-10 pointer-events-none"
        style={{
          background:
            "linear-gradient(to right, #080808, transparent)",
        }}
      />
      <div
        className="absolute right-0 top-0 bottom-0 w-24 z-10 pointer-events-none"
        style={{
          background:
            "linear-gradient(to left, #080808, transparent)",
        }}
      />

      <div className="animate-marquee flex whitespace-nowrap">
        {allItems.map((item, i) => {
          const Icon = item.icon;
          return (
            <span
              key={i}
              className="inline-flex items-center gap-3 mx-8 shrink-0"
            >
              <Icon size={16} className="text-[#C9A84C]" />
              <span
                className="text-sm font-semibold text-[#F0F0F0] tracking-wide"
                style={{ fontFamily: "var(--font-space-grotesk)" }}
              >
                {item.text}
              </span>
              {/* Gold dot separator */}
              <span className="ml-8 w-1.5 h-1.5 rounded-full bg-[#C9A84C] opacity-60 inline-block" />
            </span>
          );
        })}
      </div>
    </section>
  );
}
