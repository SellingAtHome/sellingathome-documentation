// Générateur du site de documentation.
// Sources : src/site.js (navigation) + src/pages/<slug>.html (fragments) + src/partials/.
// Sortie : pages HTML à la racine du dépôt + assets/search-index.js.
// Usage : node build.js
const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const SRC = path.join(ROOT, 'src');
const site = require('./src/site.js');
const pkg = require('./package.json'); // numéro de version affiché dans le pied de page
const sprite = fs.readFileSync(path.join(SRC, 'partials', 'logo-sprite.svg'), 'utf8').trim();

const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

// ---------- Registre des pages ----------
const pages = new Map(); // slug -> { title, summary, status, module, universe }
for (const u of site.universes) for (const p of u.pages) pages.set(p.slug, { ...p, universe: u });
for (const p of site.extras) pages.set(p.slug, { ...p, universe: null });

function readFragment(slug) {
  const file = path.join(SRC, 'pages', slug + '.html');
  if (!fs.existsSync(file)) return null;
  let s = fs.readFileSync(file, 'utf8');
  let meta = {};
  const m = s.match(/^<!--page\s+(\{[\s\S]*?\})\s*-->\s*/);
  if (m) { meta = JSON.parse(m[1]); s = s.slice(m[0].length); }
  const styles = [];
  s = s.replace(/<style>[\s\S]*?<\/style>\s*/g, (x) => { styles.push(x.trim()); return ''; });
  const scripts = [];
  s = s.replace(/<script>[\s\S]*?<\/script>\s*/g, (x) => { scripts.push(x.trim()); return ''; });
  return { meta, body: s.trim(), styles, scripts };
}

// ---------- Gabarit ----------
function head(title, description, styles) {
  return `<!doctype html>
<html lang="fr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
${description ? `<meta name="description" content="${esc(description)}">\n` : ''}<link rel="stylesheet" href="assets/sah.css">
<link rel="stylesheet" href="assets/site.css">
<script>try{var t=localStorage.getItem('ba-theme');if(t)document.documentElement.setAttribute('data-theme',t)}catch(e){}</script>
${styles.join('\n')}
</head>
<body>
${sprite}
`;
}

// Mega-menu : un panneau par univers (survol ou clavier en bureau, accordéon dans le tiroir mobile)
function megaPanel(u, currentSlug) {
  const items = donePages(u).map((p) => `<li><a href="${p.slug}.html"${p.slug === currentSlug ? ' aria-current="page"' : ''}><b>${esc(p.title)}</b>${p.module ? ' <span class="mm-opt">Module optionnel</span>' : ''}<span>${esc(p.summary)}</span></a></li>`).join('');
  return `<div class="mm-panel" id="mm-${u.slug}">
      <div class="mm-head"><a href="${u.slug}.html">${esc(u.title)} <span class="script">${esc(u.script)}</span></a><p>${esc(u.lede)}</p></div>
      <ul class="mm-list">${items}</ul>
    </div>`;
}

function sitebar(active, currentSlug) {
  const univ = site.universes.map((u) => `<div class="mm-item c-${u.color}">
    <a class="mm-link" href="${u.slug}.html"${active === u.slug ? ' aria-current="page"' : ''}>${esc(u.nav)}</a>
    <button class="mm-toggle" type="button" aria-expanded="false" aria-controls="mm-${u.slug}" aria-label="Pages de l'univers ${esc(u.nav)}"></button>
    ${megaPanel(u, currentSlug)}
  </div>`);
  const extras = site.extras.map((p) => `<div class="mm-item mm-plain"><a class="mm-link" href="${p.slug}.html"${active === p.slug ? ' aria-current="page"' : ''}>${esc(p.nav)}</a></div>`);
  return `<div class="sitebar">
  <a class="brand-link" href="index.html" aria-label="Accueil de la documentation"><svg viewBox="0 0 225 46" role="img" aria-label="SellingAtHome"><use href="#sah-logo"></use></svg></a>
  <nav class="topnav" id="topnav" aria-label="Univers">${univ.join('')}${extras.join('')}</nav>
  <div class="sitebar-right">
    <div class="search-box"><input type="search" data-search placeholder="Rechercher…" aria-label="Rechercher dans la documentation" autocomplete="off"><div class="search-results" role="listbox"></div></div>
    <button class="theme-btn" id="themeBtn" type="button" aria-label="Passer au thème sombre" title="Passer au thème sombre"></button>
    <button class="menu-btn" id="menuBtn" type="button" aria-expanded="false" aria-controls="topnav" aria-label="Ouvrir le menu" title="Menu"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16"/></svg></button>
  </div>
</div>
`;
}

