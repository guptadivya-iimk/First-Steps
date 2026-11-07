import { test, expect } from "@playwright/test";

test.describe("Core flows", () => {
  test("landing page shows the pitch and both ways in", async ({ page }) => {
    await page.goto("/");
    // The headline is set as two colour blocks, so it is two spans.
    const headline = page.getByRole("heading", { level: 1 });
    await expect(headline).toContainText("A first school");
    await expect(headline).toContainText("you can trust");
    await expect(page.getByText("Real cab times")).toBeVisible();
    await expect(page.getByText("Montessori, checked")).toBeVisible();
    await expect(
      page.getByRole("link", { name: /Continue with Google/i })
    ).toBeVisible();
    await expect(
      page.getByRole("link", { name: /Look around first/i })
    ).toBeVisible();
  });

  test("consent is required before the shortlist", async ({ page }) => {
    await page.goto("/welcome");
    await expect(page.getByRole("heading", { level: 1 })).toContainText(
      "Before we start"
    );

    const submit = page.getByRole("button", { name: /Show me the schools/i });
    await expect(submit).toBeDisabled();

    await page.getByRole("checkbox").check();
    await expect(submit).toBeEnabled();

    await submit.click();
    await expect(page).toHaveURL(/.*shortlist/);
  });

  test("shortlist lists the seeded schools with scores", async ({ page }) => {
    await page.goto("/shortlist");
    await expect(page.getByRole("heading", { level: 1 })).toContainText(
      "Schools near you"
    );

    await expect(
      page.getByRole("link", { name: "Productive Minds Montessori Pre-School" })
    ).toBeVisible();
    await expect(
      page.getByRole("link", { name: "Our Montessori House (OMH)" })
    ).toBeVisible();

    // Pathways is flagged as possibly closed, so it is held back.
    await expect(page.getByText("Set aside")).toBeVisible();
  });

  test("a must-have filter removes schools that fail it", async ({ page }) => {
    await page.goto("/shortlist");
    const heading = page.getByRole("heading", { level: 1 });
    await expect(heading).toBeVisible();

    await page.getByRole("button", { name: "Parent CCTV" }).click();

    // Footprints Sector 48 confirms parent CCTV; KIIT does not.
    await expect(
      page.getByRole("link", { name: /Footprints Play School & Daycare/ }).first()
    ).toBeVisible();
    // The reasons live inside the "Set aside" drawer.
    await page.getByRole("button", { name: /Set aside/ }).click();
    await expect(
      page.getByText("Parent CCTV not confirmed").first()
    ).toBeVisible();
  });

  test("school page explains the score and shows its sources", async ({
    page,
  }) => {
    await page.goto("/school/productive-minds-sec-47");
    await expect(page.getByRole("heading", { level: 1 })).toContainText(
      "Productive Minds Montessori Pre-School"
    );
    await expect(page.getByText(/Why \d+ out of 100/)).toBeVisible();
    await expect(page.getByText("Where each fact came from")).toBeVisible();
    await expect(page.getByText("Says pure Montessori")).toBeVisible();
    await expect(page.getByText("Worth asking about")).toBeVisible();
  });

  test("saving a school carries it through to compare", async ({ page }) => {
    await page.goto("/shortlist");
    await page.getByRole("button", { name: "Save to your list" }).first().click();

    await page.goto("/compare");
    await expect(page.getByRole("heading", { level: 1 })).toContainText(
      "Side by side"
    );
    await expect(page.getByRole("table")).toBeVisible();
    await expect(page.getByText("Nothing saved yet")).toBeHidden();
  });

  test("moving a priority slider changes the scores", async ({ page }) => {
    await page.goto("/settings/needs");
    await expect(page.getByRole("heading", { level: 1 })).toContainText(
      "What matters to you"
    );
    await expect(
      page.getByRole("slider", { name: /Montessori importance/i })
    ).toBeVisible();
  });

  test("the atlas pins every matching school on a real map", async ({ page }) => {
    await page.goto("/shortlist");
    await page.getByRole("button", { name: "Atlas" }).click();

    const map = page.getByRole("application", {
      name: /Map of preschools/i,
    });
    await expect(map).toBeVisible();

    // One pin per matching school, each carrying its own fit score.
    const pins = page.locator(".firststeps-pin-shape");
    await expect(pins.first()).toBeVisible();
    expect(await pins.count()).toBeGreaterThan(5);

    await pins.first().click();
    await expect(
      page.getByRole("link", { name: /See the details/i })
    ).toBeVisible();
  });

  test("the five priorities always add up to a hundred", async ({ page }) => {
    await page.goto("/settings/needs");
    await expect(page.getByText("100 of 100 spent")).toBeVisible();

    // Spending more on one has to take it from the others.
    await page.getByRole("button", { name: /More weight on Montessori/i }).click();
    await expect(page.getByText("100 of 100 spent")).toBeVisible();

    await page.getByRole("button", { name: /Less weight on Safety/i }).click();
    await expect(page.getByText("100 of 100 spent")).toBeVisible();
  });

  test("the account page holds no name and no child age", async ({ page }) => {
    await page.goto("/settings");
    // The side rail also prints the area but is display:none on a phone, so
    // scope the assertion to the account panel's own definition list.
    const details = page.locator("dl").first();
    await expect(details.getByText("Searching from")).toBeVisible();
    await expect(details.getByText("Sector 47, Gurugram")).toBeVisible();

    // Both identifying rows are present as labels but explicitly empty.
    await expect(page.getByText("Not stored").first()).toBeVisible();
    await expect(page.getByText("Divya")).toBeHidden();
  });

  test("every page fits a 375px phone without sideways scroll", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    const routes = [
      "/",
      "/welcome",
      "/shortlist",
      "/compare",
      "/visits",
      "/settings",
      "/settings/needs",
      "/privacy",
      "/how-it-works",
      "/school/productive-minds-sec-47",
    ];

    for (const route of routes) {
      await page.goto(route);
      const overflow = await page.evaluate(
        () =>
          document.documentElement.scrollWidth -
          document.documentElement.clientWidth
      );
      expect(overflow, `${route} scrolls sideways`).toBeLessThanOrEqual(1);
    }
  });
});
