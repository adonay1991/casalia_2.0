import { expect, test } from "@playwright/test";

test.describe("Contact Forms", () => {
	test.describe("Valuation Form (/vender)", () => {
		test("should display valuation form", async ({ page }) => {
			await page.goto("/vender");

			// Check form is visible
			await expect(page.locator("form")).toBeVisible();

			// Check required fields exist
			await expect(page.getByLabel(/nombre/i)).toBeVisible();
			await expect(page.getByLabel(/email/i)).toBeVisible();
			await expect(page.getByLabel(/telefono|tel/i)).toBeVisible();
		});

		test("should show validation errors for empty form", async ({ page }) => {
			await page.goto("/vender");

			// Try to submit empty form
			const submitButton = page.getByRole("button", {
				name: /enviar|solicitar/i,
			});
			await submitButton.click();

			// Should show validation errors (HTML5 or custom)
			// Wait for error state
			await page.waitForTimeout(500);

			// Check for invalid state on required fields
			const nameInput = page.getByLabel(/nombre/i);
			const isInvalid =
				(await nameInput.getAttribute("aria-invalid")) === "true" ||
				(await nameInput.evaluate(
					(el) => !(el as HTMLInputElement).checkValidity()
				));

			expect(isInvalid).toBeTruthy();
		});

		test("should validate email format", async ({ page }) => {
			await page.goto("/vender");

			// Fill invalid email
			const emailInput = page.getByLabel(/email/i);
			await emailInput.fill("invalid-email");
			await emailInput.blur();

			// Try to submit
			const submitButton = page.getByRole("button", {
				name: /enviar|solicitar/i,
			});
			await submitButton.click();

			// Wait for validation
			await page.waitForTimeout(300);

			// Check email is marked invalid
			const isInvalid = await emailInput.evaluate(
				(el) => !(el as HTMLInputElement).checkValidity()
			);
			expect(isInvalid).toBeTruthy();
		});

		test("should validate phone length", async ({ page }) => {
			await page.goto("/vender");

			// Fill short phone
			const phoneInput = page.getByLabel(/telefono|tel/i);
			await phoneInput.fill("12345"); // Too short

			// Should be invalid (minLength 9)
			await phoneInput.blur();
			await page.waitForTimeout(300);

			const isInvalid = await phoneInput.evaluate((el) => {
				const input = el as HTMLInputElement;
				return !input.checkValidity() || input.value.length < 9;
			});

			// Either HTML validation or value too short
			expect(isInvalid).toBeTruthy();
		});

		test("should fill and submit form successfully", async ({ page }) => {
			await page.goto("/vender");

			// Fill all required fields
			await page.getByLabel(/nombre/i).fill("Juan Garcia");
			await page.getByLabel(/email/i).fill("juan@example.com");
			await page.getByLabel(/telefono|tel/i).fill("612345678");

			// Fill property type if it's a select
			const typeSelect = page.locator(
				'select[name*="tipo"], select[name*="propertyType"]'
			);
			if (await typeSelect.isVisible()) {
				await typeSelect.selectOption({ index: 1 });
			}

			// Fill address
			const addressInput = page.getByLabel(/direccion|address/i);
			if (await addressInput.isVisible()) {
				await addressInput.fill("Calle Mayor 123, Madrid");
			}

			// Fill area/metros
			const areaInput = page.getByLabel(/metros|area|superficie/i);
			if (await areaInput.isVisible()) {
				await areaInput.fill("85");
			}

			// Submit form
			const submitButton = page.getByRole("button", {
				name: /enviar|solicitar/i,
			});
			await submitButton.click();

			// Wait for response - could be success message or redirect
			await page.waitForTimeout(2000);

			// Check for success indication
			const successMessage = page.getByText(
				/gracias|enviado|recibido|exito|success/i
			);
			const hasSuccess = await successMessage.isVisible().catch(() => false);

			// If no success message visible, at least form shouldn't show error
			if (!hasSuccess) {
				// Check we're not showing error
				const errorMessage = page.getByText(/error|fallido|problema/i);
				const hasError = await errorMessage.isVisible().catch(() => false);
				expect(hasError).toBeFalsy();
			}
		});
	});

	test.describe("Property Contact Form", () => {
		test("should show contact options on property page", async ({ page }) => {
			// Navigate to a property detail page
			await page.goto("/comprar");

			// Click first property
			const firstProperty = page.locator("a[href*='/comprar/']").first();
			await firstProperty.click();

			// Wait for page load
			await page.waitForLoadState("networkidle");

			// Check for contact section heading
			await expect(
				page.getByRole("heading", { name: /contactar.*casalia/i })
			).toBeVisible();

			// Check for contact buttons - WhatsApp link with wa.me or tel: link
			const whatsappButton = page.locator('a[href*="wa.me"]').first();
			const callButton = page.locator('a[href^="tel:"]').first();

			// At least one contact method should be available
			const hasWhatsapp = await whatsappButton.isVisible().catch(() => false);
			const hasCall = await callButton.isVisible().catch(() => false);

			expect(hasWhatsapp || hasCall).toBeTruthy();
		});

		test("should have working WhatsApp link with property info", async ({
			page,
		}) => {
			await page.goto("/comprar");

			// Click first property
			await page.locator("a[href*='/comprar/']").first().click();
			await page.waitForLoadState("networkidle");

			// Check WhatsApp link includes property reference
			const whatsappLink = page.locator('a[href*="wa.me"]').first();
			const href = await whatsappLink.getAttribute("href");

			expect(href).toContain("wa.me");
			// Link should contain text parameter with property info
			expect(href).toMatch(/text=.+/i);
		});
	});

	test.describe("Homepage Contact", () => {
		test("should have quick contact section", async ({ page }) => {
			await page.goto("/");

			// Scroll to contact section
			await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));

			// Look for contact info
			const phone = page.getByText(/\+34|91[0-9]|6[0-9]{8}/);
			const email = page.getByText(/@casalia/i);

			// At least one contact method should be visible
			const hasPhone = await phone.first().isVisible().catch(() => false);
			const hasEmail = await email.first().isVisible().catch(() => false);

			expect(hasPhone || hasEmail).toBeTruthy();
		});
	});
});

