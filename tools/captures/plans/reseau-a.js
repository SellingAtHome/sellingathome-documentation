// Prises de vue des pages « Gérer les conseillères », « L'organigramme », « Statuts et automatisation »,
// « Rôles des conseillères », « Suivi d'équipe » et « Stocks chez les conseillères » (lot reseau-a).
// Lecture seule : les actions de `before` ne font qu'ouvrir des onglets, menus ou fenêtres, ou remplacer
// des valeurs affichées par des valeurs fictives (aucun envoi de formulaire).
const SELLER = 3416; // conseillère de la marque de démonstration (stock, recruteur, statut)

// Remplace les valeurs affichées dans la fiche d'édition par des valeurs fictives, et vide les champs sensibles.
async function fakeSellerForm(page) {
  await page.evaluate(() => {
    const set = (sel, v) => document.querySelectorAll(sel).forEach((i) => { i.value = v; });
    set('#FirstName', 'Léa'); set('#LastName', 'Bernard'); set('#BirthName', '');
    set('#Email', 'lea.bernard@exemple.fr');
    set('#Phone', ''); set('#MobilePhone', '06 00 00 00 00');
    set('#Birthday', ''); set('#BirthPlace', ''); set('#NationalIdentificationNumber', ''); set('#IdentityCardNumber', '');
    set('#placesearch', ''); set('#Address_StreetAddress', '12 rue des Lilas'); set('#Address_StreetAddress2', '');
    set('#Address_StreetAddress3', ''); set('#Address_Postcode', '69000'); set('#Address_City', 'Lyon');
    set('#CompanyName', ''); set('#CompanyRCSNumber', ''); set('#CompanyIdentificationNumber', ''); set('#CompanyVAT', '');
    set('#RemoteStatus', '');
    ['#AccountBankCode', '#AccountWicketCode', '#AccountNumber', '#AccountKey', '#AccountIban', '#AccountSwiftCode',
      '#BankName', '#BankingDomiciliation', '#BankAccountOwner', '#SecondIban', '#SecondBic', '#SecondBankName',
      '.iban-editor', '.iban-editor2'].forEach((s) => set(s, ''));
    // Noms dans le fil d'Ariane et dans les listes de recruteur / animateur
    const names = ['Petit Chloé', 'Durand Manon'];
    document.querySelectorAll('.select2-selection__rendered').forEach((e, k) => {
      if (e.textContent.trim() && !/Taper le nom/.test(e.textContent)) e.textContent = names[k % 2];
    });
    document.querySelectorAll('.breadcrumb li').forEach((li) => {
      if (/^\s*[A-ZÉ]/.test(li.textContent) && !/Vendeurs|Modifier|Accueil/.test(li.textContent)) {
        const a = li.querySelector('a') || li; a.textContent = 'Léa Bernard';
      }
    });
  });
}

async function tab(page, href) {
  await page.click(`a[href="${href}"]`);
  await page.waitForTimeout(1200);
}

// Noms fictifs : colonnes Nom / Prénom de la liste (le # est la 1re colonne visible)
async function fakeList(page) {
  await page.waitForTimeout(1500);
  await page.evaluate(() => {
    const ln = ['Bernard', 'Petit', 'Durand', 'Leroy', 'Moreau', 'Simon', 'Laurent', 'Michel', 'Garcia', 'Roux'];
    const fn = ['Léa', 'Chloé', 'Manon', 'Inès', 'Jade', 'Louise', 'Emma', 'Alice', 'Lina', 'Zoé'];
    document.querySelectorAll('#sellers-table tbody tr').forEach((tr, k) => {
      const td = tr.children; if (td.length < 4) return;
      td[1].textContent = ln[k % 10].toUpperCase(); td[2].textContent = fn[k % 10];
      td[3].textContent = fn[k % 10].toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '') + '.' + ln[k % 10].toLowerCase() + '@exemple.fr';
    });
  });
}
async function hideToasts(page) {
  await page.addStyleTag({ content: '#toast-container{display:none!important}' });
}
async function fakeFiche(page) {
  await hideToasts(page);
  await page.evaluate(() => {
    document.querySelectorAll('.seller-name').forEach((e) => { e.textContent = 'Léa Bernard'; });
    document.querySelectorAll('.breadcrumb li:last-child').forEach((e) => { e.textContent = 'Léa Bernard'; });
    const links = document.querySelectorAll('.seller-profile-general p a');
    const n = ['Chloé Petit', 'Sophie Martin']; links.forEach((a, k) => { a.textContent = n[k % 2]; });
  });
}
const GRAPH_NAMES = ['.bp-title'];
const MAP_MASK = ['#map', '.leaflet-container', '#seller-map'];

