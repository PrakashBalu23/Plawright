const { test, expect } = require('@playwright/test');

test('Login', async ({ page }) => {

    await page.goto('http://smartppt.smartwas.com/login');

    await page.getByPlaceholder('Email').fill('admin@smart.com');
    await page.getByPlaceholder('Password').fill('Cupent@2024');

    await page.getByRole('button', { name: 'Sign in' }).click();

    // Wait for successful navigation (BEST PRACTICE)
    await page.waitForURL('**/sales-dashboard');

    console.log('Current URL:', page.url());

    // Strong validation
    await expect(page).toHaveURL(/sales-dashboard/);
});