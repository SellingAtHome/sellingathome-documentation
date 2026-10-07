// Prises de vue des pages « Rapports et exports » et « La configuration de la marque » (lot pilotage-b)
const CONF_MASKS = ['#placesAutocompleteInput', '#Address_StreetAddress', '#Address_Postcode', '#Address_City', '#Address_Latitude', '#Address_Longitude',
  '#ContactEmail', '#ContactPhone', '#SupportEmail', '#BankName', '#AccountBankCode', '#AccountWicketCode', '#AccountNumber', '#AccountKey', '#AccountIban',
  '#SwiftCode', '#Siret', '#TVA', '#map'];
const openFirst = (sel) => async (p) => { await p.waitForTimeout(1500); await p.locator(sel).first().click(); await p.waitForTimeout(1500); };

module.exports = {
  shots: [
    { name: 'stock-faible', path: '/reports/lowstock', wait: 2000, clip: { x: 212, y: 60, width: 1228, height: 760 } },
    { name: 'meilleures-ventes', path: '/reports/bestsales', wait: 2000, clip: { x: 212, y: 60, width: 1228, height: 760 } },
    { name: 'meilleures-ventes-detail', path: '/reports/bestsales', masks: ['#best-sales-details-table tbody td:nth-child(2)', '#best-sales-details-table tbody td:nth-child(3)'],
      before: openFirst('.view-bestsales-details'), selector: '.modal.in .modal-content, .modal.show .modal-content' },
    { name: 'questions', path: '/reports/questions', wait: 2000, clip: { x: 212, y: 60, width: 1228, height: 600 } },
    // Liste limitée aux exports standards (les exports propres à certaines marques sont retirés de l'affichage, lecture seule)
    { name: 'export-donnees', path: '/exportqueries', wait: 1000, selector: '.wrapper-content .ibox',
      before: async (p) => { await p.evaluate(() => { const keep = /^(Points de fidélité|Export (des|du|détaillé|historique|wishlist)|Exports des retours)/;
        document.querySelectorAll('#status-table tbody tr').forEach((tr) => { const n = tr.children[0].textContent.trim();
          if (!keep.test(n) || /Odass|SFCC|DSN|spécifique/i.test(n)) tr.remove(); });
          document.querySelectorAll('body *').forEach((e) => { if (getComputedStyle(e).position === 'fixed') e.style.visibility = 'hidden'; }); }); } },
    { name: 'export-parametres', path: '/exportqueries/7/export', wait: 1000, clip: { x: 212, y: 60, width: 1228, height: 620 } },
    { name: 'configuration-generale', path: '/configure', masks: CONF_MASKS, wait: 1500, fullPage: true, clip: { x: 212, y: 60, width: 1228, height: 1600 } },
    { name: 'configuration-clients', path: '/configure', masks: CONF_MASKS, wait: 1500, fullPage: true, clip: { x: 212, y: 1660, width: 1228, height: 430 } },
    { name: 'configuration-statistiques', path: '/configure', before: openFirst('#ChooseStatsSeller'), selector: '.modal.in .modal-content, .modal.show .modal-content' },
    { name: 'configuration-rgpd', path: '/configure', before: openFirst('#ModifyGDPR'), selector: '.modal.in .modal-content, .modal.show .modal-content' },
  ],
};
