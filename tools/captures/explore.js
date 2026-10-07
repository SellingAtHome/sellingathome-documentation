// Exploration d'un écran BrandAdmin : liens de menu, champs, boutons, onglets et requêtes bloquées.
// Usage : node tools/captures/explore.js /chemin [/autre-chemin ...]
const { loadEnv, openBrowser } = require('./lib');

(async () => {
  const env = loadEnv();
  const { browser, page, guard } = await openBrowser();
  await page.goto(env.SAH_URL + '/session/login', { waitUntil: 'domcontentloaded' });
  await page.fill('#Email', env.SAH_LOGIN);
  await page.fill('#Password', env.SAH_PASSWORD);
  await Promise.all([page.waitForLoadState('networkidle'), page.click('form button[type=submit]')]);
  guard.loginPhase = false;

  for (const p of process.argv.slice(2)) {
    guard.blocked.length = 0;
    await page.goto(env.SAH_URL + p, { waitUntil: 'networkidle' });
    const info = await page.evaluate(() => {
      const t = (e) => (e.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 70);
      return {
        url: location.pathname, title: document.title,
        h: [...document.querySelectorAll('h1,h2,h3,h4')].map(t).filter(Boolean).slice(0, 25),
        tabs: [...document.querySelectorAll('.nav-tabs a, .nav-pills a, [role=tab]')].map((a) => `${t(a)} → ${a.getAttribute('href')}`).slice(0, 30),
        fields: [...document.querySelectorAll('input:not([type=hidden]),select,textarea')].map((i) => `${i.tagName.toLowerCase()}#${i.id || ''}[${i.name || ''}] ${i.type || ''} « ${(document.querySelector(`label[for="${i.id}"]`) || {}).textContent?.trim().slice(0, 50) || i.placeholder || ''} »`).slice(0, 60),
        buttons: [...document.querySelectorAll('button, a.btn, input[type=submit]')].map(t).filter(Boolean).slice(0, 40),
      };
    });
    console.log('\n=== ' + p + ' → ' + info.url + ' | ' + info.title);
    console.log('Titres :', info.h.join(' | '));
    if (info.tabs.length) console.log('Onglets :\n  ' + info.tabs.join('\n  '));
    if (info.fields.length) console.log('Champs :\n  ' + info.fields.join('\n  '));
    console.log('Boutons :', info.buttons.join(' | '));
    const blocked = [...new Set(guard.blocked.map((b) => b.replace(/\?.*$/, '')))].filter((b) => !/analytics\./.test(b));
    if (blocked.length) console.log('Bloqué :', blocked.join(', '));
  }
  await browser.close();
})().catch((e) => { console.error('ERREUR', e.message); process.exit(1); });
