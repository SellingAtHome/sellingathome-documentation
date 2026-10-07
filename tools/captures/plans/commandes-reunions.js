// Prises de vue des pages « Comprendre les commandes » et « Le cycle de vie d'une réunion »
const ORDER_NAMES = ['#orders-table tbody tr:not(.group) td:nth-child(6)', '#orders-table tbody tr:not(.group) td:nth-child(7)', '#orders-table tbody tr:not(.group) td:nth-child(8)'];
const MEETING_NAMES = ['#meetings-table tbody td:nth-child(1)', '#meetings-table tbody td:nth-child(8)'];

module.exports = {
  shots: [
    { name: 'liste-commandes', path: '/orders', fakeNames: ORDER_NAMES, wait: 1500, clip: { x: 212, y: 60, width: 1228, height: 840 } },
    { name: 'filtres-commandes', path: '/orders', fakeNames: ORDER_NAMES, wait: 1000,
      before: async (p) => { await p.click('button:has-text("Filtrer"), a:has-text("Filtrer")'); await p.waitForTimeout(800); }, selector: '.modal.in .modal-content, .modal.show .modal-content' },
    { name: 'detail-reunion', path: '/meetings', fakeNames: [...MEETING_NAMES, '.modal.in .modal-title'], wait: 1500,
      before: async (p) => {
        // première réunion terminée avec un chiffre d'affaires non nul
        const i = await p.evaluate(() => [...document.querySelectorAll('#meetings-table tbody tr')].findIndex((tr) =>
          /Terminée/.test(tr.children[4]?.textContent || '') && !/^\s*0,00/.test(tr.children[5]?.textContent || '')));
        await p.locator('#meetings-table tbody tr').nth(Math.max(i, 0)).locator('button, a').filter({ has: p.locator('.fa-eye') }).first().click();
        await p.waitForTimeout(1500);
      },
      selector: '.modal.in .modal-content, .modal.show .modal-content' },
    { name: 'parametres-reunions', path: '/configure/meetings', fullPage: true, clip: { x: 212, y: 140, width: 1228, height: 1100 } },
    { name: 'liste-reunions', path: '/meetings', fakeNames: MEETING_NAMES, wait: 1500, clip: { x: 212, y: 60, width: 1228, height: 840 } },
  ],
};
