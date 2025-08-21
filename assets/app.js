/* app.js — fixed header offset + mobile brand layout + burger + stable scrollspy (by position) + cursor glow + icons + secure links */
(function () {
  "use strict";
  document.documentElement.classList.add('js');

  /* ===== Secure (XOR) for email & Revolut ===== */
  function xorDecode(arr, key){ return String.fromCharCode.apply(null, arr.map(n => n ^ key)); }
  const MAIL      = [106,102,118,114,110,41,99,98,113,98,107,104,119,71,96,106,102,110,107,41,100,104,106], MAIL_KEY=7; 
  const REV_ALIAS = [102,99,117,110,102,105,125,50,100,63], REV_KEY=7; /
  function openDonate(){
    const alias = xorDecode(REV_ALIAS, REV_KEY);
    window.open(`https://revolut.me/${alias}`, "_blank", "noopener");
  }
  function openMail(){ window.location.href = "mailto:" + xorDecode(MAIL, MAIL_KEY); }

  /* ===== Elements ===== */
  const topbar = document.querySelector(".topbar");
  const burger = document.querySelector(".burger");
  const nav    = document.getElementById("navmenu");
  const spyLinks = [...document.querySelectorAll('[data-spy]')];
  const sectionIds = ["#start","#about","#experience","#projects","#contact"];
  const sections = sectionIds.map(id => document.querySelector(id)).filter(Boolean);

  /* ===== Header height → CSS var ===== */
  function setHeaderHeightVar() {
    const h = Math.max(56, topbar?.getBoundingClientRect().height || 64);
    document.documentElement.style.setProperty('--header-h', h + 'px');
  }
  setHeaderHeightVar();
  window.addEventListener('load', setHeaderHeightVar, { once:true });
  window.addEventListener('resize', setHeaderHeightVar, { passive:true });

  /* ===== Burger + show/hide nav (mobile) ===== */
  if (burger && topbar){
    burger.addEventListener("click", () => {
      const open = topbar.classList.toggle("open");
      burger.setAttribute("aria-expanded", String(open));
    });
  }

  /* ===== Smooth scroll on nav clicks ===== */
  document.addEventListener("click", (e) => {
    const a = e.target.closest('a[href^="#"]');
    if (!a) return;
    const href = a.getAttribute("href");
    const target = document.querySelector(href);
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior:"smooth", block:"start" });
    if (topbar.classList.contains("open")) {
      topbar.classList.remove("open");
      burger.setAttribute("aria-expanded","false");
    }
  });

  /* ===== Stable scrollspy (by position, no IO) ===== */
  let secMeta = [];
  function computeSectionMeta(){
    const headerH = Math.max(56, topbar?.getBoundingClientRect().height || 64);
    secMeta = sections.map(el => {
      const rect = el.getBoundingClientRect();
      const top = window.scrollY + rect.top - headerH - 8; // umbral
      const bottom = top + el.offsetHeight;
      return { id:"#"+el.id, top, bottom };
    });
  }
  computeSectionMeta();
  window.addEventListener('resize', () => { computeSectionMeta(); updateActive(); }, { passive:true });
  window.addEventListener('load',   () => { computeSectionMeta(); updateActive(); }, { once:true });

  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(() => { updateActive(); ticking = false; });
      ticking = true;
    }
  }, { passive:true });

  function updateActive(){
    const y = window.scrollY + (Math.max(56, topbar?.getBoundingClientRect().height || 64)) + 10;
    let current = secMeta.find(m => y >= m.top && y < m.bottom);
    if (!current) {
      // Si no encuentra (al final de la página), usa el último
      current = secMeta[secMeta.length - 1];
    }
    if (!current) return;
    spyLinks.forEach(lnk => lnk.classList.toggle("active", lnk.getAttribute("href") === current.id));
  }

  /* ===== Reveal on scroll (IO ok aquí) ===== */
  const revealEls = [...document.querySelectorAll("[data-reveal]")];
  if ("IntersectionObserver" in window && revealEls.length) {
    const rio = new IntersectionObserver(entries => {
      entries.forEach(en => { if (en.isIntersecting) { en.target.classList.add("in"); rio.unobserve(en.target); } });
    }, { threshold: 0.2 });
    revealEls.forEach(el => rio.observe(el));
  } else { revealEls.forEach(el => el.classList.add("in")); }

  /* ===== Cursor glow (hero radial follows pointer) ===== */
  const hero = document.querySelector(".hero-full");
  if (hero){
    let raf;
    function update(e){
      const rect = hero.getBoundingClientRect();
      hero.style.setProperty("--mx", (e.clientX - rect.left) + "px");
      hero.style.setProperty("--my", (e.clientY - rect.top) + "px");
    }
    const onMove = (e) => { cancelAnimationFrame(raf); raf = requestAnimationFrame(() => update(e)); };
    hero.addEventListener("pointermove", onMove);
    hero.style.setProperty("--mx","50%"); hero.style.setProperty("--my","50%");
  }

  /* ===== CTA / footer wire ===== */
  const navDonate = document.getElementById("nav-donate");
  const btnMail2  = document.getElementById("btn-mail-2");
  const fmail     = document.getElementById("f-mail");

  if (navDonate) navDonate.addEventListener("click", openDonate);
  if (btnMail2)  btnMail2.addEventListener("click", openMail);
  if (fmail)     fmail.addEventListener("click", (e)=>{ e.preventDefault(); openMail(); });

  const y = document.getElementById("y");
  if (y) y.textContent = new Date().getFullYear();

  /* ===== Lucide icons ===== */
  window.addEventListener('load', () => {
    if (window.lucide?.createIcons) window.lucide.createIcons();
  });
})();
