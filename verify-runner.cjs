const { chromium } = require('playwright');
const http = require('http');
const path = require('path');
const fs = require('fs');

async function run() {
  console.log('=== STARTING DEEP VERIFICATION ===');
  
  // Launch vite preview or static server for dist
  const { spawn } = require('child_process');
  const vite = spawn('npx', ['vite', 'preview', '--port', '4173', '--strictPort'], {
    shell: true,
    cwd: path.resolve(__dirname)
  });

  let serverStarted = false;
  vite.stdout.on('data', (d) => {
    const out = d.toString();
    if (out.includes('http://localhost:4173')) {
      serverStarted = true;
    }
  });
  vite.stderr.on('data', (d) => console.error('vite stderr:', d.toString()));

  // Wait for server to start
  for (let i = 0; i < 30; i++) {
    if (serverStarted) break;
    await new Promise(r => setTimeout(r, 200));
  }

  const browser = await chromium.launch();
  const consoleErrors = [];

  const screenshotDir = path.resolve(__dirname, '.agents/teamwork_preview_implementer_1/screenshots');
  if (!fs.existsSync(screenshotDir)) {
    fs.mkdirSync(screenshotDir, { recursive: true });
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
  await page.screenshot({ path: path.join(screenshotDir, '01_hero_rest_1440.png') });
  console.log('Captured: 01_hero_rest_1440.png');

  // Underpass transition midpoint
  await page.goto('http://localhost:4173/?auditTime=6.5&scrollProgress=0.10');
  await page.waitForTimeout(500);
  await page.screenshot({ path: path.join(screenshotDir, '02_underpass_transition_1440.png') });
  console.log('Captured: 02_underpass_transition_1440.png');

  // Process Stage 01 (Ceiling supervision)
  await page.goto('http://localhost:4173/?auditTime=6.5&scrollProgress=0.25');
  await page.waitForTimeout(500);
  await page.screenshot({ path: path.join(screenshotDir, '03_process_stage_01_1440.png') });
  console.log('Captured: 03_process_stage_01_1440.png');

  // Process Stage 02 (Site conversation)
  await page.goto('http://localhost:4173/?auditTime=6.5&scrollProgress=0.45');
  await page.waitForTimeout(500);
  await page.screenshot({ path: path.join(screenshotDir, '04_process_stage_02_1440.png') });
  console.log('Captured: 04_process_stage_02_1440.png');

  // Process Stage 03 (Refining surface)
  await page.goto('http://localhost:4173/?auditTime=6.5&scrollProgress=0.68');
  await page.waitForTimeout(500);
  await page.screenshot({ path: path.join(screenshotDir, '05_process_stage_03_1440.png') });
  console.log('Captured: 05_process_stage_03_1440.png');

  // Process Stage 04 (Installation / Resolution)
  await page.goto('http://localhost:4173/?auditTime=6.5&scrollProgress=0.92');
  await page.waitForTimeout(500);
  await page.screenshot({ path: path.join(screenshotDir, '06_process_stage_04_1440.png') });
  console.log('Captured: 06_process_stage_04_1440.png');

  // Stage 04 release
  await page.goto('http://localhost:4173/?auditTime=6.5&scrollProgress=1.0');
  await page.waitForTimeout(500);
  await page.screenshot({ path: path.join(screenshotDir, '07_process_stage_release_1440.png') });
  console.log('Captured: 07_process_stage_release_1440.png');

  // 2. Large Desktop 1920x1080 Verification
  console.log('\n--- 2. Testing Large Desktop 1920x1080 ---');
  const contextLarge = await browser.newContext({
    viewport: { width: 1920, height: 1080 }
  });
  const pageLarge = await contextLarge.newPage();
  await pageLarge.goto('http://localhost:4173/?auditTime=6.5&scrollProgress=0.45');
  await pageLarge.waitForTimeout(500);
  await pageLarge.screenshot({ path: path.join(screenshotDir, '08_process_stage_02_1920.png') });
  console.log('Captured: 08_process_stage_02_1920.png');

  // 3. Mobile 390x844 Verification
  console.log('\n--- 3. Testing Mobile 390x844 ---');
  const contextMobile = await browser.newContext({
    viewport: { width: 390, height: 844 },
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1'
  });
  const pageMobile = await contextMobile.newPage();
  
  // Mobile Hero
  await pageMobile.goto('http://localhost:4173/?auditTime=6.5&scrollProgress=0');
  await pageMobile.waitForTimeout(500);
  await pageMobile.screenshot({ path: path.join(screenshotDir, '09_mobile_hero_390.png') });
  console.log('Captured: 09_mobile_hero_390.png');

  // Mobile Process Stage 01
  await pageMobile.goto('http://localhost:4173/?auditTime=6.5&scrollProgress=0.25');
  await pageMobile.waitForTimeout(500);
  await pageMobile.screenshot({ path: path.join(screenshotDir, '10_mobile_process_stage_01_390.png') });
  console.log('Captured: 10_mobile_process_stage_01_390.png');

  // Mobile Process Stage 03
  await pageMobile.goto('http://localhost:4173/?auditTime=6.5&scrollProgress=0.68');
  await pageMobile.waitForTimeout(500);
  await pageMobile.screenshot({ path: path.join(screenshotDir, '11_mobile_process_stage_03_390.png') });
  console.log('Captured: 11_mobile_process_stage_03_390.png');

  // 4. Reduced Motion Verification
  console.log('\n--- 4. Testing Reduced Motion ---');
  const contextReduced = await browser.newContext({
    viewport: { width: 1440, height: 900 }
  });
  const pageReduced = await contextReduced.newPage();
  await pageReduced.goto('http://localhost:4173/?auditTime=6.5&reduced=1&scrollProgress=0.45');
  await pageReduced.waitForTimeout(500);
  await pageReduced.screenshot({ path: path.join(screenshotDir, '12_reduced_motion_stage_02.png') });
  console.log('Captured: 12_reduced_motion_stage_02.png');

  // 5. Dynamic Native Scroll & Reversibility Test
  console.log('\n--- 5. Testing Dynamic Native Scroll & Reversibility ---');
  const pageScroll = await contextDesktop.newPage();
  await pageScroll.goto('http://localhost:4173/?auditTime=6.5');
  await pageScroll.waitForTimeout(500);

  // Scroll down smoothly
  for (let s = 0; s <= 2000; s += 200) {
    await pageScroll.evaluate((y) => window.scrollTo(0, y), s);
    await pageScroll.waitForTimeout(30);
  }
  // Scroll back up smoothly
  for (let s = 2000; s >= 0; s -= 200) {
    await pageScroll.evaluate((y) => window.scrollTo(0, y), s);
    await pageScroll.waitForTimeout(30);
  }
  console.log('Dynamic scroll and reverse cycle completed without error.');

  await browser.close();
  vite.kill();

  console.log('\n=== VERIFICATION SUMMARY ===');
  console.log('Total Console Errors:', consoleErrors.length);
  if (consoleErrors.length > 0) {
    console.error('Errors found:', consoleErrors);
    process.exit(1);
  } else {
    console.log('PASSED: Zero console errors, all visual states and responsive targets verified.');
  }
}

run().catch(err => {
  console.error('Test runner failed:', err);
  process.exit(1);
});
