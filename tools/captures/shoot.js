// Prises de vue BrandAdmin pour la documentation.
// Usage : node tools/captures/shoot.js <fichier-de-plan> [nom-de-prise ...]
//   ex.   node tools/captures/shoot.js tools/captures/plans/espace-marque.js
// Un plan exporte un tableau de prises : { name, path, before?(page), clip?|selector?, masks?[], marks?[], fullPage? }
//   - path     : URL relative de BrandAdmin (ex. '/dashboard')
//   - before   : actions de LECTURE seulement (clics d'affichage, saisie de filtres)
//   - selector : capture limitée à un élément ; clip : {x,y,width,height}
//   - masks    : sélecteurs CSS à flouter en plus du masquage automatique (emails, téléphones)
//   - marks    : [{ selector, n }] repères numérotés encadrant un élément
// Les images vont dans tools/captures/out/<plan>/<name>.png (puis copiées à la main dans Captures/ après relecture).
const fs = require('fs');
const path = require('path');
const { loadEnv, openBrowser } = require('./lib');

async function login(page, env, guard) {
  await page.goto(env.SAH_URL + '/session/login', { waitUntil: 'domcontentloaded' });
  await page.fill('#Email', env.SAH_LOGIN);
  await page.fill('#Password', env.SAH_PASSWORD);
  await Promise.all([page.waitForLoadState('networkidle'), page.click('form button[type=submit]')]);
  await page.waitForLoadState('networkidle');
  if (/session\/login/.test(page.url())) throw new Error('Connexion refusée');
  guard.loginPhase = false;
}

const FAKE_NAMES = ['Martin Camille', 'Bernard Léa', 'Petit Chloé', 'Durand Manon', 'Leroy Inès', 'Moreau Jade',
  'Simon Louise', 'Laurent Emma', 'Michel Alice', 'Garcia Lina', 'Roux Zoé', 'Fournier Anna', 'Girard Rose', 'Bonnet Mila'];

// Masquage automatique : emails et téléphones remplacés ; nom de l'utilisateur connecté remplacé ;
// shot.fakeNames : sélecteurs dont le texte est remplacé par des noms fictifs ; shot.masks : sélecteurs floutés.
async function anonymize(page, extraMasks, fakeNameSelectors) {
  await page.evaluate(({ masks, fakeSel, names }) => {
    const pn = document.querySelector('.profile-name');
    if (pn) pn.textContent = pn.textContent.replace(/\|.*$/, '| Camille Martin');
    document.querySelectorAll('.dropdown-messages-box .media-body strong').forEach((e) => { e.textContent = 'Camille Martin'; });
    let k = 0;
    for (const sel of fakeSel) document.querySelectorAll(sel).forEach((e) => {
      // on remplace le texte du premier nœud texte non vide pour garder liens et icônes
      const w = document.createTreeWalker(e, NodeFilter.SHOW_TEXT);
      let n, done = false;
      while ((n = w.nextNode())) {
        if (!n.nodeValue.trim()) continue;
        if (!done) { n.nodeValue = names[k++ % names.length]; done = true; } else n.nodeValue = '';
      }
    });
    // Lignes de regroupement « … Réunion <nom> (CODE) » : nom remplacé
    document.querySelectorAll('tr.group-start td, tr.group td').forEach((td) => {
      td.childNodes.forEach((c) => { if (c.nodeType === 3) c.nodeValue = c.nodeValue.replace(/(Réunion\s+)(.+?)(\s*\()/, `$1${names[k++ % names.length]}$3`); });
      td.querySelectorAll('*').forEach((c) => c.childNodes.forEach((x) => { if (x.nodeType === 3) x.nodeValue = x.nodeValue.replace(/(Réunion\s+)(.+?)(\s*\()/, `$1${names[k++ % names.length]}$3`); }));
    });
    const EMAIL = /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi;
    const PHONE = /(?<![\w(])(?:\+33\s?|0)[1-9](?:[\s.-]?\d{2}){4}(?!\w)/g;
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    let n;
    while ((n = walker.nextNode())) {
      if (EMAIL.test(n.nodeValue) || PHONE.test(n.nodeValue)) {
        n.nodeValue = n.nodeValue.replace(EMAIL, 'prenom.nom@exemple.fr').replace(PHONE, '06 00 00 00 00');
      }
      EMAIL.lastIndex = 0; PHONE.lastIndex = 0;
    }
    document.querySelectorAll('input').forEach((i) => {
      if (EMAIL.test(i.value)) i.value = 'prenom.nom@exemple.fr';
      EMAIL.lastIndex = 0;
    });
    for (const sel of masks) document.querySelectorAll(sel).forEach((e) => { e.style.filter = 'blur(5px)'; });
  }, { masks: extraMasks || [], fakeSel: fakeNameSelectors || [], names: FAKE_NAMES });
}

async function addMarks(page, marks) {
  await page.evaluate((marks) => {
    for (const { selector, n } of marks) {
      const el = document.querySelector(selector);
      if (!el) continue;
      const r = el.getBoundingClientRect();
      const box = document.createElement('div');
      box.className = 'sah-doc-mark';
      Object.assign(box.style, {
        position: 'absolute', left: (r.left + scrollX - 4) + 'px', top: (r.top + scrollY - 4) + 'px',
        width: (r.width + 8) + 'px', height: (r.height + 8) + 'px', border: '3px solid #B4356F',
        borderRadius: '10px', zIndex: 99999, pointerEvents: 'none',
      });
      const badge = document.createElement('div');
      badge.textContent = n;
      Object.assign(badge.style, {
        position: 'absolute', left: '-14px', top: '-14px', width: '28px', height: '28px', borderRadius: '50%',
        background: '#B4356F', color: '#fff', font: '700 15px/28px "Open Sans", sans-serif', textAlign: 'center',
      });
      box.appendChild(badge);
      document.body.appendChild(box);
    }
  }, marks);
}

(async () => {
  const planFile = path.resolve(process.argv[2]);
  const only = process.argv.slice(3);
  const plan = require(planFile);
  const outDir = path.join(__dirname, 'out', path.basename(planFile, '.js'));
  fs.mkdirSync(outDir, { recursive: true });

  const env = loadEnv();
  const { browser, page, guard } = await openBrowser({ width: plan.width || 1440, height: plan.height || 900 });
  await login(page, env, guard);

  for (const shot of plan.shots) {
    if (only.length && !only.includes(shot.name)) continue;
    guard.blocked.length = 0;
    await page.goto(env.SAH_URL + shot.path, { waitUntil: 'networkidle' });
    if (shot.before) await shot.before(page);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(shot.wait || 500);
    await anonymize(page, shot.masks, shot.fakeNames);
    if (shot.marks) await addMarks(page, shot.marks);
    const file = path.join(outDir, shot.name + '.png');
    if (shot.selector) await page.locator(shot.selector).first().screenshot({ path: file });
    else await page.screenshot({ path: file, clip: shot.clip, fullPage: !!shot.fullPage });
    const blocked = [...new Set(guard.blocked.map((b) => b.replace(/\?.*$/, '')))].filter((b) => !/analytics\./.test(b));
    console.log(`✔ ${shot.name}${blocked.length ? '  — requêtes bloquées : ' + blocked.join(', ') : ''}`);
  }
  await browser.close();
})().catch((e) => { console.error('ERREUR', e.message); process.exit(1); });
