// @ts-check
import { test, expect } from '@playwright/test';

//Pruebas FLL

test('has title', async ({ page }) => {
  await page.goto('localhost:16079');

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


  await page.goto('localhost:16079');

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

  // Hacer clic en el botón Editar del primer registro
  await page.getByRole('button', { name: 'Editar' }).nth(0).click();

  await expect(page).toHaveTitle(/Edit Precipitation Info/);

  // Seleccionamos los inputs por su orden en el DOM
  const inputs = page.locator('input');

  // Cambiamos el campo 'wooded' (sexto input)
  await inputs.nth(5).fill('999');

  // Clic en el botón "Actualizar"
  await page.getByRole('button', { name: 'Actualizar' }).click();

  // Verificamos que vuelve a la página principal
  await expect(page).toHaveURL(/precipitation-stats/);

  // Comprobamos que el cambio se refleja (opcionalmente podrías buscar por texto en la tabla)
  await expect(page.locator('table')).toContainText('999');
});