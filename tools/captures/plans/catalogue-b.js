// Prises de vue des pages « Livraison : modes et frais », « Bons de préparation et de livraison » et « L'approvisionnement »
// Lecture seule : aucun clic sur Enregistrer / Valider / Réceptionner / Envoyer.

// Remplace le nom et la référence du fournisseur de démonstration par des valeurs fictives
// et floute son adresse postale (bloc « Par courrier »).
async function anonymizeSupplier(p) {
  await p.evaluate(() => {
    const w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    let n;
    while ((n = w.nextNode())) {
      if (/JOSH/.test(n.nodeValue)) n.nodeValue = n.nodeValue.replace(/JOSH/g, 'Atelier Nacre');
      if (/TESTF|Test Fournisseur/.test(n.nodeValue)) n.nodeValue = n.nodeValue.replace('TESTF', 'VERRE01').replace('Test Fournisseur', 'Verrerie du Lac');
    }
    document.querySelectorAll('select option').forEach((o) => { o.textContent = o.textContent.replace(/JOSH/g, 'Atelier Nacre').replace('Test Fournisseur', 'Verrerie du Lac'); });
    document.querySelectorAll('strong').forEach((s) => {
      if (/Par courrier/.test(s.textContent)) s.parentElement.querySelectorAll('p').forEach((x) => { x.style.filter = 'blur(6px)'; });
    });
  });
}

module.exports = {
  shots: [
    // Paramètres › Configuration générale › Paramètres des livraisons (configuration générale + premiers modes)
    { name: 'parametres-livraisons', path: '/configure/delivery', wait: 1200, fullPage: true, clip: { x: 212, y: 60, width: 1228, height: 1150 } },
    // Fenêtre d'une condition existante (ouverture en lecture : GET /configure/delivery/condition/{id})
    { name: 'condition-livraison', path: '/configure/delivery', wait: 1200,
      before: async (p) => {
        await p.locator('.delivery-item[data-id="141"] .edit-condition').first().click();
        await p.waitForTimeout(1500);
      },
      selector: '.modal.in .modal-content, .modal.show .modal-content' },
    // Bons de préparation : étape 1 de l'assistant, type « Par réunion » coché pour afficher ses options
    { name: 'bons-preparation', path: '/orders/preparatorydeliverybills', wait: 1200,
      before: async (p) => { await p.locator('label:has(input[name="type"][value="meeting"])').first().click(); await p.waitForTimeout(600); },
      clip: { x: 212, y: 60, width: 1228, height: 700 } },
    // Approvisionnement › Fournisseurs
    { name: 'fournisseurs', path: '/suppliers', wait: 1500, masks: ['#suppliers-table tbody td:nth-child(4)'],
      before: anonymizeSupplier, clip: { x: 212, y: 60, width: 1228, height: 450 } },
    // Approvisionnement › Commandes
    { name: 'commandes-fournisseurs', path: '/supplyorders', wait: 1500, before: anonymizeSupplier, clip: { x: 212, y: 60, width: 1228, height: 640 } },
    // Détail d'une commande d'approvisionnement validée
    { name: 'commande-fournisseur', path: '/supplyorders/44/edit', wait: 2500, before: anonymizeSupplier, fullPage: true, clip: { x: 212, y: 60, width: 1228, height: 1120 } },
    // Création : étape « Choix des produits » (liste en lecture : POST /suppliers/{id}/products/dtlist)
    { name: 'nouvelle-commande-fournisseur', path: '/supplyorders/create', wait: 1500,
      before: async (p) => {
        await p.selectOption('#select-supplier', '45');
        await p.waitForTimeout(800);
        await p.click('#wizard .actions a[href="#next"]');
        await p.waitForTimeout(2500);
        await anonymizeSupplier(p);
      },
      clip: { x: 212, y: 60, width: 1228, height: 640 } },
  ],
};
