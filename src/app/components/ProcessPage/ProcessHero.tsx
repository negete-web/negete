"use client";

import { ChevronDown } from "lucide-react";

interface ProcessHeroProps {
  heading: string;
  intro: string;
  stepsHint?: string;
  heroTitleRef: React.RefObject<HTMLHeadingElement | null>;
  heroIntroRef: React.RefObject<HTMLParagraphElement | null>;
  heroLineRef: React.RefObject<HTMLDivElement | null>;
}

export function ProcessHero({
  heading,
  intro,
  stepsHint,
  heroTitleRef,
  heroIntroRef,
  heroLineRef,
}: ProcessHeroProps) {
  return (
    <div className="relative flex flex-col md:min-h-screen md:justify-center">
      <div className="text-center md:pt-36 pt-46 md:pb-16 px-4">
        <h1
          ref={heroTitleRef}
          data-hero-title
          className="text-6xl sm:text-6xl lg:text-8xl font-medium text-white md:mb-12 mb-8 leading-tight opacity-0 break-words text-balance max-w-full">
          {heading}
        </h1>
        <p
          ref={heroIntroRef}
          data-hero-intro
          className="text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto opacity-0">
          {intro}
        </p>
        <div
          ref={heroLineRef}
          data-hero-line
          className="h-1 w-48 sm:w-96 mx-auto md:mt-36 mt-12 rounded-full origin-center z-10 opacity-0"
          style={{
            background:
              "linear-gradient(90deg, transparent, #00f0ff, transparent)",
            boxShadow:
              "0 0 20px 4px rgba(0,240,255,0.4), 0 0 60px 12px rgba(0,240,255,0.2)",
          }}
        />
      </div>
    </div>
  );
}
