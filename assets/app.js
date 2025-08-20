/* app.js — @maquidev
   - Ofusca y activa enlaces sensibles (Revolut, GitHub, Email)
   - Conecta eventos solo tras interacción humana
   - Rellena el año del footer
*/
(function () {
  "use strict";

  // XOR decoder (ofuscación simple para scrapers básicos)
  function xorDecode(arr, key) {
    return String.fromCharCode.apply(null, arr.map(function (n) { return n ^ key; }));
  }

  
  var MAIL = [106,102,118,114,110,41,99,98,113,98,107,104,119,71,96,106,102,110,107,41,100,104,106], MAIL_KEY = 7;

  
  var REV_ALIAS = [102,99,117,110,102,105,125,50,100,63], REV_KEY = 7;

 
  var GH_USER = [106,102,118,114,110,62,51], GH_KEY = 7;

  // Construye URLs al vuelo (nueva pestaña)
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
   
    window.location.href = "mailto:" + mail;
  }

  // Conecta eventos tras interacción humana (reduce scraping pasivo)
  var wired = false;
  function wire() {
    if (wired) return; wired = true;

    var d1 = document.getElementById("btn-donate");
    var d2 = document.getElementById("btn-donate-2");
    var gh = document.getElementById("btn-github");
    var em = document.getElementById("btn-mail");
    var more = document.getElementById("btn-more");

    if (d1) d1.addEventListener("click", openDonate);
    if (d2) d2.addEventListener("click", openDonate);
    if (gh) gh.addEventListener("click", openGithub);
    if (em) em.addEventListener("click", openMail);
    if (more) more.addEventListener("click", function(){ openGithub(); });

    // Footer links
    var fgh = document.getElementById("f-github");
    var fm  = document.getElementById("f-mail");
    if (fgh) fgh.addEventListener("click", function (e) { e.preventDefault(); openGithub(); });
    if (fm)  fm.addEventListener("click", function (e) { e.preventDefault(); openMail(); });
  }

  window.addEventListener("pointerdown", wire, { once: true });
  window.addEventListener("keydown", wire, { once: true });
  window.addEventListener("load", function () { setTimeout(wire, 1200); });

  // Año dinámico en footer
  var y = document.getElementById("y");
  if (y) y.textContent = new Date().getFullYear();
})();
