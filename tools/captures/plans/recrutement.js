// Prises de vue du lot « Recrutement » (candidatures v2, kit de démarrage, carte des conseillères).
// Données personnelles des candidats : noms remplacés (fakeNames) ou floutés (masks). Relire chaque image.
const LIST_NAMES = ['#candidacy-table tbody td:nth-child(2)'];
const HEADER = ['.page-heading h2', '.page-heading .breadcrumb li:last-child'];
const unfix = async (p) => {
  await p.evaluate(() => {
    window.scrollTo(0, 0);
  });
};
const tab = (href) => async (p) => { await p.click(`a[href="${href}"]`); await p.waitForTimeout(800); await unfix(p); };
// Titre et fil d'Ariane « Recrutement : <nom> » : on garde le libellé, on remplace le nom.
const heading = (label) => async (p) => {
  await p.evaluate((label) => {
    const h = document.querySelector('.page-heading h2'); if (h) h.textContent = label + ' : Camille Martin';
    const b = document.querySelector('.page-heading .breadcrumb li:last-child'); if (b) b.textContent = label + ' : Camille Martin';
  }, label);
  await unfix(p);
};

module.exports = {
  shots: [
    { name: 'liste-candidatures', path: '/candidacies', fakeNames: LIST_NAMES, wait: 2000, clip: { x: 212, y: 60, width: 1228, height: 760 } },
    { name: 'fiche-candidat', path: '/candidacies/26343/details', before: heading('Recrutement'), fakeNames: ['.candidacy-name'], masks: ['.candidacy-adress'], wait: 1500, clip: { x: 212, y: 60, width: 1228, height: 560 } },
    { name: 'fiche-candidat-contrat', path: '/candidacies/26638/details', before: heading('Recrutement'), fakeNames: ['.candidacy-name'], masks: ['.candidacy-adress'], wait: 1500, clip: { x: 212, y: 60, width: 1228, height: 560 } },
    { name: 'edition-candidat', path: '/candidacies/26343/edit', before: heading('Editer les informations'), wait: 1500, fullPage: true,
      masks: ['input.form-control', 'select.form-control', 'textarea.form-control', '.select2-selection__rendered', '.intl-tel-input input'],
      clip: { x: 212, y: 60, width: 1228, height: 1580 } },
    { name: 'parametres-general', path: '/candidacies/settings', wait: 1500, clip: { x: 212, y: 60, width: 1228, height: 680 } },
    { name: 'parametres-formulaires', path: '/candidacies/settings', wait: 1500, before: tab('#tab-2'), fullPage: true, clip: { x: 212, y: 60, width: 1228, height: 900 } },
    { name: 'parametres-contenus', path: '/candidacies/settings', wait: 1500, before: tab('#tab-3'), fullPage: true, clip: { x: 212, y: 60, width: 1228, height: 1250 } },
    { name: 'parametres-demandes', path: '/candidacies/settings', wait: 1500, before: tab('#tab-4'), fullPage: true, clip: { x: 212, y: 60, width: 1228, height: 640 } },
    { name: 'parametres-kit', path: '/candidacies/settings', wait: 1500, before: tab('#tab-5'), fullPage: true, clip: { x: 212, y: 60, width: 1228, height: 1250 } },
    { name: 'messages-carte', path: '/widget/messages', wait: 2000,
      before: async (p) => {
        await p.evaluate(() => {
          const ln = ['Martin', 'Bernard', 'Petit', 'Durand', 'Leroy', 'Moreau', 'Simon', 'Laurent', 'Michel', 'Garcia'];
          const fn = ['Camille', 'Inès', 'Emma', 'Zoé', 'Jade', 'Alice', 'Lina', 'Rose', 'Anna', 'Mila'];
          document.querySelectorAll('table.dataTable tbody tr').forEach((tr, i) => {
            if (tr.children[0]) tr.children[0].textContent = ln[i % ln.length];
            if (tr.children[1]) tr.children[1].textContent = fn[i % fn.length];
          });
        });
      },
      fakeNames: ['table.dataTable tbody td:nth-child(6)'],
      masks: ['table.dataTable tbody td:nth-child(8)'],
      clip: { x: 212, y: 60, width: 1228, height: 760 } },
    { name: 'configuration-carte', path: '/widget/configure', wait: 1500, fullPage: true, before: unfix, masks: ['.widget-url'], clip: { x: 212, y: 60, width: 1228, height: 1250 } },
  ],
};
