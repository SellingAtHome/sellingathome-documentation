// Prises de vue du lot « ventes » (commandes de regroupement, paramètres des commandes, retours, boutiques)
const MO_FICHE_NAMES = ['#tab-1 .list-group-item a[href*="ellers"]', '#tab-1 #orders-table > tbody > tr > td:nth-child(2)'];
module.exports = {
  shots: [
    { name: 'mo-liste', path: '/masterorders', wait: 2500, fakeNames: ['.ag-cell[col-id="SellerName"]'], clip: { x: 212, y: 60, width: 1228, height: 780 } },
    { name: 'mo-filtres', path: '/masterorders', wait: 2000,
      before: async (p) => { await p.click('button:has-text("Filtrer"), a:has-text("Filtrer")'); await p.waitForTimeout(800); }, selector: '.modal.in .modal-content, .modal.show .modal-content' },
    { name: 'mo-fiche', path: '/masterorders/157396/edit', wait: 2000, fakeNames: MO_FICHE_NAMES, clip: { x: 212, y: 60, width: 1228, height: 1000 } },
    { name: 'mo-historique', path: '/masterorders/157396/edit', wait: 2000, fakeNames: MO_FICHE_NAMES,
      before: async (p) => { await p.click('a[href="#tab-2"]'); await p.waitForTimeout(1500); }, clip: { x: 212, y: 60, width: 1228, height: 600 } },
    { name: 'params-a', path: '/configure/orders', wait: 2000, fullPage: true, clip: { x: 212, y: 60, width: 1228, height: 1230 } },
    { name: 'params-b', path: '/configure/orders', wait: 2000, fullPage: true, clip: { x: 212, y: 1290, width: 1228, height: 1130 } },
    { name: 'params-c', path: '/configure/orders', wait: 2000, fullPage: true, clip: { x: 212, y: 2440, width: 560, height: 520 } },
    { name: 'causes', path: '/products/returncauses', wait: 1500, clip: { x: 212, y: 60, width: 1228, height: 620 } },
    { name: 'retour-fiche', path: '/products/returns/edit/436234', wait: 1500,
      fakeNames: ['label[for="Seller"] + div label', 'label[for="Customer"] + div label'], clip: { x: 540, y: 225, width: 580, height: 760 } },
    { name: 'ms-vendeur-haut', path: '/minisite/sellers', wait: 2000, fullPage: true, clip: { x: 212, y: 60, width: 1228, height: 700 } },
    { name: 'ms-vendeur-carrousel', path: '/minisite/sellers', wait: 2000, fullPage: true, clip: { x: 212, y: 1390, width: 820, height: 1450 } },
    { name: 'ms-boutique-haut', path: '/minisite/brandshop', wait: 2000, fullPage: true, clip: { x: 212, y: 60, width: 1228, height: 560 } },
    { name: 'cadeau-regle', path: '/configure/autogiftorder/1023/edit', wait: 2000, clip: { x: 212, y: 60, width: 1228, height: 560 } },
    { name: 'zone-info', path: '/ordercmsblocks/create', wait: 1500, clip: { x: 230, y: 75, width: 1200, height: 610 } },
    { name: 'question-modale', path: '/configure/orders', wait: 1500, before: async (p) => { await p.click('button:has-text("Ajouter une question"), a:has-text("Ajouter une question")'); await p.waitForTimeout(1000); }, selector: '.modal.in .modal-content, .modal.show .modal-content' },
    { name: 'frais-fixe-modale', path: '/configure/orders', wait: 1500, before: async (p) => { await p.click('button:has-text("Ajouter un frais fixe"):not(:has-text("master")), a:has-text("Ajouter un frais fixe"):not(:has-text("master"))'); await p.waitForTimeout(1000); }, selector: '.modal.in .modal-content, .modal.show .modal-content' },
  ],
};