function foot(label, back, scripts) {
  return `
<footer><div class="ft">${back ? `<a href="${back.href}">← ${esc(back.label)}</a>` : '<span></span>'}<span>SellingAtHome · ${esc(label)}</span><span>Version ${esc(pkg.version)} · ${esc(site.updated)}</span></div></footer>

<button class="to-top" id="toTop" type="button" aria-label="Remonter en haut de la page" title="Haut de page"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 19V5M5 12l7-7 7 7"/></svg></button>

<div class="lightbox" id="lightbox" role="dialog" aria-modal="true" aria-label="Capture agrandie"><img alt=""></div>

<script src="assets/sah.js"></script>
<script src="assets/search-index.js"></script>
<script src="assets/search.js"></script>
${scripts.join('\n')}
</body>
</html>
`;
}

const donePages = (u) => u.pages.filter((p) => p.status === 'done');

// Menu de l'univers injecté en tête du sommaire de la page
function universeNav(u, currentSlug) {
  const items = donePages(u).map((p) => p.slug === currentSlug
    ? `<li class="here"><span>${esc(p.title)}</span></li>`
    : `<li><a href="${p.slug}.html">${esc(p.title)}</a></li>`).join('');
  return `<div class="unav"><a class="unav-title" href="${u.slug}.html">${esc(u.title)} ${esc(u.script)}</a><ul>${items}</ul></div>\n      `;
}

function pager(u, slug) {
  const list = donePages(u);
  const i = list.findIndex((p) => p.slug === slug);
  if (i < 0) return '';
  const prev = list[i - 1], next = list[i + 1];
  if (!prev && !next) return '';
  const card = (p, cls, lbl) => p
    ? `<a class="${cls}" href="${p.slug}.html"><small>${lbl}</small><span>${esc(p.title)}</span></a>`
    : '<span></span>';
  return `<nav class="pager" aria-label="Pages de l'univers">${card(prev, 'prev', '← Précédent')}${card(next, 'next', 'Suivant →')}</nav>\n`;
}

function pageCards(u) {
  return `<div class="page-grid">${u.pages.map((p) => {
    const tags = (p.module ? '<span class="tag yellow">Module optionnel</span>' : '') +
      (p.status === 'done' ? '' : '<span class="tag">En préparation</span>');
    const inner = `<h3>${esc(p.title)}</h3><p>${esc(p.summary)}</p>${tags ? `<div class="pc-tags">${tags}</div>` : ''}`;
    return p.status === 'done'
      ? `<a class="page-card" href="${p.slug}.html">${inner}<span class="more">Lire le guide →</span></a>`
      : `<div class="page-card todo">${inner}</div>`;
  }).join('\n')}</div>`;
}

function universeSection(u, num) {
  return `<section id="pages">
    <div class="sec-head"><span class="sec-num">${num}</span><h2>Toutes les pages de cet univers</h2></div>
    ${pageCards(u)}
  </section>`;
}

// ---------- Construction ----------
const built = []; // { file, label, html }
function write(file, label, html) {
  fs.writeFileSync(path.join(ROOT, file), html);
  built.push({ file, label, html });
}

// Pages de contenu
for (const [slug, p] of pages) {
  if (p.status !== 'done') continue;
  const f = readFragment(slug);
  if (!f) throw new Error(`Fragment manquant : src/pages/${slug}.html`);
  let body = f.body;
  if (p.universe) {
    body = body.replace('<div class="toc-title">', universeNav(p.universe, slug) + '<div class="toc-title">');
    body = body.replace(/<summary>[^<]*<\/summary>/, '<summary>Menu et sommaire</summary>');
  }
  const title = (f.meta.title || p.title) + ' – ' + site.siteName;
  const html = head(title, p.summary, f.styles) + sitebar(p.universe ? p.universe.slug : slug, slug) + '\n' + body + '\n' +
    (p.universe ? `<div class="pager-wrap">${pager(p.universe, slug)}</div>` : '') +
    foot(p.title, p.universe ? { href: p.universe.slug + '.html', label: p.universe.nav } : { href: 'index.html', label: 'Accueil' }, f.scripts);
  write(slug + '.html', p.title, html);
}

