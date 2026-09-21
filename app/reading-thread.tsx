"use client";

import { useEffect, useRef } from "react";
import { readingThread } from "./site-settings";

type Sample = { y: number; length: number };
type Anchor = { x: number; y: number };
const svgNS = "http://www.w3.org/2000/svg";

// Layout offsets ignore reveal transforms and the current scroll position.
function layoutTop(element: HTMLElement, main: HTMLElement) {
  let top = 0;
  let current: HTMLElement | null = element;
  while (current && current !== main) {
    top += current.offsetTop;
    current = current.offsetParent as HTMLElement | null;
  }
  return top;
}

export function ReadingThread({ ready, reduced }: { ready: boolean; reduced: boolean }) {
  const svgRef = useRef<SVGSVGElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const dotsRef = useRef<SVGGElement>(null);
  const segmentsRef = useRef<SVGGElement>(null);

  useEffect(() => {
    const svg = svgRef.current, path = pathRef.current, dots = dotsRef.current, segmentsGroup = segmentsRef.current;
    const main = svg?.closest("main");
    if (!ready || !svg || !path || !dots || !segmentsGroup || !main) return;

    let disposed = false;
    let frame = 0;
    let timer = 0;
    let total = 0;
    let mainTop = 0;
    let anchors: Anchor[] = [];
    let samples: Sample[] = [];
    let circles: SVGCircleElement[] = [];
    let segments: {path: SVGPathElement; start: number; length: number}[] = [];
    let detachScroll = () => {};

    function draw() {
      if (disposed || !samples.length || !path || !svg) return;
      const readY = reduced ? samples[samples.length - 1].y
        : window.scrollY + window.innerHeight * readingThread.readingPosition - mainTop;
      let length = 0;
      if (readY >= samples[samples.length - 1].y) length = total;
      else if (readY > samples[0].y) {
        let low = 0, high = samples.length - 1;
        while (high - low > 1) {
          const middle = (low + high) >> 1;
          if (samples[middle].y <= readY) low = middle;
          else high = middle;
        }
        const from = samples[low], to = samples[high];
        const ratio = Math.max(0, Math.min(1, (readY - from.y) / Math.max(1, to.y - from.y)));
        length = from.length + (to.length - from.length) * ratio;
      }
      path.style.strokeDashoffset = String(Math.max(0, total - length));
      // A dash pattern restarts at every SVG subpath. Mobile strokes therefore
      // each have their own path and local reading progress.
      segments.forEach(segment => {
        const drawn = Math.max(0, Math.min(segment.length, readY - segment.start));
        segment.path.style.strokeDashoffset = String(segment.length - drawn);
        segment.path.style.visibility = drawn > 0 ? "visible" : "hidden";
      });
      svg.dataset.progress = (total ? length / total : 0).toFixed(4);
      circles.forEach((circle, i) => {
        const reached = readY >= anchors[i].y;
        if (circle.dataset.reached !== String(reached)) circle.dataset.reached = String(reached);
      });
    }

    function measure() {
      if (disposed || !main || !svg || !path || !dots || !segmentsGroup) return;
      const width = main.clientWidth;
      const height = main.offsetHeight;
      const mobile = window.matchMedia("(max-width: 767px)").matches;
      const padding = parseFloat(getComputedStyle(main.querySelector(".philosophy")!).paddingLeft);
      const nearText = mobile ? 10 : Math.max(18, padding - 24);
      // This outside lane also clears the People panel and the pinned card deck.
      const outside = mobile ? 10 : Math.max(14, Math.min(nearText - 14, width * .045 - 16));
      mainTop = main.getBoundingClientRect().top + window.scrollY;
      const next: Anchor[] = [];
      const add = (selector: string, x = nearText) => {
        const element = main.querySelector<HTMLElement>(selector);
        if (!element) return;
        const heading = element.matches("p,h2") ? element : element.querySelector<HTMLElement>("h2");
        const inset = parseFloat(getComputedStyle(element).paddingTop) || 0;
        next.push({ x, y: layoutTop(element, main) + inset + (heading?.offsetHeight || 44) / 2 });
      };
      add(".hero", mobile ? 10 : Math.max(18, width * .062 - 24));
      // Use normal-flow chapter wrappers, never a moving page inside a pinned book.
      add(".philosophy");
      // Values' label is sticky; its normal-flow row is the stable anchor.
      add(".values-row");
      add(".approach .section-heading");
      add(".projects .section-heading");
      add(".people .section-heading");
      add(".people-grid");
      add(".company");
      // The closing headline now lives inside a pinned stage. Anchor its stable wrapper.
      add(".contact");
      anchors = next.filter((point, i) => i === 0 || point.y > next[i - 1].y + 1);
      if (anchors.length < 2) return;

      svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
      svg.dataset.layout = mobile ? "mobile" : "desktop";
      svg.dataset.motion = reduced ? "static" : "scroll";
      samples = [];
      segments = [];
      segmentsGroup.replaceChildren();
      let d = "";
      if (mobile) {
        let cumulative = 0;
        anchors.forEach((point, i) => {
          const start = Math.max(0, point.y - 22);
          const end = Math.max(start, Math.min(point.y + 118, (anchors[i + 1]?.y ?? height) - 40));
          const segment = document.createElementNS(svgNS, "path");
          segment.setAttribute("d", `M ${point.x} ${start} V ${end}`);
          segment.setAttribute("class", "reading-thread-path");
          segment.setAttribute("fill", "none");
          segment.setAttribute("stroke-linecap", "round");
          segment.setAttribute("vector-effect", "non-scaling-stroke");
          segment.style.strokeDasharray = `${end-start} ${end-start}`;
          segmentsGroup.appendChild(segment);
          segments.push({path: segment, start, length: end-start});
          samples.push({ y: start, length: cumulative });
          cumulative += end - start;
          samples.push({ y: end, length: cumulative });
        });
        path.removeAttribute("d");
        total = cumulative;
      } else {
        d = `M ${anchors[0].x} ${anchors[0].y}`;
        const points: Anchor[] = [anchors[0]];
        for (let i = 1; i < anchors.length; i++) {
          const previous = anchors[i - 1], point = anchors[i];
          // Curve away within the gutter, with a straight safe lane over long sections.
          points.push({ x: outside, y: previous.y + Math.min(120, (point.y - previous.y) * .28) });
          points.push({ x: outside, y: point.y - Math.min(120, (point.y - previous.y) * .28) });
          points.push(point);
        }
        points.forEach((point, i) => {
          if (!i) return;
          const previous = points[i - 1], dy = point.y - previous.y;
          d += ` C ${previous.x} ${previous.y + dy * .5}, ${point.x} ${point.y - dy * .5}, ${point.x} ${point.y}`;
        });
        path.setAttribute("d", d);
        total = path.getTotalLength();
        const steps = Math.max(2, Math.ceil(total / 20));
        for (let i = 0; i <= steps; i++) {
          const length = total * i / steps;
          samples.push({ y: path.getPointAtLength(length).y, length });
        }
      }
      path.style.strokeDasharray = `${total} ${total}`;
      circles = anchors.map(point => {
        const circle = document.createElementNS(svgNS, "circle");
        circle.setAttribute("cx", String(point.x));
        circle.setAttribute("cy", String(point.y));
        circle.setAttribute("r", "3");
        circle.setAttribute("class", "reading-thread-dot");
        return circle;
      });
      dots.replaceChildren(...circles);
      draw();
    }

    function scheduleMeasure() {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(measure);
    }
    function refreshGeometry() {
      clearTimeout(timer);
      timer = window.setTimeout(() => {
        if (disposed) return;
        // Observe layout only. The scene controller owns refresh scheduling so a
        // decorative line cannot interrupt an anchor jump when lazy images load.
        scheduleMeasure();
      }, 100);
    }

    const observer = new ResizeObserver(refreshGeometry);
    observer.observe(main);
    main.querySelectorAll<HTMLElement>(".hero-heading,.philosophy-row,.values-row,.approach-intro,.section-heading,.contact-heading").forEach(el => observer.observe(el));
    window.addEventListener("resize", refreshGeometry);
    window.addEventListener("orientationchange", refreshGeometry);
    main.addEventListener("load", refreshGeometry, true);
    document.fonts.ready.then(() => { if (!disposed) refreshGeometry(); });
    measure();

    if (!reduced) {
      void Promise.all([import("gsap"), import("gsap/ScrollTrigger")]).then(([g, s]) => {
        if (disposed) return;
        g.gsap.registerPlugin(s.ScrollTrigger);
        const trigger = s.ScrollTrigger.create({ id: "reading-thread", start: 0, end: "max", onUpdate: draw });
        s.ScrollTrigger.addEventListener("refresh", scheduleMeasure);
        detachScroll = () => {
          trigger.kill();
          s.ScrollTrigger.removeEventListener("refresh", scheduleMeasure);
        };
        refreshGeometry();
      }).catch(() => {
        if (disposed) return;
        // The decoration can still follow native scrolling without the enhancement.
        window.addEventListener("scroll", draw, { passive: true });
        detachScroll = () => window.removeEventListener("scroll", draw);
      });
    }
    return () => {
      disposed = true;
      cancelAnimationFrame(frame);
      clearTimeout(timer);
      observer.disconnect();
      detachScroll();
      window.removeEventListener("resize", refreshGeometry);
      window.removeEventListener("orientationchange", refreshGeometry);
      main.removeEventListener("load", refreshGeometry, true);
    };
  }, [ready, reduced]);

  return <svg ref={svgRef} className="reading-thread" aria-hidden="true" focusable="false" preserveAspectRatio="none">
    <path ref={pathRef} className="reading-thread-path" fill="none" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
    <g ref={segmentsRef} data-thread-segments />
    <g ref={dotsRef} />
  </svg>;
}
