/* Maison Saint Sauveur : mise en page des catalogues (provisoire).
   Utilisée par le registre (fichier autonome, PDF) et par la page catalogue.html (lien privé). */
(function () {
  const esc = s => String(s == null ? "" : s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const T = {
    fr: { oeuvres: "œuvres", oeuvre: "œuvre", prix: "Prix", vendue: "Vendue", reservee: "Réservée", ed: "Tirage", ex: "ex.", sans: "Sans titre" },
    en: { oeuvres: "works", oeuvre: "work", prix: "Price", vendue: "Sold", reservee: "Reserved", ed: "Edition of", ex: "", sans: "Untitled" }
  };
  const SB = "https://imgpydatjmsxurjwpqpt.supabase.co/storage/v1/object/public/visuels/";
  function imgUrl(v) { if (!v || !v.id || String(v.id).indexOf("/") < 0) return ""; return SB + String(v.id).split("/").map(encodeURIComponent).join("/"); }
  function eur(n) { const x = Number(String(n).replace(/\s/g, "").replace(",", ".")); return isFinite(x) && x > 0 ? x.toLocaleString("fr-FR", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }) : ""; }
  const CSS = `
*{box-sizing:border-box}html{-webkit-text-size-adjust:100%}
body{margin:0;background:#F4F3EF;color:#1B2124;font-family:"Cormorant Garamond","Iowan Old Style",Georgia,serif;line-height:1.45}
.cov{min-height:92vh;display:flex;flex-direction:column;justify-content:flex-end;padding:9vh 7vw 8vh;border-bottom:1px solid #DAD9D2}
.cov .m{font-family:"Helvetica Neue",Arial,sans-serif;font-size:11px;letter-spacing:.22em;text-transform:uppercase;color:#5C676C;margin:0 0 auto}
.cov h1{font-weight:400;font-size:clamp(40px,7vw,76px);line-height:1.02;margin:0 0 28px;font-style:italic}
.cov .i{font-size:clamp(18px,2.2vw,22px);max-width:36em;margin:0 0 32px;color:#2c3437}
.cov .d{font-family:"Helvetica Neue",Arial,sans-serif;font-size:12px;letter-spacing:.08em;color:#5C676C;margin:0}
.w{display:grid;grid-template-columns:minmax(0,1.35fr) minmax(0,1fr);gap:5vw;align-items:center;padding:8vh 7vw;border-bottom:1px solid #DAD9D2}
.w figure{margin:0;background:#E8E6E0;display:flex;align-items:center;justify-content:center;min-height:42vh}
.w figure img{display:block;max-width:100%;max-height:78vh;object-fit:contain}
.w figure.vide{min-height:30vh}
.c p{margin:0 0 6px;font-size:17px}
.c .n{font-family:"Helvetica Neue",Arial,sans-serif;font-size:11px;letter-spacing:.2em;color:#5C676C;margin-bottom:18px}
.c .a{font-family:"Helvetica Neue",Arial,sans-serif;font-size:12px;letter-spacing:.16em;text-transform:uppercase;margin-bottom:8px}
.c h2{font-weight:400;font-style:italic;font-size:clamp(26px,3vw,34px);line-height:1.1;margin:0 0 16px}
.c h2 span{font-style:normal;color:#5C676C}
.c .t{margin-top:18px;color:#2c3437;white-space:pre-line}
.c .p,.c .s{font-family:"Helvetica Neue",Arial,sans-serif;font-size:13px;letter-spacing:.06em;margin-top:22px}
.c .s{color:#AE3629}
footer{padding:6vh 7vw;font-family:"Helvetica Neue",Arial,sans-serif;font-size:11px;letter-spacing:.18em;text-transform:uppercase;color:#5C676C}
@media (max-width:760px){.w{grid-template-columns:minmax(0,1fr);gap:28px;padding:7vh 6vw}.cov{padding:12vh 6vw 8vh}}`;
  const PRINT = `
@page{size:A4;margin:14mm}
body{background:#fff}
.cov{min-height:262mm;padding:20mm 6mm;break-after:page}
.w{grid-template-columns:minmax(0,1fr);gap:8mm;padding:6mm;min-height:262mm;break-after:page;break-inside:avoid;align-content:center}
.w figure{min-height:0;background:none}.w figure img{max-height:170mm}
footer{display:none}`;
  function html(cat, opt) {
    opt = opt || {}; const t = T[cat.langue] || T.fr; const imgs = opt.images || {};
    const list = cat.oeuvres || [];
    const works = list.map((o, i) => {
      const v = (o.visuels || []).find(x => !/^video/.test(x.t || ""));
      const src = imgs[i] || imgUrl(v);
      const alt = [o.auteur, o.titre].filter(Boolean).join(", ");
      return `<section class="w">${src ? `<figure><img src="${esc(src)}" alt="${esc(alt)}" loading="lazy"></figure>` : `<figure class="vide"></figure>`}<div class="c">` +
        `<p class="n">${String(i + 1).padStart(2, "0")}</p>${o.auteur ? `<p class="a">${esc(o.auteur)}</p>` : ""}` +
        `<h2>${esc(o.titre || t.sans)}${o.annee ? `<span>, ${esc(o.annee)}</span>` : ""}</h2>` +
        `${o.technique ? `<p>${esc(o.technique)}</p>` : ""}${o.dimensions ? `<p>${esc(o.dimensions)}</p>` : ""}` +
        `${o.edition ? `<p>${t.ed} ${esc(o.edition)} ${t.ex}</p>` : ""}${o.texte ? `<p class="t">${esc(o.texte)}</p>` : ""}` +
        `${o.statut ? `<p class="s">${o.statut === "Vendue" ? t.vendue : t.reservee}</p>` : (o.prix && eur(o.prix) ? `<p class="p">${t.prix} · ${esc(eur(o.prix))}</p>` : "")}` +
        `</div></section>`;
    }).join("");
    return `<!doctype html><html lang="${cat.langue === "en" ? "en" : "fr"}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><title>${esc(cat.titre || "Catalogue")} · Maison Saint Sauveur</title><style>${CSS}${opt.print ? PRINT : ""}</style></head><body>` +
      `<header class="cov"><p class="m">Maison Saint Sauveur</p><h1>${esc(cat.titre || "")}</h1>${cat.intro ? `<p class="i">${esc(cat.intro).replace(/\n/g, "<br>")}</p>` : ""}<p class="d">${esc(cat.date || "")}${cat.date ? " · " : ""}${list.length} ${list.length > 1 ? t.oeuvres : t.oeuvre}</p></header>` +
      works + `<footer>Maison Saint Sauveur · Concarneau · Paris</footer>` +
      (opt.print ? `<script>addEventListener("load",()=>setTimeout(()=>print(),500))<\/script>` : "") + `</body></html>`;
  }
  window.MSSCatalogue = { html, imgUrl, esc };
})();
