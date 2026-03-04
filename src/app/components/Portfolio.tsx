"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import {
  fetchPortfolioSection,
  type PortfolioSection,
} from "@/sanity/portfolio";
import { useLocalizedPath } from "@/hooks/useLocalizedPath";
import type { Language } from "@/i18n/config";
import { t } from "@/i18n/dictionary";
import { ThreeDMarquee } from "./ui/3d-marquee";

const FALLBACK_PROJECTS: Array<{
  _id: string;
  title: string;
  image: string;
  imageAlt?: string;
  span: string;
  slug: string;
}> = [
  {
    _id: "1",
    title: "Smart IoT Device",
    image:
      "https://images.pexels.com/photos/163100/circuit-circuit-board-resistor-computer-163100.jpeg?auto=compress&cs=tinysrgb&w=800",
    span: "md:col-span-2 md:row-span-2",
    slug: "smart-iot-device",
  },
  {
    _id: "2",
    title: "Medical Equipment PCB",
    image:
      "https://images.pexels.com/photos/2582928/pexels-photo-2582928.jpeg?auto=compress&cs=tinysrgb&w=800",
    span: "md:col-span-1 md:row-span-1",
    slug: "medical-equipment-pcb",
  },
  {
    _id: "3",
    title: "Industrial Automation",
    image:
      "https://images.pexels.com/photos/442160/pexels-photo-442160.jpeg?auto=compress&cs=tinysrgb&w=800",
    span: "md:col-span-1 md:row-span-1",
    slug: "industrial-automation",
  },
  {
    _id: "4",
    title: "Wearable Technology",
    image:
      "https://images.pexels.com/photos/257736/pexels-photo-257736.jpeg?auto=compress&cs=tinysrgb&w=800",
    span: "md:col-span-1 md:row-span-2",
    slug: "wearable-technology",
  },
  {
    _id: "5",
    title: "Automotive Electronics",
    image:
      "https://images.pexels.com/photos/159298/gears-cogs-machine-machinery-159298.jpeg?auto=compress&cs=tinysrgb&w=800",
    span: "md:col-span-2 md:row-span-1",
    slug: "automotive-electronics",
  },
  {
    _id: "6",
    title: "3D Printed Enclosure",
    image:
      "https://images.pexels.com/photos/1476321/pexels-photo-1476321.jpeg?auto=compress&cs=tinysrgb&w=800",
    span: "md:col-span-1 md:row-span-1",
    slug: "3d-printed-enclosure",
  },
];

interface PortfolioProps {
  lang?: Language;
  initialData?: PortfolioSection | null;
}

export default function Portfolio({
  lang: langProp,
  initialData,
}: PortfolioProps) {
  const { lang, getPath } = useLocalizedPath(langProp);
  const [portfolioData, setPortfolioData] = useState<PortfolioSection | null>(
    initialData ?? null,
  );

  useEffect(() => {
    if (initialData) return;
    fetchPortfolioSection(lang)
      .then((data) => data && setPortfolioData(data))
      .catch((err) =>
        console.error("Błąd pobierania sekcji portfolio z Sanity:", err),
      );
  }, [lang, initialData]);

  const projects =
    portfolioData?.projects && portfolioData.projects.length > 0
      ? portfolioData.projects
      : FALLBACK_PROJECTS;

  const projectsWithImages = (portfolioData?.projects ?? []).filter(
    (p) => p.image && String(p.image).trim(),
  );
  const sourceForMarquee =
    projectsWithImages.length > 0 ? projectsWithImages : FALLBACK_PROJECTS;

  let items = sourceForMarquee.map((p) => ({
    image: p.image,
    slug: p.slug,
    title: p.title,
  }));

  while (items.length < 28) {
    items = [...items, ...items];
  }

  return (
    <section data-section="portfolio" className="relative md:py-32 py-12 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center flex justify-between ">
          <h2 className="text-3xl sm:text-4xl font-medium text-white tracking-tight mb-4">
            {portfolioData?.heading || (lang === "en" ? "Our projects" : "Nasze realizacje")}
          </h2>

          <Link href={getPath("/realizacje")} className="group inline-block">
            <motion.span
              className="inline-flex items-center gap-2 rounded-full border border-cyan-500/50 bg-cyan-500/10 px-6 py-3 text-cyan-400 font-medium transition-colors hover:border-cyan-400/70 hover:bg-cyan-500/20"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}>
              {t(lang, "portfolio.seeMore")}
              <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
            </motion.span>
          </Link>
        </div>
        <div className="text-gray-300">{portfolioData?.description}</div>

        <div className="mx-auto my-10 max-w-7xl rounded-3xl shadow-[0_0_25px_rgba(59,130,246,0.25),0_0_50px_rgba(59,130,246,0.1)]">
          <ThreeDMarquee
            items={items}
            getHref={(slug) => getPath(`/realizacje/${slug}`)}
          />
        </div>
      </div>
    </section>
  );
}
