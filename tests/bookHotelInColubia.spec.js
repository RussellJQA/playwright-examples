const { test, expect } = require('@playwright/test');

const dayjs = require('dayjs');

test('Verify sign in pop-up appears', async ({ page }) => {
  await page.goto('https://www.booking.com');  
  await expect(page.getByRole('link', { name: 'Sign in or register' })).toBeVisible()
});

test('Verify search input fields at home page', async ({ page }) => {
  await page.goto('https://www.booking.com/');
  await page.getByLabel('Dismiss sign-in info.').click();
  await expect(page.getByPlaceholder('Where are you going?')).toBeVisible();
  await expect(page.getByTestId('searchbox-dates-container')).toBeVisible();
  await page.getByRole('button', { name: 'Search' }).click();
  await page.getByPlaceholder('Where are you going?').click();
  await page.getByPlaceholder('Where are you going?').fill('New York');
  await page.getByRole('button', { name: 'New York New York, United' }).click();
  await page.getByTestId('date-display-field-start').click();
  await page.getByTestId('date-display-field-end').click();
  await page.getByLabel('20 January').click();
  await page.getByTestId('occupancy-config').click();
  await page.getByRole('button', { name: 'Done' }).click();
});

test('Search for a hotel in Columbia for the next 5 days', async ({ page }) => {
  await page.goto('https://www.booking.com');
  
  // close the pop up
  let crossPopUpToSigIn = page.locator(`[aria-label="Dismiss sign-in info."]`)
  await expect(crossPopUpToSigIn).toBeVisible({timeout:30000})
  await crossPopUpToSigIn.click()
  // Enter the destination
  await page.fill('[aria-label="Where are you going?"]', 'Columbia');

  // Open calendar widget and set dates"
  await page.click('[data-testid="searchbox-dates-container"]')
  
  // verify that calendar appear 
  await expect( page.locator('[data-testid="datepicker-tabs"]')).toBeVisible()
  
  let [today,fiveDaysAfter] = getFormattedDates()
  await page.locator(today).click();
  await page.locator(fiveDaysAfter).click();
  
  await page.click('button[type="submit"]',{force:true})
});

function getFormattedDates() {
  const tomorrow = dayjs().add(1, 'day');
  const inFiveDays = dayjs().add(6, 'day');

  const formattedTomorrow = tomorrow.format('YYYY-MM-DD');
  const formattedInFiveDays = inFiveDays.format('YYYY-MM-DD');

  return [`[data-date="${formattedTomorrow}"]`, `[data-date="${formattedInFiveDays}"]`];
}
