import type React from "react";
import * as LucideIcons from "lucide-react";
import type { ProcessSection } from "@/sanity/process";

export const ICONS: Record<
  string,
  React.ComponentType<{ className?: string }>
> = {
  Search: LucideIcons.Search,
  Layers: LucideIcons.Layers,
  Box: LucideIcons.Box,
  Factory: LucideIcons.Factory,
  Cpu: LucideIcons.Cpu,
  Code: LucideIcons.Code,
  Zap: LucideIcons.Zap,
  Award: LucideIcons.Award,
};

export const PATH_D =
  "M 400 160" +
  " L 400 400" + // prosto w dół
  " L 60 400" + // w lewo (kąt prosty)
  " L 60 700" + // w dół
  " L 750 700" + // w prawo (kąt prosty)
  " L 750 1100" + // w dół
  " L 100 1100" + // w lewo (kąt prosty)
  " L 100 1500" + // w dół
  " L 650 1500" + // w prawo (kąt prosty)
  " L 650 1900" + // w dół
  " L 150 1900" + // w lewo (kąt prosty)
  " L 150 2300" + // w dół
  " L 600 2300" + // w prawo (kąt prosty)
  " L 600 2700" + // w dół
  " L 400 2700" + // do środka
  " L 400 3350"; // prosto w dół do końca

/** Na mobile: prosta linia pionowa z lewej (widoczna obok kart) */
export const PATH_D_MOBILE = "M 32 0 L 32 2000";

export const FALLBACK_STEPS: ProcessSection[] = [
  {
    id: 0,
    title: "Analiza potrzeb",
    description:
      "Zaczynamy od dogłębnego zrozumienia Twojego biznesu, celów i grupy docelowej.",
    color: "#00f0ff",
    details: [],
  },
  {
    id: 1,
    title: "Strategia i planowanie",
    description: "Tworzymy kompleksową strategię działania i mierzalne cele.",
    color: "#00f0ff",
    details: [],
  },
  {
    id: 2,
    title: "Realizacja projektu",
    description: "Realizujemy projekt etapami, dbając o jakość i terminowość.",
    color: "#00f0ff",
    details: [],
  },
  {
    id: 3,
    title: "Optymalizacja i rozwój",
    description: "Wprowadzamy ulepszenia i skalujemy rozwiązania.",
    color: "#00f0ff",
    details: [],
  },
];

export const IMG_TOPS = ["14%", "32%", "50%", "68%", "86%"];
export const CARD_TOPS = ["12%", "30%", "48%", "66%", "84%"];
