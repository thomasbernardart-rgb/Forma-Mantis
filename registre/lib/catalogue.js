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
body{margin:0;background:#EEEAE2;color:#1C1B19;font-family:"IBM Plex Mono",ui-monospace,Menlo,monospace;font-size:13px;line-height:1.55}
.cap{font-size:11px;letter-spacing:.08em;text-transform:uppercase;line-height:1.7}
.mut{color:#6B675F}
.hd{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:40px;padding:48px 7vw 0}
.hd .r{border-top:1px solid #1C1B19;padding-top:10px}
.house{font-family:"Cormorant Garamond","Iowan Old Style",Georgia,serif;font-weight:600;font-size:22px;line-height:1.1;letter-spacing:.01em}
.cov{min-height:84vh;display:flex;flex-direction:column;justify-content:flex-end;padding:9vh 7vw 8vh;border-bottom:1px solid #CFC8BB}
.cov h1{font-weight:500;font-size:clamp(34px,6vw,72px);line-height:1.02;margin:0 0 24px;text-transform:uppercase;letter-spacing:.01em}
.cov .i{font-size:14px;max-width:44em;margin:0 0 28px}
.w{display:grid;grid-template-columns:minmax(0,1.35fr) minmax(0,1fr);gap:5vw;align-items:center;padding:8vh 7vw;border-bottom:1px solid #CFC8BB}
.w figure{margin:0;background:#E4DFD6;display:flex;align-items:center;justify-content:center;min-height:42vh}
.w figure img{display:block;max-width:100%;max-height:78vh;object-fit:contain}
.w figure.vide{min-height:30vh}
.c p{margin:0 0 4px}
.c .n{margin-bottom:16px}
.c .a{margin-bottom:6px}
.c h2{font-weight:500;font-size:clamp(20px,2.4vw,28px);line-height:1.15;margin:0 0 14px;text-transform:uppercase}
.c h2 span{color:#6B675F}
.c .idx{border-top:1px solid #CFC8BB;padding:8px 0;margin:0}
.c .idx:last-of-type{border-bottom:1px solid #CFC8BB}
.c .t{margin-top:16px;white-space:pre-line}
.c .p,.c .s{margin-top:20px}
footer{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:40px;padding:6vh 7vw}
footer>div{border-top:1px solid #1C1B19;padding-top:10px}
@media (max-width:760px){.hd,footer{grid-template-columns:minmax(0,1fr);gap:16px;padding-left:20px;padding-right:20px}.hd .x{display:none}.w{grid-template-columns:minmax(0,1fr);gap:24px;padding:7vh 20px}.cov{padding:12vh 20px 8vh}}`;
  const PRINT = `
@page{size:A4;margin:14mm}
body{background:#fff}
.cov{min-height:262mm;padding:20mm 6mm;break-after:page}
.w{grid-template-columns:minmax(0,1fr);gap:8mm;padding:6mm;min-height:262mm;break-after:page;break-inside:avoid;align-content:center}
.w figure{min-height:0;background:none}.w figure img{max-height:170mm}
.hd{padding:0}footer{display:none}`;
  function html(cat, opt) {
    opt = opt || {}; const t = T[cat.langue] || T.fr; const imgs = opt.images || {};
    const list = cat.oeuvres || [];
    const works = list.map((o, i) => {
      const v = (o.visuels || []).find(x => !/^video/.test(x.t || ""));
      const src = imgs[i] || imgUrl(v);
      const alt = [o.auteur, o.titre].filter(Boolean).join(", ");
      return `<section class="w">${src ? `<figure><img src="${esc(src)}" alt="${esc(alt)}" loading="lazy"></figure>` : `<figure class="vide"></figure>`}<div class="c">` +
        `<p class="n cap">${String(i + 1).padStart(2, "0")}</p>${o.auteur ? `<p class="a cap">${esc(o.auteur)}</p>` : ""}` +
        `<h2>${esc(o.titre || t.sans)}${o.annee ? `<span>, ${esc(o.annee)}</span>` : ""}</h2>` +
        `${o.technique ? `<p class="idx">${esc(o.technique)}</p>` : ""}${o.dimensions ? `<p class="idx">${esc(o.dimensions)}</p>` : ""}` +
        `${o.edition ? `<p class="idx">${t.ed} ${esc(o.edition)} ${t.ex}</p>` : ""}${o.texte ? `<p class="t">${esc(o.texte)}</p>` : ""}` +
        `${o.statut ? `<p class="s cap">${o.statut === "Vendue" ? t.vendue : t.reservee}</p>` : (o.prix && eur(o.prix) ? `<p class="p cap">${t.prix} · ${esc(eur(o.prix))}</p>` : "")}` +
        `</div></section>`;
    }).join("");
    return `<!doctype html><html lang="${cat.langue === "en" ? "en" : "fr"}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,600;1,600&family=IBM+Plex+Mono:ital,wght@0,400;0,500;1,400&display=swap"><title>${esc(cat.titre || "Catalogue")} · Maison Saint Sauveur</title><style>${CSS}${opt.print ? PRINT : ""}</style></head><body>` +
      `<div class="hd"><div><div class="house">Maison Saint Sauveur</div><div class="cap mut">Catalogue</div></div><div class="r cap x"><div>Concarneau · Paris</div><div>${esc(cat.date || "")}</div></div><div class="r cap"><div>${list.length} ${list.length > 1 ? t.oeuvres : t.oeuvre}</div><div>${list.length ? "01 — " + String(list.length).padStart(2, "0") : ""}</div></div></div>` + `<header class="cov"><h1>${esc(cat.titre || "")}</h1>${cat.intro ? `<p class="i">${esc(cat.intro).replace(/\n/g, "<br>")}</p>` : ""}<p class="cap mut">${esc(cat.date || "")}${cat.date ? " · " : ""}${list.length} ${list.length > 1 ? t.oeuvres : t.oeuvre}</p></header>` +
      works + `<footer><div><div class="cap">Maison</div><div class="house" style="font-size:18px;margin-top:4px">Maison Saint Sauveur</div></div><div><div class="cap">Lieux</div><p style="margin:4px 0 0">Concarneau · Paris</p></div><div><div class="cap">Contact</div><p style="margin:4px 0 0">contact@maisonsaintsauveur.fr</p></div></footer>` +
      (opt.print ? `<script>addEventListener("load",()=>setTimeout(()=>print(),500))<\/script>` : "") + `</body></html>`;
  }
  window.MSSCatalogue = { html, imgUrl, esc };
})();
