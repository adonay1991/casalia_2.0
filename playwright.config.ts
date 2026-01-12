import { defineConfig, devices } from "@playwright/test";

/**
 * Playwright E2E Test Configuration for Casalia 2.0
 *
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
	// Directory containing tests
	testDir: "./e2e",

	// Run tests in files in parallel
	fullyParallel: true,

	// Fail the build on CI if you accidentally left test.only in the source code
	forbidOnly: !!process.env.CI,

	// Retry on CI only
	retries: process.env.CI ? 2 : 0,

	// Opt out of parallel tests on CI
	workers: process.env.CI ? 1 : undefined,

	// Reporter to use
	reporter: [
		["html", { outputFolder: "playwright-report" }],
		["list"], // Console output
	],

	// Shared settings for all projects
	use: {
		// Base URL to use in actions like `await page.goto('/')`
		baseURL: "http://localhost:3000",

		// Collect trace when retrying the failed test
		trace: "on-first-retry",

		// Take screenshot on failure
		screenshot: "only-on-failure",

		// Record video on failure
		video: "on-first-retry",

		// Increase timeout for assertions
		actionTimeout: 10000,

		// Wait for page to be fully loaded
		navigationTimeout: 30000,
	},

	// Global timeout for each test
	timeout: 60000,

	// Expect timeout
	expect: {
		timeout: 10000,
	},

	// Configure projects for major browsers
	projects: [
		{
			name: "chromium",
			use: { ...devices["Desktop Chrome"] },
		},

		// Uncomment to add more browsers
		// {
		// 	name: "firefox",
		// 	use: { ...devices["Desktop Firefox"] },
		// },
		// {
		// 	name: "webkit",
		// 	use: { ...devices["Desktop Safari"] },
		// },

		// Mobile viewports
		{
			name: "mobile-chrome",
			use: { ...devices["Pixel 5"] },
		},
		// {
		// 	name: "mobile-safari",
		// 	use: { ...devices["iPhone 12"] },
		// },
	],

	// Run your local dev server before starting the tests
	webServer: {
		command: "bun run dev",
		url: "http://localhost:3000",
		reuseExistingServer: !process.env.CI,
		timeout: 120 * 1000, // 2 minutes to start
	},
});
