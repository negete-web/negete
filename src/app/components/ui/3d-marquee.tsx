"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const CELL_ASPECT_W = 970;
const CELL_ASPECT_H = 700;

export const ThreeDMarquee = ({
  items,
  getHref,
  className,
}: {
  items: {
    image: string;
    slug: string;
    title?: string;
    isPortrait?: boolean;
  }[];
  getHref: (slug: string) => string;
  className?: string;
}) => {
  const [portraitByUrl, setPortraitByUrl] = useState<Record<string, boolean>>(
    {},
  );

  const uniqueUrlsKey = useMemo(
    () =>
      Array.from(new Set(items.map((i) => i.image).filter(Boolean)))
        .sort()
        .join("\0"),
    [items],
  );

  useEffect(() => {
    const urls = uniqueUrlsKey.split("\0").filter(Boolean);
    if (urls.length === 0) return;

    urls.forEach((url) => {
      const img = new Image();
      img.onload = () => {
        const w = img.naturalWidth;
        const h = img.naturalHeight;
        if (w && h && h > w) {
          setPortraitByUrl((prev) =>
            prev[url] === true ? prev : { ...prev, [url]: true },
          );
        }
      };
      img.src = url;
    });
  }, [uniqueUrlsKey]);

  const isPortrait = useCallback(
    (item: (typeof items)[0]) => {
      return item.isPortrait === true || portraitByUrl[item.image] === true;
    },
    [portraitByUrl],
  );

  if (items.length === 0) return null;

  const chunks = Array.from({ length: 4 }, (_, colIndex) =>
    items.filter((_, i) => i % 4 === colIndex),
  );

  return (
    <div
      className={cn(
        "mx-auto block h-[600px] overflow-hidden rounded-2xl max-sm:h-100",
        className,
      )}>
      <div className="flex size-full items-center justify-center">
        <div className="size-[1720px] shrink-0 scale-50 sm:scale-75 lg:scale-100">
          <div
            style={{
              transform: "rotateX(55deg) rotateY(0deg) rotateZ(-45deg)",
              transformStyle: "preserve-3d",
            }}
            className="relative top-96 right-[50%] grid size-full origin-top-left grid-cols-4 gap-8">
            {chunks.map((subarray, colIndex) => (
              <motion.div
                animate={{ y: colIndex % 2 === 0 ? 100 : -100 }}
                transition={{
                  duration: colIndex % 2 === 0 ? 10 : 15,
                  repeat: Infinity,
                  repeatType: "reverse",
                }}
                key={colIndex + "marquee"}
                className="flex flex-col items-start gap-8">
                <GridLineVertical className="-left-4" offset="80px" />
                {subarray.map((item, imageIndex) => {
                  const portrait = isPortrait(item);
                  return (
                    <Link
                      href={getHref(item.slug)}
                      key={imageIndex + item.image + colIndex}
                      className="relative block aspect-[970/700] w-full overflow-hidden rounded-lg border-2 border-transparent hover:border-blue-400 transition-colors">
                      <GridLineHorizontal className="-top-4" offset="20px" />
                      {portrait ? (
                        <div
                          className="absolute inset-0 flex items-center justify-center"
                          style={{
                            width: `${(CELL_ASPECT_H / CELL_ASPECT_W) * 100}%`,
                            height: `${(CELL_ASPECT_W / CELL_ASPECT_H) * 100}%`,
                            left: "50%",
                            top: "50%",
                            transform: "translate(-50%, -50%) rotate(90deg)",
                          }}>
                          <img
                            src={item.image}
                            alt={item.title || `Realizacja ${imageIndex + 1}`}
                            className="h-full w-full rounded-lg object-cover"
                            width={CELL_ASPECT_H}
                            height={CELL_ASPECT_W}
                            referrerPolicy="no-referrer"
                          />
                        </div>
                      ) : (
                        <img
                          src={item.image}
                          alt={item.title || `Realizacja ${imageIndex + 1}`}
                          className="aspect-[970/700] rounded-lg object-cover"
                          width={970}
                          height={700}
                          referrerPolicy="no-referrer"
                        />
                      )}
                    </Link>
                  );
                })}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const GridLineHorizontal = ({
  className,
  offset,
}: {
  className?: string;
  offset?: string;
}) => {
  return (
    <div
      style={
        {
          "--background": "#ffffff",
          "--color": "rgba(0, 0, 0, 0.2)",
          "--height": "1px",
          "--width": "5px",
          "--fade-stop": "90%",
          "--offset": offset || "200px",
          "--color-dark": "rgba(255, 255, 255, 0.2)",
          maskComposite: "exclude",
        } as React.CSSProperties
      }
      className={cn(
        "absolute left-[calc(var(--offset)/2*-1)] h-[var(--height)] w-[calc(100%+var(--offset))]",
        "bg-[linear-gradient(to_right,var(--color),var(--color)_50%,transparent_0,transparent)]",
        "[background-size:var(--width)_var(--height)]",
        "[mask:linear-gradient(to_left,var(--background)_var(--fade-stop),transparent),_linear-gradient(to_right,var(--background)_var(--fade-stop),transparent),_linear-gradient(black,black)]",
        "[mask-composite:exclude]",
        "z-30",
        "dark:bg-[linear-gradient(to_right,var(--color-dark),var(--color-dark)_50%,transparent_0,transparent)]",
        className,
      )}
    />
  );
};

const GridLineVertical = ({
  className,
  offset,
}: {
  className?: string;
  offset?: string;
}) => {
  return (
    <div
      style={
        {
          "--background": "#ffffff",
          "--color": "rgba(0, 0, 0, 0.2)",
          "--height": "5px",
          "--width": "1px",
          "--fade-stop": "90%",
          "--offset": offset || "150px",
          "--color-dark": "rgba(255, 255, 255, 0.2)",
          maskComposite: "exclude",
        } as React.CSSProperties
      }
      className={cn(
        "absolute top-[calc(var(--offset)/2*-1)] h-[calc(100%+var(--offset))] w-[var(--width)]",
        "bg-[linear-gradient(to_bottom,var(--color),var(--color)_50%,transparent_0,transparent)]",
        "[background-size:var(--width)_var(--height)]",
        "[mask:linear-gradient(to_top,var(--background)_var(--fade-stop),transparent),_linear-gradient(to_bottom,var(--background)_var(--fade-stop),transparent),_linear-gradient(black,black)]",
        "[mask-composite:exclude]",
        "z-30",
        "dark:bg-[linear-gradient(to_bottom,var(--color-dark),var(--color-dark)_50%,transparent_0,transparent)]",
        className,
      )}
    />
  );
};
