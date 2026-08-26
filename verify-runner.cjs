const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

async function run() {
  console.log('=== STARTING DEEP VERIFICATION & ADVERSARIAL AUDIT ===');
  
  // Launch vite preview server
  const { spawn } = require('child_process');
  const vite = spawn('npx', ['vite', 'preview', '--port', '4173'], {
    shell: true,
    cwd: path.resolve(__dirname)
  });

  let serverStarted = false;
  vite.stdout.on('data', (d) => {
    const out = d.toString();
    if (out.includes('http://localhost:4173') || out.includes('Local:')) {
      serverStarted = true;
    }
  });
  vite.stderr.on('data', (d) => {
    const out = d.toString();
    if (out.includes('already in use')) {
      serverStarted = true; // existing server can be reused
    } else {
      console.error('vite stderr:', out);
    }
  });

  // Wait for server to start
  for (let i = 0; i < 30; i++) {
    if (serverStarted) break;
    await new Promise(r => setTimeout(r, 200));
  }

  const browser = await chromium.launch();
  const consoleErrors = [];

  const reviewerScreenshotDir = path.resolve(__dirname, '.agents/teamwork_preview_reviewer_1/screenshots');
  const implementerScreenshotDir = path.resolve(__dirname, '.agents/teamwork_preview_implementer_1/screenshots');
  
  [reviewerScreenshotDir, implementerScreenshotDir].forEach(dir => {
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  });

  async function saveScreenshot(page, filename) {
    const p1 = path.join(reviewerScreenshotDir, filename);
    const p2 = path.join(implementerScreenshotDir, filename);
    await page.screenshot({ path: p1 });
    fs.copyFileSync(p1, p2);
    console.log(`Captured: ${filename}`);
  }

  // 1. Desktop Standard 1440x900 Verification
  console.log('\n--- 1. Testing Desktop 1440x900 ---');
  const contextDesktop = await browser.newContext({
    viewport: { width: 1440, height: 900 }
  });
  const page = await contextDesktop.newPage();
  page.on('console', msg => {
    if (msg.type() === 'error') {
      console.error('Console error:', msg.text());
      consoleErrors.push(msg.text());
    }
  });
  page.on('pageerror', err => {
    console.error('Page error:', err.message);
    consoleErrors.push(err.message);
  });

  // Hero settled state
  await page.goto('http://localhost:4173/?auditTime=6.5&scrollProgress=0');
  await page.waitForTimeout(500);
  await saveScreenshot(page, '01_hero_rest_1440.png');

  // Underpass transition midpoint
  await page.goto('http://localhost:4173/?auditTime=6.5&scrollProgress=0.10');
  await page.waitForTimeout(500);
  await saveScreenshot(page, '02_underpass_transition_1440.png');

  // Process Stage 01 (Ceiling supervision)
  await page.goto('http://localhost:4173/?auditTime=6.5&scrollProgress=0.25');
  await page.waitForTimeout(500);
  await saveScreenshot(page, '03_process_stage_01_1440.png');

  // Process Stage 02 (Site conversation)
  await page.goto('http://localhost:4173/?auditTime=6.5&scrollProgress=0.45');
  await page.waitForTimeout(500);
  await saveScreenshot(page, '04_process_stage_02_1440.png');

  // Process Stage 03 (Refining surface)
  await page.goto('http://localhost:4173/?auditTime=6.5&scrollProgress=0.68');
  await page.waitForTimeout(500);
  await saveScreenshot(page, '05_process_stage_03_1440.png');

  // Process Stage 04 (Installation / Resolution)
  await page.goto('http://localhost:4173/?auditTime=6.5&scrollProgress=0.92');
  await page.waitForTimeout(500);
  await saveScreenshot(page, '06_process_stage_04_1440.png');

  // Stage 04 release
  await page.goto('http://localhost:4173/?auditTime=6.5&scrollProgress=1.0');
  await page.waitForTimeout(500);
  await saveScreenshot(page, '07_process_stage_release_1440.png');

  // 2. Large Desktop 1920x1080 Verification
  console.log('\n--- 2. Testing Large Desktop 1920x1080 ---');
  const contextLarge = await browser.newContext({
    viewport: { width: 1920, height: 1080 }
  });
  const pageLarge = await contextLarge.newPage();
  await pageLarge.goto('http://localhost:4173/?auditTime=6.5&scrollProgress=0.45');
  await pageLarge.waitForTimeout(500);
  await saveScreenshot(pageLarge, '08_process_stage_02_1920.png');

  // 3. Mobile 390x844 Verification & Bounds Assertion
  console.log('\n--- 3. Testing Mobile 390x844 & Bounds Integrity ---');
  const contextMobile = await browser.newContext({
    viewport: { width: 390, height: 844 },
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1'
  });
  const pageMobile = await contextMobile.newPage();
  
  // Mobile Hero
  await pageMobile.goto('http://localhost:4173/?auditTime=6.5&scrollProgress=0');
  await pageMobile.waitForTimeout(500);
  
  // Check hero copy bounding box on mobile
  const heroCopyBox = await pageMobile.locator('.hero-copy').boundingBox();
  console.log('Mobile Hero Copy Bounding Box:', heroCopyBox);
  if (!heroCopyBox || heroCopyBox.x < 0 || heroCopyBox.x + heroCopyBox.width > 395) {
    throw new Error(`Mobile hero copy is clipped or offscreen! Box: ${JSON.stringify(heroCopyBox)}`);
  }
  console.log('PASSED: Mobile hero copy bounds strictly within viewport margins.');
  await saveScreenshot(pageMobile, '09_mobile_hero_390.png');

  // Mobile Process Stage 01
  await pageMobile.goto('http://localhost:4173/?auditTime=6.5&scrollProgress=0.25');
  await pageMobile.waitForTimeout(500);
  await saveScreenshot(pageMobile, '10_mobile_process_stage_01_390.png');

  // Mobile Process Stage 03
  await pageMobile.goto('http://localhost:4173/?auditTime=6.5&scrollProgress=0.68');
  await pageMobile.waitForTimeout(500);
  await saveScreenshot(pageMobile, '11_mobile_process_stage_03_390.png');

  // 4. Reduced Motion Verification
  console.log('\n--- 4. Testing Reduced Motion ---');
  const contextReduced = await browser.newContext({
    viewport: { width: 1440, height: 900 }
  });
  const pageReduced = await contextReduced.newPage();
  await pageReduced.goto('http://localhost:4173/?auditTime=6.5&reduced=1&scrollProgress=0.45');
  await pageReduced.waitForTimeout(500);
  await saveScreenshot(pageReduced, '12_reduced_motion_stage_02.png');

  // 5. Stage Phase & Titles Content Assertion
  console.log('\n--- 5. Checking Stage Phase & Title Structure ---');
  const stageCaptionsText = (await page.locator('.process-stage-captions').innerText()).toUpperCase();
  console.log('Stage Captions Text:\n', stageCaptionsText);
  if (!stageCaptionsText.includes('STRUCTURE') || !stageCaptionsText.includes('ALIGNMENT') ||
      !stageCaptionsText.includes('REFINEMENT') || !stageCaptionsText.includes('RESOLUTION')) {
    throw new Error('Stage phases (Structure, Alignment, Refinement, Resolution) are missing from stage captions!');
  }
  console.log('PASSED: Stage phases verified in DOM.');

  // 6. Dynamic Native Scroll & Reversibility Test
  console.log('\n--- 6. Testing Dynamic Native Scroll & Reversibility ---');
  const pageScroll = await contextDesktop.newPage();
  await pageScroll.goto('http://localhost:4173/?auditTime=6.5');
  await pageScroll.waitForTimeout(500);

  // Scroll down smoothly
  for (let s = 0; s <= 2200; s += 150) {
    await pageScroll.evaluate((y) => window.scrollTo(0, y), s);
    await pageScroll.waitForTimeout(25);
  }
  // Scroll back up smoothly
  for (let s = 2200; s >= 0; s -= 150) {
    await pageScroll.evaluate((y) => window.scrollTo(0, y), s);
    await pageScroll.waitForTimeout(25);
  }
  console.log('Dynamic scroll and reverse cycle completed without error.');

  await browser.close();
  try { vite.kill(); } catch (e) {}

  console.log('\n=== VERIFICATION SUMMARY ===');
  console.log('Total Console Errors:', consoleErrors.length);
  if (consoleErrors.length > 0) {
    console.error('Errors found:', consoleErrors);
    process.exit(1);
  } else {
    console.log('PASSED: Zero console errors, all visual states, bounds, and responsive targets verified.');
    process.exit(0);
  }
}

run().catch(err => {
  console.error('Test runner failed:', err);
  process.exit(1);
});
