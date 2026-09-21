# d-nought.online 接続手順

本番用ドメインとして、サイト側の登録は完了しています。現在はDNS検証・HTTPS証明書の有効化待ちです。ドメイン登録事業者やDNS管理画面への接続権限はこの作業環境では確認できていません。

## DNS管理画面に登録する内容

対象ゾーンは **d-nought.online** です。TTLは管理画面の初期値、または3600秒を使います。

| 種別 | ホスト名（d-nought.onlineより前の部分） | 値 |
|---|---|---|
| A | @ または空欄 | `162.159.143.30` |
| A | @ または空欄 | `172.66.3.26` |
| TXT | _openai-site-verification | `openai-site-verification=21fgbc-lmaH6LntUKRWrcbbUNpp9xA1wVz7MOoRQsU0` |
| TXT | _cf-custom-hostname | `4bb2f38a-5eca-4954-b44f-def6d2b84b64` |

ホスト名欄にドメインが自動で付く画面では、表の短い名前だけを入力してください。完全な名前を求める画面では、TXTの末尾に `.d-nought.online` を付けます。Aレコード2件は両方登録します。

www付きURLは今回登録していません。メールは従来の `www@d-nought.co.jp` を引き続き使用します。このWebサイトの接続にMXレコードの変更は必要ありません。

## 登録後

1. 上記レコードを保存する。
2. Sitesでドメイン検証を再実行し、ドメインとHTTPSがactiveになるまで確認する。追加検証レコードが返った場合はその値に従う。
3. `https://d-nought.online/` でサイト表示を確認する。
4. `app/site-meta.ts` の `url` を `https://d-nought.online` に変更し、型チェック・ビルド後に再公開する。
5. canonical、robots.txt、sitemap.xmlが新ドメインになったことを確認する。

接続が確認できるまでは、現在の公開URLとcanonicalを維持します。DNSを登録しただけで切り替え完了とは扱いません。

## 現在の管理先

- ソース：https://github.com/linkist0622/dnought
- 公開サイト：https://dreadnought-corporate.linkist39.chatgpt.site/
- 指定ドメイン：https://d-nought.online/

