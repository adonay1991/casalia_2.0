import { expect, test } from "@playwright/test";

/**
 * Admin Panel E2E Tests
 *
 * These tests verify the admin panel functionality.
 * Note: Tests that require authentication are marked with .skip()
 * and need proper auth setup to run (see e2e/helpers/auth.ts)
 *
 * To run authenticated tests:
 * 1. Set TEST_ADMIN_EMAIL and TEST_ADMIN_PASSWORD in .env.local
 * 2. Create auth state file with: bun run test:e2e:auth
 * 3. Run tests with auth state
 */

test.describe("Admin Dashboard", () => {
	// These tests are skipped without auth setup
	test.describe.configure({ mode: "serial" });

	test.skip("should display dashboard stats", async ({ page }) => {
		await page.goto("/admin");

		// Check stats cards are visible
		await expect(page.getByText(/propiedades/i).first()).toBeVisible();
		await expect(page.getByText(/leads/i).first()).toBeVisible();
		await expect(page.getByText(/posts/i).first()).toBeVisible();

		// Check charts are rendered
		await expect(page.locator("canvas, svg[class*='chart']")).toBeVisible();
	});

	test.skip("should navigate between admin sections", async ({ page }) => {
		await page.goto("/admin");

		// Navigate to properties
		await page.getByRole("link", { name: /propiedades/i }).click();
		await expect(page).toHaveURL(/.*admin\/propiedades/);

		// Navigate to leads
		await page.getByRole("link", { name: /leads/i }).click();
		await expect(page).toHaveURL(/.*admin\/leads/);

		// Navigate to blog
		await page.getByRole("link", { name: /blog/i }).click();
		await expect(page).toHaveURL(/.*admin\/blog/);

		// Back to dashboard
		await page.getByRole("link", { name: /dashboard|inicio/i }).click();
		await expect(page).toHaveURL(/.*admin$/);
	});
});

test.describe("Admin Properties CRUD", () => {
	test.skip("should list properties", async ({ page }) => {
		await page.goto("/admin/propiedades");

		// Check table or list is visible
		await expect(
			page.locator("table, [class*='grid'], [class*='list']")
		).toBeVisible();

		// Check for property items
		const rows = page.locator("tr, [class*='card']");
		await expect(rows.first()).toBeVisible();
	});

	test.skip("should open create property form", async ({ page }) => {
		await page.goto("/admin/propiedades");

		// Click new property button
		await page.getByRole("link", { name: /nueva|crear|añadir/i }).click();

		// Should be on new property page
		await expect(page).toHaveURL(/.*propiedades\/nueva/);

		// Form should be visible
		await expect(page.locator("form")).toBeVisible();
	});

	test.skip("should validate property form", async ({ page }) => {
		await page.goto("/admin/propiedades/nueva");

		// Try to submit empty form
		await page.getByRole("button", { name: /guardar|crear/i }).click();

		// Should show validation errors
		await page.waitForTimeout(500);

		// Title should be required
		const titleInput = page.getByLabel(/titulo|title/i);
		const isInvalid =
			(await titleInput.getAttribute("aria-invalid")) === "true" ||
			(await titleInput.evaluate(
				(el) => !(el as HTMLInputElement).checkValidity()
			));

		expect(isInvalid).toBeTruthy();
	});

	test.skip("should create a new property", async ({ page }) => {
		await page.goto("/admin/propiedades/nueva");

		// Fill required fields
		await page.getByLabel(/titulo|title/i).fill("Piso de prueba E2E");

		// Select property type
		const typeSelect = page.locator('select[name*="propertyType"]');
		await typeSelect.selectOption("piso");

		// Select operation type
		const opSelect = page.locator('select[name*="operationType"]');
		await opSelect.selectOption("venta");

		// Fill price
		await page.getByLabel(/precio/i).fill("150000");

		// Fill address
		await page.getByLabel(/direccion|address/i).fill("Calle Test 123");

		// Fill zone
		await page.getByLabel(/zona|zone/i).fill("Centro");

		// Fill area
		await page.getByLabel(/metros|superficie/i).fill("85");

		// Submit
		await page.getByRole("button", { name: /guardar|crear/i }).click();

		// Should redirect to properties list or show success
		await page.waitForURL(/.*propiedades(?!\/nueva)/, { timeout: 10000 });
	});

	test.skip("should edit existing property", async ({ page }) => {
		await page.goto("/admin/propiedades");

		// Click edit on first property
		await page.getByRole("link", { name: /editar/i }).first().click();

		// Should be on edit page
		await expect(page).toHaveURL(/.*propiedades\/[^\/]+$/);

		// Form should have values
		const titleInput = page.getByLabel(/titulo|title/i);
		const value = await titleInput.inputValue();
		expect(value.length).toBeGreaterThan(0);

		// Modify title
		await titleInput.fill("Titulo modificado E2E");

		// Save
		await page.getByRole("button", { name: /guardar/i }).click();

		// Wait for save
		await page.waitForTimeout(2000);

		// Should show success or redirect
		const success = page.getByText(/guardado|actualizado|exito/i);
		await expect(success).toBeVisible({ timeout: 5000 });
	});
});

