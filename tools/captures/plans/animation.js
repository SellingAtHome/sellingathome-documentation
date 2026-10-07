// Prises de vue des pages « Les clientes », « Le parrainage client » et « Les segments de clientes » (lot animation).
// Lecture seule : les actions de `before` ne font qu'ouvrir des onglets, des fenêtres ou des étapes d'assistant,
// ou remplacer / masquer des valeurs affichées par des valeurs fictives (aucun envoi de formulaire).
const MARRAINE = 3499412; // cliente de la marque de démonstration ayant deux filleules
const FILLEULE = 3499421; // cliente de la marque de démonstration ayant une marraine

const LIST_NAMES = [];
// Noms et prénoms de la liste remplacés par des valeurs fictives (colonne par colonne).
async function fakeList(page) {
  await page.waitForTimeout(1500);
  await page.evaluate(() => {
    const ln = ['Martin', 'Bernard', 'Petit', 'Durand', 'Leroy', 'Moreau', 'Simon', 'Laurent', 'Michel', 'Garcia'];
    const fn = ['Camille', 'Léa', 'Chloé', 'Manon', 'Inès', 'Jade', 'Louise', 'Emma', 'Alice', 'Zoé'];
    document.querySelectorAll('#customers-table tbody tr').forEach((tr, i) => {
      if (tr.children[1]) tr.children[1].textContent = ln[i % ln.length];
      if (tr.children[2]) tr.children[2].textContent = fn[i % fn.length];
    });
  });
}

