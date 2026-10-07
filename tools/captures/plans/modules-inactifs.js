// Prises de vue du lot « modules-inactifs » : seule la Gestion de fichiers est active sur la marque de démo.
// Les vignettes d'images (photos de personnes, documents) sont floutées.
const THUMBS = ['.file-picture .picture', '.file-picture .blurred'];
module.exports = {
  shots: [
    { name: 'gestion-fichiers', path: '/filemanager', wait: 3000, masks: THUMBS, clip: { x: 212, y: 60, width: 1228, height: 640 } },
    { name: 'gestion-fichiers-menu', path: '/filemanager', wait: 3000, masks: THUMBS,
      before: async (p) => { await p.waitForTimeout(2500); await p.locator('.folder-item-list .file-box').filter({ hasText: 'Recrutement' }).first().click({ button: 'right' }); await p.waitForTimeout(800); },
      clip: { x: 530, y: 400, width: 600, height: 300 } },
  ],
};
