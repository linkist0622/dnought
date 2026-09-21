import type { ProjectImage } from "./project-visual";

// Authoritative copy: supplied and adopted by the user on 2026-09-19.
// VMV is fixed copy. Do not paraphrase it when adjusting layouts.
export const contact = { email: "www@d-nought.co.jp" };
export const company = [
 ["正式社名", "ドレッドノート株式会社"],
 ["代表", "藤澤 節子"],
 ["役員", "藤澤 節子 ／ 藤澤 智宏"],
 ["所在地", "東京都杉並区善福寺2丁目24番8号"],
 ["法人番号", "7011301025117"],
 ["お問い合わせ", contact.email],
] as const;
export const philosophy = [
 {en:"Vision",label:"目指す未来",lines:["誰もが自分らしく暮らし、","必要な支えが届き続ける社会へ。"],body:["自分の意思で選び、誰かとつながり、安心して日々を過ごせること。","支える人も、支えを受ける人も、それぞれの暮らしを大切にできる社会を目指します。"]},
 {en:"Mission",label:"私たちの役割",lines:["人の暮らしと仕事に向き合い、","知識と技術を、","現場で役立つ仕組みに変える。"],body:["医療・介護の現場で培った知見に、ICT・AIの技術と事業をつくる力を重ねます。","一人ひとりの困りごとや願いを受け止め、人と人、専門性と実践をつなぎ、日常を支えるサービスと事業を育てます。"]},
] as const;
export const values = [
 {title:"現場に学ぶ。",body:["使う人、働く人の声を聞き、その場で起きていることを確かめる。","日々の小さな困りごとや工夫を、仕組みづくりの出発点にします。"]},
 {title:"その人の意思を尊重する。",body:["支える側と支えられる側を固定せず、一人ひとりの希望と選択を大切にする。","挑戦することも、休むことも、その人自身が選べる関わり方を考えます。"]},
 {title:"知識をひらき、力をつなぐ。",body:["専門知識や経験を、誰かが理解し、使える形で届ける。","互いの得意を持ち寄り、職種や組織の境界を越えて協力します。"]},
 {title:"小さく試し、確かめて育てる。",body:["考えを実践に移し、誰に、どのように役立ったかを確かめる。","うまくいかなかったことにも向き合い、学びながら改善を重ねます。"]},
 {title:"続けられる形をつくる。",body:["関わる人の負担と対価、事業の収支、役割と責任を整える。","積み重ねてきた善意や経験を仕組みで支え、利益を継続と改善につなげます。"]},
] as const;
type Project = {
 name: string; line1: string; line2: string; role: string; field: string;
 theme: string; body: string; note: string; href: string | null;
 link: string; preview: boolean; image: ProjectImage;
};
export const projects: readonly Project[] = [
 {name:"SHINING DAY",line1:"SHINING",line2:"DAY",role:"事業責任者",field:"暮らし・地域",theme:"day",body:"杉並・善福寺で、得意なことを教え合い、地域で支え合う場づくり。小さなデイサービスの開設準備を進めています。",note:"別法人のNPO法人DANKAIプロジェクトが後方支援。",href:"https://shining-day.com",link:"事業のサイトへ",preview:false,image:{"src": "/images/projects/day.webp", "small": "/images/projects/day-840.webp", "width": 1536, "height": 1024, "alt": "麻雀を囲み、世代を越えて教え合う3人のコンセプトイラスト", "caption": "構想イメージ"}},
 {name:"SHINING food",line1:"SHINING",line2:"food",role:"事業責任者",field:"デリバリー・テイクアウト",theme:"food",body:"北軽井沢・嬬恋の滞在へ、食事を届けるデリバリー・テイクアウトのブランド。サービス開始に向けて準備中です。",note:"",href:"https://shining-food.com",link:"サービスのプレビューへ",preview:true,image:{"src": "/images/projects/food.webp", "small": "/images/projects/food-840.webp", "width": 1400, "height": 1400, "alt": "色鮮やかな野菜とチキンを盛り付けたボウルのイメージ写真", "caption": "料理イメージ"}},
 {name:"OIMO cafe",line1:"OIMO",line2:"cafe",role:"AI経営プロジェクト支援",field:"カフェ",theme:"oimo",body:"さつまいも農家が営むカフェ。畑の恵みを食事や甘味として届ける事業を、AI経営プロジェクトの立場で支援しています。",note:"自社運営の店舗ではなく、支援先です。",href:"https://oimocafe.com/",link:"公式サイトへ",preview:false,image:{"src": "/images/projects/oimo.webp", "small": "/images/projects/oimo-840.webp", "width": 1600, "height": 1067, "alt": "壺の内側につるしたさつまいもを、炭火でじっくり焼く様子", "caption": "OIMO cafe 公式写真"}},
 {name:"SHININGresort",line1:"SHINING",line2:"resort",role:"AI経営プロジェクト支援",field:"宿泊",theme:"resort",body:"北軽井沢の自然の中で過ごす、滞在の場づくり。宿泊事業の準備を、AI経営プロジェクトの立場で支援しています。",note:"リンク先はSHINING株式会社のサイトです。",href:"http://shiningmore.jp/",link:"関連サイトへ",preview:false,image:{"src": "/images/projects/resort.webp", "small": "/images/projects/resort-840.webp", "width": 1152, "height": 1536, "alt": "木立に囲まれ、木製のテーブルとベンチが置かれた施設の庭", "caption": "施設の庭／提供写真"}},
 {name:"Cafe&Bar あさま",line1:"Cafe & Bar",line2:"あさま",role:"AI経営プロジェクト支援",field:"店内飲食",theme:"asama",body:"料理と会話を楽しむ、店内飲食のブランド。SHININGresort内での開業準備を、AI経営プロジェクトの立場で支援しています。",note:"",href:"https://asama-design-review.linkist39.chatgpt.site/",link:"確認用プレビュー",preview:true,image:{"src": "/images/projects/asama.webp", "small": "/images/projects/asama-840.webp", "width": 1536, "height": 1152, "alt": "森を望む大きな窓と、ソファやレコード棚のある施設内ラウンジ", "caption": "館内ラウンジ／提供写真"}},
] as const;
export const people = [
 {name:"藤澤 節子",role:"代表",specialty:"薬剤師・介護支援専門員",theme:"setsuko",tag:"Knowledge",heading:"専門知識を、\n必要な人へ届ける。",paragraphs:[
 "1973年、北里大学薬学部薬学科卒業。1994年10月から訪問薬剤師として在宅医療に携わる。医療・介護の現場で得た知識と経験を、薬を扱う人や介護に関わる人が使える形で届けるため、書籍の執筆・編集に取り組んできました。",
 "『介護者が知っておきたい薬のはたらき』『介護職必携 症状から理解する薬のはたらきとつかいかた』などを執筆。『イラストで理解するケアマネのための薬図鑑』には共著で、登録販売者試験の対策書には編著で携わっています。地域の学習支援や食を通じた居場所づくりにも関わってきました。"
 ]},
 {name:"藤澤 智宏",role:"役員",specialty:"LiNKiST／AIエバンジェリスト",theme:"tomohiro",tag:"Practice",heading:"現場の困りごとを、\n使える仕組みに変える。",paragraphs:[
 "医療・介護の領域で、長年ICTの活用に携わってきました。2014年の紹介記事では、当時のリンク株式会社代表取締役として、在宅医療支援アプリ「ランシステム」の開発を担当した経緯が紹介されています。薬剤師の訪問に同行し、現場の仕事の流れや通信環境を確かめながら、入力・共有の仕組みを改善してきました。",
 "現在はAIエバンジェリストとして、事業責任者としての活動とAI経営プロジェクト支援に取り組んでいます。現場を知り、使う人の声を聞き、使える仕組みにする。その経験を、地域・飲食・宿泊などの事業へつなげています。"
 ]},
] as const;
export const navigation = [["philosophy","理念"],["approach","私たちの姿勢"],["projects","取り組み"],["people","私たちについて"],["company","会社概要"],["contact","お問い合わせ"]] as const;

