"use client";

import { useRef, useEffect, useState, Fragment } from "react";
import Link from "next/link";
import { Cpu, type LucideIcon } from "lucide-react";
import * as LucideIcons from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import RocketSVG from "./RocketSVG";
import {
  fetchServicesSection,
  type ServicesSection,
  type ServiceItem,
} from "@/sanity/services";
import type { Language } from "@/i18n/config";
import { useLocalizedPath } from "@/hooks/useLocalizedPath";

function getIcon(iconKey?: string): LucideIcon {
  if (!iconKey) return Cpu;
  const icon = (LucideIcons as Record<string, unknown>)[iconKey];
  if (icon != null && typeof icon !== "string" && typeof icon !== "number" && typeof icon !== "boolean") {
    return icon as LucideIcon;
  }
  return Cpu;
}
interface ServicesProps {
  lang?: Language;
  initialData?: ServicesSection | null;
}

export default function Services({ lang = "pl", initialData }: ServicesProps) {
  const [servicesData, setServicesData] = useState<ServicesSection | null>(
    initialData ?? null,
  );
  const { getPath } = useLocalizedPath(lang);

  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const leftTextRef = useRef<HTMLDivElement>(null);
  const rightTextRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (initialData) return;
    fetchServicesSection(lang)
      .then((data) => data && setServicesData(data))
      .catch((err) =>
        console.error("Błąd pobierania sekcji usług z Sanity:", err),
      );
  }, [lang, initialData]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (titleRef.current) {
        gsap.fromTo(
          titleRef.current,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            force3D: true,
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 80%",
            },
          },
        );
      }

      if (leftTextRef.current) {
        gsap.fromTo(
          leftTextRef.current,
          { opacity: 0, x: -50 },
          {
            opacity: 1,
            x: 0,
            duration: 0.8,
            delay: 0.2,
            force3D: true,
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 80%",
            },
          },
        );
      }
      if (rightTextRef.current) {
        gsap.fromTo(
          rightTextRef.current,
          { opacity: 0, x: 50 },
          {
            opacity: 1,
            x: 0,
            duration: 0.8,
            delay: 0.3,
            force3D: true,
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 80%",
            },
          },
        );
      }

      if (buttonRef.current) {
        gsap.fromTo(
          buttonRef.current,
          { opacity: 0, scale: 0.8 },
          {
            opacity: 1,
            scale: 1,
            duration: 0.6,
            delay: 0.5,
            force3D: true,
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 80%",
            },
          },
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    if (!sectionRef.current) return;
    const items =
      sectionRef.current.querySelectorAll<HTMLElement>(".service-card");
    if (items.length === 0) return;
    const ctx = gsap.context(() => {
      items.forEach((item, index) => {
        gsap.fromTo(
          item,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            delay: 0.4 + index * 0.1,
            force3D: true,
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 80%",
            },
          },
        );
      });
    }, sectionRef);
    return () => ctx.revert();
  }, [servicesData]);

  const services = servicesData?.services ?? [];

  const half = Math.ceil(services.length / 2);
  const leftServices = services.slice(0, half);
  const rightServices = services.slice(half);

  return (
    <section
      ref={sectionRef}
      data-section="services"
      className="relative max-w-7xl mx-auto md:py-32 pb-12 px-6 ">
      <div className="">
        <div className="flex flex-col max-w-6xl gap-4 items-start">
          <div className=" relative z-10">
            <div ref={leftTextRef} className="space-y-6 opacity-0">
              <h2
                ref={titleRef}
                className="text-3xl sm:text-4xl font-medium text-white leading-tight opacity-0">
                {servicesData?.heading ??
                  "Twój Zewnętrzny Dział R&D – od pomysłu do wdrożenia"}
              </h2>
              <div className="space-y-4 border-l-4 border-primary pl-4 text-gray-300 text-base md:text-lg leading-relaxed">
                <p>
                  {servicesData?.intro ??
                    "Przejmujemy pełną odpowiedzialność za technologiczną stronę Twojego produktu. Łączymy projektowanie elektroniki, inżynierię mechaniczną i oprogramowanie w jeden spójny proces. Dzięki temu skracamy czas wdrożenia (Time-to-Market) i eliminujemy błędy montażowe już na etapie koncepcji."}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="hidden    lg:block absolute  inset-x-0 pointer-events-none z-0">
        <RocketSVG sectionId="services" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-16">
          {leftServices.map((leftService, rowIndex) => {
            const rightService = rightServices[rowIndex];

            const renderCard = (service: ServiceItem) => {
              const Icon = getIcon(service.iconKey ?? undefined);
              const slug = service.slug ?? undefined;
              const href = getPath(slug ? `/uslugi/${slug}` : "/uslugi");
              return (
                <Link
                  href={href}
                  className="service-card flex items-start gap-4 group h-full">
                  <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0 group-hover:bg-white/20 transition-colors">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex flex-col justify-between flex-1 h-full">
                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors">
                      {service.title}
                    </h3>
                    <p className="text-gray-400 text-sm leading-relaxed">
                      {service.description}
                    </p>
                  </div>
                </Link>
              );
            };

            return (
              <Fragment key={leftService.title}>
                {renderCard(leftService)}
                <div className="hidden lg:block" />
                {rightService ? renderCard(rightService) : <div />}
              </Fragment>
            );
          })}
        </div>
      </div>
    </section>
  );
}
