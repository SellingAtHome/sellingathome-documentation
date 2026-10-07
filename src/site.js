// Structure de la documentation : univers, pages et ordre de lecture.
// status : 'done' = page publiée (source dans src/pages/<slug>.html), 'todo' = page prévue, affichée « en préparation ».
// module : true = fonction optionnelle, activée par SellingAtHome sur demande.

module.exports = {
  siteName: 'Documentation SellingAtHome',
  updated: 'octobre 2026',

  // Pages hors univers (liens de l'en-tête)
  extras: [
    { slug: 'cas-usage', title: "Cas d'usage", nav: "Cas d'usage", status: 'done' },
    { slug: 'depannage', title: 'Dépannage', nav: 'Dépannage', status: 'done' },
  ],

  universes: [
    {
      slug: 'demarrer', nav: 'Démarrer', title: 'Démarrer', script: 'avec SellingAtHome', color: 'accent',
      lede: "Les notions clés du métier, la découverte de l'espace marque et l'ordre conseillé pour paramétrer votre marque.",
      pages: [
        { slug: 'comprendre-sellingathome', title: 'Comprendre SellingAtHome en 10 minutes', summary: 'Marque, conseillère, hôtesse, cliente, réunion, réseau : les notions qui structurent toute la plateforme.', status: 'done' },
        { slug: 'espace-marque', title: "Découvrir l'espace marque", summary: 'Connexion, menus, tableau de bord et ses indicateurs, actualités et profil.', status: 'done' },
        { slug: 'mise-en-route', title: 'Check-list de mise en route', summary: "L'ordre conseillé pour paramétrer une marque, étape par étape.", status: 'done' },
        { slug: 'modules-options', title: 'Modules et options', summary: "Ce qui s'active sur demande, et pourquoi un menu peut ne pas apparaître.", status: 'done' },
        { slug: 'glossaire', title: 'Glossaire', summary: 'Toutes les définitions, de « animatrice » à « zone de taxe ».', status: 'done' },
      ],
    },
    {
      slug: 'reseau', nav: 'Réseau', title: 'Réseau et', script: 'rémunération', color: 'pink',
      lede: 'Gérer vos conseillères, leur organigramme et leurs statuts, puis calculer et verser leurs commissions.',
      pages: [
        { slug: 'conseilleres', title: 'Gérer les conseillères', summary: 'La liste, la fiche et ses onglets, verrouiller un accès, se connecter en tant que conseillère.', status: 'done' },
        { slug: 'organigramme', title: "L'organigramme", summary: 'Recruteur, animatrice, changements de rattachement et leurs effets sur les commissions.', status: 'done' },
        { slug: 'statuts', title: 'Statuts et automatisation', summary: 'Grille des statuts, statut estimé et statut officiel, règles de passage automatique.', status: 'done' },
        { slug: 'roles-conseilleres', title: 'Rôles des conseillères', summary: 'Des profils de droits pour adapter ce que chaque conseillère peut faire.', status: 'done' },
        { slug: 'suivi-equipe', title: "Suivi d'équipe", summary: "Comparer l'activité de vos équipes d'une période à l'autre.", status: 'done' },
        { slug: 'plan-remuneration', title: 'Le plan de rémunération', summary: 'Règles, valeurs, lignées et conditions : construire un plan de bout en bout.', status: 'done' },
        { slug: 'cloture-commissions', title: 'Clôture et versement des commissions', summary: 'Clôture mensuelle, bulletins, fichier SEPA, exports et emails de clôture.', status: 'done' },
        { slug: 'cotisations-sociales', title: 'Cotisations sociales et précompte', summary: 'Calcul, régularisation et consultation des cotisations des conseillères.', status: 'done' },
        { slug: 'stock-conseilleres', title: 'Stocks chez les conseillères', summary: 'Suivre le stock détenu par chaque conseillère.', status: 'done', module: true },
      ],
    },
    {
      slug: 'recrutement', nav: 'Recrutement', title: 'Le', script: 'recrutement', color: 'yellow',
      lede: 'Du formulaire de candidature à la signature électronique du contrat, puis au kit de démarrage.',
      pages: [
        { slug: 'recrutement-principe', title: 'Le recrutement dématérialisé', summary: 'Le parcours complet du candidat, du formulaire à la création de son compte.', status: 'done' },
        { slug: 'recrutement-parametrage', title: 'Paramétrer le recrutement', summary: 'Les 5 onglets de configuration : formulaire, contenus, demandes, kit de démarrage.', status: 'done' },
        { slug: 'candidatures', title: 'Traiter une candidature', summary: 'Documents, refus, signature, création du compte conseillère.', status: 'done' },
        { slug: 'kit-demarrage', title: 'Le kit de démarrage', summary: "Le tunnel d'achat du kit, ses frais de livraison et ses relances.", status: 'done' },
        { slug: 'carte-conseilleres', title: 'Carte des conseillères et formulaire de contact', summary: 'Le widget à intégrer sur votre site et le traitement des demandes reçues.', status: 'done' },
      ],
    },
    {
      slug: 'reunions', nav: 'Réunions', title: 'Les', script: 'réunions', color: 'accent',
      lede: "Le cœur de la vente à domicile : le cycle de vie d'une réunion, ses réglages, son mini-site et la visio.",
      pages: [
        { slug: 'reunion-cycle-de-vie', title: "Le cycle de vie d'une réunion", summary: 'Création, invitations, commandes, clôture et gains de l’hôtesse.', status: 'done' },
        { slug: 'mini-site-reunion', title: 'Le mini-site de réunion', summary: "Modes d'activation, onboarding de l'hôtesse, gestion des invités.", status: 'done' },
        { slug: 'reunion-virtuelle', title: 'Réunion virtuelle et live', summary: 'Visio, mode broadcast et mise en avant des offres pendant le live.', status: 'done' },
        { slug: 'activites', title: 'Activités et agenda', summary: "Les types d'activités proposés aux conseillères dans leur agenda.", status: 'done' },
      ],
    },
    {
      slug: 'ventes', nav: 'Ventes', title: 'Commandes et', script: 'boutiques', color: 'pink',
      lede: 'Comprendre, créer et suivre les commandes, gérer les regroupements et les retours, animer les boutiques en ligne.',
      pages: [
        { slug: 'commandes-comprendre', title: 'Comprendre les commandes', summary: 'Types de commande, statut de gestion et statut logistique, cycle de vie.', status: 'done' },
        { slug: 'commandes-gerer', title: 'Créer, modifier et finaliser une commande', summary: 'Création par la marque, paiement, changement de conseillère, liaison à une réunion.', status: 'done' },
        { slug: 'commandes-annulation-documents', title: 'Annulations, avoirs et documents', summary: 'Annuler tout ou partie, rembourser, éditer factures et bons de commande.', status: 'done' },
        { slug: 'commandes-regroupement', title: 'Les commandes de regroupement', summary: 'Regrouper les commandes d’une conseillère : paiement, livraison, clôture.', status: 'done' },
        { slug: 'commandes-parametres', title: 'Paramètres des commandes', summary: 'Cadeaux automatiques, produits suggérés, questions, plafonds, blocs de contenu.', status: 'done' },
        { slug: 'retours-produits', title: 'Les retours produits', summary: 'Motifs de retour et traitement des demandes des conseillères.', status: 'done' },
        { slug: 'boutiques-panorama', title: 'Les boutiques en ligne', summary: 'Mini-site de réunion, mini-boutique, boutique de marque : lequel pour quoi ?', status: 'done' },
        { slug: 'mini-boutiques', title: 'Les mini-boutiques des conseillères', summary: 'Activation, personnalisation, produits disponibles, réglages de la conseillère.', status: 'done' },
        { slug: 'boutique-marque', title: 'La boutique de marque', summary: 'Votre boutique en ligne et l’attribution des ventes aux conseillères.', status: 'done', module: true },
        { slug: 'collections', title: 'Collections et réservations', summary: 'Proposer des produits sur réservation, par périodes.', status: 'done', module: true },
      ],
    },
    {
      slug: 'catalogue', nav: 'Catalogue', title: 'Catalogue et', script: 'logistique', color: 'yellow',
      lede: 'Créer et tarifer vos produits, gérer les stocks, la livraison, la préparation et l’approvisionnement.',
      pages: [
        { slug: 'produits', title: 'Créer et éditer un produit', summary: 'Produit simple, lot, kit variable, produit virtuel, et tous les onglets de la fiche.', status: 'done' },
        { slug: 'attributs-declinaisons', title: 'Catégories, attributs et déclinaisons', summary: 'Organiser le catalogue et décliner un produit en tailles, couleurs…', status: 'done' },
        { slug: 'prix-taxes', title: 'Prix, prix par rôle et taxes', summary: 'Tarifs, prix réservés à certains rôles, taxes et zones de pays.', status: 'done' },
        { slug: 'livraison', title: 'Livraison : modes et frais', summary: 'Modes de livraison, frais, gratuité et conditions, avec exemples chiffrés.', status: 'done' },
        { slug: 'stocks', title: 'Les stocks', summary: 'Méthodes de suivi, rupture, stock faible, historique et import.', status: 'done' },
        { slug: 'preparation-livraison', title: 'Bons de préparation et de livraison', summary: 'Préparer les commandes par réunion, conseillère ou produit, éditer les BL.', status: 'done' },
        { slug: 'approvisionnement', title: "L'approvisionnement", summary: 'Fournisseurs, commandes fournisseurs et réception du stock.', status: 'done', module: true },
        { slug: 'expeditions-transporteurs', title: 'Expéditions et transporteurs', summary: 'Suivi des envois, étiquettes GLS, DPD, Colissimo, Mondial Relay.', status: 'done', module: true },
      ],
    },
    {
      slug: 'animation', nav: 'Animation', title: 'Animation et', script: 'fidélisation', color: 'pink',
      custom: true,
      lede: 'Motiver vos conseillères, récompenser vos hôtesses et fidéliser vos clientes.',
      pages: [
        { slug: 'challenges-guide', title: 'Les challenges', summary: 'Fixer des objectifs aux conseillères et récompenser automatiquement celles qui les atteignent.', status: 'done' },
        { slug: 'fidelite-guide', title: 'La fidélité', summary: 'Récompenser hôtesses, clientes et conseillères selon les réunions et les ventes.', status: 'done' },
        { slug: 'bons-achat-guide', title: "Les bons d'achat", summary: 'Offrir un montant nominatif, déduit d’une prochaine commande.', status: 'done' },
        { slug: 'reductions-guide', title: 'Les réductions', summary: 'Baisser le prix d’une commande, automatiquement ou par code promo.', status: 'done' },
        { slug: 'conditions-achat-guide', title: "Les conditions d'achat", summary: 'Limiter qui peut acheter un produit, et en quelle quantité.', status: 'done' },
        { slug: 'parrainage-client', title: 'Le parrainage client', summary: 'Récompenser les clientes qui recommandent la marque.', status: 'done' },
        { slug: 'clients', title: 'Les clientes', summary: 'La fiche cliente, ses rôles, ses points et bons, l’anonymisation RGPD.', status: 'done' },
        { slug: 'segments', title: 'Les segments de clientes', summary: 'Regrouper des clientes selon leur profil et leurs achats.', status: 'done' },
      ],
    },
    {
      slug: 'pilotage', nav: 'Pilotage', title: 'Communication et', script: 'pilotage', color: 'accent',
      lede: 'Former et informer vos conseillères, piloter l’activité avec les rapports, paramétrer la marque.',
      pages: [
        { slug: 'base-documentaire', title: 'Documents, FAQ et formations', summary: 'Mettre à disposition des conseillères documents, réponses et parcours de formation.', status: 'done' },
        { slug: 'notifications', title: 'Les notifications', summary: 'Envoyer des notifications aux conseillères, une à une ou en masse.', status: 'done' },
        { slug: 'emails', title: 'Les emails', summary: 'Modèles d’emails, suivi des envois et délivrabilité.', status: 'done' },
        { slug: 'assistant-ia', title: "L'assistant IA", summary: 'Activation, quotas, crédits, documents indexés, conversations et retours.', status: 'done' },
        { slug: 'rapports-exports', title: 'Rapports et exports', summary: 'Meilleures ventes, stock faible, réponses aux questions, exports de données.', status: 'done' },
        { slug: 'configuration-generale', title: 'La configuration de la marque', summary: 'Tous les réglages généraux de la marque, un par un.', status: 'done' },
        { slug: 'champs-fichiers', title: 'Champs personnalisés et fichiers', summary: 'Ajouter vos propres champs et gérer les médias de la marque.', status: 'done' },
        { slug: 'comptabilite', title: 'La comptabilité', summary: 'Comptes comptables et exports vers votre logiciel.', status: 'done', module: true },
        { slug: 'integrations', title: 'Les intégrations', summary: 'Boutiques externes, logisticiens, outils marketing : ce qui existe et comment l’activer.', status: 'done', module: true },
      ],
    },
  ],
};
