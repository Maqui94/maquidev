/* app.js — NAV + seguridad + confetti
   - Ofuscación: Revolut, GitHub, Email
   - NAV: burger + scroll suave + scrollspy
   - Confetti: cuadrados flotantes + parallax con el ratón
   - Reveal on scroll
   - CTA “Invitar” solo en el nav
   - Año del footer
*/
(function () {
  "use strict";

  // ===== Ofuscación XOR =====
  function xorDecode(arr, key) { return String.fromCharCode.apply(null, arr.map(n => n ^ key)); }
  const MAIL = [106,102,118,114,110,41,99,98,113,98,107,104,119,71,96,106,102,110,107,41,100,104,106], MAIL_KEY = 7;  
  const REV_ALIAS = [102,99,117,110,102,105,125,50,100,63], REV_KEY = 7;   
  const GH_USER = [106,102,118,114,110,62,51], GH_KEY = 7;                

  function openDonate(){ window.open(["https","://","revolut",".","me","/", xorDecode(REV_ALIAS, REV_KEY)].join(""), "_blank", "noopener"); }
  function openGithub(){ window.open(["https","://","github",".","com","/", xorDecode(GH_USER, GH_KEY)].join(""), "_blank", "noopener"); }
  function openMail(){ window.location.href = "mailto:" + xorDecode(MAIL, MAIL_KEY); }

  // ===== NAV burger + scroll =====
  const topbar = document.querySelector(".topbar");
  const burger = document.querySelector(".burger");
  const navLinks = Array.from(document.querySelectorAll('nav a[href^="#"]'));
  if (burger && topbar) {
    burger.addEventListener("click", () => {
      const open = topbar.classList.toggle("open");
      burger.setAttribute("aria-expanded", String(open));
    });
  }
  navLinks.forEach(a => {
    a.addEventListener("click", e => {
      const href = a.getAttribute("href"); if(!href || href[0] !== "#") return;
      const target = document.querySelector(href); if(!target) return;
      e.preventDefault(); target.scrollIntoView({ behavior:"smooth", block:"start" });
      if (topbar.classList.contains("open")) { topbar.classList.remove("open"); burger.setAttribute("aria-expanded","false"); }
    });
  });

  // ===== Scrollspy =====
  const spyLinks = Array.from(document.querySelectorAll('[data-spy]'));
  const sections = ["#inicio","#experiencia","#proyectos","#contacto"]
    .map(id => document.querySelector(id)).filter(Boolean);
  if ("IntersectionObserver" in window && sections.length){
    const io = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if(entry.isIntersecting){
          const id = "#" + entry.target.id;
          spyLinks.forEach(lnk => lnk.classList.toggle("active", lnk.getAttribute("href") === id));
        }
      });
    }, { rootMargin:"-40% 0px -50% 0px", threshold:[0,0.25,0.6,1] });
    sections.forEach(sec => io.observe(sec));
  }

  // ===== Reveal on scroll =====
  const revealEls = Array.from(document.querySelectorAll("[data-reveal]"));
  if ("IntersectionObserver" in window && revealEls.length){
    const rio = new IntersectionObserver(entries => {
      entries.forEach(en => { if(en.isIntersecting){ en.target.classList.add("in"); rio.unobserve(en.target); } });
    }, { threshold:0.2 });
    revealEls.forEach(el => rio.observe(el));
  } else { revealEls.forEach(el => el.classList.add("in")); }

  // ===== Confetti (cuadraditos) =====
  (function confettiInit(){
    const prefersReduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const canvas = document.getElementById("confetti");
    if (!canvas || prefersReduce) return;
    const ctx = canvas.getContext("2d");
    let w = canvas.width = canvas.offsetWidth;
    let h = canvas.height = canvas.offsetHeight;

    // Colores (marca en amarillo + acentos oscuros, alfa bajos)
    const COLORS = [
      "rgba(255,214,10,0.35)", "rgba(255,179,0,0.28)", "rgba(255,233,122,0.25)",
      "rgba(28,41,68,0.25)", "rgba(124,34,34,0.20)", "rgba(38,61,94,0.22)"
    ];

    const isMobile = Math.min(w,h) < 680;
    const COUNT = isMobile ? 40 : 90;

    const rand = (min, max) => Math.random() * (max - min) + min;
    const parts = [];
    for (let i=0;i<COUNT;i++){
      parts.push({
        x: rand(0, w), y: rand(0, h),
        s: rand(6, 18),                      // tamaño
        vx: rand(-0.15, 0.15),               // velocidad base
        vy: rand(0.04, 0.15),
        ang: rand(0, Math.PI*2),             // ángulo de rotación
        vang: rand(-0.01, 0.01),
        col: COLORS[(Math.random()*COLORS.length)|0],
        par: rand(0.02, 0.12)                // factor parallax
      });
    }

    // Parallax con el ratón
    let targetPX = 0, targetPY = 0, parX = 0, parY = 0;
    window.addEventListener("mousemove", e=>{
      const cx = window.innerWidth/2, cy = window.innerHeight/2;
      targetPX = (e.clientX - cx) / cx;   // -1..1
      targetPY = (e.clientY - cy) / cy;
    }, {passive:true});

    // Resize
    const onResize = ()=>{ w = canvas.width = canvas.offsetWidth; h = canvas.height = canvas.offsetHeight; };
    window.addEventListener("resize", onResize);

    // Animación
    function tick(){
      // easing del parallax para que siga “suave”
      parX += (targetPX - parX) * 0.05;
      parY += (targetPY - parY) * 0.05;

      ctx.clearRect(0,0,w,h);
      for (let p of parts){
        p.x += p.vx; p.y += p.vy; p.ang += p.vang;

        // envolvente
        if (p.x < -20) p.x = w+20; else if (p.x > w+20) p.x = -20;
        if (p.y < -20) p.y = h+20; else if (p.y > h+20) p.y = -20;

        const offX = parX * 30 * p.par;   // desplazamiento por parallax
        const offY = parY * 30 * p.par;

        ctx.save();
        ctx.translate(p.x + offX, p.y + offY);
        ctx.rotate(p.ang);
        ctx.fillStyle = p.col;
        const s = p.s;
        ctx.fillRect(-s/2, -s/2, s, s);
        ctx.restore();
      }
      requestAnimationFrame(tick);
    }
    tick();
  })();

  // ===== Botones / CTA / footer =====
  const navDonate = document.getElementById("nav-donate");
  const gh  = document.getElementById("btn-github");
  const em  = document.getElementById("btn-mail");
  const em2 = document.getElementById("btn-mail-2");
  const fgh = document.getElementById("f-github");
  const fm  = document.getElementById("f-mail");

  if (navDonate) navDonate.addEventListener("click", openDonate);
  if (gh) gh.addEventListener("click", openGithub);
  if (em) em.addEventListener("click", openMail);
  if (em2) em2.addEventListener("click", openMail);
  if (fgh) fgh.addEventListener("click", e => { e.preventDefault(); openGithub(); });
  if (fm)  fm.addEventListener("click",
