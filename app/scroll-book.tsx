import { Children, type ReactNode } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";

/** All pages are ordinary document content until the measured enhancement is ready. */
export function ScrollBook({ name, kind, children, note }: {
  name: string; kind: "opening" | "philosophy" | "approach" | "projects" | "people" | "closing"; children: ReactNode; note?: ReactNode;
}) {
  const pages = Children.toArray(children);
  return <div className={`scroll-book book-${kind}`} data-scroll-book={kind}>
    <div className="book-stage">
      {(kind === "people" || kind === "closing") && <div className="book-atmosphere" aria-hidden="true"><i/><i/><i/></div>}
      <div className="book-rail" aria-hidden="true"><span>{name}</span><span className="book-rail-line"><i/></span><span className="book-scroll-hint">スクロールで次へ</span></div>
      <div className="book-window">{pages.map((page, index) =>
        <div className="book-page" key={index} data-page={index}><div className="book-page-content">{page}</div></div>
      )}</div>
      <div className="book-footer">
        {note && <p className="book-note">{note}</p>}
        <div className="book-controls" aria-label={`${name}のページ操作`}>
          <span className="book-count"><b data-book-count>01</b><span> / {String(pages.length).padStart(2, "0")}</span></span>
          <button type="button" data-book-prev aria-label={`${name}：前のページ`}><ArrowLeft size={18}/></button>
          <button type="button" data-book-next aria-label={`${name}：次のページ`}><ArrowRight size={18}/></button>
        </div>
      </div>
    </div>
  </div>;
}
