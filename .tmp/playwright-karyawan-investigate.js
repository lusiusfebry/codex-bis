const { chromium } = require("playwright");
const fs = require("fs");
const path = require("path");

async function collectTexts(page, selector) {
  return page.locator(selector).evaluateAll((elements) =>
    elements
      .map((element) => element.textContent?.trim() || "")
      .filter(Boolean),
  );
}

async function run() {
  const outDir = path.resolve("c:/project-it/codex-bis/.tmp/playwright-karyawan");
  fs.mkdirSync(outDir, { recursive: true });

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1600, height: 1200 } });

  await page.goto("http://localhost:3000/login", { waitUntil: "networkidle" });
  await page.getByLabel("NIK").fill("01-00001");
  await page.getByLabel("Kata Sandi").fill("Admin@123");
  await page.getByRole("button", { name: /masuk/i }).click();
  await page.waitForLoadState("networkidle");

  await page.goto("http://localhost:3000/hr/karyawan/tambah", { waitUntil: "networkidle" });
  await page.screenshot({ path: path.join(outDir, "karyawan-tambah.png"), fullPage: true });

  const tambahData = {
    url: page.url(),
    headings: await collectTexts(page, "h1, h2, h3"),
    tabs: await collectTexts(page, '[role="tab"]'),
    labels: await collectTexts(page, "label"),
    cards: await collectTexts(page, "[data-slot='card-title'], .text-lg, .text-base"),
  };
  fs.writeFileSync(
    path.join(outDir, "karyawan-tambah.json"),
    JSON.stringify(tambahData, null, 2),
    "utf8",
  );

  await page.goto("http://localhost:3000/hr/karyawan", { waitUntil: "networkidle" });
  await page.locator("tbody tr").first().getByRole("button").first().click();
  await page.waitForLoadState("networkidle");
  await page.screenshot({ path: path.join(outDir, "karyawan-detail.png"), fullPage: true });

  const detailData = {
    url: page.url(),
    headings: await collectTexts(page, "h1, h2, h3"),
    tabs: await collectTexts(page, '[role="tab"]'),
    labels: await collectTexts(page, "label"),
    cards: await collectTexts(page, "[data-slot='card-title'], .text-lg, .text-base"),
  };
  fs.writeFileSync(
    path.join(outDir, "karyawan-detail.json"),
    JSON.stringify(detailData, null, 2),
    "utf8",
  );

  await browser.close();
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
