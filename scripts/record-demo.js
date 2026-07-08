const { chromium } = require('@playwright/test');
const path = require('path');
const fs = require('fs');
const { execSync } = require('child_process');

// Helper: sleep for ms milliseconds
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

(async () => {
  console.log('🎬 Starting demo recording...');

  // Ensure tmp/ directory exists at repo root
  fs.mkdirSync(path.join(__dirname, '../tmp'), { recursive: true });

  const browser = await chromium.launch({ headless: true });

  try {
    const context = await browser.newContext({
      recordVideo: {
        dir: path.join(__dirname, '../tmp/'),
        size: { width: 1280, height: 720 },
      },
      viewport: { width: 1280, height: 720 },
    });
    const page = await context.newPage();

    // Navigate to app
    try {
      await page.goto('http://localhost:3000');
    } catch (err) {
      if (
        err.message.includes('ECONNREFUSED') ||
        err.message.includes('ERR_CONNECTION_REFUSED') ||
        err.message.includes('net::ERR')
      ) {
        console.error(
          '\n❌ Cannot connect to http://localhost:3000 — is the dev server running?\n' +
          '   Start it with: npm run dev\n'
        );
        process.exit(1);
      }
      throw err;
    }

    // Wait for textarea to be ready
    await page.waitForSelector('.query-box textarea');

    // Clear any pre-filled text
    await page.fill('.query-box textarea', '');

    // 2 s pause — landing visible
    await page.waitForTimeout(2000);

    // Simulate typing the query character by character
    console.log('⌨️  Typing query...');
    const query = 'Display top 10 customers';
    await page.click('.query-box textarea');
    for (const char of query) {
      await page.type('.query-box textarea', char, { delay: 80 });
    }

    // 1 s pause before submit
    await page.waitForTimeout(1000);

    // Click Run button
    await page.click('.query-box button');

    // Wait for SQL preview to appear
    console.log('⏳ Waiting for SQL...');
    await page.waitForSelector('.sql-preview code', { timeout: 15000 });

    // 2 s — SQL panel visible
    await page.waitForTimeout(2000);

    // Wait for results table to populate
    await page.waitForSelector('table tbody tr', { timeout: 15000 });

    // 4 s — results visible
    console.log('📊 Results loaded...');
    await page.waitForTimeout(4000);

    // 1 s — final still frame
    await page.waitForTimeout(1000);

    // Get video path BEFORE closing page (Playwright requires this order)
    const videoPath = await page.video().path();

    // Close page then context to flush the .webm file
    await page.close();
    await context.close();

    // Wait for the .webm file to be written (retry up to 5 times, 500 ms apart)
    let attempts = 0;
    while (!fs.existsSync(videoPath) && attempts < 5) {
      await sleep(500);
      attempts++;
    }

    if (!fs.existsSync(videoPath)) {
      throw new Error(`Video file was not written to ${videoPath} after waiting.`);
    }

    // Convert with FFmpeg via process-video.sh
    console.log('🎞️  Processing video...');
    const outputPath = path.join(__dirname, '../docs/media/demo.mp4');
    fs.mkdirSync(path.dirname(outputPath), { recursive: true });

    const scriptPath = path.join(__dirname, 'process-video.sh');
    execSync(`sh "${scriptPath}" "${videoPath}" "${outputPath}" 20`, {
      stdio: 'inherit',
      cwd: path.join(__dirname, '..'),
    });

    // Clean up raw .webm from tmp/
    fs.unlinkSync(videoPath);

    console.log('✅ Demo video saved to docs/media/demo.mp4');
  } catch (err) {
    // Surface connection errors with a helpful message
    if (
      err.message.includes('ECONNREFUSED') ||
      err.message.includes('ERR_CONNECTION_REFUSED') ||
      err.message.includes('net::ERR')
    ) {
      console.error(
        '\n❌ Cannot connect to http://localhost:3000 — is the dev server running?\n' +
        '   Start it with: npm run dev\n'
      );
      process.exit(1);
    }
    console.error('\n❌ Recording failed:', err.message);
    process.exit(1);
  } finally {
    await browser.close();
  }
})();
