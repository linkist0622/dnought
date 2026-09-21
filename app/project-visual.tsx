"use client";

import { useEffect, useRef } from "react";

export type ProjectImage = {
  src: string;
  small: string;
  alt: string;
  caption: string;
  width: number;
  height: number;
};

/** Animate the framing, never the real people, food, or architecture in a photograph. */
export function ProjectVisual({ image, theme }: { image: ProjectImage; theme: string }) {
  const figure = useRef<HTMLElement>(null);
  useEffect(() => {
    const node = figure.current;
    if (!node) return;
    const observer = new IntersectionObserver(([entry]) => {
      node.dataset.inView = String(entry.isIntersecting);
    }, { threshold: .1 });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return <figure ref={figure} className={`project-visual visual-${theme}`}>
    <div className="project-picture">
      {/* Pre-optimized WebP variants keep the same image pipeline on Workers and local previews. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className="project-image" src={image.src} srcSet={`${image.small} 840w, ${image.src} ${image.width}w`}
        sizes="(max-width: 767px) and (max-height: 760px) 118px, (max-width: 767px) calc(100vw - 84px), (max-width: 1100px) 40vw, 38vw"
        width={image.width} height={image.height} alt={image.alt} loading="lazy" decoding="async"/>
    </div>
    <figcaption>{image.caption}</figcaption>
  </figure>;
}
