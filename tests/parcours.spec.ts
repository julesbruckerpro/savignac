import { expect, test, type Page } from '@playwright/test';

const euro = (s: string) => new RegExp(s.replace(/ /g, '\\s'));

async function noHorizontalScroll(page: Page) {
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  expect(overflow).toBeLessThanOrEqual(0);
}

test('accueil : promesse de la Maison et quatre familles, de 46 € au prestige', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(/Le geste, avant tout/i);
  await expect(page.getByText('Livraison offerte dès 100 € d’achat').first()).toBeVisible();
  const familles = page.locator('section[aria-labelledby="familles"]');
  await expect(familles.getByText('Le Montagnol')).toBeVisible();
  await expect(familles.getByText(euro('46 €'))).toBeVisible();
  await expect(familles.getByText('Couteaux à système')).toBeVisible();
  await expect(familles.getByText(euro('de 299 € à 470 €'))).toBeVisible();
  await expect(page.locator('body')).not.toContainText('[À FOURNIR');
  await noHorizontalScroll(page);
});

test('configurateur → panier → commande démo : Roques facettes, damas, gravure = 317,00 €', async ({ page }) => {
  await page.goto('/modele/le-roques');
  await expect(page.getByRole('heading', { level: 1, name: 'Le Roques' })).toBeVisible();
  await page.getByRole('button', { name: /Corne noire à facettes/ }).first().click();
  await page.getByRole('button', { name: /^Damas/ }).click();
  await expect(page.getByText(euro('305,00 €')).first()).toBeVisible();
  await expect(page).toHaveURL(/manche=corne-noire-facettes/);
  await expect(page).toHaveURL(/lame=damas/);

  await page.getByText('Gravure sur la lame· Bêta').click();
  await page.getByRole('button', { name: 'Manuscrit' }).click();
  await page.getByLabel('Texte à graver').fill('Pour Jean');
  await expect(page.getByTestId('apercu-gravure').first()).toHaveText('Pour Jean');
  await expect(page.getByText(euro('317,00 €')).first()).toBeVisible();
  await expect(page.getByTestId('disponibilite')).toHaveText('Fabriqué à la commande à Foix');

  await page.getByRole('button', { name: /Ajouter au panier · 317,00/ }).click();
  const drawer = page.getByRole('dialog', { name: 'Ajouté au panier' });
  await expect(drawer).toBeVisible();
  await expect(drawer).toContainText('Pour Jean');
  await drawer.getByRole('link', { name: 'Voir le panier' }).click();

  await expect(page).toHaveURL(/\/panier$/);
  await expect(page.locator('#contenu').getByText(/Gravure\s: «\sPour Jean\s»/)).toBeVisible();
  await expect(page.locator('#contenu').getByText(/Style de gravure\s: Manuscrit/)).toBeVisible();
  await expect(page.getByTestId('livraison')).toHaveText('Offerte');
  await expect(page.getByTestId('total')).toHaveText(euro('317,00 €'));
  await noHorizontalScroll(page);

  await page.getByRole('button', { name: 'Passer commande' }).click();
  await expect(page.getByText('Le paiement sera branché lors du passage sur Shopify.')).toBeVisible();
});

test('livraison : 9,00 € sous 100 €, offerte au-delà', async ({ page }) => {
  await page.goto('/modele/le-montagnol');
  await page.getByRole('button', { name: /Ajouter au panier · 46,00/ }).click();
  await page.getByRole('dialog').getByRole('link', { name: 'Voir le panier' }).click();
  await expect(page.getByTestId('livraison')).toHaveText(euro('9,00 €'));
  await expect(page.locator('#contenu').getByText(euro('Plus que 54,00 € pour la livraison offerte'))).toBeVisible();
  await page.locator('#contenu').getByRole('button', { name: 'Ajouter un exemplaire' }).click();
  await page.locator('#contenu').getByRole('button', { name: 'Ajouter un exemplaire' }).click();
  await expect(page.getByTestId('livraison')).toHaveText('Offerte');
  await expect(page.getByTestId('total')).toHaveText(euro('138,00 €'));
});

