"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  fetchProcessPage,
  type ProcessPageData,
  type ProcessPageCta,
} from "@/sanity/process";
import type { Language } from "@/i18n/config";
import { t } from "@/i18n/dictionary";
import {
  ICONS,
  PATH_D,
  PATH_D_MOBILE,
  FALLBACK_STEPS,
  IMG_TOPS,
  CARD_TOPS,
} from "./constants";
import { ProcessHero } from "./ProcessHero";
import { ProcessCta } from "./ProcessCta";
import { useProcessAnimations } from "./useProcessAnimations";

export default function ProcessPage({
  lang = "pl",
  initialData,
}: {
  lang?: Language;
  initialData?: ProcessPageData | null;
}) {
  const [processData, setProcessData] = useState<ProcessPageData | null>(
    initialData ?? null,
  );
  const [isMobile, setIsMobile] = useState(true);

  const pathRef = useRef<SVGPathElement>(null);
  const pathMobileRef = useRef<SVGPathElement>(null);
  const svgSectionRef = useRef<HTMLElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const imgRefs = useRef<(HTMLDivElement | null)[]>([]);
  const heroTitleRef = useRef<HTMLHeadingElement>(null);
  const heroIntroRef = useRef<HTMLParagraphElement>(null);
  const heroLineRef = useRef<HTMLDivElement>(null);
  const mobileLineFillRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (initialData) return;
    fetchProcessPage(lang).then((data) => setProcessData(data));
  }, [lang, initialData]);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 1023px)"); // lg breakpoint
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    setIsMobile(mq.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);
  const sections = !processData
    ? []
    : processData.sections?.length
      ? processData.sections
      : FALLBACK_STEPS;
  const hasFiveSections = sections.length === 5;
  const sectionsToRender = hasFiveSections ? sections : sections.slice(0, 4);
  const heading = processData?.heading || "Nasz proces";
  const intro = processData?.intro || "Od pomysłu do realizacji";
  const cta: ProcessPageCta = processData?.cta ?? {
    title: "Gotowy na start?",
    description:
      "Każdy wielki projekt zaczyna się od pierwszego kroku. Porozmawiajmy o Twoich celach.",
    buttonText: "Skontaktuj się",
    link: `/${lang}/kontakt`,
  };

  useProcessAnimations(
    {
      pathRef,
      pathMobileRef,
      svgSectionRef,
      cardRefs,
      imgRefs,
      heroTitleRef,
      heroIntroRef,
      heroLineRef,
      mobileLineFillRef,
    },
    processData,
    isMobile,
  );

  return (
    <div className="relative mx-auto" style={{ overflow: "visible" }}>
      <ProcessHero
        heading={heading}
        intro={intro}
        stepsHint={t(lang, "proces.stepsHint")}
        heroTitleRef={heroTitleRef}
        heroIntroRef={heroIntroRef}
        heroLineRef={heroLineRef}
      />

      <section
        ref={svgSectionRef}
        className="relative lg:h-[500vh] lg:min-h-[3200px] min-h-[260vh] h-full overflow-hidden lg:-mt-[40vh] isolate">
        {/* Na mobile: prosta linia w HTML na środku ekranu */}
        <div className="absolute left-1/2 top-0 bottom-0 w-0.5 -translate-x-1/2 bg-white/10 z-[1] lg:hidden" aria-hidden />
        <div
          ref={mobileLineFillRef}
          className="absolute left-1/2 top-0 w-0.5 -translate-x-1/2 origin-top z-[1] lg:hidden"
          style={{
            height: "0%",
            background: "linear-gradient(to bottom, #00f0ff, #00f0ff80)",
            boxShadow: "0 0 12px rgba(0,240,255,0.5)",
          }}
          aria-hidden
        />
        <div className="absolute inset-0 z-0 pointer-events-none">
          <svg
            className="absolute inset-0 w-full px-12 h-full hidden lg:block"
            viewBox="-50 100 900 2700"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="none">
            <defs>
              <filter
                id="neonGlow"
                x="-50%"
                y="-50%"
                width="200%"
                height="200%">
                <feGaussianBlur
                  in="SourceGraphic"
                  stdDeviation="6"
                  result="blur1"
                />
                <feGaussianBlur
                  in="SourceGraphic"
                  stdDeviation="16"
                  result="blur2"
                />
                <feMerge>
                  <feMergeNode in="blur2" />
                  <feMergeNode in="blur1" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
              <linearGradient
                id="fadeStart"
                gradientUnits="userSpaceOnUse"
                x1="400"
                y1="100"
                x2="400"
                y2="500">
                <stop offset="0%" stopColor="#00f0ff" stopOpacity="0" />
                <stop offset="40%" stopColor="#00f0ff" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#00f0ff" stopOpacity="1" />
              </linearGradient>
              <mask id="fadeMask">
                <rect x="-50" y="100" width="900" height="2700" fill="white" />
                <rect
                  x="-50"
                  y="100"
                  width="900"
                  height="350"
                  fill="url(#fadeStartMask)"
                />
              </mask>
              <linearGradient
                id="fadeStartMask"
                gradientUnits="userSpaceOnUse"
                x1="400"
                y1="100"
                x2="400"
                y2="450">
                <stop offset="0%" stopColor="black" />
                <stop offset="100%" stopColor="white" />
              </linearGradient>
            </defs>
            <path
              ref={pathRef}
              d={PATH_D}
              stroke="#00f0ff"
              strokeWidth="2"
              strokeLinecap="square"
              strokeLinejoin="miter"
              fill="none"
              filter="url(#neonGlow)"
              mask="url(#fadeMask)"
            />
          </svg>
          <svg
            className="absolute inset-0 w-full h-full lg:hidden"
            viewBox="0 0 400 2000"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="none">
            <defs>
              <filter
                id="neonGlowMobile"
                x="-50%"
                y="-50%"
                width="200%"
                height="200%">
                <feGaussianBlur
                  in="SourceGraphic"
                  stdDeviation="4"
                  result="blur1"
                />
                <feGaussianBlur
                  in="SourceGraphic"
                  stdDeviation="10"
                  result="blur2"
                />
                <feMerge>
                  <feMergeNode in="blur2" />
                  <feMergeNode in="blur1" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
              <linearGradient
                id="fadeStartMaskMobile"
                gradientUnits="userSpaceOnUse"
                x1="200"
                y1="0"
                x2="200"
                y2="400">
                <stop offset="0%" stopColor="black" />
                <stop offset="100%" stopColor="white" />
              </linearGradient>
              <mask id="fadeMaskMobile">
                <rect x="0" y="0" width="400" height="2000" fill="white" />
                <rect
                  x="0"
                  y="0"
                  width="400"
                  height="400"
                  fill="url(#fadeStartMaskMobile)"
                />
              </mask>
            </defs>
            <path
              ref={pathMobileRef}
              d={PATH_D_MOBILE}
              stroke="#00f0ff"
              strokeWidth="6"
              strokeLinecap="round"
              strokeLinejoin="miter"
              fill="none"
              filter="url(#neonGlowMobile)"
            />
          </svg>
        </div>

        {!isMobile && (
          <div className="relative w-full mx-auto max-w-[1500px] z-10 h-full">
            {sectionsToRender.map((section, index) => {
              const isLastAndCentered = hasFiveSections && index === 4;
              const isEven = index % 2 === 0;
              const imgTop = isLastAndCentered
                ? "88%"
                : (IMG_TOPS[index] ?? "18%");
              const cardTop = CARD_TOPS[index] ?? "4%";
              const imgPositionClasses = isLastAndCentered
                ? "left-1/2 -translate-x-1/2"
                : isEven
                  ? "left-auto right-[3%]"
                  : "left-[3%] right-auto";
              const cardPositionClasses = isLastAndCentered
                ? "left-1/2 -translate-x-1/2"
                : isEven
                  ? "left-[4%] right-auto"
                  : "left-auto right-[4%]";
              const IconCmp = ICONS[section.icon ?? ""] ?? ICONS.Search;

              return (
                <div key={section.id}>
                  <div
                    className={`absolute z-[35]  aspect-square w-[min(480px,38vw)] ${imgPositionClasses}`}
                    style={{ top: imgTop }}>
                    <div
                      ref={(el) => {
                        imgRefs.current[index] = el;
                      }}
                      data-section-color={section.color}
                      data-with-border={!!section.image?.withBorder}
                      className={`relative w-full aspect-square rounded-2xl overflow-hidden ${
                        !section.image || section.image.withBorder
                          ? "border-2"
                          : ""
                      }`}
                      style={{
                        ...((!section.image || section.image.withBorder) && {
                          borderColor: `${section.color}80`,
                          boxShadow: `0 16px 48px ${section.color}30`,
                        }),
                      }}>
                      {section.image ? (
                        <Image
                          src={section.image.url}
                          alt={section.image.alt}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div
                          className="w-full h-full flex items-center justify-center bg-white/5"
                          style={{ color: section.color }}>
                          <IconCmp className="w-16 h-16" />
                        </div>
                      )}
                    </div>
                  </div>
                  <div
                    className={`absolute backdrop-blur-lg z-20 w-[min(520px,48vw)] ${cardPositionClasses}`}
                    style={{ top: cardTop }}>
                    <div
                      ref={(el) => {
                        cardRefs.current[index] = el;
                      }}
                      data-section-color={section.color}
                      className="bg-white/3 relative backdrop-blur-lg rounded-2xl p-8 sm:p-10 border border-white/10 shadow-xl">
                      <span
                        className="inline-block text-xs font-semibold tracking-wider uppercase mb-3"
                        style={{ color: section.color }}>
                        Krok {index + 1}
                      </span>
                      <h3 className="text-2xl sm:text-3xl font-bold text-white mb-4">
                        {section.title}
                      </h3>
                      <p className="text-gray-400 leading-relaxed text-lg mb-6">
                        {section.description}
                      </p>
                      {section.details && section.details.length > 0 && (
                        <div className="grid grid-cols-2 gap-3 sm:gap-4">
                          {section.details.map((detail, i) => (
                            <div
                              key={i}
                              className="flex items-start gap-3 p-4 rounded-xl bg-white/5 border border-white/10">
                              <div
                                className="w-2 h-2 rounded-full mt-2 shrink-0"
                                style={{
                                  background: section.color,
                                  boxShadow: `0 0 8px ${section.color}`,
                                }}
                              />
                              <p className="text-gray-300 text-sm leading-relaxed">
                                {detail}
                              </p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}

            {!hasFiveSections && (
              <ProcessCta
                cta={cta}
                variant="inline-desktop"
                cardRef={(el) => {
                  cardRefs.current[sectionsToRender.length] = el;
                }}
              />
            )}
          </div>
        )}

        {isMobile && (
          <div className="relative w-full z-[2] px-4 flex flex-col gap-10 pt-24 pb-12">
            {sectionsToRender.map((section, index) => {
              const IconCmp = ICONS[section.icon ?? ""] ?? ICONS.Search;
              return (
                <div key={section.id} className="flex flex-col gap-4">
                  <div
                    ref={(el) => {
                      imgRefs.current[index] = el;
                    }}
                    data-section-color={section.color}
                    data-with-border={!!section.image?.withBorder}
                    className={`relative -mb-20 z-20 w-44 aspect-square rounded-2xl overflow-hidden shrink-0 mt-3 ml-auto mr-4 ${
                      !section.image || section.image.withBorder
                        ? "border-2"
                        : ""
                    }`}
                    style={{
                      ...((!section.image || section.image.withBorder) && {
                        borderColor: `${section.color}80`,
                        boxShadow: `0 16px 48px ${section.color}30`,
                      }),
                    }}>
                    {section.image ? (
                      <Image
                        src={section.image.url}
                        alt={section.image.alt}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div
                        className="w-full h-full flex items-center justify-center bg-white/5"
                        style={{ color: section.color }}>
                        <IconCmp className="w-12 h-12" />
                      </div>
                    )}
                  </div>
                  <div
                    ref={(el) => {
                      cardRefs.current[index] = el;
                    }}
                    data-section-color={section.color}
                    className="relative z-10 bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 shadow-xl">
                    <span
                      className="inline-block text-xs font-semibold tracking-wider uppercase mb-2"
                      style={{ color: section.color }}>
                      Krok {index + 1}
                    </span>
                    <h3 className="text-xl font-bold text-white mb-3">
                      {section.title}
                    </h3>
                    <p className="text-gray-400 leading-relaxed text-base mb-4">
                      {section.description}
                    </p>
                    {section.details && section.details.length > 0 && (
                      <div className="grid grid-cols-2 gap-2 sm:gap-3">
                        {section.details.map((detail, i) => (
                          <div
                            key={i}
                            className="flex items-start gap-2 p-3 rounded-xl bg-white/5 border border-white/10">
                            <div
                              className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0"
                              style={{
                                background: section.color,
                                boxShadow: `0 0 6px ${section.color}`,
                              }}
                            />
                            <p className="text-gray-300 text-xs leading-relaxed">
                              {detail}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
            {!hasFiveSections && (
              <ProcessCta
                cta={cta}
                variant="inline-mobile"
                cardRef={(el) => {
                  cardRefs.current[sectionsToRender.length] = el;
                }}
              />
            )}
          </div>
        )}
      </section>

      {hasFiveSections && <ProcessCta cta={cta} variant="standalone" />}
    </div>
  );
}
