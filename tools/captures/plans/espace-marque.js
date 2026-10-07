// Prises de vue de la page « Découvrir l'espace marque »
async function period12Months(page) {
  // Période : 12 derniers mois glissants, échelle mensuelle.
  // Le tableau de bord lit sa période dans le localStorage du navigateur (dashboardInterval*, dashboardScale).
  await page.evaluate(() => {
    const pad = (n) => String(n).padStart(2, '0');
    const f = (d) => `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}`;
    const end = new Date(); const start = new Date(end.getFullYear() - 1, end.getMonth(), 1);
    for (const k of ['dashboardIntervalStartDate', 'topTenDashboardIntervalStartDate']) localStorage.setItem(k, f(start));
    for (const k of ['dashboardIntervalEndDate', 'topTenDashboardIntervalEndDate']) localStorage.setItem(k, f(end));
    localStorage.setItem('dashboardScale', '2');
  });
  await page.reload({ waitUntil: 'networkidle' });
  await page.waitForTimeout(2500);
}

const SELLER_NAMES = ['#sellers-top td:first-child a', '#sellers-top td:first-child:not(:has(a))'];

module.exports = {
  shots: [
    { name: 'dashboard-complet', path: '/dashboard', before: period12Months, fakeNames: SELLER_NAMES, fullPage: true },
    { name: 'dashboard-indicateurs', path: '/dashboard', before: period12Months, fakeNames: SELLER_NAMES,
      clip: { x: 232, y: 160, width: 1208, height: 760 } },
    { name: 'barre-haut', path: '/dashboard', clip: { x: 0, y: 0, width: 1440, height: 64 } },
    { name: 'menu-lateral', path: '/dashboard', clip: { x: 0, y: 60, width: 232, height: 900 - 60 } },
    { name: 'profil', path: '/editprofile' },
    { name: 'menu-utilisateur', path: '/dashboard', before: async (p) => { await p.click('.user-menu'); },
      clip: { x: 900, y: 0, width: 540, height: 360 } },
    { name: 'actualites', path: '/dashboard', before: async (p) => { await p.click('.notification-bell-toggle'); },
      clip: { x: 700, y: 0, width: 740, height: 520 } },
    { name: 'menu-commandes-ouvert', path: '/dashboard', before: async (p) => { await p.click('#side-menu a:has-text("Commandes")'); },
      clip: { x: 0, y: 60, width: 232, height: 840 } },
  ],
};
