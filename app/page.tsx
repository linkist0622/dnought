"use client";
import { useEffect, useRef, useState, type MouseEvent } from "react";
import { ArrowDown, ArrowUp, ArrowUpRight, ChevronRight, Menu, X, BookOpen, Network } from "lucide-react";
import { company, contact, philosophy, values, projects, people, navigation } from "./site-content";
import { ScrollBook } from "./scroll-book";
import { goToContent, rememberReadingPosition, useScrollScenes, type ReadingPosition } from "./scroll-scenes";
import { ReadingThread } from "./reading-thread";
import { ProjectVisual } from "./project-visual";

function Label({en,ja}:{en:string;ja:string}) {return <div className="section-label"><h2 aria-label={ja}>{en}</h2><p>{ja}</p></div>;}
function RoundArrow({up=false}:{up?:boolean}) {return <span className="round-arrow" aria-hidden="true">{up?<ArrowUpRight size={18}/>:<ChevronRight size={18}/>}</span>;}
function Brand(){return <><strong>DREADNOUGHT</strong><span>ドレッドノート株式会社</span></>;}

export default function Home() {
 const root=useRef<HTMLDivElement>(null);
 const readingPosition=useRef<ReadingPosition | null>(null);
 const menuButton=useRef<HTMLButtonElement>(null);
 const [reduced,setReduced]=useState(true);
 const [osReduced,setOsReduced]=useState(false);
 const [ready,setReady]=useState(false);
 const [hidden,setHidden]=useState(false);
 const [menu,setMenu]=useState(false);
 const [active,setActive]=useState("top");
 useEffect(()=>{
  const mq=window.matchMedia("(prefers-reduced-motion: reduce)");
  const read=()=>{let choice=false;try{choice=localStorage.getItem("dreadnought-reduced-motion")==="true";}catch{}setOsReduced(mq.matches);setReduced(mq.matches||choice);};
  const change=()=>{if(root.current)readingPosition.current=rememberReadingPosition(root.current);read();};
  const visibility=()=>setHidden(document.hidden);
  let disposed=false;
  // Keep the server's readable layout through hydration, then sync browser preferences.
  queueMicrotask(()=>{if(!disposed){read();visibility();setReady(true);}});
  mq.addEventListener("change",change);document.addEventListener("visibilitychange",visibility);
  return()=>{disposed=true;mq.removeEventListener("change",change);document.removeEventListener("visibilitychange",visibility);};
 },[]);
 useEffect(()=>{
  if(!root.current)return;
  const obs=new IntersectionObserver(entries=>{for(const e of entries)if(e.isIntersecting)setActive(e.target.id);},{rootMargin:"-15% 0px -65% 0px"});
  root.current.querySelectorAll("section[id]").forEach(el=>obs.observe(el));
  return()=>obs.disconnect();
 },[]);
 useEffect(()=>{
  if(!menu)return;
  const close=(event:KeyboardEvent)=>{if(event.key==="Escape"){setMenu(false);menuButton.current?.focus();}};
  const mq=matchMedia("(min-width: 1101px)");const resize=()=>{if(mq.matches)setMenu(false);};
  document.addEventListener("keydown",close);mq.addEventListener("change",resize);
  return()=>{document.removeEventListener("keydown",close);mq.removeEventListener("change",resize);};
 },[menu]);
 useScrollScenes(root,ready,reduced,readingPosition);

 function changeMotion(){
  if(osReduced)return;
  if(root.current)readingPosition.current=rememberReadingPosition(root.current);
  const next=!reduced;try{localStorage.setItem("dreadnought-reduced-motion",String(next));}catch{}
  setReduced(osReduced||next);
 }
 function jump(event:MouseEvent<HTMLAnchorElement>,id:string){
  event.preventDefault();setMenu(false);
  const target=document.getElementById(id);if(!target)return;
  history.pushState(null,"","#"+id);
  goToContent(target,reduced?"instant":"smooth");target.focus({preventScroll:true});
 }
 const link=(id:string)=>(event:MouseEvent<HTMLAnchorElement>)=>jump(event,id);
 return <div ref={root} className={"site "+(reduced?"reduced-motion":"motion-enabled")+(hidden?" page-hidden":"")}>
 <a className="skip-link" href="#main">本文へ移動</a>
 <div className="ambient" aria-hidden="true"><i/><i/><i/><i/><div className="ambient-scene"/></div>
 <header className="site-header">
  <a href="#top" onClick={link("top")} className="brand" aria-label="ドレッドノート トップへ"><Brand/></a>
  <button className="header-motion" role="switch" aria-label="スクロール演出" aria-checked={!reduced} disabled={osReduced} title={osReduced?"端末の「動きを減らす」設定に従っています":reduced?"スクロール演出を使う":"動きを減らす"} onClick={changeMotion}><span aria-hidden="true"/>{reduced?"演出 OFF":"演出 ON"}</button>
  <nav className="desktop-nav" aria-label="主要ナビゲーション">{navigation.map(([id,label])=><a key={id} href={"#"+id} onClick={link(id)} className={id==="contact"?"nav-contact":undefined} aria-current={active===id?"location":undefined}>{label}{id==="contact"&&<ArrowUpRight size={15}/>}</a>)}</nav>
  <button className="menu-toggle" ref={menuButton} aria-expanded={menu} aria-controls="mobile-menu" aria-label={menu?"メニューを閉じる":"メニューを開く"} onClick={()=>setMenu(v=>!v)}>{menu?<X size={24}/>:<Menu size={24}/>}</button>
  <nav id="mobile-menu" className="mobile-nav" aria-label="モバイルナビゲーション" hidden={!menu}>{navigation.map(([id,label])=><a key={id} href={"#"+id} onClick={link(id)}>{label}<ArrowUpRight size={20}/></a>)}</nav>
 </header>
 <main id="main" tabIndex={-1}>
  <ReadingThread ready={ready} reduced={reduced}/>
  <section id="top" className="hero" tabIndex={-1}>
   <ScrollBook name="序章 / 暮らしと仕事、その先へ" kind="opening">
    <div className="opening-intro hero-heading"><p className="story-kicker">私たちの物語は、現場から始まります。</p><h1>人の力を、<br/>続く力に。</h1><p>医療・介護の知見と<span className="keep-word">ICT・AI</span>をつなぎ、<br/>暮らしと事業を支える。</p><span className="opening-cue">スクロールして、物語をひらく<ArrowDown size={18}/></span></div>
    <div className="opening-message"><p className="story-kicker">経験が、次の可能性につながる。</p><h2><span>一人ひとりの経験を、</span><span>誰かを支える力へ。</span></h2><p>専門知識と、現場の実践。<br/>その先の暮らしを、ともに。</p><div className="opening-links"><a href="#philosophy" onClick={link("philosophy")}>私たちが目指す未来へ<RoundArrow/></a><a href="#values" onClick={link("values")}>大切にする五つの行動<ArrowUpRight size={18}/></a></div></div>
   </ScrollBook>
  </section>
  <section id="philosophy" className="philosophy section-shell" tabIndex={-1} aria-label="理念">
   <ScrollBook name="01 / 目指す未来と、私たちの役割" kind="philosophy">{philosophy.map(item=><article key={item.en} className="philosophy-row"><Label en={item.en} ja={item.label}/><div className="philosophy-copy"><h3>{item.lines.map(line=><span className="meaning-line" key={line}>{line}</span>)}</h3><div className="philosophy-body">{item.body.map(p=><p key={p}>{p}</p>)}</div></div></article>)}</ScrollBook>
   <div id="values" className="values-row" tabIndex={-1}><Label en="Values" ja="大切にする五つの行動"/><ol className="value-list">{values.map((v,i)=><li key={v.title} className="reveal"><span className="value-number" aria-hidden="true">0{i+1}</span><div><h3>{v.title}</h3>{v.body.map(p=><p key={p}>{p}</p>)}</div></li>)}</ol></div>
  </section>
  <section id="approach" className="approach section-shell" tabIndex={-1}>
   <div className="section-heading"><Label en="Approach" ja="私たちの姿勢"/><p>大切にしていることを、日々の実践へ。<br/>知識と技術、ふたつの視点で向き合います。</p></div>
   <ScrollBook name="02 / 思いを、実践へ" kind="approach">
    <article className="perspective perspective-knowledge"><div className="perspective-title"><span className="chapter-index">01 / Knowledge</span><BookOpen size={40} strokeWidth={1.2}/><h3><span>知識を、</span><span>届く形に。</span></h3></div><div className="perspective-copy"><p>訪問の現場で培った医療・介護の知見と、執筆を通じた知識の共有。必要な人が使える形へ。</p><a href="#setsuko" onClick={link("setsuko")}>藤澤 節子について<RoundArrow up/></a></div></article>
    <article className="perspective perspective-technology"><div className="perspective-title"><span className="chapter-index">02 / Technology</span><Network size={40} strokeWidth={1.2}/><h3><span>技術を、</span><span>使える形に。</span></h3></div><div className="perspective-copy"><p>医療・介護ICTで培った経験を、AIの活用と地域・飲食・宿泊の事業へ。使う人の声を聞き、仕組みを育てます。</p><a href="#tomohiro" onClick={link("tomohiro")}>藤澤 智宏について<RoundArrow up/></a></div></article>
   </ScrollBook>
  </section>
  <section id="projects" className="projects section-shell" tabIndex={-1}>
   <div className="section-heading reveal"><Label en="Projects" ja="関わっている取り組み"/><p>事業を進めること。専門性で支えること。<br/>それぞれの役割を大切に、取り組んでいます。</p></div>
   <ScrollBook name="03 / 暮らしと仕事に、つながる実践" kind="projects" note="担当区分は藤澤智宏の関わり方です。すべてがドレッドノートの直営・保有事業ではありません。">
    {projects.map((p,i)=><article key={p.name} className={"project-card project-"+p.theme}><div className="project-identity"><div className="project-meta"><span className="role-tag">{p.role}</span><span className="project-number">0{i+1}</span></div><h3>{p.name}</h3><p className="project-field">{p.field}</p><ProjectVisual image={p.image} theme={p.theme}/></div><div className="project-detail"><p className="project-body">{p.body}</p>{p.note&&<p className="project-note">{p.note}</p>}{p.href?<a className="project-link" href={p.href} target="_blank" rel="noopener noreferrer" aria-label={p.name+"："+p.link+"（新しいタブ）"}><span>{p.link}</span><RoundArrow up/></a>:<p className="project-link link-pending">{p.link}</p>}</div></article>)}
   </ScrollBook>
  </section>
  <section id="people" className="people" tabIndex={-1}>
   <div className="section-heading section-shell reveal"><Label en="People" ja="私たちについて"/><p>取り組みの根にあるのは、人の経験。<br/>異なる専門性を、ひとつの実践へ。</p></div>
   <div className="people-stage-shell section-shell"><ScrollBook name="04 / 実践を支える、ふたつの視点" kind="people">
    <div className="people-intro"><span className="chapter-index">経験から、次の実践へ。</span><h3>知っていることを、<br/>役立つことへ。</h3><p>医療・介護の経験と、ICT・AIの実践。<br/>ふたつの視点から、<br className="mobile-break"/>暮らしと仕事に向き合います。</p></div>
    <div className="people-perspectives"><p className="chapter-index">異なる専門性が、ひとつの力になる。</p><h3>知識を届ける。<br/>技術を役立てる。</h3><div className="people-pair">{people.map((p,i)=><a key={p.name} href={i===0?"#setsuko":"#tomohiro"} onClick={link(i===0?"setsuko":"tomohiro")}><span>{i===0?"医療・介護の知見":"ICT・AIの実践"}</span><strong>{p.name}</strong><span className="people-pair-link">経歴を読む<ArrowDown size={17}/></span></a>)}</div></div>
   </ScrollBook></div>
   <div className="people-grid section-shell">{people.map((p,i)=><article className={"person person-"+p.theme} id={i===0?"setsuko":"tomohiro"} tabIndex={-1} key={p.name}><span className="person-reading-line" aria-hidden="true"><i/></span><div className="person-intro"><div className="person-kicker"><span>{p.tag}</span><span>0{i+1}</span></div><h3>{p.name}</h3><p className="person-role"><strong>{p.role}</strong><span>{p.specialty}</span></p><h4>{p.heading.split("\n").map((line,j)=><span key={line}>{j>0&&<br/>}{line}</span>)}</h4></div>{p.paragraphs.map(text=><p className="person-bio" key={text}>{text}</p>)}</article>)}</div>
  </section>
  <section id="company" className="company section-shell" tabIndex={-1}><Label en="Company" ja="会社概要"/><dl className="company-table">{company.map(([label,value])=><div key={label}><dt>{label}</dt><dd>{label==="お問い合わせ"?<a href={"mailto:"+contact.email}>{value}<ArrowUpRight size={16}/></a>:value}</dd></div>)}</dl></section>
  <section id="contact" className="contact section-shell" tabIndex={-1}><ScrollBook name="05 / ここから、次の物語へ" kind="closing"><div className="contact-heading"><p className="closing-kicker">人の力を、続く力に。</p><h2>暮らしと仕事の、<br/>これからをともに。</h2><p>事業について、地域での連携について。<br/>お問い合わせは、<br className="mobile-break"/>メールにてお寄せください。</p><a className="closing-direct" href={"mailto:"+contact.email}>メールで相談する<ArrowUpRight size={19}/></a></div><div className="closing-actions"><p className="closing-kicker">次の一歩を、ここから。</p><div className="contact-cards"><a className="contact-card contact-projects" href="#projects" onClick={link("projects")}><span>Our Projects</span><h3>取り組みを知る</h3><div><span>5つの活動と、それぞれの役割</span><RoundArrow/></div></a><a className="contact-card contact-email" href={"mailto:"+contact.email}><span>Contact Us</span><h3>お問い合わせ</h3><p>{contact.email}</p><div><span>メールを作成する</span><RoundArrow up/></div></a></div></div></ScrollBook></section>
 </main>
 <footer className="footer section-shell"><div className="footer-top"><a className="brand footer-brand" href="#top" onClick={link("top")}><Brand/></a><nav aria-label="フッターナビゲーション">{navigation.map(([id,label])=><a key={id} href={"#"+id} onClick={link(id)}>{label}</a>)}</nav><div className="motion-control"><button className="motion-switch" role="switch" aria-checked={reduced} aria-label="動きを減らす" disabled={osReduced} onClick={changeMotion}><span/></button><span>動きを減らす</span>{osReduced&&<small>端末の設定に従っています</small>}</div></div><p className="footer-word" aria-hidden="true">DREADNOUGHT</p><div className="footer-bottom"><span>© 2026 ドレッドノート株式会社</span><a href="#top" onClick={link("top")}>Page Top<span className="round-arrow"><ArrowUp size={16}/></span></a></div></footer>
 </div>;
}
