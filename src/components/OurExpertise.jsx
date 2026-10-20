"use client";

import { useEffect, useRef, useState, useCallback } from "react";

const SERVICES = [
  {
    id: 1,
    tag: "01 / Concept & Schematics",
    title: "Architecture & Design",
    description:
      "Translating raw topography and natural light into visionary spatial forms. From schematic concepts to fully realized blueprints that harmonize with their environment.",
    image: "/frames/frame_045.jpg",
    colSpan: "sm:col-span-2 lg:col-span-7",
    minHeight: "min-h-[360px] sm:min-h-[390px] lg:min-h-[420px]",
    badge: "Principal Discipline",
  },
  {
    id: 2,
    tag: "02 / Craft & Structural",
    title: "Residential Construction",
    description:
      "Engineering bespoke private estates with artisanal precision, sustainable materials, and uncompromising structural integrity built to endure generations.",
    image: "/frames/frame_125.jpg",
    colSpan: "sm:col-span-1 lg:col-span-5",
    minHeight: "min-h-[360px] sm:min-h-[390px] lg:min-h-[420px]",
    badge: "Turnkey Estates",
  },
  {
    id: 3,
    tag: "03 / Scale & Civic",
    title: "Commercial Buildings",
    description:
      "Designing progressive commercial headquarters, pavilions, and mixed-use structures tailored for collaborative energy and operational excellence.",
    image: "/frames/frame_215.jpg",
    colSpan: "sm:col-span-1 lg:col-span-4",
    minHeight: "min-h-[340px] sm:min-h-[390px] lg:min-h-[380px]",
    badge: "Urban Architecture",
  },
  {
    id: 4,
    tag: "04 / Materiality & Light",
    title: "Interior Design",
    description:
      "Curating tactile interior volumes with bespoke millwork, concealed illumination, and timeless material palettes that evoke quiet serenity.",
    image: "/frames/frame_295.jpg",
    colSpan: "sm:col-span-1 lg:col-span-4",
    minHeight: "min-h-[340px] sm:min-h-[390px] lg:min-h-[380px]",
    badge: "Atmosphere & Detail",
  },
  {
    id: 5,
    tag: "05 / Adaptive Restoration",
    title: "Renovation",
    description:
      "Reimagining historic structures through surgical modern interventions, revitalizing architectural heritage with contemporary spatial clarity.",
    image: "/frames/frame_345.jpg",
    colSpan: "sm:col-span-1 lg:col-span-4",
    minHeight: "min-h-[340px] sm:min-h-[390px] lg:min-h-[380px]",
    badge: "Heritage Revitalization",
  },
];

const TOTAL_SERVICES = SERVICES.length;
// Triplicate array for infinite seamless looping in both directions
const EXTENDED_SERVICES = [...SERVICES, ...SERVICES, ...SERVICES];