module.exports = {
  shots: [
    { name: 'menu-vendeurs', path: '/sellers', clip: { x: 0, y: 60, width: 232, height: 520 } },
    { name: 'liste-conseilleres', path: '/sellers', wait: 1000, before: fakeList, clip: { x: 212, y: 60, width: 1228, height: 840 } },
    { name: 'filtres-conseilleres', path: '/sellers', wait: 1000,
      before: async (p) => { await fakeList(p); await p.click('#filters'); await p.waitForTimeout(800); },
      selector: '.modal.in .modal-content' },
    { name: 'fiche-conseillere', path: `/sellers/${SELLER}`, wait: 2500, before: async (p) => { await p.waitForTimeout(2000); await fakeFiche(p); },
      clip: { x: 212, y: 60, width: 1228, height: 1100 }, fullPage: true },
    { name: 'edit-infos', path: `/sellers/${SELLER}/edit`, wait: 1500, masks: MAP_MASK,
      before: async (p) => { await hideToasts(p); await fakeSellerForm(p); }, clip: { x: 212, y: 60, width: 1228, height: 1300 }, fullPage: true },
    { name: 'edit-gestion', path: `/sellers/${SELLER}/edit`, wait: 1000,
      before: async (p) => { await hideToasts(p); await tab(p, '#tab-3'); await fakeSellerForm(p); }, clip: { x: 212, y: 60, width: 1228, height: 660 } },
    { name: 'edit-securite', path: `/sellers/${SELLER}/edit`, wait: 1000,
      before: async (p) => { await hideToasts(p); await tab(p, '#tab-4'); await fakeSellerForm(p); }, clip: { x: 212, y: 60, width: 1228, height: 560 } },
    { name: 'edit-bancaire', path: `/sellers/${SELLER}/edit`, wait: 1000,
      before: async (p) => { await hideToasts(p); await tab(p, '#tab-5'); await fakeSellerForm(p); }, clip: { x: 212, y: 60, width: 1228, height: 760 } },
    { name: 'edit-stock', path: `/sellers/${SELLER}/edit`, wait: 2000,
      before: async (p) => { await hideToasts(p); await tab(p, '#tab-7'); await fakeSellerForm(p); }, clip: { x: 212, y: 60, width: 1228, height: 480 } },
    { name: 'graph', path: '/Sellers/Graph', wait: 3000, fakeNames: GRAPH_NAMES, clip: { x: 212, y: 60, width: 1228, height: 840 } },
    { name: 'graph-edition', path: '/Sellers/Graph', wait: 2000, fakeNames: [...GRAPH_NAMES, '.select2-selection__rendered'],
      before: async (p) => { await p.waitForTimeout(2500); await p.locator('.bp-item button[data-buttonname="edit"]').first().click(); await p.waitForTimeout(2000); },
      clip: { x: 1040, y: 60, width: 400, height: 500 } },
    { name: 'statuts', path: '/sellers/status', wait: 1500, clip: { x: 212, y: 60, width: 1228, height: 560 } },
    { name: 'statut-edition', path: '/sellers/status/edit/209', wait: 1000, clip: { x: 212, y: 60, width: 1228, height: 640 } },
    { name: 'statuts-auto', path: '/brandcommissionningruleset/26/status/edit', wait: 1500, fullPage: true, clip: { x: 212, y: 60, width: 1228, height: 900 } },
    { name: 'statuts-auto-regle', path: '/brandcommissionningruleset/26/status/detail/1/edit', wait: 2000, fullPage: true, clip: { x: 212, y: 60, width: 1228, height: 700 } },
    { name: 'roles', path: '/SellersRoles', wait: 1500, clip: { x: 212, y: 60, width: 1228, height: 560 } },
    { name: 'role-creation', path: '/SellersRoles/Create', wait: 1000, clip: { x: 212, y: 60, width: 1228, height: 460 } },
    { name: 'suivi-equipe', path: '/sellers/monitoring', wait: 5000, fullPage: true,
      fakeNames: ['.ag-cell[col-id="SellerCompleteName"]', '.ag-cell[col-id="ParentCompleteName"]', '.ag-cell[col-id="SellerEmail"]'],
      clip: { x: 212, y: 60, width: 1228, height: 1350 } },
    { name: 'entreposage', path: '/Sellers/SellersWarehouses', wait: 2000, clip: { x: 212, y: 60, width: 1228, height: 500 } },
  ],
};
