"use client";

import { useEffect, useRef, useState } from "react";

const PROCESS_STEPS = [
  {
    step: "01",
    phase: "Phase 01",
    title: "Consultation & Planning",
    subtitle: "Discovery & Feasibility",
    description:
      "We begin with in-depth site evaluations, zoning and regulatory reviews, and understanding your architectural vision. We establish realistic project parameters, timelines, and legal feasibility before breaking ground.",
    deliverables: [
      "Site topography & soil analysis",
      "Local zoning & regulatory clearance",
      "Preliminary scope & milestone roadmap",
    ],
    icon: (
      <svg
        className="w-6 h-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.75}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
        />
      </svg>
    ),
  },
  {
    step: "02",
    phase: "Phase 02",
    title: "Design & Estimation",
    subtitle: "BIM & Fixed-Price BOQ",
    description:
      "Our licensed architects and structural engineers develop comprehensive 3D BIM models, spatial drawings, and material schedules. We deliver an itemized Bill of Quantities with transparent, contractually binding cost structures.",
    deliverables: [
      "Complete architectural & structural drawings",
      "Material specifications & finish selection",
      "Itemized BOQ with fixed contract pricing",
    ],
    icon: (
      <svg
        className="w-6 h-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.75}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
        />
      </svg>
    ),
  },
  {
    step: "03",
    phase: "Phase 03",
    title: "Construction & Execution",
    subtitle: "Precision Engineering",
    description:
      "Physical construction commences under dedicated on-site project management. We enforce stringent safety protocols, certified raw materials, and continuous quality audits at every concrete pour and structural milestone.",
    deliverables: [
      "Dedicated licensed site supervisor",
      "Critical-path milestone tracking",
      "Live photographic site progress updates",
    ],
    icon: (
      <svg
        className="w-6 h-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.75}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
        />
      </svg>
    ),
  },
  {
    step: "04",
    phase: "Phase 04",
    title: "Final Inspection & Handover",
    subtitle: "Audit & Key Handover",
    description:
      "Prior to handover, we conduct a multi-point snag list inspection, calibrate all MEP building systems, and secure final municipal completion certifications. Your new home is delivered in turnkey perfection with complete warranties.",
    deliverables: [
      "Comprehensive snag-free inspection audit",
      "Municipal completion & occupancy certificates",
      "Structural warranty & as-built documentation",
    ],
    icon: (
      <svg
        className="w-6 h-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.75}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
        />
      </svg>
    ),
  },
];

