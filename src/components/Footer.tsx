"use client";

import {
  Mail,
  Phone,
  MapPin,
  Globe,
  Rss,
  MessageCircle,
  Send,
  Link2,
} from "lucide-react";

const programs = [
  { label: "SDET Automation", href: "#programs" },
  { label: "Full Stack Development", href: "#programs" },
  { label: "Data Science & AI", href: "#programs" },
  { label: "Cyber Security", href: "#programs" },
];

const company = [
  { label: "About Us", href: "#why-us" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "Student Stories", href: "#testimonials" },
  { label: "Blog", href: "#" },
  { label: "Careers", href: "#" },
];

const social = [
  { icon: MessageCircle, href: "#", label: "Twitter / X" },
  { icon: Link2, href: "#", label: "LinkedIn" },
  { icon: Rss, href: "#", label: "YouTube" },
  { icon: Send, href: "#", label: "Telegram" },
  { icon: Globe, href: "#", label: "Website" },
];

const handleNav = (href: string) => {
  if (href === "#") return;
  const el = document.querySelector(href);
  if (el) el.scrollIntoView({ behavior: "smooth" });
};

export default function Footer() {
  return (
    <footer
      id="footer"
      className="bg-[#111111] border-t"
      style={{ borderColor: "rgba(255,255,255,0.07)" }}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
        {/* Main 4-column grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Col 1: Logo + tagline */}
          <div className="col-span-2 lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-[#C9A84C] flex items-center justify-center">
                <span className="text-[#080808] font-bold text-sm" style={{ fontFamily: "var(--font-space-grotesk)" }}>
                  DK
                </span>
              </div>
              <span
                className="text-lg font-bold text-[#F0F0F0]"
                style={{ fontFamily: "var(--font-space-grotesk)" }}
              >
                DigieKnowledge
              </span>
            </div>
            <p className="text-sm text-[#888888] leading-relaxed mb-6 max-w-xs" style={{ fontFamily: "var(--font-inter)" }}>
              AI-powered edtech platform transforming careers in SDET, Full Stack, Data Science & Cyber Security.
            </p>
            {/* Social icons */}
            <div className="flex gap-3 flex-wrap">
              {social.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-9 h-9 rounded-lg border flex items-center justify-center text-[#888888] hover:text-[#C9A84C] hover:border-[#C9A84C]/40 transition-all duration-300"
                  style={{ borderColor: "rgba(255,255,255,0.1)" }}
                >
                  <Icon size={15} />
                </a>
              ))}
            </div>
          </div>

          {/* Col 2: Programs */}
          <div>
            <h4
              className="text-sm font-semibold text-[#F0F0F0] mb-5 tracking-wide"
              style={{ fontFamily: "var(--font-space-grotesk)" }}
            >
              Programs
            </h4>
            <ul className="flex flex-col gap-3">
              {programs.map((link) => (
                <li key={link.label}>
                  <button
                    onClick={() => handleNav(link.href)}
                    className="text-sm text-[#888888] hover:text-[#C9A84C] transition-colors duration-300 cursor-pointer text-left"
                    style={{ fontFamily: "var(--font-inter)" }}
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Company */}
          <div>
            <h4
              className="text-sm font-semibold text-[#F0F0F0] mb-5 tracking-wide"
              style={{ fontFamily: "var(--font-space-grotesk)" }}
            >
              Company
            </h4>
            <ul className="flex flex-col gap-3">
              {company.map((link) => (
                <li key={link.label}>
                  <button
                    onClick={() => handleNav(link.href)}
                    className="text-sm text-[#888888] hover:text-[#C9A84C] transition-colors duration-300 cursor-pointer text-left"
                    style={{ fontFamily: "var(--font-inter)" }}
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: Contact */}
          <div>
            <h4
              className="text-sm font-semibold text-[#F0F0F0] mb-5 tracking-wide"
              style={{ fontFamily: "var(--font-space-grotesk)" }}
            >
              Contact
            </h4>
            <ul className="flex flex-col gap-4">
              <li className="flex items-start gap-2.5">
                <Mail size={14} className="text-[#C9A84C] mt-0.5 flex-shrink-0" />
                <a
                  href="mailto:hello@digieknowledge.com"
                  className="text-sm text-[#888888] hover:text-[#F0F0F0] transition-colors duration-300"
                  style={{ fontFamily: "var(--font-inter)" }}
                >
                  hello@digieknowledge.com
                </a>
              </li>
              <li className="flex items-start gap-2.5">
                <Phone size={14} className="text-[#C9A84C] mt-0.5 flex-shrink-0" />
                <a
                  href="tel:+918001234567"
                  className="text-sm text-[#888888] hover:text-[#F0F0F0] transition-colors duration-300"
                  style={{ fontFamily: "var(--font-inter)" }}
                >
                  +91 800-123-4567
                </a>
              </li>
              <li className="flex items-start gap-2.5">
                <MapPin size={14} className="text-[#C9A84C] mt-0.5 flex-shrink-0" />
                <span className="text-sm text-[#888888]" style={{ fontFamily: "var(--font-inter)" }}>
                  Bangalore, India
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          className="pt-8 border-t flex flex-col sm:flex-row items-center justify-between gap-4"
          style={{ borderColor: "rgba(255,255,255,0.07)" }}
        >
          <p className="text-xs text-[#888888]" style={{ fontFamily: "var(--font-inter)" }}>
            © 2026 DigieKnowledge. All rights reserved.
          </p>
          <div className="flex gap-6">
            {["Privacy Policy", "Terms of Service", "Cookie Policy"].map((item) => (
              <a
                key={item}
                href="#"
                className="text-xs text-[#888888] hover:text-[#C9A84C] transition-colors duration-300"
                style={{ fontFamily: "var(--font-inter)" }}
              >
                {item}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
