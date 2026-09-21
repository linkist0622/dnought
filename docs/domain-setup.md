# d-nought.co.jp 接続記録

正式URLは **https://d-nought.co.jp/** です。2026-09-21 02:39 UTC、Sitesの接続確認でドメイン・配信先・HTTPS証明書のすべてがactiveとなったことを確認しました。ドメイン管理はお名前.comです。

当初の候補d-nought.onlineから、ユーザーが指定・設定したd-nought.co.jpへ切り替えています。認証用TXTはドメインごとに異なります。

## 設定したDNSレコード

対象ゾーンは **d-nought.co.jp**。お名前.comではAのホスト名を空欄にし、TXTのホスト名には下表の短い名前を入力します。TTLは3600秒、状態は有効です。

| TYPE | ホスト名 | VALUE |
|---|---|---|
| A | 空欄 | `162.159.143.30` |
| A | 空欄 | `172.66.3.26` |
| TXT | _openai-site-verification | `openai-site-verification=wfpmNenKL7dcr78J00VRiLJ5zCDxZyqXO87tOe-Nupc` |
| TXT | _cf-custom-hostname | `249a824c-3a52-40ff-a7a1-9705274e5c5e` |

TXTは接続時に発行された値です。認証後も設定を保持し、再設定時にサービス側から新しい値が発行された場合はその案内に従います。www付きURLは今回登録していません。問い合わせ先は `www@d-nought.co.jp` です。

## サイトの正式URL設定

`app/site-meta.ts` の `url` を `https://d-nought.co.jp` とし、canonical・OGP・robots・sitemapへ共通で適用します。将来別のドメインへ移す際は、先にサイト側の登録、DNS、HTTPSの有効化を確認してからURLを変更し、ビルド・公開を行います。

接続状態はSitesの検証結果に基づきます。外部のすべてのDNSキャッシュや実機環境での到達を確認したものではありません。

## 管理先

- 正式公開先：https://d-nought.co.jp/
- ソース：https://github.com/linkist0622/dnought
- Sites標準URL：https://dreadnought-corporate.linkist39.chatgpt.site/
- お名前.com操作ガイド：https://www.onamae.com/guide/p/70
