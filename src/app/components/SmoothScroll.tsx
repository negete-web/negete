"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";

interface SmoothScrollProps {
  children: React.ReactNode;
}

/**
 * Globalny smooth scroll oparty na Lenis.
 * - Inicjalizuje Lenis raz na mount.
 * - Resetuje scroll do góry przy zmianie trasy.
 */
export default function SmoothScroll({ children }: SmoothScrollProps) {
  const pathname = usePathname();
  const lenisRef = useRef<Lenis | null>(null);

  // Inicjalizacja Lenis – odroczona żeby nie blokować LCP
  useEffect(() => {
    if (typeof window === "undefined") return;

    let frameId: number;
    let lenis: Lenis;

    const init = () => {
      lenis = new Lenis({
        lerp: 0.1,
        smoothWheel: true,
        touchMultiplier: 1.5,
      });

      lenisRef.current = lenis;

      const raf = (time: number) => {
        lenis.raf(time);
        frameId = requestAnimationFrame(raf);
      };

      frameId = requestAnimationFrame(raf);
    };

    let idleId: number;
    if (typeof window.requestIdleCallback === "function") {
      idleId = window.requestIdleCallback(init, { timeout: 2000 });
    } else {
      idleId = window.setTimeout(init, 100) as unknown as number;
    }

    return () => {
      if (typeof window.requestIdleCallback === "function") {
        window.cancelIdleCallback(idleId);
      } else {
        clearTimeout(idleId);
      }
      if (frameId) cancelAnimationFrame(frameId);
      if (lenis) {
        lenis.destroy();
        lenisRef.current = null;
      }
    };
  }, []);

  // Reset scrolla przy zmianie ścieżki
  useEffect(() => {
    if (typeof window === "undefined") return;
    if ("scrollRestoration" in history) {
      history.scrollRestoration = "manual";
    }

    // Użyj Lenis jeśli dostępny, inaczej fallback do window.scrollTo
    const lenis = lenisRef.current;
    if (lenis) {
      lenis.scrollTo(0, { immediate: true });
    } else {
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    }
  }, [pathname]);

  return <>{children}</>;
}
