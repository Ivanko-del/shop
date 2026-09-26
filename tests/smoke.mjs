/* Smoke test for the static storefront.
   Serves the repo on a throwaway port and drives it with Chromium: every page
   must render, load its assets, raise no console errors and trip no CSP rule,
   and the three interactive flows must still behave. Exits non-zero on any
   failure so CI can gate on it. */
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const TYPES = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8', '.jpg': 'image/jpeg', '.png': 'image/png',
  '.svg': 'image/svg+xml', '.xml': 'application/xml', '.txt': 'text/plain; charset=utf-8',
  '.json': 'application/json'
};

const server = createServer(async (req, res) => {
  try {
    const path = decodeURIComponent(req.url.split('?')[0]);
    /* normalize first so ../ cannot escape the repo root */
    const file = join(ROOT, normalize(path === '/' ? '/index.html' : path));
    if (!file.startsWith(ROOT)) { res.writeHead(403).end(); return; }
    await stat(file);
    res.writeHead(200, { 'content-type': TYPES[extname(file)] || 'application/octet-stream' });
    res.end(await readFile(file));
  } catch {
    res.writeHead(404, { 'content-type': 'text/plain' }).end('not found');
  }
});

const PAGES = [
  'index.html', 'catalog.html', 'product.html?id=coat', 'cart.html',
  'wishlist.html', 'checkout.html', '404.html'
];

const failures = [];
const check = (ok, label) => {
  console.log(`${ok ? '  ok  ' : ' FAIL '} ${label}`);
  if (!ok) failures.push(label);
};

await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
const base = `http://127.0.0.1:${server.address().port}/`;

const browser = await chromium.launch(
  process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {}
);

try {
  console.log('\n— сторінки —');
  for (const page of PAGES) {
    const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
    const tab = await ctx.newPage();
    const problems = [];
    await tab.addInitScript(() => {
      window.__csp = [];
      document.addEventListener('securitypolicyviolation', e =>
        window.__csp.push(e.violatedDirective));
    });
    tab.on('pageerror', e => problems.push('JS: ' + e.message));
    /* the CDN fonts and icons are not reachable from a CI runner, and their
       absence is not what this test is guarding */
    tab.on('console', m => {
      const text = m.text();
      if (m.type() === 'error' && !/cdnjs|fonts\.googleapis|ERR_|net::/.test(text)) {
        problems.push('console: ' + text);
      }
    });
    tab.on('response', r => {
      if (r.status() >= 400 && new URL(r.url()).host.startsWith('127.0.0.1')) {
        problems.push(`${r.status()} ${r.url().replace(base, '')}`);
      }
    });

    await tab.goto(base + page, { waitUntil: 'load' });
    await tab.waitForTimeout(900);

    const state = await tab.evaluate(() => ({
      csp: [...new Set(window.__csp)],
      broken: [...document.images].filter(i => i.complete && i.naturalWidth === 0).length,
      h1: document.querySelectorAll('h1').length,
      title: document.title,
      canonical: !!document.querySelector('link[rel="canonical"]'),
      og: !!document.querySelector('meta[property="og:image"]')
    }));

    check(problems.length === 0, `${page} — без помилок${problems.length ? ': ' + problems.join('; ') : ''}`);
    check(state.csp.length === 0, `${page} — без порушень CSP${state.csp.length ? ': ' + state.csp.join(',') : ''}`);
    check(state.broken === 0, `${page} — усі зображення завантажились`);
    check(state.h1 === 1, `${page} — рівно один <h1>`);
    check(state.title.length > 5 && state.canonical && state.og, `${page} — title, canonical і og:image на місці`);
    await ctx.close();
  }

  console.log('\n— каталог —');
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 950 } });
  const tab = await ctx.newPage();
  await tab.goto(base + 'catalog.html');
  await tab.waitForTimeout(900);
  const all = await tab.textContent('#catalog-count');
  await tab.click('#catalog-lines button[data-line="access"]');
  await tab.waitForTimeout(400);
  const filtered = await tab.textContent('#catalog-count');
  check(parseInt(filtered) < parseInt(all) && parseInt(filtered) > 0,
    `фільтр звужує вибірку (${all.trim()} → ${filtered.trim()})`);
  check((await tab.url()).includes('line=access'), 'фільтр відображається в URL');

  await tab.goto(base + 'catalog.html?sort=price-asc');
  await tab.waitForTimeout(800);
  const prices = await tab.evaluate(() =>
    [...document.querySelectorAll('#catalog-grid .product-price .now')]
      .map(e => Number(e.textContent.replace(/\D/g, ''))));
  check(prices.length > 0 && prices.every((v, i, a) => i === 0 || a[i - 1] <= v),
    'сортування за ціною працює з URL');

  console.log('\n— кошик і оформлення —');
  await tab.goto(base + 'product.html?id=scarf');
  await tab.waitForTimeout(800);
  await tab.click('#add-to-cart-btn');
  await tab.waitForTimeout(400);
  const units = await tab.textContent('.cart-count');
  check(Number(units) > 0, `додавання в кошик оновлює лічильник (${units})`);

  await tab.goto(base + 'checkout.html');
  await tab.waitForTimeout(800);
  check(!(await tab.evaluate(() => document.getElementById('co-body').classList.contains('is-gone'))),
    'форма оформлення показана при непорожньому кошику');
  await tab.click('button[type="submit"]');
  await tab.waitForTimeout(400);
  const errorCount = await tab.evaluate(() =>
    [...document.querySelectorAll('.field-msg')].filter(e => e.textContent.trim()).length);
  check(errorCount > 0, `порожня форма не відправляється (${errorCount} полів підсвічено)`);
  check(await tab.evaluate(() => document.getElementById('co-done').classList.contains('is-gone')),
    'екран підтвердження не показано без валідних даних');

  console.log('\n— наявність обмежує кількість —');
  await tab.goto(base + 'product.html?id=coat');
  await tab.waitForTimeout(800);
  const capped = await tab.evaluate(() => {
    const plus = document.querySelector('.product-info .qty-plus');
    for (let i = 0; i < 20; i++) plus.click();
    return Number(document.querySelector('.product-info .qty-stepper span').textContent);
  });
  check(capped === 5, `кількість обмежена залишком (${capped} з 5)`);
  await ctx.close();
} finally {
  await browser.close();
  server.close();
}

console.log(`\n${failures.length ? `✗ ${failures.length} перевірок не пройшло` : '✓ усі перевірки пройдено'}`);
process.exit(failures.length ? 1 : 0);
