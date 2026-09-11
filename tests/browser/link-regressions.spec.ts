import { test, expect, type Page } from '@playwright/test';
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
      speedBps: 1000, inBps: i === 0 ? 100 : 820, outBps: 100, sampledAt: now - 895,
    })),
    generatedAt: now, config: { prefixes: [], overrides: {}, staleAfter: 900 },
  };
}

async function load(page: Page, data: Snapshot) {
  await page.route('**/link-snapshot', route => route.fulfill({ json: data }));
  await page.route('**/link-review', route => route.fulfill({ contentType: 'text/html', body:
    '<div id="libremap" data-endpoint="/link-snapshot" data-debug="true" data-host-theme="true" data-home-url="/nms"></div><script type="module" src="/frontend/main.ts"></script>',
  }));
  await page.goto('/link-review');
  await expect(page.locator('.lm-notice')).toContainText('Topology loaded');
}

type DebugLink = { port: string; midpoint: { x: number; y: number }; label: string };
const edges = (page: Page) => page.evaluate(() => (window as unknown as { libremapDebug: () => { links: DebugLink[] } }).libremapDebug().links);
type DebugState = {
  zoom: number;
  nodes: { id: string; renderedPosition: { x: number; y: number }; dimmed: boolean }[];
  links: (DebugLink & { dimmed: boolean; labelBox: { x1: number; x2: number; y1: number; y2: number } })[];
};
const debugState = (page: Page) => page.evaluate(() => (window as unknown as { libremapDebug: () => DebugState }).libremapDebug());
const dimmed = async (page: Page) => {
  const state = await debugState(page);
  return Object.fromEntries([...state.nodes.map(node => [node.id, node.dimmed]), ...state.links.map(link => [link.port, link.dimmed])]);
};
// AGG -> ER -> ER draws both links vertically; the unlinked ER stays outside every focus.
function chain(): Snapshot {
  const data = snapshot();
  data.devices = [
    { id: '1', hostname: 'site1agg1', status: 'up' }, { id: '2', hostname: 'site1er1', status: 'up' },
    { id: '3', hostname: 'site1er2', status: 'up' }, { id: '4', hostname: 'site1er3', status: 'up' },
  ];
  data.links[1] = { ...data.links[1], source: '2', target: '3' };
  return data;
}

test('hovering a link lazily shows both authenticated one-day interface graphs', async ({ page }) => {
  const graphRequests:string[]=[];
  await page.route('**/nms/graph?*',route=>{
    graphRequests.push(route.request().url());
    return route.fulfill({contentType:'image/svg+xml',body:'<svg xmlns="http://www.w3.org/2000/svg" width="300" height="150"></svg>'});
  });
  await load(page,snapshot());
  expect(graphRequests).toEqual([]);
  const edge=(await edges(page)).find(item=>item.port==='local-a')!;
  const bounds=(await page.locator('.lm-canvas').boundingBox())!;
  await page.mouse.move(bounds.x+edge.midpoint.x,bounds.y+edge.midpoint.y);
  const preview=page.getByRole('tooltip');
  await expect(preview).toBeVisible();
  await expect(preview).toContainText('site1agg1');
  await expect(preview).toContainText('local-a');
  await expect(preview).toContainText('site1agg2');
  await expect(preview).toContainText('remote-a');
  await expect(preview.locator('img')).toHaveCount(2);
  await expect.poll(()=>graphRequests.length).toBe(2);
  const urls=graphRequests.map(value=>new URL(value));
  expect(urls.map(url=>url.pathname)).toEqual(['/nms/graph','/nms/graph']);
  expect(urls.map(url=>url.searchParams.get('id')).sort()).toEqual(['1','11']);
  for(const url of urls){
    expect(url.searchParams.get('type')).toBe('port_bits');
    expect(url.searchParams.get('from')).toBe('-1d');
    expect(url.searchParams.get('legend')).toBe('no');
    expect(url.searchParams.get('width')).toBe('300');
    expect(url.searchParams.get('height')).toBe('150');
    expect(url.searchParams.has('refreshnum')).toBe(true);
  }
  await page.screenshot({path:'test-results/libremap-link-preview.png',fullPage:true,animations:'disabled'});
  await page.mouse.move(bounds.x+4,bounds.y+4);
  await expect(preview).toBeHidden();
});

