"use client";

import { useState } from "react";
import Image from "next/image";
import ImageLightbox from "./ImageLightbox";

type GridItem = {
  image?: { url: string; alt?: string };
  title?: string;
  description?: string;
};

export default function ProjectImageGrid({
  items,
  title,
}: {
  items: GridItem[];
  title?: string;
}) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const images = items
    .filter((item) => item.image)
    .map((item) => ({ url: item.image!.url, alt: item.image!.alt || item.title }));

  const openLightbox = (index: number) => {
    setCurrentIndex(index);
    setLightboxOpen(true);
  };

  const closeLightbox = () => setLightboxOpen(false);
  const goPrev = () =>
    setCurrentIndex((i) => (i > 0 ? i - 1 : images.length - 1));
  const goNext = () =>
    setCurrentIndex((i) => (i < images.length - 1 ? i + 1 : 0));

  if (!items || items.length === 0) return null;

  return (
    <section className="space-y-6">
      {title && (
        <h2 className="text-xl font-medium text-white">{title}</h2>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {items.map((item, itemIndex) => (
          <div
            key={itemIndex}
            className="border border-white/5 rounded-xl overflow-hidden"
          >
            {item.image && (
              <button
                type="button"
                onClick={() => {
                  const imgIndex = images.findIndex(
                    (img) => img.url === item.image!.url
                  );
                  openLightbox(imgIndex >= 0 ? imgIndex : 0);
                }}
                className="relative block w-full aspect-[4/3] overflow-hidden cursor-pointer bg-black/20 transition hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:ring-inset"
              >
                <Image
                  src={item.image.url}
                  alt={item.image.alt || item.title || ""}
                  fill
                  className="object-contain"
                />
              </button>
            )}
            <div className="p-5">
              {item.title && (
                <h3 className="text-white font-medium mb-2">{item.title}</h3>
              )}
              {item.description && (
                <p className="text-gray-400 text-sm leading-relaxed">
                  {item.description}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
      {lightboxOpen && images.length > 0 && (
        <ImageLightbox
          images={images}
          currentIndex={currentIndex}
          onClose={closeLightbox}
          onPrev={goPrev}
          onNext={goNext}
        />
      )}
    </section>
  );
}
