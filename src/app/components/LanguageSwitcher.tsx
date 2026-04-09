"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { languages, languageNames, type Language } from "@/i18n/config";
import { t } from "@/i18n/dictionary";

export function LanguageSwitcher({ variant = "navbar" }: { variant?: "navbar" | "footer" }) {
  const pathname = usePathname() ?? "";
  const segments = pathname.split("/").filter(Boolean);
  const hasLangPrefix = segments.length > 0 && languages.includes(segments[0] as Language);
  const currentLang: Language = hasLangPrefix ? (segments[0] as Language) : "pl";
  const restPath = hasLangPrefix ? segments.slice(1).join("/") : segments.join("/");

  const getLangPath = (lang: Language): string => {
    if (lang === "pl") return restPath ? `/pl/${restPath}` : "/";
    return restPath ? `/en/${restPath}` : "/en";
  };

  return (
    <nav
      aria-label={t(currentLang, "common.chooseLanguage")}
      className="flex items-center gap-2">
      <div className="flex rounded-full border border-white/20 bg-black/20 p-0.5">
        {languages.map((lng) => {
          const isActive = lng === currentLang;
          return (
            <Link
              key={lng}
              href={getLangPath(lng)}
              lang={lng}
              hrefLang={lng}
              aria-current={isActive ? "page" : undefined}
              className={`
                relative rounded-full px-3 py-1.5 text-sm font-medium
                transition-all duration-200
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent
                ${variant === "navbar" ? "min-w-12" : ""}
                ${
                  isActive
                    ? "bg-cyan-500/20 text-cyan-400 border border-cyan-400/40"
                    : "text-gray-400 hover:text-white hover:bg-white/5 border border-transparent"
                }
              `}>
              {languageNames[lng]}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
