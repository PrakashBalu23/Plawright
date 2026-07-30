import { test, expect } from '@playwright/test';

test('POC 2 - Flipkart', async ({ page, context }) => {

  // Open Login Page
  await page.goto("https://www.flipkart.com/account/login");

  // Enter Mobile Number
  await page.getByRole("textbox").nth(1).fill("8825453523");

  // Request OTP
  await page.getByRole("button", { name: "Request OTP" }).click();

  console.log("Enter OTP manually and click Resume.");

  // Pause for OTP
  await page.pause();

  // Search Product
  await page.getByRole("textbox", {
    name: /Search for products/i
  }).fill("running shoes");

  await page.getByRole("textbox", {
    name: /Search for products/i
  }).press("Enter");

  const Brand = "PUMA";
  const Discount = "40% or more";
  const priceThreshold = 2000;

  // Apply Filters
  await page.getByText(Brand, { exact: true }).first().click();
  await page.getByText(Discount, { exact: true }).click();

  await page.waitForLoadState("networkidle");

  const products = page.locator("div[data-id]");
  const count = await products.count();

  console.log(`Total Products : ${count}`);

  for (let i = 0; i < count; i++) {

    const card = products.nth(i);

    const text = (await card.textContent()) ?? "";

    // Skip Non-PUMA Products
    if (!text.toUpperCase().includes("PUMA")) {
      continue;
    }

    expect(text.toUpperCase()).toContain("PUMA");

    // Get Price
    const priceLocator = card.locator(".Nx9bqj");

    if (await priceLocator.count() === 0)
      continue;

    const priceText = await priceLocator.first().textContent();

    if (!priceText)
      continue;

    const price = Number(priceText.replace(/[₹,]/g, ""));

    console.log(`Product ${i + 1} Price : ₹${price}`);

    expect(price).toBeLessThanOrEqual(priceThreshold);

    // Click first eligible product
    if (price <= priceThreshold) {

      const [productPage] = await Promise.all([
        context.waitForEvent("page"),
        card.click()
      ]);

      await productPage.waitForLoadState();

      // Add To Cart
      await productPage.getByRole("button", {
        name: /Add to cart/i
      }).click();

      // Save Login + Cart State
      await productPage.context().storageState({
        path: "flipkart-auth.json"
      });

      console.log("Product Added Successfully");

      break;
    }
  }
  

});

test.use({
  storageState: "flipkart-auth.json"
});

test("Verify Cart", async ({ page }) => {

  await page.goto("https://www.flipkart.com/viewcart");

  await page.pause();

  await expect(
    page.getByText("PUMA")
  ).toBeVisible();

});