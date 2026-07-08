const { chromium } = require('@playwright/test');
const path = require('path');
const fs = require('fs');

const BASE_URL = 'http://localhost:3000';
const MEDIA_DIR = path.join(__dirname, '..', 'docs', 'media');

// Ensure output directory exists
fs.mkdirSync(MEDIA_DIR, { recursive: true });

(async () => {
  let browser;
  let currentStep = 'initialization';

  try {
    browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();
    await page.setViewportSize({ width: 1440, height: 900 });

    // Navigate and wait for the query box to be ready
    try {
      await page.goto(BASE_URL);
    } catch (err) {
      if (err.message && err.message.includes('net::ERR_CONNECTION_REFUSED')) {
        console.error(
          `\n❌ Cannot connect to ${BASE_URL} — is the dev server running?\n   Start it with: npm run dev\n`
        );
        process.exit(1);
      }
      throw err;
    }

    await page.waitForSelector('.query-box textarea', { state: 'visible' });

    // ── Step 1: Landing ──────────────────────────────────────────────────────
    currentStep = 'Step 1 (Landing)';
    console.log('📸 Step 1: Landing page...');

    await page.waitForTimeout(1500);
    await page.fill('.query-box textarea', '');
    await page.screenshot({
      path: path.join(MEDIA_DIR, 'step-1-landing.png'),
      fullPage: false,
    });

    // ── Step 2: Input ────────────────────────────────────────────────────────
    currentStep = 'Step 2 (Input)';
    console.log('📸 Step 2: Query input...');

    await page.fill('.query-box textarea', 'Display top 10 customers');
    await page.waitForTimeout(500);
    await page.screenshot({
      path: path.join(MEDIA_DIR, 'step-2-input.png'),
      fullPage: false,
    });

    // ── Step 3: SQL Preview ──────────────────────────────────────────────────
    currentStep = 'Step 3 (SQL Preview)';
    console.log('📸 Step 3: SQL preview...');

    await page.click('.query-box button');
    await page.waitForSelector('.sql-preview code', {
      state: 'visible',
      timeout: 15000,
    });
    await page.waitForTimeout(1000);
    await page.screenshot({
      path: path.join(MEDIA_DIR, 'step-3-sql-preview.png'),
      fullPage: false,
    });

    // ── Step 4: Results ──────────────────────────────────────────────────────
    currentStep = 'Step 4 (Results)';
    console.log('📸 Step 4: Query results...');

    await page.waitForSelector('table tbody tr:nth-child(3)', {
      state: 'visible',
      timeout: 15000,
    });
    await page.waitForTimeout(1000);
    await page.screenshot({
      path: path.join(MEDIA_DIR, 'step-4-results.png'),
      fullPage: false,
    });

    console.log('\n✅ All screenshots saved to docs/media/');
  } catch (err) {
    if (err.message && err.message.includes('net::ERR_CONNECTION_REFUSED')) {
      console.error(
        `\n❌ Cannot connect to ${BASE_URL} — is the dev server running?\n   Start it with: npm run dev\n`
      );
      process.exit(1);
    }
    console.error(`\n❌ Error during ${currentStep}: ${err.message}`);
    process.exit(1);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
})();
