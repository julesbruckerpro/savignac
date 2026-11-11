# Coutellerie Savignac — prototype du nouveau site

Prototype Next.js 15 (App Router, TypeScript strict, Tailwind v4) présenté au board, avant migration Shopify.
La spécification de référence est le cahier de construction `SAVIGNAC_SITE_SPEC.md`.

## Lancer

```bash
npm install
npm run dev        # http://localhost:3000
npm run build && npm start
npm run check      # tsc, eslint, contrôles « couleurs / polices / dégradés / crochets »
npm run e2e        # parcours Playwright (configurateur → panier → commande démo)
```

Variables : voir `.env.example`. `SITE_PASSWORD` protège tout le site (écran `/acces`, cookie de 7 jours) ; vide, le site est ouvert.

## Données

- `content/products/*.ts` : un fichier par modèle. Les variantes, titres exacts et prix viennent du relevé du site
  actuel (`content/products/data/site-catalogue.json`, généré par les scripts ci-dessous).
- `lib/commerce/` : couche d'accès unique (`CommerceAdapter`). Aucun composant n'importe `/content` pour le commerce ;
  la migration remplacera `local-adapter.ts` par `shopify-adapter.ts`.
- `content/dealers.json`, `content/legal/*.json` : extraits du site actuel, géocodage commité.
- `messages/*.json` : interface. `en`, `de`, `it` portent les mêmes clés, valeurs `TODO` repliées sur le français.

## Scripts (dans l'ordre)

```bash
NODE_USE_ENV_PROXY=1 npx tsx scripts/scrape-site.ts      # relevé du site actuel → scripts/raw (non commité)
npx tsx scripts/build-catalogue.ts                        # → content/products/data/site-catalogue.json
npx tsx scripts/parse-content.ts                          # → content/dealers.json, content/legal/*.json
NODE_USE_ENV_PROXY=1 npx tsx scripts/geocode-dealers.ts   # coordonnées (Nominatim, une fois)
npx tsx scripts/process-images.ts                         # détourage 3,4:1, noir et blanc, pastilles
npx tsx scripts/build-redirects.ts                        # anciennes fiches → nouvelles (301)
npx tsx scripts/sync-messages.ts                          # aligne en/de/it sur fr
```

Recadrages manuels : `scripts/crops.json`. Photos du pack d'origine : `scripts/pack/`.
