import { test, expect } from '@playwright/test';

test('Select departure +10 days and return +17 days', async ({ page }) => {

    // Open your local HTML file
    await page.goto('file:///C:/Users/Hp/Downloads/DAY12_~1.HTM');

    // -----------------------------
    // Calculate Dates
    // -----------------------------

    const departureDate = new Date();
    departureDate.setDate(departureDate.getDate() + 10);

    const returnDate = new Date();
    returnDate.setDate(returnDate.getDate() + 17);

    // -----------------------------
    // Reusable Function
    // -----------------------------

    async function selectDate(inputLocator, calendarLocator, targetDate) {

        // Open calendar
        await page.locator(inputLocator).click();

        // Scope to the correct calendar
        const calendar = page.locator(calendarLocator);

        const monthNames = [
            "January", "February", "March", "April",
            "May", "June", "July", "August",
            "September", "October", "November", "December"
        ];

        const targetMonthYear =
            `${monthNames[targetDate.getMonth()]} ${targetDate.getFullYear()}`;

        // Navigate month if required
        while (true) {

            const currentMonth = await calendar
                .getByTestId("month-year")
                .textContent();

            if (currentMonth.trim() === targetMonthYear)
                break;

            await calendar.locator(".next-month").click();
        }

        // Build date string
        const date =
            `${targetDate.getFullYear()}-${String(targetDate.getMonth() + 1).padStart(2, '0')}-${String(targetDate.getDate()).padStart(2, '0')}`;

        // Click date
        await calendar
            .locator(`[data-date="${date}"]`)
            .click();
    }

    // -----------------------------
    // Select Departure
    // -----------------------------

    await selectDate(
        '[data-testid="departure-input"]',
        '[data-testid="departure-calendar"]',
        departureDate
    );

    // -----------------------------
    // Select Return
    // -----------------------------

    await selectDate(
        '[data-testid="return-input"]',
        '[data-testid="return-calendar"]',
        returnDate
    );

    // -----------------------------
    // Validation
    // -----------------------------

    await expect(page.locator('[data-testid="departure-input"]'))
        .not.toHaveValue('');

    await expect(page.locator('[data-testid="return-input"]'))
        .not.toHaveValue('');
        await page.pause(); // Pause for debugging

});