import { expect, test, type Page } from '@playwright/test';

const euro = (s: string) => new RegExp(s.replace(/ /g, '\\s'));

async function noHorizontalScroll(page: Page) {
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  expect(overflow).toBeLessThanOrEqual(0);
}

test('accueil : logo, navigation, Le Roques et son bouton', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1, name: 'Le Roques' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Composer le vôtre' }).first()).toBeVisible();
  await expect(page.getByText(euro('de 73 € à 305 €'))).toBeVisible();
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
  await page.getByLabel('Texte à graver').fill('Pour Jean');
  await expect(page.getByText(euro('317,00 €')).first()).toBeVisible();

  await page.getByRole('button', { name: /Ajouter au panier · 317,00/ }).click();
  const drawer = page.getByRole('dialog', { name: 'Ajouté au panier' });
  await expect(drawer).toBeVisible();
  await expect(drawer).toContainText('Pour Jean');
  await drawer.getByRole('link', { name: 'Voir le panier' }).click();

  await expect(page).toHaveURL(/\/panier$/);
  await expect(page.locator('#contenu').getByText(/Gravure\s: «\sPour Jean\s»/)).toBeVisible();
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
  await expect(page.getByRole('heading', { level: 2 })).toHaveCount(9);
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
