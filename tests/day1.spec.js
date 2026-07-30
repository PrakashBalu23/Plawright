import { test, expect } from '@playwright/test';
 
 test('Playwright Special locators', async ({ page }) => {
  
    await page.goto("https://rahulshettyacademy.com/angularpractice/");
    await page.getByLabel("Check me out if you Love IceCreams!").click();
    await page.getByLabel("Employed").check();
    await page.getByLabel("Gender").selectOption("Male");
    await page.getByPlaceholder("Password").fill("abc123");
    await page.getByRole("button", {name: 'Submit'}).click();
    await page.getByText("Success! The Form has been submitted successfully!.").isVisible();
    await page.getByRole("link",{name : "Shop"}).click();
    await page.pause();
    const cards = page.locator("app-card");
    const nokiaCard = cards.filter({ hasText: "Nokia Edge" });
    const addButton = nokiaCard.getByRole("button");

    await addButton.click();

   // await page.locator("app-card").filter({hasText: 'Nokia Edge'}).getByRole("button").click();
    await page.locator("app-card").filter({has: page.getByText("Blackberry")}).getByRole("button").click();
    
 });















