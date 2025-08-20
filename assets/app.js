/* app.js — fixed header offset + nav + scrollspy + cursor glow + icons */
(function () {
  "use strict";
  document.documentElement.classList.add('js');

  // XOR obfuscation
  function xorDecode(arr, key){ return String.fromCharCode.apply(null, arr.map(n => n ^ key)); }
  const MAIL      = [106,102,118,114,110,41,99,98,113,98,107,104,119,71,96,106,102,110,107,41,100,104,106], MAIL_KEY=7;
  const REV_ALIAS = [102,99,117,110,102,105,125,50,100,63], REV_KEY=7;
  const GH_USER   = [106,102,118,114,110,62,51], GH_KEY=7;

  function openDonate(){ window.open(["https","://","revolut",".","me","/",xorDecode(REV_ALIAS,REV_KEY)].join(""),"_blank","noopener"); }
  function openGithub(){ window.open(["https","://","github",".","com","/",xorDecode(GH_USER,GH_KEY)].join(""),"_blank","noopener"); }
  function openMail(){ window.location.href="mailto:"+xorDecode(MAIL,MAIL_KEY); }

  const topbar = document.querySelector(".topbar");
  const burger = document.querySelector(".burger");
  const navLinks = [...document.querySelectorAll('nav a[href^="#"]')];

  // Header height → CSS var
  function setHeaderHeightVar() {
    const h = Math.max(56, topbar?.getBoundingClientRect().height || 64);
    document.documentElement.style.setProperty('--header-h', h + 'px');
  }
  setHeaderHeightVar();
  window.addEventListener('load', setHeaderHeightVar, { once:true });
  window.addEventListener('resize', setHeaderHeightVar, { passive:true });

  // NAV burger + smooth scroll
  if (burger && topbar){
    burger.addEventListener("click", () => {
      const open = topbar.classList.toggle("open");
      burger.setAttribute("aria-expanded", String(open));
    });
  }
  navLinks.forEach(a=>{
    a.addEventListener("click",e=>{
      const href=a.getAttribute("href"); if(!href||href[0]!=="#") return;
      const target=document.querySelector(href); if(!target) return;
      e.preventDefault(); target.scrollIntoView({behavior:"smooth",block:"start"});
      if(topbar.classList.contains("open")){ topbar.classList.remove("open"); burger.setAttribute("aria-expanded","false"); }
    });
  });

  // Scrollspy (robusto con header fijo)
  const spyLinks = [...document.querySelectorAll('[data-spy]')];
  const sections = ["#start","#about","#experience","#projects","#contact"]
    .map(id=>document.querySelector(id)).filter(Boolean);
  let io;
  function setupSpy(){
    if (io) io.disconnect();
    if (!("IntersectionObserver" in window) || !sections.length) { spyLinks[0]?.classList.add('active'); return; }
    const headerH = Math.max(56, topbar?.getBoundingClientRect().height || 64);
    io = new IntersectionObserver(entries=>{
      entries.forEach(entry=>{
        if(entry.isIntersecting){
          const id="#"+entry.target.id;
          spyLinks.forEach(lnk=>lnk.classList.toggle("active", lnk.getAttribute("href")===id));
        }
      });
    }, { rootMargin: `-${headerH + 6}px 0px -55% 0px`, threshold: [0, 0.25, 0.6, 1] });
    sections.forEach(sec => io.observe(sec));
  }
  setupSpy();
  window.addEventListener('resize', setupSpy, { passive:true });

  // Reveal on scroll
  const revealEls=[...document.querySelectorAll("[data-reveal]")];
  if("IntersectionObserver" in window && revealEls.length){
    const rio=new IntersectionObserver(entries=>{
      entries.forEach(en=>{ if(en.isIntersecting){ en.target.classList.add("in"); rio.unobserve(en.target); } });
    },{threshold:0.2});
    revealEls.forEach(el=>rio.observe(el));
  } else { revealEls.forEach(el=>el.classList.add("in")); }

  // Cursor glow
  const hero=document.querySelector(".hero-full");
  if(hero){
    let raf;
    function update(e){
      const rect=hero.getBoundingClientRect();
      hero.style.setProperty("--mx", (e.clientX - rect.left) + "px");
      hero.style.setProperty("--my", (e.clientY - rect.top) + "px");
    }
    const onMove=(e)=>{ cancelAnimationFrame(raf); raf=requestAnimationFrame(()=>update(e)); };
    hero.addEventListener("pointermove", onMove);
    hero.style.setProperty("--mx","50%"); hero.style.setProperty("--my","50%");
  }

  // CTAs / footer
  const navDonate=document.getElementById("nav-donate");
  const gh=document.getElementById("btn-github");
  const em2=document.getElementById("btn-mail-2");
  const fgh=document.getElementById("f-github");
  const fm=document.getElementById("f-mail");

  if(navDonate) navDonate.addEventListener("click",openDonate);
  if(gh) gh.addEventListener("click",openGithub);
  if(em2) em2.addEventListener("click",openMail);
  if(fgh) fgh.addEventListener("click",e=>{ e.preventDefault(); openGithub(); });
  if(fm)  fm.addEventListener("click",e=>{ e.preventDefault(); openMail(); });

  const y=document.getElementById("y");
  if(y) y.textContent=new Date().getFullYear();

  // Lucide icons
  window.addEventListener('load', () => {
    if (window.lucide?.createIcons) window.lucide.createIcons();
  });
})();
