// @ts-check
import { test, expect } from '@playwright/test';

test('has title', async ({ page }) => {
  await page.goto('http://localhost:16079/ocupied-grand-stats/');

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Ocupieds Manager/);
});

test('get radars link', async ({ page }) => {
  await page.goto('localhost:16079');

  // Click the get started link.
  await page.getByRole('link', { name: 'FLL Data' }).click();

  // Expects page to have a heading with the name of Installation.
  await expect(page).toHaveTitle(/Ocupieds Manager/);
});



test('create and delete ocupied', async ({ page }) => {
  const testIneCode = "2";
  const testProvince = "Sevilla";
  const testGround = "Andalucía";
  const testYear = "2024";
  const testGrass = "1";
  const testWooded = "2";
  const testNon_agrarian_surface = "3";

  await page.goto('http://localhost:16079/ocupied-grand-stats/');

  await page.getByRole('textbox').nth(6).fill(testIneCode);
  await page.getByRole('textbox').nth(7).fill(testProvince);
  await page.getByRole('textbox').nth(8).fill(testGround);
  await page.getByRole('textbox').nth(9).fill(testYear);
  await page.getByRole('textbox').nth(10).fill(testGrass);
  await page.getByRole('textbox').nth(11).fill(testWooded);
  await page.getByRole('textbox').nth(12).fill(testNon_agrarian_surface);

  
  await page.getByRole('button', { name: 'Crear registro' }).click();

  
  const fullRowText = `${testIneCode} ${testProvince} ${testGround} ${testYear} ${testGrass} ${testWooded} ${testNon_agrarian_surface}`;
  const ocupiedRow = page.getByRole('row', { name: fullRowText });

  await expect(ocupiedRow).toContainText(testProvince);
  await expect(ocupiedRow).toContainText(testGround);
  await expect(ocupiedRow).toContainText(testYear);
  await expect(ocupiedRow).toContainText(testGrass);
  await expect(ocupiedRow).toContainText(testWooded);
  await expect(ocupiedRow).toContainText(testNon_agrarian_surface);


  await ocupiedRow.getByRole('button', { name: 'Borrar' }).click();

  await expect(page.getByRole('row', { name: fullRowText })).toHaveCount(0);
});


test('edit a ocupied record', async ({ page }) => {
  await page.goto('http://localhost:16079/ocupied-grand-stats/');

  // Limpiar y cargar datos de prueba
  await page.getByRole('button', { name: 'Borrar datos' }).click();
  await page.getByRole('button', { name: 'Datos de prueba' }).click();
});