test('une combinaison impossible bascule sur la première compatible', async ({ page }) => {
  await page.goto('/modele/le-roques?manche=chene');
  await expect(page.getByText(euro('73,00 €')).first()).toBeVisible();
  await page.getByRole('button', { name: /^Damas/ }).click();
  await expect(page.getByText('Le damas se monte sur corne : nous avons choisi la corne noire à facettes.')).toBeVisible();
  await expect(page.getByText(euro('305,00 €')).first()).toBeVisible();
  await page.getByRole('button', { name: 'Cran plat' }).click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Le Roques cran plat');
  // le damas choisi est conservé : il existe aussi sur le cran plat (480 €), l'inox est à 220 €
  await expect(page.getByText(euro('480,00 €')).first()).toBeVisible();
  await page.getByRole('button', { name: /^Inox 14C28/ }).click();
  await expect(page.getByText(euro('220,00 €')).first()).toBeVisible();
});

test('prestige : page noire, ajout d’une pièce au panier', async ({ page }) => {
  await page.goto('/couteaux/prestige');
  const bg = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);
  expect(bg).toBe('rgb(11, 11, 11)');
  await expect(page.locator('h2[id^="piece-"]')).toHaveCount(9);
  await page.getByRole('button', { name: 'Ajouter au panier' }).first().click();
  await expect(page.getByRole('dialog', { name: 'Ajouté au panier' })).toContainText(euro('299,00 €'));
});

test('revendeurs : trouver Toulouse', async ({ page }) => {
  await page.goto('/revendeurs');
  await page.getByLabel('Ville ou code postal').fill('Toulouse');
  await expect(page.getByRole('button', { name: /Habiague/ })).toBeVisible();
  await expect(page.getByText(/^5 adresses$/)).toBeVisible();
});

test('langue : structure prête, contenu français en repli', async ({ page }) => {
  await page.goto('/en/modele/le-roques');
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  await expect(page.getByRole('heading', { level: 1, name: 'Le Roques' })).toBeVisible();
  await expect(page.locator('body')).not.toContainText('TODO');
});

test('prix exacts du site sur un échantillon de fiches', async ({ page }) => {
  for (const [path, price] of [
    ['/modele/l-ariegeois?manche=corne-blonde', '105,00 €'],
    ['/modele/l-ariegeois?mecanisme=cran-plat&manche=ivoire-phacochere', '440,00 €'],
    ['/modele/le-grat?manche=corne-noire-facettes', '108,00 €'],
    ['/modele/le-capi?manche=tout-inox', '100,00 €'],
    ['/modele/le-phasme?manche=palmier&lame=damas', '430,00 €'],
    ['/modele/l-ariegeois-de-table?format=duo', '186,00 €'],
    ['/produit/le-charognard', '199,00 €'],
    ['/produit/coffret-chef-office-grat', '192,00 €'],
  ] as const) {
    await page.goto(path);
    await expect(page.getByText(euro(price)).first(), path).toBeVisible();
  }
});

test('navigation : familles de produits séparées des rubriques éditoriales', async ({ page, isMobile }) => {
  test.skip(!!isMobile, 'menu desktop');
  await page.goto('/');
  const nav = page.getByRole('navigation', { name: 'Navigation principale' }).first();
  for (const name of ['Pliants', 'Table', 'Cuisine', 'Prestiges', 'À propos de Savignac']) await expect(nav.getByRole('link', { name, exact: true })).toBeVisible();
  // la presse et les revendeurs vivent sous « À propos de Savignac », pas parmi les couteaux
  await nav.getByRole('link', { name: 'À propos de Savignac' }).hover();
  await expect(page.locator('[data-mega]').getByRole('link', { name: 'Nos revendeurs' })).toBeVisible();
});

test('Ariégeois à friction : expédié sous 48 h, livré avec son fourreau', async ({ page }) => {
  await page.goto('/modele/l-ariegeois?manche=chene');
  await expect(page.getByTestId('disponibilite')).toHaveText('Généralement expédié sous 48 h');
  await expect(page.getByText('Fourreau synthétique').first()).toBeVisible();
});

test('ils nous font confiance : presse et restaurants, sans faux avis', async ({ page }) => {
  await page.goto('/la-maison/ils-nous-font-confiance');
  await expect(page.getByRole('heading', { name: 'À leur table.' })).toBeVisible();
  await expect(page.locator('body')).not.toContainText('[À FOURNIR');
});

test('revendeurs : recherche transmise depuis l’accueil', async ({ page }) => {
  await page.goto('/revendeurs?q=Toulouse');
  await expect(page.getByLabel('Ville ou code postal')).toHaveValue('Toulouse');
  await expect(page.getByText(/^5 adresses$/)).toBeVisible();
});

test('curseur : aucun curseur personnalisé', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('.cursor')).toHaveCount(0);
  expect(await page.evaluate(() => getComputedStyle(document.body).cursor)).not.toBe('none');
});
