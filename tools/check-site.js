// Vérification du site généré : erreurs console, liens internes cassés, captures de contrôle.
// Usage : node tools/check-site.js [page.html ...]
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

const ROOT = path.join(__dirname, '..');
const OUT = path.join(__dirname, 'captures', 'out', 'site');
const url = (f) => 'file:///' + path.join(ROOT, f).replace(/\\/g, '/');

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const files = process.argv.slice(2).length ? process.argv.slice(2) : fs.readdirSync(ROOT).filter((f) => f.endsWith('.html'));
  const browser = await chromium.launch();
  let problems = 0;

  // 1. Liens internes (fichier + ancre)
  const ids = {};
  for (const f of fs.readdirSync(ROOT).filter((x) => x.endsWith('.html'))) {
    ids[f] = new Set([...fs.readFileSync(path.join(ROOT, f), 'utf8').matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]));
  }
  for (const f of files) {
    const html = fs.readFileSync(path.join(ROOT, f), 'utf8');
    for (const m of html.matchAll(/href="([^"#:]*\.html)?(#[^"]*)?"/g)) {
      const target = m[1] || f, anchor = m[2] ? m[2].slice(1) : null;
      if (!ids[target]) { console.log(`LIEN CASSÉ ${f} → ${target}`); problems++; continue; }
      if (anchor && !ids[target].has(anchor)) { console.log(`ANCRE CASSÉE ${f} → ${target}#${anchor}`); problems++; }
    }
  }

  // 2. Erreurs console + captures
  for (const [name, opts] of [['bureau', { viewport: { width: 1440, height: 900 } }], ['mobile', { viewport: { width: 390, height: 844 }, isMobile: true }]]) {
    for (const scheme of name === 'bureau' ? ['light', 'dark'] : ['light']) {
      const ctx = await browser.newContext({ ...opts, colorScheme: scheme });
      const page = await ctx.newPage();
      for (const f of files) {
        const errs = [];
        page.removeAllListeners('console'); page.removeAllListeners('pageerror');
        page.on('console', (m) => { if (m.type() === 'error') errs.push(m.text()); });
        page.on('pageerror', (e) => errs.push(e.message));
        await page.goto(url(f), { waitUntil: 'load' });
        if (errs.length) { console.log(`ERREUR ${f} (${name}/${scheme}) : ${errs.join(' | ')}`); problems++; }
        await page.screenshot({ path: path.join(OUT, `${f.replace('.html', '')}-${name}-${scheme}.png`) });
        const h = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
        if (h > 1) { console.log(`DÉBORDEMENT HORIZONTAL ${f} (${name}) : ${h}px`); problems++; }
      }
      await ctx.close();
    }
  }
  await browser.close();
  console.log(problems ? `${problems} problème(s).` : 'Aucun problème détecté.');
})().catch((e) => { console.error(e); process.exit(1); });
