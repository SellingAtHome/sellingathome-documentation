// Outils communs aux scripts de capture BrandAdmin.
// Garde-fou : seules les requêtes GET/HEAD passent, sauf la soumission du formulaire de connexion
// (et du choix de compte) pendant la phase de login. Après login, tout le reste est bloqué.
const fs = require('fs');
const os = require('os');
const path = require('path');
const { chromium } = require('playwright');

function loadEnv() {
  const file = path.join(os.homedir(), '.sah-doc-captures.env');
  const env = {};
  for (const line of fs.readFileSync(file, 'utf8').split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z_]+)\s*=\s*(.*)\s*$/);
    if (m) env[m[1]] = m[2];
  }
  if (!/^https?:\/\//.test(env.SAH_URL)) env.SAH_URL = 'https://' + env.SAH_URL;
  env.SAH_URL = env.SAH_URL.replace(/\/+$/, '');
  return env;
}

// POST autorisés après login : uniquement des appels de LECTURE, vérifiés un par un.
// Toute nouvelle entrée doit être un endpoint qui ne modifie aucune donnée.
const READONLY_POST = [
  /^https:\/\/brand\.sellingathome\.com\/api\/stats\//, // indicateurs du tableau de bord
  /^https:\/\/brand\.sellingathome\.com\/api\/orders\/list$/, // liste des commandes (DataTable, OrdersController.OrdersList)
  /^https:\/\/brand\.sellingathome\.com\/api\/meetings\/list$/, // liste des réunions (DataTable, MeetingsController.OrdersList)
  /^https:\/\/brand\.sellingathome\.com\/api\/products\/list$/, // liste des produits (DataTable, Api ProductsController.OrdersList, lecture seule)
  /^https:\/\/brand\.sellingathome\.com\/productattributes\/dtlist$/, // liste des attributs (ProductAttibutesController.ProductList, lecture seule)
  /^https:\/\/brand\.sellingathome\.com\/wishlist\/dtlist$/, // produits en liste de souhaits (WishListController.WishList, lecture seule)
  /^https:\/\/brand\.sellingathome\.com\/lowstock\/dtlist$/, // rapport stock faible (ReportsController.LowStockList, lecture seule)
  /^https:\/\/brand\.sellingathome\.com\/reports\/bestsales\/dtlist$/, // meilleures ventes (ReportsController.BestSalesDTList → SearchService.SearchProductsSales, SELECT)
  /^https:\/\/brand\.sellingathome\.com\/reports\/bestsales\/\d+\/details$/, // détail par vendeur (ReportsController.BestSalesProductDetails → SearchProductsSalesDetails, SELECT)
  /^https:\/\/brand\.sellingathome\.com\/reports\/questions\/dtlist$/, // réponses aux questions (ReportsController.QuestionsDTList → SearchCustomerLegacyQuestionsValuesCount, SELECT)
  // NE JAMAIS AJOUTER : /reports/bestsales/{id}/details/export (envoie un email), /exportqueries/{id}/export en POST (lance un export et envoie un email)
  /^https:\/\/brand\.sellingathome\.com\/masterorders\/dtlist$/, // liste des commandes de regroupement (MasterOrdersController.MasterOrderssDTList, lecture seule)
  /^https:\/\/brand\.sellingathome\.com\/ordercmsblocks\/dtlist$/, // liste des blocs de contenu (OrderCmsBlocksController.DTList, lecture seule)
  /^https:\/\/brand\.sellingathome\.com\/products\/returns\/search$/, // liste des retours (ProductsController.SearchProductReturns, lecture seule)
  /^https:\/\/brand\.sellingathome\.com\/products\/dtlist\/order$/, // choix de produits (ProductsController.ProductListOrder, lecture seule)
  /^https:\/\/brand\.sellingathome\.com\/api\/sellers\/list$/, // liste des vendeurs (DataTable, Api SellersController.SellersList → SellerService.GetSellers, lecture)
  /^https:\/\/brand\.sellingathome\.com\/sellers\/stock\/dtlist$/, // stocks vendeurs (SellersController.SellerStockList → SearchService.SearchSellerStock, SELECT)
  /^https:\/\/brand\.sellingathome\.com\/sellers\/tree$/, // graph des vendeurs (SellersController.GetSellersTree → SellerService.GetBrandOrSellerTree, lecture)
  // NE JAMAIS AJOUTER : /sellers/status/set, /api/sellers/setparent, /api/sellers/security, /api/sellers/{id}/revoke, /api/sellers/{id}/stock
  /^https:\/\/brand\.sellingathome\.com\/api\/candidacies\/dtlist$/, // liste des candidatures (DataTable, BrandAdmin.Api CandidaciesController.DtList, lecture seule)
  /^https:\/\/brand\.sellingathome\.com\/widget\/dtlist$/, // messages de la carte des conseillères (WidgetController.WidgetMessagesDTList → SearchService, lecture seule)
  /^https:\/\/brand\.sellingathome\.com\/api\/sellerscommission\/list$/, // commissions des vendeurs (Api SellerCommissionController.SellerCommissionsList → GetSellerCommissions / GetSellerCommissionsEstimate, lecture)
  /^https:\/\/brand\.sellingathome\.com\/sellersSocialContributions\/dtlist$/, // cotisations sociales (SellerSocialContributionsController.SellersSocialContributionsDTList, lecture + calcul en mémoire)
  // NE JAMAIS AJOUTER : /api/sellerscommission/addnewline, /api/sellerscommission/deleteline, /sellers/sendnotification, /api/sellers/commissions/pdfcommissionsfileall, generatesocialcontributionspdfall, /brandcommissionningruleset/* (POST)
  // NE JAMAIS AJOUTER : /api/meetings/status/{id}/open (réouverture d'une réunion)
  /^https:\/\/brand\.sellingathome\.com\/suppliers\/dtlist$/, // liste des fournisseurs (SuppliersController.SuppliersDTList → SearchService.SearchSuppliers, SELECT)
  /^https:\/\/brand\.sellingathome\.com\/suppliers\/\d+\/products\/dtlist$/, // produits d'un fournisseur (SuppliersController.SuppliersProductsDTList → SearchSupplierProducts, SELECT)
  /^https:\/\/brand\.sellingathome\.com\/suppliers\/\d+\/orders\/dtlist$/, // commandes d'un fournisseur (SuppliersController.SuppliersOrdersDTList → SearchSupplierOrders, SELECT)
  /^https:\/\/brand\.sellingathome\.com\/supplyorders\/dtlist$/, // commandes d'approvisionnement (SupplyOrdersController.SupplierOrdersDTList → SearchSupplyOrders, SELECT)
  /^https:\/\/brand\.sellingathome\.com\/supplyorders\/\d+\/products\/dtlist$/, // produits d'une commande d'approvisionnement (SupplierOrdersProductsDTList → SearchSupplyOrderProducts, SELECT)
  /^https:\/\/brand\.sellingathome\.com\/api\/customers\/list$/, // liste des clients (DataTable, BrandAdmin.Api CustomersController.CustomersList → CustomerService.GetCustomers, lecture ; filtre segment = SegmentFiltersEngine.FilterCustomers, SELECT)
  // NE JAMAIS AJOUTER : /api/anonymization/customers, /customers/{id}/fidelitypoints, /customers/roles/*, /segments/savesegment|activate|delete, /segments/filtercustomers (inutile)
  // NE JAMAIS AJOUTER : /api/supplyorders (création), /api/supplyorders/{id}/send|validate|email|receipts|unvalidatedproducts, /orders/preparatorydeliverybillsdocument (change les statuts d'expédition)
  /^https:\/\/brand\.sellingathome\.com\/knowledgedocuments\/dtlist$/, // documents (KnowledgeDocumentsController.KnowledgeDocumentsDTList → SearchService.SearchKnowledgeDocuments, SELECT)
  /^https:\/\/brand\.sellingathome\.com\/knowledgedocuments\/categories\/dtlist$/, // catégories de documents (KnowledgeDocumentCategoriesDTList → SearchKnowledgeDocumentCategories, SELECT)
  /^https:\/\/brand\.sellingathome\.com\/faq\/dtlist$/, // FAQ (FaqController.KnowledgeDocumentsDTList → SearchService.SearchFAQ, SELECT)
  /^https:\/\/brand\.sellingathome\.com\/faq\/categories\/dtlist$/, // catégories de FAQ (FaqController.FAQCategoriesDTList → SearchFAQCategories, SELECT)
  /^https:\/\/brand\.sellingathome\.com\/emailtemplates\/dtlist$/, // templates email (EmailTemplatesController.TemplatesEmailDTList → SearchService.SearchTemplates, SELECT)
  /^https:\/\/brand\.sellingathome\.com\/reports\/emails\/dtlist$/, // emails envoyés (ReportsController.EmailDtList → SearchService.SearchEmails, SELECT)
  /^https:\/\/brand\.sellingathome\.com\/sellers\/notifications\/dtlist$/, // notifications d'une conseillère (NotificationsController.SellerNotificationList → SearchSellerNotification, SELECT)
  // NE JAMAIS AJOUTER : /knowledgedocuments/{id}/setchatassistanteligible, /emailtemplates/{id}/isactive|delete|test, /api/emailtemplatemodels/sendtestemail, /purchase/notification (achat), /setting/save, /api/sellers/notification/*, /chatassistant/credits/*, /chatassistant/settings/*
];

async function openBrowser({ width = 1440, height = 900 } = {}) {
  const browser = await chromium.launch();
  const context = await browser.newContext({ viewport: { width, height }, locale: 'fr-FR', deviceScaleFactor: 2 });
  const guard = { loginPhase: true, blocked: [] };
  await context.route('**/*', (route) => {
    const req = route.request();
    const m = req.method();
    if (m === 'GET' || m === 'HEAD') return route.continue();
    if (guard.loginPhase && req.isNavigationRequest()) return route.continue();
    if (m === 'POST' && READONLY_POST.some((re) => re.test(req.url()))) return route.continue();
    guard.blocked.push(`${m} ${req.url()}`);
    return route.abort('blockedbyclient');
  });
  const page = await context.newPage();
  return { browser, context, page, guard };
}

module.exports = { loadEnv, openBrowser };
