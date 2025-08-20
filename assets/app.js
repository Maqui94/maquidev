
(function () {
  "use strict";
  document.documentElement.classList.add('js'); // activa modo reveal seguro

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

  // ===== Confetti mejorado =====
  try {
    const prefersReduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const canvas = document.getElementById("confetti");
    if (!canvas || prefersReduce) return;

    const ctx = canvas.getContext("2d");
    const dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1)); // nítido sin gastar CPU
    function resize(){
      const {width, height} = canvas.getBoundingClientRect();
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr,0,0,dpr,0,0); // escala para dibujar en CSS px
    }
    resize();
    addEventListener("resize", resize);

    const W = () => canvas.getBoundingClientRect().width;
    const H = () => canvas.getBoundingClientRect().height;

    // Paleta con más presencia
    const COLORS = [
      "rgba(255,214,10,0.55)", "rgba(255,179,0,0.45)", "rgba(255,233,122,0.42)",
      "rgba(32,44,64,0.35)", "rgba(124,34,34,0.30)", "rgba(38,61,94,0.32)"
    ];

    const COUNT = Math.min(140, Math.max(80, Math.floor((W()*H())/16000))); // densidad adaptativa
    const rand = (min,max)=>Math.random()*(max-min)+min;

    const SHAPES = ["square","circle","diamond","chev"];
    const parts = Array.from({length: COUNT}, () => ({
      x: rand(0, W()), y: rand(0, H()),
      s: rand(6, 18),
      vx: rand(-0.18, 0.18),
      vy: rand(0.06, 0.22),
      ang: rand(0, Math.PI*2),
      vang: rand(-0.015, 0.015),
      col: COLORS[(Math.random()*COLORS.length)|0],
      par: rand(0.03, 0.12),
      shape: SHAPES[(Math.random()*SHAPES.length)|0],
      wob: rand(0.6, 1.6), // ondulación
      life: rand(0, Math.PI*2)
    }));

    let targetPX=0, targetPY=0, parX=0, parY=0, t=0;
    addEventListener("mousemove", e=>{
      const r = canvas.getBoundingClientRect();
      const cx = r.left + r.width/2, cy = r.top + r.height/2;
      targetPX = (e.clientX - cx) / (r.width/2);
      targetPY = (e.clientY - cy) / (r.height/2);
    }, {passive:true});

    function drawParticle(p){
      ctx.save();
      const offX = parX * 36 * p.par, offY = parY * 36 * p.par;
      const wobble = Math.sin(t * p.wob + p.life) * 2.0;
      ctx.translate(p.x + offX + wobble, p.y + offY);
      ctx.rotate(p.ang);
      ctx.fillStyle = p.col;
      const s = p.s;

      switch (p.shape) {
        case "circle": ctx.beginPath(); ctx.arc(0,0,s*0.55,0,Math.PI*2); ctx.fill(); break;
        case "diamond": ctx.beginPath(); ctx.moveTo(0,-s/1.4); ctx.lineTo(s/1.4,0); ctx.lineTo(0,s/1.4); ctx.lineTo(-s/1.4,0); ctx.closePath(); ctx.fill(); break;
        case "chev":
          ctx.beginPath(); ctx.moveTo(-s*0.4,-s*0.2); ctx.lineTo(0,s*0.4); ctx.lineTo(s*0.4,-s*0.2);
          ctx.lineWidth = 2; ctx.strokeStyle = p.col; ctx.stroke(); break;
        default: ctx.fillRect(-s/2,-s/2,s,s); // square
      }
      ctx.restore();
    }

    (function tick(){
      t += 0.016;
      parX += (targetPX - parX) * 0.06;
      parY += (targetPY - parY) * 0.06;

      ctx.clearRect(0,0, W(), H());
      for (const p of parts){
        p.x += p.vx; p.y += p.vy; p.ang += p.vang;

        if (p.x < -24) p.x = W()+24; else if (p.x > W()+24) p.x = -24;
        if (p.y < -24) p.y = H()+24; else if (p.y > H()+24) p.y = -24;

        drawParticle(p);
      }
      requestAnimationFrame(tick);
    })();
  } catch (err) { console.warn("Confetti deshabilitado:", err); }

  // ===== Botones / footer =====
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
  if (fm)  fm.addEventListener("click", e => { e.preventDefault(); openMail(); });

  const y = document.getElementById("y");
  if (y) y.textContent = new Date().getFullYear();
})();
