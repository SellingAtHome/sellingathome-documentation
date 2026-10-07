// Structure d'un tableau BrandAdmin (en-têtes et classes des lignes), sans afficher les données.
// Usage : node tools/captures/structure.js /chemin "#id-du-tableau"
const { loadEnv, openBrowser } = require('./lib');

(async () => {
  const [p, sel] = process.argv.slice(2);
  const env = loadEnv();
  const { browser, page, guard } = await openBrowser();
  await page.goto(env.SAH_URL + '/session/login', { waitUntil: 'domcontentloaded' });
  await page.fill('#Email', env.SAH_LOGIN);
  await page.fill('#Password', env.SAH_PASSWORD);
  await Promise.all([page.waitForLoadState('networkidle'), page.click('form button[type=submit]')]);
  guard.loginPhase = false;
  await page.goto(env.SAH_URL + p, { waitUntil: 'networkidle' });
  await page.waitForTimeout(1500);
  const info = await page.evaluate((sel) => {
    const t = document.querySelector(sel);
    if (!t) return 'tableau introuvable';
    const heads = [...t.querySelectorAll('thead th')].map((th, i) => `${i + 1}:${th.textContent.trim().replace(/\s+/g, ' ')}`);
    const rows = [...t.querySelectorAll('tbody tr')].slice(0, 8).map((tr) => `${tr.className || '-'} | ${tr.children.length} cellules`);
    return heads.join(' | ') + '\n' + rows.join('\n');
  }, sel);
  console.log(info);
  const blocked = [...new Set(guard.blocked.map((b) => b.replace(/\?.*$/, '')))].filter((b) => !/analytics\./.test(b));
  if (blocked.length) console.log('Bloqué :', blocked.join(', '));
  await browser.close();
})().catch((e) => { console.error('ERREUR', e.message); process.exit(1); });
