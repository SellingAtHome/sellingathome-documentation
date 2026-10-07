// Prises de vue des pages « Mini-site de réunion », « Réunion virtuelle », « Activités »,
// « Créer, modifier et finaliser une commande », « Annulations, avoirs et documents ».
// Lecture seule : uniquement des ouvertures d'onglets et de fenêtres d'affichage.
// Les fiches commande ne terminent jamais leur chargement réseau : lancer avec une attente « load »
// (copie locale de shoot.js) si shoot.js s'arrête sur un délai dépassé.
const PAID = '/orders/7399960/edit'; // commande payée de la marque de démonstration (rattachée à une réunion)
const UNPAID = '/orders/7643999/edit'; // commande non payée de la marque de démonstration

// Marque les zones nominatives de la fiche commande pour les remplacer par des noms fictifs
async function tagOrderNames(p) {
  await p.evaluate(() => {
    document.querySelectorAll('a[href*="ustomers/"], a[href*="ellers/"]').forEach((a) => a.classList.add('sah-fake'));
    document.querySelectorAll('li.list-group-item').forEach((li) => {
      const s = li.querySelector('strong');
      if (s && /Réunion/.test(s.textContent)) { const sp = li.querySelector('span'); if (sp) sp.classList.add('sah-fake'); }
    });
  });
}
const ADDRESS = ['#address-name', '#address-streetaddress', '#address-streetaddress2', '#address-streetaddress3',
  '#address-postcode-city', '.order_delivery_mode > div:nth-of-type(2)', '#modal_cancel_order td:first-child'];
const order = (extra) => ({ before: tagOrderNames, fakeNames: ['.sah-fake'], masks: ADDRESS, ...extra });

module.exports = {
  shots: [
    { name: 'fiche-commande', path: PAID, ...order({ clip: { x: 212, y: 60, width: 1228, height: 860 } }) },
    { name: 'fiche-commande-bas', path: PAID, ...order({ fullPage: true, clip: { x: 212, y: 700, width: 1228, height: 640 } }) },
    { name: 'fiche-commande-non-payee', path: UNPAID, ...order({ fullPage: true, clip: { x: 212, y: 60, width: 1228, height: 1100 } }) },
    { name: 'historique-statut', path: PAID, ...order({ clip: { x: 212, y: 60, width: 1228, height: 700 },
      before: async (p) => { await tagOrderNames(p); await p.click('a[href="#tab-2"]'); await p.waitForTimeout(2500); } }) },
    { name: 'annulation-commande', path: PAID, ...order({ selector: '#modal_cancel_order .modal-content',
      before: async (p) => { await tagOrderNames(p); await p.click('a.cancel-order'); await p.waitForTimeout(1200); } }) },
    { name: 'creation-commande', path: '/orders/create', clip: { x: 212, y: 60, width: 1228, height: 560 } },
    { name: 'minisite-hote', path: '/minisite', fullPage: true, clip: { x: 212, y: 60, width: 1228, height: 1060 } },
    { name: 'minisite-visio', path: '/minisite/visio', fullPage: true, clip: { x: 212, y: 60, width: 1228, height: 820 } },
    { name: 'visio-indicateurs', path: '/meetings', wait: 1500, selector: '.modal.in .modal-content, .modal.show .modal-content',
      before: async (p) => { await p.click('button:has-text("Information réunions virtuelles"), a:has-text("Information réunions virtuelles")'); await p.waitForTimeout(2500); } },
    { name: 'activites-creation', path: '/configure/activities/create', clip: { x: 212, y: 60, width: 1228, height: 660 } },
  ],
};
