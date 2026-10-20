"use client";

import { useEffect, useRef, useState, useCallback } from "react";

const TESTIMONIALS = [
  {
    id: 1,
    client: "Julian & Claire Sterling",
    projectType: "Custom Residential Construction",
    location: "Scottsdale, Arizona",
    scope: "Ground-up 5,200 sq.ft private estate with cast-in-place concrete and cantilevered steel.",
    quote:
      "From the initial BOQ to final handover, the financial transparency was extraordinary. Every material grade and inspection was documented with zero surprise costs. The structural precision in the concrete work and floor-to-ceiling glass integration exceeded every architectural drawing.",
    verifiedBadge: "Verified Client • New Build Contract",
    year: "Completed 2024",
    initials: "JS",
  },
  {
    id: 2,
    client: "Roberto & Elena Marchetti",
    projectType: "Turnkey Historic Villa Renovation",
    location: "Lake Como, Italy",
    scope: "Structural restoration, seismic reinforcement, and contemporary interior overhaul.",
    quote:
      "Renovating a hillside stone villa requires exceptional engineering competence. The team preserved the original masonry while introducing modern hidden MEP systems and minimalist steel frameworks. Delivered on schedule despite complex topography.",
    verifiedBadge: "Verified Client • Turnkey Renovation",
    year: "Completed 2023",
    initials: "RM",
  },
  {
    id: 3,
    client: "Kenji & Saki Takahashi",
    projectType: "Architectural Residence & Solarium",
    location: "Kyoto, Japan",
    scope: "Timber-frame hybrid residence with climate-regulated glass solarium.",
    quote:
      "Their respect for architectural craft and strict adherence to the critical-path schedule was remarkable. We received weekly photographic milestone reports, and the final snag inspection was spotless on day one.",
    verifiedBadge: "Verified Client • Custom House Build",
    year: "Completed 2024",
    initials: "KT",
  },
  {
    id: 4,
    client: "Arthur & Vivienne Vance",
    projectType: "Contract-Based Commercial Pavilion",
    location: "Zurich, Switzerland",
    scope: "High-spec multi-discipline studio and private architectural gallery.",
    quote:
      "Working with fixed turnkey contracts gave our investment board complete confidence. Their team managed zoning, structural engineering, and finish craftsmanship seamlessly without any administrative friction.",
    verifiedBadge: "Verified Client • Commercial Contract",
    year: "Completed 2023",
    initials: "AV",
  },
];

