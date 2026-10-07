# Documentation SellingAtHome

Site statique de la documentation utilisateurs de SellingAtHome (espace marque).

## Organisation

| Dossier / fichier | Rôle |
|---|---|
| `src/site.js` | Navigation : les univers, leurs pages, l'ordre de lecture et le statut de chaque page (`done` / `todo`). |
| `src/pages/<slug>.html` | Contenu d'une page (fragment HTML, sans en-tête ni pied de page). |
| `src/partials/` | Éléments communs (logo). |
| `assets/` | CSS, polices, scripts communs et index de recherche (généré). |
| `Captures/` | Captures d'écran utilisées dans les pages. |
| `tools/` | Scripts de vérification et de capture d'écran. |
| `*.html` à la racine | **Pages générées : ne pas modifier à la main.** |

Un fragment commence par une ligne de métadonnées :

```html
<!--page {"title":"Guide des réductions"} -->
```

Il peut contenir ses propres `<style>` et `<script>` (ils sont placés dans l'en-tête et en fin de page).

## Commandes

```bash
npm run build   # génère les pages et l'index de recherche
npm run check   # vérifie liens, ancres, erreurs JavaScript et débordements (Playwright)
```

## Ajouter une page

1. Créer `src/pages/<slug>.html`.
2. Passer la page en `status: 'done'` dans `src/site.js`.
3. Lancer `npm run build` puis `npm run check`.

## Versions

Le numéro de version est le champ `version` de `package.json`. Il est affiché dans le pied de page de toutes les pages, avec le mois de mise à jour (`updated` dans `src/site.js`). L'historique est tenu dans `CHANGELOG.md`.

Publier une nouvelle version :

1. Choisir le niveau (voir `CHANGELOG.md`) et mettre à jour la version :
   `npm version patch --no-git-tag-version` (ou `minor`, `major`).
2. Ajouter l'entrée correspondante en tête de `CHANGELOG.md`, et mettre à jour `updated` dans `src/site.js` si le mois a changé.
3. `npm run build` puis `npm run check`.
4. Commiter, puis poser l'étiquette git : `git tag v<version>` (par exemple `git tag v1.1.0`).

## Captures d'écran BrandAdmin

Les scripts de `tools/captures/` se connectent à BrandAdmin (marque de démonstration) avec les identifiants du fichier local `%USERPROFILE%\.sah-doc-captures.env` (jamais versionné). Ils bloquent toute requête susceptible de modifier des données. Les images de travail sont écrites dans `tools/captures/out/`, non versionné.
