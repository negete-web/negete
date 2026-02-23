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
}

/** Animacje z GSAP i ScrollTrigger - przywrócone */
export function useProcessAnimations(
  refs: ProcessAnimationRefs,
  processData: unknown,
  isMobile: boolean
) {
  const {
    pathRef,
    pathMobileRef,
    svgSectionRef,
    cardRefs,
    imgRefs,
    heroTitleRef,
    heroIntroRef,
    heroLineRef,
  } = refs;

  // Hero: animacja fade-in
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
          }
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
          }
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
          }
        );
      }
    });

    return () => ctx.revert();
  }, [heroTitleRef, heroIntroRef, heroLineRef]);

  // SVG Path: animacja rysowania podczas scrollowania + dynamiczne dostosowanie pozycji startowej
  useEffect(() => {
    if (!svgSectionRef.current) return;

    const path = isMobile ? pathMobileRef.current : pathRef.current;
    const svg = path?.closest("svg");
    if (!path || !svg) return;

    // Funkcja do obliczenia pozycji bordera względem SVG viewBox
    const updatePathStartPosition = () => {
      if (!heroLineRef.current || !svgSectionRef.current || isMobile) return;

      const borderRect = heroLineRef.current.getBoundingClientRect();
      const sectionRect = svgSectionRef.current.getBoundingClientRect();

      // Oblicz pozycję bordera względem sekcji SVG
      const borderTopRelativeToSection = borderRect.top - sectionRect.top;
      const sectionHeight = sectionRect.height;

      // ViewBox: "-50 100 900 2700" -> y start: 100, height: 2700
      const viewBoxY = 100;
      const viewBoxHeight = 2700;
      
      // Oblicz pozycję Y w viewBox (uwzględniając, że sekcja może być przesunięta przez -mt-[40vh])
      const borderYInViewBox = viewBoxY + (borderTopRelativeToSection / sectionHeight) * viewBoxHeight;

      // Aktualizuj ścieżkę - zmień startową pozycję Y
      const currentPath = path.getAttribute("d") || "";
      // Znajdź i zamień pierwszą pozycję Y w ścieżce (po M 400)
      const updatedPath = currentPath.replace(/M 400 \d+/, `M 400 ${Math.round(borderYInViewBox)}`);
      path.setAttribute("d", updatedPath);
    };

    // Funkcja do inicjalizacji i setupu animacji
    const initAndSetup = () => {
      updatePathStartPosition();
      // Po aktualizacji ścieżki, oblicz nową długość
      const pathLength = path.getTotalLength();
      gsap.set(path, {
        strokeDasharray: pathLength,
        strokeDashoffset: pathLength,
      });
    };

    const ctx = gsap.context(() => {
      setTimeout(initAndSetup, 100); // Małe opóźnienie, żeby elementy były już wyrenderowane
      window.addEventListener("resize", initAndSetup);
      window.addEventListener("scroll", updatePathStartPosition); // Tylko aktualizacja pozycji przy scroll, bez resetowania animacji

      ScrollTrigger.create({
        trigger: svgSectionRef.current,
        start: "top top",
        end: "bottom bottom",
        scrub: true, // Smooth scrollowanie
        onUpdate: (self) => {
          const progress = self.progress;
          // Oblicz długość dynamicznie, bo ścieżka może się zmieniać
          const currentPathLength = path.getTotalLength();
          // Spowolnienie animacji - zmniejszamy progress, żeby animacja była wolniejsza
          const slowedProgress = progress * 0.65; // Trochę szybciej niż 0.6
          // Custom easing - wolniejszy na początku (power2), ale przyspiesza pod koniec (power1)
          // Dla pierwszych 60% użyj power2.out, dla reszty bardziej liniowy
          let easedProgress;
          if (slowedProgress < 0.6) {
            easedProgress = 1 - Math.pow(1 - slowedProgress, 2); // Wolniej na początku
          } else {
            // Mapuj z zakresu [0.6, 0.65] na [0.64, 1.0]
            const startValue = 1 - Math.pow(1 - 0.6, 2); // Wartość w punkcie 0.6
            const range = 1.0 - startValue;
            const t = (slowedProgress - 0.6) / (0.65 - 0.6); // Normalizuj do [0, 1]
            easedProgress = startValue + t * range; // Mapuj liniowo do [startValue, 1.0]
          }
          // Upewnij się, że easedProgress nie przekracza 1
          easedProgress = Math.min(1, easedProgress);
          gsap.set(path, {
            strokeDashoffset: currentPathLength * (1 - easedProgress),
            force3D: true,
          });
        },
      });
    }, svgSectionRef.current);

    return () => {
      window.removeEventListener("resize", initAndSetup);
      window.removeEventListener("scroll", updatePathStartPosition);
      ctx.revert();
    };
  }, [pathRef, pathMobileRef, svgSectionRef, heroLineRef, isMobile]);

  // Karty i obrazy: animacja podczas scrollowania z efektem rozjasnienia (glow)
  useEffect(() => {
    if (!svgSectionRef.current) return;

    const ctx = gsap.context(() => {
      const cards = cardRefs.current.filter(Boolean);
      const images = imgRefs.current.filter(Boolean);

      cards.forEach((card) => {
        if (!card) return;
        gsap.set(card, {
          opacity: 0.15,
          y: 50,
          force3D: true,
        });

        // Animacja wejscia - fade in + glow
        ScrollTrigger.create({
          trigger: card,
          start: "top 85%",
          end: "top 35%",
          scrub: 0.5,
          onUpdate: (self) => {
            const progress = self.progress;
            gsap.set(card, {
              opacity: 0.15 + progress * 0.85,
              y: 50 * (1 - progress),
              force3D: true,
            });
            // Neonowy glow na kartach - rozjasnienie jak w homepage
            const glowIntensity = Math.sin(progress * Math.PI); // peak w srodku
            const inner = card.querySelector("div");
            if (inner) {
              inner.style.boxShadow =
                glowIntensity > 0.1
                  ? `0 0 ${20 * glowIntensity}px rgba(0, 240, 255, ${0.15 * glowIntensity}), 0 0 ${60 * glowIntensity}px rgba(0, 240, 255, ${0.08 * glowIntensity})`
                  : "";
              inner.style.borderColor =
                glowIntensity > 0.1
                  ? `rgba(0, 240, 255, ${0.1 + 0.2 * glowIntensity})`
                  : "";
            }
          },
        });
      });

      images.forEach((img) => {
        if (!img) return;
        gsap.set(img, {
          opacity: 0.15,
          scale: 0.95,
          force3D: true,
        });

        ScrollTrigger.create({
          trigger: img,
          start: "top 85%",
          end: "top 35%",
          scrub: 0.5,
          onUpdate: (self) => {
            const progress = self.progress;
            gsap.set(img, {
              opacity: 0.15 + progress * 0.85,
              scale: 0.95 + 0.05 * progress,
              force3D: true,
            });
            // Neonowy glow na obrazach
            const glowIntensity = Math.sin(progress * Math.PI);
            if (glowIntensity > 0.1) {
              img.style.boxShadow = `0 0 ${30 * glowIntensity}px rgba(0, 240, 255, ${0.2 * glowIntensity}), 0 0 ${80 * glowIntensity}px rgba(0, 240, 255, ${0.1 * glowIntensity})`;
              img.style.borderColor = `rgba(0, 240, 255, ${0.3 + 0.4 * glowIntensity})`;
            } else {
              img.style.boxShadow = "";
              img.style.borderColor = "";
            }
          },
        });
      });
    }, svgSectionRef.current);

    return () => ctx.revert();
  }, [cardRefs, imgRefs, svgSectionRef, processData, isMobile]);
}
