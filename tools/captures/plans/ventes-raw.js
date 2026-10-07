module.exports = { shots: [
  { name: 'raw-ago', path: '/configure/autogiftorder', wait: 1500, fullPage: true },
  { name: 'raw-ago-edit', path: '/configure/autogiftorder/1023/edit', wait: 2000, fullPage: true },
  { name: 'raw-cms', path: '/ordercmsblocks/create', wait: 1500, fullPage: true },
  { name: 'raw-question', path: '/configure/orders', wait: 1500, before: async (p) => { await p.click('button:has-text("Ajouter une question"), a:has-text("Ajouter une question")'); await p.waitForTimeout(1000); }, selector: '.modal.in .modal-content, .modal.show .modal-content' },
  { name: 'raw-fixedcost', path: '/configure/orders', wait: 1500, before: async (p) => { await p.click('button:has-text("Ajouter un frais fixe"):not(:has-text("master")), a:has-text("Ajouter un frais fixe"):not(:has-text("master"))'); await p.waitForTimeout(1000); }, selector: '.modal.in .modal-content, .modal.show .modal-content' },
]};
