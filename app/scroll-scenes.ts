import { useLayoutEffect, type RefObject } from "react";

export type ReadingPosition = { target: HTMLElement; offset: number };

export function rememberReadingPosition(node: HTMLElement): ReadingPosition | null {
  const pinned = Array.from(node.querySelectorAll<HTMLElement>(".is-enhanced")).find(book => {
    const top = parseFloat(getComputedStyle(book).getPropertyValue("--stage-top"));
    return Math.abs(book.querySelector(".book-stage")!.getBoundingClientRect().top - top) < 2;
  });
  const page = pinned?.querySelectorAll<HTMLElement>(".book-page")[Number(pinned.dataset.currentPage || 1) - 1];
  const target = page || Array.from(node.querySelectorAll<HTMLElement>(".book-page, main > section, .person-intro, .person-bio, .company-table > div, .footer, .footer-bottom, .values-row"))
    .filter(el => {const rect = el.getBoundingClientRect();return rect.bottom > 120 && rect.top < innerHeight;})
    .sort((a, b) => Math.abs(a.getBoundingClientRect().top - 120) - Math.abs(b.getBoundingClientRect().top - 120))[0];
  return target ? {target, offset: target.getBoundingClientRect().top} : null;
}

function restoreReadingPosition(position: ReadingPosition) {
  if (position.target.closest(".is-enhanced")) goToContent(position.target, "instant");
  else window.scrollTo({top: window.scrollY + position.target.getBoundingClientRect().top - position.offset, behavior: "instant"});
}

export function goToContent(target: HTMLElement, behavior: ScrollBehavior) {
  const page = target.closest<HTMLElement>(".book-page")
    || target.querySelector<HTMLElement>(".is-enhanced .book-page");
  const position = page?.dataset.scrollTarget;
  if (position) window.scrollTo({ top: Number(position), behavior });
  else target.scrollIntoView({ behavior, block: "start" });
}