export default function OurExpertise() {
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  // Mobile infinite carousel state
  // Start at index TOTAL_SERVICES (5) which is the first slide of the middle set
  const [currentIndex, setCurrentIndex] = useState(TOTAL_SERVICES);
  const [isTransitioning, setIsTransitioning] = useState(true);
  const [viewportWidth, setViewportWidth] = useState(375);
  const [dragOffset, setDragOffset] = useState(0);

  const isInteractingRef = useRef(false);
  const resumeTimerRef = useRef(null);
  const isSectionInViewRef = useRef(false);

  const touchStartXRef = useRef(0);
  const touchStartYRef = useRef(0);
  const touchStartTimeRef = useRef(0);
  const isHorizontalSwipeRef = useRef(null);

  // Desktop reveal animation observer & section visibility tracker
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          isSectionInViewRef.current = true;
        } else {
          isSectionInViewRef.current = false;
        }
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -40px 0px",
      }
    );

    const currentSection = sectionRef.current;
    if (currentSection) {
      observer.observe(currentSection);
    }

    return () => {
      if (currentSection) {
        observer.unobserve(currentSection);
      }
    };
  }, []);

  // Update viewport width on resize
  useEffect(() => {
    const updateWidth = () => {
      if (typeof window !== "undefined") {
        setViewportWidth(window.innerWidth);
      }
    };
    updateWidth();
    window.addEventListener("resize", updateWidth, { passive: true });
    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  const nextSlide = useCallback(() => {
    setIsTransitioning(true);
    setCurrentIndex((prev) => prev + 1);
  }, []);

  const prevSlide = useCallback(() => {
    setIsTransitioning(true);
    setCurrentIndex((prev) => prev - 1);
  }, []);

  // When transition ends at boundaries, seamlessly snap without animation
  const handleTransitionEnd = useCallback(() => {
    setCurrentIndex((current) => {
      if (current >= TOTAL_SERVICES * 2) {
        setIsTransitioning(false);
        return current - TOTAL_SERVICES;
      } else if (current < TOTAL_SERVICES) {
        setIsTransitioning(false);
        return current + TOTAL_SERVICES;
      }
      return current;
    });
  }, []);

  // Re-enable smooth transition on the frame after an instant teleport
  useEffect(() => {
    if (!isTransitioning) {
      const rafId = requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setIsTransitioning(true);
        });
      });
      return () => cancelAnimationFrame(rafId);
    }
  }, [isTransitioning]);

  // Mobile Auto-Play loop (2.8 seconds per slide)
  useEffect(() => {
    if (viewportWidth >= 640) return;

    const interval = setInterval(() => {
      if (
        !isInteractingRef.current &&
        isSectionInViewRef.current &&
        document.visibilityState === "visible"
      ) {
        nextSlide();
      }
    }, 2800);

    return () => clearInterval(interval);
  }, [nextSlide, viewportWidth]);

  // Touch gesture handlers for mobile swipe
  const handleTouchStart = (e) => {
    isInteractingRef.current = true;
    if (resumeTimerRef.current) {
      clearTimeout(resumeTimerRef.current);
      resumeTimerRef.current = null;
    }

    touchStartXRef.current = e.touches[0].clientX;
    touchStartYRef.current = e.touches[0].clientY;
    touchStartTimeRef.current = Date.now();
    isHorizontalSwipeRef.current = null;
    setIsTransitioning(false);
  };

  const handleTouchMove = (e) => {
    const currentX = e.touches[0].clientX;
    const currentY = e.touches[0].clientY;
    const diffX = currentX - touchStartXRef.current;
    const diffY = currentY - touchStartYRef.current;

    if (isHorizontalSwipeRef.current === null) {
      if (Math.abs(diffX) > 8 || Math.abs(diffY) > 8) {
        isHorizontalSwipeRef.current = Math.abs(diffX) > Math.abs(diffY);
      }
    }

    if (isHorizontalSwipeRef.current) {
      setDragOffset(diffX);
    }
  };

  const handleTouchEnd = () => {
    const diffX = dragOffset;
    const duration = Date.now() - touchStartTimeRef.current;
    const isQuickFlick = duration < 300 && Math.abs(diffX) > 25;
    const isSignificantDrag = Math.abs(diffX) > 50;

    setIsTransitioning(true);
    setDragOffset(0);

    if (isHorizontalSwipeRef.current) {
      if (diffX < 0 && (isSignificantDrag || isQuickFlick)) {
        setCurrentIndex((prev) => prev + 1);
      } else if (diffX > 0 && (isSignificantDrag || isQuickFlick)) {
        setCurrentIndex((prev) => prev - 1);
      }
    }

    // Resume auto-play after 2.8s of inactivity
    resumeTimerRef.current = setTimeout(() => {
      isInteractingRef.current = false;
    }, 2800);
  };

  // Mobile layout calculations
  const cardWidth = Math.min(viewportWidth * 0.78, 315);
  const gap = 14;
  const stepWidth = cardWidth + gap;
  const centerOffset = (viewportWidth - cardWidth) / 2;
  const translateX = centerOffset - currentIndex * stepWidth + dragOffset;
  const activeServiceIndex =
    ((currentIndex % TOTAL_SERVICES) + TOTAL_SERVICES) % TOTAL_SERVICES;

  return (
    <section
      ref={sectionRef}
      id="expertise"
      className="relative z-30 sm:z-20 lg:z-30 w-full bg-[#faf8f5] dark:bg-[#09090b] text-zinc-900 dark:text-zinc-100 pt-8 sm:pt-14 md:pt-16 lg:pt-28 pb-12 sm:pb-16 lg:pb-20 px-5 sm:px-10 lg:px-16 overflow-x-clip transition-colors duration-300"
    >
      {/* Ambient Lighting Gradients */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-amber-500/[0.03] dark:bg-indigo-500/[0.03] rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[500px] h-[400px] bg-black/[0.015] dark:bg-white/[0.015] rounded-full blur-[140px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto">
        {/* Section Header */}
        <div
          className={`flex flex-col md:flex-row md:items-end md:justify-between gap-5 sm:gap-6 mb-8 sm:mb-12 lg:mb-20 transition-all duration-700 ease-out ${
            isVisible
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-8"
          }`}
        >
          <div className="max-w-2xl">
            {/* Category Badges */}
            <div className="flex items-center gap-2.5 mb-3 sm:mb-5">
              <span className="inline-flex items-center px-3.5 py-1.5 rounded-full text-[11px] font-semibold tracking-widest uppercase bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 text-zinc-700 dark:text-zinc-300 backdrop-blur-md">
                Disciplines
              </span>
              <span className="inline-flex items-center px-3.5 py-1.5 rounded-full text-[11px] font-semibold tracking-widest uppercase bg-[#D4AF37]/15 dark:bg-[#D4AF37]/10 border border-[#D4AF37]/30 dark:border-[#D4AF37]/25 text-[#8F6B32] dark:text-[#E7C982] backdrop-blur-md">
                Services
              </span>
            </div>

            {/* Eyebrow */}
            <p className="text-[10px] sm:text-[11px] font-bold tracking-[0.24em] uppercase text-zinc-500 dark:text-zinc-400 mb-1.5 sm:mb-2 lg:mb-3">
              Our Expertise
            </p>

            {/* Headline */}
            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tight text-zinc-900 dark:text-white leading-[1.02]">
              What <br className="hidden sm:inline" />
              <span className="text-transparent [-webkit-text-stroke:1.5px_#18181b] sm:[-webkit-text-stroke:2px_#18181b] lg:[-webkit-text-stroke:2.5px_#18181b] dark:[-webkit-text-stroke:1.5px_#ffffff] dark:sm:[-webkit-text-stroke:2px_#ffffff] dark:lg:[-webkit-text-stroke:2.5px_#ffffff]">
                We Do
              </span>
              <span className="text-[#D4AF37] ml-1">.</span>
            </h2>
          </div>

          {/* Subtitle / Architectural Statement */}
          <p className="text-xs sm:text-sm lg:text-base text-zinc-600 dark:text-zinc-400 font-normal leading-relaxed max-w-md md:text-right">
            From visionary master planning to bespoke residential sanctuaries, we shape spaces that inspire enduring human experience through light, texture, and structural honesty.
          </p>
        </div>

        {/* ======================================================== */}
        {/* DESKTOP & TABLET: Responsive Bento Grid (Unchanged)      */}
        {/* ======================================================== */}
        <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-12 gap-5 sm:gap-6 lg:gap-7">
          {SERVICES.map((service, index) => {
            const delayMs = index * 120;

            return (
              <div
                key={service.id}
                style={{
                  transitionDelay: isVisible ? `${delayMs}ms` : "0ms",
                }}
                className={`group relative rounded-3xl overflow-hidden border border-black/[0.08] dark:border-white/[0.08] bg-zinc-900 shadow-xl dark:shadow-2xl transition-all duration-700 ease-out hover:border-black/20 dark:hover:border-white/25 hover:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.3)] dark:hover:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)] ${
                  service.colSpan
                } ${service.minHeight} ${
                  isVisible
                    ? "opacity-100 translate-y-0 scale-100"
                    : "opacity-0 translate-y-12 scale-[0.98]"
                } flex flex-col justify-between p-6 sm:p-8 lg:p-9`}
              >
                {/* Background Image with Zoom on Hover */}
                <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={service.image}
                    alt={service.title}
                    width={640}
                    height={400}
                    decoding="async"
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    loading="lazy"
                  />
                  {/* Deep Multi-Stop Gradient Overlay for legibility & contrast */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#09090b]/95 via-[#09090b]/60 to-black/30 group-hover:via-[#09090b]/50 transition-colors duration-500" />
                </div>

                {/* Top Bar: Tag & Interactive Arrow */}
                <div className="relative z-10 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 rounded-full text-[10px] sm:text-[11px] font-mono tracking-widest uppercase text-zinc-300 bg-white/5 border border-white/10 backdrop-blur-md">
                      {service.tag}
                    </span>
                  </div>

                  {/* Minimalist Interactive Circle Arrow */}
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/5 border border-white/10 backdrop-blur-md flex items-center justify-center text-zinc-300 group-hover:bg-white group-hover:text-zinc-950 group-hover:border-white transition-all duration-300 shadow-md shrink-0">
                    <svg
                      className="w-4 h-4 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300"
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

                {/* Bottom Content: Title, Description, and Badge */}
                <div className="relative z-10 mt-12 sm:mt-16">
                  {/* Subtle Badge */}
                  <p className="text-[11px] font-mono uppercase tracking-[0.2em] text-zinc-400 mb-2">
                    {service.badge}
                  </p>

                  {/* Service Title */}
                  <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-2.5 sm:mb-3 group-hover:text-zinc-100 transition-colors">
                    {service.title}
                  </h3>

                  {/* Short Architectural Description */}
                  <p className="text-xs sm:text-sm text-zinc-300 font-normal leading-relaxed max-w-lg">
                    {service.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* ======================================================== */}
        {/* MOBILE: Smooth Infinite Horizontal Auto-Playing Carousel */}
        {/* ======================================================== */}
        <div className="block sm:hidden relative -mx-5 overflow-x-clip overflow-y-visible pt-2 pb-4">
          {/* Touch Swiping Container */}
          <div
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            className="w-full overflow-x-clip overflow-y-visible select-none touch-pan-y"
          >
            {/* Sliding Track */}
            <div
              onTransitionEnd={handleTransitionEnd}
              className="flex gap-3.5 will-change-transform pt-2 pb-10"
              style={{
                transform: `translate3d(${translateX}px, 0, 0)`,
                transition: isTransitioning
                  ? "transform 500ms cubic-bezier(0.25, 1, 0.5, 1)"
                  : "none",
              }}
            >
              {EXTENDED_SERVICES.map((service, index) => {
                const isActive = index === currentIndex;

                return (
                  <div
                    key={`${service.id}-${index}`}
                    onClick={() => {
                      if (!isActive) {
                        setIsTransitioning(true);
                        setCurrentIndex(index);
                        isInteractingRef.current = true;
                        if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
                        resumeTimerRef.current = setTimeout(() => {
                          isInteractingRef.current = false;
                        }, 2800);
                      }
                    }}
                    className={`shrink-0 w-[78vw] max-w-[315px] rounded-3xl bg-white dark:bg-[#141418] border border-black/[0.08] dark:border-white/[0.08] p-4 flex flex-col justify-between select-none cursor-pointer transition-all duration-500 ease-out ${
                      isActive
                        ? "scale-100 opacity-100 shadow-[0_16px_36px_-6px_rgba(0,0,0,0.14),0_6px_16px_-2px_rgba(0,0,0,0.08)] dark:shadow-[0_20px_45px_rgba(0,0,0,0.7)] border-black/[0.14] dark:border-white/[0.22]"
                        : "scale-[0.93] opacity-65 shadow-sm border-black/[0.06] dark:border-white/[0.06]"
                    }`}
                    style={{
                      transformOrigin: "center center",
                    }}
                  >
                    {/* Top Architectural Image */}
                    <div className="relative w-full aspect-[16/10] rounded-2xl overflow-hidden bg-zinc-100 dark:bg-zinc-900">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={service.image}
                        alt={service.title}
                        width={315}
                        height={197}
                        decoding="async"
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
                    </div>

                    {/* Card Body */}
                    <div className="mt-4 flex flex-col flex-1 justify-between">
                      <div>
                        {/* Service Title */}
                        <h3 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-white mb-1.5">
                          {service.title}
                        </h3>

                        {/* Tag with Subtitle Indicator */}
                        <div className="flex items-center gap-1.5 text-zinc-500 dark:text-zinc-400 text-xs mb-3">
                          <svg
                            className="w-3.5 h-3.5 text-zinc-400 shrink-0"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                          </svg>
                          <span className="font-medium truncate">
                            {service.tag}
                          </span>
                        </div>

                        {/* "Description" label and paragraph */}
                        <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 mb-1">
                          Description
                        </p>
                        <p className="text-xs text-zinc-600 dark:text-zinc-300 font-normal leading-relaxed line-clamp-3">
                          {service.description}
                        </p>
                      </div>

                      {/* Footer: Discipline Badge & Circular Action Button */}
                      <div className="mt-5 pt-3.5 border-t border-black/5 dark:border-white/5 flex items-center justify-between">
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-mono tracking-wider text-zinc-700 dark:text-zinc-300 bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10">
                          {service.badge}
                        </span>

                        {/* Circular Action Button */}
                        <div className="w-8 h-8 rounded-full bg-zinc-900 text-white dark:bg-white dark:text-zinc-950 flex items-center justify-center font-bold shadow-md shrink-0">
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
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Carousel Navigation Bar: Dots & Prev/Next Controls */}
          <div className="flex items-center justify-between px-6 pt-0">
            {/* Step Counter */}
            <span className="font-mono text-xs text-zinc-500 dark:text-zinc-400">
              <span className="font-bold text-zinc-900 dark:text-white">
                0{activeServiceIndex + 1}
              </span>
              {" / "}
              <span>0{TOTAL_SERVICES}</span>
            </span>

            {/* Pagination Indicator Dots */}
            <div className="flex items-center gap-1.5">
              {SERVICES.map((_, i) => {
                const isDotActive = activeServiceIndex === i;

                return (
                  <button
                    key={i}
                    aria-label={`Go to slide ${i + 1}`}
                    onClick={() => {
                      setIsTransitioning(true);
                      const currentModulo =
                        ((currentIndex % TOTAL_SERVICES) + TOTAL_SERVICES) %
                        TOTAL_SERVICES;
                      const diff = i - currentModulo;
                      setCurrentIndex((prev) => prev + diff);

                      isInteractingRef.current = true;
                      if (resumeTimerRef.current)
                        clearTimeout(resumeTimerRef.current);
                      resumeTimerRef.current = setTimeout(() => {
                        isInteractingRef.current = false;
                      }, 2800);
                    }}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      isDotActive
                        ? "w-6 bg-[#D4AF37]"
                        : "w-2 bg-black/15 dark:bg-white/20"
                    }`}
                  />
                );
              })}
            </div>

            {/* Prev / Next Minimalist Arrow Controls */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  prevSlide();
                  isInteractingRef.current = true;
                  if (resumeTimerRef.current)
                    clearTimeout(resumeTimerRef.current);
                  resumeTimerRef.current = setTimeout(() => {
                    isInteractingRef.current = false;
                  }, 2800);
                }}
                aria-label="Previous slide"
                className="w-8 h-8 rounded-full border border-black/10 dark:border-white/10 bg-white dark:bg-[#141418] flex items-center justify-center text-zinc-700 dark:text-zinc-300 hover:text-black dark:hover:text-white transition-all active:scale-95 shadow-sm"
              >
                <svg
                  className="w-3.5 h-3.5"
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
                onClick={() => {
                  nextSlide();
                  isInteractingRef.current = true;
                  if (resumeTimerRef.current)
                    clearTimeout(resumeTimerRef.current);
                  resumeTimerRef.current = setTimeout(() => {
                    isInteractingRef.current = false;
                  }, 2800);
                }}
                aria-label="Next slide"
                className="w-8 h-8 rounded-full border border-black/10 dark:border-white/10 bg-white dark:bg-[#141418] flex items-center justify-center text-zinc-700 dark:text-zinc-300 hover:text-black dark:hover:text-white transition-all active:scale-95 shadow-sm"
              >
                <svg
                  className="w-3.5 h-3.5"
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
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
