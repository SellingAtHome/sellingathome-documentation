// Prises de vue des pages « Check-list de mise en route » et « Modules et options » (univers Démarrer)
// Lecture seule : uniquement navigation, ouverture de menu et défilement.
const openParams = async (p) => {
  await p.click('#side-menu > li > a:has(.mm-text:text-is("Paramètres"))');
  await p.waitForTimeout(600);
  await p.evaluate(() => {
    let e = document.querySelector('#side-menu');
    while (e && e !== document.body) { if (e.scrollHeight > e.clientHeight + 5) { e.scrollTop = 99999; } e = e.parentElement; }
    window.scrollTo(0, 99999);
  });
  await p.waitForTimeout(400);
};

module.exports = {
  shots: [
    // Vues complètes de travail (relecture des libellés, non publiées)
    { name: 'work-configure', path: '/configure', fullPage: true },
    { name: 'work-orders', path: '/configure/orders', fullPage: true },
    { name: 'work-meetings', path: '/configure/meetings', fullPage: true },
    { name: 'work-delivery', path: '/configure/delivery', fullPage: true },
    { name: 'work-fidelity', path: '/fidelitypoints', fullPage: true },
    { name: 'work-activities', path: '/configure/activities', fullPage: true },
    // Prises publiées
    { name: 'onglets-configuration', path: '/configure', clip: { x: 212, y: 60, width: 1228, height: 196 } },
    { name: 'parametres-generaux-colonne', path: '/configure', fullPage: true, clip: { x: 1022, y: 322, width: 400, height: 1336 } },
    { name: 'livraisons-haut', path: '/configure/delivery', fullPage: true, clip: { x: 240, y: 270, width: 1182, height: 960 } },
    { name: 'menu-parametres', path: '/dashboard', before: openParams, clip: { x: 0, y: 60, width: 232, height: 840 } },
  ],
};
