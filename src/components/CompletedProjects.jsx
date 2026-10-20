"use client";

import { useEffect, useRef, useState, useCallback } from "react";

const COMPLETED_PROJECTS = [
  {
    id: 1,
    title: "Lumina Pavilion",
    location: "Lake Como, Italy",
    image: "/frames/frame_018.jpg",
  },
  {
    id: 2,
    title: "Kyoto Solarium",
    location: "Kyoto, Japan",
    image: "/frames/frame_095.jpg",
  },
  {
    id: 3,
    title: "Mirage Residence",
    location: "Scottsdale, Arizona",
    image: "/frames/frame_175.jpg",
  },
  {
    id: 4,
    title: "Azure Horizon",
    location: "Saint-Tropez, France",
    image: "/frames/frame_245.jpg",
  },
  {
    id: 5,
    title: "Nocturne Villa",
    location: "Zurich, Switzerland",
    image: "/frames/frame_310.jpg",
  },
  {
    id: 6,
    title: "Celestial Sanctuary",
    location: "Aspen, Colorado",
    image: "/frames/frame_360.jpg",
  },
];

const TOTAL_PROJECTS = COMPLETED_PROJECTS.length;
// Triplicate array for seamless infinite looping on mobile in both directions
const EXTENDED_PROJECTS = [
  ...COMPLETED_PROJECTS,
  ...COMPLETED_PROJECTS,
  ...COMPLETED_PROJECTS,
];

