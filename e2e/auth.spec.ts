import { expect, test } from "@playwright/test";

test.describe("Authentication", () => {
	test.describe("Login Page", () => {
		test("should display login form", async ({ page }) => {
			await page.goto("/auth/login");

			// Check login form elements - Note: labels are "Email" and "Contrasena" (without ñ)
			await expect(page.getByLabel(/email/i)).toBeVisible();
			await expect(page.getByLabel(/contrasena|password/i)).toBeVisible();
			await expect(
				page.getByRole("button", { name: /iniciar|login|entrar/i })
			).toBeVisible();
		});

		test("should show error for invalid credentials", async ({ page }) => {
			await page.goto("/auth/login");

			// Fill invalid credentials - labels are "Email" and "Contrasena"
			await page.getByLabel(/email/i).fill("invalid@example.com");
			await page.getByLabel(/contrasena|password/i).fill("wrongpassword");

			// Submit
			await page
				.getByRole("button", { name: /iniciar|login|entrar/i })
				.click();

			// Wait for response - server action may take a moment
			await page.waitForTimeout(3000);

			// Should show error message - Supabase returns "Invalid login credentials" in English
			const errorText = page.getByText(/invalid|error|incorrecto|invalido|credenciales/i);
			await expect(errorText.first()).toBeVisible({ timeout: 5000 });
		});

		test("should validate email format", async ({ page }) => {
			await page.goto("/auth/login");

			// Fill invalid email
			const emailInput = page.getByLabel(/email/i);
			await emailInput.fill("not-an-email");
			await emailInput.blur();

			// Check validation
			const isInvalid = await emailInput.evaluate(
				(el) => !(el as HTMLInputElement).checkValidity()
			);
			expect(isInvalid).toBeTruthy();
		});

		test("should require password", async ({ page }) => {
			await page.goto("/auth/login");

			// Fill only email
			await page.getByLabel(/email/i).fill("test@example.com");

			// Try to submit
			await page
				.getByRole("button", { name: /iniciar|login|entrar/i })
				.click();

			// Should not proceed without password
			// Either stays on page or shows error
			await page.waitForTimeout(500);
			await expect(page).toHaveURL(/.*login/);
		});
	});

	test.describe("Protected Routes", () => {
		test("should redirect to login when accessing admin without auth", async ({
			page,
		}) => {
			// Try to access admin dashboard directly
			await page.goto("/admin");

			// Should redirect to login
			await expect(page).toHaveURL(/.*login/, { timeout: 5000 });
		});

		test("should redirect to login when accessing admin properties", async ({
			page,
		}) => {
			await page.goto("/admin/propiedades");

			// Should redirect to login
			await expect(page).toHaveURL(/.*login/, { timeout: 5000 });
		});

		test("should redirect to login when accessing admin leads", async ({
			page,
		}) => {
			await page.goto("/admin/leads");

			// Should redirect to login
			await expect(page).toHaveURL(/.*login/, { timeout: 5000 });
		});

		test("should redirect to login when accessing admin blog", async ({
			page,
		}) => {
			await page.goto("/admin/blog");

			// Should redirect to login
			await expect(page).toHaveURL(/.*login/, { timeout: 5000 });
		});
	});
});

// Tests that require authentication - these would need proper auth setup
test.describe("Authenticated Admin", () => {
	// Note: For real auth testing, you would set up auth state
	// using storageState or by logging in before each test

	test.skip("should access dashboard after login", async ({ page }) => {
		// This test is skipped because it requires valid credentials
		// In a real scenario, you would:
		// 1. Set up test credentials in environment
		// 2. Login in beforeEach
		// 3. Save auth state with storageState

		await page.goto("/auth/login");

		// Login with test credentials - labels are "Email" and "Contrasena"
		await page.getByLabel(/email/i).fill(process.env.TEST_ADMIN_EMAIL ?? "");
		await page
			.getByLabel(/contrasena|password/i)
			.fill(process.env.TEST_ADMIN_PASSWORD ?? "");
		await page.getByRole("button", { name: /iniciar|login|entrar/i }).click();

		// Wait for redirect
		await page.waitForURL(/.*admin/, { timeout: 10000 });

		// Should see dashboard
		await expect(
			page.getByRole("heading", { name: /dashboard|panel/i })
		).toBeVisible();
	});

	test.skip("should logout successfully", async ({ page }) => {
		// This test requires being logged in first
		// Would need storageState setup

		await page.goto("/admin");

		// Find and click logout button
		const logoutButton = page.getByRole("button", { name: /cerrar|logout/i });
		await logoutButton.click();

		// Should redirect to login or home
		await expect(page).toHaveURL(/.*login|^\/$/, { timeout: 5000 });
	});
});