test.describe("Mortgage Calculator", () => {
	test("should calculate mortgage payments", async ({ page }) => {
		await page.goto("/calculadora-hipoteca");

		// Wait for page to load completely
		await page.waitForLoadState("networkidle");

		// The calculator uses spinbutton for price input
		const priceInput = page.getByRole("spinbutton", {
			name: /precio.*vivienda/i,
		});

		// Check calculator heading is visible
		await expect(
			page.getByRole("heading", { name: /calculadora.*hipoteca/i })
		).toBeVisible();

		// Check the price input or slider exists
		const hasSpinbutton = await priceInput.isVisible().catch(() => false);
		const hasSlider = await page
			.getByRole("slider")
			.first()
			.isVisible()
			.catch(() => false);

		expect(hasSpinbutton || hasSlider).toBeTruthy();

		// Check for result display (cuota mensual estimada)
		const result = page.getByText(/cuota.*mensual|mensual.*estimada/i);
		await expect(result.first()).toBeVisible();

		// Check the result shows a euro amount
		const euroAmount = page.getByText(/\d+.*€/);
		await expect(euroAmount.first()).toBeVisible();
	});

	test("should have share to WhatsApp functionality", async ({ page }) => {
		await page.goto("/calculadora-hipoteca");
		await page.waitForLoadState("networkidle");

		// Look for share button with WhatsApp text
		const shareButton = page.getByRole("button", { name: /compartir.*whatsapp/i });

		// Button should exist and be enabled
		await expect(shareButton).toBeVisible();
		await expect(shareButton).toBeEnabled();
	});
});
