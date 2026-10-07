// Prises de vue du lot « catalogue-a » : produits, catégories, attributs, prix et taxes, stocks (marque de démo)
// Lecture seule : uniquement des ouvertures d'onglets, de fenêtres et de panneaux, jamais d'enregistrement.
const P = '/products/383126/edit'; // produit simple suivi par attributs (bague)
const ROLE = '/products/384725/edit'; // produit avec prix rôles
const GROUP = '/products/383125/edit'; // produit groupé
const KIT = '/products/383124/edit'; // kit variable
const tab = (n) => async (p) => {
  await p.evaluate((n) => { const a = document.querySelector(`a[href="#tab-${n}"]`); if (window.jQuery) jQuery(a).tab('show'); else a.click(); }, n);
  await p.waitForTimeout(1500);
};
const box = (title) => `.ibox:has(> .ibox-title h5:text-is("${title}"))`;
const hideFixed = async (p) => { await p.evaluate(() => document.querySelectorAll('body *').forEach((e) => { const cs = getComputedStyle(e); if ((cs.position === 'fixed' || cs.position === 'sticky') && !e.closest('.modal')) e.style.visibility = 'hidden'; })); };
const VIEW = { x: 212, y: 60, width: 1228, height: 840 };
const SIDE = { x: 840, y: 60, width: 600, height: 840 };

module.exports = {
  shots: [
    // Liste des produits
    { name: 'liste-produits', path: '/products', wait: 2000, clip: VIEW },
    { name: 'filtres-produits', path: '/products', wait: 1500,
      before: async (p) => { await p.click('#filters'); await p.waitForTimeout(800); }, selector: '.modal.in .modal-content' },
    { name: 'import-stocks', path: '/products', wait: 1500,
      before: async (p) => { await p.click('#btn-import-stock'); await p.waitForTimeout(800); }, selector: '.modal.in .modal-content' },
    { name: 'creation-produit', path: '/products/create', wait: 1500, clip: VIEW },
    // Fiche produit : Infos produit
    { name: 'fiche-onglets', path: P, wait: 1500, clip: { x: 212, y: 60, width: 1228, height: 560 } },
    { name: 'fiche-general', path: P, wait: 1500, before: hideFixed, selector: box('Informations générales') },
    { name: 'fiche-inventaire', path: P, wait: 1500, before: hideFixed, selector: box('Inventaire') },
    { name: 'fiche-livraison', path: P, wait: 1500, before: hideFixed, selector: box('Livraison') },
    { name: 'fiche-categories', path: P, wait: 1500, before: hideFixed, selector: box('Association des catégories') },
    { name: 'fiche-acces', path: P, wait: 1500, before: hideFixed, selector: box("Liste de contrôle d'accès") },
    { name: 'fiche-complementaires', path: P, wait: 1500, before: hideFixed, selector: box('Produits complémentaires') },
    { name: 'fiche-stock-mobilise', path: P, wait: 1500,
      before: async (p) => { await p.click('#btn-show-mobilized-stock-details'); await p.waitForTimeout(1500); }, selector: '.modal.in .modal-content' },
    { name: 'fiche-groupe', path: GROUP, wait: 1500, before: hideFixed, selector: box('Produits associés') },
    { name: 'fiche-groupe-general', path: GROUP, wait: 1500, clip: { x: 212, y: 60, width: 1228, height: 700 } },
    { name: 'fiche-composants', path: KIT, before: tab(9), clip: VIEW },
    { name: 'fiche-composant-edition', path: KIT, before: async (p) => { await tab(9)(p); await p.locator('.edit-component').first().click(); await p.waitForTimeout(1500); }, clip: VIEW },
    // Attributs et combinaisons
    { name: 'fiche-attributs', path: P, before: tab(3), clip: VIEW },
    { name: 'fiche-valeurs', path: P, before: async (p) => { await tab(3)(p); await p.locator('.see-edit-values').first().click(); await p.waitForTimeout(1500); }, clip: VIEW },
    { name: 'fiche-combinaisons', path: P, before: tab(4), clip: VIEW },
    { name: 'fiche-combinaison-edition', path: P, before: async (p) => { await tab(4)(p); await p.locator('.edit-combination').first().click(); await p.waitForTimeout(1500); }, clip: VIEW },
    // Tarifs
    { name: 'fiche-tarifs', path: ROLE, before: tab(5), clip: VIEW },
    { name: 'fiche-tarif-ajout', path: ROLE, before: async (p) => { await tab(5)(p); await p.click('#btn_add_price'); await p.waitForTimeout(1200); }, clip: VIEW },
    { name: 'fiche-prix-roles', path: ROLE, before: async (p) => { await tab(5)(p); await p.locator('.edit-price-role').first().click(); await p.waitForTimeout(2000); }, selector: '.modal.in .modal-content' },
    // Historique, conditions, approvisionnement, stock vendeurs
    { name: 'fiche-historique', path: P, before: tab(6), clip: VIEW },
    { name: 'fiche-conditions', path: P, before: tab(7), clip: { x: 212, y: 60, width: 1228, height: 640 } },
    { name: 'fiche-fournisseurs', path: P, before: tab(8), clip: { x: 212, y: 60, width: 1228, height: 640 } },
    { name: 'fiche-duplication', path: P, wait: 1500, before: async (p) => { await p.click('#duplicate-product'); await p.waitForTimeout(1200); }, clip: VIEW },
    // Catégories et attributs
    { name: 'categories', path: '/categories', wait: 1500, clip: VIEW },
    { name: 'categorie-edition', path: '/categories/edit/7387', wait: 1500, fullPage: true, clip: { x: 212, y: 60, width: 1228, height: 1300 } },
    { name: 'attributs', path: '/productattributes', wait: 1500, clip: VIEW },
    { name: 'attribut-edition', path: '/productattributes/35/edit', wait: 1500, clip: VIEW },
    // Taxes
    { name: 'taxes', path: '/taxes', wait: 1500, clip: VIEW },
    { name: 'zones', path: '/taxes', wait: 1000, before: async (p) => { await p.click('a[href="#tab-zones"]'); await p.waitForTimeout(800); }, clip: { x: 212, y: 60, width: 1228, height: 500 } },
    { name: 'zone-creation', path: '/taxes/zones/add', wait: 1500, before: hideFixed, selector: '.ibox' },
    { name: 'taxe-edition', path: '/taxes/edit/2', wait: 1500, clip: VIEW },
    // Stocks : rapport, souhaits, réglages
    { name: 'stock-faible', path: '/reports/lowstock', wait: 1500, clip: VIEW },
    { name: 'liste-souhaits', path: '/wishlist', wait: 1500, clip: VIEW },
    { name: 'reglages-stock', path: '/configure', wait: 1500, before: hideFixed, selector: '.ibox:has(#HowDisplayStockForVdi)' },
    { name: 'reglages-seuil', path: '/configure', wait: 1500, before: hideFixed, selector: '.ibox:has(#LowStockReportMinimalQuantity)' },
    { name: 'reglages-restock', path: '/configure/orders', wait: 1500, before: hideFixed, selector: box('Paramètres des commandes') },
  ],
};
