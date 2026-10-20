"use client";

import { useEffect, useRef, useState } from "react";

export default function ContactCTA() {
  const sectionRef = useRef(null);
  const cardRef = useRef(null);
  const footerRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const [cardVisible, setCardVisible] = useState(false);
  const [footerVisible, setFooterVisible] = useState(false);

  useEffect(() => {
    const isDesktop = typeof window !== "undefined" && window.innerWidth >= 1024;

    if (isDesktop) {
      // Desktop: preserve existing whole-section synchronized entrance
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            setCardVisible(true);
            setFooterVisible(true);
            observer.disconnect();
          }
        },
        { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
      );

      const el = sectionRef.current;
      if (el) observer.observe(el);

      return () => observer.disconnect();
    } else {
      // Mobile & Tablet: individual scroll-triggered entrance for CTA card and footer
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              if (entry.target === cardRef.current) {
                setCardVisible(true);
                observer.unobserve(entry.target);
              } else if (entry.target === footerRef.current) {
                setFooterVisible(true);
                observer.unobserve(entry.target);
              }
            }
          });
        },
        { threshold: 0.12, rootMargin: "0px 0px -30px 0px" }
      );

      if (cardRef.current) observer.observe(cardRef.current);
      if (footerRef.current) observer.observe(footerRef.current);

      return () => observer.disconnect();
    }
  }, []);

  const whatsappMessage = encodeURIComponent(
    "Hello, I am interested in discussing a construction project (house construction / renovation / turnkey contract). I would like to schedule a consultation."
  );
  const whatsappUrl = `https://wa.me/917510600218?text=${whatsappMessage}`;

  return (
    <section
      ref={sectionRef}
      id="contact"
      className="relative z-30 w-full bg-[#faf8f5] dark:bg-[#09090b] text-zinc-900 dark:text-zinc-100 pt-12 sm:pt-16 lg:pt-20 pb-12 sm:pb-16 px-5 sm:px-10 lg:px-16 overflow-hidden border-t border-black/[0.06] dark:border-white/[0.06] transition-colors duration-300"
    >
      {/* Background Architectural Glows & Noise */}
      <div className="absolute inset-0 bg-[radial-gradient(#ffffff08_1px,transparent_1px)] [background-size:28px_28px] pointer-events-none" />
      <div className="absolute bottom-1/3 right-10 w-[550px] h-[550px] bg-[#D4AF37]/[0.03] rounded-full blur-[180px] pointer-events-none" />
      <div className="absolute top-10 left-10 w-[500px] h-[500px] bg-black/[0.015] dark:bg-white/[0.015] rounded-full blur-[150px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto">
        {/* Main CTA Hero Container */}
        <div
          ref={cardRef}
          className={`relative rounded-3xl p-8 sm:p-14 lg:p-20 bg-white dark:bg-gradient-to-b dark:from-[#141418] dark:via-[#101013] dark:to-[#0d0d10] border border-black/[0.08] dark:border-white/[0.09] shadow-xl dark:shadow-2xl transition-all duration-700 ease-out overflow-hidden ${
            isVisible || cardVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          {/* Subtle Background Structural Accent Grid */}
          <div className="absolute -right-20 -top-20 w-80 h-80 rounded-full border border-black/[0.04] dark:border-white/[0.04] pointer-events-none" />
          <div className="absolute -right-40 -top-40 w-[420px] h-[420px] rounded-full border border-[#D4AF37]/20 dark:border-[#D4AF37]/[0.08] pointer-events-none" />

          <div className="relative z-10 max-w-3xl">
            {/* Category Badges */}
            <div className="flex flex-wrap items-center gap-2 mb-6 sm:mb-8">
              <span className="inline-flex items-center px-3.5 py-1.5 rounded-full text-[11px] font-semibold tracking-widest uppercase bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 text-zinc-700 dark:text-zinc-300">
                Direct Project Advisory
              </span>
              <span className="inline-flex items-center px-3.5 py-1.5 rounded-full text-[11px] font-semibold tracking-widest uppercase bg-[#D4AF37]/15 dark:bg-[#D4AF37]/10 border border-[#D4AF37]/30 dark:border-[#D4AF37]/25 text-[#8F6B32] dark:text-[#E7C982]">
                Turnkey & Renovation
              </span>
            </div>

            {/* Main Short Heading with Architectural Outlined Accent */}
            <h2 className="text-4xl sm:text-6xl lg:text-7xl font-black uppercase tracking-tight text-zinc-900 dark:text-white leading-[0.98] mb-6 sm:mb-8">
              Let’s Build <br />
              <span className="text-transparent [-webkit-text-stroke:1.5px_#18181b] sm:[-webkit-text-stroke:2.5px_#18181b] dark:[-webkit-text-stroke:1.5px_#ffffff] dark:sm:[-webkit-text-stroke:2.5px_#ffffff]">
                Together
              </span>
              <span className="text-[#D4AF37] ml-1">.</span>
            </h2>

            {/* Concise Supporting Text */}
            <p className="text-sm sm:text-base lg:text-lg text-zinc-600 dark:text-zinc-300 font-normal leading-relaxed mb-10 max-w-2xl">
              Whether you are planning a ground-up residential build, a
              structural renovation, or need a reliable turnkey contract partner—our
              team provides itemized cost transparency, licensed engineering, and
              uncompromising craftsmanship from day one.
            </p>

            {/* Action Buttons: Prominent "Discuss Your Project" Button */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center justify-center gap-3 px-8 py-4 sm:py-4.5 rounded-full bg-gradient-to-r from-[#E7C982] via-[#D4AF37] to-[#B58A45] text-black font-bold text-sm sm:text-base tracking-wide shadow-[0_10px_35px_rgba(212,175,55,0.3)] hover:shadow-[0_15px_45px_rgba(212,175,55,0.45)] hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                {/* WhatsApp SVG Icon */}
                <svg
                  className="w-8 h-8 sm:w-9 sm:h-9 shrink-0 fill-current"
                  viewBox="0 0 24 24"
                >
                  <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766 0-3.18-2.588-5.771-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.007c.106.005.249-.04.39.299.144.347.491 1.2.534 1.287.043.087.072.188.014.303-.058.116-.087.188-.173.289l-.26.303c-.087.087-.177.181-.076.355.101.173.449.741.964 1.201.662.591 1.221.774 1.394.861.173.086.275.072.376-.044.101-.116.433-.506.549-.68.116-.173.231-.144.39-.086s1.011.477 1.184.564.289.13.332.202c.043.073.043.419-.101.824z" />
                </svg>

                <span>Discuss Your Project</span>

                <svg
                  className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
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

              <a
                href="mailto:contact@architecture-build.com?subject=Construction%20Project%20Inquiry"
                className="inline-flex items-center justify-center gap-2 px-7 py-4 sm:py-4.5 rounded-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 hover:border-black/25 dark:hover:border-white/25 hover:bg-black/10 dark:hover:bg-white/10 text-zinc-800 dark:text-zinc-200 font-semibold text-sm sm:text-base transition-all"
              >
                <span>Send Architectural Scope</span>
              </a>
            </div>

            {/* Quick Pillars of Engagement */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mt-12 sm:mt-16 pt-8 border-t border-black/[0.08] dark:border-white/[0.08]">
              <div>
                <p className="text-xs font-mono uppercase tracking-wider text-[#8F6B32] dark:text-[#E7C982] font-bold mb-1">
                  01 / Residential
                </p>
                <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  Bespoke villas, luxury family homes, and turnkey architectural estates.
                </p>
              </div>

              <div>
                <p className="text-xs font-mono uppercase tracking-wider text-[#8F6B32] dark:text-[#E7C982] font-bold mb-1">
                  02 / Renovation
                </p>
                <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  Structural remodels, heritage restorations, and high-spec interiors.
                </p>
              </div>

              <div>
                <p className="text-xs font-mono uppercase tracking-wider text-[#8F6B32] dark:text-[#E7C982] font-bold mb-1">
                  03 / Turnkey Contract
                </p>
                <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  Itemized BOQ contracts with locked milestone completion dates.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Minimal Architectural Footer */}
        <div
          ref={footerRef}
          className={`mt-16 sm:mt-20 pt-8 border-t border-black/[0.08] dark:border-white/[0.08] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500 dark:text-zinc-400 transition-all duration-700 ease-out ${
            isVisible || footerVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
        >
          <div className="flex items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/lk-associates-emblem-only.webp"
              alt="LK Associates"
              className="w-5 h-5 object-contain opacity-80"
            />
            <span className="font-mono font-bold tracking-wider text-zinc-800 dark:text-zinc-200 uppercase">
              LK ASSOCIATES ARCHITECTS & CONSTRUCTORS
            </span>
            <span className="hidden sm:inline text-zinc-400 dark:text-zinc-600">•</span>
            <span>All rights reserved</span>
          </div>

          <div className="flex items-center gap-6">
            <a href="#projects" className="hover:text-zinc-900 dark:hover:text-zinc-200 transition-colors">
              Portfolio
            </a>
            <a href="#expertise" className="hover:text-zinc-900 dark:hover:text-zinc-200 transition-colors">
              Expertise
            </a>
            <a href="#process" className="hover:text-zinc-900 dark:hover:text-zinc-200 transition-colors">
              Process
            </a>
            <a href="#testimonials" className="hover:text-zinc-900 dark:hover:text-zinc-200 transition-colors">
              Testimonials
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

