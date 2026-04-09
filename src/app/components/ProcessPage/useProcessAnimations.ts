"use client";

import { useEffect, useLayoutEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface ProcessAnimationRefs {
  pathRef: React.RefObject<SVGPathElement | null>;
  pathMobileRef: React.RefObject<SVGPathElement | null>;
  svgSectionRef: React.RefObject<HTMLElement | null>;
  cardRefs: React.MutableRefObject<(HTMLDivElement | null)[]>;
  imgRefs: React.MutableRefObject<(HTMLDivElement | null)[]>;
  heroTitleRef: React.RefObject<HTMLHeadingElement | null>;
  heroIntroRef: React.RefObject<HTMLParagraphElement | null>;
  heroLineRef: React.RefObject<HTMLDivElement | null>;
  mobileLineFillRef: React.RefObject<HTMLDivElement | null>;
}

/** Animacje z GSAP i ScrollTrigger - przywrócone */
export function useProcessAnimations(
  refs: ProcessAnimationRefs,
  processData: unknown,
  isMobile: boolean,
) {
  const {
    pathRef,
    pathMobileRef,
    svgSectionRef,
    cardRefs,
    heroTitleRef,
    heroIntroRef,
    heroLineRef,
    mobileLineFillRef,
  } = refs;

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      if (heroTitleRef.current) {
        gsap.fromTo(
          heroTitleRef.current,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            delay: 0.2,
            ease: "power2.out",
            force3D: true,
          },
        );
      }
      if (heroIntroRef.current) {
        gsap.fromTo(
          heroIntroRef.current,
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            delay: 0.4,
            ease: "power2.out",
            force3D: true,
          },
        );
      }
      if (heroLineRef.current) {
        gsap.fromTo(
          heroLineRef.current,
          { opacity: 0, scaleX: 0 },
          {
            opacity: 1,
            scaleX: 1,
            duration: 0.8,
            delay: 0.6,
            ease: "power2.out",
            force3D: true,
          },
        );
      }
    });

    return () => ctx.revert();
  }, [heroTitleRef, heroIntroRef, heroLineRef]);

  useEffect(() => {
    if (!svgSectionRef.current) return;

    const path = isMobile ? pathMobileRef.current : pathRef.current;

    const updatePathStartPosition = () => {
      if (!heroLineRef.current || !svgSectionRef.current || isMobile || !path) return;

      const borderRect = heroLineRef.current.getBoundingClientRect();
      const sectionRect = svgSectionRef.current.getBoundingClientRect();

      const borderTopRelativeToSection = borderRect.top - sectionRect.top;
      const sectionHeight = sectionRect.height;

      const viewBoxY = 100;
      const viewBoxHeight = 2700;

      const borderYInViewBox =
        viewBoxY + (borderTopRelativeToSection / sectionHeight) * viewBoxHeight;

      const currentPath = path.getAttribute("d") || "";
      const updatedPath = currentPath.replace(
        /M 400 \d+/,
        `M 400 ${Math.round(borderYInViewBox)}`,
      );
      path.setAttribute("d", updatedPath);
    };

    const getEasedProgress = (progress: number) => {
      const slowedProgress = progress * 0.52;
      if (slowedProgress < 0.4) {
        return 1 - Math.pow(1 - slowedProgress, 2);
      }
      const startValue = 1 - Math.pow(1 - 0.4, 2);
      const t = (slowedProgress - 0.4) / (0.52 - 0.4);
      return Math.min(1, startValue + (1 - startValue) * Math.pow(t, 0.7));
    };

    const initAndSetup = () => {
      updatePathStartPosition();
      if (isMobile || !path) return;
      const pathLength = path.getTotalLength();
      gsap.set(path, {
        strokeDasharray: pathLength,
        strokeDashoffset: pathLength,
      });
    };

    const ctx = gsap.context(() => {
      setTimeout(initAndSetup, 100);
      window.addEventListener("resize", initAndSetup);
      window.addEventListener("scroll", updatePathStartPosition);

      ScrollTrigger.create({
        trigger: svgSectionRef.current,
        start: "top top",
        end: "bottom bottom",
        scrub: true,
        onUpdate: (self) => {
          const progress = self.progress;
          const easedProgress = getEasedProgress(progress);

          if (isMobile && mobileLineFillRef.current) {
            mobileLineFillRef.current.style.height = `${easedProgress * 100}%`;
          } else if (path) {
            const currentPathLength = path.getTotalLength();
            gsap.set(path, {
              strokeDashoffset: currentPathLength * (1 - easedProgress),
              force3D: true,
            });
          }
        },
      });
    }, svgSectionRef.current);

    return () => {
      window.removeEventListener("resize", initAndSetup);
      window.removeEventListener("scroll", updatePathStartPosition);
      ctx.revert();
    };
  }, [pathRef, pathMobileRef, svgSectionRef, heroLineRef, isMobile, mobileLineFillRef]);

  useEffect(() => {
    if (!svgSectionRef.current) return;

    function hexToRgba(hex: string, a: number): string {
      const m = hex
        .replace(/^#/, "")
        .match(/([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})/i);
      if (!m) return `rgba(0,240,255,${a})`;
      return `rgba(${parseInt(m[1], 16)},${parseInt(m[2], 16)},${parseInt(m[3], 16)},${a})`;
    }

    const ctx = gsap.context(() => {
      const cards = cardRefs.current.filter(Boolean);

      cards.forEach((card, index) => {
        if (!card) return;
        const sectionColor =
          card.getAttribute("data-section-color") || "#00f0ff";
        const isFirstCard = index === 0;
        ScrollTrigger.create({
          trigger: card,
          start: isFirstCard ? "top 28%" : "top 42%",
          end: "top 5%",
          scrub: 1.4,
          onUpdate: (self) => {
            const progress = self.progress;
            const glowIntensity = Math.sin(progress * Math.PI);
            if (glowIntensity > 0.08) {
              card.style.boxShadow = `0 0 ${20 * glowIntensity}px ${hexToRgba(sectionColor, 0.2 * glowIntensity)}, 0 0 ${60 * glowIntensity}px ${hexToRgba(sectionColor, 0.1 * glowIntensity)}`;
              card.style.borderColor = hexToRgba(
                sectionColor,
                0.15 + 0.35 * glowIntensity,
              );
            } else {
              card.style.boxShadow = "";
              card.style.borderColor = "";
            }
          },
        });
      });
    }, svgSectionRef.current);

    return () => ctx.revert();
  }, [cardRefs, svgSectionRef, processData, isMobile]);
}
