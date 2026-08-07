import { test, expect } from '@playwright/test';

test("POC 2 - Flipkart", async ({ page }) => {

    // Open Flipkart
    await page.goto("https://www.flipkart.com/account/login");

    // Enter Mobile Number
    await page.getByRole("textbox").nth(1).fill("8825453523");

    // Click Request OTP
    await page.getByRole("button", { name: "Request OTP" }).click();

    console.log("Enter OTP manually and press Resume");

    // Pause for manual OTP
    await page.pause();

    // Search Product
    await page.getByRole("textbox", {name: "Search for Products"}).fill("running shoes");

    await page.keyboard.press("Enter");
    // Apply Brand Filter
    await page.getByText("PUMA", { exact: true }).first().click();
    // Apply Discount Filter
    await page.getByText("40% or more").click();


    // Price Threshold
    const threshold = 2000;

    // Locator Chaining + filter()
    const productCards = page.locator("div.nZIRY7").filter({ hasText: "PUMA" });

    const count = await productCards.count();

    console.log(`Total Products : ${count}`);

    for (let i = 0; i < count; i++) {const card = productCards.nth(i);

    // Price Locator
    const priceLocator = card.locator("div.hZ3P6w").first();

    if (await priceLocator.count() === 0)continue;

    const priceText = await priceLocator.textContent();

    if (!priceText)continue;
    
    const price = Number(priceText.replace(/[₹,]/g, ""));

    console.log(`Product ${i + 1} Price : ₹${price}`);

    if (price <= threshold) {
      console.log("Eligible Product Found");

    // Open Product Page
    const [productPage] = await Promise.all([page.context().waitForEvent("page"),card.locator("a").first().click()]);

    await productPage.waitForLoadState();

    // Click Add To Cart
    await productPage.getByText("Add to cart", { exact: true }).click();

    await expect(productPage.getByText("Select variant")).toBeVisible();

    await productPage.getByText("6", { exact: true }).first().click();

    await productPage.getByText("Continue").click();

    console.log("Product Added Successfully");

    await expect(productPage).toHaveURL(/flipkart/);

    break;
  }
 }

});



