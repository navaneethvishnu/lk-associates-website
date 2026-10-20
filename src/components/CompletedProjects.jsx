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

export default function CompletedProjects() {
  const sectionRef = useRef(null);
  const cardRefs = useRef([]);
  const targetPositionRef = useRef(0);
  const currentPositionRef = useRef(0);
  const animationFrameIdRef = useRef(null);
  const snapTimeoutRef = useRef(null);
  const isAutoScrollingRef = useRef(false);

  const [activeCardIndex, setActiveCardIndex] = useState(0);

  const totalCards = COMPLETED_PROJECTS.length;

  // Smoothly scroll window to target card index in this section
  const scrollToCardIndex = useCallback(
    (index) => {
      const section = sectionRef.current;
      if (!section) return;

      const rect = section.getBoundingClientRect();
      const sectionTop = window.scrollY + rect.top;
      const maxScroll = rect.height - window.innerHeight;
      if (maxScroll <= 0) return;

      const targetProgress = Math.min(Math.max(index / (totalCards - 1), 0), 1);
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
    [totalCards]
  );

  // Position and transition cards with true 3D floating depth, scale, and separation
  const updateCardPositions = useCallback(
    (continuousIndex) => {
      const width = typeof window !== "undefined" ? window.innerWidth : 1200;
      const isMobile = width < 640;
      const isTablet = width >= 640 && width < 1024;

      // Vertical stagger spacing between layered cards
      const spacingY = isMobile ? 75 : isTablet ? 90 : 165;

      // Mobile vertical shift ensures the card cluster stays centered in the lower area away from text
      const shiftY = isMobile ? 18 : isTablet ? -14 : 0;

      // Front card spotlight offset (steps out to the left)
      const shiftOutX = isMobile ? -14 : isTablet ? -60 : -100;

      // Resting column position for cards in the background stack
      const columnRight = isMobile ? 20 : isTablet ? 75 : 105;
      const upperRight = columnRight + (isMobile ? 8 : 20);

      // Depth spread in 3D perspective space (translateZ)
      const depthSpread = isMobile ? 70 : isTablet ? 115 : 180;

      // Independent organic rotation angles
      const baseTilt = isMobile ? -5.0 : isTablet ? -6.0 : -7.0;
      const activeTilt = isMobile ? -3.5 : -4.5;

      // Scale range: dominant front card to receding background cards
      const maxScale = isMobile ? 1.01 : 1.05;
      const minActiveScale = isMobile ? 0.90 : 0.88;
      const minStackScale = isMobile ? 0.82 : 0.80;

      let closestIndex = 0;
      let minDistance = Infinity;

      COMPLETED_PROJECTS.forEach((_, i) => {
        const el = cardRefs.current[i];
        if (!el) return;

        // Cyclic shortest distance in [-totalCards/2, +totalCards/2]
        let d = ((i - continuousIndex) % totalCards + totalCards) % totalCards;
        if (d > totalCards / 2) {
          d -= totalCards;
        }

        const absD = Math.abs(d);
        if (absD < minDistance) {
          minDistance = absD;
          closestIndex = i;
        }

        // 1. Vertical motion: staggered physical separation with mobile center offset
        const y = d * spacingY + shiftY;

        // 2. Horizontal motion: smooth S-curve Hermite interpolation
        // Incoming card emerges on right, glides smoothly left into spotlight
        // Outgoing card recedes smoothly from left spotlight into upper right stack
        let x;
        if (d >= 0) {
          const tIn = Math.min(1, d);
          const easeIn = tIn * tIn * (3 - 2 * tIn);
          const stackDrift = Math.max(0, d - 1) * (isMobile ? 15 : 35);
          x = shiftOutX + (columnRight - shiftOutX) * easeIn + stackDrift;
        } else {
          const tOut = Math.min(1, -d);
          const easeOut = tOut * tOut * (3 - 2 * tOut);
          const stackDrift = Math.max(0, -d - 1) * (isMobile ? 18 : 45);
          x = shiftOutX + (upperRight - shiftOutX) * easeOut + stackDrift;
        }

        // 3. True 3D Depth (translateZ):
        // Front card at z = 0px (dominant foreground), receding cards drop deeper into negative Z
        const z = -Math.pow(absD, 1.15) * depthSpread;

        // 4. Scale: front card is full size, receding and background cards scaled down
        const easeScale = absD <= 1.0 ? 1 - absD * absD * (3 - 2 * absD) : 0;
        let scale;
        if (absD <= 1.0) {
          scale = minActiveScale + (maxScale - minActiveScale) * easeScale;
        } else {
          const tStack = Math.min(1, (absD - 1.0) / 1.2);
          scale = minActiveScale - (minActiveScale - minStackScale) * tStack;
        }

        // 5. 3D Rotations: independent roll, pitch, and yaw for tactile floating feel
        const easeRot = absD <= 1.0 ? 1 - absD * absD * (3 - 2 * absD) : 0;
        const rotZ = baseTilt + (activeTilt - baseTilt) * easeRot;
        const rotY = d < 0 ? -6 + 10 * Math.min(1, -d) : -6 + 4 * Math.min(1, d);
        const rotX = (d < 0 ? -2 : 2.5) * Math.min(1, absD);

        // 6. Opacity: front card is 1.0; cards in stack are gently subdued, fading out beyond 2.2
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

        // 7. Stacking Order (z-index): front card dominates; incoming takes priority smoothly near center
        const zScore = d <= 0 ? 50 + d * 15 : 50 - d * 18;
        const zIndex = Math.max(1, Math.round(zScore));

        // 8. Continuous depth shadow and elevation (deep for front card, softer in background)
        const focusFactor = Math.max(0, 1 - absD);
        const shadowIntensity = (0.55 + focusFactor * 0.25).toFixed(2);
        const shadowBlur = Math.round(30 + focusFactor * 35);
        const shadowY = Math.round(15 + focusFactor * 15);

        // Apply hardware-accelerated 3D transform with depth and perspective
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
        if (cardInner) {
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

      setActiveCardIndex(closestIndex);
    },
    [totalCards]
  );

  // Stepped progress function with wide resting plateaus at every card
  const getSteppedProgress = useCallback((rawProgress, numSteps) => {
    const u = rawProgress * numSteps;
    const k = Math.floor(u);
    if (k >= numSteps) return numSteps;

    const f = u - k; // fractional progression between card k and card k+1

    // 32% of each interval is a solid resting plateau at exact card positions
    const plateau = 0.16;
    if (f <= plateau) {
      return k;
    }
    if (f >= 1 - plateau) {
      return k + 1;
    }

    // Smooth quintic smootherstep (zero velocity and zero acceleration at endpoints)
    const t = (f - plateau) / (1 - 2 * plateau);
    const eased = t * t * t * (t * (t * 6 - 15) + 10);
    return k + eased;
  }, []);

  // Auto-settle: smoothly snap to nearest card if user pauses mid-transition
  const handleScrollSettle = useCallback(() => {
    if (isAutoScrollingRef.current) return;
    const section = sectionRef.current;
    if (!section) return;

    const rect = section.getBoundingClientRect();
    const maxScroll = rect.height - window.innerHeight;
    if (maxScroll <= 0) return;

    const scrollY = -rect.top;
    const progress = scrollY / maxScroll;

    // Only settle within the carousel section (never trap user entering from hero or leaving)
    if (progress <= 0.03 || progress >= 0.97) return;

    const numSteps = totalCards - 1;
    const exactCardIndex = progress * numSteps;
    const targetIndex = Math.round(exactCardIndex);

    // If already resting at an exact snap point, no action needed
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
  }, [totalCards]);

  // Scroll synchronization and 120 FPS lerp loop
  useEffect(() => {
    const onScroll = () => {
      const section = sectionRef.current;
      if (!section) return;

      const rect = section.getBoundingClientRect();
      const maxScroll = rect.height - window.innerHeight;
      if (maxScroll <= 0) return;

      const scrollY = -rect.top;
      // Scroll progress through this section strictly clamped [0, 1]
      const rawProgress = Math.min(Math.max(scrollY / maxScroll, 0), 1);

      // Controlled stepped progress ensures clean transitions and eliminates awkward mid-states
      targetPositionRef.current = getSteppedProgress(rawProgress, totalCards - 1);

      // Reset settle debounce timer
      if (snapTimeoutRef.current) {
        clearTimeout(snapTimeoutRef.current);
      }

      // Settle gently to exact snap point if user stops mid-transition
      if (!isAutoScrollingRef.current) {
        snapTimeoutRef.current = setTimeout(() => {
          handleScrollSettle();
        }, 130);
      }
    };

    onScroll();

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });

    // Buttery-smooth requestAnimationFrame lerp loop
    const renderLoop = () => {
      const target = targetPositionRef.current;
      const current = currentPositionRef.current;
      const diff = target - current;

      if (Math.abs(diff) > 0.0005) {
        currentPositionRef.current += diff * 0.14;
        updateCardPositions(currentPositionRef.current);
      } else if (current !== target) {
        currentPositionRef.current = target;
        updateCardPositions(target);
      }

      animationFrameIdRef.current = requestAnimationFrame(renderLoop);
    };

    animationFrameIdRef.current = requestAnimationFrame(renderLoop);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (animationFrameIdRef.current) {
        cancelAnimationFrame(animationFrameIdRef.current);
      }
      if (snapTimeoutRef.current) {
        clearTimeout(snapTimeoutRef.current);
      }
    };
  }, [totalCards, updateCardPositions, getSteppedProgress, handleScrollSettle]);

  return (
    <section
      ref={sectionRef}
      id="projects"
      style={{ height: "320vh" }}
      className="relative z-20 sm:z-30 lg:z-20 isolate w-full bg-[#faf8f5] dark:bg-[#09090b] text-zinc-900 dark:text-zinc-100 transition-colors duration-300 -mb-28 sm:mb-0 md:mb-0 lg:mb-0 sm:pb-0 md:pb-0 lg:pb-0 overflow-x-clip sm:overflow-visible md:overflow-visible"
    >
      {/* Sticky Fullscreen Viewport */}
      <div
        className="sticky top-0 h-screen h-[100dvh] w-full overflow-hidden sm:overflow-visible md:overflow-visible lg:overflow-hidden flex flex-col lg:flex-row items-center justify-start lg:justify-center px-5 sm:px-8 lg:px-16 pt-8 sm:pt-6 md:pt-7 lg:pt-0"
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

          {/* BOTTOM (MOBILE) / RIGHT (DESKTOP): 3D Floating Layered Stack Carousel */}
          <div
            className="w-full lg:col-span-7 relative h-[280px] sm:h-[490px] md:h-[530px] lg:h-[660px] sm:shrink-0 md:shrink-0 flex items-center justify-center overflow-visible mt-4 sm:mt-1 md:mt-2 lg:mt-0 z-10"
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
                    className="absolute top-1/2 left-1/2 w-[240px] sm:w-[280px] md:w-[325px] lg:w-[380px] cursor-pointer will-change-transform select-none"
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
        </div>
      </div>
    </section>
  );
}
