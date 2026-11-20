"use client";

import { useState } from "react";
import Image from "next/image";

import { cn } from "cn";

export default function ServiceGallery({ images, name }) {
  const photos = images?.length ? images : [];
  const [active, setActive] = useState(0);
  const current = photos[active] ?? photos[0];

  if (!current) return null;

  return (
    <section aria-labelledby="gallery-heading">
      <h2 id="gallery-heading" className="sr-only">Photos of {name}</h2>
      <div className="relative aspect-[16/9] overflow-hidden rounded-2xl border border-cream-300">
        <Image
          src={current}
          alt={`${name} — photo ${active + 1} of ${photos.length}`}
          fill
          priority
          sizes="(min-width: 1024px) 66vw, 100vw"
          className="object-cover"
        />
        {photos.length > 1 && (
          <span className="absolute bottom-3 right-3 rounded-full bg-espresso/70 px-3 py-1 text-[10px] font-semibold text-cream backdrop-blur-sm">
            {active + 1} / {photos.length}
          </span>
        )}
      </div>
      {photos.length > 1 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {photos.map((src, index) => (
            <button
              key={src + index}
              type="button"
              onClick={() => setActive(index)}
              aria-label={`Show photo ${index + 1}`}
              aria-pressed={active === index}
              className={cn(
                "relative h-16 w-24 overflow-hidden rounded-xl border-2 transition-colors",
                active === index ? "border-garnet" : "border-transparent hover:border-garnet/40"
              )}
            >
              <Image src={src} alt="" fill sizes="96px" className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </section>
  );
}