export function useScrollScenes(rootRef: RefObject<HTMLDivElement | null>, ready: boolean, reduced: boolean, readingPositionRef: RefObject<ReadingPosition | null>) {
  useLayoutEffect(() => {
    const node = rootRef.current;
    if (!ready || !node) return;
    if (reduced) {
      node.dataset.sceneStatus = "reduced-motion";
      if (readingPositionRef.current) {restoreReadingPosition(readingPositionRef.current); readingPositionRef.current = null;}
      return;
    }
    let disposed = false, timer = 0;
    let cleanup = () => {};
    node.dataset.sceneStatus = "loading";
    void Promise.all([import("gsap"), import("gsap/ScrollTrigger")]).then(([g, s]) => {
      if (disposed) return;
      const gsap = g.gsap, ScrollTrigger = s.ScrollTrigger;
      gsap.registerPlugin(ScrollTrigger);
      let ctx: ReturnType<typeof gsap.context> | undefined;
      let resetExtras: (() => void)[] = [];
      let firstBuild = true;
      let pendingLayoutPosition: ReadingPosition | null = null;
      function rebuild() {
        if (disposed || !node) return;
        const layoutPosition = pendingLayoutPosition;
        pendingLayoutPosition = null;
        const pinned = window.scrollY > 2 && Array.from(node.querySelectorAll<HTMLElement>(".is-enhanced")).find(book => {
          const top = parseFloat(getComputedStyle(book).getPropertyValue("--stage-top"));
          return Math.abs(book.querySelector(".book-stage")!.getBoundingClientRect().top - top) < 2;
        });
        const restore = pinned ? {book: pinned, page: Number(pinned.dataset.currentPage || 1) - 1} : null;
        ctx?.revert(); resetExtras.forEach(fn => fn()); resetExtras = [];
        // Assign the context before initialization, so partial failures can always revert styles.
        ctx = gsap.context(() => {}, node);
        ctx.add(() => {
          // A complete paragraph must fit before a chapter is allowed to become fixed.
          {
            node.querySelectorAll<HTMLElement>("[data-scroll-book]").forEach(book => {
              const stage = book.querySelector<HTMLElement>(".book-stage")!;
              const windowEl = book.querySelector<HTMLElement>(".book-window")!;
              const pages = Array.from(book.querySelectorAll<HTMLElement>(".book-page"));
              const copies = pages.map(page => page.querySelector<HTMLElement>(".book-page-content")!);
              const count = book.querySelector<HTMLElement>("[data-book-count]")!;
              const prev = book.querySelector<HTMLButtonElement>("[data-book-prev]")!;
              const next = book.querySelector<HTMLButtonElement>("[data-book-next]")!;
              const line = book.querySelector<HTMLElement>(".book-rail-line i")!;
              const compact = innerWidth < 1101 || innerHeight < 800;
              book.classList.toggle("is-compact", compact);
              resetExtras.push(() => {book.classList.remove("is-compact", "is-flow");delete book.dataset.sceneMode;});
              book.classList.add("is-probing");
              const fits = copies.every(copy => copy.scrollHeight <= windowEl.clientHeight - 8 && copy.scrollWidth <= windowEl.clientWidth + 1);
              book.classList.remove("is-probing");
              if (!fits) {
                book.classList.add("is-flow");
                book.dataset.sceneMode = "flow-content-overflow";
                pages.forEach(page => gsap.fromTo(page, {y: 16, opacity: .45}, {y: 0, opacity: 1, ease: "none", scrollTrigger: {trigger: page, start: "top 95%", end: "top 65%", scrub: true}}));
                return;
              }
              book.dataset.sceneMode = compact ? "pinned-compact" : "pinned";
              book.classList.add("is-enhanced");
              resetExtras.push(() => {
                book.classList.remove("is-enhanced", "is-probing"); delete book.dataset.currentPage;
                pages.forEach(page => {page.inert = false; page.removeAttribute("aria-hidden"); page.style.removeProperty("z-index"); delete page.dataset.scrollTarget;});
                prev.disabled = false; next.disabled = false; line.style.removeProperty("transform");
              });
              let current = -1;
              const hold = book.dataset.scrollBook === "opening" ? .65 : .9;
              const turn = .3, step = hold + turn;
              const total = (pages.length - 1) * step + hold;
              const stops = pages.map((_, index) => (index * step + hold * .4) / total);
              gsap.set(pages, { autoAlpha: 0 });
              gsap.set(pages[0], { autoAlpha: 1 });
              pages.forEach((page, index) => { page.style.zIndex = String(index + 1); });
              const sync = (progress: number) => {
                const time = progress * total;
                const index = Math.min(pages.length - 1, Math.floor((time + turn * .5) / step));
                line.style.transform = `scaleX(${progress})`;
                if (current === index) return;
                current = index;
                book.dataset.currentPage = String(index + 1);
                count.textContent = String(index + 1).padStart(2, "0");
                prev.disabled = index === 0; next.disabled = index === pages.length - 1;
                pages.forEach((page, i) => {
                  page.inert = i !== index;
                  page.setAttribute("aria-hidden", String(i !== index));
                });
              };
              const timeline = gsap.timeline({scrollTrigger: {
                id: `book-${book.dataset.scrollBook}`, trigger: stage,
                start: () => `top ${parseFloat(getComputedStyle(book).getPropertyValue("--stage-top"))}`,
                pin: true, end: () => `+=${Math.round(stage.clientHeight * total * .8)}`,
                scrub: true, invalidateOnRefresh: true, anticipatePin: 1,
                onUpdate: self => sync(self.progress),
                onRefresh: self => {
                  pages.forEach((page, i) => { page.dataset.scrollTarget = String(self.start + (self.end - self.start) * stops[i]); });
                  sync(self.progress);
                }
              }});
              const isText = ["philosophy", "opening", "people", "closing"].includes(book.dataset.scrollBook || "");
              for (let i = 1; i < pages.length; i++) {
                const at = (i - 1) * step + hold;
                // Hold the whole thought still, then turn the entire page together.
                timeline.to(pages[i - 1], {autoAlpha: 0, y: isText ? -20 : 0, scale: isText ? 1 : .98, duration: turn * .48, ease: "none"}, at);
                timeline.fromTo(pages[i], {autoAlpha: 0, y: isText ? 22 : 0, xPercent: isText ? 0 : 5, rotationY: isText ? 0 : -5,
                  clipPath: isText ? "inset(0% 0% 0% 0%)" : "inset(0% 0% 0% 100%)"},
                  {autoAlpha: 1, y: 0, xPercent: 0, rotationY: 0, clipPath: "inset(0% 0% 0% 0%)", duration: isText ? turn * .5 : turn, ease: "none"}, at + (isText ? turn * .5 : 0));
              }
              timeline.to({}, {duration: hold}, (pages.length - 1) * step);
              const atmosphere = stage.querySelectorAll<HTMLElement>(".book-atmosphere i");
              // The scenery changes throughout the hold, while the whole thought stays still.
              atmosphere.forEach((layer, i) => {
                timeline.fromTo(layer, {xPercent: i === 1 ? 12 : -12, yPercent: i === 1 ? -9 : 9, rotation: -12},
                  {xPercent: i === 1 ? -12 : 12, yPercent: i === 1 ? 9 : -9, rotation: 18, duration: total, ease: "none"}, 0);
              });
              const move = (direction: number) => {
                const target = Math.max(0, Math.min(pages.length - 1, current + direction));
                // The explicit page controls land in a complete, stationary reading interval.
                window.scrollTo({top: Number(pages[target].dataset.scrollTarget), behavior: "instant"});
              };
              const back = () => move(-1), forward = () => move(1);
              prev.addEventListener("click", back); next.addEventListener("click", forward);
              sync(timeline.scrollTrigger?.progress || 0);
              resetExtras.push(() => {
                prev.removeEventListener("click", back); next.removeEventListener("click", forward);
              });
            });
          }
          // Continue the story through long-form content without pinning or hiding paragraphs.
          node.querySelectorAll<HTMLElement>(".reveal, .person-intro, .person-bio, .company > .section-label").forEach(element => {
            if (element.closest("[data-scroll-book]")) return;
            gsap.fromTo(element, {opacity: .28, y: 24}, {opacity: 1, y: 0, ease: "none",
              scrollTrigger: {trigger: element, start: "clamp(top 96%)", end: "clamp(top 72%)", scrub: true}});
          });
          node.querySelectorAll<HTMLElement>(".person").forEach(person => {
            gsap.fromTo(person.querySelector(".person-reading-line i"), {scaleX: 0}, {scaleX: 1, ease: "none",
              scrollTrigger: {trigger: person, start: "top 75%", end: "bottom 72%", scrub: true}});
          });
          node.querySelectorAll<HTMLElement>(".company-table > div").forEach(row => {
            gsap.fromTo(row, {opacity: .3, y: 18, "--row-rule": 0}, {opacity: 1, y: 0, "--row-rule": 1, ease: "none",
              scrollTrigger: {trigger: row, start: "clamp(top 94%)", end: "clamp(top 70%)", scrub: true}});
          });
          const footerWord = node.querySelector(".footer-word");
          if (footerWord) gsap.fromTo(footerWord, {yPercent: 22, opacity: .2, clipPath: "inset(0% 0% 85% 0%)"},
            {yPercent: 0, opacity: 1, clipPath: "inset(0% 0% 0% 0%)", ease: "none",
              scrollTrigger: {trigger: footerWord, start: "clamp(top 98%)", end: "max", scrub: true}});
          const wash = node.querySelector(".ambient-scene");
          const themes = ["#b9d9eb", "#d8cee8", "#c7ded5", "#d7d3e9", "#c0d7e7", "#e7d8cb"];
          node.querySelectorAll<HTMLElement>("main > section:not(.hero)").forEach((section, i) => {
            gsap.to(wash, {backgroundColor: themes[i % themes.length], opacity: .42, ease: "none",
              scrollTrigger: {trigger: section, start: "top 85%", end: "top 25%", scrub: true}});
          });
        });
        ScrollTrigger.refresh();
        node.dataset.sceneStatus = "ready";
        if (layoutPosition) restoreReadingPosition(layoutPosition);
        else if (restore) {
          const page = restore.book.querySelectorAll<HTMLElement>(".book-page")[restore.page];
          if (page) goToContent(page, "instant");
        }
        if (firstBuild) {
          firstBuild = false;
          if (readingPositionRef.current) {
            restoreReadingPosition(readingPositionRef.current); readingPositionRef.current = null;
            return;
          }
          let id = ""; try { id = decodeURIComponent(location.hash.slice(1)); } catch {}
          const target = id && document.getElementById(id);
          if (target) goToContent(target, "instant");
        }
      }
      let lastWidth = innerWidth, lastHeight = innerHeight;
      let lastScrollAt = 0;
      const scrolling = () => { lastScrollAt = performance.now(); };
      // Lazy images may load during an anchor jump. Wait until scrolling settles before
      // restoring a pinned reading position, or an intermediate chapter steals the jump.
      const schedule = () => {clearTimeout(timer); timer = window.setTimeout(() => {
        if (performance.now() - lastScrollAt < 180) {schedule(); return;}
        try {rebuild();} catch(error) {cleanup();node.dataset.sceneStatus = "fallback";console.error("[scroll-scenes] layout initialization failed", error);}
      }, 200);};
      const resize = () => {
        const width = innerWidth, height = innerHeight;
        // Mobile browser chrome changes height while scrolling; do not restart the story for that.
        if (matchMedia("(pointer: coarse)").matches && width === lastWidth && Math.abs(height - lastHeight) < lastHeight * .2) return;
        // Capture the current thought before ScrollTrigger's own delayed resize refresh
        // repositions downstream pins using the new viewport height.
        pendingLayoutPosition ||= rememberReadingPosition(node);
        lastWidth = width; lastHeight = height; schedule();
      };
      const cancelLayoutRestore = () => {pendingLayoutPosition = null;};
      const navigationClick = (event: MouseEvent) => {if (event.target instanceof Element && event.target.closest('a[href^="#"], [data-book-next], [data-book-prev]')) cancelLayoutRestore();};
      const scrollKey = (event: KeyboardEvent) => {if (["ArrowUp", "ArrowDown", "PageUp", "PageDown", "Home", "End", " "].includes(event.key)) cancelLayoutRestore();};
      const hash = () => {cancelLayoutRestore();let id = "";try{id = decodeURIComponent(location.hash.slice(1));}catch{}const target = document.getElementById(id);if(target)goToContent(target, "instant");};
      cleanup = () => {clearTimeout(timer);window.removeEventListener("scroll", scrolling);window.removeEventListener("wheel", cancelLayoutRestore);window.removeEventListener("touchstart", cancelLayoutRestore);window.removeEventListener("keydown", scrollKey);node.removeEventListener("click", navigationClick, true);window.removeEventListener("resize", resize);window.removeEventListener("orientationchange", schedule);window.removeEventListener("hashchange", hash);node.removeEventListener("load", schedule, true);document.fonts.removeEventListener("loadingdone", schedule);ctx?.revert();resetExtras.forEach(fn => fn());};
      window.addEventListener("scroll", scrolling, {passive: true});
      window.addEventListener("wheel", cancelLayoutRestore, {passive: true});window.addEventListener("touchstart", cancelLayoutRestore, {passive: true});window.addEventListener("keydown", scrollKey);node.addEventListener("click", navigationClick, true);
      window.addEventListener("resize", resize); window.addEventListener("orientationchange", schedule);
      window.addEventListener("hashchange", hash); node.addEventListener("load", schedule, true);
      document.fonts.addEventListener("loadingdone", schedule);
      rebuild();
      void document.fonts.ready.then(() => {if (!disposed) schedule();});
    }).catch(error => {cleanup();if(!disposed){node.dataset.sceneStatus = "fallback";console.error("[scroll-scenes] enhancement unavailable", error);}});
    return () => {disposed = true; cleanup();};
  }, [rootRef, ready, reduced, readingPositionRef]);
}