export default function CompletedProjects() {
  const sectionRef = useRef(null);
  const cardRefs = useRef([]);
  const targetPositionRef = useRef(0);
  const currentPositionRef = useRef(0);
  const animationFrameIdRef = useRef(null);
  const snapTimeoutRef = useRef(null);
  const isAutoScrollingRef = useRef(false);

  const [activeCardIndex, setActiveCardIndex] = useState(0);
  const activeCardIndexRef = useRef(0);

  // Mobile infinite horizontal carousel state
  const [mobileIndex, setMobileIndex] = useState(TOTAL_PROJECTS);
  const [isTransitioning, setIsTransitioning] = useState(true);
  const [viewportWidth, setViewportWidth] = useState(375);
  const [dragOffset, setDragOffset] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  const isInteractingRef = useRef(false);
  const resumeTimerRef = useRef(null);
  const isSectionInViewRef = useRef(false);

  const touchStartXRef = useRef(0);
  const touchStartYRef = useRef(0);
  const touchStartTimeRef = useRef(0);
  const isHorizontalSwipeRef = useRef(null);

  // Track viewport width and mobile breakpoint (< 640px)
  useEffect(() => {
    const updateWidth = () => {
      if (typeof window !== "undefined") {
        setViewportWidth(window.innerWidth);
        setIsMobile(window.innerWidth < 640);
      }
    };
    updateWidth();
    window.addEventListener("resize", updateWidth, { passive: true });
    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  // Section visibility observer (pauses mobile auto-play when out of view)
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        isSectionInViewRef.current = entry.isIntersecting;
      },
      { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
    );

    const el = sectionRef.current;
    if (el) observer.observe(el);

    return () => {
      if (el) observer.unobserve(el);
    };
  }, []);

  // -------------------------------------------------------------
  // DESKTOP & TABLET 3D SCROLL-DRIVEN STACK LOGIC (UNCHANGED)
  // -------------------------------------------------------------
  const scrollToCardIndex = useCallback(
    (index) => {
      const section = sectionRef.current;
      if (!section) return;

      const rect = section.getBoundingClientRect();
      const sectionTop = window.scrollY + rect.top;
      const maxScroll = rect.height - window.innerHeight;
      if (maxScroll <= 0) return;

      const targetProgress = Math.min(
        Math.max(index / (TOTAL_PROJECTS - 1), 0),
        1
      );
      const targetScrollY = sectionTop + targetProgress * maxScroll;

      isAutoScrollingRef.current = true;
      window.scrollTo({
        top: targetScrollY,
        behavior: "smooth",
      });

      setTimeout(() => {
        isAutoScrollingRef.current = false;
      }, 500);
    },
    []
  );

  const updateCardPositions = useCallback((continuousIndex) => {
    const width = typeof window !== "undefined" ? window.innerWidth : 1200;
    const isTablet = width >= 640 && width < 1024;

    const spacingY = isTablet ? 90 : 165;
    const shiftY = isTablet ? -14 : 0;
    const shiftOutX = isTablet ? -60 : -100;

    const columnRight = isTablet ? 75 : 105;
    const upperRight = columnRight + 20;

    const depthSpread = isTablet ? 115 : 180;
    const baseTilt = isTablet ? -6.0 : -7.0;
    const activeTilt = -4.5;

    const maxScale = 1.05;
    const minActiveScale = 0.88;
    const minStackScale = 0.8;

    let closestIndex = 0;
    let minDistance = Infinity;

    COMPLETED_PROJECTS.forEach((_, i) => {
      const el = cardRefs.current[i];
      if (!el) return;

      let d =
        ((i - continuousIndex) % TOTAL_PROJECTS + TOTAL_PROJECTS) %
        TOTAL_PROJECTS;
      if (d > TOTAL_PROJECTS / 2) {
        d -= TOTAL_PROJECTS;
      }

      const absD = Math.abs(d);
      if (absD < minDistance) {
        minDistance = absD;
        closestIndex = i;
      }

      const y = d * spacingY + shiftY;

      let x;
      if (d >= 0) {
        const tIn = Math.min(1, d);
        const easeIn = tIn * tIn * (3 - 2 * tIn);
        const stackDrift = Math.max(0, d - 1) * 35;
        x = shiftOutX + (columnRight - shiftOutX) * easeIn + stackDrift;
      } else {
        const tOut = Math.min(1, -d);
        const easeOut = tOut * tOut * (3 - 2 * tOut);
        const stackDrift = Math.max(0, -d - 1) * 45;
        x = shiftOutX + (upperRight - shiftOutX) * easeOut + stackDrift;
      }

      const z = -Math.pow(absD, 1.15) * depthSpread;

      const easeScale = absD <= 1.0 ? 1 - absD * absD * (3 - 2 * absD) : 0;
      let scale;
      if (absD <= 1.0) {
        scale = minActiveScale + (maxScale - minActiveScale) * easeScale;
      } else {
        const tStack = Math.min(1, (absD - 1.0) / 1.2);
        scale = minActiveScale - (minActiveScale - minStackScale) * tStack;
      }

      const easeRot = absD <= 1.0 ? 1 - absD * absD * (3 - 2 * absD) : 0;
      const rotZ = baseTilt + (activeTilt - baseTilt) * easeRot;
      const rotY = d < 0 ? -6 + 10 * Math.min(1, -d) : -6 + 4 * Math.min(1, d);
      const rotX = (d < 0 ? -2 : 2.5) * Math.min(1, absD);

      let opacity;
      if (d >= 0) {
        if (d <= 1.0) {
          const tIn = d;
          const easeIn = tIn * tIn * (3 - 2 * tIn);
          opacity = 0.72 + 0.28 * (1 - easeIn);
        } else {
          const fade = Math.max(0, 1 - (d - 1.0) / 1.2);
          opacity = 0.72 * fade;
        }
      } else {
        if (-d <= 1.0) {
          const tOut = -d;
          const easeOut = tOut * tOut * (3 - 2 * tOut);
          opacity = 0.76 + 0.24 * (1 - easeOut);
        } else {
          const fade = Math.max(0, 1 - (-d - 1.0) / 1.2);
          opacity = 0.76 * fade;
        }
      }

      const zScore = d <= 0 ? 50 + d * 15 : 50 - d * 18;
      const zIndex = Math.max(1, Math.round(zScore));

      const focusFactor = Math.max(0, 1 - absD);
      const shadowIntensity = (0.55 + focusFactor * 0.25).toFixed(2);
      const shadowBlur = Math.round(30 + focusFactor * 35);
      const shadowY = Math.round(15 + focusFactor * 15);

      el.style.transformStyle = "preserve-3d";
      el.style.transformOrigin = "center center";
      el.style.transform = `translate(-50%, -50%) translate3d(${x.toFixed(
        1
      )}px, ${y.toFixed(1)}px, ${z.toFixed(1)}px) rotateX(${rotX.toFixed(
        2
      )}deg) rotateY(${rotY.toFixed(2)}deg) rotateZ(${rotZ.toFixed(
        2
      )}deg) scale(${scale.toFixed(3)})`;
      el.style.opacity = opacity.toFixed(3);
      el.style.zIndex = String(zIndex);
      el.style.visibility = opacity > 0.01 ? "visible" : "hidden";
      el.style.pointerEvents = absD < 1.6 ? "auto" : "none";

      const cardInner = el.firstElementChild;
      if (cardInner && opacity > 0.01) {
        if (isTablet) {
          const isDark =
            typeof document !== "undefined" &&
            document.documentElement.classList.contains("dark");
          if (isDark) {
            const alphaMain = (0.35 + focusFactor * 0.25).toFixed(2);
            const alphaAmbient = (0.18 + focusFactor * 0.14).toFixed(2);
            cardInner.style.boxShadow = `0 ${shadowY}px ${shadowBlur}px rgba(0, 0, 0, ${alphaMain}), 0 ${Math.round(
              shadowY * 0.4
            )}px ${Math.round(shadowBlur * 0.5)}px rgba(0, 0, 0, ${alphaAmbient}), 0 0 16px rgba(0, 0, 0, 0.20)`;
          } else {
            const alphaMain = (0.08 + focusFactor * 0.08).toFixed(2);
            const alphaAmbient = (0.04 + focusFactor * 0.04).toFixed(2);
            cardInner.style.boxShadow = `0 ${shadowY}px ${shadowBlur}px rgba(0, 0, 0, ${alphaMain}), 0 ${Math.round(
              shadowY * 0.4
            )}px ${Math.round(shadowBlur * 0.5)}px rgba(0, 0, 0, ${alphaAmbient}), 0 0 12px rgba(0, 0, 0, 0.03)`;
          }
        } else {
          cardInner.style.boxShadow = `0 ${shadowY}px ${shadowBlur}px rgba(0, 0, 0, ${shadowIntensity})`;
        }
      }
    });

    if (closestIndex !== activeCardIndexRef.current) {
      activeCardIndexRef.current = closestIndex;
      setActiveCardIndex(closestIndex);
    }
  }, []);

  const getSteppedProgress = useCallback((rawProgress, numSteps) => {
    const u = rawProgress * numSteps;
    const k = Math.floor(u);
    if (k >= numSteps) return numSteps;

    const f = u - k;
    const plateau = 0.16;
    if (f <= plateau) return k;
    if (f >= 1 - plateau) return k + 1;

    const t = (f - plateau) / (1 - 2 * plateau);
    const eased = t * t * t * (t * (t * 6 - 15) + 10);
    return k + eased;
  }, []);

  const handleScrollSettle = useCallback(() => {
    if (isAutoScrollingRef.current) return;
    const section = sectionRef.current;
    if (!section) return;

    const rect = section.getBoundingClientRect();
    const maxScroll = rect.height - window.innerHeight;
    if (maxScroll <= 0) return;

    const scrollY = -rect.top;
    const progress = scrollY / maxScroll;

    if (progress <= 0.03 || progress >= 0.97) return;

    const numSteps = TOTAL_PROJECTS - 1;
    const exactCardIndex = progress * numSteps;
    const targetIndex = Math.round(exactCardIndex);

    if (Math.abs(exactCardIndex - targetIndex) < 0.04) return;

    const sectionTop = window.scrollY + rect.top;
    const targetScrollY = sectionTop + (targetIndex / numSteps) * maxScroll;

    isAutoScrollingRef.current = true;
    window.scrollTo({
      top: targetScrollY,
      behavior: "smooth",
    });

    setTimeout(() => {
      isAutoScrollingRef.current = false;
    }, 450);
  }, []);

  useEffect(() => {
    const isDesktopOrTablet = () =>
      typeof window !== "undefined" && window.innerWidth >= 640;

    const startRenderLoop = () => {
      if (!isDesktopOrTablet() || animationFrameIdRef.current) return;

      const renderLoop = () => {
        const section = sectionRef.current;
        if (section) {
          const rect = section.getBoundingClientRect();
          if (rect.bottom < -200 || rect.top > window.innerHeight + 200) {
            animationFrameIdRef.current = null;
            return;
          }
        }

        const target = targetPositionRef.current;
        const current = currentPositionRef.current;
        const diff = target - current;

        if (Math.abs(diff) > 0.0005) {
          currentPositionRef.current += diff * 0.14;
          updateCardPositions(currentPositionRef.current);
          animationFrameIdRef.current = requestAnimationFrame(renderLoop);
        } else {
          if (current !== target) {
            currentPositionRef.current = target;
            updateCardPositions(target);
          }
          animationFrameIdRef.current = null;
        }
      };

      animationFrameIdRef.current = requestAnimationFrame(renderLoop);
    };

    const onScroll = () => {
      if (!isDesktopOrTablet()) return;
      const section = sectionRef.current;
      if (!section) return;

      const rect = section.getBoundingClientRect();
      if (rect.bottom < -100 || rect.top > window.innerHeight + 100) return;

      const maxScroll = rect.height - window.innerHeight;
      if (maxScroll <= 0) return;

      const scrollY = -rect.top;
      const rawProgress = Math.min(Math.max(scrollY / maxScroll, 0), 1);
      targetPositionRef.current = getSteppedProgress(
        rawProgress,
        TOTAL_PROJECTS - 1
      );

      startRenderLoop();

      if (snapTimeoutRef.current) {
        clearTimeout(snapTimeoutRef.current);
      }

      if (!isAutoScrollingRef.current) {
        snapTimeoutRef.current = setTimeout(() => {
          handleScrollSettle();
        }, 130);
      }
    };

    if (isDesktopOrTablet()) {
      onScroll();
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (animationFrameIdRef.current) {
        cancelAnimationFrame(animationFrameIdRef.current);
        animationFrameIdRef.current = null;
      }
      if (snapTimeoutRef.current) {
        clearTimeout(snapTimeoutRef.current);
      }
    };
  }, [updateCardPositions, getSteppedProgress, handleScrollSettle]);

  // -------------------------------------------------------------
  // MOBILE INFINITE HORIZONTAL CAROUSEL LOGIC
  // -------------------------------------------------------------
  const nextMobileSlide = useCallback(() => {
    setIsTransitioning(true);
    setMobileIndex((prev) => prev + 1);
  }, []);

  const prevMobileSlide = useCallback(() => {
    setIsTransitioning(true);
    setMobileIndex((prev) => prev - 1);
  }, []);

  // When transition ends at boundaries, seamlessly snap without animation
  const handleTransitionEnd = useCallback(() => {
    setMobileIndex((current) => {
      if (current >= TOTAL_PROJECTS * 2) {
        setIsTransitioning(false);
        return current - TOTAL_PROJECTS;
      } else if (current < TOTAL_PROJECTS) {
        setIsTransitioning(false);
        return current + TOTAL_PROJECTS;
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
        nextMobileSlide();
      }
    }, 2800);

    return () => clearInterval(interval);
  }, [nextMobileSlide, viewportWidth]);

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
        setMobileIndex((prev) => prev + 1);
      } else if (diffX > 0 && (isSignificantDrag || isQuickFlick)) {
        setMobileIndex((prev) => prev - 1);
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
  const translateX = centerOffset - mobileIndex * stepWidth + dragOffset;
  const activeProjectIndex =
    ((mobileIndex % TOTAL_PROJECTS) + TOTAL_PROJECTS) % TOTAL_PROJECTS;

  return (
    <section
      ref={sectionRef}
      id="projects"
      style={isMobile ? undefined : { height: "320vh" }}
      className="relative z-20 sm:z-30 lg:z-20 isolate w-full bg-[#faf8f5] dark:bg-[#09090b] text-zinc-900 dark:text-zinc-100 transition-colors duration-300 pt-8 pb-10 sm:pt-0 sm:pb-0 sm:mb-0 md:mb-0 lg:mb-0 overflow-x-clip sm:overflow-visible md:overflow-visible"
    >
      {/* Sticky Fullscreen Viewport on desktop/tablet; relative on mobile */}
      <div
        className="relative sm:sticky sm:top-0 h-auto sm:h-screen sm:h-[100dvh] w-full overflow-hidden sm:overflow-visible md:overflow-visible lg:overflow-hidden flex flex-col lg:flex-row items-center justify-start lg:justify-center px-5 sm:px-8 lg:px-16 pt-0 sm:pt-6 md:pt-7 lg:pt-0"
      >
        {/* Subtle Ambient Background Lighting */}
        <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-[550px] h-[550px] bg-amber-500/5 dark:bg-indigo-500/5 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute bottom-10 left-10 w-[400px] h-[400px] bg-black/[0.02] dark:bg-white/[0.02] rounded-full blur-[120px] pointer-events-none" />

        <div
          className="relative w-full max-w-7xl mx-auto flex flex-col lg:grid lg:grid-cols-12 gap-0 sm:gap-1 md:gap-2 lg:gap-12 items-center min-h-0 sm:min-h-0 lg:min-h-[640px] overflow-visible"
        >
          {/* TOP (MOBILE) / LEFT (DESKTOP): Heading & Architectural Description */}
          <div className="w-full lg:col-span-5 flex flex-col justify-start z-30 pt-0 shrink-0 text-left">
            {/* Category Badges */}
            <div className="flex items-center gap-2 sm:gap-2.5 mb-2 sm:mb-2.5 lg:mb-6 shrink-0">
              <span className="inline-flex items-center px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full text-[10px] sm:text-[11px] font-semibold tracking-widest uppercase bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 text-zinc-700 dark:text-zinc-300 backdrop-blur-md shrink-0">
                Portfolio
              </span>
              <span className="inline-flex items-center px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full text-[10px] sm:text-[11px] font-semibold tracking-widest uppercase bg-[#D4AF37]/15 dark:bg-[#D4AF37]/10 border border-[#D4AF37]/30 dark:border-[#D4AF37]/25 text-[#8F6B32] dark:text-[#E7C982] backdrop-blur-md shrink-0">
                Residences
              </span>
            </div>

            {/* Eyebrow Label */}
            <p className="text-[10px] sm:text-[11px] font-bold tracking-[0.24em] uppercase text-zinc-500 dark:text-zinc-400 mb-1.5 sm:mb-2 lg:mb-3">
              Completed Projects
            </p>

            {/* Main Headline */}
            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tight text-zinc-900 dark:text-white leading-[1.02] mb-2 sm:mb-3 lg:mb-6">
              Spaces <br className="hidden sm:inline" />
              <span className="text-transparent [-webkit-text-stroke:1.5px_#18181b] sm:[-webkit-text-stroke:2px_#18181b] lg:[-webkit-text-stroke:2.5px_#18181b] dark:[-webkit-text-stroke:1.5px_#ffffff] dark:sm:[-webkit-text-stroke:2px_#ffffff] dark:lg:[-webkit-text-stroke:2.5px_#ffffff]">
                We’ve Built
              </span>
              <span className="text-[#D4AF37] ml-1">.</span>
            </h2>

            {/* Architectural Description */}
            <p className="text-xs sm:text-sm lg:text-base text-zinc-600 dark:text-zinc-400 font-normal leading-relaxed max-w-sm sm:max-w-md lg:max-w-lg mb-0">
              A curated selection of private residences, tranquil pavilions, and contemporary living spaces harmonized with natural light, landscape, and enduring materiality.
            </p>
          </div>

          {/* ======================================================== */}
          {/* DESKTOP & TABLET: 3D Floating Layered Stack Carousel      */}
          {/* ======================================================== */}
          <div
            className="hidden sm:flex w-full lg:col-span-7 relative h-[490px] md:h-[530px] lg:h-[660px] sm:shrink-0 md:shrink-0 items-center justify-center overflow-visible mt-1 md:mt-2 lg:mt-0 z-10"
            style={{
              perspective: "1200px",
              perspectiveOrigin: "50% 50%",
              transformStyle: "preserve-3d",
            }}
          >
            {/* Cards 3D Stage Container */}
            <div
              className="relative w-full h-full flex items-center justify-center overflow-visible"
              style={{
                transformStyle: "preserve-3d",
              }}
            >
              {COMPLETED_PROJECTS.map((project, index) => {
                const isActive = activeCardIndex === index;

                return (
                  <div
                    ref={(el) => (cardRefs.current[index] = el)}
                    key={project.id}
                    onClick={() => {
                      if (!isActive) scrollToCardIndex(index);
                    }}
                    className="absolute top-1/2 left-1/2 w-[280px] md:w-[325px] lg:w-[380px] cursor-pointer will-change-transform select-none"
                    style={{
                      transformStyle: "preserve-3d",
                    }}
                  >
                    <div className="group relative rounded-3xl bg-white border border-zinc-200/90 p-3.5 sm:p-4 shadow-[0_20px_45px_rgba(0,0,0,0.12)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.55)] transition-colors duration-200">
                      {/* Project Image */}
                      <div className="relative w-full aspect-[16/10] rounded-2xl overflow-hidden bg-zinc-100">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={project.image}
                          alt={project.location}
                          width={380}
                          height={238}
                          decoding="async"
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                          loading="lazy"
                        />
                      </div>

                      {/* Location Caption - Clean dark typography on white card matching reference */}
                      <div className="mt-3.5 flex items-center justify-between px-1 pb-0.5">
                        <div className="flex items-center gap-2 min-w-0">
                          <svg
                            className="w-4 h-4 text-zinc-500 shrink-0"
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
                          <span className="text-xs sm:text-sm font-semibold tracking-wide text-zinc-900 truncate">
                            {project.location}
                          </span>
                        </div>

                        {/* Minimalist Heart / Favorite Action Icon (matching reference) */}
                        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-blue-50/90 border border-blue-100 flex items-center justify-center text-blue-500 shrink-0 group-hover:bg-blue-100 transition-colors">
                          <svg
                            className="w-3.5 h-3.5 sm:w-4 sm:h-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
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

          {/* ======================================================== */}
          {/* MOBILE: Seamless Infinite Horizontal Auto-Playing Carousel */}
          {/* ======================================================== */}
          <div className="block sm:hidden w-full relative -mx-5 overflow-x-clip overflow-y-visible pt-4 pb-2">
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
                {EXTENDED_PROJECTS.map((project, index) => {
                  const isActive = index === mobileIndex;

                  return (
                    <div
                      key={`${project.id}-${index}`}
                      onClick={() => {
                        if (!isActive) {
                          setIsTransitioning(true);
                          setMobileIndex(index);
                          isInteractingRef.current = true;
                          if (resumeTimerRef.current)
                            clearTimeout(resumeTimerRef.current);
                          resumeTimerRef.current = setTimeout(() => {
                            isInteractingRef.current = false;
                          }, 2800);
                        }
                      }}
                      className={`shrink-0 w-[78vw] max-w-[315px] rounded-3xl bg-white dark:bg-[#141418] border border-zinc-200/90 dark:border-white/[0.08] p-3.5 flex flex-col justify-between select-none cursor-pointer transition-all duration-500 ease-out ${
                        isActive
                          ? "scale-100 opacity-100 shadow-[0_16px_36px_-6px_rgba(0,0,0,0.14),0_6px_16px_-2px_rgba(0,0,0,0.08)] dark:shadow-[0_20px_45px_rgba(0,0,0,0.7)] border-zinc-300 dark:border-white/[0.22]"
                          : "scale-[0.93] opacity-65 shadow-sm border-zinc-200/70 dark:border-white/[0.06]"
                      }`}
                      style={{
                        transformOrigin: "center center",
                      }}
                    >
                      {/* Project Image */}
                      <div className="relative w-full aspect-[16/10] rounded-2xl overflow-hidden bg-zinc-100 dark:bg-zinc-900">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={project.image}
                          alt={project.location}
                          width={380}
                          height={238}
                          decoding="async"
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                          loading="lazy"
                        />
                      </div>

                      {/* Location Caption & Heart Icon */}
                      <div className="mt-3.5 flex items-center justify-between px-1 pb-0.5">
                        <div className="flex items-center gap-2 min-w-0">
                          <svg
                            className="w-4 h-4 text-zinc-500 shrink-0"
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
                          <span className="text-xs sm:text-sm font-semibold tracking-wide text-zinc-900 dark:text-white truncate">
                            {project.location}
                          </span>
                        </div>

                        {/* Minimalist Heart / Favorite Action Icon */}
                        <div className="w-7 h-7 rounded-full bg-blue-50/90 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/40 flex items-center justify-center text-blue-500 shrink-0">
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
                              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                            />
                          </svg>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Carousel Navigation Bar: Counter, Dots & Prev/Next Controls */}
            <div className="flex items-center justify-between px-6 pt-0">
              {/* Step Counter */}
              <span className="font-mono text-xs text-zinc-500 dark:text-zinc-400">
                <span className="font-bold text-zinc-900 dark:text-white">
                  0{activeProjectIndex + 1}
                </span>
                {" / "}
                <span>0{TOTAL_PROJECTS}</span>
              </span>

              {/* Pagination Indicator Dots */}
              <div className="flex items-center gap-1.5">
                {COMPLETED_PROJECTS.map((_, i) => {
                  const isDotActive = activeProjectIndex === i;

                  return (
                    <button
                      key={i}
                      aria-label={`Go to project ${i + 1}`}
                      onClick={() => {
                        setIsTransitioning(true);
                        const currentModulo =
                          ((mobileIndex % TOTAL_PROJECTS) + TOTAL_PROJECTS) %
                          TOTAL_PROJECTS;
                        const diff = i - currentModulo;
                        setMobileIndex((prev) => prev + diff);

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

              {/* Prev / Next Arrow Controls */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    prevMobileSlide();
                    isInteractingRef.current = true;
                    if (resumeTimerRef.current)
                      clearTimeout(resumeTimerRef.current);
                    resumeTimerRef.current = setTimeout(() => {
                      isInteractingRef.current = false;
                    }, 2800);
                  }}
                  aria-label="Previous project"
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
                    nextMobileSlide();
                    isInteractingRef.current = true;
                    if (resumeTimerRef.current)
                      clearTimeout(resumeTimerRef.current);
                    resumeTimerRef.current = setTimeout(() => {
                      isInteractingRef.current = false;
                    }, 2800);
                  }}
                  aria-label="Next project"
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
      </div>
    </section>
  );
}
