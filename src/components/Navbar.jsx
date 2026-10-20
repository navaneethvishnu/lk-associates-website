"use client";

import { useEffect, useState, useCallback } from "react";
import { useTheme } from "@/context/ThemeContext";

const NAV_LINKS = [
  { name: "Home", href: "#home", id: "home" },
  { name: "Projects", href: "#projects", id: "projects" },
  { name: "Our Expertise", href: "#expertise", id: "expertise" },
  { name: "Why Choose Us", href: "#why-choose-us", id: "why-choose-us" },
  { name: "Our Process", href: "#process", id: "process" },
  { name: "Testimonials", href: "#testimonials", id: "testimonials" },
];

const WHATSAPP_URL = `https://wa.me/917510600218?text=${encodeURIComponent(
  "Hello, I am interested in discussing a construction project (house construction / renovation / turnkey contract). I would like to schedule a consultation."
)}`;

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Background blur and transparency on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 24) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Active section scroll spy
  useEffect(() => {
    const sectionIds = [
      "home",
      "projects",
      "expertise",
      "why-choose-us",
      "process",
      "testimonials",
      "contact",
    ];

    const observerCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observerOptions = {
      root: null,
      rootMargin: "-25% 0px -55% 0px",
      threshold: 0,
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => {
      sectionIds.forEach((id) => {
        const el = document.getElementById(id);
        if (el) observer.unobserve(el);
      });
    };
  }, []);

  // Smooth scroll to section accounting for navbar height
  const scrollToSection = useCallback((e, href) => {
    e.preventDefault();
    setIsMobileMenuOpen(false);

    if (href === "#home") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    const targetId = href.replace("#", "");
    const targetElement = document.getElementById(targetId);

    if (targetElement) {
      const navOffset = 76;
      const elementPosition = targetElement.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - navOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  }, []);

  return (
    <>
      <header
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-[#faf8f5]/90 dark:bg-[#09090b]/85 backdrop-blur-xl border-b border-black/[0.06] dark:border-white/[0.08] shadow-[0_10px_30px_rgba(0,0,0,0.06)] dark:shadow-[0_10px_30px_rgba(0,0,0,0.8)] py-3 sm:py-3.5"
            : "bg-transparent py-4 sm:py-5"
        }`}
      >
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-16 flex items-center justify-between">
          {/* Left: Brand Logo / Name */}
          <a
            href="#home"
            onClick={(e) => scrollToSection(e, "#home")}
            className="group flex items-center gap-2.5 sm:gap-3 select-none text-left"
          >
            {/* Logo Emblem Image */}
            <div className="relative w-8 h-8 sm:w-9 sm:h-9 rounded-xl overflow-hidden flex items-center justify-center transition-all duration-300 group-hover:scale-105 shrink-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/lk-associates-emblem-only.webp"
                alt="LK Associates"
                className="w-full h-full object-contain"
              />
            </div>

            <div>
              <span className="block font-black text-sm sm:text-base tracking-[0.16em] uppercase text-zinc-900 dark:text-white leading-tight">
                LK Associates
              </span>
              <span className="block font-mono text-[9px] tracking-[0.24em] text-zinc-500 dark:text-zinc-400 uppercase -mt-0.5">
                Architecture & Build
              </span>
            </div>
          </a>

          {/* Center: Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/[0.03] dark:bg-white/[0.04] border border-black/[0.06] dark:border-white/[0.08] backdrop-blur-md">
            {NAV_LINKS.map((link) => {
              const isActive = activeSection === link.id;

              return (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={(e) => scrollToSection(e, link.href)}
                  className={`relative px-3.5 py-1.5 rounded-full text-xs font-medium tracking-wide transition-all duration-200 flex items-center gap-1.5 select-none ${
                    isActive
                      ? "text-zinc-950 dark:text-white bg-black/5 dark:bg-white/10 shadow-sm font-semibold"
                      : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-zinc-100 hover:bg-black/[0.03] dark:hover:bg-white/[0.04]"
                  }`}
                >
                  {/* Active Indicator Accent Dot */}
                  {isActive && (
                    <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] shadow-[0_0_8px_rgba(212,175,55,0.9)] animate-pulse" />
                  )}
                  <span>{link.name}</span>
                </a>
              );
            })}
          </nav>

          {/* Right: Theme Toggle, CTA Button & Mobile Hamburger Toggle */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            {/* Theme Toggle Button (Desktop & Mobile Header) */}
            <button
              onClick={toggleTheme}
              aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 flex items-center justify-center text-zinc-700 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-white hover:border-black/20 dark:hover:border-white/20 transition-all active:scale-95 shadow-sm"
              title={isDark ? "Switch to light theme" : "Switch to dark theme"}
            >
              {isDark ? (
                /* Sun Icon */
                <svg
                  className="w-4 h-4 text-[#E7C982] transition-transform duration-300 hover:rotate-45"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <circle cx="12" cy="12" r="4" />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32l1.41 1.41M2 12h2m16 0h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"
                  />
                </svg>
              ) : (
                /* Moon Icon */
                <svg
                  className="w-4 h-4 text-zinc-800 transition-transform duration-300 hover:-rotate-12"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                  />
                </svg>
              )}
            </button>

            {/* Desktop & Tablet "Discuss Your Project" Button */}
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 rounded-full bg-gradient-to-r from-[#E7C982] via-[#D4AF37] to-[#B58A45] text-black font-bold text-xs sm:text-sm tracking-wide shadow-[0_0_20px_rgba(212,175,55,0.25)] hover:shadow-[0_0_28px_rgba(212,175,55,0.4)] hover:scale-[1.02] active:scale-[0.98] transition-all shrink-0"
            >
              <span>Discuss Your Project</span>
              <svg
                className="w-3.5 h-3.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M7 17L17 7M17 7H7M17 7V17"
                />
              </svg>
            </a>

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setIsMobileMenuOpen((prev) => !prev)}
              aria-label={isMobileMenuOpen ? "Close menu" : "Open navigation menu"}
              aria-expanded={isMobileMenuOpen}
              className="lg:hidden w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 flex flex-col items-center justify-center gap-1.5 text-zinc-700 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-white hover:border-black/20 dark:hover:border-white/20 transition-all active:scale-95"
            >
              <span
                className={`w-5 h-[1.5px] bg-current transition-all duration-300 origin-center ${
                  isMobileMenuOpen ? "rotate-45 translate-y-[4.5px]" : ""
                }`}
              />
              <span
                className={`w-5 h-[1.5px] bg-current transition-all duration-300 origin-center ${
                  isMobileMenuOpen ? "-rotate-45 -translate-y-[4.5px]" : ""
                }`}
              />
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        <div
          className={`lg:hidden overflow-hidden transition-all duration-300 ease-in-out bg-[#faf8f5]/98 dark:bg-[#0b0b0e]/95 backdrop-blur-2xl shadow-2xl px-5 ${
            isMobileMenuOpen
              ? "max-h-[520px] opacity-100 border-b border-black/10 dark:border-white/10 pt-3 pb-5 mt-2"
              : "max-h-0 opacity-0 border-transparent pt-0 pb-0 mt-0 pointer-events-none"
          }`}
        >
          <div className="flex flex-col space-y-1">
            {NAV_LINKS.map((link) => {
              const isActive = activeSection === link.id;

              return (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={(e) => scrollToSection(e, link.href)}
                  className={`flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-medium tracking-wide transition-all ${
                    isActive
                      ? "bg-black/5 dark:bg-white/10 text-zinc-950 dark:text-white font-semibold"
                      : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5"
                  }`}
                >
                  <span className="flex items-center gap-2.5">
                    {isActive && (
                      <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] shadow-[0_0_8px_rgba(212,175,55,0.9)]" />
                    )}
                    <span>{link.name}</span>
                  </span>

                  <svg
                    className={`w-3.5 h-3.5 ${
                      isActive ? "text-[#D4AF37] dark:text-[#E7C982]" : "text-zinc-400"
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </a>
              );
            })}

            {/* Mobile Drawer "Discuss Your Project" Action */}
            <div className="pt-3 mt-2 border-t border-black/[0.08] dark:border-white/[0.08]">
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-2xl bg-gradient-to-r from-[#E7C982] via-[#D4AF37] to-[#B58A45] text-black font-bold text-sm tracking-wide shadow-[0_0_20px_rgba(212,175,55,0.25)] active:scale-[0.98] transition-all"
              >
                <span>Discuss Your Project</span>
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M7 17L17 7M17 7H7M17 7V17"
                  />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}

