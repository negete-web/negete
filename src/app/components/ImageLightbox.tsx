"use client";

import { useEffect, useCallback } from "react";
import { usePathname } from "next/navigation";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { languages, type Language } from "@/i18n/config";
import { t } from "@/i18n/dictionary";

type ImageItem = { url: string; alt?: string };

function getLangFromPathname(pathname: string): Language {
  const segments = pathname?.split("/").filter(Boolean) ?? [];
  if (segments.length > 0 && languages.includes(segments[0] as Language)) {
    return segments[0] as Language;
  }
  return "pl";
}

export default function ImageLightbox({
  images,
  currentIndex,
  onClose,
  onPrev,
  onNext,
}: {
  images: ImageItem[];
  currentIndex: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}) {
  const pathname = usePathname();
  const lang = getLangFromPathname(pathname ?? "");
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onPrev();
      if (e.key === "ArrowRight") onNext();
    },
    [onClose, onPrev, onNext],
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    const html = document.documentElement;
    const body = document.body;
    const prevHtml = html.style.overflow;
    const prevBody = body.style.overflow;
    html.style.overflow = "hidden";
    body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      html.style.overflow = prevHtml;
      body.style.overflow = prevBody;
    };
  }, [handleKeyDown]);

  const current = images[currentIndex];
  if (!current) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95"
      style={{
        overflow: "hidden",
        overscrollBehavior: "none",
        touchAction: "none",
      }}
      onClick={onClose}>
      <button
        onClick={onClose}
        className="absolute right-4 top-4 z-10 rounded-full p-2 text-white/80 transition hover:bg-white/10 hover:text-white"
        aria-label={t(lang, "lightbox.close")}>
        <X className="h-8 w-8" />
      </button>

      {images.length > 1 && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onPrev();
          }}
          className="absolute left-4 top-1/2 z-10 -translate-y-1/2 rounded-full p-3 text-white/80 transition hover:bg-white/10 hover:text-white"
          aria-label={t(lang, "lightbox.prev")}>
          <ChevronLeft className="h-10 w-10" />
        </button>
      )}

      <div
        className="relative flex max-h-[90vh] w-full max-w-6xl items-center justify-center px-16"
        onClick={(e) => e.stopPropagation()}>
        <img
          src={current.url}
          alt={current.alt || ""}
          className="mx-auto block max-h-[90vh] w-auto object-contain"
        />
      </div>

      {images.length > 1 && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onNext();
          }}
          className="absolute right-4 top-1/2 z-10 -translate-y-1/2 rounded-full p-3 text-white/80 transition hover:bg-white/10 hover:text-white"
          aria-label={t(lang, "lightbox.next")}>
          <ChevronRight className="h-10 w-10" />
        </button>
      )}

      {images.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-black/50 px-4 py-2 text-sm text-white/80">
          {currentIndex + 1} / {images.length}
        </div>
      )}
    </div>
  );
}
