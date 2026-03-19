import { useState, useReducer, useEffect, useCallback } from "react";
import api, { buildWhatsappMessage } from "./api/service";

function useProducts(category) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    setLoading(true);
    api.getProducts(category)
      .then(data => { setProducts(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [category]);
  return { products, loading };
}

function LoadingGrid({ cols = 4 }) {
  return (
    <div style={{textAlign:'center',padding:'40px 20px'}}>
      <div style={{fontSize:'2rem',marginBottom:12}}>⏳</div>
      <div style={{fontSize:'.85rem',color:'#7A9AA8',marginBottom:24}}>Loading products... (first load may take ~30 seconds)</div>
      <div style={{display:"grid",gridTemplateColumns:`repeat(${cols},1fr)`,gap:16}}>
        {Array(cols * 2).fill(0).map((_,i) => (
          <div key={i} style={{background:"#E2EAEE",borderRadius:10,aspectRatio:"4/5",animation:'pulse 1.5s ease-in-out infinite'}}/>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   DESIGN TOKENS
   Palette: Light Blue #C3E7F1 · Moonstone #519CAB
            Saffron #FFC64F · Gunmetal #20373B
   + Delicio chocolate browns for choc section
═══════════════════════════════════════════════════════ */
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;0,900;1,400;1,600&family=DM+Sans:wght@300;400;500;600&family=Cinzel:wght@600;700&display=swap');

*,*::before,*::after{margin:0;padding:0;box-sizing:border-box;}
html{scroll-behavior:smooth;-webkit-text-size-adjust:100%;}
body{font-family:'DM Sans',sans-serif;background:#fff;color:#1E2E36;overflow-x:hidden;-webkit-font-smoothing:antialiased;}
img{display:block;max-width:100%;height:auto;}
button{cursor:pointer;font-family:inherit;border:none;}
a{text-decoration:none;color:inherit;}
ul{list-style:none;}
input,select{font-family:inherit;}
::-webkit-scrollbar{width:5px;}
::-webkit-scrollbar-track{background:#f0f6f8;}
::-webkit-scrollbar-thumb{background:#519CAB;border-radius:5px;}

:root{
  --lb:#C3E7F1;--ms:#519CAB;--sf:#FFC64F;--gm:#20373B;--gmd:#162729;--gml:#2E4D52;
  --chbg:#3B1F0E;--chm:#5C2D0D;--chw:#7B3F00;--chc:#FBF5EE;
  --w:#fff;--off:#F6FAFB;--g50:#F0F5F7;--g100:#E2EAEE;--g200:#C8D5DC;
  --g400:#7A9AA8;--g600:#3E5C68;--g800:#1E2E36;
  --fd:'Playfair Display',serif;--fb:'DM Sans',sans-serif;--fa:'Cinzel',serif;
  --nav:68px;--ease:cubic-bezier(.25,.46,.45,.94);--spring:cubic-bezier(.34,1.56,.64,1);
  --r:10px;--shadow:0 4px 20px rgba(32,55,59,.1);--shad-h:0 14px 48px rgba(32,55,59,.2);
}

/* ── NAV ── */
.nav{position:fixed;top:0;left:0;right:0;z-index:900;height:var(--nav);background:var(--gm);transition:height .3s,box-shadow .3s;}
.nav.scrolled{height:58px;box-shadow:0 3px 20px rgba(0,0,0,.3);}
.nav-c{max-width:1440px;margin:0 auto;height:100%;padding:0 clamp(14px,3vw,40px);display:flex;align-items:center;gap:clamp(6px,1.5vw,20px);}
.logo{display:flex;align-items:center;gap:10px;flex-shrink:0;cursor:pointer;}
.logo-b{width:40px;height:40px;border-radius:50%;background:linear-gradient(135deg,var(--sf),#E6A832);display:flex;align-items:center;justify-content:center;box-shadow:0 3px 12px rgba(255,198,79,.4);flex-shrink:0;}
.logo-b span{font-family:var(--fa);font-size:.88rem;font-weight:700;color:var(--gmd);}
.logo-t{display:flex;flex-direction:column;line-height:1.1;}
.logo-n{font-family:var(--fa);font-size:clamp(.5rem,.75vw,.7rem);letter-spacing:.2em;color:var(--sf);text-transform:uppercase;white-space:nowrap;}
.logo-s{font-family:var(--fd);font-style:italic;font-size:clamp(.44rem,.55vw,.56rem);color:rgba(195,231,241,.65);letter-spacing:.08em;}
.nav-links{display:flex;align-items:center;gap:0;margin-left:auto;}
.nl{font-size:clamp(.58rem,.6vw,.68rem);font-weight:500;letter-spacing:.1em;text-transform:uppercase;color:rgba(195,231,241,.72);padding:7px clamp(7px,.85vw,13px);border-radius:4px;background:none;transition:all .2s;white-space:nowrap;}
.nl:hover,.nl.act{color:var(--lb);background:rgba(195,231,241,.08);}
.nl.act{color:var(--sf);}
.nav-r{display:flex;align-items:center;gap:8px;flex-shrink:0;}
.cart-btn{position:relative;width:40px;height:40px;background:rgba(195,231,241,.1);border:1px solid rgba(195,231,241,.2);border-radius:8px;color:var(--lb);display:flex;align-items:center;justify-content:center;transition:all .2s;flex-shrink:0;}
.cart-btn:hover{background:rgba(195,231,241,.22);color:#fff;}
.cart-pill{position:absolute;top:-6px;right:-6px;min-width:19px;height:19px;padding:0 4px;background:var(--sf);color:var(--gmd);border-radius:30px;font-size:.58rem;font-weight:700;display:flex;align-items:center;justify-content:center;border:2px solid var(--gm);}
.wa-nav{display:flex;align-items:center;gap:6px;background:#25D366;color:#fff;padding:8px 13px;border-radius:6px;font-size:.64rem;font-weight:700;letter-spacing:.06em;transition:all .22s;box-shadow:0 3px 10px rgba(37,211,102,.3);white-space:nowrap;}
.wa-nav:hover{background:#1ebe5d;transform:translateY(-1px);}
.wa-nav-t{display:none;}
@media(min-width:1100px){.wa-nav-t{display:inline;}}

/* Hamburger */
.hbg{display:none;flex-direction:column;gap:5px;padding:8px;background:none;border:none;}
.hbg span{display:block;width:22px;height:2px;background:var(--lb);border-radius:2px;transition:all .28s var(--ease);transform-origin:center;}
.hbg.open span:nth-child(1){transform:translateY(7px) rotate(45deg);}
.hbg.open span:nth-child(2){opacity:0;transform:scaleX(0);}
.hbg.open span:nth-child(3){transform:translateY(-7px) rotate(-45deg);}

/* Mobile menu */
.mob-menu{display:none;flex-direction:column;background:var(--gmd);border-top:1px solid rgba(195,231,241,.1);max-height:0;overflow:hidden;transition:max-height .35s var(--ease);}
.mob-menu.open{max-height:380px;}
.mob-link{padding:14px clamp(14px,4vw,28px);color:rgba(195,231,241,.8);font-size:.88rem;font-weight:500;border-bottom:1px solid rgba(195,231,241,.06);background:none;text-align:left;transition:all .2s;}
.mob-link:hover,.mob-link.act{color:var(--sf);background:rgba(255,198,79,.06);}
.mob-cart-btn{margin:12px 14px 16px;background:var(--sf);color:var(--gmd);padding:11px;border-radius:6px;font-size:.78rem;font-weight:700;letter-spacing:.1em;text-transform:uppercase;}

/* Mobile bottom bar */
.mob-bar{display:none;position:fixed;bottom:0;left:0;right:0;z-index:800;height:58px;background:var(--gmd);border-top:1px solid rgba(195,231,241,.1);padding-bottom:env(safe-area-inset-bottom);}
.mob-bar-inner{display:flex;height:58px;}
.mbt{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:2px;color:rgba(195,231,241,.45);font-size:.44rem;font-weight:700;letter-spacing:.1em;text-transform:uppercase;background:none;padding:4px 0;transition:color .2s;position:relative;}
.mbt-ico{font-size:1.1rem;line-height:1;position:relative;}
.mbt.act,.mbt:hover{color:var(--sf);}
.mbt-badge{position:absolute;top:-3px;right:-8px;background:var(--sf);color:var(--gmd);border-radius:50%;width:14px;height:14px;font-size:.46rem;font-weight:700;display:flex;align-items:center;justify-content:center;}

@media(max-width:900px){
  .nav-links{display:none;}
  .hbg{display:flex;}
  .mob-menu{display:flex;}
  .mob-bar{display:block;}
  .logo-s{display:none;}
}
@media(max-width:480px){.wa-nav{display:none;}}

/* ── PAGES ── */
.page{padding-top:var(--nav);}
@media(max-width:900px){.page{padding-bottom:58px;}}

/* ── SECTION UTILS ── */
.container{max-width:1440px;margin:0 auto;padding:0 clamp(14px,3vw,40px);}
.sec-py{padding:clamp(48px,7vw,88px) 0;}

/* ── HERO (Delicio style) ── */
.hero{position:relative;overflow:hidden;height:clamp(360px,58vh,640px);display:flex;align-items:center;justify-content:center;}
.hero-bg{position:absolute;inset:0;background:url('https://images.unsplash.com/photo-1511381939415-e44015466834?w=1800&q=80') center/cover no-repeat;filter:brightness(.55) saturate(.75);}
.hero-ov{position:absolute;inset:0;background:linear-gradient(180deg,rgba(59,31,14,.4) 0%,rgba(32,55,59,.75) 100%);}
.hero-cnt{position:relative;z-index:2;text-align:center;padding:0 16px;}
.hero-eye{font-size:.6rem;letter-spacing:.34em;text-transform:uppercase;color:rgba(195,231,241,.7);display:flex;align-items:center;justify-content:center;gap:10px;margin-bottom:14px;}
.hero-eye::before,.hero-eye::after{content:'';width:26px;height:1px;background:var(--lb);opacity:.5;}
.hero-h1{font-family:var(--fd);font-style:italic;font-size:clamp(2.2rem,7vw,5rem);font-weight:400;color:#fff;line-height:1.1;text-shadow:0 2px 24px rgba(0,0,0,.4);}
.hero-p{font-size:clamp(.78rem,1.2vw,.95rem);color:rgba(251,245,238,.8);margin-top:12px;letter-spacing:.07em;}
.hero-btns{display:flex;flex-wrap:wrap;gap:10px;justify-content:center;margin-top:28px;}
.btn-choc{background:var(--chm);color:var(--chc);padding:13px 32px;border-radius:4px;font-size:.72rem;font-weight:700;letter-spacing:.18em;text-transform:uppercase;border:none;transition:all .25s;box-shadow:0 4px 16px rgba(92,45,13,.5);}
.btn-choc:hover{background:var(--chw);transform:translateY(-2px);}
.btn-ghost{background:transparent;color:var(--lb);padding:13px 32px;border-radius:4px;font-size:.72rem;font-weight:700;letter-spacing:.18em;text-transform:uppercase;border:1.5px solid rgba(195,231,241,.4);transition:all .25s;}
.btn-ghost:hover{background:rgba(195,231,241,.12);transform:translateY(-2px);}

/* ── FEAT STRIP ── */
.feat{background:var(--w);border-top:1px solid var(--g100);border-bottom:1px solid var(--g100);}
.feat-i{max-width:900px;margin:0 auto;display:flex;}
.feat-item{flex:1;display:flex;flex-direction:column;align-items:center;gap:8px;padding:clamp(18px,3vw,26px) 14px;border-right:1px solid var(--g100);text-align:center;}
.feat-item:last-child{border-right:none;}
.feat-ico{font-size:1.6rem;}
.feat-lbl{font-size:clamp(.52rem,.6vw,.64rem);font-weight:700;letter-spacing:.2em;text-transform:uppercase;color:var(--g400);}
@media(max-width:480px){.feat-item{padding:14px 8px;}}

/* ── SECTION HEADER ── */
.sh{text-align:center;margin-bottom:clamp(24px,3.5vw,44px);}
.sh-eye{font-size:clamp(.5rem,.58vw,.6rem);letter-spacing:.32em;text-transform:uppercase;color:var(--ms);display:flex;align-items:center;justify-content:center;gap:10px;margin-bottom:10px;}
.sh-eye::before,.sh-eye::after{content:'';width:22px;height:1px;background:var(--ms);opacity:.5;}
.sh h2{font-family:var(--fd);font-size:clamp(1.6rem,3.5vw,2.8rem);font-weight:600;color:var(--g800);}
.sh p{font-size:clamp(.7rem,.78vw,.8rem);color:var(--g400);margin-top:7px;}
.sh-line{width:48px;height:3px;background:linear-gradient(90deg,var(--ms),var(--sf));border-radius:2px;margin:12px auto 0;}

/* ── STATS ── */
.stats{background:var(--g50);border-top:1px solid var(--g100);border-bottom:1px solid var(--g100);}
.stats-i{max-width:960px;margin:0 auto;display:flex;overflow-x:auto;scrollbar-width:none;}
.stats-i::-webkit-scrollbar{display:none;}
.stat{flex:1;min-width:90px;padding:clamp(14px,2.5vw,22px) 12px;text-align:center;border-right:1px solid var(--g100);}
.stat:last-child{border-right:none;}
.stat-n{font-family:var(--fd);font-size:clamp(1.2rem,2.5vw,1.8rem);font-weight:600;color:var(--ms);}
.stat-l{font-size:clamp(.44rem,.54vw,.58rem);letter-spacing:.2em;text-transform:uppercase;color:var(--g400);margin-top:3px;}

/* ── SWEATER SECTION ── */
.sw-bg{background:var(--w);}
/* Filter bar */
.filter-bar{background:var(--w);border-bottom:1px solid var(--g100);position:sticky;top:var(--nav);z-index:80;}
.filter-i{max-width:1440px;margin:0 auto;padding:0 clamp(14px,3vw,40px);display:flex;align-items:center;gap:8px;height:48px;overflow-x:auto;scrollbar-width:none;}
.filter-i::-webkit-scrollbar{display:none;}
.fchip{display:flex;align-items:center;gap:5px;flex-shrink:0;background:var(--g50);border:1px solid var(--g100);border-radius:30px;padding:5px 13px;font-size:clamp(.56rem,.6vw,.64rem);font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:var(--g400);transition:all .2s;white-space:nowrap;}
.fchip:hover,.fchip.act{border-color:var(--gm);color:var(--gm);}
.fchip.act{background:var(--gm);color:#fff;border-color:transparent;}
.fsep{width:1px;height:24px;background:var(--g100);flex-shrink:0;margin:0 4px;}
.fsort{font-size:.6rem;letter-spacing:.1em;text-transform:uppercase;color:var(--g400);margin-left:auto;white-space:nowrap;flex-shrink:0;}

/* Product grids — responsive */
.prod-grid{display:grid;grid-template-columns:repeat(5,1fr);gap:clamp(10px,1.5vw,18px);}
@media(max-width:1280px){.prod-grid{grid-template-columns:repeat(4,1fr);}}
@media(max-width:900px){.prod-grid{grid-template-columns:repeat(3,1fr);}}
@media(max-width:600px){.prod-grid{grid-template-columns:repeat(2,1fr);gap:10px;}}

/* ── FASHION CARD (Guza) ── */
.fc{background:var(--g50);border-radius:var(--r);overflow:hidden;position:relative;transition:transform .3s var(--ease),box-shadow .3s;}
.fc:hover{transform:translateY(-5px);box-shadow:var(--shad-h);}
.fc-tag{position:absolute;top:9px;left:9px;z-index:5;font-size:.5rem;font-weight:700;letter-spacing:.14em;text-transform:uppercase;padding:3px 9px;border-radius:20px;}
.tag-best{background:var(--sf);color:var(--gmd);}
.tag-new{background:var(--ms);color:#fff;}
.tag-pre{background:var(--gm);color:var(--sf);}
.tag-cash{background:#B09ECD;color:#fff;}
.tag-pop{background:var(--sf);color:var(--gmd);}
.tag-lo{background:#E8B470;color:#fff;}
.av-tag{position:absolute;top:9px;right:9px;z-index:5;display:flex;align-items:center;gap:4px;font-size:.48rem;font-weight:700;letter-spacing:.1em;text-transform:uppercase;background:rgba(255,255,255,.92);padding:3px 8px;border-radius:20px;color:var(--g600);}
.av-dot{width:5px;height:5px;border-radius:50%;flex-shrink:0;}
.av-in{background:#5A9E6F;box-shadow:0 0 4px rgba(90,158,111,.9);}
.av-lo{background:#E8B470;box-shadow:0 0 4px rgba(232,180,112,.9);}
.av-pr{background:var(--ms);box-shadow:0 0 4px rgba(81,156,171,.9);}
.fc-img{width:100%;aspect-ratio:4/5;overflow:hidden;background:var(--g100);}
.fc-img img{width:100%;height:100%;object-fit:cover;transition:transform .5s ease;}
.fc:hover .fc-img img{transform:scale(1.04);}
.fc-info{padding:clamp(10px,1.3vw,14px);}
.fc-lbl{font-size:.52rem;letter-spacing:.18em;text-transform:uppercase;color:var(--g400);margin-bottom:3px;}
.fc-name{font-size:clamp(.78rem,.92vw,.9rem);font-weight:600;color:var(--g800);line-height:1.35;margin-bottom:4px;}
.fc-price{font-size:clamp(.82rem,.95vw,.98rem);font-weight:700;color:var(--ms);margin-bottom:8px;}
.fc-colors{display:flex;flex-wrap:wrap;gap:4px;margin-bottom:4px;}
.fc-dot{width:clamp(13px,1.4vw,17px);height:clamp(13px,1.4vw,17px);border-radius:50%;border:2px solid transparent;transition:all .15s;flex-shrink:0;position:relative;}
.fc-dot:hover{transform:scale(1.3);}
.fc-dot.sel{border-color:var(--gm);box-shadow:0 0 0 2px var(--g50),0 0 0 3.5px var(--gm);}
.fc-color-sel{font-size:.56rem;color:var(--ms);min-height:12px;margin-bottom:5px;}
.fc-sz{width:100%;background:var(--w);border:1px solid var(--g100);border-radius:6px;color:var(--g800);font-family:var(--fb);font-size:.7rem;padding:7px 28px 7px 10px;margin-bottom:8px;appearance:none;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='10' viewBox='0 0 12 12'%3E%3Cpath fill='%237A9AA8' d='M6 8L1 3h10z'/%3E%3C/svg%3E");background-repeat:no-repeat;background-position:right 9px center;transition:border-color .2s;cursor:pointer;}
.fc-sz:focus{outline:none;border-color:var(--ms);}
.fc-bot{display:flex;align-items:center;gap:5px;}
.qty-row{display:flex;align-items:center;gap:4px;}
.qb{width:26px;height:26px;background:var(--g100);border:1px solid var(--g200);border-radius:5px;color:var(--g600);font-size:.9rem;font-weight:700;display:flex;align-items:center;justify-content:center;transition:all .18s;}
.qb:hover{background:var(--ms);color:#fff;border-color:transparent;}
.qn{width:30px;text-align:center;background:var(--g100);border:1px solid var(--g200);border-radius:5px;color:var(--g800);font-size:.78rem;font-weight:700;padding:2px 0;}
.qn::-webkit-inner-spin-button{display:none;}
.fc-add{flex:1;background:var(--gm);color:#fff;border:none;border-radius:5px;padding:8px 4px;font-size:.56rem;font-weight:700;letter-spacing:.1em;text-transform:uppercase;transition:all .22s;overflow:hidden;white-space:nowrap;}
.fc-add:hover{background:var(--ms);}
.fc-add.ok{background:#5A9E6F!important;}

/* ── CHOCOLATE SECTION (Delicio dark) ── */
.choc-sec{background:#F9F5F0;}
.choc-hdr{text-align:center;padding:clamp(36px,5.5vw,64px) 14px clamp(8px,1.5vw,16px);}
.choc-hdr-eye{font-size:.58rem;letter-spacing:.32em;text-transform:uppercase;color:#A09880;margin-bottom:8px;}
.choc-hdr h2{font-family:var(--fd);font-style:italic;font-size:clamp(1.7rem,4vw,3.2rem);color:#2A1206;}
.choc-hdr p{color:#A09880;font-size:clamp(.68rem,.76vw,.78rem);margin-top:8px;letter-spacing:.06em;}
.choc-wrap{max-width:1300px;margin:0 auto;padding:clamp(20px,3vw,40px) clamp(14px,2.5vw,32px) clamp(36px,5vw,64px);}
.choc-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:clamp(12px,1.8vw,22px);}
@media(max-width:900px){.choc-grid{grid-template-columns:repeat(2,1fr);}}
@media(max-width:400px){.choc-grid{grid-template-columns:repeat(2,1fr);gap:9px;}}

/* Chocolate card */
.cc{background:var(--w);border-radius:4px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,.08);transition:transform .28s var(--ease),box-shadow .28s;}
.cc:hover{transform:translateY(-7px);box-shadow:0 10px 32px rgba(0,0,0,.14);}
.cc-img{width:100%;aspect-ratio:1;overflow:hidden;position:relative;}
.cc-img img{width:100%;height:100%;object-fit:cover;transition:transform .4s ease;display:block;}
.cc:hover .cc-img img{transform:scale(1.06);}
.cc-fb{position:absolute;inset:0;background:linear-gradient(135deg,#3B1F0E,#7B3F00);display:none;align-items:center;justify-content:center;font-size:3.2rem;}
.cc-info{padding:11px 12px 7px;}
.cc-name{font-size:clamp(.64rem,.74vw,.78rem);font-weight:700;letter-spacing:.11em;text-transform:uppercase;color:#2A1206;line-height:1.3;}
.cc-price{font-family:var(--fd);font-size:clamp(.95rem,1.4vw,1.15rem);font-weight:600;color:#C87941;margin-top:4px;}
.cc-acts{padding:0 12px 12px;display:flex;align-items:center;gap:7px;}
.cc-qty{display:flex;align-items:center;gap:4px;}
.ccqb{width:26px;height:26px;background:#F5F2EC;border:1px solid #DEDAD4;border-radius:4px;color:#5E5A54;font-size:.9rem;font-weight:700;display:flex;align-items:center;justify-content:center;transition:all .18s;}
.ccqb:hover{background:#2A1206;color:#fff;border-color:transparent;}
.cc-qty span{width:26px;text-align:center;font-size:.8rem;font-weight:700;color:#2A1206;}
.cc-add{flex:1;background:#2A1206;color:#fff;border:none;border-radius:4px;padding:7px 0;font-size:.6rem;font-weight:700;letter-spacing:.12em;text-transform:uppercase;transition:all .22s;}
.cc-add:hover{background:#519CAB;}
.cc-add.ok{background:#5A9E6F!important;}

/* Choc "see all" link */
.choc-more{text-align:center;margin-top:clamp(20px,3vw,32px);}
.choc-more button{background:transparent;border:1px solid rgba(42,18,6,.2);color:#3E3A34;padding:12px 32px;border-radius:4px;font-size:.68rem;font-weight:700;letter-spacing:.18em;text-transform:uppercase;transition:all .22s;}
.choc-more button:hover{background:rgba(42,18,6,.06);}

/* ── CAPS SECTION ── */
.cap-sec{background:var(--g50);}
.cap-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:clamp(12px,1.8vw,22px);}
@media(max-width:900px){.cap-grid{grid-template-columns:repeat(2,1fr);}}
@media(max-width:480px){.cap-grid{grid-template-columns:repeat(2,1fr);gap:9px;}}

/* ── SHAWL SECTION ── */
.shawl-sec{background:linear-gradient(135deg,#F0F7F9 0%,#E8F4F7 50%,#F5EEE8 100%);}
.shawl-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:clamp(16px,2vw,28px);}
@media(max-width:900px){.shawl-grid{grid-template-columns:repeat(2,1fr);}}
@media(max-width:480px){.shawl-grid{grid-template-columns:1fr 1fr;gap:12px;}}

/* Shawl card */
.shc{background:var(--w);border-radius:var(--r);overflow:hidden;position:relative;box-shadow:var(--shadow);transition:transform .3s,box-shadow .3s;}
.shc:hover{transform:translateY(-5px);box-shadow:var(--shad-h);}
.shc-tag{position:absolute;top:12px;left:12px;z-index:5;font-size:.5rem;font-weight:700;letter-spacing:.12em;text-transform:uppercase;padding:4px 10px;border-radius:20px;background:rgba(81,156,171,.9);color:#fff;}
.shc-img{width:100%;aspect-ratio:3/4;overflow:hidden;position:relative;}
.shc-img img{width:100%;height:100%;object-fit:cover;transition:transform .5s;}
.shc:hover .shc-img img{transform:scale(1.06);}
.shc-ov{position:absolute;inset:0;background:linear-gradient(to bottom,transparent 55%,rgba(0,0,0,.32));}
.shc-info{padding:16px;}
.shc-name{font-family:var(--fd);font-size:clamp(.88rem,1.1vw,1.05rem);font-weight:600;color:var(--g800);}
.shc-price{font-size:clamp(.88rem,1vw,.98rem);font-weight:700;color:var(--ms);margin:6px 0 10px;}
.shc-dots{display:flex;gap:5px;margin-bottom:12px;}
.s-dot{width:17px;height:17px;border-radius:50%;border:2px solid transparent;transition:all .15s;}
.s-dot:hover{transform:scale(1.3);}
.s-dot.sel{border-color:var(--ms);box-shadow:0 0 0 2px var(--w),0 0 0 3.5px var(--ms);}
.shc-add{width:100%;background:transparent;color:var(--ms);border:1.5px solid var(--ms);border-radius:6px;padding:9px;font-size:.64rem;font-weight:700;letter-spacing:.14em;text-transform:uppercase;transition:all .22s;}
.shc-add:hover{background:var(--ms);color:#fff;}
.shc-add.ok{background:#5A9E6F!important;border-color:#5A9E6F!important;color:#fff!important;}

/* ── PERFUME & TEA SECTION ── */
.perf-sec{background:var(--gm);}
.perf-sh .sh-eye{color:rgba(195,231,241,.55);}
.perf-sh .sh-eye::before,.perf-sh .sh-eye::after{background:var(--lb);}
.perf-sh h2{color:var(--lb);}
.perf-sh p{color:rgba(195,231,241,.55);}
.perf-sh .sh-line{background:linear-gradient(90deg,var(--lb),var(--sf));}
.perf-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:clamp(14px,1.8vw,22px);}
@media(max-width:900px){.perf-grid{grid-template-columns:repeat(2,1fr);}}
@media(max-width:480px){.perf-grid{grid-template-columns:1fr 1fr;gap:10px;}}

/* Luxury card */
.lc{background:var(--gml);border:1px solid rgba(195,231,241,.1);border-radius:var(--r);overflow:hidden;position:relative;transition:transform .3s var(--ease),box-shadow .3s;}
.lc:hover{transform:translateY(-6px);box-shadow:0 16px 48px rgba(0,0,0,.5);}
.lc-tag{position:absolute;top:12px;right:12px;z-index:5;font-size:.5rem;font-weight:700;letter-spacing:.12em;text-transform:uppercase;padding:4px 10px;border-radius:20px;background:var(--gm);color:var(--sf);}
.lc-img{width:100%;aspect-ratio:3/4;overflow:hidden;background:var(--gmd);}
.lc-img img{width:100%;height:100%;object-fit:cover;transition:transform .5s;}
.lc:hover .lc-img img{transform:scale(1.05);}
.lc-info{padding:16px;}
.lc-name{font-family:var(--fd);font-size:clamp(.85rem,1vw,.98rem);font-weight:600;color:var(--lb);}
.lc-notes{font-size:.62rem;color:rgba(195,231,241,.55);margin-top:4px;letter-spacing:.07em;font-style:italic;}
.lc-vol{display:inline-block;margin-top:6px;font-size:.58rem;font-weight:700;letter-spacing:.12em;text-transform:uppercase;padding:3px 8px;border-radius:20px;background:rgba(195,231,241,.1);color:var(--lb);}
.lc-price{font-family:var(--fd);font-size:clamp(1rem,1.3vw,1.15rem);font-weight:600;color:var(--sf);margin:10px 0 12px;}
.lc-add{width:100%;background:var(--gm);color:var(--sf);border:none;border-radius:6px;padding:10px;font-size:.64rem;font-weight:700;letter-spacing:.14em;text-transform:uppercase;transition:all .22s;}
.lc-add:hover{background:rgba(195,231,241,.15);color:var(--lb);}
.lc-add.ok{background:#5A9E6F!important;color:#fff!important;}

/* Tea cards (same but slightly different) */
.tc{background:var(--w);border-radius:var(--r);overflow:hidden;position:relative;box-shadow:var(--shadow);transition:transform .3s,box-shadow .3s;}
.tc:hover{transform:translateY(-6px);box-shadow:var(--shad-h);}
.tc-tag{position:absolute;top:12px;left:12px;z-index:5;font-size:.5rem;font-weight:700;letter-spacing:.12em;text-transform:uppercase;padding:4px 10px;border-radius:20px;background:var(--gm);color:var(--sf);}
.tc-img{width:100%;aspect-ratio:3/4;overflow:hidden;background:var(--g100);}
.tc-img img{width:100%;height:100%;object-fit:cover;transition:transform .5s;}
.tc:hover .tc-img img{transform:scale(1.05);}
.tc-info{padding:16px;}
.tc-name{font-family:var(--fd);font-size:clamp(.85rem,1vw,.98rem);font-weight:600;color:var(--g800);}
.tc-type{display:inline-block;margin-top:5px;font-size:.58rem;font-weight:700;letter-spacing:.12em;text-transform:uppercase;padding:3px 8px;border-radius:20px;background:var(--g100);color:var(--g600);}
.tc-price{font-size:clamp(.95rem,1.1vw,1.1rem);font-weight:700;color:var(--gm);margin:10px 0 12px;}
.tc-add{width:100%;background:var(--gm);color:#fff;border:none;border-radius:6px;padding:10px;font-size:.64rem;font-weight:700;letter-spacing:.14em;text-transform:uppercase;transition:all .22s;}
.tc-add:hover{background:var(--gml);}
.tc-add.ok{background:#5A9E6F!important;}

/* ── LOCATION ── */
.loc-sec{background:var(--w);border-top:1px solid var(--g100);border-bottom:1px solid var(--g100);}
.loc-inner{max-width:700px;margin:0 auto;text-align:center;padding:clamp(36px,6vw,64px) 14px;}
.loc-eye{font-size:.58rem;letter-spacing:.32em;text-transform:uppercase;color:var(--ms);display:flex;align-items:center;justify-content:center;gap:10px;margin-bottom:12px;}
.loc-eye::before,.loc-eye::after{content:'';width:22px;height:1px;background:var(--ms);opacity:.5;}
.loc-h3{font-family:var(--fd);font-style:italic;font-size:clamp(1.2rem,2.8vw,1.9rem);color:var(--g800);}
.loc-p{color:var(--g400);font-size:clamp(.7rem,.78vw,.8rem);margin-top:8px;line-height:2.1;}
.map-link{display:inline-flex;align-items:center;gap:6px;margin-top:16px;color:var(--ms);font-size:.64rem;font-weight:700;letter-spacing:.14em;text-transform:uppercase;padding:9px 20px;border:1px solid rgba(81,156,171,.3);border-radius:30px;transition:all .22s;}
.map-link:hover{background:rgba(81,156,171,.08);}

/* ── HOME CATEGORY CARDS ── */
.cat-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:clamp(12px,2vw,20px);}
@media(max-width:900px){.cat-grid{grid-template-columns:repeat(2,1fr);}}
@media(max-width:480px){.cat-grid{grid-template-columns:1fr;}}
.cat-wide{grid-column:span 2;}
@media(max-width:900px){.cat-wide{grid-column:span 1;}}
.cat-card{background:var(--w);border:1px solid var(--g100);border-radius:clamp(10px,1.2vw,16px);overflow:hidden;cursor:pointer;transition:all .28s var(--ease);}
.cat-card:hover{border-color:var(--ms);transform:translateY(-5px);box-shadow:var(--shad-h);}
.cat-ph{height:clamp(120px,15vw,180px);overflow:hidden;position:relative;}
.cat-ph img{width:100%;height:100%;object-fit:cover;transition:transform .45s ease;}
.cat-card:hover .cat-ph img{transform:scale(1.06);}
.cat-ph-ov{position:absolute;inset:0;background:linear-gradient(to bottom,transparent 30%,rgba(0,0,0,.42));}
.cat-bd{padding:clamp(12px,1.8vw,18px) clamp(14px,2vw,20px) clamp(14px,2vw,20px);}
.cat-bd h3{font-family:var(--fd);font-size:clamp(.92rem,1.5vw,1.2rem);color:var(--g800);}
.cat-bd p{font-size:clamp(.62rem,.7vw,.74rem);color:var(--g400);margin-top:4px;}
.cat-cta{display:inline-flex;align-items:center;gap:6px;margin-top:11px;color:var(--ms);font-size:clamp(.58rem,.62vw,.65rem);font-weight:700;letter-spacing:.14em;text-transform:uppercase;transition:gap .18s;}
.cat-card:hover .cat-cta{gap:11px;}

/* ── FOOTER ── */
.footer{background:var(--gmd);}
.footer-top{border-bottom:1px solid rgba(195,231,241,.08);padding:clamp(40px,6vw,72px) 0 clamp(32px,5vw,56px);}
.footer-grid{display:grid;grid-template-columns:2fr 1fr 1fr 1.4fr;gap:clamp(24px,3vw,48px);}
@media(max-width:900px){.footer-grid{grid-template-columns:1fr 1fr;}}
@media(max-width:600px){.footer-grid{grid-template-columns:1fr;}}
.foot-logo{display:flex;align-items:center;gap:10px;margin-bottom:14px;}
.foot-b{width:38px;height:38px;border-radius:50%;background:linear-gradient(135deg,var(--sf),#E6A832);display:flex;align-items:center;justify-content:center;flex-shrink:0;}
.foot-b span{font-family:var(--fa);font-size:.85rem;font-weight:700;color:var(--gmd);}
.foot-name{font-family:var(--fa);font-size:.68rem;letter-spacing:.18em;color:var(--sf);text-transform:uppercase;}
.foot-tag{font-family:var(--fd);font-style:italic;font-size:.54rem;color:rgba(195,231,241,.5);}
.foot-desc{font-size:.72rem;color:rgba(195,231,241,.55);line-height:1.85;margin-bottom:16px;max-width:280px;}
.foot-wa{display:inline-flex;align-items:center;gap:7px;background:#25D366;color:#fff;padding:8px 16px;border-radius:6px;font-size:.66rem;font-weight:700;transition:all .22s;}
.foot-wa:hover{background:#1ebe5d;}
.footer-col h4{font-size:.6rem;letter-spacing:.22em;text-transform:uppercase;color:var(--lb);margin-bottom:14px;}
.footer-col li{margin-bottom:8px;}
.footer-col a,.footer-col p{font-size:.72rem;color:rgba(195,231,241,.55);transition:color .2s;display:block;}
.footer-col a:hover{color:var(--lb);}
.footer-col address{font-style:normal;}
.footer-maps{display:inline-flex;align-items:center;gap:5px;margin-top:12px;color:var(--ms);font-size:.64rem;font-weight:700;letter-spacing:.1em;text-transform:uppercase;padding:7px 14px;border:1px solid rgba(81,156,171,.3);border-radius:30px;transition:all .22s;}
.footer-maps:hover{background:rgba(81,156,171,.1);}
.footer-bottom{padding:clamp(14px,2.5vw,20px) 0;}
.footer-bot-i{display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:8px;}
.footer-bot-i span{font-size:.62rem;color:rgba(195,231,241,.4);letter-spacing:.05em;}
.footer-credit{color:var(--sf)!important;}

/* ── CART PANEL ── */
.cart-bk{display:none;position:fixed;inset:0;background:rgba(32,55,59,.6);z-index:1800;backdrop-filter:blur(4px);opacity:0;transition:opacity .3s;}
.cart-bk.open{display:block;opacity:1;}
.cart-pn{position:fixed;top:0;right:0;bottom:0;width:min(420px,100vw);z-index:1900;background:var(--w);display:flex;flex-direction:column;box-shadow:-8px 0 48px rgba(0,0,0,.2);transform:translateX(100%);transition:transform .38s var(--ease);}
.cart-pn.open{transform:translateX(0);}
.cart-hd{padding:20px 18px;background:var(--gm);display:flex;align-items:center;justify-content:space-between;}
.cart-hd h3{font-family:var(--fd);font-size:1.25rem;font-weight:600;color:#fff;}
.cart-hd p{font-size:.6rem;color:var(--lb);margin-top:2px;letter-spacing:.06em;}
.cart-x{width:34px;height:34px;background:rgba(195,231,241,.12);border:1px solid rgba(195,231,241,.2);border-radius:50%;color:var(--lb);font-size:.82rem;display:flex;align-items:center;justify-content:center;transition:all .18s;}
.cart-x:hover{color:#fff;background:rgba(195,231,241,.25);}
.cart-body{flex:1;overflow-y:auto;padding:14px;display:flex;flex-direction:column;gap:11px;}
.cart-body::-webkit-scrollbar{width:3px;}
.cart-body::-webkit-scrollbar-thumb{background:var(--g200);}
.cart-empty{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:8px;padding:60px 20px;color:var(--g400);text-align:center;}
.cart-empty-ico{font-size:3rem;opacity:.3;}
.cart-empty p{font-size:.9rem;font-weight:600;color:var(--g600);}
.cart-empty small{font-size:.72rem;}
.ci{display:flex;gap:11px;background:var(--g50);border:1px solid var(--g100);border-radius:10px;padding:11px;}
.ci-ico{width:50px;height:50px;border-radius:7px;overflow:hidden;background:var(--g100);flex-shrink:0;display:flex;align-items:center;justify-content:center;font-size:1.5rem;}
.ci-ico img{width:100%;height:100%;object-fit:cover;}
.ci-info{flex:1;min-width:0;}
.ci-name{font-size:.86rem;font-weight:600;color:var(--g800);display:block;line-height:1.3;}
.ci-meta{font-size:.62rem;color:var(--g400);margin-top:3px;display:flex;align-items:center;gap:4px;flex-wrap:wrap;}
.ci-cdot{width:8px;height:8px;border-radius:50%;border:1px solid rgba(0,0,0,.12);flex-shrink:0;}
.ci-btm{display:flex;align-items:center;gap:7px;margin-top:8px;}
.ci-qty button{width:24px;height:24px;background:var(--g100);border:1px solid var(--g200);border-radius:4px;color:var(--g600);font-size:.9rem;font-weight:700;display:flex;align-items:center;justify-content:center;transition:all .18s;}
.ci-qty button:hover{background:var(--ms);color:#fff;border-color:transparent;}
.ci-qty span{font-size:.82rem;font-weight:700;color:var(--g800);min-width:20px;text-align:center;}
.ci-price{font-size:.88rem;font-weight:700;color:var(--ms);margin-left:auto;}
.ci-del{background:none;color:var(--g400);font-size:.82rem;padding:2px;transition:color .18s;}
.ci-del:hover{color:#c0392b;}
.cart-ft{padding:16px 18px;background:var(--g50);border-top:1px solid var(--g100);}
.cart-div{height:2px;background:linear-gradient(90deg,transparent,var(--ms),transparent);opacity:.4;margin-bottom:13px;}
.cart-total{display:flex;justify-content:space-between;align-items:center;margin-bottom:13px;}
.ct-lbl{font-size:.62rem;letter-spacing:.18em;text-transform:uppercase;color:var(--g400);}
.ct-val{font-family:var(--fd);font-size:1.6rem;font-weight:600;color:var(--gm);}
.wa-order{width:100%;background:linear-gradient(135deg,#25D366,#1ebe5d);color:#fff;border:none;border-radius:8px;padding:14px;font-family:var(--fb);font-size:.7rem;font-weight:700;letter-spacing:.14em;text-transform:uppercase;display:flex;align-items:center;justify-content:center;gap:8px;box-shadow:0 4px 16px rgba(37,211,102,.3);transition:all .25s;}
.wa-order:hover{transform:translateY(-1px);box-shadow:0 7px 24px rgba(37,211,102,.45);}
.cart-note{font-size:.56rem;color:var(--g400);text-align:center;margin-top:7px;letter-spacing:.06em;}

/* ── TOAST ── */
.toast{position:fixed;bottom:clamp(70px,11vw,30px);left:50%;transform:translateX(-50%) translateY(16px);background:var(--gm);color:#fff;padding:10px 22px;border-radius:30px;font-size:.72rem;letter-spacing:.06em;opacity:0;pointer-events:none;z-index:9999;transition:all .3s;white-space:nowrap;box-shadow:0 6px 24px rgba(0,0,0,.35);}
.toast.on{opacity:1;transform:translateX(-50%) translateY(0);}
@media(max-width:900px){.toast{bottom:calc(58px + 12px + env(safe-area-inset-bottom,0px));}}

/* ── ANIMATIONS ── */
@keyframes fup{from{opacity:0;transform:translateY(20px);}to{opacity:1;transform:translateY(0);}}
.a1{animation:fup .6s ease both;}
.a2{animation:fup .6s .12s ease both;}
.a3{animation:fup .6s .24s ease both;}
.a4{animation:fup .6s .36s ease both;}
`;

/* ═══════════════════════════════════════════════════════
   DATA
═══════════════════════════════════════════════════════ */
const COLORS = {
  'Ivory White':'#F5F0E8','Jet Black':'#1A1A1A','Wine Red':'#7B1D1D',
  'Navy Blue':'#1A237E','Charcoal':'#374151','Dusty Rose':'#D4A0A0',
  'Forest Green':'#2D6A4F','Camel Tan':'#C4A882','Slate Gray':'#5C6B7A',
  'Burgundy':'#800020','Cobalt':'#0047AB','Mauve':'#9C7B8C',
  'Mustard':'#D4A017','Olive':'#808000','Teal':'#008080',
  'Blush':'#F4C2C2','Midnight':'#0D0D2B','Cream':'#FAEBD7','Rust':'#B7410E',
};


/* ═══════════════════════════════════════════════════════
   CART CONTEXT (useReducer)
═══════════════════════════════════════════════════════ */
const cartReducer = (s, a) => {
  switch (a.type) {
    case 'ADD': {
      const key = `${a.p.id}|${a.color||''}|${a.size||''}`;
      const ex = s.find(i => i.key === key);
      if (ex) return s.map(i => i.key === key ? {...i, qty: i.qty + a.qty} : i);
      return [...s, {key, p: a.p, color: a.color, size: a.size, qty: a.qty}];
    }
    case 'DEL': return s.filter(i => i.key !== a.key);
    case 'QTY': return s.map(i => i.key === a.key ? {...i, qty: Math.max(1, a.qty)} : i);
    case 'LOAD': return a.data;
    case 'CLEAR': return [];
    default: return s;
  }
};

/* ═══════════════════════════════════════════════════════
   HOOKS
═══════════════════════════════════════════════════════ */
function useToast() {
  const [msg, setMsg] = useState('');
  const [on, setOn] = useState(false);
  const show = useCallback((m) => {
    setMsg(m); setOn(true);
    setTimeout(() => setOn(false), 2600);
  }, []);
  return {msg, on, show};
}

/* ═══════════════════════════════════════════════════════
   SMALL COMPONENTS
═══════════════════════════════════════════════════════ */

// SVG icons
const CartIcon = () => (
  <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
    <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
    <line x1="3" y1="6" x2="21" y2="6"/>
    <path d="M16 10a4 4 0 01-8 0"/>
  </svg>
);
const WaIcon = () => (
  <svg width="15" height="15" fill="currentColor" viewBox="0 0 24 24">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
);

/* Qty stepper */
function QtyRow({qty, setQty}) {
  return (
    <div className="qty-row">
      <button className="qb" onClick={() => setQty(q => Math.max(1,q-1))}>−</button>
      <input className="qn" type="number" value={qty} min={1} max={99}
        onChange={e => setQty(Math.max(1, Math.min(99, +e.target.value||1)))}/>
      <button className="qb" onClick={() => setQty(q => Math.min(99,q+1))}>+</button>
    </div>
  );
}

/* Section header */
function SH({eye, h2, p, dark=false}) {
  return (
    <div className={`sh${dark?' perf-sh':''}`}>
      <div className="sh-eye">{eye}</div>
      <h2>{h2}</h2>
      {p && <p>{p}</p>}
      <div className="sh-line"/>
    </div>
  );
}

/* ── FASHION CARD (Guza/sweater) ── */
function FashionCard({prod, onAdd}) {
  const [color, setColor] = useState('');
  const [size, setSize]   = useState('');
  const [qty, setQty]     = useState(1);
  const [ok, setOk]       = useState(false);
  const tagMap = {Bestseller:'best',New:'new','Pre-Order':'pre',Cashmere:'cash',Popular:'pop','Low Stock':'lo'};
  const outOfStock = prod.availability === 'out';

  const add = () => {
    if(outOfStock) return;
    if(outOfStock) return;
    if(prod.colors?.length && !color) { alert('Please select a colour'); return; }
    if(prod.sizes?.length > 1 && !size) { alert('Please select a size'); return; }
    onAdd(prod, color, size||prod.sizes?.[0]||'', qty);
    setOk(true); setTimeout(()=>setOk(false),1800);
  };
  return (
    <div className="fc">
      {prod.tag && <span className={`fc-tag tag-${tagMap[prod.tag]||'new'}`}>{prod.tag}</span>}
      <div className="av-tag">
        <span className={`av-dot av-${prod.availability}`}/>
        {prod.availability==='in'?'In Stock':prod.availability==='lo'?'Low Stock':'Out of Stock'}
      </div>
      <div className="fc-img">
        <img src={prod.img} alt={prod.name} loading="lazy"
          onError={e=>{e.target.style.display='none';}}/>
      </div>
      <div className="fc-info">
        <div className="fc-lbl">{prod.label}</div>
        <div className="fc-name">{prod.name}</div>
        <div className="fc-price">₹{prod.price.toLocaleString()}</div>
        {prod.colors?.length > 0 && (
          <>
            <div className="fc-colors">
              {prod.colors.map(c=>(
                <button key={c} className={`fc-dot${color===c?' sel':''}`}
                  style={{background:COLORS[c]||'#888'}}
                  onClick={()=>setColor(c)} title={c}/>
              ))}
            </div>
            <div className="fc-color-sel">{color?`● ${color}`:''}</div>
          </>
        )}
        {prod.sizes?.length > 1 && (
          <select className="fc-sz" value={size} onChange={e=>setSize(e.target.value)}>
            <option value="">Select Size</option>
            {prod.sizes.map(s=><option key={s}>{s}</option>)}
          </select>
        )}
        <div className="fc-bot">
          <QtyRow qty={qty} setQty={setQty}/>
          <button className={`fc-add${ok?' ok':outOfStock?' out':''}`} onClick={add} disabled={outOfStock} style={outOfStock?{background:'#aaa',cursor:'not-allowed'}:{}}>
            <span>{ok?'✓ Added!':outOfStock?'Out of Stock':'+ Cart'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── CHOCOLATE CARD (Delicio) ── */
function ChocCard({prod, onAdd}) {
  const [qty, setQty] = useState(1);
  const [ok, setOk]   = useState(false);
  const outOfStock = prod.availability === 'out';
  const add = () => {
    if(outOfStock) return;
    onAdd(prod,'','',qty);
    setOk(true); setTimeout(()=>setOk(false),1800);
  };
  return (
    <div className="cc">
      <div className="cc-img">
        <img src={prod.img} alt={prod.name} loading="lazy"
          onError={e=>{e.target.style.display='none';e.target.nextSibling.style.display='flex';}}/>
        <div className="cc-fb">{prod.emoji}</div>
      </div>
      <div className="cc-info">
        <div className="cc-name">{prod.name}</div>
        <div className="cc-price">₹{prod.price}</div>
      </div>
      <div className="cc-acts">
        <div className="cc-qty">
          <button className="ccqb" onClick={()=>setQty(q=>Math.max(1,q-1))}>−</button>
          <span>{qty}</span>
          <button className="ccqb" onClick={()=>setQty(q=>Math.min(99,q+1))}>+</button>
        </div>
        <button className={`cc-add${ok?' ok':''}`} onClick={add}>
          {ok?'✓ Added':'+ Add'}
        </button>
      </div>
    </div>
  );
}

/* ── SHAWL CARD ── */
function ShawlCard({prod, onAdd}) {
  const [color, setColor] = useState('');
  const [ok, setOk] = useState(false);
  return (
    <div className="shc">
      {prod.tag && <span className="shc-tag">{prod.tag}</span>}
      <div className="shc-img">
        <img src={prod.img} alt={prod.name} loading="lazy"/>
        <div className="shc-ov"/>
      </div>
      <div className="shc-info">
        <div className="shc-name">{prod.name}</div>
        <div className="shc-price">₹{prod.price.toLocaleString()}</div>
        <div className="shc-dots">
          {prod.colors.map(c=>(
            <button key={c} className={`s-dot${color===c?' sel':''}`}
              style={{background:COLORS[c]||'#888'}}
              onClick={()=>setColor(c)} title={c}/>
          ))}
        </div>
        <button className={`shc-add${ok?' ok':''}`}
          onClick={()=>{
            if(!color){alert('Please select a colour');return;}
            onAdd(prod,color,'',1);
            setOk(true);setTimeout(()=>setOk(false),1800);
          }}>
          {ok?'✓ Added to Cart':'Add to Cart'}
        </button>
      </div>
    </div>
  );
}

/* ── LUXURY CARD (Perfume) ── */
function LuxCard({prod, onAdd}) {
  const [ok, setOk] = useState(false);
  return (
    <div className="lc">
      {prod.tag && <span className="lc-tag">{prod.tag}</span>}
      <div className="lc-img"><img src={prod.img} alt={prod.name} loading="lazy"/></div>
      <div className="lc-info">
        <div className="lc-name">{prod.name}</div>
        {prod.notes && <div className="lc-notes">{prod.notes}</div>}
        <span className="lc-vol">{prod.vol}</span>
        <div className="lc-price">₹{prod.price.toLocaleString()}</div>
        <button className={`lc-add${ok?' ok':''}`}
          onClick={()=>{onAdd(prod,'','',1);setOk(true);setTimeout(()=>setOk(false),1800);}}>
          {ok?'✓ Added to Cart':'+ Add to Cart'}
        </button>
      </div>
    </div>
  );
}

/* ── TEA CARD ── */
function TeaCard({prod, onAdd}) {
  const [ok, setOk] = useState(false);
  return (
    <div className="tc">
      {prod.tag && <span className="tc-tag">{prod.tag}</span>}
      <div className="tc-img"><img src={prod.img} alt={prod.name} loading="lazy"/></div>
      <div className="tc-info">
        <div className="tc-name">{prod.name}</div>
        <span className="tc-type">{prod.type} · {prod.weight}</span>
        <div className="tc-price">₹{prod.price.toLocaleString()}</div>
        <button className={`tc-add${ok?' ok':''}`}
          onClick={()=>{onAdd(prod,'','',1);setOk(true);setTimeout(()=>setOk(false),1800);}}>
          {ok?'✓ Added':'+ Add to Cart'}
        </button>
      </div>
    </div>
  );
}

/* ── CART PANEL ── */
function CartPanel({open, onClose, items, onDel, onQty, total, sendWA}) {
  return (
    <>
      <div className={`cart-bk${open?' open':''}`} onClick={onClose}/>
      <div className={`cart-pn${open?' open':''}`}>
        <div className="cart-hd">
          <div>
            <h3>Your Order</h3>
            <p>Knit and Melt</p>
          </div>
          <button className="cart-x" onClick={onClose}>✕</button>
        </div>
        <div className="cart-body">
          {items.length===0 ? (
            <div className="cart-empty">
              <div className="cart-empty-ico">🛍️</div>
              <p>Cart is empty</p>
              <small>Add products to get started</small>
            </div>
          ) : items.map(it=>(
            <div className="ci" key={it.key}>
              <div className="ci-ico">
                {it.p.img
                  ? <img src={it.p.img} alt={it.p.name} onError={e=>e.target.style.display='none'}/>
                  : <span>{it.p.emoji||'📦'}</span>}
              </div>
              <div className="ci-info">
                <strong className="ci-name">{it.p.name}</strong>
                <div className="ci-meta">
                  {it.color && <><span className="ci-cdot" style={{background:COLORS[it.color]||'#888'}}/>{it.color}</>}
                  {it.color && it.size && ' · '}
                  {it.size && `Size: ${it.size}`}
                </div>
                <div className="ci-btm">
                  <div className="qty-row">
                    <button className="qb" onClick={()=>onQty(it.key, it.qty-1)}>−</button>
                    <span style={{minWidth:20,textAlign:'center',fontWeight:700}}>{it.qty}</span>
                    <button className="qb" onClick={()=>onQty(it.key, it.qty+1)}>+</button>
                  </div>
                  <span className="ci-price">₹{(it.p.price*it.qty).toLocaleString()}</span>
                  <button className="ci-del" onClick={()=>onDel(it.key)}>🗑</button>
                </div>
              </div>
            </div>
          ))}
        </div>
        {items.length>0 && (
          <div className="cart-ft">
            <div className="cart-div"/>
            <div className="cart-total">
              <span className="ct-lbl">Order Total</span>
              <span className="ct-val">₹{total.toLocaleString()}</span>
            </div>
            <button className="wa-order" onClick={sendWA}>
              <WaIcon/> Send Order on WhatsApp
            </button>
            <p className="cart-note">Item · Colour · Size · Qty — sent automatically</p>
          </div>
        )}
      </div>
    </>
  );
}

/* ── FOOTER ── */
function Footer({nav}) {
  return (
    <footer className="footer">
      <div className="footer-top">
        <div className="container footer-grid">
          <div>
            <div className="foot-logo">
              <div className="foot-b"><span>S</span></div>
              <div>
                <div className="foot-name">Knit and Melt</div>
                <div className="foot-tag">Premium Knitwear & Artisan Chocolates</div>
              </div>
            </div>
            <p className="foot-desc">Curated winter wear and artisanal chocolates from the misty hills of Ooty, Tamil Nadu. Quality crafted for those who refuse ordinary.</p>
            <a href="https://wa.me/918675554222" target="_blank" rel="noreferrer" className="foot-wa">
              <WaIcon/> +91 8675554222
            </a>
          </div>
          <div className="footer-col">
            <h4>Collections</h4>
            <ul>
              {[['Sweaters','sweaters'],['Chocolates','chocolates'],['Shawls & Stoles','shawls'],['Perfumes & Tea','perfumes']].map(([l,p])=>(
                <li key={p}><a href="#" onClick={e=>{e.preventDefault();nav(p);}}>{l}</a></li>
              ))}
            </ul>
          </div>
          <div className="footer-col">
            <h4>Information</h4>
            <ul>
              {['About Us','Contact','Delivery Info','Payment Methods','Returns'].map(t=>(
                <li key={t}><a href="#">{t}</a></li>
              ))}
            </ul>
          </div>
          <div className="footer-col">
            <h4>Visit Us</h4>
            <address>
              <p>Shops No. 23 & 24</p>
              <p>Boathouse Road, Ooty</p>
              <p>Tamil Nadu, India</p>
              <br/>
              <p>📞 +91 8675554222</p>
              <p>⏰ Open 9AM – 8PM daily</p>
            </address>
            <a href="https://maps.google.com?q=Boathouse+Ooty" target="_blank" rel="noreferrer" className="footer-maps">📍 Google Maps →</a>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <div className="container footer-bot-i">
          <span>© 2025 Knit and Melt. All rights reserved.</span>
          <span className="footer-credit">Designed by <strong>Shruthi</strong></span>
        </div>
      </div>
    </footer>
  );
}

/* ═══════════════════════════════════════════════════════
   PAGES
═══════════════════════════════════════════════════════ */

/* HOME */
function HomePage({nav, onAdd}) {
  const { products: chocs, loading: lc } = useProducts('chocolates');
  const { products: shawlProds, loading: ls } = useProducts('shawls');

  const cats = [
    {label:'Ladies Sweaters',sub:'Elegant knits · 10 exclusive styles',page:'sweaters',img:'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=600&q=80'},
    {label:'Premium Sweaters',sub:'Merino · Cashmere · Luxury blends',page:'sweaters',img:'https://images.unsplash.com/photo-1614093302611-8efc4f438572?w=600&q=80'},
    {label:"Men's Hoodies",sub:'Streetwear · Bold designs · 10 styles',page:'sweaters',img:'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=600&q=80'},
    {label:'Caps & Beanies',sub:'Woolen · Fleece · All styles',page:'caps',img:'https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?w=600&q=80'},
    {label:'Fine Chocolate Collection',sub:'50 premium varieties · Perfect gifting from the hills of Ooty',page:'chocolates',img:'https://images.unsplash.com/photo-1511381939415-e44015466834?w=900&q=80',wide:true},
  ];
 
  return (
    <div>
      {/* HERO */}
      <div className="hero">
        <div className="hero-bg"/>
        <div className="hero-ov"/>
        <div className="hero-cnt">
          <div className="hero-eye a1">Boathouse Ooty · Shops 23 & 24</div>
          <h1 className="hero-h1 a2">Knit &<br/>Melt</h1>
          <p className="hero-p a3">Where mountain chill meets timeless warmth</p>
          <div className="hero-btns a4">
            <button className="btn-choc" onClick={()=>nav('sweaters')}>🧥 Explore Winter Wear</button>
            <button className="btn-ghost" onClick={()=>nav('chocolates')}>🍫 Fine Chocolates</button>
          </div>
        </div>
      </div>

      {/* FEAT STRIP */}
      <div className="feat">
        <div className="feat-i">
          <div className="feat-item"><span className="feat-ico">🏪</span><span className="feat-lbl">Boathouse Ooty Shop</span></div>
          <div className="feat-item"><span className="feat-ico">📱</span><span className="feat-lbl">WhatsApp Orders</span></div>
          <div className="feat-item"><span className="feat-ico">🚚</span><span className="feat-lbl">Pan TN Delivery</span></div>
        </div>
      </div>

      {/* CHOC PREVIEW */}
      {/* CHOC PREVIEW */}
      <div className="choc-sec">
        <div className="choc-hdr">
          <div className="choc-hdr-eye">Ooty's Finest</div>
          <h2>Fine Chocolate Collection</h2>
          <p>50 handpicked varieties · Perfect for gifting · Single origin · Truffles</p>
        </div>

        <div className="choc-wrap">
          {lc ? <LoadingGrid cols={4}/> : (
            <div className="choc-grid">
              {chocs.slice(0,8).map(c => (
                <ChocCard 
                  key={c.id} 
                  prod={{...c, img: c.image_url}} 
                  onAdd={onAdd}
                />
              ))}
            </div>
          )}

          <div className="choc-more">
            <button onClick={()=>nav('chocolates')}>
              View All Chocolates →
            </button>
          </div>
        </div>
      </div>

      {/* STATS */}
      <div className="stats">
        <div className="stats-i">
          <div className="stat"><div className="stat-n">30+</div><div className="stat-l">Sweater Styles</div></div>
          <div className="stat"><div className="stat-n">50</div><div className="stat-l">Chocolates</div></div>
          <div className="stat"><div className="stat-n">100%</div><div className="stat-l">Premium</div></div>
          <div className="stat"><div className="stat-n">Ooty</div><div className="stat-l">Boathouse</div></div>
        </div>
      </div>

      {/* CATEGORY CARDS */}
      <div className="sec-py" style={{background:'#fff'}}>
        <div className="container">
          <SH eye="Our Collections" h2="Crafted for the Chill" p="Discover our full range of winter warmth"/>
          <div className="cat-grid">
            {cats.map((c,i)=>(
              <div key={i} className={`cat-card${c.wide?' cat-wide':''}`} onClick={()=>nav(c.page)}>
                <div className="cat-ph">
                  <img src={c.img} alt={c.label} loading="lazy"/>
                  <div className="cat-ph-ov"/>
                </div>
                <div className="cat-bd">
                  <h3>{c.label}</h3>
                  <p>{c.sub}</p>
                  <div className="cat-cta">Explore <span>→</span></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* SHAWL PREVIEW */}
      <div className="sec-py shawl-sec">
        <div className="container">
          <SH 
            eye="Elegance Draped" 
            h2="Shawls & Stoles" 
            p="Handwoven traditions · Pashmina · Kashmir · Wool Blends"
          />

          {ls ? <LoadingGrid cols={4}/> : (
            <div className="shawl-grid">
              {shawlProds.map(s => (
                <ShawlCard 
                  key={s.id} 
                  prod={{...s, img: s.image_url}} 
                  onAdd={onAdd}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* LOCATION */}
      <div className="loc-sec">
        <div className="loc-inner">
          <div className="loc-eye">Find Us</div>
          <h3 className="loc-h3">Shops 23 & 24, Boathouse Road · Ooty</h3>
          <p className="loc-p">Tamil Nadu, India<br/>📞 +91 8675554222 · WhatsApp Orders Welcome</p>
          <a href="https://maps.google.com?q=Boathouse+Ooty" target="_blank" rel="noreferrer" className="map-link">📍 Open in Google Maps →</a>
        </div>
      </div>

      <Footer nav={nav}/>
    </div>
  );
}

/* SWEATERS */
function SweatersPage({onAdd}) {
  const tabs = ['All','Ladies','Mens','Premium'];
  const [active, setActive] = useState('All');
  const { products, loading } = useProducts('sweaters');
  const filtered = active==='All' ? products : products.filter(s=>s.label===active);
  return (
    <div>
      {/* Page header (Guza) */}
      <div style={{background:'#F0F5F7',padding:'clamp(20px,3.5vw,40px) 0 clamp(16px,2.5vw,28px)',position:'relative',overflow:'hidden',borderBottom:'1px solid #E2EAEE'}}>
        <div className="container" style={{display:'flex',alignItems:'flex-end',gap:40,position:'relative',zIndex:1}}>
          <div>
            <h1 style={{fontFamily:"'Playfair Display',serif",fontSize:'clamp(1.7rem,4.5vw,3rem)',fontWeight:400,color:'#1E2E36'}}>Winter Wear</h1>
            <div style={{fontSize:'.65rem',color:'#7A9AA8',marginTop:4,letterSpacing:'.06em'}}>Home › Winter Wear</div>
          </div>
        </div>
        <div style={{position:'absolute',right:0,top:0,bottom:0,width:'clamp(160px,35%,400px)',overflow:'hidden',zIndex:0}}>
          <img src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=600&q=80" alt="" style={{width:'100%',height:'100%',objectFit:'cover'}}/>
          <div style={{position:'absolute',inset:0,background:'linear-gradient(90deg,#F0F5F7 0%,transparent 60%)'}}/>
        </div>
      </div>

      {/* Filter bar */}
      <div className="filter-bar">
        <div className="filter-i">
          <span style={{fontSize:'.62rem',fontWeight:700,letterSpacing:'.1em',textTransform:'uppercase',color:'#7A9AA8',flexShrink:0}}>Filter ✦</span>
          {tabs.map(t=>(
            <button key={t} className={`fchip${active===t?' act':''}`} onClick={()=>setActive(t)}>{t}</button>
          ))}
          <div className="fsep"/>
          <span className="fsort">{filtered.length} Products</span>
        </div>
      </div>

      <div className="sec-py">
        <div className="container">
          {loading ? <LoadingGrid cols={4}/> : (
          <div className="prod-grid">
            {filtered.map(p=><FashionCard key={p.id} prod={{...p,img:p.image_url}} onAdd={onAdd}/>)}
          </div>
          )}
        </div>
      </div>
      <Footer nav={()=>{}}/>
    </div>
  );
}

/* CHOCOLATES */
function ChocolatesPage({onAdd}) {
  const { products, loading } = useProducts('chocolates');
  const [show, setShow] = useState(8);
  return (
    <div>
      <div className="choc-sec" style={{minHeight:'100vh'}}>
        <div className="choc-hdr" style={{paddingTop:'clamp(36px,6vw,68px)'}}>
          <div className="choc-hdr-eye">Ooty's Finest</div>
          <h2>Fine Chocolate Collection</h2>
          <p>50 handpicked varieties · Perfect for gifting · Choose quantity & order via WhatsApp</p>
        </div>
        <div className="choc-wrap">
          <div className="choc-grid">
            {products.slice(0,show).map(c=><ChocCard key={c.id} prod={{...c,img:c.image_url}} onAdd={onAdd}/>)}
          </div>
          {!loading && show < products.length && (
            <div className="choc-more">
              <button onClick={()=>setShow(products.length)}>View All {products.length} Chocolates →</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* CAPS */
function CapsPage({onAdd}) {
  const { products: caps, loading: lc } = useProducts('caps');

  return (
    <div className="cap-sec">
      <div className="sec-py">
        <div className="container">
          <SH eye="Winter Accessories" h2="Caps & Beanies" p="Woolen · Fleece · Pom-Pom · All styles"/>
          {lc ? <LoadingGrid cols={4}/> : (
          <div className="cap-grid">
            {caps.map(c=><FashionCard key={c.id} prod={{...c,img:c.image_url}} onAdd={onAdd}/>)}
          </div>
          )}
        </div>
      </div>
      <Footer nav={()=>{}}/>
    </div>
  );
}

/* SHAWLS */
function ShawlsPage({onAdd}) {
  const { products: shawlProds, loading: ls } = useProducts('shawls');

  return (
    <div className="shawl-sec" style={{minHeight:'100vh'}}>
      <div className="sec-py">
        <div className="container">
          <SH eye="Elegance Draped" h2="Shawls & Stoles" p="Handwoven traditions · Pashmina · Kashmir · Wool Blends"/>
          {ls ? <LoadingGrid cols={4}/> : (
          <div className="shawl-grid">
            {shawlProds.map(s=><ShawlCard key={s.id} prod={{...s,img:s.image_url}} onAdd={onAdd}/>)}
          </div>
          )}
        </div>
      </div>
      <Footer nav={()=>{}}/>
    </div>
  );
}

/* PERFUMES & TEA */
function PerfumesPage({onAdd}) {
  return (
    <div>
      {/* Perfumes — dark gunmetal */}
      <div className="perf-sec sec-py">
        <div className="container">
          <SH eye="Luxury Fragrances" h2="Perfumes & Attars" p="Exclusive Nilgiri blends · Cedar · Rose · Sandalwood" dark/>
          <div className="perf-grid">
            {PERFUMES.map(p=><LuxCard key={p.id} prod={p} onAdd={onAdd}/>)}
          </div>
        </div>
      </div>

      {/* Tea — clean white */}
      <div className="sec-py" style={{background:'var(--w)'}}>
        <div className="container">
          <SH eye="Nilgiri Grown" h2="Premium Tea Powders" p="CTC · Green · Masala · Earl Grey — straight from Ooty estates"/>
          <div className="perf-grid">
            {TEAS.map(t=><TeaCard key={t.id} prod={t} onAdd={onAdd}/>)}
          </div>
        </div>
      </div>
      <Footer nav={()=>{}}/>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   ROOT APP
═══════════════════════════════════════════════════════ */
export default function App() {
  const [page, setPage]     = useState('home');
  const [cartOpen, setCartOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [cart, dispatch]    = useReducer(cartReducer, []);
  const toast               = useToast();

  // Persist cart
  useEffect(()=>{
    try{const d=localStorage.getItem('occ_cart2');if(d)dispatch({type:'LOAD',data:JSON.parse(d)});}catch(e){}
  },[]);
  useEffect(()=>{
    try{localStorage.setItem('occ_cart2',JSON.stringify(cart));}catch(e){}
  },[cart]);

  // Scroll
  useEffect(()=>{
    const fn=()=>setScrolled(window.scrollY>40);
    window.addEventListener('scroll',fn,{passive:true});
    return()=>window.removeEventListener('scroll',fn);
  },[]);

  const nav = (p) => { setPage(p); setMenuOpen(false); window.scrollTo({top:0,behavior:'smooth'}); };

  const addItem = useCallback((p, color, size, qty) => {
    dispatch({type:'ADD', p, color, size, qty});
    toast.show(`✓ ${p.name.split(' ').slice(0,3).join(' ')} added!`);
  },[toast]);

  const total = cart.reduce((s,i)=>s+i.p.price*i.qty, 0);
  const count = cart.reduce((s,i)=>s+i.qty, 0);

  const sendWA = async () => {
    if(!cart.length){toast.show('🛒 Add items first!');return;}
    try { await api.createOrder(cart, total); } catch(e) { console.error('Order save failed:', e); }
    const msg = buildWhatsappMessage(cart, total);
    window.open(`https://wa.me/918675554222?text=${encodeURIComponent(msg)}`,'_blank');
    dispatch({type:'CLEAR'});
    toast.show('✅ Order sent! Check WhatsApp');
  };

  const navLinks = [
    {l:'Home',p:'home'},{l:'Sweaters',p:'sweaters'},{l:'Chocolates',p:'chocolates'},
    {l:'Shawls',p:'shawls'},{l:'Perfumes & Tea',p:'perfumes'},{l:'Caps',p:'caps'},
  ];

  return (
    <>
      <style>{CSS}</style>

      {/* NAV */}
      <nav className={`nav${scrolled?' scrolled':''}`}>
        <div className="nav-c">
          <div className="logo" onClick={()=>nav('home')}>
            <div className="logo-b"><span>S</span></div>
            <div className="logo-t">
              <span className="logo-n">Knit and Melt</span>
              <span className="logo-s">Premium Knitwear & Artisan Chocolates</span>
            </div>
          </div>

          <div className="nav-links">
            {navLinks.map(n=>(
              <button key={n.p} className={`nl${page===n.p?' act':''}`} onClick={()=>nav(n.p)}>{n.l}</button>
            ))}
          </div>

          <div className="nav-r">
            <button className="cart-btn" onClick={()=>setCartOpen(true)}>
              <CartIcon/>
              {count>0 && <span className="cart-pill">{count}</span>}
            </button>
            <a href="https://wa.me/918675554222" target="_blank" rel="noreferrer" className="wa-nav">
              <WaIcon/><span className="wa-nav-t">+91 8675554222</span>
            </a>
            <button className={`hbg${menuOpen?' open':''}`} onClick={()=>setMenuOpen(v=>!v)}>
              <span/><span/><span/>
            </button>
          </div>
        </div>

        {/* Mobile dropdown */}
        <div className={`mob-menu${menuOpen?' open':''}`}>
          {navLinks.map(n=>(
            <button key={n.p} className={`mob-link${page===n.p?' act':''}`} onClick={()=>nav(n.p)}>{n.l}</button>
          ))}
          <button className="mob-cart-btn" onClick={()=>{setCartOpen(true);setMenuOpen(false);}}>
            🛒 Cart ({count})
          </button>
        </div>
      </nav>

      {/* MOBILE BOTTOM BAR */}
      <div className="mob-bar">
        <div className="mob-bar-inner">
          {[{l:'Home',p:'home',i:'🏠'},{l:'Sweaters',p:'sweaters',i:'🧥'},{l:'Choco',p:'chocolates',i:'🍫'},{l:'Shawls',p:'shawls',i:'🌿'}].map(n=>(
            <button key={n.p} className={`mbt${page===n.p?' act':''}`} onClick={()=>nav(n.p)}>
              <span className="mbt-ico">{n.i}</span>{n.l}
            </button>
          ))}
          <button className="mbt" onClick={()=>setCartOpen(true)}>
            <span className="mbt-ico">
              🛒{count>0&&<span className="mbt-badge">{count}</span>}
            </span>Cart
          </button>
        </div>
      </div>

      {/* PAGES */}
      <div className="page">
        {page==='home'       && <HomePage nav={nav} onAdd={addItem}/>}
        {page==='sweaters'   && <SweatersPage onAdd={addItem}/>}
        {page==='chocolates' && <ChocolatesPage onAdd={addItem}/>}
        {page==='caps'       && <CapsPage onAdd={addItem}/>}
        {page==='shawls'     && <ShawlsPage onAdd={addItem}/>}
        {page==='perfumes'   && <PerfumesPage onAdd={addItem}/>}
      </div>

      {/* CART */}
      <CartPanel
        open={cartOpen} onClose={()=>setCartOpen(false)}
        items={cart}
        onDel={key=>dispatch({type:'DEL',key})}
        onQty={(key,qty)=>dispatch({type:'QTY',key,qty})}
        total={total}
        sendWA={sendWA}
      />

      {/* TOAST */}
      <div className={`toast${toast.on?' on':''}`}>{toast.msg}</div>
    </>
  );
}
