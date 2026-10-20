"use client";

import { useEffect, useRef, useState } from "react";

export default function WhyChooseUs() {
  const sectionRef = useRef(null);
  const cardRefs = useRef([]);
  const [isVisible, setIsVisible] = useState(false);
  const [visibleCards, setVisibleCards] = useState(() => Array(6).fill(false));

  useEffect(() => {
    const isDesktop = typeof window !== "undefined" && window.innerWidth >= 1024;

    if (isDesktop) {
      // Desktop: preserve existing whole-section synchronized staggered entrance
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            setVisibleCards(Array(6).fill(true));
            observer.disconnect();
          }
        },
        {
          threshold: 0.1,
          rootMargin: "0px 0px -60px 0px",
        }
      );

      const currentSection = sectionRef.current;
      if (currentSection) {
        observer.observe(currentSection);
      }

      return () => observer.disconnect();
    } else {
      // Mobile & Tablet: individual scroll-triggered entrance for each card as it enters the viewport
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const index = cardRefs.current.indexOf(entry.target);
              if (index !== -1) {
                setVisibleCards((prev) => {
                  if (prev[index]) return prev;
                  const updated = [...prev];
                  updated[index] = true;
                  return updated;
                });
                observer.unobserve(entry.target);
              }
            }
          });
        },
        {
          threshold: 0.12,
          rootMargin: "0px 0px -40px 0px",
        }
      );

      cardRefs.current.forEach((el) => {
        if (el) observer.observe(el);
      });

      return () => observer.disconnect();
    }
  }, []);

  return (
    <section
      ref={sectionRef}
      id="why-choose-us"
      className="relative z-30 w-full bg-[#faf8f5] dark:bg-[#09090b] text-zinc-900 dark:text-zinc-100 pt-3 sm:pt-16 lg:pt-20 pb-12 sm:pb-16 lg:pb-20 px-5 sm:px-10 lg:px-16 overflow-hidden transition-colors duration-300"
    >
      {/* Background Architectural Noise & Radial Lighting */}
      <div className="absolute inset-0 bg-[radial-gradient(#ffffff08_1px,transparent_1px)] [background-size:28px_28px] pointer-events-none" />
      <div className="absolute top-10 left-10 w-[500px] h-[500px] bg-black/[0.015] dark:bg-white/[0.015] rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-[#D4AF37]/[0.025] rounded-full blur-[180px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto">
        {/* Asymmetrical Bento Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 lg:gap-7 items-stretch">
          
          {/* ========================================================= */}
          {/* TOP LEFT: Iconic Typography Block (Matching Reference)    */}
          {/* ========================================================= */}
          <div
            ref={(el) => (cardRefs.current[0] = el)}
            className={`lg:col-span-7 flex flex-col justify-between p-6 sm:p-10 lg:p-12 rounded-3xl bg-white/90 dark:bg-[#121215]/80 border border-black/[0.08] dark:border-white/[0.08] backdrop-blur-xl shadow-xl dark:shadow-2xl transition-all duration-700 ease-out ${
              visibleCards[0]
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-10"
            }`}
          >
            <div>
              {/* Category Pill Tag */}
              <div className="flex items-center gap-2 mb-6 sm:mb-8">
                <span className="inline-flex items-center px-3.5 py-1.5 rounded-full text-[11px] font-semibold tracking-widest uppercase bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 text-zinc-700 dark:text-zinc-300">
                  Value & Standards
                </span>
                <span className="inline-flex items-center px-3.5 py-1.5 rounded-full text-[11px] font-semibold tracking-widest uppercase bg-[#D4AF37]/15 dark:bg-[#D4AF37]/10 border border-[#D4AF37]/30 dark:border-[#D4AF37]/25 text-[#8F6B32] dark:text-[#E7C982]">
                  Turnkey Excellence
                </span>
              </div>

              {/* Oversized Bold Typography with Outlined Accent (Matching Reference) */}
              <h2 className="font-black text-6xl sm:text-7xl lg:text-8xl tracking-tight leading-[0.92] text-zinc-900 dark:text-white uppercase select-none mb-6 sm:mb-8">
                <span className="block">WHY</span>
                <span className="block">CHOOSE</span>
                <span className="flex items-center mt-2">
                  {/* Vibrant Metallic Gold Arrow Circle */}
                  <span className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 rounded-full bg-gradient-to-br from-[#E7C982] via-[#D4AF37] to-[#B58A45] text-black mr-3 sm:mr-4 shrink-0 shadow-[0_0_30px_rgba(212,175,55,0.35)] transition-transform duration-500 hover:rotate-45">
                    <svg
                      className="w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={3}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M14 5l7 7m0 0l-7 7m7-7H3"
                      />
                    </svg>
                  </span>
                  {/* Outlined "US" Text */}
                  <span className="text-transparent [-webkit-text-stroke:2px_#18181b] sm:[-webkit-text-stroke:3px_#18181b] lg:[-webkit-text-stroke:4px_#18181b] dark:[-webkit-text-stroke:2px_#ffffff] dark:sm:[-webkit-text-stroke:3px_#ffffff] dark:lg:[-webkit-text-stroke:4px_#ffffff]">
                    US
                  </span>
                </span>
              </h2>
            </div>

            {/* Architectural Sub-statement */}
            <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-400 font-normal leading-relaxed max-w-xl">
              We specialize in custom residential estates, complex renovations, and turnkey contract construction. Every project is anchored by uncompromising workmanship, budget transparency, and guaranteed milestone delivery.
            </p>
          </div>

          {/* ========================================================= */}
          {/* TOP RIGHT: The Signature Metallic Gold Card               */}
          {/* ========================================================= */}
          <div
            ref={(el) => (cardRefs.current[1] = el)}
            style={{ transitionDelay: isVisible ? "120ms" : "0ms" }}
            className={`lg:col-span-5 group relative rounded-3xl p-7 sm:p-9 lg:p-10 bg-gradient-to-br from-[#E7C982] via-[#D4AF37] to-[#B58A45] text-zinc-950 flex flex-col justify-between min-h-[380px] shadow-[0_20px_50px_rgba(212,175,55,0.18)] transition-all duration-700 ease-out hover:scale-[1.01] hover:shadow-[0_25px_60px_rgba(212,175,55,0.3)] ${
              visibleCards[1]
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-10"
            }`}
          >
            {/* Top Bar: Assurance Tag & Inverted Action Circle */}
            <div className="flex items-center justify-between">
              <span className="px-3.5 py-1.5 rounded-full text-[11px] font-bold tracking-widest uppercase bg-black text-[#E7C982]">
                Legally Bound
              </span>

              {/* Action Circle */}
              <div className="w-10 h-10 rounded-full bg-black text-[#D4AF37] flex items-center justify-center font-bold shadow-md transition-transform duration-300 group-hover:rotate-45">
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
              </div>
            </div>

            {/* Bottom Content: Reliable Construction Contracts */}
            <div className="mt-12 sm:mt-16">
              <p className="text-xs font-mono uppercase tracking-[0.2em] text-zinc-800 mb-2 font-bold">
                Pillar 01 / Contract Integrity
              </p>
              <h3 className="text-3xl sm:text-4xl font-black tracking-tight text-black mb-3 leading-[1.08]">
                Reliable Construction Contracts
              </h3>
              <p className="text-xs sm:text-sm text-zinc-900 font-medium leading-relaxed">
                Legally binding turnkey agreements with fixed price caps, phased milestone disbursements, and comprehensive structural warranties. Zero ambiguity, zero unapproved changes.
              </p>
            </div>
          </div>

          {/* ========================================================= */}
          {/* MIDDLE LEFT: Quality Construction (Visual Showcase)       */}
          {/* ========================================================= */}
          <div
            ref={(el) => (cardRefs.current[2] = el)}
            style={{ transitionDelay: isVisible ? "240ms" : "0ms" }}
            className={`lg:col-span-6 group relative rounded-3xl overflow-hidden border border-black/[0.08] dark:border-white/[0.08] bg-zinc-900 min-h-[360px] p-7 sm:p-9 flex flex-col justify-between shadow-xl dark:shadow-2xl transition-all duration-700 ease-out hover:border-black/20 dark:hover:border-white/25 ${
              visibleCards[2]
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-10"
            }`}
          >
            {/* Background Architectural Construction Image */}
            <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/frames/frame_128.jpg"
                alt="Quality Construction Workmanship"
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#09090b]/95 via-[#09090b]/60 to-black/30 group-hover:via-[#09090b]/50 transition-colors duration-500" />
            </div>

            {/* Top Bar */}
            <div className="relative z-10 flex items-center justify-between">
              <span className="px-3.5 py-1.5 rounded-full text-[11px] font-mono tracking-widest uppercase text-zinc-300 bg-white/10 border border-white/20 backdrop-blur-md">
                Pillar 02 / Workmanship
              </span>
              <div className="w-10 h-10 rounded-full bg-white/10 border border-white/15 backdrop-blur-md flex items-center justify-center text-white transition-all duration-300 group-hover:bg-white group-hover:text-black group-hover:rotate-45">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M7 17L17 7M17 7H7M17 7V17"
                  />
                </svg>
              </div>
            </div>

            {/* Bottom Content */}
            <div className="relative z-10 mt-16 sm:mt-20">
              <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-2.5">
                Quality Construction
              </h3>
              <p className="text-xs sm:text-sm text-zinc-300 font-normal leading-relaxed max-w-lg">
                High-grade reinforced concrete, precision steel framing, and certified non-toxic materials engineered by seasoned craftsmen. Rigorous multi-stage quality inspections guarantee structural longevity.
              </p>
            </div>
          </div>

          {/* ========================================================= */}
          {/* MIDDLE RIGHT: Transparent Pricing (Crisp White Card)      */}
          {/* ========================================================= */}
          <div
            ref={(el) => (cardRefs.current[3] = el)}
            style={{ transitionDelay: isVisible ? "360ms" : "0ms" }}
            className={`lg:col-span-6 group relative rounded-3xl p-7 sm:p-9 bg-white text-zinc-950 border border-zinc-200/90 flex flex-col justify-between min-h-[360px] shadow-[0_20px_50px_rgba(0,0,0,0.08)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.6)] transition-all duration-700 ease-out hover:scale-[1.01] hover:shadow-[0_25px_60px_rgba(0,0,0,0.15)] dark:hover:shadow-[0_25px_60px_rgba(0,0,0,0.7)] ${
              visibleCards[3]
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-10"
            }`}
          >
            {/* Top Bar */}
            <div className="flex items-center justify-between">
              <span className="px-3.5 py-1.5 rounded-full text-[11px] font-bold tracking-widest uppercase bg-zinc-100 border border-zinc-200 text-zinc-800">
                Pillar 03 / Financial Honesty
              </span>

              <div className="w-10 h-10 rounded-full bg-zinc-950 text-white flex items-center justify-center font-bold shadow-md transition-transform duration-300 group-hover:rotate-45">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M7 17L17 7M17 7H7M17 7V17"
                  />
                </svg>
              </div>
            </div>

            {/* Bottom Content */}
            <div className="mt-16 sm:mt-20">
              <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-950 mb-2.5">
                Transparent Pricing
              </h3>
              <p className="text-xs sm:text-sm text-zinc-600 font-medium leading-relaxed max-w-lg">
                Complete itemized bills of quantities (BOQ) with transparent material costs and labor allocations. Every phase is documented upfront with zero hidden margins or unexpected escalation fees.
              </p>
            </div>
          </div>

          {/* ========================================================= */}
          {/* BOTTOM LEFT: Expert Planning & Design                     */}
          {/* ========================================================= */}
          <div
            ref={(el) => (cardRefs.current[4] = el)}
            style={{ transitionDelay: isVisible ? "480ms" : "0ms" }}
            className={`lg:col-span-6 group relative rounded-3xl p-7 sm:p-9 bg-white dark:bg-[#121215] border border-black/[0.08] dark:border-white/[0.08] text-zinc-900 dark:text-white flex flex-col justify-between min-h-[320px] shadow-lg dark:shadow-2xl transition-all duration-700 ease-out hover:border-black/20 dark:hover:border-white/25 hover:shadow-xl dark:hover:shadow-[0_20px_50px_rgba(0,0,0,0.85)] ${
              visibleCards[4]
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-10"
            }`}
          >
            {/* Top Bar */}
            <div className="flex items-center justify-between">
              <span className="px-3.5 py-1.5 rounded-full text-[11px] font-mono tracking-widest uppercase text-zinc-700 dark:text-zinc-300 bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10">
                Pillar 04 / Engineering
              </span>

              <div className="w-10 h-10 rounded-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 flex items-center justify-center text-zinc-700 dark:text-zinc-300 transition-all duration-300 group-hover:bg-zinc-900 group-hover:text-white dark:group-hover:bg-white dark:group-hover:text-black group-hover:rotate-45">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M7 17L17 7M17 7H7M17 7V17"
                  />
                </svg>
              </div>
            </div>

            {/* Bottom Content */}
            <div className="mt-12 sm:mt-16">
              <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900 dark:text-white mb-2.5">
                Expert Planning & Design
              </h3>
              <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 font-normal leading-relaxed max-w-lg">
                Seamless coordination between licensed architects, structural engineers, and local zoning authorities. Advanced 3D BIM modeling prevents on-site clashes and streamlines approvals.
              </p>
            </div>
          </div>

          {/* ========================================================= */}
          {/* BOTTOM RIGHT: On-Time Project Delivery                    */}
          {/* ========================================================= */}
          <div
            ref={(el) => (cardRefs.current[5] = el)}
            style={{ transitionDelay: isVisible ? "600ms" : "0ms" }}
            className={`lg:col-span-6 group relative rounded-3xl p-7 sm:p-9 bg-white dark:bg-[#121215] border border-black/[0.08] dark:border-white/[0.08] text-zinc-900 dark:text-white flex flex-col justify-between min-h-[320px] shadow-lg dark:shadow-2xl transition-all duration-700 ease-out hover:border-black/20 dark:hover:border-white/25 hover:shadow-xl dark:hover:shadow-[0_20px_50px_rgba(0,0,0,0.85)] ${
              visibleCards[5]
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-10"
            }`}
          >
            {/* Top Bar */}
            <div className="flex items-center justify-between">
              <span className="px-3.5 py-1.5 rounded-full text-[11px] font-mono tracking-widest uppercase text-zinc-700 dark:text-zinc-300 bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10">
                Pillar 05 / Scheduling
              </span>

              <div className="w-10 h-10 rounded-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 flex items-center justify-center text-zinc-700 dark:text-zinc-300 transition-all duration-300 group-hover:bg-zinc-900 group-hover:text-white dark:group-hover:bg-white dark:group-hover:text-black group-hover:rotate-45">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M7 17L17 7M17 7H7M17 7V17"
                  />
                </svg>
              </div>
            </div>

            {/* Bottom Content */}
            <div className="mt-12 sm:mt-16">
              <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900 dark:text-white mb-2.5">
                On-Time Project Delivery
              </h3>
              <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 font-normal leading-relaxed max-w-lg">
                Agile construction timelines governed by critical-path project management. Daily site oversight and proactive material procurement ensure your handover date is met without compromises.
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

