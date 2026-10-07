// Test de connexion : login, description de la page d'arrivée, puis capture du tableau de bord.
const path = require('path');
const fs = require('fs');
const { loadEnv, openBrowser } = require('./lib');

(async () => {
  const env = loadEnv();
  const { browser, page, guard } = await openBrowser();
  await page.goto(env.SAH_URL + '/session/login', { waitUntil: 'domcontentloaded' });
  await page.fill('#Email', env.SAH_LOGIN);
  await page.fill('#Password', env.SAH_PASSWORD);
  await Promise.all([page.waitForLoadState('networkidle'), page.click('form button[type=submit]')]);
  await page.waitForLoadState('networkidle');
  console.log('Après login :', page.url(), '|', await page.title());

  // Page de choix de compte éventuelle : on décrit les options sans rien soumettre
  const choices = await page.$$eval('form, a', (els) => els
    .filter((e) => /choice|account|brand|login/i.test((e.getAttribute('action') || e.getAttribute('href') || '')))
    .slice(0, 30)
    .map((e) => `${e.tagName} ${(e.getAttribute('action') || e.getAttribute('href'))} « ${e.textContent.trim().replace(/\s+/g, ' ').slice(0, 60)} »`));
  if (choices.length) console.log('Liens/formulaires de compte :\n' + choices.join('\n'));

  const brandName = await page.$eval('body', (b) => {
    const el = b.querySelector('.navbar-header, .profile-element, .nav-header, title');
    return el ? el.textContent.trim().replace(/\s+/g, ' ').slice(0, 120) : '';
  }).catch(() => '');
  console.log('En-tête :', brandName);

  guard.loginPhase = false;
  await page.reload({ waitUntil: 'networkidle' });
  const out = path.join(__dirname, 'out');
  fs.mkdirSync(out, { recursive: true });
  await page.screenshot({ path: path.join(out, 'test-apres-login.png') });
  console.log('Capture : tools/captures/out/test-apres-login.png');
  if (guard.blocked.length) {
    const counts = {};
    guard.blocked.forEach((b) => { const k = b.replace(/\?.*$/, ''); counts[k] = (counts[k] || 0) + 1; });
    console.log('Requêtes bloquées :', guard.blocked.length);
    Object.entries(counts).forEach(([k, n]) => console.log(`  ${n} × ${k}`));
  }
  await browser.close();
})().catch((e) => { console.error(e.message); process.exit(1); });