test.describe("Admin Leads", () => {
	test.skip("should list leads", async ({ page }) => {
		await page.goto("/admin/leads");

		// Check table is visible
		await expect(page.locator("table")).toBeVisible();
	});

	test.skip("should filter leads by status", async ({ page }) => {
		await page.goto("/admin/leads");

		// Find status filter
		const statusFilter = page.locator('select[name*="status"]');

		if (await statusFilter.isVisible()) {
			await statusFilter.selectOption("nuevo");

			// URL should update
			await expect(page).toHaveURL(/.*status=nuevo/);
		}
	});

	test.skip("should view lead details", async ({ page }) => {
		await page.goto("/admin/leads");

		// Click on first lead
		await page.getByRole("link", { name: /ver|detalle/i }).first().click();

		// Should show lead info
		await expect(page.getByText(/nombre|name/i)).toBeVisible();
		await expect(page.getByText(/email/i)).toBeVisible();
		await expect(page.getByText(/telefono|phone/i)).toBeVisible();
	});

	test.skip("should update lead status", async ({ page }) => {
		await page.goto("/admin/leads");

		// Go to first lead detail
		await page.getByRole("link", { name: /ver|detalle/i }).first().click();

		// Find status select
		const statusSelect = page.locator('select[name*="status"]');
		await statusSelect.selectOption("contactado");

		// Save or auto-save
		const saveButton = page.getByRole("button", { name: /guardar/i });
		if (await saveButton.isVisible()) {
			await saveButton.click();
		}

		// Wait and verify
		await page.waitForTimeout(1000);
	});
});

test.describe("Admin Blog", () => {
	test.skip("should list blog posts", async ({ page }) => {
		await page.goto("/admin/blog");

		// Check list is visible
		await expect(
			page.locator("table, [class*='grid'], [class*='list']")
		).toBeVisible();
	});

	test.skip("should create new post", async ({ page }) => {
		await page.goto("/admin/blog/nuevo");

		// Fill post form
		await page.getByLabel(/titulo|title/i).fill("Post de prueba E2E");

		// Fill slug if visible
		const slugInput = page.getByLabel(/slug/i);
		if (await slugInput.isVisible()) {
			await slugInput.fill("post-prueba-e2e");
		}

		// Select category
		const categorySelect = page.locator('select[name*="category"]');
		if (await categorySelect.isVisible()) {
			await categorySelect.selectOption({ index: 1 });
		}

		// Fill content (rich editor or textarea)
		const contentArea = page.locator(
			'[contenteditable="true"], textarea[name*="content"]'
		);
		await contentArea.first().fill("Contenido del post de prueba.");

		// Save as draft
		await page.getByRole("button", { name: /guardar/i }).click();

		// Wait for save
		await page.waitForTimeout(2000);

		// Should show success
		const success = page.getByText(/guardado|creado/i);
		await expect(success).toBeVisible({ timeout: 5000 });
	});

	test.skip("should publish post", async ({ page }) => {
		await page.goto("/admin/blog");

		// Edit first draft post
		await page.getByRole("link", { name: /editar/i }).first().click();

		// Click publish
		await page.getByRole("button", { name: /publicar/i }).click();

		// Confirm if needed
		const confirmButton = page.getByRole("button", { name: /confirmar|si/i });
		if (await confirmButton.isVisible()) {
			await confirmButton.click();
		}

		// Wait for action
		await page.waitForTimeout(2000);

		// Should show published status
		const published = page.getByText(/publicado/i);
		await expect(published).toBeVisible({ timeout: 5000 });
	});
});
