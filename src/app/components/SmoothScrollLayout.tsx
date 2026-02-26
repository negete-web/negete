"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

interface SmoothScrollLayoutProps {
  children: React.ReactNode;
}

export default function SmoothScrollLayout({
  children,
}: SmoothScrollLayoutProps) {
  const tweenRef = useRef<gsap.core.Tween | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (prefersReducedMotion) {
      return;
    }

    const isFinePointer = window.matchMedia("(pointer: fine)").matches;
    if (!isFinePointer) {
      return;
    }

    let currentScroll = window.scrollY || 0;

    const scrollTo = (target: number) => {
      const maxScroll =
        document.documentElement.scrollHeight - window.innerHeight;
      const clampedTarget = Math.max(0, Math.min(target, maxScroll));

      if (tweenRef.current) {
        tweenRef.current.kill();
      }

      const proxy = { value: currentScroll };

      tweenRef.current = gsap.to(proxy, {
        value: clampedTarget,
        duration: 0.7,
        ease: "power3.out",
        overwrite: true,
        onUpdate: () => {
          currentScroll = proxy.value;
          window.scrollTo(0, currentScroll);
        },
      });
    };

    const onWheel = (event: WheelEvent) => {
      event.preventDefault();
      const delta = event.deltaY;
      scrollTo(currentScroll + delta);
    };

    window.addEventListener("wheel", onWheel, { passive: false });

    return () => {
      window.removeEventListener("wheel", onWheel);
      if (tweenRef.current) {
        tweenRef.current.kill();
        tweenRef.current = null;
      }
    };
  }, []);

  return children;
}
