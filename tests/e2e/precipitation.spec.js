// @ts-check
import { test, expect } from '@playwright/test';

//Pruebas FLL

test('has title', async ({ page }) => {
  await page.goto('http://localhost:16079/precipitation-stats/');

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Precipitations  Manager/);
});



test('create and delete precipitation', async ({ page }) => {
  const testIneCode = "2";
  const testYear = "2024";
  const testProvince = "Sevilla";
  const testAnnualPrecipitation = "20";
  
  const testHistoricalAverage = "1";
  const testDeviation = "2";


  await page.goto('http://localhost:16079/precipitation-stats/');

  await page.getByRole('textbox').nth(6).fill(testIneCode);
  await page.getByRole('textbox').nth(9).fill(testYear);
  await page.getByRole('textbox').nth(7).fill(testProvince);
  await page.getByRole('textbox').nth(8).fill(testAnnualPrecipitation);
  await page.getByRole('textbox').nth(10).fill(testHistoricalAverage);
  await page.getByRole('textbox').nth(11).fill(testDeviation);


  
  await page.getByRole('button', { name: 'Crear registro' }).click();

  
  const fullRowText = `${testIneCode}  ${testYear}  ${testProvince}  ${testAnnualPrecipitation}  ${testHistoricalAverage} ${testDeviation}`;
  const precipitationRow = page.getByRole('row', { name: fullRowText });


  await expect(precipitationRow).toContainText(testYear);
  await expect(precipitationRow).toContainText(testProvince);
  await expect(precipitationRow).toContainText(testAnnualPrecipitation);
  await expect(precipitationRow).toContainText(testHistoricalAverage);
  await expect(precipitationRow).toContainText(testDeviation);



  await precipitationRow.getByRole('button', { name: 'Borrar' }).click();

  await expect(page.getByRole('row', { name: fullRowText })).toHaveCount(0);
});


test('edit a ocupied record', async ({ page }) => {
  await page.goto('http://localhost:16079/precipitation-stats/');

  // Limpiar y cargar datos de prueba
  await page.getByRole('button', { name: 'Borrar datos' }).click();
  await page.getByRole('button', { name: 'Datos de prueba' }).click();
});