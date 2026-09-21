# SNS共有画像とOGP

- 正式URL：`https://d-nought.co.jp/`
- タイトル：ドレッドノート株式会社｜人の力を、続く力に。
- 説明：`app/site-meta.ts` のdescriptionを使用
- 画像：`public/images/ogp-dreadnought-v1.png`（1200×630、PNG）
- Open Graph：website / ja_JP、画像URL・寸法・代替テキストを設定
- X：summary_large_image、画像URL・代替テキストを設定

`app/layout.tsx` が共有設定を出力します。画像とタイトル・説明の設定元は `app/site-meta.ts`。画像を差し替える場合は新しいファイル名にし、`socialImage.url` を合わせて更新してください。

画像は組み込みimagegenで生成したブランド表現用グラフィックです。PNGを1200×630へリサイズして配置しました。実在施設・実績を示す写真ではありません。日本語の文字と改行、余白、画像寸法を確認しています。SNS各社の実際の共有表示やキャッシュ更新は未検証です。

## 生成プロンプト

Use case: ads-marketing / corporate Open Graph card. Create one finished Japanese corporate website social-sharing card for ドレッドノート株式会社. Landscape canvas exactly 1200 × 630 px, 40:21 aspect ratio, no mockup, no outer border. Design: premium, calm, modern Japanese editorial graphic. Soft but visible blended gradients on almost-white: pale powder blue upper right, pale lavender lower right, faint warm cream left; charcoal typography. One very fine blue-grey flowing curved line travels through the spare right-side space, with 2-3 tiny dots, suggesting human connections and continuity. Extremely clean, refined typography, generous safe margins of at least 80 px, text occupies left to center, decorative line on right does not cross text. A small restrained muted-gold accent can be used. Exact text, no additional text: small upper-left English wordmark 'DREADNOUGHT'; smaller Japanese company name directly under it 'ドレッドノート株式会社'; large Japanese headline in two carefully balanced lines '人の力を、' then '続く力に。'; bottom-left small descriptive text '医療・介護の知見と、ICT・AIをつなぐ。'; lower-right small domain 'd-nought.co.jp'. All punctuation and Japanese characters must be exact. Main headline very large, legible in small previews. Use elegant Japanese sans-serif lettering, not handwriting. Do not use photos, people, objects, invented logos, company statistics, gradients inside the letters, noisy textures, sci-fi elements, 3D text, watermarks, or charts. Intended as a real production OGP graphic, precise balanced composition, single static image.

## 参照資料

- https://nextjs.org/docs/app/api-reference/functions/generate-metadata
