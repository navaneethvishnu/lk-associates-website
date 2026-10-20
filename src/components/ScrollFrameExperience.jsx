"use client";

import { useEffect, useRef, useCallback } from "react";
import { useTheme } from "@/context/ThemeContext";

const TOTAL_FRAMES = 360;
const FRAME_PATH = (idx) => `/frames/frame_${String(idx).padStart(3, "0")}.jpg`;

export default function ScrollFrameExperience() {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const imagesRef = useRef(new Array(TOTAL_FRAMES + 1));
  const loadedSetRef = useRef(new Set());
  const isHeroInViewRef = useRef(true);
  const vignetteGradRef = useRef(null);
  const vignetteHeightRef = useRef(0);

  const targetFrameRef = useRef(1);
  const currentFrameRef = useRef(1);
  const lastRenderedFrameRef = useRef(0);
  const lastProgressRef = useRef(-1);
  const animationFrameIdRef = useRef(null);

  const desktopTextRef = useRef(null);
  const mobileTextRef = useRef(null);
  const scrollIndicatorRef = useRef(null);

  // Fast outward search for closest loaded frame (O(dist) vs O(N) linear set scan)
  const getClosestLoadedFrame = useCallback((frame) => {
    if (loadedSetRef.current.has(frame)) return frame;
    for (let offset = 1; offset <= TOTAL_FRAMES; offset++) {
      const up = frame + offset;
      if (up <= TOTAL_FRAMES && loadedSetRef.current.has(up)) return up;
      const down = frame - offset;
      if (down >= 1 && loadedSetRef.current.has(down)) return down;
    }
    return 1;
  }, []);

  // Draw frame on canvas with responsive cover scaling
  const drawFrame = useCallback(
    (frameIndex) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const resolvedIndex = getClosestLoadedFrame(frameIndex);
      const img = imagesRef.current[resolvedIndex];
      if (!img || !img.complete || img.naturalWidth === 0) return;

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const width = canvas.width / dpr;
      const height = canvas.height / dpr;

      ctx.clearRect(0, 0, width, height);

      // Responsive aspect-ratio cover calculation
      const imgW = img.naturalWidth || 1284;
      const imgH = img.naturalHeight || 724;
      const scale = Math.max(width / imgW, height / imgH);
      const drawW = imgW * scale;
      const drawH = imgH * scale;
      const drawX = (width - drawW) / 2;
      const drawY = (height - drawH) / 2;

      ctx.drawImage(img, drawX, drawY, drawW, drawH);

      // In dark mode, preserve existing dark gradients and shadows at top and bottom; in light mode, keep background image clear
      const isDarkTheme = document.documentElement.classList.contains("dark");
      if (isDarkTheme) {
        if (!vignetteGradRef.current || vignetteHeightRef.current !== height) {
          const vignette = ctx.createLinearGradient(0, 0, 0, height);
          vignette.addColorStop(0, "rgba(9, 9, 11, 0.45)");
          vignette.addColorStop(0.2, "rgba(9, 9, 11, 0.08)");
          vignette.addColorStop(0.75, "rgba(9, 9, 11, 0.2)");
          vignette.addColorStop(1, "rgba(9, 9, 11, 0.85)");
          vignetteGradRef.current = vignette;
          vignetteHeightRef.current = height;
        }
        ctx.fillStyle = vignetteGradRef.current;
        ctx.fillRect(0, 0, width, height);
      }

      lastRenderedFrameRef.current = resolvedIndex;
    },
    [getClosestLoadedFrame],
  );

  // Resize canvas to fill viewport with proper pixel ratio
  const handleResize = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const width = window.innerWidth;
    const height = window.innerHeight;

    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = width < 768 ? "medium" : "high";

    vignetteGradRef.current = null; // Invalidate gradient cache on resize

    drawFrame(Math.round(currentFrameRef.current));
  }, [drawFrame]);

  // Helper to load a single frame on demand
  const loadSingleFrame = useCallback(
    (idx) => {
      if (idx < 1 || idx > TOTAL_FRAMES) return Promise.resolve();
      if (imagesRef.current[idx]) return Promise.resolve();

      return new Promise((resolve) => {
        const img = new Image();
        img.src = FRAME_PATH(idx);
        img.onload = () => {
          imagesRef.current[idx] = img;
          loadedSetRef.current.add(idx);
          const cur = Math.round(currentFrameRef.current);
          if (idx === cur || (idx === 1 && !lastRenderedFrameRef.current)) {
            drawFrame(idx);
          }
          resolve();
        };
        img.onerror = () => {
          resolve();
        };
      });
    },
    [drawFrame]
  );

  // Adaptive Frame Preloading Strategy (Lightweight on mobile, paused when out of view)
  useEffect(() => {
    let isCancelled = false;

    // Observe when Hero section is visible to pause/resume background loading
    const observer = new IntersectionObserver(
      ([entry]) => {
        isHeroInViewRef.current = entry.isIntersecting;
      },
      { threshold: 0.01, rootMargin: "200px 0px 200px 0px" }
    );

    const containerEl = containerRef.current;
    if (containerEl) observer.observe(containerEl);

    const startPreloading = async () => {
      // 1. Priority 1: Load initial frame immediately
      await loadSingleFrame(1);
      if (isCancelled) return;
      drawFrame(1);

      // 2. Priority 2: Keyframes across the sequence
      // On mobile: every 10th frame (~36 frames total, ~7.5MB instead of 76MB)
      // On desktop: every 5th frame (~72 frames total)
      const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
      const step = isMobile ? 10 : 5;

      const keyframes = [];
      for (let i = 1 + step; i <= TOTAL_FRAMES; i += step) {
        keyframes.push(i);
      }

      const KEYFRAME_CHUNK = isMobile ? 4 : 6;
      for (let i = 0; i < keyframes.length; i += KEYFRAME_CHUNK) {
        if (isCancelled) return;
        await Promise.all(
          keyframes.slice(i, i + KEYFRAME_CHUNK).map(loadSingleFrame)
        );
        // Micro-yield to keep main thread completely unblocked
        await new Promise((r) => setTimeout(r, 16));
      }

      if (isCancelled) return;

      // 3. Priority 3: Idle background loading for remaining frames
      // Only executes when browser is idle and Hero section is currently in view
      const remaining = [];
      for (let i = 2; i <= TOTAL_FRAMES; i++) {
        if (!loadedSetRef.current.has(i)) {
          remaining.push(i);
        }
      }

      let rIndex = 0;
      const loadIdleBatch = () => {
        if (isCancelled || rIndex >= remaining.length) return;

        if (isHeroInViewRef.current) {
          const batch = remaining.slice(rIndex, rIndex + (isMobile ? 3 : 5));
          rIndex += batch.length;
          Promise.all(batch.map(loadSingleFrame)).then(() => {
            if (!isCancelled && rIndex < remaining.length) {
              if (typeof requestIdleCallback !== "undefined") {
                requestIdleCallback(loadIdleBatch, { timeout: 150 });
              } else {
                setTimeout(loadIdleBatch, 60);
              }
            }
          });
        } else {
          // Check again in 600ms if hero re-enters view
          setTimeout(loadIdleBatch, 600);
        }
      };

      if (typeof requestIdleCallback !== "undefined") {
        requestIdleCallback(loadIdleBatch, { timeout: 200 });
      } else {
        setTimeout(loadIdleBatch, 100);
      }
    };

    startPreloading();

    return () => {
      isCancelled = true;
      if (containerEl) observer.unobserve(containerEl);
    };
  }, [drawFrame, loadSingleFrame]);

  // Updates transforms for desktop and mobile hero text based on scroll progress (0 to 1)
  const updateTextTransforms = useCallback((progress) => {
    const p = Math.min(Math.max(progress, 0), 1);

    // Map animation smoothly over 0.0 to 0.85 with cubic ease-out
    // so the entire word reaches its final resting position before the end of scroll
    const textP = Math.min(p / 0.85, 1);
    const ease = 1 - Math.pow(1 - textP, 3);

    // Desktop: oversized text moves upward from below viewport (120%),
    // stopping at 0% translateY so the entire word is completely visible near the bottom edge
    if (desktopTextRef.current) {
      const desktopY = (1 - ease) * 120;
      desktopTextRef.current.style.transform = `translate3d(0, ${desktopY.toFixed(2)}%, 0)`;
    }

    // Mobile: rotated text enters from beyond right edge (105%), moving strictly along X-axis,
    // stopping at 0% translateX (flush against right and bottom edges with zero margin/padding)
    if (mobileTextRef.current) {
      const mobileX = (1 - ease) * 105;
      mobileTextRef.current.style.transform = `translate3d(${mobileX.toFixed(2)}%, 0, 0)`;
    }

    // Scroll To Explore Indicator: smoothly fades out over first 2% of scroll
    if (scrollIndicatorRef.current) {
      const fadeProgress = Math.min(p / 0.02, 1);
      const indicatorOpacity = Math.max(0, 1 - fadeProgress);
      const indicatorY = fadeProgress * 14;

      scrollIndicatorRef.current.style.opacity = indicatorOpacity.toFixed(3);
      scrollIndicatorRef.current.style.transform = `translate3d(0, ${indicatorY.toFixed(1)}px, 0)`;
      scrollIndicatorRef.current.style.visibility = indicatorOpacity > 0.005 ? "visible" : "hidden";
      scrollIndicatorRef.current.style.pointerEvents = indicatorOpacity > 0.005 ? "auto" : "none";
    }
  }, []);

  // Scroll tracking and On-Demand RAF lerp loop (stops when settled or off-screen)
  useEffect(() => {
    handleResize();

    const startRenderLoop = () => {
      if (animationFrameIdRef.current) return;

      const renderLoop = () => {
        const container = containerRef.current;
        if (container) {
          const rect = container.getBoundingClientRect();
          if (rect.bottom < -200 || rect.top > window.innerHeight + 200) {
            animationFrameIdRef.current = null;
            return;
          }
        }

        const target = targetFrameRef.current;
        const current = currentFrameRef.current;
        const diff = target - current;

        let isMoving = false;
        if (Math.abs(diff) > 0.005) {
          currentFrameRef.current += diff * 0.15;
          const targetInt = Math.round(currentFrameRef.current);
          if (targetInt !== lastRenderedFrameRef.current) {
            drawFrame(targetInt);
          }
          isMoving = true;
        } else if (Math.abs(diff) > 0.0001) {
          currentFrameRef.current = target;
          const targetInt = Math.round(target);
          if (targetInt !== lastRenderedFrameRef.current) {
            drawFrame(targetInt);
          }
        }

        const rawP = (currentFrameRef.current - 1) / (TOTAL_FRAMES - 1);
        const p = Math.min(Math.max(rawP, 0), 1);
        if (Math.abs(p - lastProgressRef.current) > 0.0001) {
          updateTextTransforms(p);
          lastProgressRef.current = p;
          isMoving = true;
        }

        if (isMoving || Math.abs(target - currentFrameRef.current) > 0.005) {
          animationFrameIdRef.current = requestAnimationFrame(renderLoop);
        } else {
          animationFrameIdRef.current = null;
        }
      };

      animationFrameIdRef.current = requestAnimationFrame(renderLoop);
    };

    const onScroll = () => {
      const container = containerRef.current;
      if (!container) return;

      const rect = container.getBoundingClientRect();
      if (rect.bottom < -100 || rect.top > window.innerHeight + 100) return;

      const scrollY = -rect.top;
      const maxScroll = rect.height - window.innerHeight;
      if (maxScroll <= 0) return;

      const rawProgress = Math.min(Math.max(scrollY / maxScroll, 0), 1);
      const target = 1 + rawProgress * (TOTAL_FRAMES - 1);
      targetFrameRef.current = target;

      // Proximity load: prioritize nearby frames around scrub position
      const center = Math.round(target);
      const range = window.innerWidth < 768 ? 3 : 5;
      for (let f = Math.max(1, center - range); f <= Math.min(TOTAL_FRAMES, center + range); f++) {
        if (!loadedSetRef.current.has(f)) {
          loadSingleFrame(f);
        }
      }

      startRenderLoop();
    };

    // Calculate initial position immediately
    const container = containerRef.current;
    if (container) {
      const rect = container.getBoundingClientRect();
      const scrollY = -rect.top;
      const maxScroll = rect.height - window.innerHeight;
      const initialProgress =
        maxScroll > 0 ? Math.min(Math.max(scrollY / maxScroll, 0), 1) : 0;
      const initialTarget = 1 + initialProgress * (TOTAL_FRAMES - 1);
      targetFrameRef.current = initialTarget;
      currentFrameRef.current = initialTarget;
      updateTextTransforms(initialProgress);
      lastProgressRef.current = initialProgress;
    } else {
      updateTextTransforms(0);
      lastProgressRef.current = 0;
    }

    const onResizeHandler = () => {
      handleResize();
      startRenderLoop();
    };

    window.addEventListener("resize", onResizeHandler);
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.removeEventListener("resize", onResizeHandler);
      window.removeEventListener("scroll", onScroll);
      if (animationFrameIdRef.current) {
        cancelAnimationFrame(animationFrameIdRef.current);
        animationFrameIdRef.current = null;
      }
    };
  }, [handleResize, drawFrame, updateTextTransforms, loadSingleFrame]);

  // Re-render canvas frame when theme toggles
  const { theme } = useTheme();
  useEffect(() => {
    vignetteGradRef.current = null;
    drawFrame(Math.round(currentFrameRef.current));
  }, [theme, drawFrame]);

  return (
    <div
      ref={containerRef}
      id="home"
      style={{ height: "450vh" }}
      className="relative w-full bg-[#faf8f5] dark:bg-[#09090b] text-zinc-900 dark:text-zinc-100 transition-colors duration-300"
    >
      {/* Sticky Fullscreen Canvas Viewport */}
      <div
        style={{ height: "100vh", position: "sticky", top: 0 }}
        className="w-full overflow-hidden flex items-center justify-center pointer-events-none"
      >
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full object-cover z-0 pointer-events-none"
        />

        {/* Ambient Top Shadow Bar (Dark mode only) */}
        <div className="absolute top-0 inset-x-0 h-32 pointer-events-none z-10 transition-colors duration-300 hidden dark:block bg-gradient-to-b from-black/80 via-black/30 to-transparent" />

        {/* Desktop Hero Text: Center-aligned, moves upward from below viewport, flush against bottom edge with zero gap */}
        <div
          ref={desktopTextRef}
          className="hidden md:flex absolute inset-x-0 bottom-0 w-full justify-center pointer-events-none select-none z-20 will-change-transform"
          style={{
            bottom: 0,
            marginBottom: 0,
            paddingBottom: 0,
            transform: "translate3d(0, 120%, 0)",
          }}
        >
          <h1
            className="m-0 p-0 font-black uppercase tracking-[0.03em] whitespace-nowrap drop-shadow-[0_8px_20px_rgba(0,0,0,0.18)] dark:drop-shadow-[0_12px_28px_rgba(0,0,0,0.9)]"
            style={{
              fontSize: "clamp(3.5rem, 15vw, 15.5vw)",
              lineHeight: 0.75,
              display: "block",
              marginBottom: 0,
              paddingBottom: 0,
              background:
                "linear-gradient(180deg, rgba(231, 201, 130, 0.25) 0%, rgba(212, 175, 55, 0.60) 40%, rgba(181, 138, 69, 0.90) 75%, #8F6B32 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            SANCTUARY
          </h1>
        </div>

        {/* Mobile Hero Text: Vertical orientation (270deg / -90deg), reads bottom-to-top, scales with dvh, slides along X-axis */}
        <div
          ref={mobileTextRef}
          className="flex md:hidden absolute right-0 bottom-0 justify-end pointer-events-none select-none z-20 will-change-transform"
          style={{
            bottom: 0,
            right: 0,
            margin: 0,
            padding: 0,
            marginBottom: 0,
            paddingBottom: 0,
            marginRight: 0,
            paddingRight: 0,
            transform: "translate3d(105%, 0, 0)",
          }}
        >
          <h1
            className="m-0 p-0 font-black uppercase tracking-tight whitespace-nowrap drop-shadow-[0_8px_20px_rgba(0,0,0,0.18)] dark:drop-shadow-[0_12px_28px_rgba(0,0,0,0.9)]"
            style={{
              fontSize: "clamp(2rem, 9.5dvh, 4.8rem)",
              lineHeight: 0.75,
              display: "block",
              margin: 0,
              padding: 0,
              marginBottom: 0,
              paddingBottom: 0,
              marginRight: 0,
              paddingRight: 0,
              transformOrigin: "100% 100%",
              transform: "rotate(-90deg) translateX(100%)",
              background:
                "linear-gradient(180deg, rgba(231, 201, 130, 0.25) 0%, rgba(212, 175, 55, 0.60) 40%, rgba(181, 138, 69, 0.90) 75%, #8F6B32 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            ARCHITECTURE
          </h1>
        </div>

        {/* Scroll To Explore Indicator: precisely centered in viewport on desktop and mobile */}
        <div
          ref={scrollIndicatorRef}
          className="absolute bottom-6 sm:bottom-8 lg:bottom-10 inset-x-0 mx-auto w-fit z-30 flex flex-col items-center gap-1.5 sm:gap-2 select-none cursor-pointer group pointer-events-auto transition-colors duration-300 will-change-transform rounded-full px-4 py-1.5 focus:outline-none focus-visible:ring-1 focus-visible:ring-[#D4AF37]"
          style={{
            transform: "translate3d(0, 0, 0)",
            opacity: 1,
          }}
          onClick={() => {
            window.scrollBy({ top: window.innerHeight * 0.75, behavior: "smooth" });
          }}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              window.scrollBy({ top: window.innerHeight * 0.75, behavior: "smooth" });
            }
          }}
          aria-label="Scroll to explore"
        >
          {/* Label with gentle floating motion */}
          <span className="font-mono text-[9px] sm:text-[10px] font-semibold tracking-[0.28em] uppercase text-zinc-900 dark:text-zinc-100 transition-colors duration-300 group-hover:text-[#8F6B32] dark:group-hover:text-[#E7C982] drop-shadow-[0_1px_4px_rgba(255,255,255,0.85)] dark:drop-shadow-[0_2px_8px_rgba(0,0,0,0.95)] animate-scroll-text text-center inline-block">
            SCROLL TO EXPLORE
          </span>

          {/* Animated Downward Arrow & Vertical Line with gentle floating loop */}
          <div className="flex flex-col items-center animate-scroll-arrow">
            <div className="w-[1.5px] h-6 sm:h-8 bg-gradient-to-b from-transparent via-[#8F6B32] dark:via-[#D4AF37] to-[#8F6B32] dark:to-[#D4AF37] rounded-full" />
            <svg
              className="w-3.5 h-3.5 text-[#8F6B32] dark:text-[#D4AF37] -mt-1 transition-colors duration-300 drop-shadow-[0_2px_4px_rgba(0,0,0,0.25)] dark:drop-shadow-[0_0_8px_rgba(212,175,55,0.4)]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.2}
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}
