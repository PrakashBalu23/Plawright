import { test, expect } from '@playwright/test';
 
test('Add Adidas Original to cart and checkout', async ({ page }) => {
    const email = "sywuvezug@mailinator.com";
    const productName = 'ADIDAS ORIGINAL';
    const products = page.locator(".card-body");
   
    await page.goto("https://rahulshettyacademy.com/client");
    await page.locator("#userEmail").fill(email);
    await page.locator("#userPassword").fill("xuWRDKS5!xFgeg4");
    await page.locator("[value='Login']").click();
    await page.waitForLoadState('networkidle');
   
    await page.locator(".card-body b").first().waitFor();
    const count = await products.count();
   
    for (let i = 0; i < count; ++i) {
        if (await products.nth(i).locator("b").textContent() === productName) {
            await products.nth(i).locator("text= Add To Cart").click();
            break;
        }
    }
   
    await page.locator("[routerlink*='cart'] label").filter({ hasText: /\d+/ }).waitFor();
   
    await page.locator("[routerlink*='cart']").click();
   
    expect(await page.locator("h1").textContent()).toContain("My Cart");
    await page.locator("div li").first().waitFor();
    await page.getByRole('button', { name: 'Checkout' }).click();
   
    await page.locator("[placeholder*='Country']").pressSequentially("ind");
 
    const dropdown = page.locator('.ta-results');
    await dropdown.waitFor();
 
    const options = dropdown.locator("button");
    const optionsCount = await options.count();
 
    for (let i = 0; i < optionsCount; ++i) {
        const text = await options.nth(i).textContent();
       
        if (text.trim() === "India") {
            await options.nth(i).click();
            break;
        }
    }
 
    await page.locator(".action__submit").click();
   
   
     await expect(page.locator(".hero-primary")).toHaveText(" Thankyou for the order. ");
     const orderId = (await page.locator(".em-spacer-1 .ng-star-inserted").textContent()).replace(/\|/g, "").trim();
console.log("Captured Order ID:", orderId);
 
await page.getByRole('button', { name: 'ORDERS' }).click();
await expect(page.locator("h1")).toHaveText("Your Orders");
await page.locator("tbody tr").first().waitFor();
 
const orderRow = page.locator("tbody tr").filter({has:page.locator(`th:has-text("${orderId}")`)});
await orderRow.locator("button.btn-primary").click();
 
await expect(page.locator(".email-title")).toContainText( "order summary");
const orderSummaryId = (await page.locator(".col-text").textContent()).trim();
await expect(page.getByText(orderId)).toBeVisible();
 
const productNameInOrderSummary = (await page.locator(".title").textContent()).trim();
await expect (page.locator(".title")).toContainText(productName);
 
console.log("Order Summary verified");
console.log("Order ID:", orderSummaryId);
console.log("Product Name", productNameInOrderSummary);

});