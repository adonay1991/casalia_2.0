import { expect, test } from "@playwright/test";

test.describe("Public Navigation", () => {
	test("should load homepage with hero section", async ({ page }) => {
		await page.goto("/", { waitUntil: "networkidle" });

		// Check page title
		await expect(page).toHaveTitle(/Casalia/);

		// Check hero section is visible
		await expect(page.locator("h1")).toBeVisible();

		// Check navigation is present
		await expect(page.getByRole("navigation")).toBeVisible();
	});

	test("should navigate to Comprar page", async ({ page }) => {
		await page.goto("/");

		// Click on Comprar link in navigation
		await page.getByRole("link", { name: /comprar/i }).first().click();

		// Check we're on the comprar page
		await expect(page).toHaveURL(/.*comprar/);
		await expect(
			page.getByRole("heading", { name: /propiedades en venta/i })
		).toBeVisible();
	});

	test("should navigate to Alquilar page", async ({ page }) => {
		await page.goto("/");

		// Click on Alquilar link
		await page.getByRole("link", { name: /alquilar/i }).first().click();

		// Check we're on the alquilar page
		await expect(page).toHaveURL(/.*alquilar/);
		await expect(
			page.getByRole("heading", { name: /propiedades en alquiler/i })
		).toBeVisible();
	});

	test("should navigate to Blog page", async ({ page }) => {
		await page.goto("/");

		// Click on Blog link
		await page.getByRole("link", { name: /blog/i }).first().click();

		// Check we're on the blog page
		await expect(page).toHaveURL(/.*blog/);
		await expect(page.getByRole("heading", { name: /blog/i })).toBeVisible();
	});

	test("should navigate to Vender page", async ({ page }) => {
		await page.goto("/");

		// Click on Vender link
		await page.getByRole("link", { name: /vender/i }).first().click();

		// Check we're on the vender page
		await expect(page).toHaveURL(/.*vender/);
	});

	test("should show WhatsApp button on all pages", async ({ page }) => {
		// Check on homepage
		await page.goto("/");
		await expect(page.locator('a[href*="wa.me"]')).toBeVisible();

		// Check on comprar page
		await page.goto("/comprar");
		await expect(page.locator('a[href*="wa.me"]')).toBeVisible();
	});

	test("should have footer with contact info", async ({ page }) => {
		await page.goto("/", { waitUntil: "networkidle" });

		// Check footer exists
		const footer = page.locator("footer");
		await expect(footer).toBeVisible();

		// Scroll to footer
		await footer.scrollIntoViewIfNeeded();

		// Check footer has company name (in the logo section)
		await expect(footer.locator("text=CASALIA").first()).toBeVisible();

		// Check footer has contact email
		await expect(footer.locator("text=@casalia.org")).toBeVisible();
	});
});

test.describe("Property Listing Navigation", () => {
	test("should display property cards on Comprar page", async ({ page }) => {
		await page.goto("/comprar");

		// Check property cards are visible
		const propertyCards = page.locator('[data-testid="property-card"]');

		// If no test IDs, look for card-like elements
		const cards = page.locator("article, [class*='card']");

		// At least one property should be visible
		await expect(cards.first()).toBeVisible({ timeout: 10000 });
	});

	test("should navigate to property detail page", async ({ page }) => {
		await page.goto("/comprar");

		// Click on first property link
		const firstPropertyLink = page.locator("a[href*='/comprar/']").first();
		await firstPropertyLink.click();

		// Check we're on a property detail page
		await expect(page).toHaveURL(/.*comprar\/.+/);

		// Check property details are shown
		await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
	});

	test("should filter properties by type", async ({ page }) => {
		await page.goto("/comprar");

		// Look for filter select/dropdown
		const typeFilter = page.locator(
			'select[name*="tipo"], [data-testid="type-filter"]'
		);

		if (await typeFilter.isVisible()) {
			await typeFilter.selectOption({ label: /piso/i });

			// URL should update with filter
			await expect(page).toHaveURL(/.*tipo=piso/);
		}
	});
});

test.describe("Responsive Design", () => {
	test("should show mobile menu on small screens", async ({ page }) => {
		// Set mobile viewport
		await page.setViewportSize({ width: 375, height: 667 });

		await page.goto("/");

		// Mobile menu button should be visible
		const menuButton = page.locator(
			'button[aria-label*="menu"], button[class*="mobile"], [data-testid="mobile-menu"]'
		);

		// Check mobile navigation trigger exists
		await expect(
			page.locator("button").filter({ hasText: /menu/i }).or(menuButton)
		).toBeVisible();
	});

	test("should have readable text on mobile", async ({ page }) => {
		await page.setViewportSize({ width: 375, height: 667 });

		await page.goto("/");

		// Main heading should be visible and not cut off
		const heading = page.locator("h1");
		await expect(heading).toBeVisible();

		// Check heading is within viewport
		const box = await heading.boundingBox();
		expect(box).not.toBeNull();
		if (box) {
			expect(box.width).toBeLessThanOrEqual(375);
		}
	});
});
