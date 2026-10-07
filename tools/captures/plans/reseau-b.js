// Prises de vue des pages « Le plan de rémunération », « Clôture et versement des commissions », « Cotisations sociales et précompte »
// Lecture seule : aucun clic sur Enregistrer, Ajouter, flèches de rang (GET qui modifient !), suppression, génération ou envoi.
const C = { x: 212, y: 60, width: 1228, height: 840 };
// Remplace nom / prénom par des noms fictifs cohérents (colonnes 2 et 3 de #sellers-table)
const fakeSellerCols = (p) => p.evaluate(() => {
  const LN = ['Martin', 'Bernard', 'Petit', 'Durand', 'Leroy', 'Moreau', 'Simon', 'Laurent', 'Michel', 'Garcia', 'Roux', 'Fournier'];
  const FN = ['Léa', 'Chloé', 'Manon', 'Sophie', 'Camille', 'Inès', 'Emma', 'Zoé', 'Louise', 'Alice', 'Lina', 'Rose'];
  document.querySelectorAll('#sellers-table tbody tr').forEach((tr, i) => {
    if (tr.children[1]) tr.children[1].textContent = LN[i % LN.length];
    if (tr.children[2]) tr.children[2].textContent = FN[(i * 5) % FN.length];
  });
});
// Remplace le nom de la conseillère dans le titre et le fil d'Ariane
const fakeHeading = (p) => p.evaluate(() => {
  document.querySelectorAll('.page-heading h2, .breadcrumb li:last-child, .breadcrumb li:last-child *').forEach((e) => e.childNodes.forEach((n) => {
    if (n.nodeType === 3 && n.nodeValue.trim()) n.nodeValue = n.nodeValue.replace(/^\s*[^-]+?(\s+-\s+|\s*$)/, 'Léa Martin$1');
  }));
});
const fakeCrumb = (p) => p.evaluate(() => {
  document.querySelectorAll('.breadcrumb li:last-child, .breadcrumb li:last-child *').forEach((e) => e.childNodes.forEach((n) => {
    if (n.nodeType === 3 && n.nodeValue.trim()) n.nodeValue = n.nodeValue.replace(/^\s*[^-]+?(\s+-\s+|\s*$)/, 'Léa Martin$1');
  }));
});
module.exports = {
  shots: [
    { name: 'plans-liste', path: '/brandcommissionningruleset', wait: 1500, fakeNames: ['#ruleset-table tbody td:nth-child(4)'], clip: { x: 212, y: 60, width: 1228, height: 400 } },
    { name: 'plan-regles', path: '/brandcommissionningruleset/26/edit', wait: 1500, clip: { x: 212, y: 60, width: 1228, height: 700 } },
    { name: 'regle-valeurs', path: '/brandcommissionningruleset/26/rules/1/edit', wait: 1500, clip: { x: 212, y: 60, width: 1228, height: 600 } },
    { name: 'valeur-conditions', path: '/brandcommissionningruleset/26/rules/1/values/1/edit', wait: 1500, clip: { x: 212, y: 60, width: 1228, height: 470 } },
    { name: 'commissions-liste', path: '/sellers/commissions', wait: 2000,
      before: async (p) => {
        await p.selectOption('select[name="filtering_table_year_commission"]', '2026');
        await p.selectOption('select[name="filtering_table_month_commission"]', '3');
        await p.waitForTimeout(2500);
        await fakeSellerCols(p);
        // prépare le filtre des cotisations sociales (trimestre clos) pour la prise suivante
        await p.evaluate(() => { localStorage.setItem('TrimesterFilterSocialContributions', '1'); localStorage.setItem('YearFilterSocialContributions', '2026'); localStorage.setItem('IsActiveFilterSocialContributions', '2'); });
      }, clip: C },
    { name: 'commission-detail', path: '/sellers/3298/commission/2026/3', wait: 1500, before: fakeHeading, clip: { x: 212, y: 60, width: 1228, height: 600 } },
    { name: 'commission-calcul', path: '/sellers/3298/commissiondetailcalculation/1024217', wait: 2000, before: fakeHeading, fullPage: true },
    { name: 'cotisations-liste', path: '/sellers/socialContributions', wait: 6000, before: async (p) => { await p.waitForTimeout(3000); await fakeSellerCols(p); }, clip: C },
    { name: 'cotisation-detail', path: '/sellers/3639/socialcontributions/2025/4', wait: 1500, before: fakeCrumb, clip: { x: 212, y: 60, width: 1228, height: 540 } },
    { name: 'suivi-emails', path: '/commissionsclosureemailtracking', wait: 2000, fullPage: true, clip: { x: 212, y: 60, width: 620, height: 1140 } },
    { name: 'config-cotisations', path: '/configure', wait: 1500, selector: '.ibox:has(h5:has-text("Gestion des cotisations sociales"))' },
  ],
};