// Pages d'univers
site.universes.forEach((u) => {
  let body, styles = [], scripts = [];
  const f = u.custom ? readFragment(u.slug) : null;
  if (f) {
    body = f.body.replace('<!--univers-pages-->', universeSection(u, '04'));
    styles = f.styles; scripts = f.scripts;
  } else {
    body = `<header class="hero">
  <div class="hero-in" style="grid-template-columns:1fr">
    <div>
      <span class="eyebrow">Univers</span>
      <h1>${esc(u.title)} <span class="script">${esc(u.script)}</span></h1>
      <p class="lede">${esc(u.lede)}</p>
    </div>
  </div>
</header>

<div class="home">
  ${universeSection(u, '01')}
</div>`;
  }
  const html = head(`${u.title} ${u.script} – ${site.siteName}`, u.lede, styles) + sitebar(u.slug) + '\n' + body + '\n' +
    foot(`${u.title} ${u.script}`, { href: 'index.html', label: 'Accueil' }, scripts);
  write(u.slug + '.html', `${u.title} ${u.script}`, html);
});

// Accueil
{
  const f = readFragment('index');
  const cards = site.universes.map((u) => {
    const done = donePages(u).length, total = u.pages.length;
    const list = u.pages.slice(0, 4).map((p) => `<li>${esc(p.title)}</li>`).join('');
    return `<a class="tool-card c-${u.color}" href="${u.slug}.html">
        <div><span class="for">${done ? `${done} page${done > 1 ? 's' : ''} sur ${total}` : `${total} pages en préparation`}</span><h3>${esc(u.title)} ${esc(u.script)}</h3></div>
        <p>${esc(u.lede)}</p>
        <ul>${list}</ul>
        <span class="more">Explorer →</span>
      </a>`;
  }).join('\n      ');
  const body = f.body.replace('<!--univers-cards-->', `<div class="tools">\n      ${cards}\n    </div>`);
  write('index.html', 'Accueil', head(site.siteName, f.meta.description, f.styles) + sitebar('index') + '\n' + body + '\n' + foot('Accueil', null, f.scripts));
}

// ---------- Index de recherche ----------
function text(html) {
  return html
    .replace(/<(script|style)[\s\S]*?<\/\1>/g, ' ')
    .replace(/<svg[\s\S]*?<\/svg>/g, ' ')
    .replace(/<span class="more">[\s\S]*?<\/span>/g, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;|&#160;/g, ' ')
    .replace(/&#x27;|&#39;|&rsquo;/g, "'")
    .replace(/&quot;/g, '"').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&laquo;/g, '«').replace(/&raquo;/g, '»')
    .replace(/&amp;/g, '&')
    .replace(/\s+/g, ' ')
    .trim();
}

const index = [];
for (const b of built) {
  if (b.file === 'index.html') continue;
  const start = b.html.search(/<main>|<div class="home">/);
  const end = b.html.indexOf('<footer');
  if (start < 0) continue;
  const content = b.html.slice(start, end);
  const markers = [];
  for (const m of content.matchAll(/<section[^>]*\sid="([^"]+)"[^>]*>/g)) {
    const h2 = content.slice(m.index).match(/<h2[^>]*>([\s\S]*?)<\/h2>/);
    markers.push({ pos: m.index, id: m[1], level: 2, title: h2 ? text(h2[1]) : '' });
  }
  for (const m of content.matchAll(/<h3[^>]*\sid="([^"]+)"[^>]*>([\s\S]*?)<\/h3>/g)) {
    markers.push({ pos: m.index, id: m[1], level: 3, title: text(m[2]) });
  }
  markers.sort((a, b2) => a.pos - b2.pos);
  let parent = '';
  markers.forEach((mk, i) => {
    if (mk.level === 2) parent = mk.title;
    const seg = content.slice(mk.pos, i + 1 < markers.length ? markers[i + 1].pos : content.length);
    let x = text(seg);
    if (x.startsWith(mk.title)) x = x.slice(mk.title.length).trim();
    index.push({ p: b.label, t: mk.title, h: mk.level === 3 ? parent : '', u: `${b.file}#${mk.id}`, x: x.slice(0, 2500) });
  });
}
fs.writeFileSync(path.join(ROOT, 'assets', 'search-index.js'), 'window.SAH_SEARCH_INDEX = ' + JSON.stringify(index) + ';\n');

console.log(`${built.length} pages générées, ${index.length} entrées de recherche.`);
