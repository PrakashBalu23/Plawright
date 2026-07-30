import { test, expect } from '@playwright/test';

test('Refactor locators using getByRole', async ({ page }) => {

    // Open the sample website
    await page.goto('https://www.saucedemo.com/');

    // Enter username
    await page.getByPlaceholder('Username').fill('standard_user');

    // Enter password
    await page.getByPlaceholder('Password').fill('secret_sauce');

    // Old locator (Breaks if button ID changes)
    // await page.locator('#login-button').click();

    // New locator (Recommended)
    await page.getByRole('button', { name: 'Login' }).click();

    // Verify successful login
    await expect(page).toHaveURL(/inventory.html/);

    // Verify Products page is displayed
    await expect(page.getByText('Products')).toBeVisible();

    // Click "Add to cart" using role-based locator
    await page.getByRole('button', { name: 'Add to cart' }).first().click();

    // Verify cart badge
    await expect(page.locator('.shopping_cart_badge')).toHaveText('1');

    // Open shopping cart
    await page.locator('.shopping_cart_link').click();

    // Verify Checkout button
    await expect(page.getByRole('button', { name: 'Checkout' })).toBeVisible();
    await page.pause(); // Pause for debugging
});