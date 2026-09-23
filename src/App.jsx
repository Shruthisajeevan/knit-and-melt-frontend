import { useState, useReducer, useEffect, useCallback } from "react";
import api, { buildWhatsappMessage } from "./api/service";

/* ═══════════════════════════════════════════════════════
   HOOKS & STATE
═══════════════════════════════════════════════════════ */
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

function useToast() {
  const [msg, setMsg] = useState('');
  const [on, setOn] = useState(false);
  const show = useCallback((m) => {
    setMsg(m); setOn(true);
    setTimeout(() => setOn(false), 2600);
  }, []);
  return { msg, on, show };
}

const cartReducer = (s, a) => {
  switch (a.type) {
    case 'ADD': {
      const key = `${a.p.id}|${a.color || ''}|${a.size || ''}`;
      const ex = s.find(i => i.key === key);
      if (ex) return s.map(i => i.key === key ? { ...i, qty: i.qty + a.qty } : i);
      return [...s, { key, p: a.p, color: a.color, size: a.size, qty: a.qty }];
    }
    case 'DEL': return s.filter(i => i.key !== a.key);
    case 'QTY': return s.map(i => i.key === a.key ? { ...i, qty: Math.max(1, a.qty) } : i);
    case 'LOAD': return a.data;
    case 'CLEAR': return [];
    default: return s;
  }
};

const COLORS = {
  'Ivory White': '#F5F0E8', 'Jet Black': '#1A1A1A', 'Wine Red': '#7B1D1D',
  'Navy Blue': '#1A237E', 'Charcoal': '#374151', 'Dusty Rose': '#D4A0A0',
  'Forest Green': '#2D6A4F', 'Camel Tan': '#C4A882', 'Slate Gray': '#5C6B7A',
  'Burgundy': '#800020', 'Cobalt': '#0047AB', 'Mauve': '#9C7B8C',
  'Mustard': '#D4A017', 'Olive': '#808000', 'Teal': '#008080',
  'Blush': '#F4C2C2', 'Midnight': '#0D0D2B', 'Cream': '#FAEBD7', 'Rust': '#B7410E',
};

/* ═══════════════════════════════════════════════════════
   DESIGN SYSTEM — Boutique Editorial
═══════════════════════════════════════════════════════ */
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&family=Inter:wght@300;400;500;600;700&family=Italiana&display=swap');