// Remplace les noms visibles de la fiche (consultation) par des noms fictifs et masque l'adresse.
async function fakeDetails(page) {
  await page.evaluate(() => {
    const names = ['Martin Camille', 'Bernard Léa', 'Petit Chloé', 'Leroy Inès', 'Laurent Emma', 'Roux Zoé'];
    let k = 0;
    const repl = (e) => {
      const w = document.createTreeWalker(e, NodeFilter.SHOW_TEXT);
      let n, done = false;
      while ((n = w.nextNode())) {
        if (!n.nodeValue.trim()) continue;
        if (!done) { n.nodeValue = names[k++ % names.length]; done = true; } else n.nodeValue = '';
      }
    };
    // Nom de la cliente (titre de la carte profil)
    document.querySelectorAll('.wrapper-content h2, .wrapper-content h3').forEach((h) => {
      if (!/€|Clients|Actualit/.test(h.textContent) && h.textContent.trim()) repl(h);
    });
    // Conseillères (liens vers les fiches vendeurs) et auteurs des commandes dans l'historique de points
    document.querySelectorAll('a[href*="/sellers/"], a[href*="/Sellers/"]').forEach(repl);
    document.querySelectorAll('.breadcrumb li:last-child').forEach((li) => { (li.querySelector('a') || li).textContent = 'Camille Martin'; });
    // Titres « Réunion <nom> (CODE) » de l'historique de points
    const w2 = document.createTreeWalker(document.querySelector('.wrapper-content') || document.body, NodeFilter.SHOW_TEXT);
    let t;
    while ((t = w2.nextNode())) {
      t.nodeValue = t.nodeValue.replace(/(Réunion\s+)([^()]+?)(\s*\()/g, '$1Jade Moreau$3');
      // Adresse postale de la carte profil
      if (/\d{5}/.test(t.nodeValue) && /rue|avenue|bd|chemin|place|allée/i.test(t.nodeValue)) t.nodeValue = '12 rue des Lilas, 69000 Lyon';
    }
    document.querySelectorAll('.ticket-info span, .ticket-title').forEach((e) => {
      e.childNodes.forEach((c) => { if (c.nodeType === 3) c.nodeValue = c.nodeValue.replace(/(par|by)\s+.+$/i, '$1 Camille Martin'); });
    });
  });
}

// Remplace les valeurs du formulaire d'édition par des valeurs fictives.
async function fakeEdit(page) {
  await page.evaluate(() => {
    const set = (sel, v) => document.querySelectorAll(sel).forEach((i) => { i.value = v; });
    set('#FirstName', 'Inès'); set('#LastName', 'Leroy'); set('#Email', 'ines.leroy@exemple.fr');
    set('#Phone', ''); set('#MobilePhone', '06 00 00 00 00'); set('#Birthday', '');
    set('#placesAutocompleteInput', ''); set('#Address_StreetAddress', '12 rue des Lilas'); set('#Address_StreetAddress2', '');
    set('#Address_StreetAddress3', ''); set('#Address_Postcode', '69000'); set('#Address_City', 'Lyon');
    set('#Address_Latitude', ''); set('#Address_Longitude', '');
    set('#CustomerParentName', 'Camille Martin');
    set('#CompanyName', ''); set('#CompanyIdentificationNumber', ''); set('#CompanyVAT', '');
    document.querySelectorAll('.page-heading h2').forEach((h) => { h.textContent = h.textContent.replace(/:.*$/, ': Inès Leroy'); });
  });
}

async function tab(page, href) {
  await page.click(`a[href="${href}"]`);
  await page.waitForTimeout(1200);
}

module.exports = {
  shots: [
    // Menu Clients ouvert
    { name: 'menu-clients', path: '/customers', clip: { x: 0, y: 60, width: 232, height: 520 } },
    // Liste des clientes
    { name: 'liste-clientes', path: '/customers', wait: 1000, before: fakeList, clip: { x: 212, y: 60, width: 1228, height: 840 } },
    { name: 'filtres-clientes', path: '/customers', wait: 2000, fakeNames: LIST_NAMES,
      before: async (p) => { await fakeList(p); await p.click('#filters'); await p.waitForTimeout(800); },
      selector: '.modal.in .modal-content' },
    // Fiche (consultation) d'une marraine
    { name: 'fiche-cliente', path: `/customers/${MARRAINE}`, wait: 2500, before: fakeDetails, fullPage: true, clip: { x: 212, y: 60, width: 1228, height: 1040 },
      masks: ['#map', '.leaflet-container', 'address'] },
    // Fiche (édition) : onglets
    { name: 'edit-infos', path: `/customers/edit/${FILLEULE}`, wait: 2000, before: fakeEdit, fullPage: true, clip: { x: 212, y: 60, width: 1228, height: 1340 }, masks: ['#map', '.leaflet-container'] },
    { name: 'edit-points', path: `/customers/edit/${FILLEULE}`, wait: 1000,
      before: async (p) => { await tab(p, '#tab-3'); await fakeEdit(p); }, clip: { x: 212, y: 60, width: 1228, height: 560 } },
    { name: 'edit-fidelite', path: `/customers/edit/${MARRAINE}`, wait: 1000,
      before: async (p) => { await tab(p, '#tab-4'); await fakeEdit(p); }, clip: { x: 212, y: 60, width: 1228, height: 560 } },
    { name: 'edit-anonymiser', path: `/customers/edit/${FILLEULE}`, wait: 1000,
      before: async (p) => { await tab(p, '#tab-5'); await fakeEdit(p); }, clip: { x: 212, y: 60, width: 1228, height: 420 } },
    // Rôles clients : le nom d'un rôle libre portant un nom de personne est flouté
    { name: 'roles-clients', path: '/customers/roles', wait: 1500,
      before: async (p) => { await p.evaluate(() => document.querySelectorAll('#roles-table tbody tr').forEach((tr) => { if (/BOURAS/i.test(tr.textContent)) tr.children[0].classList.add('sah-mask'); })); }, masks: ['.sah-mask'],
      clip: { x: 212, y: 60, width: 1228, height: 560 } },
    { name: 'role-creation', path: '/customers/roles/create', wait: 1500, clip: { x: 212, y: 60, width: 1228, height: 560 } },
    // Segments
    { name: 'liste-segments', path: '/segments', wait: 1500, clip: { x: 212, y: 60, width: 1228, height: 460 } },
    { name: 'segment-etape1', path: '/segments/create', wait: 1500, clip: { x: 212, y: 60, width: 1228, height: 640 } },
    { name: 'segment-profil', path: '/segments/170/edit', wait: 1500,
      before: async (p) => { await p.click('a[href="#next"]'); await p.waitForTimeout(1000); }, clip: { x: 212, y: 60, width: 1228, height: 640 } },
    { name: 'segment-commercial', path: '/segments/164/edit', wait: 1500,
      before: async (p) => { await p.click('a[href="#next"]'); await p.waitForTimeout(800); await p.click('a[href="#next"]'); await p.waitForTimeout(1000); }, clip: { x: 212, y: 60, width: 1228, height: 640 } },
    { name: 'segment-validation', path: '/segments/170/edit', wait: 1500,
      before: async (p) => { for (let i = 0; i < 3; i++) { await p.click('a[href="#next"]'); await p.waitForTimeout(800); } }, clip: { x: 212, y: 60, width: 1228, height: 640 } },
    // Filtre par segment dans la liste des clientes
    { name: 'liste-clientes-segment', path: '/customers', wait: 2000, fakeNames: LIST_NAMES,
      before: async (p) => { await fakeList(p); await p.click('#filters'); await p.waitForTimeout(600); await p.selectOption('#Segments', '128'); await p.waitForTimeout(300); },
      selector: '.modal.in .modal-content' },
  ],
};
