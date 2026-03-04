"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  fetchTrustedBy,
  type TrustedBySection,
  type Company,
} from "@/sanity/trustedBy";
import { useLocalizedPath } from "@/hooks/useLocalizedPath";
import type { Language } from "@/i18n/config";
const FALLBACK_COMPANIES: Company[] = [
  { name: "E4Tech", url: "#" },
  { name: "BE3D", url: "#" },
  { name: "3Struct", url: "#" },
  { name: "Spriga", url: "#" },
  { name: "Cetus", url: "#" },
];

interface TrustedByProps {
  lang?: Language;
  initialData?: TrustedBySection | null;
}

export default function TrustedBy({
  lang: langProp,
  initialData,
}: TrustedByProps) {
  const { lang, getPath } = useLocalizedPath(langProp);
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const companyRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [trustedByData, setTrustedByData] = useState<TrustedBySection | null>(
    initialData ?? null,
  );

  useEffect(() => {
    if (initialData) return;
    fetchTrustedBy(lang)
      .then((data) => data && setTrustedByData(data))
      .catch((err) =>
        console.error("Błąd pobierania sekcji 'Zaufali nam' z Sanity:", err),
      );
  }, [lang, initialData]);

  const companies = trustedByData?.companies || FALLBACK_COMPANIES;
  const heading = trustedByData?.heading || (lang === "en" ? "Trusted by" : "Zaufali nam");
  const subtitle = trustedByData?.subtitle || (lang === "en" ? "Our partners and clients" : "Nasi partnerzy i klienci");

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (titleRef.current) {
        gsap.fromTo(
          titleRef.current,
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            force3D: true,
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 80%",
            },
          },
        );
      }

      companyRefs.current.forEach((ref, index) => {
        if (ref) {
          gsap.fromTo(
            ref,
            { opacity: 0, scale: 0.95 },
            {
              opacity: 1,
              scale: 1,
              duration: 0.5,
              delay: index * 0.08,
              force3D: true,
              scrollTrigger: {
                trigger: sectionRef.current,
                start: "top 80%",
              },
            },
          );
        }
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [companies.length]);

  return (
    <section
      ref={sectionRef}
      data-section="trustedby"
      className="relative md:py-20 py-12 md:px-6 px-3  bg-gradient-to-b from-transparent via-white/5 to-transparent">
      <div className="max-w-7xl mx-auto relative z-10">
        <div ref={titleRef} className="text-center mb-16">
          <h3 className="text-3xl sm:text-4xl font-medium text-white mb-2">
            {heading}
          </h3>
          {subtitle && <p className="text-gray-400 text-lg">{subtitle}</p>}
        </div>

        <div className="md:flex grid grid-cols-2 md:flex-wrap justify-center items-center gap-4 md:gap-12">
          {companies.map((company, index) => {
            const href = company.projectSlug
              ? getPath(`/realizacje/${company.projectSlug}`)
              : company.url || "#";
            const isExternal = !company.projectSlug && company.url;

            return (
              <div
                key={company.name}
                ref={(el) => {
                  companyRefs.current[index] = el;
                }}
                className="group">
                <Link
                  href={href}
                  target={isExternal ? "_blank" : undefined}
                  rel={isExternal ? "noopener noreferrer" : undefined}
                  className="company-card relative block p-5 rounded-xl overflow-hidden">
                  <div className="absolute inset-0 bg-white/5 rounded-xl border-2 border-white/10 group-hover:border-cyan-400/50 transition-all duration-500 backdrop-blur-sm" />

                  <div className="company-glow absolute inset-0 rounded-xl opacity-0 bg-gradient-to-br from-blue-600/30 to-cyan-400/20 blur-2xl group-hover:opacity-100 transition-opacity duration-500" />

                  <div className="absolute inset-0 rounded-xl overflow-hidden">
                    <div className="company-line absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-blue-600 to-transparent" />
                    <div className="company-line absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent" />
                    <div className="company-line absolute top-0 left-0 w-[2px] h-full bg-gradient-to-b from-transparent via-blue-600 to-transparent" />
                    <div className="company-line absolute top-0 right-0 w-[2px] h-full bg-gradient-to-b from-transparent via-cyan-400 to-transparent" />
                  </div>

                  <div className="company-pulse absolute inset-0 rounded-xl bg-gradient-to-br from-blue-600/0 to-cyan-400/0" />

                  <div className="company-content  relative z-10 flex items-center justify-center  md:min-w-[200px] h-full opacity-70 group-hover:opacity-100 transition-opacity duration-500">
                    {company.logo ? (
                      <div className="relative w-full   h-full">
                        <Image
                          src={company.logo.url}
                          alt={company.logo.alt || company.name}
                          width={260}
                          height={180}
                          className="object-contain p-3 brightness-0 invert opacity-90 group-hover:opacity-100 transition-opacity"
                          style={{ width: "100%", height: "100%" }}
                        />
                      </div>
                    ) : (
                      <div className="text-2xl font-bold text-white group-hover:text-cyan-400 transition-colors duration-500">
                        {company.name}
                      </div>
                    )}
                  </div>
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