*,*::before,*::after{margin:0;padding:0;box-sizing:border-box;}
html{scroll-behavior:smooth;-webkit-text-size-adjust:100%;}
body{font-family:'Inter',sans-serif;background:#FBF8F3;color:#1F1B16;overflow-x:hidden;-webkit-font-smoothing:antialiased;}
img{display:block;max-width:100%;height:auto;}
button{cursor:pointer;font-family:inherit;border:none;background:none;}
a{text-decoration:none;color:inherit;}
ul{list-style:none;}
input,select{font-family:inherit;}
::-webkit-scrollbar{width:6px;}
::-webkit-scrollbar-track{background:#F2EDE4;}
::-webkit-scrollbar-thumb{background:#B89968;border-radius:6px;}

:root{
  --bg:#FBF8F3;--bg-2:#F4EEE2;--bg-3:#EFE7D6;
  --ink:#1F1B16;--ink-2:#3D362C;--muted:#7A6F5E;--muted-2:#A89B85;
  --line:#E5DCC8;--line-2:#D4C7AC;
  --accent:#B89968;--accent-dark:#8E6F44;--accent-soft:#E8D9B8;
  --terracotta:#C65D3F;--terracotta-dark:#A04826;
  --forest:#3D5240;--forest-dark:#2A3A2D;
  --success:#5A8A5A;
  --serif:'Cormorant Garamond',serif;--sans:'Inter',sans-serif;--display:'Italiana',serif;
  --nav:72px;--ease:cubic-bezier(.25,.46,.45,.94);--spring:cubic-bezier(.34,1.56,.64,1);
  --r:4px;--r-lg:10px;
  --shadow:0 2px 16px rgba(31,27,22,.06);
  --shad-md:0 8px 30px rgba(31,27,22,.1);
  --shad-lg:0 20px 60px rgba(31,27,22,.18);
}

/* ── ANNOUNCEMENT BAR ── */
.announce{background:var(--ink);color:var(--bg);font-size:.72rem;letter-spacing:.18em;text-transform:uppercase;text-align:center;padding:9px 14px;font-weight:500;}

/* ── NAV ── */
.nav{position:fixed;top:0;left:0;right:0;z-index:900;background:rgba(251,248,243,.92);backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px);border-bottom:1px solid var(--line);transition:all .3s var(--ease);}
.nav-c{max-width:1480px;margin:0 auto;padding:0 clamp(16px,3vw,48px);height:var(--nav);display:flex;align-items:center;gap:clamp(8px,1.5vw,24px);}
.logo{display:flex;align-items:center;gap:11px;flex-shrink:0;cursor:pointer;}
.logo-mono{font-family:var(--display);font-size:1.65rem;color:var(--ink);letter-spacing:.02em;line-height:1;}
.logo-sub{font-size:.5rem;letter-spacing:.32em;text-transform:uppercase;color:var(--muted);margin-top:2px;}
.nav-links{display:flex;align-items:center;gap:2px;margin:0 auto;}
.nl{font-size:.72rem;font-weight:500;letter-spacing:.14em;text-transform:uppercase;color:var(--ink-2);padding:9px 14px;position:relative;transition:color .2s;}
.nl::after{content:'';position:absolute;left:50%;bottom:4px;width:0;height:1.5px;background:var(--accent);transition:all .3s var(--ease);transform:translateX(-50%);}
.nl:hover,.nl.act{color:var(--accent-dark);}
.nl.act::after,.nl:hover::after{width:18px;}
.nav-r{display:flex;align-items:center;gap:10px;flex-shrink:0;}
.icon-btn{width:42px;height:42px;display:flex;align-items:center;justify-content:center;color:var(--ink);border-radius:50%;transition:all .2s;}
.icon-btn:hover{background:var(--bg-2);color:var(--accent-dark);}
.cart-btn{position:relative;}
.cart-count{position:absolute;top:4px;right:4px;min-width:18px;height:18px;padding:0 5px;background:var(--terracotta);color:#fff;border-radius:30px;font-size:.6rem;font-weight:700;display:flex;align-items:center;justify-content:center;border:2px solid var(--bg);}
.wa-nav{display:flex;align-items:center;gap:7px;background:var(--ink);color:var(--bg);padding:11px 18px;border-radius:30px;font-size:.68rem;font-weight:600;letter-spacing:.12em;text-transform:uppercase;transition:all .25s;white-space:nowrap;}
.wa-nav:hover{background:var(--accent-dark);transform:translateY(-1px);}
.wa-nav-t{display:none;}
@media(min-width:1100px){.wa-nav-t{display:inline;}}

.hbg{display:none;flex-direction:column;gap:5px;padding:8px;}
.hbg span{display:block;width:22px;height:1.5px;background:var(--ink);border-radius:2px;transition:all .3s var(--ease);transform-origin:center;}
.hbg.open span:nth-child(1){transform:translateY(6.5px) rotate(45deg);}
.hbg.open span:nth-child(2){opacity:0;}
.hbg.open span:nth-child(3){transform:translateY(-6.5px) rotate(-45deg);}

.mob-menu{display:none;flex-direction:column;background:var(--bg);border-top:1px solid var(--line);max-height:0;overflow:hidden;transition:max-height .4s var(--ease);}
.mob-menu.open{max-height:420px;}
.mob-link{padding:16px clamp(20px,5vw,40px);color:var(--ink-2);font-size:.85rem;font-weight:500;letter-spacing:.1em;text-transform:uppercase;border-bottom:1px solid var(--line);transition:all .2s;}
.mob-link:hover,.mob-link.act{color:var(--accent-dark);background:var(--bg-2);}

.mob-bar{display:none;position:fixed;bottom:0;left:0;right:0;z-index:850;background:var(--bg);border-top:1px solid var(--line);box-shadow:0 -4px 20px rgba(31,27,22,.06);padding-bottom:env(safe-area-inset-bottom);}
.mob-bar-i{display:flex;height:62px;}
.mbt{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:3px;color:var(--muted);font-size:.5rem;font-weight:600;letter-spacing:.1em;text-transform:uppercase;transition:color .2s;position:relative;}
.mbt-ico{font-size:1.15rem;}
.mbt.act{color:var(--accent-dark);}
.mbt-badge{position:absolute;top:6px;right:50%;transform:translateX(14px);background:var(--terracotta);color:#fff;border-radius:50%;width:16px;height:16px;font-size:.52rem;font-weight:700;display:flex;align-items:center;justify-content:center;}

@media(max-width:980px){
  .nav-links{display:none;}
  .hbg{display:flex;}
  .mob-menu{display:flex;}
  .mob-bar{display:block;}
}
@media(max-width:480px){.wa-nav{display:none;}}

/* ── PAGE WRAPPER ── */
.page{padding-top:var(--nav);}
@media(max-width:980px){.page{padding-bottom:62px;}}

/* ── LAYOUT ── */
.container{max-width:1480px;margin:0 auto;padding:0 clamp(16px,3vw,48px);}
.sec{padding:clamp(56px,8vw,110px) 0;}

/* ── HERO ── */
.hero{position:relative;min-height:clamp(540px,86vh,820px);display:flex;align-items:center;overflow:hidden;background:var(--bg-2);}
.hero-grid{display:grid;grid-template-columns:1.1fr 1fr;gap:clamp(30px,5vw,80px);align-items:center;width:100%;}
@media(max-width:980px){.hero-grid{grid-template-columns:1fr;text-align:center;}}
.hero-l{padding-right:clamp(10px,2vw,30px);}
@media(max-width:980px){.hero-l{padding:0;}}
.hero-eye{display:inline-flex;align-items:center;gap:10px;font-size:.7rem;letter-spacing:.32em;text-transform:uppercase;color:var(--accent-dark);font-weight:600;margin-bottom:24px;}
.hero-eye::before{content:'';width:32px;height:1px;background:var(--accent);}
.hero-h1{font-family:var(--serif);font-size:clamp(3rem,7.5vw,6.5rem);font-weight:500;line-height:.95;color:var(--ink);letter-spacing:-.01em;}
.hero-h1 em{font-style:italic;color:var(--accent-dark);font-weight:400;}
.hero-p{font-size:clamp(.95rem,1.1vw,1.05rem);color:var(--ink-2);line-height:1.75;margin-top:24px;max-width:480px;}
@media(max-width:980px){.hero-p{margin-left:auto;margin-right:auto;}}
.hero-btns{display:flex;flex-wrap:wrap;gap:12px;margin-top:36px;}
@media(max-width:980px){.hero-btns{justify-content:center;}}
.btn-pri{background:var(--ink);color:var(--bg);padding:15px 34px;border-radius:30px;font-size:.74rem;font-weight:600;letter-spacing:.18em;text-transform:uppercase;transition:all .28s var(--ease);display:inline-flex;align-items:center;gap:9px;}
.btn-pri:hover{background:var(--accent-dark);transform:translateY(-2px);box-shadow:0 10px 30px rgba(184,153,104,.35);}
.btn-sec{background:transparent;color:var(--ink);padding:15px 34px;border-radius:30px;font-size:.74rem;font-weight:600;letter-spacing:.18em;text-transform:uppercase;border:1.5px solid var(--ink);transition:all .28s var(--ease);display:inline-flex;align-items:center;gap:9px;}
.btn-sec:hover{background:var(--ink);color:var(--bg);transform:translateY(-2px);}
.hero-r{position:relative;}
.hero-img-main{position:relative;aspect-ratio:4/5;border-radius:var(--r-lg);overflow:hidden;box-shadow:var(--shad-lg);}
.hero-img-main img{width:100%;height:100%;object-fit:cover;}
.hero-badge{position:absolute;bottom:-22px;left:-22px;background:var(--bg);padding:22px 26px;border-radius:var(--r);box-shadow:var(--shad-md);text-align:center;border:1px solid var(--line);}
.hero-badge-n{font-family:var(--serif);font-size:2.2rem;color:var(--accent-dark);font-weight:600;line-height:1;}
.hero-badge-l{font-size:.55rem;letter-spacing:.22em;text-transform:uppercase;color:var(--muted);margin-top:6px;}
@media(max-width:980px){.hero-badge{left:50%;transform:translateX(-50%);}}

/* ── MARQUEE ── */
.marquee{background:var(--ink);color:var(--bg);padding:16px 0;overflow:hidden;}
.marquee-track{display:flex;gap:50px;white-space:nowrap;animation:scroll 28s linear infinite;}
.marquee-item{font-family:var(--serif);font-style:italic;font-size:1.3rem;color:var(--accent-soft);display:flex;align-items:center;gap:50px;}
.marquee-item::after{content:'✦';color:var(--accent);font-size:.9rem;}
@keyframes scroll{from{transform:translateX(0);}to{transform:translateX(-50%);}}

/* ── TRUST BAR ── */
.trust{background:var(--bg);border-bottom:1px solid var(--line);}
.trust-i{display:grid;grid-template-columns:repeat(4,1fr);max-width:1200px;margin:0 auto;}
@media(max-width:780px){.trust-i{grid-template-columns:repeat(2,1fr);}}
.trust-item{display:flex;align-items:center;gap:12px;padding:22px 18px;border-right:1px solid var(--line);justify-content:center;text-align:left;}
@media(max-width:780px){.trust-item:nth-child(2){border-right:none;}}
.trust-item:last-child{border-right:none;}
.trust-ico{font-size:1.6rem;flex-shrink:0;}
.trust-t{font-size:.72rem;font-weight:600;letter-spacing:.1em;text-transform:uppercase;color:var(--ink);}
.trust-s{font-size:.66rem;color:var(--muted);margin-top:2px;}

/* ── SECTION HEADER ── */
.sh{margin-bottom:clamp(36px,5vw,64px);display:flex;flex-direction:column;align-items:center;text-align:center;}
.sh-eye{font-size:.7rem;letter-spacing:.34em;text-transform:uppercase;color:var(--accent-dark);font-weight:600;margin-bottom:14px;display:flex;align-items:center;gap:10px;}
.sh-eye::before,.sh-eye::after{content:'';width:24px;height:1px;background:var(--accent);}
.sh-h2{font-family:var(--serif);font-size:clamp(2.2rem,4.5vw,3.8rem);font-weight:500;color:var(--ink);line-height:1.1;letter-spacing:-.01em;}
.sh-h2 em{font-style:italic;color:var(--accent-dark);}
.sh-p{font-size:.92rem;color:var(--muted);margin-top:14px;max-width:560px;line-height:1.7;}

/* ── CATEGORIES — Editorial cards ── */
.cat-sec{background:var(--bg);}
.cat-grid{display:grid;grid-template-columns:repeat(12,1fr);gap:clamp(14px,1.6vw,22px);margin-top:20px;}
.cat-tall{grid-column:span 4;grid-row:span 2;}
.cat-wide{grid-column:span 8;}
.cat-sq{grid-column:span 4;}
@media(max-width:980px){.cat-tall,.cat-wide,.cat-sq{grid-column:span 6;grid-row:auto;}.cat-wide{grid-column:span 12;}}
@media(max-width:600px){.cat-tall,.cat-wide,.cat-sq{grid-column:span 12;}}
.cat-card{position:relative;overflow:hidden;border-radius:var(--r-lg);cursor:pointer;background:var(--bg-2);transition:transform .4s var(--ease);min-height:280px;}
.cat-tall{min-height:580px;}
.cat-wide{min-height:280px;}
.cat-card img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;transition:transform .8s var(--ease);}
.cat-card:hover img{transform:scale(1.06);}
.cat-ov{position:absolute;inset:0;background:linear-gradient(180deg,transparent 30%,rgba(31,27,22,.78));}
.cat-body{position:absolute;left:0;right:0;bottom:0;padding:clamp(20px,2.4vw,32px);color:var(--bg);z-index:2;}
.cat-eye{font-size:.55rem;letter-spacing:.28em;text-transform:uppercase;color:var(--accent-soft);margin-bottom:6px;}
.cat-name{font-family:var(--serif);font-size:clamp(1.4rem,2.2vw,2rem);font-weight:500;line-height:1.1;}
.cat-sub{font-size:.78rem;color:rgba(251,248,243,.75);margin-top:6px;}
.cat-cta{display:inline-flex;align-items:center;gap:7px;margin-top:14px;font-size:.66rem;font-weight:600;letter-spacing:.18em;text-transform:uppercase;padding-bottom:3px;border-bottom:1px solid var(--accent);color:var(--bg);transition:gap .25s;}
.cat-card:hover .cat-cta{gap:13px;}

/* ── FILTER BAR ── */
.filter-bar{position:sticky;top:var(--nav);z-index:80;background:rgba(251,248,243,.95);backdrop-filter:blur(10px);border-bottom:1px solid var(--line);border-top:1px solid var(--line);}
.filter-i{max-width:1480px;margin:0 auto;padding:14px clamp(16px,3vw,48px);display:flex;align-items:center;gap:10px;overflow-x:auto;scrollbar-width:none;}
.filter-i::-webkit-scrollbar{display:none;}
.fchip{flex-shrink:0;background:transparent;border:1px solid var(--line-2);border-radius:30px;padding:8px 18px;font-size:.7rem;font-weight:500;letter-spacing:.1em;text-transform:uppercase;color:var(--ink-2);transition:all .22s;white-space:nowrap;}
.fchip:hover{border-color:var(--accent);color:var(--accent-dark);}
.fchip.act{background:var(--ink);color:var(--bg);border-color:var(--ink);}
.fcount{margin-left:auto;font-size:.7rem;color:var(--muted);letter-spacing:.08em;text-transform:uppercase;font-weight:500;white-space:nowrap;flex-shrink:0;}

/* ── PRODUCT GRID ── */
.prod-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:clamp(18px,2vw,32px);}
@media(max-width:1100px){.prod-grid{grid-template-columns:repeat(3,1fr);}}
@media(max-width:780px){.prod-grid{grid-template-columns:repeat(2,1fr);gap:14px;}}
@media(max-width:400px){.prod-grid{grid-template-columns:1fr;}}

/* ── PRODUCT CARD ── */
.pc{position:relative;background:var(--bg);border-radius:var(--r-lg);overflow:hidden;transition:transform .35s var(--ease),box-shadow .35s;}
.pc:hover{transform:translateY(-6px);box-shadow:var(--shad-md);}
.pc-img-w{position:relative;aspect-ratio:4/5;overflow:hidden;background:var(--bg-2);}
.pc-img-w img{width:100%;height:100%;object-fit:cover;transition:transform .6s var(--ease);}
.pc:hover .pc-img-w img{transform:scale(1.05);}
.pc-tag{position:absolute;top:14px;left:14px;z-index:3;font-size:.55rem;font-weight:700;letter-spacing:.16em;text-transform:uppercase;padding:5px 11px;border-radius:30px;background:var(--bg);color:var(--ink);box-shadow:0 2px 10px rgba(0,0,0,.08);}
.tag-best{background:var(--terracotta);color:#fff;}
.tag-new{background:var(--forest);color:#fff;}
.tag-pre{background:var(--ink);color:var(--accent-soft);}
.tag-cash{background:var(--accent);color:#fff;}
.pc-stock{position:absolute;top:14px;right:14px;z-index:3;display:flex;align-items:center;gap:5px;font-size:.55rem;font-weight:600;letter-spacing:.1em;text-transform:uppercase;background:rgba(251,248,243,.95);padding:5px 10px;border-radius:30px;color:var(--ink-2);}
.stock-dot{width:6px;height:6px;border-radius:50%;}
.stock-in{background:var(--success);}
.stock-lo{background:var(--terracotta);}
.stock-out{background:#999;}
.pc-quick{position:absolute;left:14px;right:14px;bottom:14px;z-index:3;display:flex;gap:8px;opacity:0;transform:translateY(10px);transition:all .35s var(--ease);}
.pc:hover .pc-quick{opacity:1;transform:translateY(0);}
.pc-quick button{flex:1;background:var(--bg);color:var(--ink);padding:11px 8px;border-radius:30px;font-size:.62rem;font-weight:600;letter-spacing:.12em;text-transform:uppercase;transition:all .2s;box-shadow:0 4px 14px rgba(0,0,0,.1);}
.pc-quick button:hover{background:var(--ink);color:var(--bg);}
.pc-info{padding:18px 4px 4px;}
.pc-lbl{font-size:.6rem;letter-spacing:.2em;text-transform:uppercase;color:var(--muted);margin-bottom:6px;}
.pc-name{font-family:var(--serif);font-size:1.15rem;font-weight:500;color:var(--ink);line-height:1.25;margin-bottom:6px;}
.pc-price{font-size:1rem;font-weight:600;color:var(--ink);}
.pc-price-old{font-size:.78rem;color:var(--muted);text-decoration:line-through;margin-left:7px;font-weight:400;}
.pc-colors{display:flex;gap:5px;margin-top:10px;flex-wrap:wrap;}
.pc-cdot{width:16px;height:16px;border-radius:50%;border:1.5px solid var(--line-2);transition:all .15s;cursor:pointer;}
.pc-cdot:hover{transform:scale(1.18);}
.pc-cdot.sel{border-color:var(--ink);box-shadow:0 0 0 2px var(--bg),0 0 0 3.5px var(--ink);}
.pc-selrow{display:flex;gap:8px;margin-top:10px;flex-wrap:wrap;}
.pc-sz{font-size:.66rem;font-weight:600;letter-spacing:.05em;padding:6px 12px;border:1px solid var(--line-2);border-radius:6px;color:var(--ink-2);background:var(--bg);cursor:pointer;transition:all .15s;text-transform:uppercase;}
.pc-sz:hover{border-color:var(--ink);}
.pc-sz.sel{background:var(--ink);color:var(--bg);border-color:var(--ink);}
.pc-qty{display:flex;align-items:center;border:1px solid var(--line-2);border-radius:6px;overflow:hidden;}
.pc-qb{width:30px;height:30px;background:var(--bg);color:var(--ink-2);font-size:1rem;font-weight:600;display:flex;align-items:center;justify-content:center;transition:all .15s;}
.pc-qb:hover{background:var(--bg-2);}
.pc-qn{width:30px;height:30px;text-align:center;background:var(--bg);color:var(--ink);font-size:.8rem;font-weight:600;border:none;border-left:1px solid var(--line-2);border-right:1px solid var(--line-2);}
.pc-add{width:100%;background:var(--ink);color:var(--bg);padding:13px;border-radius:30px;font-size:.66rem;font-weight:600;letter-spacing:.16em;text-transform:uppercase;margin-top:14px;transition:all .25s;display:flex;align-items:center;justify-content:center;gap:8px;}
.pc-add:hover{background:var(--accent-dark);}
.pc-add.ok{background:var(--success)!important;}
.pc-add.out{background:var(--bg-3);color:var(--muted);cursor:not-allowed;}

/* ── CHOCOLATE GRID (variant) ── */
.choc-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:clamp(18px,2vw,30px);}
@media(max-width:1100px){.choc-grid{grid-template-columns:repeat(3,1fr);}}
@media(max-width:780px){.choc-grid{grid-template-columns:repeat(2,1fr);gap:14px;}}
.cc-img{aspect-ratio:1!important;}

/* ── QUOTE / STORY ── */
.quote{background:var(--ink);color:var(--bg);padding:clamp(64px,9vw,120px) 0;text-align:center;position:relative;overflow:hidden;}
.quote::before{content:'"';position:absolute;top:10px;left:50%;transform:translateX(-50%);font-family:var(--serif);font-size:14rem;color:var(--accent);opacity:.18;line-height:1;}
.quote-text{font-family:var(--serif);font-style:italic;font-size:clamp(1.5rem,3vw,2.5rem);font-weight:400;line-height:1.4;max-width:900px;margin:0 auto;position:relative;z-index:2;}
.quote-by{font-size:.7rem;letter-spacing:.3em;text-transform:uppercase;color:var(--accent-soft);margin-top:30px;}

/* ── TEA/PERFUME SECTIONS ── */
.dual-sec{background:var(--bg-2);}
.dual-grid{display:grid;grid-template-columns:1fr 1fr;gap:clamp(20px,2.5vw,40px);margin-top:20px;}
@media(max-width:880px){.dual-grid{grid-template-columns:1fr;}}
.dual-block{background:var(--bg);border-radius:var(--r-lg);overflow:hidden;padding:clamp(28px,3vw,44px);box-shadow:var(--shadow);}
.dual-h{font-family:var(--serif);font-size:1.6rem;font-weight:500;margin-bottom:6px;}
.dual-sh{font-size:.78rem;color:var(--muted);margin-bottom:24px;letter-spacing:.04em;}
.dual-list{display:grid;grid-template-columns:1fr 1fr;gap:14px;}
@media(max-width:540px){.dual-list{grid-template-columns:1fr;}}
.dual-item{display:flex;gap:12px;align-items:center;padding:14px;background:var(--bg-2);border-radius:var(--r);transition:all .2s;}
.dual-item:hover{background:var(--bg-3);}
.dual-img{width:54px;height:54px;border-radius:var(--r);overflow:hidden;background:var(--bg-3);flex-shrink:0;}
.dual-img img{width:100%;height:100%;object-fit:cover;}
.dual-info{flex:1;min-width:0;}
.dual-name{font-size:.82rem;font-weight:600;color:var(--ink);}
.dual-meta{font-size:.66rem;color:var(--muted);margin-top:2px;}
.dual-price{font-size:.85rem;font-weight:700;color:var(--accent-dark);}
.dual-add{width:32px;height:32px;background:var(--ink);color:var(--bg);border-radius:50%;font-size:1.1rem;display:flex;align-items:center;justify-content:center;transition:all .2s;flex-shrink:0;}
.dual-add:hover{background:var(--accent-dark);transform:rotate(90deg);}

/* ── LOCATION ── */
.loc-sec{background:var(--bg-2);}
.loc-grid{display:grid;grid-template-columns:1fr 1fr;gap:clamp(30px,4vw,60px);align-items:center;}
@media(max-width:880px){.loc-grid{grid-template-columns:1fr;}}
.loc-l h2{font-family:var(--serif);font-size:clamp(2rem,4vw,3rem);font-weight:500;line-height:1.1;margin-bottom:18px;}
.loc-l h2 em{font-style:italic;color:var(--accent-dark);}
.loc-l p{font-size:.92rem;color:var(--ink-2);line-height:1.8;margin-bottom:14px;}
.loc-meta{display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-top:24px;}
.loc-mi{display:flex;gap:12px;align-items:flex-start;}
.loc-mi-ico{font-size:1.3rem;flex-shrink:0;}
.loc-mi-t{font-size:.7rem;letter-spacing:.16em;text-transform:uppercase;color:var(--muted);font-weight:600;}
.loc-mi-v{font-size:.88rem;color:var(--ink);margin-top:3px;font-weight:500;}
.loc-map{aspect-ratio:4/5;border-radius:var(--r-lg);overflow:hidden;box-shadow:var(--shad-md);position:relative;background:var(--bg-3);}
.loc-map img{width:100%;height:100%;object-fit:cover;}
.loc-map-cta{position:absolute;bottom:18px;left:18px;right:18px;background:var(--bg);padding:14px 18px;border-radius:var(--r);display:flex;justify-content:space-between;align-items:center;box-shadow:var(--shadow);}
.loc-map-cta span{font-size:.78rem;font-weight:600;color:var(--ink);}
.loc-map-cta a{font-size:.66rem;font-weight:600;letter-spacing:.12em;text-transform:uppercase;color:var(--accent-dark);}

/* ── FOOTER ── */
.footer{background:var(--ink);color:var(--bg);padding:clamp(56px,7vw,90px) 0 0;}
.footer-grid{display:grid;grid-template-columns:2fr 1fr 1fr 1.4fr;gap:clamp(30px,3vw,60px);max-width:1480px;margin:0 auto;padding:0 clamp(16px,3vw,48px);}
@media(max-width:880px){.footer-grid{grid-template-columns:1fr 1fr;}}
@media(max-width:540px){.footer-grid{grid-template-columns:1fr;}}
.foot-brand h3{font-family:var(--display);font-size:1.8rem;letter-spacing:.02em;}
.foot-brand .logo-sub{color:var(--accent-soft);margin-top:4px;}
.foot-desc{font-size:.84rem;color:rgba(251,248,243,.65);line-height:1.85;margin:18px 0 22px;max-width:300px;}
.foot-wa{display:inline-flex;align-items:center;gap:8px;background:#25D366;color:#fff;padding:10px 18px;border-radius:30px;font-size:.7rem;font-weight:600;letter-spacing:.1em;transition:all .22s;}
.foot-wa:hover{background:#1ebe5d;transform:translateY(-1px);}
.foot-col h4{font-size:.68rem;letter-spacing:.22em;text-transform:uppercase;color:var(--accent-soft);margin-bottom:18px;font-weight:600;}
.foot-col li{margin-bottom:11px;}
.foot-col a,.foot-col p{font-size:.82rem;color:rgba(251,248,243,.6);transition:color .2s;}
.foot-col a:hover{color:var(--accent-soft);}
.foot-col address{font-style:normal;}
.foot-bottom{margin-top:clamp(40px,5vw,70px);border-top:1px solid rgba(251,248,243,.1);padding:22px clamp(16px,3vw,48px);text-align:center;font-size:.7rem;color:rgba(251,248,243,.5);letter-spacing:.06em;}

/* ── CART DRAWER ── */
.cart-bk{position:fixed;inset:0;background:rgba(31,27,22,.55);z-index:1800;backdrop-filter:blur(4px);opacity:0;pointer-events:none;transition:opacity .3s;}
.cart-bk.open{opacity:1;pointer-events:auto;}
.cart-pn{position:fixed;top:0;right:0;bottom:0;width:min(440px,100vw);z-index:1900;background:var(--bg);display:flex;flex-direction:column;box-shadow:-12px 0 50px rgba(0,0,0,.2);transform:translateX(100%);transition:transform .42s var(--ease);}
.cart-pn.open{transform:translateX(0);}
.cart-hd{padding:24px 26px;border-bottom:1px solid var(--line);display:flex;justify-content:space-between;align-items:center;}
.cart-hd h3{font-family:var(--serif);font-size:1.7rem;font-weight:500;}
.cart-hd .cart-sub{font-size:.66rem;letter-spacing:.16em;text-transform:uppercase;color:var(--muted);margin-top:3px;}
.cart-x{width:36px;height:36px;border-radius:50%;background:var(--bg-2);display:flex;align-items:center;justify-content:center;font-size:.9rem;color:var(--ink);transition:all .2s;}
.cart-x:hover{background:var(--ink);color:var(--bg);}
.cart-body{flex:1;overflow-y:auto;padding:18px 22px;}
.cart-empty{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:60px 30px;text-align:center;color:var(--muted);}
.cart-empty-ico{font-size:3.4rem;opacity:.4;margin-bottom:18px;}
.cart-empty p{font-family:var(--serif);font-size:1.4rem;color:var(--ink-2);margin-bottom:6px;}
.cart-empty small{font-size:.78rem;}
.cart-item{display:flex;gap:14px;padding:16px 0;border-bottom:1px solid var(--line);}
.cart-item:last-child{border-bottom:none;}
.ci-img{width:70px;height:84px;border-radius:var(--r);overflow:hidden;background:var(--bg-2);flex-shrink:0;}
.ci-img img{width:100%;height:100%;object-fit:cover;}
.ci-info{flex:1;min-width:0;}
.ci-name{font-family:var(--serif);font-size:1.05rem;font-weight:500;color:var(--ink);line-height:1.25;}
.ci-meta{font-size:.7rem;color:var(--muted);margin-top:4px;display:flex;align-items:center;gap:6px;flex-wrap:wrap;}
.ci-cdot{width:10px;height:10px;border-radius:50%;border:1px solid var(--line-2);}
.ci-btm{display:flex;align-items:center;gap:10px;margin-top:10px;}
.ci-qty{display:flex;align-items:center;border:1px solid var(--line-2);border-radius:20px;overflow:hidden;}
.ci-qty button{width:28px;height:28px;color:var(--ink);font-size:.95rem;font-weight:600;transition:background .15s;}
.ci-qty button:hover{background:var(--bg-2);}
.ci-qty span{font-size:.78rem;font-weight:600;color:var(--ink);min-width:24px;text-align:center;}
.ci-price{font-size:.92rem;font-weight:700;color:var(--accent-dark);margin-left:auto;}
.ci-del{font-size:1rem;color:var(--muted);padding:4px;transition:color .15s;}
.ci-del:hover{color:var(--terracotta);}
.cart-ft{padding:22px 26px 26px;border-top:1px solid var(--line);background:var(--bg-2);}
.cart-tot{display:flex;justify-content:space-between;align-items:baseline;margin-bottom:18px;}
.cart-tot-l{font-size:.7rem;letter-spacing:.2em;text-transform:uppercase;color:var(--muted);font-weight:600;}
.cart-tot-v{font-family:var(--serif);font-size:2rem;font-weight:500;color:var(--ink);}
.cart-wa{width:100%;background:linear-gradient(135deg,#25D366,#1ebe5d);color:#fff;padding:15px;border-radius:30px;font-size:.74rem;font-weight:600;letter-spacing:.16em;text-transform:uppercase;display:flex;align-items:center;justify-content:center;gap:9px;box-shadow:0 8px 24px rgba(37,211,102,.3);transition:all .25s;}
.cart-wa:hover{transform:translateY(-2px);box-shadow:0 12px 32px rgba(37,211,102,.45);}
.cart-note{font-size:.62rem;color:var(--muted);text-align:center;margin-top:10px;letter-spacing:.06em;}

/* ── TOAST ── */
.toast{position:fixed;bottom:30px;left:50%;transform:translateX(-50%) translateY(20px);background:var(--ink);color:var(--bg);padding:13px 26px;border-radius:30px;font-size:.78rem;letter-spacing:.04em;opacity:0;pointer-events:none;z-index:9999;transition:all .3s var(--spring);box-shadow:0 8px 30px rgba(0,0,0,.25);}
.toast.on{opacity:1;transform:translateX(-50%) translateY(0);}
@media(max-width:980px){.toast{bottom:78px;}}

/* ── ANIMATIONS ── */
@keyframes fup{from{opacity:0;transform:translateY(28px);}to{opacity:1;transform:translateY(0);}}
.a1{animation:fup .7s var(--ease) both;}
.a2{animation:fup .7s .15s var(--ease) both;}
.a3{animation:fup .7s .3s var(--ease) both;}
.a4{animation:fup .7s .45s var(--ease) both;}

@keyframes spin{to{transform:rotate(360deg);}}
.loader{width:32px;height:32px;border:2.5px solid var(--line);border-top-color:var(--accent);border-radius:50%;animation:spin .9s linear infinite;}
.loading-wrap{display:flex;flex-direction:column;align-items:center;gap:16px;padding:80px 20px;color:var(--muted);}
.loading-wrap small{font-size:.78rem;letter-spacing:.06em;}

/* Skeleton cards */
.skel-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:clamp(18px,2vw,32px);}
@media(max-width:1100px){.skel-grid{grid-template-columns:repeat(3,1fr);}}
@media(max-width:780px){.skel-grid{grid-template-columns:repeat(2,1fr);gap:14px;}}
.skel-card{background:var(--bg-2);border-radius:var(--r-lg);overflow:hidden;}
.skel-img{aspect-ratio:4/5;background:linear-gradient(90deg,var(--bg-2) 0%,var(--bg-3) 50%,var(--bg-2) 100%);background-size:200% 100%;animation:shimmer 1.4s linear infinite;}
.skel-line{height:12px;background:var(--bg-3);border-radius:6px;margin:12px 14px;}
.skel-line.short{width:50%;}
@keyframes shimmer{from{background-position:200% 0;}to{background-position:-200% 0;}}
`;

/* ═══════════════════════════════════════════════════════
   ICONS
═══════════════════════════════════════════════════════ */
const CartIcon = ({ s = 20 }) => (
  <svg width={s} height={s} fill="none" stroke="currentColor" strokeWidth="1.6" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
    <line x1="3" y1="6" x2="21" y2="6" />
    <path d="M16 10a4 4 0 01-8 0" />
  </svg>
);
const WaIcon = ({ s = 16 }) => (
  <svg width={s} height={s} fill="currentColor" viewBox="0 0 24 24">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

/* ═══════════════════════════════════════════════════════
   SHARED COMPONENTS
═══════════════════════════════════════════════════════ */
function LoadingGrid({ cols = 4 }) {
  return (
    <div className="skel-grid">
      {Array.from({ length: cols * 2 }).map((_, i) => (
        <div className="skel-card" key={i}>
          <div className="skel-img" />
          <div className="skel-line" />
          <div className="skel-line short" />
        </div>
      ))}
    </div>
  );
}

function SH({ eye, h2, p }) {
  return (
    <div className="sh">
      <div className="sh-eye">{eye}</div>
      <h2 className="sh-h2" dangerouslySetInnerHTML={{ __html: h2 }} />
      {p && <p className="sh-p">{p}</p>}
    </div>
  );
}

/* ── PRODUCT CARD ── */
function ProductCard({ prod, onAdd, variant = 'fashion' }) {
  const [color, setColor] = useState('');
  const [size, setSize] = useState('');
  const [qty, setQty] = useState(1);
  const [ok, setOk] = useState(false);

  const outOfStock = prod.availability === 'out';
  const tagMap = { Bestseller: 'best', New: 'new', 'Pre-Order': 'pre', Cashmere: 'cash', Popular: 'best', 'Low Stock': 'pre' };

  const add = () => {
    if (outOfStock) return;
    if (prod.colors?.length && !color) { alert('Please select a colour'); return; }
    if (prod.sizes?.length > 1 && !size) { alert('Please select a size'); return; }
    onAdd(prod, color, size || prod.sizes?.[0] || '', qty);
    setOk(true); setTimeout(() => setOk(false), 1800);
  };

  return (
    <div className="pc">
      <div className="pc-img-w">
        {prod.tag && <span className={`pc-tag tag-${tagMap[prod.tag] || 'new'}`}>{prod.tag}</span>}
        <div className="pc-stock">
          <span className={`stock-dot stock-${prod.availability || 'in'}`} />
          {prod.availability === 'lo' ? 'Low Stock' : prod.availability === 'out' ? 'Sold Out' : 'In Stock'}
        </div>
        <img src={prod.img} alt={prod.name} loading="lazy" />
      </div>
      <div className="pc-info">
        <div className="pc-lbl">{prod.label || prod.category_name || 'Knit & Melt'}</div>
        <div className="pc-name">{prod.name}</div>
        <div className="pc-price">
          ₹{Number(prod.price).toLocaleString()}
        </div>
        {prod.colors?.length > 0 && (
          <div className="pc-colors">
            {prod.colors.map(c => (
              <button key={c} className={`pc-cdot${color === c ? ' sel' : ''}`}
                style={{ background: COLORS[c] || '#888' }}
                onClick={() => setColor(c)} title={c} />
            ))}
          </div>
        )}
        {prod.sizes?.length > 1 && (
          <div className="pc-selrow">
            {prod.sizes.map(s => (
              <button key={s} className={`pc-sz${size === s ? ' sel' : ''}`} onClick={() => setSize(s)}>{s}</button>
            ))}
          </div>
        )}
        <div className="pc-selrow">
          {variant === 'fashion' && (
            <div className="pc-qty">
              <button className="pc-qb" onClick={() => setQty(q => Math.max(1, q - 1))}>−</button>
              <input className="pc-qn" type="text" value={qty} readOnly />
              <button className="pc-qb" onClick={() => setQty(q => Math.min(99, q + 1))}>+</button>
            </div>
          )}
        </div>
        <button className={`pc-add${ok ? ' ok' : ''} ${outOfStock ? 'out' : ''}`} onClick={add} disabled={outOfStock}>
          {ok ? '✓ Added to Cart' : outOfStock ? 'Sold Out' : <>{variant === 'choc' ? 'Add to Cart' : 'Add to Cart'} →</>}
        </button>
      </div>
    </div>
  );
}

/* ── CART DRAWER ── */
function CartDrawer({ open, onClose, items, onDel, onQty, total, sendWA }) {
  return (
    <>
      <div className={`cart-bk${open ? ' open' : ''}`} onClick={onClose} />
      <div className={`cart-pn${open ? ' open' : ''}`}>
        <div className="cart-hd">
          <div>
            <h3>Your Selection</h3>
            <div className="cart-sub">{items.length} {items.length === 1 ? 'item' : 'items'} · Knit & Melt</div>
          </div>
          <button className="cart-x" onClick={onClose}>✕</button>
        </div>
        <div className="cart-body">
          {items.length === 0 ? (
            <div className="cart-empty">
              <div className="cart-empty-ico">🛍️</div>
              <p>Your cart awaits</p>
              <small>Add a piece of Ooty to begin</small>
            </div>
          ) : items.map(it => (
            <div className="cart-item" key={it.key}>
              <div className="ci-img">
                {it.p.img ? <img src={it.p.img} alt={it.p.name} /> : <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', fontSize: '1.6rem' }}>{it.p.emoji || '📦'}</span>}
              </div>
              <div className="ci-info">
                <div className="ci-name">{it.p.name}</div>
                <div className="ci-meta">
                  {it.color && <><span className="ci-cdot" style={{ background: COLORS[it.color] || '#888' }} />{it.color}</>}
                  {it.color && it.size && ' · '}
                  {it.size && `Size ${it.size}`}
                </div>
                <div className="ci-btm">
                  <div className="ci-qty">
                    <button onClick={() => onQty(it.key, it.qty - 1)}>−</button>
                    <span>{it.qty}</span>
                    <button onClick={() => onQty(it.key, it.qty + 1)}>+</button>
                  </div>
                  <span className="ci-price">₹{(it.p.price * it.qty).toLocaleString()}</span>
                  <button className="ci-del" onClick={() => onDel(it.key)}>🗑</button>
                </div>
              </div>
            </div>
          ))}
        </div>
        {items.length > 0 && (
          <div className="cart-ft">
            <div className="cart-tot">
              <span className="cart-tot-l">Order Total</span>
              <span className="cart-tot-v">₹{total.toLocaleString()}</span>
            </div>
            <button className="cart-wa" onClick={sendWA}>
              <WaIcon /> Send Order on WhatsApp
            </button>
            <p className="cart-note">Item · Colour · Size · Qty — auto-filled</p>
          </div>
        )}
      </div>
    </>
  );
}

/* ── FOOTER ── */
function Footer({ nav }) {
  return (
    <footer className="footer">
      <div className="footer-grid">
        <div className="foot-brand">
          <h3>Knit & Melt</h3>
          <div className="logo-sub">Ooty · Est. with love</div>
          <p className="foot-desc">Curated winter wear and artisanal chocolates from the misty Nilgiri hills. Crafted for those who refuse the ordinary.</p>
          <a href="https://wa.me/918675554222" target="_blank" rel="noreferrer" className="foot-wa">
            <WaIcon /> +91 8675554222
          </a>
        </div>
        <div className="foot-col">
          <h4>Shop</h4>
          <ul>
            {[['Sweaters', 'sweaters'], ['Chocolates', 'chocolates'], ['Shawls & Stoles', 'shawls'], ['Caps & Beanies', 'caps'], ['Perfumes & Tea', 'perfumes']].map(([l, p]) => (
              <li key={p}><a href="#" onClick={e => { e.preventDefault(); nav(p); }}>{l}</a></li>
            ))}
          </ul>
        </div>
        <div className="foot-col">
          <h4>Information</h4>
          <ul>
            {['About Us', 'Our Story', 'Delivery & Returns', 'Care Guide', 'Contact'].map(t => (
              <li key={t}><a href="#">{t}</a></li>
            ))}
          </ul>
        </div>
        <div className="foot-col">
          <h4>Visit Our Boutique</h4>
          <address>
            <p>Shops No. 23 & 24</p>
            <p>Boathouse Road, Ooty</p>
            <p>Tamil Nadu, India</p>
            <br />
            <p>📞 +91 8675554222</p>
            <p>⏰ Open 9 AM – 8 PM daily</p>
          </address>
          <a href="https://maps.google.com?q=Boathouse+Ooty" target="_blank" rel="noreferrer" style={{ display: 'inline-block', marginTop: '12px', fontSize: '.7rem', letterSpacing: '.12em', textTransform: 'uppercase', color: 'var(--accent-soft)', fontWeight: 600 }}>📍 Open in Maps →</a>
        </div>
      </div>
      <div className="foot-bottom">
        © 2025 Knit & Melt · Designed by Shruthi · Crafted in Ooty
      </div>
    </footer>
  );
}

/* ═══════════════════════════════════════════════════════
   PAGES
═══════════════════════════════════════════════════════ */

/* ── HOME ── */
function HomePage({ nav, onAdd }) {
  const { products: chocs, loading: lc } = useProducts('chocolates');
  const { products: shawls, loading: ls } = useProducts('shawls');
  const { products: sweaters, loading: lsw } = useProducts('sweaters');

  const cats = [
    { label: 'Ladies Sweaters', sub: 'Elegant hand-knits', page: 'sweaters', img: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=700&q=80', cls: 'cat-tall' },
    { label: 'Fine Chocolates', sub: '50 artisanal varieties', page: 'chocolates', img: 'https://images.unsplash.com/photo-1511381939415-e44015466834?w=900&q=80', cls: 'cat-wide' },
    { label: 'Shawls & Stoles', sub: 'Pashmina · Kashmir', page: 'shawls', img: 'https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=600&q=80', cls: 'cat-sq' },
    { label: 'Caps & Beanies', sub: 'Wool · Fleece', page: 'caps', img: 'https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?w=600&q=80', cls: 'cat-sq' },
  ];

  return (
    <div>
      {/* HERO */}
      <section className="hero">
        <div className="container">
          <div className="hero-grid">
            <div className="hero-l">
              <div className="hero-eye a1">Boathouse Ooty · Since the hills</div>
              <h1 className="hero-h1 a2">Knit &<br /><em>Melt</em></h1>
              <p className="hero-p a3">Where mountain chill meets timeless warmth. Discover handcrafted winter wear and artisan chocolates from the heart of the Nilgiris.</p>
              <div className="hero-btns a4">
                <button className="btn-pri" onClick={() => nav('sweaters')}>Explore Winter Wear →</button>
                <button className="btn-sec" onClick={() => nav('chocolates')}>Fine Chocolates</button>
              </div>
            </div>
            <div className="hero-r a3">
              <div className="hero-img-main">
                <img src="https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=900&q=80" alt="Ooty knitwear" />
              </div>
              <div className="hero-badge">
                <div className="hero-badge-n">80+</div>
                <div className="hero-badge-l">Curated Pieces</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MARQUEE */}
      <div className="marquee">
        <div className="marquee-track">
          {['Handcrafted in Ooty', 'Premium Cashmere', 'Artisan Chocolates', 'Nilgiri Tea', 'Boathouse Boutique', 'Since the Hills'].map((t, i) => (
            <span className="marquee-item" key={i}>{t}</span>
          ))}
          {['Handcrafted in Ooty', 'Premium Cashmere', 'Artisan Chocolates', 'Nilgiri Tea', 'Boathouse Boutique', 'Since the Hills'].map((t, i) => (
            <span className="marquee-item" key={`b-${i}`}>{t}</span>
          ))}
        </div>
      </div>

      {/* TRUST */}
      <div className="trust">
        <div className="trust-i">
          <div className="trust-item"><span className="trust-ico">🏪</span><div><div className="trust-t">Boutique Store</div><div className="trust-s">Boathouse Road, Ooty</div></div></div>
          <div className="trust-item"><span className="trust-ico">📱</span><div><div className="trust-t">WhatsApp Orders</div><div className="trust-s">Quick & easy ordering</div></div></div>
          <div className="trust-item"><span className="trust-ico">🚚</span><div><div className="trust-t">Pan-India Delivery</div><div className="trust-s">Carefully packed</div></div></div>
          <div className="trust-item"><span className="trust-ico">💎</span><div><div className="trust-t">Premium Quality</div><div className="trust-s">Curated with care</div></div></div>
        </div>
      </div>

      {/* CATEGORIES */}
      <section className="sec cat-sec">
        <div className="container">
          <SH eye="The Collections" h2="Explore by <em>Category</em>" p="From cosy knits to melt-in-your-mouth chocolates — each piece chosen with intention." />
          <div className="cat-grid">
            {cats.map((c, i) => (
              <div key={i} className={`cat-card ${c.cls}`} onClick={() => nav(c.page)}>
                <img src={c.img} alt={c.label} loading="lazy" />
                <div className="cat-ov" />
                <div className="cat-body">
                  <div className="cat-eye">Collection</div>
                  <div className="cat-name">{c.label}</div>
                  <div className="cat-sub">{c.sub}</div>
                  <div className="cat-cta">Discover <span>→</span></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BESTSELLERS — SWEATERS */}
      <section className="sec" style={{ background: 'var(--bg-2)' }}>
        <div className="container">
          <SH eye="Bestsellers" h2="Winter <em>Knitwear</em>" p="Our most-loved sweaters, hoodies and cardigans — crafted to keep you warm in style." />
          {lsw ? <LoadingGrid cols={4} /> : (
            <div className="prod-grid">
              {sweaters.slice(0, 4).map(p => <ProductCard key={p.id} prod={{ ...p, img: p.image_url }} onAdd={onAdd} />)}
            </div>
          )}
          <div style={{ textAlign: 'center', marginTop: '40px' }}>
            <button className="btn-sec" onClick={() => nav('sweaters')}>View All Sweaters →</button>
          </div>
        </div>
      </section>

      {/* QUOTE */}
      <section className="quote">
        <div className="container">
          <p className="quote-text">Every thread tells a story of the hills. Every chocolate, a moment of melt.</p>
          <div className="quote-by">— The Knit & Melt Philosophy</div>
        </div>
      </section>

      {/* CHOCOLATES PREVIEW */}
      <section className="sec" style={{ background: 'var(--bg)' }}>
        <div className="container">
          <SH eye="Ooty's Finest" h2="Artisan <em>Chocolates</em>" p="Handcrafted in small batches. Single-origin. Perfect for gifting — or savouring yourself." />
          {lc ? <LoadingGrid cols={4} /> : (
            <div className="choc-grid">
              {chocs.slice(0, 4).map(c => <ProductCard key={c.id} prod={{ ...c, img: c.image_url }} onAdd={onAdd} variant="choc" />)}
            </div>
          )}
          <div style={{ textAlign: 'center', marginTop: '40px' }}>
            <button className="btn-sec" onClick={() => nav('chocolates')}>View All 50 Chocolates →</button>
          </div>
        </div>
      </section>

      {/* SHAWL PREVIEW */}
      <section className="sec" style={{ background: 'var(--bg-2)' }}>
        <div className="container">
          <SH eye="Elegance Draped" h2="Shawls & <em>Stoles</em>" p="Handwoven traditions from Pashmina to Kashmir wool — timeless pieces for every occasion." />
          {ls ? <LoadingGrid cols={4} /> : (
            <div className="prod-grid">
              {shawls.slice(0, 4).map(s => <ProductCard key={s.id} prod={{ ...s, img: s.image_url }} onAdd={onAdd} />)}
            </div>
          )}
        </div>
      </section>

      {/* LOCATION */}
      <section className="sec loc-sec">
        <div className="container">
          <div className="loc-grid">
            <div className="loc-l">
              <div className="sh-eye" style={{ marginBottom: '14px' }}>Find Us</div>
              <h2>Visit Our <em>Boutique</em></h2>
              <p>Nestled by the iconic Boathouse in Ooty, our boutique welcomes you seven days a week. Touch the fabrics, taste the chocolates, and find your perfect piece.</p>
              <div className="loc-meta">
                <div className="loc-mi">
                  <span className="loc-mi-ico">📍</span>
                  <div>
                    <div className="loc-mi-t">Address</div>
                    <div className="loc-mi-v">Shops 23 & 24, Boathouse Road, Ooty</div>
                  </div>
                </div>
                <div className="loc-mi">
                  <span className="loc-mi-ico">⏰</span>
                  <div>
                    <div className="loc-mi-t">Hours</div>
                    <div className="loc-mi-v">9 AM – 8 PM, Daily</div>
                  </div>
                </div>
                <div className="loc-mi">
                  <span className="loc-mi-ico">📞</span>
                  <div>
                    <div className="loc-mi-t">Call / WhatsApp</div>
                    <div className="loc-mi-v">+91 8675554222</div>
                  </div>
                </div>
                <div className="loc-mi">
                  <span className="loc-mi-ico">🚚</span>
                  <div>
                    <div className="loc-mi-t">Delivery</div>
                    <div className="loc-mi-v">Pan-India shipping</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="loc-map">
              <img src="https://images.unsplash.com/photo-1525695230005-efd074980869?w=800&q=80" alt="Ooty" />
              <div className="loc-map-cta">
                <span>Boathouse Road, Ooty</span>
                <a href="https://maps.google.com?q=Boathouse+Ooty" target="_blank" rel="noreferrer">Open Maps →</a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer nav={nav} />
    </div>
  );
}

/* ── SWEATERS PAGE ── */
function SweatersPage({ onAdd }) {
  const tabs = ['All', 'Ladies', 'Mens', 'Premium'];
  const [active, setActive] = useState('All');
  const { products, loading } = useProducts('sweaters');
  const filtered = active === 'All' ? products : products.filter(s => s.label === active);

  return (
    <div>
      <div className="sec" style={{ background: 'var(--bg-2)', paddingBottom: '0' }}>
        <div className="container">
          <SH eye="Winter Wear" h2="Sweaters & <em>Knitwear</em>" p="Hand-knit elegance from the Nilgiris. Premium merino, cashmere, and wool blends." />
        </div>
      </div>

      <div className="filter-bar">
        <div className="filter-i">
          <span style={{ fontSize: '.7rem', fontWeight: 600, letterSpacing: '.14em', textTransform: 'uppercase', color: 'var(--muted)', flexShrink: 0, marginRight: '4px' }}>Filter:</span>
          {tabs.map(t => (
            <button key={t} className={`fchip${active === t ? ' act' : ''}`} onClick={() => setActive(t)}>{t}</button>
          ))}
          <span className="fcount">{filtered.length} Products</span>
        </div>
      </div>

      <section className="sec">
        <div className="container">
          {loading ? <LoadingGrid cols={4} /> : (
            <div className="prod-grid">
              {filtered.map(p => <ProductCard key={p.id} prod={{ ...p, img: p.image_url }} onAdd={onAdd} />)}
            </div>
          )}
        </div>
      </section>
      <Footer nav={() => {}} />
    </div>
  );
}

/* ── CHOCOLATES PAGE ── */
function ChocolatesPage({ onAdd }) {
  const { products, loading } = useProducts('chocolates');
  const [show, setShow] = useState(12);

  return (
    <div>
      <div className="sec" style={{ background: 'var(--bg-2)', paddingBottom: '0' }}>
        <div className="container">
          <SH eye="Ooty's Finest" h2="Artisan <em>Chocolates</em>" p="50 handpicked varieties. Single-origin. Truffles. Pralines. Perfect for gifting." />
        </div>
      </div>

      <div className="filter-bar">
        <div className="filter-i">
          <span className="fcount">{products.length} Varieties</span>
        </div>
      </div>

      <section className="sec">
        <div className="container">
          {loading ? <LoadingGrid cols={4} /> : (
            <>
              <div className="choc-grid">
                {products.slice(0, show).map(c => <ProductCard key={c.id} prod={{ ...c, img: c.image_url }} onAdd={onAdd} variant="choc" />)}
              </div>
              {show < products.length && (
                <div style={{ textAlign: 'center', marginTop: '50px' }}>
                  <button className="btn-sec" onClick={() => setShow(products.length)}>Load All {products.length} Chocolates →</button>
                </div>
              )}
            </>
          )}
        </div>
      </section>
      <Footer nav={() => {}} />
    </div>
  );
}

/* ── CAPS PAGE ── */
function CapsPage({ onAdd }) {
  const { products: caps, loading } = useProducts('caps');
  return (
    <div>
      <div className="sec" style={{ background: 'var(--bg-2)', paddingBottom: '0' }}>
        <div className="container">
          <SH eye="Winter Accessories" h2="Caps & <em>Beanies</em>" p="Woolen, fleece, pom-pom — every style to top off your winter look." />
        </div>
      </div>
      <div className="filter-bar"><div className="filter-i"><span className="fcount">{caps.length} Styles</span></div></div>
      <section className="sec">
        <div className="container">
          {loading ? <LoadingGrid cols={4} /> : (
            <div className="prod-grid">
              {caps.map(c => <ProductCard key={c.id} prod={{ ...c, img: c.image_url }} onAdd={onAdd} />)}
            </div>
          )}
        </div>
      </section>
      <Footer nav={() => {}} />
    </div>
  );
}

/* ── SHAWLS PAGE ── */
function ShawlsPage({ onAdd }) {
  const { products: shawls, loading } = useProducts('shawls');
  return (
    <div>
      <div className="sec" style={{ background: 'var(--bg-2)', paddingBottom: '0' }}>
        <div className="container">
          <SH eye="Elegance Draped" h2="Shawls & <em>Stoles</em>" p="Handwoven traditions · Pashmina · Kashmir · Wool blends." />
        </div>
      </div>
      <div className="filter-bar"><div className="filter-i"><span className="fcount">{shawls.length} Pieces</span></div></div>
      <section className="sec">
        <div className="container">
          {loading ? <LoadingGrid cols={4} /> : (
            <div className="prod-grid">
              {shawls.map(s => <ProductCard key={s.id} prod={{ ...s, img: s.image_url }} onAdd={onAdd} />)}
            </div>
          )}
        </div>
      </section>
      <Footer nav={() => {}} />
    </div>
  );
}

/* ── PERFUMES & TEA PAGE ── */
function PerfumesPage({ onAdd }) {
  const { products: perfumes, loading: lp } = useProducts('perfumes');
  const { products: teas, loading: lt } = useProducts('teas');

  return (
    <div>
      <div className="sec" style={{ background: 'var(--bg-2)', paddingBottom: '0' }}>
        <div className="container">
          <SH eye="Senses of the Hills" h2="Perfumes, Attars & <em>Tea</em>" p="Luxury fragrances and premium Nilgiri tea — straight from the estates." />
        </div>
      </div>

      <section className="sec dual-sec">
        <div className="container">
          <div className="dual-grid">
            <div className="dual-block">
              <div className="dual-h">Luxury Fragrances</div>
              <div className="dual-sh">Cedar · Rose · Sandalwood · Nilgiri blends</div>
              {lp ? <LoadingGrid cols={2} /> : (
                <div className="dual-list">
                  {perfumes.map(p => (
                    <div className="dual-item" key={p.id}>
                      <div className="dual-img"><img src={p.image_url} alt={p.name} /></div>
                      <div className="dual-info">
                        <div className="dual-name">{p.name}</div>
                        <div className="dual-meta">{p.notes || p.volume || 'Premium attar'}</div>
                        <div className="dual-price">₹{Number(p.price).toLocaleString()}</div>
                      </div>
                      <button className="dual-add" onClick={() => onAdd(p, '', '', 1)}>+</button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="dual-block">
              <div className="dual-h">Nilgiri Tea Powders</div>
              <div className="dual-sh">CTC · Green · Masala · Earl Grey</div>
              {lt ? <LoadingGrid cols={2} /> : (
                <div className="dual-list">
                  {teas.map(t => (
                    <div className="dual-item" key={t.id}>
                      <div className="dual-img"><img src={t.image_url} alt={t.name} /></div>
                      <div className="dual-info">
                        <div className="dual-name">{t.name}</div>
                        <div className="dual-meta">{t.product_type || t.weight || 'Estate fresh'}</div>
                        <div className="dual-price">₹{Number(t.price).toLocaleString()}</div>
                      </div>
                      <button className="dual-add" onClick={() => onAdd(t, '', '', 1)}>+</button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
      <Footer nav={() => {}} />
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   ROOT APP
═══════════════════════════════════════════════════════ */
export default function App() {
  const [page, setPage] = useState('home');
  const [cartOpen, setCartOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [cart, dispatch] = useReducer(cartReducer, []);
  const toast = useToast();

  // Persist cart
  useEffect(() => {
    try { const d = localStorage.getItem('km_cart_v3'); if (d) dispatch({ type: 'LOAD', data: JSON.parse(d) }); } catch (e) { }
  }, []);
  useEffect(() => {
    try { localStorage.setItem('km_cart_v3', JSON.stringify(cart)); } catch (e) { }
  }, [cart]);

  const nav = (p) => {
    setPage(p);
    setMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const addItem = useCallback((p, color, size, qty) => {
    dispatch({ type: 'ADD', p, color, size, qty });
    toast.show(`✓ ${p.name.split(' ').slice(0, 3).join(' ')} added to cart`);
  }, [toast]);

  const total = cart.reduce((s, i) => s + Number(i.p.price) * i.qty, 0);
  const count = cart.reduce((s, i) => s + i.qty, 0);

  const sendWA = async () => {
    if (!cart.length) { toast.show('🛒 Add items first'); return; }
    try { await api.createOrder(cart, total); } catch (e) { console.error('Order save failed:', e); }
    const msg = buildWhatsappMessage(cart, total);
    window.open(`https://wa.me/918675554222?text=${encodeURIComponent(msg)}`, '_blank');
    dispatch({ type: 'CLEAR' });
    toast.show('✅ Order sent! Check WhatsApp');
  };

  const navLinks = [
    { l: 'Home', p: 'home' },
    { l: 'Sweaters', p: 'sweaters' },
    { l: 'Chocolates', p: 'chocolates' },
    { l: 'Shawls', p: 'shawls' },
    { l: 'Perfumes & Tea', p: 'perfumes' },
    { l: 'Caps', p: 'caps' },
  ];

  return (
    <>
      <style>{CSS}</style>

      {/* ANNOUNCEMENT */}
      <div className="announce">✦ Free Local Delivery in Ooty · WhatsApp Orders Welcome ✦</div>

      {/* NAV */}
      <nav className="nav">
        <div className="nav-c">
          <div className="logo" onClick={() => nav('home')}>
            <div>
              <div className="logo-mono">Knit & Melt</div>
              <div className="logo-sub">Ooty · Boathouse</div>
            </div>
          </div>

          <div className="nav-links">
            {navLinks.map(n => (
              <button key={n.p} className={`nl${page === n.p ? ' act' : ''}`} onClick={() => nav(n.p)}>{n.l}</button>
            ))}
          </div>

          <div className="nav-r">
            <button className="icon-btn cart-btn" onClick={() => setCartOpen(true)}>
              <CartIcon s={20} />
              {count > 0 && <span className="cart-count">{count}</span>}
            </button>
            <a href="https://wa.me/918675554222" target="_blank" rel="noreferrer" className="wa-nav">
              <WaIcon /><span className="wa-nav-t">Order Now</span>
            </a>
            <button className={`hbg${menuOpen ? ' open' : ''}`} onClick={() => setMenuOpen(v => !v)}>
              <span /><span /><span />
            </button>
          </div>
        </div>

        <div className={`mob-menu${menuOpen ? ' open' : ''}`}>
          {navLinks.map(n => (
            <button key={n.p} className={`mob-link${page === n.p ? ' act' : ''}`} onClick={() => nav(n.p)}>{n.l}</button>
          ))}
        </div>
      </nav>

      {/* MOBILE BOTTOM NAV */}
      <div className="mob-bar">
        <div className="mob-bar-i">
          {[
            { l: 'Home', p: 'home', i: '🏠' },
            { l: 'Shop', p: 'sweaters', i: '🧥' },
            { l: 'Choco', p: 'chocolates', i: '🍫' },
            { l: 'Shawls', p: 'shawls', i: '🌿' },
          ].map(n => (
            <button key={n.p} className={`mbt${page === n.p ? ' act' : ''}`} onClick={() => nav(n.p)}>
              <span className="mbt-ico">{n.i}</span>{n.l}
            </button>
          ))}
          <button className="mbt" onClick={() => setCartOpen(true)}>
            <span className="mbt-ico">
              🛍️{count > 0 && <span className="mbt-badge">{count}</span>}
            </span>Cart
          </button>
        </div>
      </div>

      {/* PAGES */}
      <div className="page">
        {page === 'home' && <HomePage nav={nav} onAdd={addItem} />}
        {page === 'sweaters' && <SweatersPage onAdd={addItem} />}
        {page === 'chocolates' && <ChocolatesPage onAdd={addItem} />}
        {page === 'caps' && <CapsPage onAdd={addItem} />}
        {page === 'shawls' && <ShawlsPage onAdd={addItem} />}
        {page === 'perfumes' && <PerfumesPage onAdd={addItem} />}
      </div>

      {/* CART */}
      <CartDrawer
        open={cartOpen}
        onClose={() => setCartOpen(false)}
        items={cart}
        onDel={key => dispatch({ type: 'DEL', key })}
        onQty={(key, qty) => dispatch({ type: 'QTY', key, qty })}
        total={total}
        sendWA={sendWA}
      />

      {/* TOAST */}
      <div className={`toast${toast.on ? ' on' : ''}`}>{toast.msg}</div>
    </>
  );
}