# ドレッドノート株式会社 コーポレートサイト

医療・介護の知見とICT・AIをつなぐ、1ページのコーポレートサイトです。6つのスクロールステージ、淡いグラデーション、読む順序を示す線を実装しています。

- GitHub管理先：https://github.com/linkist0622/dnought
- 現在の公開先：https://dreadnought-corporate.linkist39.chatgpt.site/
- 新しい独自ドメイン：**d-nought.online**（DNSとHTTPSの確認待ち）
- 公開基盤：Sites／Cloudflare Workers。GitHub Actionsは検証用です。GitHubへのpushだけで本番は更新されません。

## 手元で開く

Node.js 22.13以降の22系、Git、pnpm 11.25.0を使います。WindowsのPowerShellでも以下の順に実行できます。

```sh
git clone https://github.com/linkist0622/dnought.git
cd dnought
npm install --global pnpm@11.25.0
pnpm install --frozen-lockfile
pnpm dev
```

起動後、ターミナルに表示されたURLをブラウザで開きます。終了はCtrl+Cです。依存バージョンを揃えるため、pnpm-lock.yamlを削除しないでください。

## 編集する場所

| 内容 | ファイル |
|---|---|
| 会社情報、採用済み理念、5つの活動、人物経歴 | app/site-content.ts |
| 構成、見出し、改行、ナビゲーション | app/page.tsx |
| 固定場面とスクロール制御 | app/scroll-scenes.ts / app/scroll-book.tsx |
| 章をつなぐ装飾線 | app/reading-thread.tsx |
| 色、余白、文字サイズ、小画面の表示 | app/globals.css |
| 本番URL、タイトル、説明文 | app/site-meta.ts |
| プロジェクト画像 | public/images/projects/ |

理念と経歴は、デザイン調整のために書き換えないでください。事業責任者とAI経営プロジェクト支援、準備中と開業済みを区別してください。Codex向けの引き継ぎはAGENTS.md、変更記録はHANDOFF.mdです。

## 修正から公開まで

1. mainから作業ブランチを作り、Codexで必要な変更を行います。
2. `pnpm lint`、`pnpm typecheck`、`pnpm build` を実行します。
3. スクロールを変えた場合は、PCとスマートフォン幅、逆スクロール、章リンク、演出OFFをブラウザで確認します。
4. GitHubにpushしてPull Requestを作り、差分とSite checksの結果を確認してmainへ反映します。
5. Sitesの制作環境で、そのGitHubの変更を取り込み、検証した同じ内容を公開します。公開用の一時認証情報をGitHubへ保存しないでください。

このコードはNext.js形式の画面をVinextでCloudflare Workers向けにビルドする構成です。Vercel等へ移す際は、そのままの自動デプロイを前提にせず、移行先のビルド構成を別途検証します。

## 独自ドメインの切り替え

入力するDNSレコードと切り替え手順は [docs/domain-setup.md](docs/domain-setup.md) にまとめています。DNSとHTTPSの有効化を確認後、app/site-meta.ts のurlをplannedUrlへ切り替え、再公開します。canonical、robots、sitemapはこの設定を参照します。

現在の本番アプリはメールリンクで問い合わせを受け付けます。送信フォーム、会員登録、決済はありません。
