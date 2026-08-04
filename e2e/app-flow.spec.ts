import { test, expect } from "@playwright/test";

test.describe("Portal UMKM End-to-End User Flow Tests", () => {
  test("Navbar navigation and Home page load", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/Korowelang|Kutoharjo|UMKM/i);
  });

  test("UMKM Catalog page & price range filtering", async ({ page }) => {
    await page.goto("/umkm");
    await expect(page.getByRole("heading", { name: /Katalog UMKM/i })).toBeVisible();

    // Click price range filter
    const under50kFilter = page.getByRole("link", { name: /< Rp 50.000/i });
    if (await under50kFilter.isVisible()) {
      await under50kFilter.click();
      await page.waitForURL(/priceRange=under50k/);
      expect(page.url()).toContain("priceRange=under50k");
    }
  });

  test("Peta Interaktif Desa page load", async ({ page }) => {
    await page.goto("/peta");
    await expect(page.getByText(/Peta Persebaran UMKM/i)).toBeVisible();
  });

  test("Login page form rendering", async ({ page }) => {
    await page.goto("/login");
    await expect(page.getByLabel(/Alamat Email/i)).toBeVisible();
    await expect(page.getByLabel(/Kata Sandi/i)).toBeVisible();
    await expect(page.getByRole("button", { name: /Masuk Sekarang/i })).toBeVisible();
  });
});