export default function OurProcess() {
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    );

    const el = sectionRef.current;
    if (el) observer.observe(el);

    return () => {
      if (el) observer.unobserve(el);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="process"
      className="relative z-30 w-full bg-[#faf8f5] dark:bg-[#09090b] text-zinc-900 dark:text-zinc-100 pt-12 sm:pt-16 lg:pt-20 pb-12 sm:pb-16 lg:pb-20 px-5 sm:px-10 lg:px-16 overflow-hidden border-t border-black/[0.06] dark:border-white/[0.06] transition-colors duration-300"
    >
      {/* Background Architectural Noise & Ambient Accents */}
      <div className="absolute inset-0 bg-[radial-gradient(#ffffff08_1px,transparent_1px)] [background-size:28px_28px] pointer-events-none" />
      <div className="absolute top-1/4 right-10 w-[450px] h-[450px] bg-[#D4AF37]/[0.025] rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-[500px] h-[500px] bg-black/[0.015] dark:bg-white/[0.015] rounded-full blur-[160px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto">
        {/* Section Header */}
        <div
          className={`flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-16 sm:mb-20 transition-all duration-700 ease-out ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <div>
            <div className="flex items-center gap-2 mb-4 sm:mb-5">
              <span className="inline-flex items-center px-3.5 py-1.5 rounded-full text-[11px] font-semibold tracking-widest uppercase bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 text-zinc-700 dark:text-zinc-300">
                Methodology
              </span>
              <span className="inline-flex items-center px-3.5 py-1.5 rounded-full text-[11px] font-semibold tracking-widest uppercase bg-[#D4AF37]/15 dark:bg-[#D4AF37]/10 border border-[#D4AF37]/30 dark:border-[#D4AF37]/25 text-[#8F6B32] dark:text-[#E7C982]">
                4-Stage Lifecycle
              </span>
            </div>

            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tight text-zinc-900 dark:text-white leading-[1.05]">
              How We Build <span className="text-zinc-500 font-light">&</span>
              <br className="hidden sm:inline" />
              <span className="text-transparent [-webkit-text-stroke:1.5px_#18181b] sm:[-webkit-text-stroke:2px_#18181b] dark:[-webkit-text-stroke:1.5px_#ffffff] dark:sm:[-webkit-text-stroke:2px_#ffffff] ml-2">
                Deliver
              </span>
            </h2>
          </div>

          <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-400 font-normal leading-relaxed max-w-md lg:mb-2">
            A disciplined, milestone-driven framework that eliminates friction,
            ensures uncompromising structural quality, and delivers fixed-cost
            guarantees from day one.
          </p>
        </div>

        {/* Desktop Process Timeline Grid */}
        <div className="relative">
          {/* Subtle Horizontal Track for Desktop */}
          <div className="hidden lg:block absolute top-[45px] left-10 right-10 h-[2px] bg-black/[0.08] dark:bg-white/[0.08] z-0">
            <div
              className="h-full bg-gradient-to-r from-[#8F6B32] via-[#D4AF37] to-[#E7C982] transition-all duration-700"
              style={{ width: `${((activeStep + 1) / 4) * 100}%` }}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-7 relative z-10">
            {PROCESS_STEPS.map((step, idx) => {
              const isSelected = activeStep === idx;
              return (
                <div
                  key={step.step}
                  onClick={() => setActiveStep(idx)}
                  style={{
                    transitionDelay: isVisible ? `${idx * 120}ms` : "0ms",
                  }}
                  className={`group relative rounded-3xl p-6 sm:p-7 flex flex-col justify-between transition-all duration-500 cursor-pointer ${
                    isVisible
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 translate-y-8"
                  } ${
                    isSelected
                      ? "bg-white dark:bg-[#141417] border-[#D4AF37]/50 dark:border-white/25 shadow-[0_15px_35px_rgba(212,175,55,0.12)] dark:shadow-[0_20px_40px_rgba(0,0,0,0.6)]"
                      : "bg-white/80 dark:bg-[#111114]/80 border-black/[0.08] dark:border-white/[0.07] hover:border-black/15 dark:hover:border-white/15 hover:bg-white dark:hover:bg-[#141418] shadow-sm"
                  } border`}
                >
                  {/* Top Header Row with Step Circle & Phase Tag */}
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      {/* Step Number Circle */}
                      <div
                        className={`w-11 h-11 rounded-full flex items-center justify-center font-mono font-bold text-sm transition-all duration-300 ${
                          isSelected
                            ? "bg-gradient-to-br from-[#E7C982] to-[#D4AF37] text-black shadow-[0_0_20px_rgba(212,175,55,0.4)]"
                            : "bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 text-zinc-600 dark:text-zinc-400 group-hover:border-black/20 dark:group-hover:border-white/20 group-hover:text-zinc-900 dark:group-hover:text-white"
                        }`}
                      >
                        {step.step}
                      </div>

                      {/* Icon */}
                      <div
                        className={`p-2.5 rounded-2xl transition-colors duration-300 ${
                          isSelected
                            ? "bg-[#D4AF37]/15 dark:bg-white/10 text-[#8F6B32] dark:text-[#E7C982]"
                            : "bg-black/[0.03] dark:bg-white/[0.03] text-zinc-500 dark:text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-zinc-200"
                        }`}
                      >
                        {step.icon}
                      </div>
                    </div>

                    <div className="mb-2">
                      <span className="text-[11px] font-mono font-semibold tracking-wider uppercase text-zinc-500 dark:text-zinc-400">
                        {step.phase}
                      </span>
                      <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-900 dark:text-white mt-1">
                        {step.title}
                      </h3>
                      <p className="text-xs text-[#8F6B32] dark:text-[#E7C982] font-semibold tracking-wide mt-0.5">
                        {step.subtitle}
                      </p>
                    </div>

                    <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 font-normal leading-relaxed mt-4">
                      {step.description}
                    </p>
                  </div>

                  {/* Deliverables List */}
                  <div className="mt-6 pt-5 border-t border-black/[0.08] dark:border-white/[0.08]">
                    <p className="text-[11px] font-mono uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-3 font-semibold">
                      Key Deliverables
                    </p>
                    <ul className="space-y-2">
                      {step.deliverables.map((item) => (
                        <li
                          key={item}
                          className="flex items-start text-xs text-zinc-700 dark:text-zinc-300 leading-snug"
                        >
                          <svg
                            className={`w-3.5 h-3.5 mr-2 shrink-0 mt-0.5 ${
                              isSelected ? "text-[#D4AF37]" : "text-zinc-400"
                            }`}
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2.5}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Subtle Accent Edge Highlight */}
                  <div
                    className={`absolute inset-x-8 -bottom-px h-[2px] transition-all duration-500 ${
                      isSelected
                        ? "bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent opacity-100"
                        : "bg-transparent opacity-0 group-hover:opacity-40 group-hover:bg-white"
                    }`}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

