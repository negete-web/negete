"use client";

import { useState } from "react";
import ImageLightbox from "./ImageLightbox";

type ImageItem = { url: string; alt?: string };

export default function ProjectGallery({
  images,
  title,
  description,
  gridCols = "sm:grid-cols-2",
}: {
  images: ImageItem[];
  title?: string;
  description?: string;
  gridCols?: string;
}) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const openLightbox = (index: number) => {
    setCurrentIndex(index);
    setLightboxOpen(true);
  };

  const closeLightbox = () => setLightboxOpen(false);
  const goPrev = () =>
    setCurrentIndex((i) => (i > 0 ? i - 1 : images.length - 1));
  const goNext = () =>
    setCurrentIndex((i) => (i < images.length - 1 ? i + 1 : 0));

  const hasImages = images && images.length > 0;
  if (!title && !description && !hasImages) return null;

  return (
    <section className="space-y-6">
      {title && <h2 className="text-xl font-medium text-white">{title}</h2>}
      {description && (
        <p className="text-gray-400 leading-relaxed">{description}</p>
      )}
      {hasImages && (
        <div className="flex flex-wrap gap-3">
          {images!.map((img, imgIndex) => (
            <button
              key={imgIndex}
              type="button"
              onClick={() => openLightbox(imgIndex)}
              className="cursor-pointer overflow-hidden rounded-xl border border-white/5 text-left transition hover:border-cyan-500/30 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
              style={{ height: "360px" }}>
              <img
                src={img.url}
                alt={img.alt || ""}
                className="h-full w-auto block"
              />
            </button>
          ))}
        </div>
      )}
      {lightboxOpen && hasImages && (
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
