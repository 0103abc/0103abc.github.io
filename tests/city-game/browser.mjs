import assert from 'node:assert/strict';
import { chromium } from '@playwright/test';

const base = process.env.CITY_GAME_BASE_URL ?? 'http://127.0.0.1:8785';
const browser = await chromium.launch({ headless: true, channel: process.env.CITY_GAME_BROWSER_CHANNEL });
try {
  for (const width of [1440, 390]) {
    const context = await browser.newContext({
      viewport: { width, height: 1000 },
      isMobile: width < 500,
      hasTouch: width < 500,
    });
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', (error) => errors.push(error.message));
    page.on('dialog', (dialog) => dialog.accept());
    await page.goto(`${base}/tools/city-chess/`, { waitUntil: 'networkidle' });
    await page.locator('.city-cell').first().waitFor();
    assert.equal(await page.locator('.city-cell').count(), 289);
    assert.equal(await page.locator('.city-cell.covered').count(), 288);
    assert.ok((await page.locator('.city-cell.covered').first().getAttribute('aria-label')).includes('未翻开'));
    assert.equal(await page.locator('select option').count(), 5);
    await page.locator('select').selectOption('5');
    await page.locator('.city-cell.covered').first().click();
    await page.waitForFunction(() => document.querySelector('.city-status strong')?.textContent?.includes('你的回合'));
    assert.doesNotMatch(await page.locator('.city-status').innerText(), /策略线程不可用/);
    assert.equal(await page.locator('.city-cell.covered').count(), 286, 'worker must respond with a legal reveal');
    assert.doesNotMatch(await page.locator('.city-board').innerText(), /\d/);
    assert.doesNotMatch(await page.locator('.city-cell').first().getAttribute('aria-label'), /\d+分/);
    assert.doesNotMatch(await page.locator('.city-status').innerText(), /\d+分|GDP/);
    const first = await page.locator('.city-cell').first().getAttribute('aria-label');
    await page.getByRole('button', { name: '悔棋 1 次', exact: true }).click();
    assert.equal(await page.locator('.city-cell.covered').count(), 288);
    assert.ok(await page.getByRole('button', { name: '悔棋 已使用' }).isDisabled());
    await page.getByRole('button', { name: '重开本盘', exact: true }).click();
    assert.ok(await page.getByRole('button', { name: '悔棋 已使用' }).isDisabled());
    await page.locator('.city-cell.covered').first().click();
    await page.waitForFunction(() => document.querySelector('.city-status strong')?.textContent?.includes('你的回合'));
    assert.equal(
      await page.locator('.city-cell').first().getAttribute('aria-label'),
      first,
      'replaying a board must retain its city',
    );
    await page.getByRole('button', { name: '随机新局', exact: true }).click();
    assert.equal(await page.locator('.city-cell.covered').count(), 288);
    assert.equal(await page.getByRole('button', { name: '悔棋 1 次', exact: true }).count(), 1);
    assert.equal(await page.locator('.city-roster, .city-data-row, .city-cell small').count(), 0);
    assert.doesNotMatch(await page.locator('.city-board').innerText(), /\d/);
    assert.doesNotMatch(await page.locator('.city-status').innerText(), /\d+分|GDP/);
    const bounds = await page.evaluate(() => ({
      body: document.documentElement.scrollWidth,
      width: innerWidth,
      board: document.querySelector('.city-scroll').scrollWidth,
      container: document.querySelector('.city-scroll').clientWidth,
    }));
    assert.ok(bounds.body <= bounds.width + 2, `body overflow: ${JSON.stringify(bounds)}`);
    if (width < 500) assert.ok(bounds.board > bounds.container, 'mobile board should scroll within its container');
    await page.screenshot({ path: `../city-game-${width}.png`, fullPage: true });
    assert.deepEqual(errors, []);
    console.log(
      `PASS ${width}px: board, hidden labels, five levels, local worker, full-round undo, repeat/random restart, no displayed scores or data tables and contained overflow`,
    );
    await context.close();
  }
} finally {
  await browser.close();
}