test('parallel lateral links leave room for distinct load labels through refresh and theme changes', async ({ page }) => {
  await load(page, snapshot());
  const before = await edges(page);
  expect(before).toHaveLength(2);
  expect(before.map(edge=>edge.label)).toEqual(['10%','82%']);
  const labelDistance=Math.hypot(before[0].midpoint.x-before[1].midpoint.x,before[0].midpoint.y-before[1].midpoint.y);
  expect(labelDistance).toBeGreaterThanOrEqual(80);
  const bounds = (await page.locator('.lm-canvas').boundingBox())!;
  for (const edge of before) {
    await page.mouse.click(bounds.x + edge.midpoint.x, bounds.y + edge.midpoint.y);
    await expect(page.locator('.lm-details dd').nth(1)).toHaveText(edge.port);
  }
  // Switch theme the way LibreNMS does: toggle `dark` on <html>.
  await page.evaluate(() => document.documentElement.classList.toggle('dark'));
  await expect(page.locator('#libremap')).toHaveClass(/lm-dark/);
  await page.getByRole('button', { name: 'Refresh' }).click();
  await expect(page.locator('.lm-notice')).toContainText('layout unchanged');
  expect((await edges(page)).map(edge => edge.midpoint)).toEqual(before.map(edge => edge.midpoint));
});

test('parallel links between tiers leave room for distinct load labels', async ({ page }) => {
  const data=snapshot();
  data.devices[1].hostname='site1er1';
  await load(page,data);
  const current=await edges(page);
  expect(current.map(edge=>edge.label)).toEqual(['10%','82%']);
  const labelDistance=Math.hypot(current[0].midpoint.x-current[1].midpoint.x,current[0].midpoint.y-current[1].midpoint.y);
  expect(labelDistance).toBeGreaterThanOrEqual(80);
});

test('inspecting a link keeps the selected device in focus, including clicks on its load label', async ({ page }) => {
  await load(page, chain());
  const bounds = (await page.locator('.lm-canvas').boundingBox())!;
  const agg = (await debugState(page)).nodes.find(node => node.id === '1')!;
  await page.mouse.click(bounds.x + agg.renderedPosition.x, bounds.y + agg.renderedPosition.y);
  const focused = { '1': false, '2': false, '3': true, '4': true, 'local-a': false, 'local-b': true };
  expect(await dimmed(page)).toEqual(focused);

  // Zoom in on the AGG's link until its label reaches well past the line's own click tolerance.
  for (let i = 0; i < 20 && (await debugState(page)).zoom < 1.5; i++) {
    const link = (await debugState(page)).links.find(item => item.port === 'local-a')!;
    await page.mouse.move(bounds.x + link.midpoint.x, bounds.y + link.midpoint.y);
    await page.mouse.wheel(0, -50);
  }
  const link = (await debugState(page)).links.find(item => item.port === 'local-a')!;
  await page.mouse.click(bounds.x + link.labelBox.x2 - 3, bounds.y + link.midpoint.y);
  await expect(page.locator('.lm-details .lm-eyebrow')).toHaveText('PHYSICAL LINK');
  await expect(page.locator('.lm-details dd').nth(1)).toHaveText('local-a');
  expect(await dimmed(page)).toEqual(focused);

  // A link beyond the focus joins it with its far device; unrelated devices stay dimmed.
  await page.getByRole('button', { name: 'Fit' }).click();
  const outside = (await debugState(page)).links.find(item => item.port === 'local-b')!;
  await page.mouse.click(bounds.x + outside.midpoint.x, bounds.y + outside.midpoint.y);
  await expect(page.locator('.lm-details dd').nth(1)).toHaveText('local-b');
  expect(await dimmed(page)).toEqual({ ...focused, '3': false, 'local-b': false });
});

test('the highlight hop count widens a selected device focus and persists across reloads', async ({ page }) => {
  await load(page, chain());
  const hops = page.getByLabel('Highlight hops');
  await expect(hops).toHaveValue('1');
  const bounds = (await page.locator('.lm-canvas').boundingBox())!;
  const agg = (await debugState(page)).nodes.find(node => node.id === '1')!;
  await page.mouse.click(bounds.x + agg.renderedPosition.x, bounds.y + agg.renderedPosition.y);
  expect(await dimmed(page)).toEqual({ '1': false, '2': false, '3': true, '4': true, 'local-a': false, 'local-b': true });
  await hops.selectOption('2');
  expect(await dimmed(page)).toEqual({ '1': false, '2': false, '3': false, '4': true, 'local-a': false, 'local-b': false });
  await page.reload();
  await expect(page.locator('.lm-notice')).toContainText('Topology loaded');
  await expect(hops).toHaveValue('2');
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

test('staleness follows the server clock, not a skewed browser clock', async ({ page }) => {
  const data = snapshot();
  // The server's clock runs an hour ahead of this browser's; fresh samples
  // must not read as future-dated (STALE) against the browser's clock.
  data.generatedAt += 3600;
  for (const link of data.links) link.sampledAt = data.generatedAt - 10;
  await load(page, data);
  expect((await edges(page)).map(edge => edge.label)).toEqual(['10%', '82%']);
});
