import Link from "next/link";

export default function NotFound() {
  return <main className="not-found-page">
    <p>ドレッドノート株式会社</p>
    <h1>ページが見つかりません。</h1>
    <p>ページの場所が変わったか、URLに誤りがある可能性があります。</p>
    <Link href="/">トップページへ戻る</Link>
  </main>;
}
