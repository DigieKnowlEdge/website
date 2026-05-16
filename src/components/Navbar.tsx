"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";

const navLinks = [
  { label: "Programs", href: "#programs" },
  { label: "About", href: "#why-us" },
  { label: "Outcomes", href: "#how-it-works" },
  { label: "Blog", href: "#" },
  { label: "Contact", href: "#footer" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  const handleNavClick = (href: string) => {
    setMenuOpen(false);
    if (href === "#") return;
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? "bg-[#080808]/90 backdrop-blur-xl border-b border-white/5 shadow-2xl"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <a
              href="#"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="flex items-center gap-2 group"
            >
              <div className="w-8 h-8 rounded-lg bg-[#C9A84C] flex items-center justify-center">
                <span className="text-[#080808] font-bold text-sm font-[var(--font-space-grotesk)]">DK</span>
              </div>
              <span
                className="text-xl font-bold tracking-tight text-[#F0F0F0] group-hover:text-[#C9A84C] transition-colors duration-300"
                style={{ fontFamily: "var(--font-space-grotesk)" }}
              >
                DigieKnowledge
              </span>
            </a>

            {/* Desktop Links */}
            <div className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <button
                  key={link.label}
                  onClick={() => handleNavClick(link.href)}
                  className="text-sm text-[#888888] hover:text-[#F0F0F0] transition-colors duration-300 cursor-pointer tracking-wide"
                >
                  {link.label}
                </button>
              ))}
            </div>

            {/* Desktop CTA */}
            <div className="hidden md:flex items-center gap-4">
              <button
                onClick={() => handleNavClick("#programs")}
                className="px-5 py-2.5 text-sm font-semibold text-[#C9A84C] border border-[#C9A84C] rounded-full hover:bg-[#C9A84C] hover:text-[#080808] transition-all duration-300 cursor-pointer tracking-wide"
                style={{ fontFamily: "var(--font-space-grotesk)" }}
              >
                Enroll Now
              </button>
            </div>

            {/* Mobile Hamburger */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden w-11 h-11 flex items-center justify-center text-[#F0F0F0] hover:text-[#C9A84C] transition-colors duration-300"
              aria-label="Toggle menu"
            >
              {menuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Full-Screen Overlay */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 bg-[#080808] flex flex-col"
          >
            {/* Close button area (replicated nav height) */}
            <div className="flex items-center justify-between h-20 px-6">
              <span
                className="text-xl font-bold text-[#C9A84C]"
                style={{ fontFamily: "var(--font-space-grotesk)" }}
              >
                DigieKnowledge
              </span>
              <button
                onClick={() => setMenuOpen(false)}
                className="w-11 h-11 flex items-center justify-center text-[#F0F0F0] hover:text-[#C9A84C] transition-colors duration-300"
                aria-label="Close menu"
              >
                <X size={24} />
              </button>
            </div>

            {/* Nav Links */}
            <div className="flex flex-col justify-center flex-1 px-8 gap-2">
              {navLinks.map((link, i) => (
                <motion.button
                  key={link.label}
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -30 }}
                  transition={{ duration: 0.4, delay: i * 0.08 }}
                  onClick={() => handleNavClick(link.href)}
                  className="text-left text-4xl font-bold text-[#F0F0F0] hover:text-[#C9A84C] transition-colors duration-300 py-3 border-b border-white/5 cursor-pointer"
                  style={{ fontFamily: "var(--font-space-grotesk)" }}
                >
                  {link.label}
                </motion.button>
              ))}
              <motion.button
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.4, delay: navLinks.length * 0.08 }}
                onClick={() => handleNavClick("#programs")}
                className="mt-8 w-full py-4 text-xl font-semibold bg-[#C9A84C] text-[#080808] rounded-full hover:bg-[#e0bb63] transition-colors duration-300 cursor-pointer"
                style={{ fontFamily: "var(--font-space-grotesk)" }}
              >
                Enroll Now
              </motion.button>
            </div>

            {/* Bottom tagline */}
            <div className="px-8 pb-10 text-[#888888] text-sm">
              AI-Powered EdTech Platform
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
