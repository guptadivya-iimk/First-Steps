import { test, expect } from "@playwright/test";

test.describe("Phase 1: Foundations & Core Navigation", () => {
  test("landing page renders headline, benefits and Google sign-in CTA", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { level: 1 })).toContainText(
      "Find the right first school, without the guesswork."
    );
    await expect(page.getByText("Schools within your cab time")).toBeVisible();
    await expect(page.getByText("Real Montessori and safety checks")).toBeVisible();
    await expect(page.getByRole("link", { name: /Continue with Google/i })).toBeVisible();
  });

  test("welcome consent page requires agreement under DPDP Act", async ({ page }) => {
    await page.goto("/welcome");
    await expect(page.getByRole("heading", { level: 1 })).toContainText(
      "Your child's privacy comes first."
    );

    const submitBtn = page.getByRole("button", { name: /Proceed to Shortlist/i });
    await expect(submitBtn).toBeDisabled();

    // Check consent checkbox
    await page.getByRole("checkbox").check();
    await expect(submitBtn).toBeEnabled();

    // Click submit
    await submitBtn.click();
    await expect(page).toHaveURL(/.*shortlist/);
  });

  test("shortlist page renders seeded Sector 47 schools and cards", async ({ page }) => {
    await page.goto("/shortlist");
    await expect(page.getByRole("heading", { level: 1 })).toContainText("Your preschool shortlist");
    
    // Check for key seed schools
    await expect(page.getByText("Productive Minds Montessori Pre-School")).toBeVisible();
    await expect(page.getByText("Modern Montessori International Preschool")).toBeVisible();
    await expect(page.getByText("Our Montessori House (OMH)")).toBeVisible();

    // Check status tags and conflict alert
    await expect(page.getByText("Verification Alert:").first()).toBeVisible();
    await expect(page.getByText("Ask About Seats").first()).toBeVisible();
  });

  test("school detail page displays score breakdown and source provenance", async ({ page }) => {
    await page.goto("/school/productive-minds-sec-47");
    await expect(page.getByRole("heading", { level: 1 })).toContainText(
      "Productive Minds Montessori Pre-School"
    );
    await expect(page.getByText("Fit Score Breakdown")).toBeVisible();
    await expect(page.getByText("Verified Facts & Source Provenance")).toBeVisible();
    await expect(page.getByText("Says pure Montessori")).toBeVisible();
  });
});
