"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ChevronDown } from "lucide-react";
import type { Language } from "@/i18n/config";
import { t } from "@/i18n/dictionary";

interface HeroAltProps {
  lang?: Language;
}

export default function NeonSideFlyInSafari({ lang = "pl" }: HeroAltProps) {
  const subtitleRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const coreLettersRef = useRef<(HTMLSpanElement | null)[]>([]);
  const glowLettersRef = useRef<(HTMLSpanElement | null)[]>([]);

  const text = "NEGETE";
  const startPositions = [
    { x: -450, y: 50, rotation: -25 }, // N
    { x: -300, y: -30, rotation: -15 }, // E
    { x: -150, y: 20, rotation: -5 }, // G
    { x: 150, y: -20, rotation: 5 }, // E
    { x: 300, y: 30, rotation: 15 }, // T
    { x: 450, y: -50, rotation: 25 }, // E
  ];

  useEffect(() => {
    const ctx = gsap.context(() => {
      const paths = svgRef.current?.querySelectorAll("path");
      if (!paths) return;
      paths.forEach((path) => {
        const length = path.getTotalLength();
        gsap.set(path, { strokeDasharray: length, strokeDashoffset: length });
      });

      const coreLetters = coreLettersRef.current.filter(Boolean);
      const glowLetters = glowLettersRef.current.filter(Boolean);

      coreLetters.forEach((letter, i) => {
        const pos = startPositions[i];
        gsap.set(letter, {
          autoAlpha: 0,
          x: pos.x,
          y: pos.y,
          rotation: pos.rotation,
          scale: 0.5,
          transformOrigin: "center center",
        });
      });

      gsap.set(glowLetters, {
        autoAlpha: 0,
        x: 0,
        y: 0,
        rotation: 0,
        scale: 1,
        transformOrigin: "center center",
      });

      const tl = gsap.timeline({
        defaults: { ease: "power3.inOut", force3D: true },
      });
      tl.to(svgRef.current, {
        autoAlpha: 1,
        y: -60,
        scale: 1.15,
        duration: 2.5,
      })
        .to(
          paths,
          {
            strokeDashoffset: 0,
            duration: 3,
            stagger: 0,
          },
          "-=2",
        )

        .to(
          coreLetters,
          {
            autoAlpha: 1,
            x: 0,
            y: 0,
            scale: 1,
            rotation: 0,
            duration: 1.6,
            stagger: {
              each: 0.1,
              from: "center",
            },
            ease: "back.out(1.4)",
          },
          "-=2.2",
        )
        .to(
          glowLetters,
          {
            autoAlpha: 1,
            duration: 1.8,
            stagger: {
              each: 0.1,
              from: "center",
            },
            ease: "power2.inOut", // Miękkie pojawienie się światła
          },
          "<+=0.3",
        );
      const glowLayer = containerRef.current?.querySelector(".neon-glow-layer");
      if (glowLayer) {
        tl.to(
          glowLayer,
          {
            opacity: 0.6,
            duration: 2,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
          },
          "+=0.5",
        );
      }

      if (subtitleRef.current) {
        gsap.set(subtitleRef.current, { autoAlpha: 0, y: 20 });
        tl.to(
          subtitleRef.current,
          {
            autoAlpha: 1,
            y: 0,
            duration: 1.2,
            ease: "power2.out",
          },
          "-=2",
        );
      }
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const baseTextStyle =
    "absolute left-0 top-0 w-full  h-full flex justify-between -mt-12 md:mt-0 px-4 md:px-0 items-center font-light text-5xl sm:text-8xl md:text-9xl lg:text-[8rem] xl:text-[9rem] pointer-events-none select-none antialiased";
  const heroFontStyle = { fontFamily: "var(--font-orbitron), sans-serif" };
  const letterStyle = "inline-block mx-1 invisible opacity-0";
  const neonTextShadow = `
    0 0 4px #fff,
    0 0 10px rgba(255,255,255,0.6),
    0 0 20px rgba(173,216,230,0.5),
    0 0 35px rgba(173,216,230,0.3)
  `;
  const coreTextShadow = `
    0 0 1px #fff,
    0 0 4px rgba(173,216,230,0.35)
  `;

  const svgNeonFilter = {
    filter: `
      drop-shadow(0 0 4px #fff)
      drop-shadow(0 0 20px rgba(173,216,230,0.8))
      drop-shadow(0 0 45px rgba(173,216,230,0.5))
    `,
  };

  const handleScrollDown = () => {
    window.scrollTo({ top: window.innerHeight, behavior: "smooth" });
  };

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden pt-12">
      <svg
        ref={svgRef}
        viewBox="0 0 1000 600"
        className="absolute inset-0 w-full h-full max-w-[1400px] mt-20 md:mt-0 pointer-events-none invisible opacity-0 m-auto"
        preserveAspectRatio="xMidYMid slice"
        style={{
          willChange: "transform",
          transform: "translateZ(0)",
          ...svgNeonFilter,
        }}>
        <g fill="none" stroke="white" strokeWidth="4" strokeLinecap="round">
          <path d="M 502 309 A 520 450 0 0 1 -25 -146" />
          <path d="M 502 309 A 520 450 0 0 0 1026 -134" />
        </g>
      </svg>

      <div className="w-full  mt-12 flex items-center justify-center">
        <h1 className="relative z-10 w-full max-w-7xl h-[200px] m-0 flex items-center justify-center">
          <div
            className={`${baseTextStyle} text-[#E8F4FC] neon-glow-layer`}
            style={{ ...heroFontStyle, textShadow: neonTextShadow }}>
            {text.split("").map((letter, i) => (
              <span
                key={`glow-${i}`}
                ref={(el) => {
                  glowLettersRef.current[i] = el;
                }}
                className={`${letterStyle} will-change-[opacity]`}>
                {letter}
              </span>
            ))}
          </div>
          <div
            className={`${baseTextStyle} text-[#FFFFFF]`}
            style={{ ...heroFontStyle, textShadow: coreTextShadow }}>
            {text.split("").map((letter, i) => (
              <span
                key={`core-${i}`}
                ref={(el) => {
                  coreLettersRef.current[i] = el;
                }}
                className={`${letterStyle} will-change-transform`}>
                {letter}
              </span>
            ))}
          </div>
        </h1>
      </div>
      <div
        ref={subtitleRef}
        className="relative z-10 mt-24 flex flex-col items-center gap-6 invisible opacity-0">
        <p
          className="text-sm sm:text-base tracking-[0.25em] uppercase text-white/70 font-light text-center"
          style={{
            textShadow: "0 0 8px rgba(79, 195, 247, 0.3)",
          }}>
          {t(lang, "hero.subtitle")}
        </p>
        <button
          onClick={handleScrollDown}
          aria-label={t(lang, "hero.scroll")}
          className="group flex flex-col items-center gap-2 text-white/50 hover:text-white/80 transition-colors cursor-pointer">
          <span className="text-xs tracking-widest uppercase hidden sm:block">
            {t(lang, "hero.scroll")}
          </span>
          <ChevronDown className="w-6 h-6 animate-bounce" />
        </button>
      </div>
    </section>
  );
}
