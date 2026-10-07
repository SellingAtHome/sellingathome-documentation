// Reconnaissance : ouvre la page de connexion et décrit le formulaire (aucune donnée envoyée).
const { loadEnv, openBrowser } = require('./lib');

(async () => {
  const env = loadEnv();
  const { browser, page, guard } = await openBrowser();
  guard.loginPhase = false;
  await page.goto(env.SAH_URL, { waitUntil: 'domcontentloaded' });
  console.log('URL :', page.url());
  console.log('Titre :', await page.title());
  const forms = await page.$$eval('form', (fs) => fs.map((f) => ({
    action: f.getAttribute('action'), method: f.getAttribute('method'),
    inputs: Array.from(f.querySelectorAll('input,select,button')).map((i) => `${i.tagName.toLowerCase()}[name=${i.name || ''}][type=${i.type || ''}][id=${i.id || ''}]`),
  })));
  console.log(JSON.stringify(forms, null, 2));
  await browser.close();
})().catch((e) => { console.error(e.message); process.exit(1); });
