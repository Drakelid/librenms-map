import { test, expect, type Page } from '@playwright/test';
import type { Core } from 'cytoscape';
import type { Snapshot } from '../../frontend/types';

function snapshot(): Snapshot {
  const now = Math.floor(Date.now() / 1000);
  return {
    devices: [
      { id: '1', hostname: 'site1agg1', status: 'up' },
      { id: '2', hostname: 'site1agg2', status: 'up' },
    ],
    links: ['a', 'b'].map((id, i) => ({
      id, source: '1', target: '2', sourcePortId: String(i + 1), targetPortId: String(i + 11),
      sourcePort: `local-${id}`, targetPort: `remote-${id}`, status: 'up',
      speedBps: 1000, inBps: 100, outBps: 100, sampledAt: now - 895,
    })),
    generatedAt: now, config: { prefixes: [], overrides: {}, staleAfter: 900 },
  };
}

async function load(page: Page, data: Snapshot) {
  await page.route('**/link-snapshot', route => route.fulfill({ json: data }));
  await page.route('**/link-review', route => route.fulfill({ contentType: 'text/html', body:
    '<div id="libremap" data-endpoint="/link-snapshot"></div><script type="module" src="/frontend/main.ts"></script>',
  }));
  await page.goto('/link-review');
  await expect(page.locator('.lm-notice')).toContainText('Topology loaded');
}

const edges = (page: Page) => page.evaluate(() => {
  const cy = (document.querySelector('.lm-canvas') as HTMLElement & { _cyreg: { cy: Core } })._cyreg.cy;
  return cy.edges().map(edge => ({ port: edge.data('sourcePort') as string, midpoint: edge.renderedMidpoint(), label: edge.data('label') as string }));
});

test('parallel lateral links have separate selectable paths through refresh and theme changes', async ({ page }) => {
  await load(page, snapshot());
  const before = await edges(page);
  expect(before).toHaveLength(2);
  expect(before[0].midpoint).not.toEqual(before[1].midpoint);
  const bounds = (await page.locator('.lm-canvas').boundingBox())!;
  for (const edge of before) {
    await page.mouse.click(bounds.x + edge.midpoint.x, bounds.y + edge.midpoint.y);
    await expect(page.locator('.lm-details dd').nth(1)).toHaveText(edge.port);
  }
  await page.getByRole('button', { name: 'Theme' }).click();
  await page.getByRole('button', { name: 'Refresh' }).click();
  await expect(page.locator('.lm-notice')).toContainText('layout unchanged');
  expect((await edges(page)).map(edge => edge.midpoint)).toEqual(before.map(edge => edge.midpoint));
});

test('staleness updates selected details without replacing the focused close button', async ({ page }) => {
  const data = snapshot();
  await page.clock.install({ time: new Date(data.generatedAt * 1000) });
  await load(page, data);
  const edge = (await edges(page))[0];
  const bounds = (await page.locator('.lm-canvas').boundingBox())!;
  await page.mouse.click(bounds.x + edge.midpoint.x, bounds.y + edge.midpoint.y);
  await expect(page.locator('.lm-details dd').first()).toHaveText('10%');
  const close = page.getByRole('button', { name: 'Close details' });
  await close.focus();
  await page.clock.fastForward(11000);
  expect((await edges(page))[0].label).toBe('STALE');
  await expect(page.locator('.lm-details dd').first()).toHaveText('STALE');
  await expect(close).toBeFocused();
});
