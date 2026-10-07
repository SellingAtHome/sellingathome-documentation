// Prises de vue des pages « Documents, FAQ et formations », « Les notifications », « Les emails » et « L'assistant IA » (lot pilotage-a)
const SELLER = 47842; // conseillère de la marque de démo (formations, notifications)
const CHAT_SELLER = 3639; // conseillère de démo ayant des conversations avec l'assistant
const hideFixed = async (p) => { await p.evaluate(() => document.querySelectorAll('body *').forEach((e) => { if (getComputedStyle(e).position === 'fixed' && !e.closest('.modal')) e.style.visibility = 'hidden'; })); };
// Retire les lignes de test de la marque de démo (et toute mention d'une marque cliente)
const dropRows = (sel, re) => async (p) => { await p.waitForTimeout(1500); await p.evaluate(({ sel, src }) => { const re = new RegExp(src, 'i');
  document.querySelectorAll(sel).forEach((tr) => { if (re.test(tr.textContent)) tr.remove(); }); }, { sel, src: re.source }); };

module.exports = {
  shots: [
    // ---- Base de connaissances
    { name: 'documents-liste', path: '/knowledgedocuments', wait: 2000, before: dropRows('#documents-table tbody tr', /\btest\b|Document important/),
      clip: { x: 212, y: 60, width: 1228, height: 640 } },
    { name: 'document-assistant', path: '/knowledgedocuments/188/edit', wait: 1500,
      before: async (p) => { await hideFixed(p); await p.evaluate(() => { const h = [...document.querySelectorAll('label,h4,h5,div')].filter((e) => e.children.length === 0 && /Statut minimum du vendeur/i.test(e.textContent)).pop(); if (h) { h.scrollIntoView({ block: 'start' }); window.scrollBy(0, -20); } }); await p.waitForTimeout(500); },
      clip: { x: 440, y: 0, width: 770, height: 900 } },
    { name: 'faq-liste', path: '/faq', wait: 2000, clip: { x: 212, y: 60, width: 1228, height: 640 } },
    { name: 'faq-ajout', path: '/faq/add', wait: 1000, clip: { x: 212, y: 60, width: 1228, height: 700 } },
    { name: 'formations-liste', path: '/formations', wait: 2000,
      before: async (p) => { await p.evaluate(() => document.querySelectorAll('.training-global').forEach((c) => { if (/tupperware|Questionnaire$/i.test(c.querySelector('h5')?.textContent.trim() || '')) c.remove(); })); },
      clip: { x: 212, y: 60, width: 1228, height: 640 } },
    { name: 'formation-stats', path: '/formations', wait: 2000,
      before: async (p) => { await p.locator('.training-global').first().locator('.detail-formation').click(); await p.waitForTimeout(2500); },
      clip: { x: 440, y: 60, width: 1000, height: 700 } },
    { name: 'formation-nouvelle', path: '/formations', wait: 2000,
      before: async (p) => { await p.locator('button:has-text("Nouvelle formation")').first().click(); await p.waitForTimeout(2000); },
      clip: { x: 440, y: 60, width: 1000, height: 560 } },
    { name: 'widget-formations', path: `/sellers/${SELLER}`, wait: 3000, before: hideFixed,
      selector: 'div.ibox:has-text("modules commencés"):not(:has(div.ibox:has-text("modules commencés")))' },
    // ---- Notifications
    { name: 'notifications-credit', path: '/purchase/notification', wait: 1500, clip: { x: 212, y: 60, width: 1228, height: 640 } },
    { name: 'notifications-parametres', path: '/notifications/setting', wait: 1500, fullPage: true, clip: { x: 212, y: 60, width: 1228, height: 900 } },
    { name: 'notifications-envoi-masse', path: '/notifications/notificationMassSend', wait: 2000, clip: { x: 212, y: 60, width: 1228, height: 560 } },
    { name: 'fiche-notifications', path: `/sellers/${SELLER}/edit/9`, wait: 3000, masks: ['.page-heading h2', '.breadcrumb li', '#seller-notification-table tbody td:nth-child(4)'],
      before: async (p) => { await p.locator('a[href="#tab-9"]').first().click(); await p.waitForTimeout(3500); },
      clip: { x: 212, y: 60, width: 1228, height: 760 } },
    { name: 'fiche-assistant', path: `/sellers/${SELLER}/edit`, wait: 3000, masks: ['.page-heading h2', '.breadcrumb li:last-child'],
      before: async (p) => { await p.evaluate(() => { const l = document.querySelector('#ChatAssistantActiveCheck'); const tab = l && l.closest('.tab-pane'); if (tab) { const a = document.querySelector(`a[href="#${tab.id}"]`); if (a) a.click(); } }); await p.waitForTimeout(1000);
        await p.evaluate(() => document.querySelector('#ChatAssistantActiveCheck')?.closest('.ibox')?.scrollIntoView({ block: 'center' })); await p.waitForTimeout(500); },
      selector: '#ChatAssistantActiveCheck >> xpath=ancestor::div[contains(@class,"ibox")][1]' },
    // ---- Emails
    { name: 'templates-liste', path: '/emailtemplates', wait: 2000, clip: { x: 212, y: 60, width: 1228, height: 700 } },
    { name: 'template-edition', path: '/emailtemplates/68/edit', wait: 3000, fullPage: true, masks: ['#preview-iframe'], clip: { x: 212, y: 60, width: 1228, height: 1000 } },
    { name: 'emails-envoyes', path: '/reports/emails', wait: 2500, masks: ['#emails-report-table tbody td:nth-child(3)'], clip: { x: 212, y: 60, width: 1228, height: 640 } },
    { name: 'email-detail', path: '/reports/emails/7378740', wait: 2500, fullPage: true, masks: ['iframe'], clip: { x: 212, y: 60, width: 1228, height: 900 } },
    // ---- Mon assistant
    { name: 'assistant-reporting', path: '/chatassistant?period=3months', wait: 2500, fullPage: true, fakeNames: ['#ca-table tbody td:nth-child(1)'], clip: { x: 212, y: 60, width: 1228, height: 960 } },
    { name: 'assistant-conversations', path: `/chatassistant/conversations?sellerId=${CHAT_SELLER}`, wait: 2500, fullPage: true,
      masks: ['.page-heading h2', 'h3', 'h4', 'h5', '.ibox-content p', '.ibox-content td', '.ibox-content .chat-message', '.select2-selection__rendered'], clip: { x: 212, y: 60, width: 1228, height: 800 } },
    { name: 'assistant-feedbacks', path: '/chatassistant/feedbacks?period=3months', wait: 2500, fullPage: true, masks: ['table tbody td:nth-child(2)', 'table tbody td:nth-child(3)'], clip: { x: 212, y: 60, width: 1228, height: 800 } },
    { name: 'assistant-credits', path: '/chatassistant/credits', wait: 2000, fullPage: true, masks: ['table tbody td:nth-child(4)', 'input[name=notifyEmail]'], clip: { x: 212, y: 60, width: 1228, height: 1250 } },
    { name: 'assistant-parametres', path: '/chatassistant/settings', wait: 1500, clip: { x: 212, y: 60, width: 1228, height: 640 } },
  ],
};
