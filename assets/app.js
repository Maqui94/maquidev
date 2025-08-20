/* app.js — @maquidev
   - Ofusca y activa enlaces sensibles (Revolut, GitHub, Email)
   - NAV: burger + scroll suave + scrollspy (IntersectionObserver)
   - CTA persistente en topbar
   - Rellena el año del footer
*/
(function () {
  "use strict";

  // ======= UTIL: Ofuscación simple XOR =======
  function xorDecode(arr, key) {
    return String.fromCharCode.apply(null, arr.map(function (n) { return n ^ key; }));
  }

  
  var MAIL = [106,102,118,114,110,41,99,98,113,98,107,104,119,71,96,106,102,110,107,41,100,104,106], MAIL_KEY = 7;
  
  var REV_ALIAS = [102,99,117,110,102,105,125,50,100,63], REV_KEY = 7;
  
  var GH_USER = [106,102,118,114,110,62,51], GH_KEY = 7;

  function openDonate() {
    var alias = xorDecode(REV_ALIAS, REV_KEY);
    var url = ["https", "://", "revolut", ".", "me", "/", alias].join("");
    window.open(url, "_blank", "noopener");
  }
  function openGithub() {
    var user = xorDecode(GH_USER, GH_KEY);
    var url = ["https", "://", "github", ".", "com", "/", user].join("");
    window.open(url, "_blank", "noopener");
  }
  function openMail() {
    var mail = xorDecode(MAIL, MAIL_KEY);
    // Alternativa: copiar al portapapeles para no abrir cliente
    // navigator.clipboard.writeText(mail);
    window.location.href = "mailto:" + mail;
  }

  // ======= NAV: burger + scroll suave =======
  var topbar = document.querySelector(".topbar");
  var burger = document.querySelector(".burger");
  var navLinks = Array.prototype.slice.call(document.querySelectorAll('nav a[href^="#"]'));

  if (burger && topbar) {
    burger.addEventListener("click", function () {
      var open = topbar.classList.toggle("open");
      burger.setAttribute("aria-expanded", String(open));
    });
  }

  // Scroll suave manual (para navegadores sin CSS smooth)
  navLinks.forEach(function (a) {
    a.addEventListener("click", function (e) {
      var href = a.getAttribute("href");
      if (!href || href.charAt(0) !== "#") return;
      var target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
      if (topbar && topbar.classList.contains("open")) {
        topbar.classList.remove("open");
        if (burger) burger.setAttribute("aria-expanded", "false");
      }
    });
  });

  // ======= Scrollspy (marca activo en nav según la sección visible) =======
  var spyLinks = Array.prototype.slice.call(document.querySelectorAll('[data-spy]'));
  var sections = ["#inicio", "#proyectos", "#apoyar", "#contacto"]
    .map(function (id) { return document.querySelector(id); })
    .filter(Boolean);

  if ("IntersectionObserver" in window && sections.length) {
    var activeId = null;
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          activeId = "#" + entry.target.id;
          spyLinks.forEach(function (lnk) {
            lnk.classList.toggle("active", lnk.getAttribute("href") === activeId);
          });
        }
      });
    }, { rootMargin: "-40% 0px -50% 0px", threshold: [0, 0.2, 0.6, 1] });
    sections.forEach(function (sec) { io.observe(sec); });
  }

  // ======= Acciones de botones y enlaces (se activan tras interacción) =======
  var wired = false;
  function wire() {
    if (wired) return; wired = true;

    var d1 = document.getElementById("btn-donate");
    var d2 = document.getElementById("btn-donate-2");
    var d3 = document.getElementById("nav-donate");
    var gh = document.getElementById("btn-github");
    var em = document.getElementById("btn-mail");
    var em2 = document.getElementById("btn-mail-2");
    var more = document.getElementById("btn-more");

    if (d1) d1.addEventListener("click", openDonate);
    if (d2) d2.addEventListener("click", openDonate);
    if (d3) d3.addEventListener("click", openDonate);
    if (gh) gh.addEventListener("click", openGithub);
    if (em) em.addEventListener("click", openMail);
    if (em2) em2.addEventListener("click", openMail);
    if (more) more.addEventListener("click", function(){ openGithub(); });

    // Footer links
    var fgh = document.getElementById("f-github");
    var fm  = document.getElementById("f-mail");
    if (fgh) fgh.addEventListener("click", function (e) { e.preventDefault(); openGithub(); });
    if (fm)  fm.addEventListener("click", function (e) { e.preventDefault(); openMail(); });
  }
  window.addEventListener("pointerdown", wire, { once: true });
  window.addEventListener("keydown", wire, { once: true });
  window.addEventListener("load", function () { setTimeout(wire, 1000); });

  // Año dinámico en footer
  var y = document.getElementById("y");
  if (y) y.textContent = new Date().getFullYear();
})();
