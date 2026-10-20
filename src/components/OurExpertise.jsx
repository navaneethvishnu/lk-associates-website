"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useTheme } from "@/context/ThemeContext";

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

// Controlled stepped progress with quintic smootherstep and resting plateaus
const getSteppedProgress = (rawProgress, totalSteps) => {
  const scaled = rawProgress * totalSteps;
  const index = Math.floor(scaled);
  if (index >= totalSteps) return totalSteps;
  const f = scaled - index; // fraction within step [0, 1)

  // 36% of each interval is a solid resting plateau at the exact card position
  const plateau = 0.18;
  if (f <= plateau) {
    return index;
  }
  if (f >= 1 - plateau) {
    return index + 1;
  }

  // Smooth quintic smootherstep (zero velocity and zero acceleration at endpoints)
  const t = (f - plateau) / (1 - 2 * plateau);
  const eased = t * t * t * (t * (t * 6 - 15) + 10);
  return index + eased;
};

export default function OurExpertise() {
  const sectionRef = useRef(null);
  const mobileTrackRef = useRef(null);
  const stickyContainerRef = useRef(null);
  const cardsTrackRef = useRef(null);
  const mobileCardRefs = useRef([]);
  const targetPositionRef = useRef(0);
  const currentPositionRef = useRef(0);
  const animationFrameIdRef = useRef(null);
  const snapTimeoutRef = useRef(null);
  const isAutoScrollingRef = useRef(false);
  const touchStartYRef = useRef(0);
  const touchStartTimeRef = useRef(0);

  const [isVisible, setIsVisible] = useState(false);

  // Desktop reveal animation observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
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

    return () => {
      if (currentSection) {
        observer.unobserve(currentSection);
      }
    };
  }, []);

  // Update card positions, scale, opacity, and active state smoothly
  const applyCardTransforms = useCallback((pos) => {
    if (!cardsTrackRef.current) return;
    const windowWidth = typeof window !== "undefined" ? window.innerWidth : 375;
    const cardWidth = Math.min(windowWidth * 0.78, 315);
    const gap = 14;
    const stepWidth = cardWidth + gap;
    const initialOffset = (windowWidth - cardWidth) / 2;

    // Center the active continuous progress card in the viewport
    const translateX = initialOffset - pos * stepWidth;
    cardsTrackRef.current.style.transform = `translate3d(${translateX}px, 0, 0)`;

    // Scale and opacity adjustments based on distance to center
    mobileCardRefs.current.forEach((cardEl, idx) => {
      if (!cardEl) return;
      const dist = Math.abs(idx - pos);
      const scale = Math.max(0.92, 1 - dist * 0.08);
      const opacity = Math.max(0.50, 1 - dist * 0.50);

      cardEl.style.transform = `scale(${scale})`;
      cardEl.style.opacity = `${opacity}`;

      const isDark =
        typeof document !== "undefined" &&
        document.documentElement.classList.contains("dark");

      if (isDark) {
        // Dark mode: preserve existing high-contrast deep shadow and light border
        if (dist < 0.45) {
          cardEl.style.borderColor = "rgba(255, 255, 255, 0.25)";
          cardEl.style.boxShadow = "0 25px 50px rgba(0, 0, 0, 0.85)";
        } else {
          cardEl.style.borderColor = "rgba(255, 255, 255, 0.08)";
          cardEl.style.boxShadow = "0 10px 25px rgba(0, 0, 0, 0.4)";
        }
      } else {
        // Mobile Light Mode: soft, diffused, natural elevation with negative spread to prevent hard cutoff
        if (dist < 0.45) {
          cardEl.style.borderColor = "rgba(0, 0, 0, 0.12)";
          cardEl.style.boxShadow =
            "0 14px 30px -6px rgba(0, 0, 0, 0.12), 0 4px 12px -2px rgba(0, 0, 0, 0.06)";
        } else {
          cardEl.style.borderColor = "rgba(0, 0, 0, 0.06)";
          cardEl.style.boxShadow =
            "0 6px 16px -4px rgba(0, 0, 0, 0.07), 0 2px 6px -1px rgba(0, 0, 0, 0.03)";
        }
      }
    });
  }, []);

  // Re-apply card shadows and borders immediately when theme toggles
  const { theme } = useTheme();
  useEffect(() => {
    if (typeof window !== "undefined" && window.innerWidth < 640) {
      applyCardTransforms(currentPositionRef.current);
    }
  }, [theme, applyCardTransforms]);

  // Smooth scroll page to a specific mobile card index
  const scrollToMobileCard = useCallback((index) => {
    if (typeof window === "undefined") return;
    const track = mobileTrackRef.current;
    if (!track) return;

    const rect = track.getBoundingClientRect();
    const currentScrollY = window.scrollY;
    const stickyTop = 56;
    const trackTopInDoc = currentScrollY + rect.top;
    const stickyEl = stickyContainerRef.current;
    const stickyHeight = stickyEl ? stickyEl.offsetHeight : 500;
    const maxScroll = track.offsetHeight - stickyHeight;
    if (maxScroll <= 0) return;

    const numSteps = SERVICES.length - 1;
    const targetIndex = Math.min(Math.max(index, 0), numSteps);
    const targetProgress = targetIndex / numSteps;
    const targetScrollY = trackTopInDoc - stickyTop + targetProgress * maxScroll;

    isAutoScrollingRef.current = true;
    window.scrollTo({
      top: targetScrollY,
      behavior: "smooth",
    });

    setTimeout(() => {
      isAutoScrollingRef.current = false;
    }, 450);
  }, []);

  // Mandatory scroll-settle: snaps cleanly to nearest card if user stops mid-transition
  const handleScrollSettle = useCallback(() => {
    if (isAutoScrollingRef.current) return;
    if (typeof window === "undefined" || window.innerWidth >= 640) return;
    const track = mobileTrackRef.current;
    if (!track) return;

    const rect = track.getBoundingClientRect();
    const stickyTop = 56;
    const stickyEl = stickyContainerRef.current;
    const stickyHeight = stickyEl ? stickyEl.offsetHeight : 500;
    const maxScroll = track.offsetHeight - stickyHeight;
    if (maxScroll <= 0) return;

    const scrollY = stickyTop - rect.top;
    const rawProgress = scrollY / maxScroll;

    // Do not trap user when entering from top or exiting to bottom
    if (rawProgress <= 0.03 || rawProgress >= 0.97) return;

    const numSteps = SERVICES.length - 1;
    const continuousCard = rawProgress * numSteps;
    const targetIndex = Math.min(
      Math.max(Math.round(continuousCard), 0),
      numSteps
    );

    // If already settled at an exact snap point, no action needed
    if (Math.abs(continuousCard - targetIndex) < 0.03) return;

    const currentScrollY = window.scrollY;
    const trackTopInDoc = currentScrollY + rect.top;
    const targetScrollY =
      trackTopInDoc - stickyTop + (targetIndex / numSteps) * maxScroll;

    isAutoScrollingRef.current = true;
    window.scrollTo({
      top: targetScrollY,
      behavior: "smooth",
    });

    setTimeout(() => {
      isAutoScrollingRef.current = false;
    }, 450);
  }, []);

  // Mobile scroll-driven animation synchronization & snapping (On-demand RAF)
  useEffect(() => {
    const isMobile = () => typeof window !== "undefined" && window.innerWidth < 640;

    const startRenderLoop = () => {
      if (!isMobile() || animationFrameIdRef.current) return;

      const renderLoop = () => {
        if (!isMobile()) {
          animationFrameIdRef.current = null;
          return;
        }

        const track = mobileTrackRef.current;
        if (track) {
          const rect = track.getBoundingClientRect();
          if (rect.bottom < -200 || rect.top > window.innerHeight + 200) {
            animationFrameIdRef.current = null;
            return;
          }
        }

        const target = targetPositionRef.current;
        const current = currentPositionRef.current;
        const diff = target - current;

        if (Math.abs(diff) > 0.0005) {
          currentPositionRef.current += diff * 0.16;
          applyCardTransforms(currentPositionRef.current);
          animationFrameIdRef.current = requestAnimationFrame(renderLoop);
        } else {
          if (current !== target) {
            currentPositionRef.current = target;
            applyCardTransforms(target);
          }
          animationFrameIdRef.current = null;
        }
      };

      animationFrameIdRef.current = requestAnimationFrame(renderLoop);
    };

    const onScroll = () => {
      if (!isMobile()) return;
      const track = mobileTrackRef.current;
      if (!track) return;

      const rect = track.getBoundingClientRect();
      if (rect.bottom < -100 || rect.top > window.innerHeight + 100) return;

      const stickyTop = 56; // 3.5rem (top-14)
      const stickyEl = stickyContainerRef.current;
      const stickyHeight = stickyEl ? stickyEl.offsetHeight : 500;
      const maxScroll = track.offsetHeight - stickyHeight;
      if (maxScroll <= 0) return;

      const scrollY = stickyTop - rect.top;
      const rawProgress = Math.min(Math.max(scrollY / maxScroll, 0), 1);
      targetPositionRef.current = getSteppedProgress(
        rawProgress,
        SERVICES.length - 1
      );

      startRenderLoop();

      // Debounce timer: settle to exact snap point whenever scrolling stops
      if (snapTimeoutRef.current) {
        clearTimeout(snapTimeoutRef.current);
      }

      if (!isAutoScrollingRef.current) {
        snapTimeoutRef.current = setTimeout(() => {
          handleScrollSettle();
        }, 120);
      }
    };

    if (isMobile()) {
      onScroll();
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (snapTimeoutRef.current) {
        clearTimeout(snapTimeoutRef.current);
      }
      if (animationFrameIdRef.current) {
        cancelAnimationFrame(animationFrameIdRef.current);
        animationFrameIdRef.current = null;
      }
    };
  }, [applyCardTransforms, handleScrollSettle]);

  // Touch gesture handlers: advance exactly one card per swipe gesture
  const handleTouchStart = (e) => {
    touchStartYRef.current = e.touches[0].clientY;
    touchStartTimeRef.current = Date.now();
  };

  const handleTouchEnd = (e) => {
    if (isAutoScrollingRef.current) return;
    const touchEndY = e.changedTouches[0].clientY;
    const deltaY = touchStartYRef.current - touchEndY;
    const deltaTime = Date.now() - touchStartTimeRef.current;

    // Detect deliberate vertical swipe gestures
    if (Math.abs(deltaY) > 35 && deltaTime < 650) {
      const track = mobileTrackRef.current;
      if (!track) return;

      const rect = track.getBoundingClientRect();
      const stickyTop = 56;
      const stickyEl = stickyContainerRef.current;
      const stickyHeight = stickyEl ? stickyEl.offsetHeight : 500;
      const maxScroll = track.offsetHeight - stickyHeight;
      if (maxScroll <= 0) return;

      const scrollY = stickyTop - rect.top;
      const rawProgress = scrollY / maxScroll;

      // Only handle gestures inside the carousel range
      if (rawProgress >= -0.05 && rawProgress <= 1.05) {
        const numSteps = SERVICES.length - 1;
        const currentCard = Math.round(rawProgress * numSteps);

        if (deltaY > 0 && currentCard < numSteps) {
          // Swipe up (scrolling down) -> advance exactly one card
          scrollToMobileCard(currentCard + 1);
        } else if (deltaY < 0 && currentCard > 0) {
          // Swipe down (scrolling up) -> advance to previous card
          scrollToMobileCard(currentCard - 1);
        }
      }
    }
  };

  return (
    <section
      ref={sectionRef}
      id="expertise"
      className="relative z-30 sm:z-20 lg:z-30 w-full bg-[#faf8f5] dark:bg-[#09090b] text-zinc-900 dark:text-zinc-100 pt-8 sm:pt-14 md:pt-16 lg:pt-28 pb-3 sm:pb-16 lg:pb-20 px-5 sm:px-10 lg:px-16 overflow-x-clip transition-colors duration-300"
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
        {/* DESKTOP & TABLET: Responsive Bento Grid                  */}
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
        {/* MOBILE: Scroll-Driven Mandatory Snapping Carousel        */}
        {/* ======================================================== */}
        <div
          ref={mobileTrackRef}
          className="block sm:hidden relative -mx-5"
          style={{ height: "260vh" }}
        >
          <div
            ref={stickyContainerRef}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            className="sticky top-14 sm:top-16 w-full overflow-hidden pt-4 pb-2 sm:pb-6 md:pb-8 flex flex-col justify-center"
          >
            {/* Horizontal Cards Moving Track with ample bottom clearance for soft shadow fade */}
            <div
              ref={cardsTrackRef}
              className="flex gap-3.5 will-change-transform pt-2 pb-6"
              style={{
                transform: "translate3d(0, 0, 0)",
              }}
            >
              {SERVICES.map((service, index) => {
                return (
                  <div
                    key={service.id}
                    ref={(el) => (mobileCardRefs.current[index] = el)}
                    onClick={() => scrollToMobileCard(index)}
                    className="shrink-0 w-[78vw] max-w-[315px] rounded-3xl bg-white dark:bg-[#141418] border border-black/[0.08] dark:border-white/[0.08] p-4 flex flex-col justify-between transition-colors duration-200 select-none cursor-pointer shadow-[0_14px_30px_-6px_rgba(0,0,0,0.12),0_4px_12px_-2px_rgba(0,0,0,0.06)] dark:shadow-none"
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
        </div>
      </div>
    </section>
  );
}