export default function ClientTestimonials() {
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(null);

  const total = TESTIMONIALS.length;

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

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % total);
  }, [total]);

  const handlePrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + total) % total);
  }, [total]);

  // Touch handlers for mobile swipe
  const handleTouchStart = (e) => {
    setTouchStart(e.touches[0].clientX);
  };

  const handleTouchEnd = (e) => {
    if (!touchStart) return;
    const touchEnd = e.changedTouches[0].clientX;
    const diff = touchStart - touchEnd;
    if (diff > 45) {
      handleNext();
    } else if (diff < -45) {
      handlePrev();
    }
    setTouchStart(null);
  };

  const activeItem = TESTIMONIALS[currentIndex];

  return (
    <section
      ref={sectionRef}
      id="testimonials"
      className="relative z-30 w-full bg-[#faf8f5] dark:bg-[#09090b] text-zinc-900 dark:text-zinc-100 pt-12 sm:pt-16 lg:pt-20 pb-12 sm:pb-16 lg:pb-20 px-5 sm:px-10 lg:px-16 overflow-hidden border-t border-black/[0.06] dark:border-white/[0.06] transition-colors duration-300"
    >
      {/* Background Architectural Noise & Gradients */}
      <div className="absolute inset-0 bg-[radial-gradient(#ffffff08_1px,transparent_1px)] [background-size:28px_28px] pointer-events-none" />
      <div className="absolute top-1/3 left-1/4 w-[500px] h-[500px] bg-black/[0.012] dark:bg-white/[0.012] rounded-full blur-[160px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto">
        {/* Header Row with Slider Navigation Buttons */}
        <div
          className={`flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12 sm:mb-16 transition-all duration-700 ease-out ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="inline-flex items-center px-3.5 py-1.5 rounded-full text-[11px] font-semibold tracking-widest uppercase bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 text-zinc-700 dark:text-zinc-300">
                Client Experiences
              </span>
              <span className="inline-flex items-center px-3.5 py-1.5 rounded-full text-[11px] font-semibold tracking-widest uppercase bg-[#D4AF37]/15 dark:bg-[#D4AF37]/10 border border-[#D4AF37]/30 dark:border-[#D4AF37]/25 text-[#8F6B32] dark:text-[#E7C982]">
                Verified Reviews
              </span>
            </div>

            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tight text-zinc-900 dark:text-white leading-[1.05]">
              Trusted By Homeowners <br className="hidden sm:inline" />
              <span className="text-transparent [-webkit-text-stroke:1.5px_#18181b] sm:[-webkit-text-stroke:2px_#18181b] dark:[-webkit-text-stroke:1.5px_#ffffff] dark:sm:[-webkit-text-stroke:2px_#ffffff]">
                & Developers
              </span>
            </h2>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center gap-3 self-start sm:self-end">
            <span className="font-mono text-xs text-zinc-500 dark:text-zinc-400 mr-2">
              <span className="text-zinc-900 dark:text-white font-bold">{currentIndex + 1}</span>
              {" / "}
              <span>{total}</span>
            </span>

            <button
              onClick={handlePrev}
              aria-label="Previous testimonial"
              className="w-12 h-12 rounded-full border border-black/10 dark:border-white/10 bg-white dark:bg-[#121215] flex items-center justify-center text-zinc-700 dark:text-zinc-300 hover:text-black dark:hover:text-white hover:border-black/25 dark:hover:border-white/30 hover:bg-black/5 dark:hover:bg-white/5 transition-all active:scale-95 shadow-sm"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>

            <button
              onClick={handleNext}
              aria-label="Next testimonial"
              className="w-12 h-12 rounded-full border border-[#D4AF37]/40 bg-gradient-to-br from-[#E7C982] to-[#D4AF37] text-black flex items-center justify-center font-bold hover:shadow-[0_0_22px_rgba(212,175,55,0.45)] transition-all active:scale-95"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Testimonial Active Display Area with Touch Swiping */}
        <div
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          className={`relative rounded-3xl p-7 sm:p-12 lg:p-16 bg-white/95 dark:bg-[#121215]/90 border border-black/[0.08] dark:border-white/[0.08] backdrop-blur-xl shadow-xl dark:shadow-2xl transition-all duration-700 ease-out ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          {/* Subtle Watermark Quote Mark */}
          <div className="absolute top-6 right-8 sm:top-10 sm:right-12 text-black/[0.03] dark:text-white/[0.03] select-none pointer-events-none font-serif text-8xl sm:text-9xl leading-none">
            “
          </div>

          <div className="relative z-10 flex flex-col justify-between min-h-[280px]">
            {/* Top Row: Verified Badge and Project Scope */}
            <div className="flex flex-wrap items-center justify-between gap-3 mb-8">
              <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 text-zinc-700 dark:text-zinc-300">
                <span className="w-2 h-2 rounded-full bg-[#D4AF37] shadow-[0_0_8px_rgba(212,175,55,0.8)] animate-pulse" />
                {activeItem.verifiedBadge}
              </span>
              <span className="text-xs font-mono text-zinc-500 dark:text-zinc-400">
                {activeItem.year}
              </span>
            </div>

            {/* Testimonial Quote */}
            <blockquote className="text-lg sm:text-2xl lg:text-3xl font-medium text-zinc-900 dark:text-white tracking-tight leading-relaxed sm:leading-snug mb-10">
              “{activeItem.quote}”
            </blockquote>

            {/* Client Info and Project Details Footer */}
            <div className="pt-6 sm:pt-8 border-t border-black/[0.08] dark:border-white/[0.08] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                {/* Initials Avatar */}
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-black/5 to-black/10 dark:from-white/15 dark:to-white/5 border border-black/10 dark:border-white/15 flex items-center justify-center font-mono font-bold text-sm text-[#8F6B32] dark:text-[#E7C982] shrink-0">
                  {activeItem.initials}
                </div>

                <div>
                  <h4 className="text-base sm:text-lg font-bold text-zinc-900 dark:text-white tracking-tight">
                    {activeItem.client}
                  </h4>
                  <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400">
                    {activeItem.location}
                  </p>
                </div>
              </div>

              {/* Project Type Badge */}
              <div className="text-left sm:text-right">
                <p className="text-[11px] font-mono uppercase tracking-wider text-zinc-500 dark:text-zinc-400 font-medium">
                  Commissioned Scope
                </p>
                <p className="text-xs sm:text-sm font-semibold text-[#8F6B32] dark:text-[#E7C982] mt-0.5">
                  {activeItem.projectType}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Thumbnail Selector / Dots for Quick Jump */}
        <div className="flex items-center justify-center gap-2.5 mt-8">
          {TESTIMONIALS.map((item, idx) => (
            <button
              key={item.id}
              onClick={() => setCurrentIndex(idx)}
              aria-label={`Jump to review by ${item.client}`}
              className={`h-2 rounded-full transition-all duration-300 ${
                currentIndex === idx
                  ? "w-10 bg-[#D4AF37] shadow-[0_0_10px_rgba(212,175,55,0.5)]"
                  : "w-2.5 bg-black/15 dark:bg-white/20 hover:bg-black/30 dark:hover:bg-white/40"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

