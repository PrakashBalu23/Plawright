const { test, expect } = require('@playwright/test');

test('Select product with price ₹607', async ({ page }) => {

  await page.goto('https://www.myntra.com/footwear', {
    waitUntil: 'domcontentloaded'
  });

  // Wait until products are visible
  await page.waitForSelector('.product-base');

  // Get all product cards
  const products = page.locator('.product-base');
  const count = await products.count();

  console.log(`Total Products: ${count}`);

  for (let i = 0; i < count; i++) {

    // Get the price locator
    const priceLocator = products.nth(i).locator('.product-discountedPrice');

    // Skip products that don't have a discounted price
    if (await priceLocator.count() === 0)
      continue;

    // Read price text
    const priceText = await priceLocator.textContent();

    // Convert "Rs. 607" or "₹607" to 607
    const price = Number(priceText.replace(/\D/g, ''));

    console.log(`Product ${i + 1}: ₹${price}`);

    // Check if price is 607
    if (price === 607) {

      console.log(`Found product with price ₹607`);

      await products.nth(i).click();
      await page.pause(); // Pause for debugging

      break;
    }
  }

});