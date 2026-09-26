/* ==========================================================================
   Maison — UI logic and motion
   The catalogue itself lives in data.js, which every page loads first.
   ========================================================================== */

const FREE_SHIPPING_FROM = 2000;
const SHIPPING_FEE = 99;
const MAX_QTY = 10;
const PAGE_SIZE = 8;
const CART_KEY = 'maison-cart';
const WISH_KEY = 'maison-wishlist';
const THEME_KEY = 'maison-theme';
const FILTER_KEY = 'maison-filter';
const PROMO_KEY = 'maison-promo';
const ORDER_KEY = 'maison-last-order';

const PROMOS = { MAISON10: 0.1, ARCHIVE20: 0.2 };

/* ==========================================================================
   Utilities
   ========================================================================== */
const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const canHover = () => window.matchMedia('(hover: hover) and (pointer: fine)').matches;

const ESCAPES = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
/* Every value that reaches innerHTML goes through this. The catalogue is
   trusted, but the search box and localStorage are not.
   CONTRACT: safe for text nodes and quoted attribute values only. It does not
   escape space, '/', '=' or backtick, so never interpolate into an UNQUOTED
   attribute — write class="..." not class=... at every call site. */
function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, ch => ESCAPES[ch]);
}

function formatPrice(n) {
  return Math.round(n).toLocaleString('uk-UA') + ' ₴';
}

function pluralizeReviews(n) {
  const mod10 = n % 10, mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return 'відгук';
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) return 'відгуки';
  return 'відгуків';
}

function pluralizeGoods(n) {
  const mod10 = n % 10, mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return 'товар';
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) return 'товари';
  return 'товарів';
}

/* A bare PRODUCTS[id] would happily return Object.prototype members for
   ?id=__proto__ or ?id=constructor, so the key is checked explicitly. */
function hasProduct(id) {
  return typeof id === 'string' && Object.prototype.hasOwnProperty.call(PRODUCTS, id);
}
function getProduct(id) {
  return hasProduct(id) ? PRODUCTS[id] : null;
}

/* A flat cap would let someone order ten of a coat we have five of, so the
   ceiling is whichever is lower: the per-order limit or what is in stock. */
function maxQty(product) {
  return Math.max(1, Math.min(MAX_QTY, product.stock));
}

function starsHTML(rating) {
  const full = Math.round(rating);
  return '<span class="stars" aria-hidden="true">' + '★'.repeat(full) + '☆'.repeat(5 - full) + '</span>';
}

/* 400w and 800w renders of the same tile; the browser picks by column width */
function productImageHTML(product, sizes, eager) {
  const src = 'assets/products/' + encodeURIComponent(product.id);
  return '<img class="product-img" src="' + src + '-400.jpg" ' +
    'srcset="' + src + '-400.jpg 400w, ' + src + '-800.jpg 800w" ' +
    'sizes="' + sizes + '" width="600" height="800" ' +
    'loading="' + (eager ? 'eager' : 'lazy') + '" decoding="async" ' +
    'alt="' + escapeHTML(product.name) + ' — ' + escapeHTML(product.category.toLowerCase()) + '">';
}

function readJSON(key) {
  try {
    const raw = localStorage.getItem(key);
    return raw === null ? undefined : JSON.parse(raw);
  } catch (e) { return undefined; }
}
function writeJSON(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch (e) { /* quota or private mode */ }
}

function discountPct(product) {
  return Math.round((1 - product.price / product.oldPrice) * 100);
}

function badgeHTML(product) {
  if (product.badge === 'sale' && product.oldPrice) {
    return '<span class="badge badge-sale">-' + discountPct(product) + '%</span>';
  }
  if (product.badge === 'new') return '<span class="badge badge-new">новинка</span>';
  return '';
}

function priceHTML(product) {
  if (product.oldPrice) {
    return '<span class="now">' + formatPrice(product.price) + '</span>' +
           '<span class="old">' + formatPrice(product.oldPrice) + '</span>';
  }
  return '<span class="now">' + formatPrice(product.price) + '</span>';
}

/* The quick-add button sits outside the <a>: a <button> nested inside a link
   is invalid HTML and browsers disagree on which one a click belongs to. */
function productCardHTML(product) {
  const name = escapeHTML(product.name);
  return '<div class="product-card" data-line="' + escapeHTML(product.line) + '" data-reveal="up">' +
    '<a class="product-link" href="product.html?id=' + encodeURIComponent(product.id) + '">' +
      '<div class="product-stage" data-tilt="9">' +
        '<div class="product-media">' +
          productImageHTML(product, '(min-width: 1100px) 22vw, (min-width: 760px) 30vw, 46vw') +
          '<span class="swatch-tag">' + escapeHTML(product.code) + '</span>' +
        '</div>' +
        badgeHTML(product) +
        '<span class="tilt-glare" aria-hidden="true"></span>' +
        '<span class="quick-view">Дивитися модель</span>' +
      '</div>' +
      '<p class="product-cat">' + escapeHTML(product.category) + '</p>' +
      '<p class="product-name">' + name + '</p>' +
      '<p class="product-rating">' + starsHTML(product.rating) +
        '<span>' + product.rating.toFixed(1).replace('.', ',') + '</span>' +
        '<small>(' + product.reviewCount + ')</small></p>' +
      '<p class="product-price price">' + priceHTML(product) + '</p>' +
    '</a>' +
    '<button type="button" class="card-add" data-add="' + escapeHTML(product.id) + '" ' +
      'aria-label="Швидко додати «' + name + '» у кошик"><i class="fa-solid fa-plus" aria-hidden="true"></i></button>' +
    '<button type="button" class="card-wish" data-wish="' + escapeHTML(product.id) + '" ' +
      'aria-label="Додати «' + name + '» в обране" aria-pressed="false">' +
      '<i class="fa-regular fa-heart" aria-hidden="true"></i></button>' +
  '</div>';
}

/* ==========================================================================
   Cart store — the single source of truth, shared across pages
   ========================================================================== */
const DEFAULT_CART = [
  { id: 'jacket', size: 'M', color: 'Чорний', qty: 1 },
  { id: 'shirt', size: 'S', color: 'Білий', qty: 2 }
];

/* Stored carts survive edits by hand and older builds of this file, so every
   line is re-validated against the live catalogue before it is trusted. */
function sanitizeLine(line) {
  if (!line || typeof line !== 'object') return null;
  const product = getProduct(line.id);
  if (!product) return null;
  const qty = Math.trunc(Number(line.qty));
  return {
    id: product.id,
    size: product.sizes.includes(line.size) ? line.size : product.sizes[0],
    color: product.colors.some(c => c.name === line.color) ? line.color : product.colors[0].name,
    qty: Math.min(Math.max(Number.isFinite(qty) ? qty : 1, 1), maxQty(product))
  };
}

function readCart() {
  const stored = readJSON(CART_KEY);
  if (stored === undefined) return DEFAULT_CART.map(sanitizeLine);
  if (!Array.isArray(stored)) return [];
  return stored.slice(0, 40).map(sanitizeLine).filter(Boolean);
}

function writeCart(lines) {
  writeJSON(CART_KEY, lines);
  syncCartCount(lines);
}

function cartUnits(lines) {
  return lines.reduce((sum, line) => sum + line.qty, 0);
}

function syncCartCount(lines) {
  const units = cartUnits(lines || readCart());
  document.querySelectorAll('.cart-count').forEach(el => {
    el.classList.toggle('is-gone', units === 0);
    if (el.textContent === String(units)) return;
    el.textContent = String(units);
    el.classList.remove('bump');
    void el.offsetWidth;
    el.classList.add('bump');
  });
}

function addToCart(id, size, color, qty) {
  const line = sanitizeLine({ id: id, size: size, color: color, qty: qty });
  if (!line) return null;
  const cart = readCart();
  const match = cart.find(l => l.id === line.id && l.size === line.size && l.color === line.color);
  if (match) match.qty = Math.min(match.qty + line.qty, maxQty(PRODUCTS[line.id]));
  else cart.push(line);
  writeCart(cart);
  if (document.getElementById('cart-items')) { cartState = cart; renderCart(); }
  return line;
}

function readWishlist() {
  const stored = readJSON(WISH_KEY);
  return Array.isArray(stored) ? stored.filter(hasProduct).slice(0, 60) : [];
}

function writeWishlist(list) {
  writeJSON(WISH_KEY, list);
  syncWishCount(list);
}

function syncWishCount(list) {
  const n = (list || readWishlist()).length;
  document.querySelectorAll('.wish-count').forEach(el => {
    el.classList.toggle('is-gone', n === 0);
    if (el.textContent === String(n)) return;
    el.textContent = String(n);
    el.classList.remove('bump');
    void el.offsetWidth;
    el.classList.add('bump');
  });
}

function toggleWish(id) {
  if (!hasProduct(id)) return false;
  const list = readWishlist();
  const at = list.indexOf(id);
  if (at === -1) list.push(id); else list.splice(at, 1);
  writeWishlist(list);
  paintWishButtons();
  return at === -1;
}

/* Cards are re-rendered by filters and by other pages, so the pressed state
   is painted from the store rather than tracked per button. */
function paintWishButtons() {
  const list = readWishlist();
  document.querySelectorAll('[data-wish]').forEach(btn => {
    const on = list.includes(btn.dataset.wish);
    btn.classList.toggle('active', on);
    btn.setAttribute('aria-pressed', String(on));
    const icon = btn.querySelector('i');
    if (icon) icon.className = (on ? 'fa-solid' : 'fa-regular') + ' fa-heart';
  });
}

function initWishButtons() {
  document.addEventListener('click', e => {
    const btn = e.target.closest('[data-wish]');
    if (!btn) return;
    e.preventDefault();
    e.stopPropagation();
    const product = getProduct(btn.dataset.wish);
    if (!product) return;
    showToast(toggleWish(product.id)
      ? product.name + ' — в обраному'
      : product.name + ' — прибрано з обраного');
  });
}

/* ==========================================================================
   Theme
   ========================================================================== */
function initTheme() {
  const syncIcon = () => {
    const dark = document.documentElement.getAttribute('data-theme') === 'dark';
    document.querySelectorAll('.theme-toggle').forEach(btn => {
      const icon = btn.querySelector('i');
      if (icon) icon.className = dark ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
      btn.setAttribute('aria-label', dark ? 'Увімкнути світлу тему' : 'Увімкнути темну тему');
      btn.setAttribute('aria-pressed', String(dark));
    });
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', dark ? '#121210' : '#F6F4EF');
  };

  syncIcon();
  document.querySelectorAll('.theme-toggle').forEach(btn => {
    btn.addEventListener('click', () => {
      const dark = document.documentElement.getAttribute('data-theme') === 'dark';
      if (dark) document.documentElement.removeAttribute('data-theme');
      else document.documentElement.setAttribute('data-theme', 'dark');
      try { localStorage.setItem(THEME_KEY, dark ? 'light' : 'dark'); } catch (e) {}
      syncIcon();
    });
  });
}

/* ==========================================================================
   Motion — scroll reveal, pointer tilt, counters, chrome
   ========================================================================== */
let revealObserver = null;

function armReveal(root) {
  (root || document).querySelectorAll('[data-reveal]:not([data-reveal-armed])').forEach(el => {
    el.setAttribute('data-reveal-armed', '');

    const group = el.parentElement && el.parentElement.hasAttribute('data-stagger') ? el.parentElement : null;
    if (group && !el.style.getPropertyValue('--reveal-delay') && !/\brd-\d\b/.test(el.className)) {
      const index = Array.prototype.indexOf.call(group.querySelectorAll('[data-reveal]'), el);
      el.style.setProperty('--reveal-delay', (index % 8) * 0.07 + 's');
    }

    if (revealObserver) revealObserver.observe(el);
    else el.classList.add('is-revealed');
  });
}

function initReveal() {
  if (reducedMotion() || !('IntersectionObserver' in window)) {
    document.querySelectorAll('[data-reveal]').forEach(el => el.classList.add('is-revealed'));
    return;
  }
  revealObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-revealed');
      obs.unobserve(entry.target);
    });
    /* threshold 0: an element counts the moment its edge crosses the
       shrunken root, so a fast flick-scroll can't skip past one */
  }, { rootMargin: '0px 0px -12% 0px', threshold: 0 });

  armReveal(document);
}

/* Pointer tilt. Touch pointers are skipped: a tap would leave a card frozen
   at an angle with no pointerleave to reset it. */
function armTilt(root) {
  if (reducedMotion() || !canHover()) return;
  (root || document).querySelectorAll('[data-tilt]:not([data-tilt-armed])').forEach(el => {
    el.setAttribute('data-tilt-armed', '');
    const max = Math.min(Math.abs(parseFloat(el.dataset.tilt) || 8), 20);
    let frame = 0;

    el.addEventListener('pointerenter', e => {
      if (e.pointerType === 'touch') return;
      el.classList.add('tilting');
    });

    el.addEventListener('pointermove', e => {
      if (e.pointerType === 'touch' || !el.classList.contains('tilting')) return;
      const rect = el.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      const px = (e.clientX - rect.left) / rect.width - 0.5;
      const py = (e.clientY - rect.top) / rect.height - 0.5;
      if (frame) cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        frame = 0;
        el.style.transform = 'rotateY(' + (px * max * 2).toFixed(2) + 'deg) rotateX(' +
          (-py * max * 2).toFixed(2) + 'deg)';
        el.style.setProperty('--glare-x', ((px + 0.5) * 100).toFixed(1) + '%');
        el.style.setProperty('--glare-y', ((py + 0.5) * 100).toFixed(1) + '%');
      });
    });

    const reset = () => {
      if (frame) { cancelAnimationFrame(frame); frame = 0; }
      el.classList.remove('tilting');
      el.style.transform = '';
    };
    el.addEventListener('pointerleave', reset);
    el.addEventListener('pointercancel', reset);
  });
}

function initScrollChrome() {
  const header = document.getElementById('site-header');
  const progress = document.getElementById('scroll-progress');
  const toTop = document.getElementById('to-top');
  let queued = false;

  const update = () => {
    queued = false;
    const y = window.scrollY;
    if (header) header.classList.toggle('is-stuck', y > 12);
    if (progress) {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      progress.style.transform = 'scaleX(' + (max > 0 ? Math.min(y / max, 1) : 0) + ')';
    }
    if (toTop) toTop.classList.toggle('show', y > 700);
  };

  window.addEventListener('scroll', () => {
    if (queued) return;
    queued = true;
    requestAnimationFrame(update);
  }, { passive: true });
  update();

  if (toTop) {
    toTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: reducedMotion() ? 'auto' : 'smooth' });
    });
  }
}

function initCounters() {
  const nodes = document.querySelectorAll('[data-count]');
  if (!nodes.length) return;

  const render = (el, value) => {
    const decimals = el.dataset.count.includes('.') ? 1 : 0;
    const suffix = el.dataset.suffix || '';
    el.innerHTML = escapeHTML(value.toFixed(decimals).replace('.', ',')) +
      (suffix ? '<small>' + escapeHTML(suffix) + '</small>' : '');
  };

  /* the markup already carries the final figures, so no-JS and
     reduced-motion readers see real numbers, not a row of zeros */
  if (reducedMotion() || !('IntersectionObserver' in window)) return;
  nodes.forEach(el => render(el, 0));

  const run = el => {
    const target = parseFloat(el.dataset.count);
    const duration = 1400;
    const start = performance.now();
    const step = now => {
      const t = Math.min((now - start) / duration, 1);
      render(el, target * (1 - Math.pow(1 - t, 3)));
      if (t < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };

  const obs = new IntersectionObserver((entries, o) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      run(entry.target);
      o.unobserve(entry.target);
    });
  }, { threshold: 0.5 });
  nodes.forEach(el => obs.observe(el));
}

function initHeroGlow() {
  const hero = document.querySelector('.hero');
  if (!hero || reducedMotion() || !canHover()) return;
  hero.addEventListener('pointermove', e => {
    const rect = hero.getBoundingClientRect();
    hero.style.setProperty('--glow-x', (e.clientX - rect.left) + 'px');
    hero.style.setProperty('--glow-y', (e.clientY - rect.top) + 'px');
  });
}

/* ==========================================================================
   Navigation
   ========================================================================== */
function initMobileMenu() {
  const toggle = document.querySelector('.menu-toggle');
  const menu = document.getElementById('mobile-menu');
  const close = document.querySelector('.mobile-menu-close');
  if (!toggle || !menu) return;

  const open = () => {
    menu.classList.add('open');
    document.body.classList.add('modal-open');
    toggle.setAttribute('aria-expanded', 'true');
    if (close) close.focus();
  };
  const shut = () => {
    if (!menu.classList.contains('open')) return;
    menu.classList.remove('open');
    document.body.classList.remove('modal-open');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.focus();
  };

  toggle.addEventListener('click', open);
  if (close) close.addEventListener('click', shut);
  menu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    menu.classList.remove('open');
    document.body.classList.remove('modal-open');
    toggle.setAttribute('aria-expanded', 'false');
  }));
  menu.addEventListener('keydown', e => {
    if (e.key === 'Escape') shut();
    if (e.key === 'Tab') trapFocus(menu, e);
  });
}

/* ==========================================================================
   Home page
   ========================================================================== */
function renderBestsellers() {
  const grid = document.getElementById('bestsellers-grid');
  if (!grid) return;
  const order = ['shirt', 'jacket', 'coat', 'dress', 'trousers', 'shoes', 'bag', 'scarf'];
  grid.innerHTML = order.map(id => productCardHTML(PRODUCTS[id])).join('');
  armReveal(grid);
  armTilt(grid);

  const tabs = document.getElementById('filter-tabs');
  if (!tabs) return;

  const apply = (filter, animate) => {
    tabs.querySelectorAll('button').forEach(b => {
      const on = b.dataset.filter === filter;
      b.classList.toggle('active', on);
      b.setAttribute('aria-pressed', String(on));
    });
    let shown = 0;
    grid.querySelectorAll('.product-card').forEach(card => {
      const match = filter === 'all' || card.dataset.line === filter;
      card.classList.toggle('is-hidden', !match);
      if (!match) return;
      if (animate) {
        /* replay the reveal so a freshly filtered grid animates in again */
        card.classList.remove('is-revealed');
        card.style.setProperty('--reveal-delay', (shown % 8) * 0.05 + 's');
        requestAnimationFrame(() => card.classList.add('is-revealed'));
      }
      shown += 1;
    });
    try { sessionStorage.setItem(FILTER_KEY, filter); } catch (e) {}
  };

  tabs.addEventListener('click', e => {
    const btn = e.target.closest('button');
    if (btn) apply(btn.dataset.filter, !reducedMotion());
  });

  let saved = 'all';
  try { saved = sessionStorage.getItem(FILTER_KEY) || 'all'; } catch (e) {}
  if (tabs.querySelector('[data-filter="' + CSS.escape(saved) + '"]')) apply(saved, false);
}

function initCountdown() {
  const root = document.getElementById('promo-countdown');
  if (!root) return;
  const units = ['days', 'hours', 'minutes', 'seconds']
    .map(u => [u, root.querySelector('[data-unit="' + u + '"]')]);
  if (units.some(([, el]) => !el)) return;

  /* always ends at the next midnight seven days out, so the demo never expires */
  const end = new Date();
  end.setHours(0, 0, 0, 0);
  end.setDate(end.getDate() + 7);

  const pad = n => String(n).padStart(2, '0');
  const tick = () => {
    const s = Math.floor(Math.max(end - Date.now(), 0) / 1000);
    const values = { days: Math.floor(s / 86400), hours: Math.floor(s / 3600) % 24,
      minutes: Math.floor(s / 60) % 60, seconds: s % 60 };
    units.forEach(([u, el]) => { el.textContent = pad(values[u]); });
  };
  tick();
  setInterval(tick, 1000);
}

/* ==========================================================================
   Shared controls
   ========================================================================== */
function initQtyStepper(stepper, ceiling) {
  if (!stepper) return;
  const display = stepper.querySelector('span');
  const minus = stepper.querySelector('.qty-minus');
  const plus = stepper.querySelector('.qty-plus');
  if (!display || !minus || !plus) return;
  const top = Math.max(1, Math.min(ceiling || MAX_QTY, MAX_QTY));
  let qty = Math.min(Math.max(Number(display.textContent) || 1, 1), top);
  if (Number(display.textContent) !== qty) display.textContent = String(qty);

  const set = next => {
    qty = next;
    display.textContent = String(qty);
    minus.disabled = qty <= 1;
    plus.disabled = qty >= top;
    display.classList.remove('bump');
    void display.offsetWidth;
    display.classList.add('bump');
    stepper.dispatchEvent(new CustomEvent('qtychange'));
  };

  minus.disabled = qty <= 1;
  plus.disabled = qty >= top;
  minus.addEventListener('click', () => { if (qty > 1) set(qty - 1); });
  plus.addEventListener('click', () => { if (qty < top) set(qty + 1); });
}

function initQuickAdd() {
  document.addEventListener('click', e => {
    const btn = e.target.closest('[data-add]');
    if (!btn) return;
    e.preventDefault();
    e.stopPropagation();
    const product = getProduct(btn.dataset.add);
    if (!product) return;
    addToCart(product.id, product.sizes[0], product.colors[0].name, 1);
    showToast(product.name + ' — у кошику', {
      label: 'До кошика',
      onAction: () => { window.location.href = 'cart.html'; }
    });
  });
}

/* ==========================================================================
   Product page
   ========================================================================== */
function initProductPage() {
  const root = document.querySelector('.product-detail');
  if (!root) return;

  const requested = new URLSearchParams(window.location.search).get('id');
  const product = getProduct(requested) || PRODUCTS.jacket;

  document.title = product.name + ' — Maison';
  document.getElementById('breadcrumb-category').textContent = product.category;
  document.getElementById('breadcrumb-name').textContent = product.name;

  /* One rendered tile per product, shown whole and then as three crops.
     Honest about what it is: these are framings of the same shot, not
     four separate photographs. */
  const VIEWS = [
    { key: 'full', label: 'Загальний вигляд' },
    { key: 'top', label: 'Верх виробу' },
    { key: 'hem', label: 'Низ і оздоблення' },
    { key: 'weave', label: 'Фактура тканини' }
  ];
  const gallery = document.getElementById('gallery-main');
  const thumbRow = document.querySelector('.gallery-thumbs');
  const src = 'assets/products/' + encodeURIComponent(product.id);

  if (gallery) {
    gallery.innerHTML =
      '<img class="gallery-img view-full" id="gallery-img" src="' + src + '-800.jpg" ' +
        'srcset="' + src + '-400.jpg 400w, ' + src + '-800.jpg 800w" ' +
        'sizes="(min-width: 900px) 46vw, 92vw" width="600" height="800" ' +
        'decoding="async" alt="' + escapeHTML(product.name) + ' — загальний вигляд">' +
      '<span class="swatch-tag" id="gallery-tag">' + escapeHTML(product.code) + '</span>' +
      '<span class="tilt-glare" aria-hidden="true"></span>';
  }
  if (thumbRow) {
    thumbRow.innerHTML = VIEWS.map((v, i) =>
      '<button type="button" class="gallery-thumb' + (i === 0 ? ' active' : '') + '" ' +
        'data-view="' + v.key + '" aria-pressed="' + (i === 0) + '" aria-label="' + v.label + '">' +
        '<img src="' + src + '-400.jpg" class="view-' + v.key + '" width="600" height="800" ' +
          'loading="lazy" decoding="async" alt=""></button>').join('');
  }

  const main = gallery;
  const mainImg = document.getElementById('gallery-img');
  const thumbs = document.querySelectorAll('.gallery-thumbs button');
  thumbs.forEach(thumb => {
    thumb.addEventListener('click', () => {
      thumbs.forEach(t => { t.classList.remove('active'); t.setAttribute('aria-pressed', 'false'); });
      thumb.classList.add('active');
      thumb.setAttribute('aria-pressed', 'true');
      if (!mainImg) return;
      const view = VIEWS.find(v => v.key === thumb.dataset.view) || VIEWS[0];
      mainImg.className = 'gallery-img view-' + view.key;
      mainImg.alt = product.name + ' — ' + view.label.toLowerCase();
      main.classList.remove('swap');
      void main.offsetWidth;
      main.classList.add('swap');
    });
  });

  /* pointer spotlight over the main gallery tile */
  if (main && !reducedMotion() && canHover()) {
    main.addEventListener('pointermove', e => {
      const rect = main.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      main.style.setProperty('--mx', ((e.clientX - rect.left) / rect.width) * 100 + '%');
      main.style.setProperty('--my', ((e.clientY - rect.top) / rect.height) * 100 + '%');
    });
  }

  document.getElementById('product-badge-row').innerHTML = badgeHTML(product);
  document.getElementById('product-name').textContent = product.name;
  const stockNote = document.getElementById('stock-note');
  stockNote.textContent = product.stock <= 6
    ? 'Залишилось ' + product.stock + ' шт. · ' + product.material
    : 'У наявності: ' + product.stock + ' шт. · ' + product.material;
  stockNote.closest('.stock-note').classList.toggle('is-low', product.stock <= 6);

  document.getElementById('price-now').textContent = formatPrice(product.price);
  const priceOld = document.getElementById('price-old');
  const priceSave = document.getElementById('price-save');
  if (product.oldPrice) {
    priceOld.textContent = formatPrice(product.oldPrice);
    priceOld.hidden = false;
    priceSave.textContent = 'економія ' + formatPrice(product.oldPrice - product.price);
    priceSave.hidden = false;
  } else {
    priceOld.hidden = true;
    priceSave.hidden = true;
  }

  document.getElementById('product-desc').textContent = product.desc;
  document.getElementById('care-text').textContent = product.care;
  document.getElementById('shipping-text').textContent = product.shipping;
  document.getElementById('fit-text').textContent = product.fit;

  const sizeList = document.getElementById('size-list');
  sizeList.textContent = '';
  product.sizes.forEach((size, i) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.textContent = size;
    btn.setAttribute('aria-pressed', String(i === 0));
    if (i === 0) btn.classList.add('active');
    sizeList.appendChild(btn);
  });
  sizeList.addEventListener('click', e => {
    const btn = e.target.closest('button');
    if (!btn) return;
    sizeList.querySelectorAll('button').forEach(b => {
      b.classList.toggle('active', b === btn);
      b.setAttribute('aria-pressed', String(b === btn));
    });
  });

  /* built with DOM APIs rather than an innerHTML string: the swatch colour
     is a style attribute, which the page's CSP does not allow in markup */
  const colorList = document.getElementById('color-list');
  colorList.textContent = '';
  product.colors.forEach((color, i) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.setAttribute('aria-pressed', String(i === 0));
    if (i === 0) btn.classList.add('active');
    const dot = document.createElement('span');
    dot.className = 'color-dot';
    dot.setAttribute('aria-hidden', 'true');
    dot.style.background = color.hex;
    btn.append(dot, document.createTextNode(color.name));
    colorList.appendChild(btn);
  });
  colorList.addEventListener('click', e => {
    const btn = e.target.closest('button');
    if (!btn) return;
    colorList.querySelectorAll('button').forEach(b => {
      b.classList.toggle('active', b === btn);
      b.setAttribute('aria-pressed', String(b === btn));
    });
  });

  initQtyStepper(document.querySelector('.product-info .qty-stepper'), maxQty(product));

  const chosenQty = () => {
    const el = document.querySelector('.product-info .qty-stepper span');
    return el ? Math.min(Math.max(Number(el.textContent) || 1, 1), MAX_QTY) : 1;
  };
  const chosenSize = () => {
    const el = sizeList.querySelector('button.active');
    return el ? el.textContent : product.sizes[0];
  };
  const chosenColor = () => {
    const el = colorList.querySelector('button.active');
    return el ? el.textContent.trim() : product.colors[0].name;
  };

  const shipHint = document.getElementById('ship-hint-text');
  const updateShipHint = () => {
    if (!shipHint) return;
    const inCart = readCart().reduce((sum, l) => sum + PRODUCTS[l.id].price * l.qty, 0);
    const projected = inCart + product.price * chosenQty();
    shipHint.textContent = projected >= FREE_SHIPPING_FROM
      ? 'Це замовлення вже з безкоштовною доставкою'
      : 'Ще ' + formatPrice(FREE_SHIPPING_FROM - projected) + ' до безкоштовної доставки';
  };
  const stepper = document.querySelector('.product-info .qty-stepper');
  if (stepper) stepper.addEventListener('qtychange', updateShipHint);
  updateShipHint();

  const addBtn = document.getElementById('add-to-cart-btn');
  const addNote = document.getElementById('add-note');
  const addLabel = addBtn.textContent;
  let resetTimer = null;

  const add = () => {
    const qty = chosenQty();
    const line = addToCart(product.id, chosenSize(), chosenColor(), qty);
    if (!line) return;
    addNote.textContent = 'Додано · ' + line.size + ' · ' + line.color + ' · ' + qty + ' шт.';
    addNote.classList.add('show');
    addBtn.innerHTML = 'Додано <i class="fa-solid fa-check" aria-hidden="true"></i>';
    updateShipHint();
    showToast(product.name + ' — у кошику', {
      label: 'До кошика',
      onAction: () => { window.location.href = 'cart.html'; }
    });
    clearTimeout(resetTimer);
    resetTimer = setTimeout(() => {
      addBtn.textContent = addLabel;
      addNote.classList.remove('show');
    }, 2800);
  };

  addBtn.addEventListener('click', add);

  /* sticky buy bar, shown once the real purchase row scrolls away */
  const bar = document.getElementById('buy-bar');
  const purchaseRow = document.querySelector('.purchase-row');
  if (bar && purchaseRow) {
    document.getElementById('buy-bar-name').textContent = product.name;
    document.getElementById('buy-bar-price').textContent = formatPrice(product.price);
    document.getElementById('buy-bar-btn').addEventListener('click', add);
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(entries => {
        entries.forEach(entry => {
          bar.classList.toggle('show', !entry.isIntersecting && entry.boundingClientRect.top < 0);
        });
      }, { threshold: 0 }).observe(purchaseRow);
    }
  }

  document.querySelectorAll('.accordion-trigger').forEach(trigger => {
    trigger.addEventListener('click', () => {
      const item = trigger.closest('.accordion-item');
      const wasOpen = item.classList.contains('open');
      document.querySelectorAll('.accordion-item').forEach(other => {
        other.classList.remove('open');
        const t = other.querySelector('.accordion-trigger');
        if (t) t.setAttribute('aria-expanded', 'false');
      });
      item.classList.toggle('open', !wasOpen);
      trigger.setAttribute('aria-expanded', String(!wasOpen));
    });
  });

  const wishBtn = document.getElementById('wishlist-btn');
  if (wishBtn) {
    const paint = list => {
      const active = list.includes(product.id);
      const icon = wishBtn.querySelector('i');
      if (icon) icon.className = (active ? 'fa-solid' : 'fa-regular') + ' fa-heart';
      wishBtn.classList.toggle('active', active);
      wishBtn.setAttribute('aria-pressed', String(active));
      wishBtn.setAttribute('aria-label', active ? 'Видалити з обраного' : 'Додати в обране');
      return active;
    };
    paint(readWishlist());
    wishBtn.addEventListener('click', () => {
      const list = readWishlist();
      const at = list.indexOf(product.id);
      if (at === -1) list.push(product.id);
      else list.splice(at, 1);
      writeJSON(WISH_KEY, list);
      showToast(paint(list) ? 'Додано в обране' : 'Видалено з обраного');
    });
  }

  const reviewRoot = document.getElementById('reviews');
  if (reviewRoot && product.reviews.length) {
    document.getElementById('review-score').textContent = product.rating.toFixed(1).replace('.', ',');
    document.getElementById('review-stars').innerHTML = starsHTML(product.rating);
    document.getElementById('review-count').textContent =
      product.reviewCount + ' ' + pluralizeReviews(product.reviewCount);

    /* bar chart of the star split, derived from the sample so it always
       matches the reviews actually printed underneath */
    const split = [5, 4, 3, 2, 1].map(star => {
      const n = product.reviews.filter(r => r.stars === star).length;
      return { star, pct: Math.round((n / product.reviews.length) * 100) };
    });
    /* built through the DOM: a style attribute in an innerHTML string is
       markup, and the page's CSP does not allow inline styles */
    const bars = document.getElementById('review-bars');
    bars.textContent = '';
    split.forEach(row => {
      const wrap = document.createElement('div');
      wrap.className = 'review-bar';
      const star = document.createElement('span');
      star.textContent = row.star + '★';
      const track = document.createElement('div');
      track.className = 'review-bar-track';
      const fill = document.createElement('div');
      fill.style.width = row.pct + '%';
      track.appendChild(fill);
      const pct = document.createElement('small');
      pct.textContent = row.pct + '%';
      wrap.append(star, track, pct);
      bars.appendChild(wrap);
    });

    document.getElementById('review-list').innerHTML = product.reviews.map(r =>
      '<figure class="review" data-reveal="up">' +
        starsHTML(r.stars) +
        '<blockquote>' + escapeHTML(r.text) + '</blockquote>' +
        '<figcaption><span class="quote-avatar">' + escapeHTML(r.author.slice(0, 1)) + '</span>' +
        '<div><p>' + escapeHTML(r.author) + '</p><small>' + escapeHTML(r.city) + '</small></div>' +
        '</figcaption></figure>').join('');
    armReveal(reviewRoot);
  } else if (reviewRoot) {
    reviewRoot.classList.add('is-gone');
  }

  const relatedGrid = document.getElementById('related-grid');
  if (relatedGrid) {
    const pool = Object.values(PRODUCTS).filter(p => p.id !== product.id);
    const sameLine = pool.filter(p => p.category === product.category);
    const others = [...sameLine, ...pool.filter(p => !sameLine.includes(p))].slice(0, 4);
    relatedGrid.innerHTML = others.map(productCardHTML).join('');
    armReveal(relatedGrid);
    armTilt(relatedGrid);
  }
}

/* ==========================================================================
   Cart page
   ========================================================================== */
let cartState = [];
let cartDiscount = 0;

/* The cart survives a reload, so the discount applied to it has to as well —
   otherwise the total silently changes when the page comes back. */
function readPromo() {
  const code = readJSON(PROMO_KEY);
  return typeof code === 'string' && Object.prototype.hasOwnProperty.call(PROMOS, code) ? code : '';
}
function applyPromo(code) {
  const clean = String(code || '').trim().toUpperCase();
  const known = Object.prototype.hasOwnProperty.call(PROMOS, clean);
  cartDiscount = known ? PROMOS[clean] : 0;
  if (known) writeJSON(PROMO_KEY, clean);
  else { try { localStorage.removeItem(PROMO_KEY); } catch (e) {} }
  return known ? clean : '';
}

function cartLineHTML(line, index) {
  const product = PRODUCTS[line.id];
  const name = escapeHTML(product.name);
  const href = 'product.html?id=' + encodeURIComponent(product.id);
  return '<div class="cart-line" data-index="' + index + '" data-reveal="up">' +
    '<a class="cart-line-media swatch" href="' + href + '" tabindex="-1" aria-hidden="true">' +
      '<i class="' + escapeHTML(product.icon) + '" aria-hidden="true"></i></a>' +
    '<div>' +
      '<div class="cart-line-top">' +
        '<div>' +
          '<p class="cart-line-name"><a href="' + href + '">' + name + '</a></p>' +
          '<p class="cart-line-meta">' + escapeHTML(product.code) + ' · Розмір ' +
            escapeHTML(line.size) + ' · ' + escapeHTML(line.color) + '</p>' +
        '</div>' +
        '<button type="button" class="remove-btn" aria-label="Видалити «' + name + '» з кошика">' +
          '<i class="fa-solid fa-trash" aria-hidden="true"></i></button>' +
      '</div>' +
      '<div class="cart-line-bottom">' +
        '<div class="qty-stepper">' +
          '<button type="button" class="qty-minus" aria-label="Зменшити кількість «' + name + '»">−</button>' +
          '<span>' + line.qty + '</span>' +
          '<button type="button" class="qty-plus" aria-label="Збільшити кількість «' + name + '»">+</button>' +
        '</div>' +
        '<span class="cart-line-total price">' + formatPrice(product.price * line.qty) + '</span>' +
      '</div>' +
    '</div>' +
  '</div>';
}

function renderCart() {
  const list = document.getElementById('cart-items');
  if (!list) return;

  list.innerHTML = cartState.map(cartLineHTML).join('');
  armReveal(list);

  list.querySelectorAll('.cart-line').forEach(el => {
    const index = Number(el.dataset.index);
    const stepper = el.querySelector('.qty-stepper');
    initQtyStepper(stepper, maxQty(PRODUCTS[cartState[index].id]));
    stepper.addEventListener('qtychange', () => {
      const qty = Number(stepper.querySelector('span').textContent);
      cartState[index].qty = qty;
      writeCart(cartState);
      el.querySelector('.cart-line-total').textContent =
        formatPrice(PRODUCTS[cartState[index].id].price * qty);
      recalcSummary();
    });
    el.querySelector('.remove-btn').addEventListener('click', () => removeCartLine(index, el));
  });

  recalcSummary();
}

function removeCartLine(index, el) {
  const line = cartState[index];
  if (!line) return;
  const name = PRODUCTS[line.id].name;

  const commit = () => {
    cartState.splice(index, 1);
    writeCart(cartState);
    renderCart();
    showToast(name + ' — видалено з кошика', {
      label: 'Відмінити',
      onAction: () => {
        cartState.splice(Math.min(index, cartState.length), 0, line);
        writeCart(cartState);
        renderCart();
        showToast(name + ' — повернуто в кошик');
      }
    });
  };

  el.style.maxHeight = el.scrollHeight + 'px';
  el.classList.add('removing');
  if (reducedMotion()) commit();
  else el.addEventListener('animationend', commit, { once: true });
}

function recalcSummary() {
  const list = document.getElementById('cart-items');
  const empty = document.getElementById('cart-empty');
  const summary = document.getElementById('order-summary');
  const countLabel = document.getElementById('cart-item-count');
  const units = cartUnits(cartState);

  if (countLabel) {
    countLabel.textContent = cartState.length
      ? units + ' ' + pluralizeGoods(units) + ' у кошику'
      : 'Порожній кошик';
  }

  const isEmpty = cartState.length === 0;
  if (empty) empty.classList.toggle('is-shown', isEmpty);
  if (summary) summary.classList.toggle('is-gone', isEmpty);
  if (list) list.classList.toggle('is-gone', isEmpty);
  if (isEmpty) return;

  const subtotal = cartState.reduce((sum, line) => sum + PRODUCTS[line.id].price * line.qty, 0);
  const discounted = subtotal * (1 - cartDiscount);
  const shipping = discounted >= FREE_SHIPPING_FROM ? 0 : SHIPPING_FEE;

  document.getElementById('summary-subtotal').textContent = formatPrice(subtotal);
  const discountRow = document.getElementById('summary-discount-row');
  if (discountRow) {
    discountRow.hidden = cartDiscount === 0;
    if (cartDiscount > 0) {
      document.getElementById('summary-discount').textContent = '-' + formatPrice(subtotal * cartDiscount);
    }
  }
  document.getElementById('summary-shipping').textContent =
    shipping === 0 ? 'Безкоштовно' : formatPrice(shipping);
  document.getElementById('summary-total').textContent = formatPrice(discounted + shipping);

  const fill = document.getElementById('ship-progress-fill');
  const note = document.getElementById('ship-progress-note');
  if (fill && note) {
    const ratio = Math.min(discounted / FREE_SHIPPING_FROM, 1);
    fill.style.width = ratio * 100 + '%';
    note.textContent = ratio >= 1
      ? 'Доставка безкоштовна ✳'
      : 'До безкоштовної доставки — ' + formatPrice(FREE_SHIPPING_FROM - discounted);
  }
}

function initCartPage() {
  const list = document.getElementById('cart-items');
  if (!list) return;

  cartState = readCart();
  cartDiscount = readPromo() ? PROMOS[readPromo()] : 0;
  renderCart();

  const promoBtn = document.getElementById('promo-apply');
  const promoInput = document.getElementById('promo-input');
  if (promoBtn && promoInput) {
    const msg = document.getElementById('promo-msg');
    const say = (text, kind) => { msg.textContent = text; msg.className = 'promo-msg ' + kind; };

    const saved = readPromo();
    if (saved) {
      applyPromo(saved);
      promoInput.value = saved;
      say('Промокод «' + saved + '» застосовано: -' + Math.round(PROMOS[saved] * 100) + '%', 'success');
    }

    const apply = () => {
      const raw = promoInput.value.trim();
      if (!raw) { applyPromo(''); say('Введіть промокод', 'error'); recalcSummary(); return; }
      const code = applyPromo(raw);
      if (code) say('Промокод «' + code + '» застосовано: -' + Math.round(PROMOS[code] * 100) + '%', 'success');
      else say('Промокод недійсний', 'error');
      recalcSummary();
    };
    promoBtn.addEventListener('click', apply);
    promoInput.addEventListener('keydown', e => { if (e.key === 'Enter') apply(); });
  }

  const checkoutBtn = document.getElementById('checkout-btn');
  if (checkoutBtn) {
    checkoutBtn.addEventListener('click', () => {
      const msg = document.getElementById('checkout-msg');
      msg.textContent = 'Дякуємо за замовлення! Це демонстраційна версія сайту без реальної оплати.';
      msg.classList.add('is-shown');
    });
  }

  const suggest = document.getElementById('cart-suggest-grid');
  if (suggest) {
    suggest.innerHTML = ['scarf', 'bag', 'trousers', 'shoes']
      .map(id => productCardHTML(PRODUCTS[id])).join('');
    armReveal(suggest);
    armTilt(suggest);
  }
}

/* ==========================================================================
   Overlays — modal, search, toast
   ========================================================================== */
const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';
let lastFocused = null;

function trapFocus(container, e) {
  const items = Array.from(container.querySelectorAll(FOCUSABLE))
    .filter(el => el.offsetWidth || el.offsetHeight || el === document.activeElement);
  if (!items.length) return;
  const first = items[0];
  const last = items[items.length - 1];
  if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
  else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
}

function anyOverlayOpen() {
  return document.querySelectorAll('.modal-overlay.open, .search-overlay.open, .mobile-menu.open').length > 0;
}

function restoreFocus() {
  if (lastFocused && document.contains(lastFocused)) lastFocused.focus();
  lastFocused = null;
}

function injectOverlays() {
  const modal = document.createElement('div');
  modal.className = 'modal-overlay';
  modal.id = 'modal-overlay';
  modal.innerHTML =
    '<div class="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title" tabindex="-1">' +
      '<div class="modal-header"><h3 id="modal-title"></h3>' +
      '<button type="button" class="modal-close" aria-label="Закрити"><i class="fa-solid fa-xmark" aria-hidden="true"></i></button></div>' +
      '<div class="modal-body" id="modal-body"></div>' +
    '</div>';
  document.body.appendChild(modal);

  const search = document.createElement('div');
  search.className = 'search-overlay';
  search.id = 'search-overlay';
  search.innerHTML =
    '<div class="search-panel" role="dialog" aria-modal="true" aria-label="Пошук товарів">' +
      '<div class="search-input-row">' +
        '<i class="fa-solid fa-magnifying-glass" aria-hidden="true"></i>' +
        '<input type="text" id="search-input" placeholder="Пошук товарів…" aria-label="Пошук товарів" ' +
          'autocomplete="off" role="combobox" aria-expanded="false" aria-controls="search-results">' +
        '<button type="button" class="search-close" aria-label="Закрити пошук"><i class="fa-solid fa-xmark" aria-hidden="true"></i></button>' +
      '</div>' +
      '<div class="search-results" id="search-results" role="listbox"></div>' +
      '<div class="search-meta"><span><kbd>↑</kbd> <kbd>↓</kbd> вибір · <kbd>Enter</kbd> відкрити</span><span><kbd>Esc</kbd> закрити</span></div>' +
    '</div>';
  document.body.appendChild(search);

  const veil = document.createElement('div');
  veil.className = 'page-veil';
  veil.id = 'page-veil';
  document.body.appendChild(veil);

  modal.addEventListener('click', e => { if (e.target === modal) closeModal(); });
  search.addEventListener('click', e => { if (e.target === search) closeSearch(); });
  modal.querySelector('.modal-close').addEventListener('click', closeModal);
  search.querySelector('.search-close').addEventListener('click', closeSearch);

  modal.addEventListener('keydown', e => { if (e.key === 'Tab') trapFocus(modal, e); });
  search.addEventListener('keydown', e => { if (e.key === 'Tab') trapFocus(search, e); });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') { closeModal(); closeSearch(); }
    /* Cmd/Ctrl+K opens search, like a proper storefront */
    if ((e.metaKey || e.ctrlKey) && !e.altKey && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      openSearch();
    }
  });
}

function openModal(title, bodyHTML) {
  lastFocused = document.activeElement;
  document.getElementById('modal-title').textContent = title;
  document.getElementById('modal-body').innerHTML = bodyHTML;
  document.getElementById('modal-overlay').classList.add('open');
  document.body.classList.add('modal-open');
  setTimeout(() => {
    const modal = document.querySelector('#modal-overlay .modal');
    const field = modal.querySelector('input, textarea');
    (field || modal).focus();
  }, 60);
}

function closeModal() {
  const overlay = document.getElementById('modal-overlay');
  if (!overlay.classList.contains('open')) return;
  overlay.classList.remove('open');
  if (!anyOverlayOpen()) document.body.classList.remove('modal-open');
  restoreFocus();
}

const SEARCH_HINT =
  '<p class="search-hint">Почніть вводити назву товару</p>' +
  '<div class="search-suggest">' +
    '<button type="button">сорочка</button>' +
    '<button type="button">пальто</button>' +
    '<button type="button">взуття</button>' +
    '<button type="button">аксесуари</button>' +
  '</div>';

function openSearch() {
  const overlay = document.getElementById('search-overlay');
  if (overlay.classList.contains('open')) return;
  lastFocused = document.activeElement;
  overlay.classList.add('open');
  document.body.classList.add('modal-open');
  const input = document.getElementById('search-input');
  document.getElementById('search-results').innerHTML = SEARCH_HINT;
  input.value = '';
  input.setAttribute('aria-expanded', 'false');
  setTimeout(() => input.focus(), 60);
}

function closeSearch() {
  const overlay = document.getElementById('search-overlay');
  if (!overlay.classList.contains('open')) return;
  overlay.classList.remove('open');
  if (!anyOverlayOpen()) document.body.classList.remove('modal-open');
  restoreFocus();
}

function searchResultHTML(p) {
  return '<a class="search-result" role="option" href="product.html?id=' + encodeURIComponent(p.id) + '">' +
    '<div class="search-result-media swatch"><i class="' + escapeHTML(p.icon) + '" aria-hidden="true"></i></div>' +
    '<div><p class="search-result-name">' + escapeHTML(p.name) + '</p>' +
    '<p class="search-result-price price">' + formatPrice(p.price) + '</p></div>' +
    '<i class="fa-solid fa-arrow-right search-result-go" aria-hidden="true"></i>' +
  '</a>';
}

function runSearch(query) {
  const results = document.getElementById('search-results');
  const input = document.getElementById('search-input');
  const trimmed = query.trim();
  const q = trimmed.toLowerCase();

  if (!q) {
    results.innerHTML = SEARCH_HINT;
    input.setAttribute('aria-expanded', 'false');
    return;
  }
  const matches = Object.values(PRODUCTS).filter(p =>
    p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q));

  /* the query is echoed back to the user, so it is escaped before it
     ever reaches innerHTML */
  results.innerHTML = matches.length
    ? matches.map(searchResultHTML).join('')
    : '<p class="search-hint">Нічого не знайдено за запитом «' + escapeHTML(trimmed) + '»</p>';
  input.setAttribute('aria-expanded', String(matches.length > 0));
}

function initSearch() {
  document.querySelectorAll('.search-trigger').forEach(btn => btn.addEventListener('click', openSearch));
  const input = document.getElementById('search-input');
  const results = document.getElementById('search-results');

  input.addEventListener('input', () => runSearch(input.value));

  /* arrow keys walk the result list; Enter opens the highlighted one */
  input.addEventListener('keydown', e => {
    const items = Array.from(results.querySelectorAll('.search-result'));
    if (!items.length) return;
    const current = items.findIndex(el => el.classList.contains('is-active'));

    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      const next = e.key === 'ArrowDown'
        ? (current + 1) % items.length
        : (current <= 0 ? items.length - 1 : current - 1);
      items.forEach((el, i) => el.classList.toggle('is-active', i === next));
      items[next].scrollIntoView({ block: 'nearest' });
    } else if (e.key === 'Enter' && current > -1) {
      e.preventDefault();
      items[current].click();
    }
  });

  results.addEventListener('click', e => {
    const chip = e.target.closest('.search-suggest button');
    if (!chip) return;
    input.value = chip.textContent;
    runSearch(input.value);
    input.focus();
  });
}

let toastTimer = 0;

function showToast(message, action) {
  let toast = document.getElementById('toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast';
    toast.className = 'toast';
    toast.setAttribute('role', 'status');
    document.body.appendChild(toast);
  }

  toast.textContent = '';
  const icon = document.createElement('i');
  icon.className = 'fa-solid fa-circle-check';
  icon.setAttribute('aria-hidden', 'true');
  const label = document.createElement('span');
  label.textContent = message;
  toast.append(icon, label);

  if (action && typeof action.onAction === 'function') {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'toast-action';
    btn.textContent = action.label;
    btn.addEventListener('click', () => {
      clearTimeout(toastTimer);
      toast.classList.remove('show');
      action.onAction();
    });
    toast.appendChild(btn);
  }

  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), action ? 5600 : 2800);
}

/* ==========================================================================
   Info modals and forms
   ========================================================================== */
const INFO_CONTENT = {
  shipping: {
    title: 'Доставка та оплата',
    body: '<p>Доставляємо Новою поштою по всій Україні — 1–3 дні. Безкоштовно при замовленні від <strong>2 000 ₴</strong>, інакше 99 ₴ за відправлення.</p><p>Оплата карткою онлайн одразу після оформлення або готівкою чи карткою при отриманні у відділенні.</p>'
  },
  returns: {
    title: 'Повернення та обмін',
    body: '<p>Поверніть або обміняйте товар протягом <strong>30 днів</strong> з дня отримання — якщо він у первісному вигляді, з бирками і без слідів носіння.</p><p>Кошти повертаються на карту протягом 5 робочих днів після того, як ми отримаємо посилку.</p>'
  },
  sizes: {
    title: 'Розмірна сітка',
    body: '<table class="size-table"><thead><tr><th>Розмір</th><th>Груди</th><th>Талія</th><th>Стегна</th></tr></thead><tbody>' +
      '<tr><td>XS</td><td>82–85</td><td>62–65</td><td>88–91</td></tr>' +
      '<tr><td>S</td><td>86–89</td><td>66–69</td><td>92–95</td></tr>' +
      '<tr><td>M</td><td>90–94</td><td>70–74</td><td>96–100</td></tr>' +
      '<tr><td>L</td><td>95–99</td><td>75–79</td><td>101–105</td></tr>' +
      '<tr><td>XL</td><td>100–105</td><td>80–85</td><td>106–111</td></tr>' +
      '<tr><td>XXL</td><td>106–112</td><td>86–92</td><td>112–118</td></tr>' +
      '</tbody></table><p>Усі значення в сантиметрах, знято по фігурі.</p>'
  },
  about: {
    title: 'Про ательє',
    body: '<p>Maison — ательє готового одягу. Ми віримо, що добрий крій не має бути одноразовим захопленням: працюємо з натуральними тканинами й перевіреними виробництвами, щоб речі тримали форму не один сезон.</p><p>Кожна модель проходить чотири примірки на реальних людях, перш ніж потрапити у колекцію.</p>'
  },
  careers: {
    title: 'Вакансії',
    body: '<p>Наразі відкритих вакансій немає — але ми завжди раді знайомству. Надішліть резюме на <strong>careers@maison.ua</strong>, і ми зв\'яжемося, щойно з\'явиться відповідна позиція.</p>'
  }
};

function accountModalHTML() {
  return '<form id="account-form" novalidate>' +
    '<label>Email<input type="email" required autocomplete="email"></label>' +
    '<label>Пароль<input type="password" required minlength="6" autocomplete="current-password"></label>' +
    '<button type="submit" class="btn btn-primary btn-block">Увійти</button>' +
    '</form>' +
    '<p class="modal-note">Реєстрація працює тим самим способом.</p>' +
    '<p class="form-msg" id="account-msg">Це демонстраційна версія — вхід і реєстрація не підключені до реального сервера.</p>';
}

function contactModalHTML() {
  return '<form id="contact-form" novalidate>' +
    '<label>Ім\'я<input type="text" required autocomplete="name"></label>' +
    '<label>Email<input type="email" required autocomplete="email"></label>' +
    '<label>Повідомлення<textarea required></textarea></label>' +
    '<button type="submit" class="btn btn-primary btn-block">Надіслати</button>' +
    '</form>' +
    '<p class="form-msg" id="contact-msg">Дякуємо! Це демо-версія, тож повідомлення нікуди не пішло, але в реальному ательє ми відповіли б протягом дня.</p>';
}

/* inline validation, so a mistyped field is flagged next to itself */
function validateForm(form) {
  let firstBad = null;
  form.querySelectorAll('input, textarea').forEach(field => {
    const ok = field.checkValidity();
    field.classList.toggle('field-error', !ok);
    field.setAttribute('aria-invalid', String(!ok));
    if (!ok && !firstBad) firstBad = field;
  });
  if (firstBad) firstBad.focus();
  return !firstBad;
}

function initInfoLinks() {
  document.querySelectorAll('[data-modal]').forEach(el => {
    el.addEventListener('click', e => {
      e.preventDefault();
      const key = el.dataset.modal;

      if (key === 'account') {
        openModal('Увійти в акаунт', accountModalHTML());
        const form = document.getElementById('account-form');
        form.addEventListener('submit', ev => {
          ev.preventDefault();
          if (validateForm(form)) document.getElementById('account-msg').classList.add('show');
        });
        return;
      }
      if (key === 'contact') {
        openModal('Контакти', contactModalHTML());
        const form = document.getElementById('contact-form');
        form.addEventListener('submit', ev => {
          ev.preventDefault();
          if (!validateForm(form)) return;
          document.getElementById('contact-msg').classList.add('show');
          form.reset();
        });
        return;
      }
      if (Object.prototype.hasOwnProperty.call(INFO_CONTENT, key)) {
        openModal(INFO_CONTENT[key].title, INFO_CONTENT[key].body);
      }
    });
  });

  document.querySelectorAll('[data-toast]').forEach(el => {
    el.addEventListener('click', e => {
      e.preventDefault();
      showToast(el.dataset.toast);
    });
  });
}

function initNewsletterForms() {
  document.querySelectorAll('.newsletter-form').forEach(form => {
    const btn = form.querySelector('button');
    const input = form.querySelector('input');
    const msg = form.querySelector('.newsletter-msg');
    const say = (text, kind) => {
      if (!msg) { showToast(text); return; }
      msg.textContent = text;
      msg.className = 'newsletter-msg ' + kind;
    };

    const submit = () => {
      const email = input.value.trim();
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
        input.classList.add('field-error');
        input.setAttribute('aria-invalid', 'true');
        say('Перевірте формат email', 'error');
        input.focus();
        return;
      }
      input.classList.remove('field-error');
      input.setAttribute('aria-invalid', 'false');
      say('Готово — знижку 10% надіслали на пошту', 'success');
      input.value = '';
    };

    btn.addEventListener('click', submit);
    input.addEventListener('keydown', e => { if (e.key === 'Enter') submit(); });
    input.addEventListener('input', () => {
      input.classList.remove('field-error');
      if (msg) { msg.textContent = ''; msg.className = 'newsletter-msg'; }
    });
  });
}

/* ==========================================================================
   Page transitions
   ========================================================================== */
function initPageTransitions() {
  if (reducedMotion()) return;
  document.addEventListener('click', e => {
    const link = e.target.closest('a[href]');
    if (!link || e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
    if (link.target === '_blank' || link.hasAttribute('download')) return;

    const href = link.getAttribute('href');
    if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:')) return;

    let url;
    try { url = new URL(href, window.location.href); } catch (err) { return; }
    if (url.origin !== window.location.origin || !url.pathname.endsWith('.html')) return;
    if (url.pathname === window.location.pathname && url.search === window.location.search) return;

    e.preventDefault();
    const veil = document.getElementById('page-veil');
    if (veil) veil.classList.add('show');
    setTimeout(() => { window.location.href = url.href; }, 260);
  });
}

/* ==========================================================================
   Boot
   ========================================================================== */
document.addEventListener('DOMContentLoaded', () => {
  injectOverlays();
  initTheme();
  initMobileMenu();
  initSearch();
  initInfoLinks();
  initNewsletterForms();
  initQuickAdd();
  initWishButtons();
  syncCartCount();
  syncWishCount();

  initReveal();
  renderBestsellers();
  initProductPage();
  initCartPage();
  initCatalogPage();
  initWishlistPage();
  initCheckoutPage();
  paintWishButtons();

  armTilt(document);
  initCounters();
  initScrollChrome();
  initHeroGlow();
  initCountdown();
  initPageTransitions();
});

/* another tab may have changed the cart; keep this one honest */
window.addEventListener('storage', e => {
  if (e.key === WISH_KEY) { syncWishCount(); paintWishButtons(); return; }
  if (e.key !== CART_KEY) return;
  syncCartCount();
  if (document.getElementById('cart-items')) { cartState = readCart(); renderCart(); }
});

/* a bfcache restore would otherwise leave the exit veil covering the page */
window.addEventListener('pageshow', () => {
  const veil = document.getElementById('page-veil');
  if (veil) veil.classList.remove('show');
  syncCartCount();
  syncWishCount();
});

/* ==========================================================================
   Catalogue page — filters, sort and paging, all mirrored in the URL
   ========================================================================== */
const SORTS = {
  featured: { label: 'Рекомендовані', cmp: null },
  'price-asc': { label: 'Спершу дешевші', cmp: (a, b) => a.price - b.price },
  'price-desc': { label: 'Спершу дорожчі', cmp: (a, b) => b.price - a.price },
  rating: { label: 'За рейтингом', cmp: (a, b) => b.rating - a.rating || b.reviewCount - a.reviewCount },
  name: { label: 'За назвою', cmp: (a, b) => a.name.localeCompare(b.name, 'uk') }
};

function readCatalogState() {
  const q = new URLSearchParams(window.location.search);
  const cats = (q.get('cat') || '').split(',').filter(c => CATEGORIES.includes(c));
  const sizes = (q.get('size') || '').split(',').filter(sz => ALL_SIZES.includes(sz));
  const line = LINES.some(l => l.id === q.get('line')) ? q.get('line') : 'all';
  const sort = Object.prototype.hasOwnProperty.call(SORTS, q.get('sort')) ? q.get('sort') : 'featured';
  const max = Number(q.get('max'));
  const page = Math.max(1, Math.trunc(Number(q.get('page'))) || 1);
  return { cats, sizes, line, sort, max: Number.isFinite(max) && max > 0 ? max : 0, page };
}

function writeCatalogState(state, replace) {
  const q = new URLSearchParams();
  if (state.cats.length) q.set('cat', state.cats.join(','));
  if (state.sizes.length) q.set('size', state.sizes.join(','));
  if (state.line !== 'all') q.set('line', state.line);
  if (state.sort !== 'featured') q.set('sort', state.sort);
  if (state.max) q.set('max', String(state.max));
  if (state.page > 1) q.set('page', String(state.page));
  const url = window.location.pathname + (q.toString() ? '?' + q : '');
  /* replaceState while typing a filter, pushState on a real navigation, so
     Back steps through pages rather than through every checkbox click */
  history[replace ? 'replaceState' : 'pushState']({}, '', url);
}

function filterCatalog(state) {
  let list = Object.values(PRODUCTS);
  if (state.line !== 'all') list = list.filter(p => p.line === state.line);
  if (state.cats.length) list = list.filter(p => state.cats.includes(p.category));
  if (state.sizes.length) list = list.filter(p => p.sizes.some(sz => state.sizes.includes(sz)));
  if (state.max) list = list.filter(p => p.price <= state.max);
  const cmp = SORTS[state.sort].cmp;
  return cmp ? list.slice().sort(cmp) : list;
}

function initCatalogPage() {
  const grid = document.getElementById('catalog-grid');
  if (!grid) return;

  const priceCeiling = Math.max(...Object.values(PRODUCTS).map(p => p.price));
  let state = readCatalogState();

  const els = {
    line: document.getElementById('catalog-lines'),
    cats: document.getElementById('catalog-cats'),
    sizes: document.getElementById('catalog-sizes'),
    price: document.getElementById('catalog-price'),
    priceOut: document.getElementById('catalog-price-value'),
    sort: document.getElementById('catalog-sort'),
    count: document.getElementById('catalog-count'),
    empty: document.getElementById('catalog-empty'),
    clear: document.getElementById('catalog-clear'),
    pager: document.getElementById('catalog-pager'),
    chips: document.getElementById('catalog-chips')
  };

  els.line.innerHTML = LINES.map(l =>
    '<button type="button" data-line="' + l.id + '">' + escapeHTML(l.label) + '</button>').join('');
  els.cats.innerHTML = CATEGORIES.map(c =>
    '<label class="check"><input type="checkbox" value="' + escapeHTML(c) + '">' +
    '<span>' + escapeHTML(c) + '</span>' +
    '<small>' + Object.values(PRODUCTS).filter(p => p.category === c).length + '</small></label>').join('');
  els.sizes.innerHTML = ALL_SIZES.map(sz =>
    '<label class="size-check"><input type="checkbox" value="' + escapeHTML(sz) + '">' +
    '<span>' + escapeHTML(sz) + '</span></label>').join('');
  els.sort.innerHTML = Object.keys(SORTS).map(k =>
    '<option value="' + k + '">' + escapeHTML(SORTS[k].label) + '</option>').join('');
  els.price.max = String(priceCeiling);
  els.price.min = '500';
  els.price.step = '50';

  function paintControls() {
    els.line.querySelectorAll('button').forEach(b => {
      const on = b.dataset.line === state.line;
      b.classList.toggle('active', on);
      b.setAttribute('aria-pressed', String(on));
    });
    els.cats.querySelectorAll('input').forEach(i => { i.checked = state.cats.includes(i.value); });
    els.sizes.querySelectorAll('input').forEach(i => { i.checked = state.sizes.includes(i.value); });
    els.sort.value = state.sort;
    els.price.value = String(state.max || priceCeiling);
    els.priceOut.textContent = state.max ? 'до ' + formatPrice(state.max) : 'будь-яка';

    const chips = [];
    if (state.line !== 'all') chips.push({ k: 'line', label: LINES.find(l => l.id === state.line).label });
    state.cats.forEach(c => chips.push({ k: 'cat', v: c, label: c }));
    state.sizes.forEach(sz => chips.push({ k: 'size', v: sz, label: 'Розмір ' + sz }));
    if (state.max) chips.push({ k: 'max', label: 'до ' + formatPrice(state.max) });
    els.chips.innerHTML = chips.map(c =>
      '<button type="button" class="chip-clear" data-k="' + c.k + '" data-v="' + escapeHTML(c.v || '') + '">' +
      escapeHTML(c.label) + '<i class="fa-solid fa-xmark" aria-hidden="true"></i></button>').join('');
    els.chips.classList.toggle('is-gone', !chips.length);
    els.clear.classList.toggle('is-gone', !chips.length);
  }

  function render(replaceUrl) {
    const list = filterCatalog(state);
    const pages = Math.max(1, Math.ceil(list.length / PAGE_SIZE));
    if (state.page > pages) state.page = pages;
    const slice = list.slice((state.page - 1) * PAGE_SIZE, state.page * PAGE_SIZE);

    els.count.textContent = list.length + ' ' + pluralizeGoods(list.length);
    els.empty.classList.toggle('is-gone', list.length > 0);
    grid.classList.toggle('is-gone', list.length === 0);
    grid.innerHTML = slice.map(productCardHTML).join('');
    armReveal(grid);
    armTilt(grid);
    paintWishButtons();

    els.pager.innerHTML = pages > 1
      ? '<button type="button" class="pager-btn" data-page="' + (state.page - 1) + '"' +
          (state.page === 1 ? ' disabled' : '') + ' aria-label="Попередня сторінка">' +
          '<i class="fa-solid fa-arrow-left" aria-hidden="true"></i></button>' +
        Array.from({ length: pages }, (_, i) =>
          '<button type="button" class="pager-btn' + (i + 1 === state.page ? ' active' : '') +
          '" data-page="' + (i + 1) + '"' + (i + 1 === state.page ? ' aria-current="page"' : '') +
          '>' + (i + 1) + '</button>').join('') +
        '<button type="button" class="pager-btn" data-page="' + (state.page + 1) + '"' +
          (state.page === pages ? ' disabled' : '') + ' aria-label="Наступна сторінка">' +
          '<i class="fa-solid fa-arrow-right" aria-hidden="true"></i></button>'
      : '';

    paintControls();
    writeCatalogState(state, replaceUrl !== false);
  }

  const change = () => { state.page = 1; render(true); };

  els.line.addEventListener('click', e => {
    const b = e.target.closest('button');
    if (!b) return;
    state.line = b.dataset.line;
    change();
  });
  els.cats.addEventListener('change', () => {
    state.cats = [...els.cats.querySelectorAll('input:checked')].map(i => i.value);
    change();
  });
  els.sizes.addEventListener('change', () => {
    state.sizes = [...els.sizes.querySelectorAll('input:checked')].map(i => i.value);
    change();
  });
  els.price.addEventListener('input', () => {
    const v = Number(els.price.value);
    state.max = v >= priceCeiling ? 0 : v;
    els.priceOut.textContent = state.max ? 'до ' + formatPrice(state.max) : 'будь-яка';
  });
  els.price.addEventListener('change', change);
  els.sort.addEventListener('change', () => { state.sort = els.sort.value; change(); });
  els.clear.addEventListener('click', () => {
    state = { cats: [], sizes: [], line: 'all', sort: 'featured', max: 0, page: 1 };
    render(false);
  });
  els.chips.addEventListener('click', e => {
    const chip = e.target.closest('.chip-clear');
    if (!chip) return;
    if (chip.dataset.k === 'line') state.line = 'all';
    if (chip.dataset.k === 'max') state.max = 0;
    if (chip.dataset.k === 'cat') state.cats = state.cats.filter(c => c !== chip.dataset.v);
    if (chip.dataset.k === 'size') state.sizes = state.sizes.filter(sz => sz !== chip.dataset.v);
    change();
  });
  els.pager.addEventListener('click', e => {
    const b = e.target.closest('.pager-btn');
    if (!b || b.disabled) return;
    state.page = Number(b.dataset.page);
    render(false);
    document.getElementById('catalog-top').scrollIntoView({
      behavior: reducedMotion() ? 'auto' : 'smooth', block: 'start'
    });
  });

  window.addEventListener('popstate', () => { state = readCatalogState(); render(true); });

  const toggle = document.getElementById('filter-toggle');
  const panel = document.getElementById('catalog-filters');
  if (toggle && panel) {
    toggle.addEventListener('click', () => {
      const open = panel.classList.toggle('open');
      toggle.setAttribute('aria-expanded', String(open));
    });
  }

  render(true);
}

/* ==========================================================================
   Wishlist page
   ========================================================================== */
function initWishlistPage() {
  const grid = document.getElementById('wishlist-grid');
  if (!grid) return;

  const empty = document.getElementById('wishlist-empty');
  const count = document.getElementById('wishlist-count');
  const clear = document.getElementById('wishlist-clear');

  function render() {
    const list = readWishlist();
    count.textContent = list.length + ' ' + pluralizeGoods(list.length);
    empty.classList.toggle('is-gone', list.length > 0);
    grid.classList.toggle('is-gone', list.length === 0);
    clear.classList.toggle('is-gone', list.length === 0);
    grid.innerHTML = list.map(id => productCardHTML(PRODUCTS[id])).join('');
    armReveal(grid);
    armTilt(grid);
    paintWishButtons();
  }

  clear.addEventListener('click', () => {
    writeWishlist([]);
    render();
    showToast('Обране очищено');
  });

  /* a heart click anywhere on this page removes the card it belongs to */
  document.addEventListener('click', e => {
    if (e.target.closest('[data-wish]')) setTimeout(render, 0);
  });

  render();
}

/* ==========================================================================
   Checkout page
   ========================================================================== */
const DELIVERY = {
  branch: { label: 'Відділення Нової пошти', fee: 0 },
  courier: { label: 'Кур\'єр за адресою', fee: 60 },
  pickup: { label: 'Самовивіз з ательє, Київ', fee: 0, free: true }
};

function orderNumber() {
  const d = new Date();
  const stamp = String(d.getFullYear()).slice(2) +
    String(d.getMonth() + 1).padStart(2, '0') + String(d.getDate()).padStart(2, '0');
  /* demo order id — readable, not a security token */
  return 'MA-' + stamp + '-' + String(Math.floor(Math.random() * 9000) + 1000);
}

function initCheckoutPage() {
  const form = document.getElementById('checkout-form');
  if (!form) return;

  const lines = readCart();
  const promo = readPromo();
  const discount = promo ? PROMOS[promo] : 0;

  const summaryList = document.getElementById('co-lines');
  const emptyState = document.getElementById('co-empty');
  const body = document.getElementById('co-body');

  if (!lines.length) {
    emptyState.classList.remove('is-gone');
    body.classList.add('is-gone');
    return;
  }
  emptyState.classList.add('is-gone');
  body.classList.remove('is-gone');

  summaryList.innerHTML = lines.map(line => {
    const p = PRODUCTS[line.id];
    return '<li class="co-line">' +
      '<img src="assets/products/' + encodeURIComponent(p.id) + '-400.jpg" width="600" height="800" ' +
        'loading="lazy" decoding="async" alt="">' +
      '<div><p class="co-line-name">' + escapeHTML(p.name) + '</p>' +
      '<p class="co-line-meta">' + escapeHTML(line.size) + ' · ' + escapeHTML(line.color) +
      ' · ' + line.qty + ' шт.</p></div>' +
      '<span class="price">' + formatPrice(p.price * line.qty) + '</span></li>';
  }).join('');

  const subtotal = lines.reduce((sum, l) => sum + PRODUCTS[l.id].price * l.qty, 0);
  const discounted = subtotal * (1 - discount);

  function paintTotals() {
    const method = form.querySelector('input[name="delivery"]:checked');
    const key = method && Object.prototype.hasOwnProperty.call(DELIVERY, method.value)
      ? method.value : 'branch';
    const option = DELIVERY[key];
    const shipping = option.free || discounted >= FREE_SHIPPING_FROM ? option.fee : option.fee + SHIPPING_FEE;

    document.getElementById('co-subtotal').textContent = formatPrice(subtotal);
    const row = document.getElementById('co-discount-row');
    row.hidden = discount === 0;
    if (discount > 0) {
      document.getElementById('co-discount-label').textContent = 'Знижка «' + promo + '»';
      document.getElementById('co-discount').textContent = '-' + formatPrice(subtotal * discount);
    }
    document.getElementById('co-shipping').textContent =
      shipping === 0 ? 'Безкоштовно' : formatPrice(shipping);
    document.getElementById('co-total').textContent = formatPrice(discounted + shipping);

    /* the branch picker is meaningless for courier or pickup */
    form.querySelector('[data-only="branch"]').hidden = key !== 'branch';
    form.querySelector('[data-only="courier"]').hidden = key !== 'courier';
    return { key: key, label: option.label, shipping: shipping, total: discounted + shipping };
  }

  form.querySelectorAll('input[name="delivery"]').forEach(r =>
    r.addEventListener('change', paintTotals));
  paintTotals();

  const setError = (field, message) => {
    const wrap = field.closest('.field');
    field.classList.toggle('field-error', Boolean(message));
    field.setAttribute('aria-invalid', String(Boolean(message)));
    const note = wrap && wrap.querySelector('.field-msg');
    if (note) note.textContent = message || '';
  };

  const RULES = {
    'co-name': v => v.trim().length >= 2 || 'Вкажіть ім\'я та прізвище',
    'co-phone': v => /^\+?\d[\d\s()-]{8,17}$/.test(v.trim()) || 'Телефон у форматі +380 XX XXX XX XX',
    'co-email': v => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) || 'Перевірте формат email',
    'co-city': v => v.trim().length >= 2 || 'Вкажіть місто',
    'co-branch': v => v.trim().length >= 1 || 'Вкажіть номер відділення',
    'co-address': v => v.trim().length >= 5 || 'Вкажіть вулицю і номер будинку'
  };

  function validate(showAll) {
    let firstBad = null;
    Object.keys(RULES).forEach(id => {
      const field = document.getElementById(id);
      if (!field) return;
      const group = field.closest('[data-only]');
      if (group && group.hidden) { setError(field, ''); return; }
      const result = RULES[id](field.value);
      const message = result === true ? '' : result;
      if (showAll || field.dataset.touched) setError(field, message);
      if (message && !firstBad) firstBad = field;
    });

    const agree = document.getElementById('co-agree');
    const agreeBad = !agree.checked;
    agree.closest('.field').querySelector('.field-msg').textContent =
      showAll && agreeBad ? 'Підтвердьте умови, щоб продовжити' : '';
    if (agreeBad && !firstBad) firstBad = agree;

    return { ok: !firstBad, firstBad: firstBad };
  }

  form.querySelectorAll('input, textarea').forEach(field => {
    field.addEventListener('blur', () => { field.dataset.touched = '1'; validate(false); });
    field.addEventListener('input', () => { if (field.dataset.touched) validate(false); });
  });

  form.addEventListener('submit', e => {
    e.preventDefault();
    const check = validate(true);
    if (!check.ok) {
      check.firstBad.focus();
      showToast('Перевірте виділені поля');
      return;
    }

    const totals = paintTotals();
    const order = {
      number: orderNumber(),
      total: totals.total,
      delivery: totals.label,
      email: document.getElementById('co-email').value.trim(),
      units: cartUnits(lines),
      at: new Date().toISOString()
    };
    writeJSON(ORDER_KEY, order);
    writeCart([]);
    try { localStorage.removeItem(PROMO_KEY); } catch (err) {}

    document.getElementById('co-number').textContent = order.number;
    document.getElementById('co-sent-to').textContent = order.email;
    document.getElementById('co-paid').textContent = formatPrice(order.total);
    document.getElementById('co-method').textContent = order.delivery;
    body.classList.add('is-gone');
    document.getElementById('co-done').classList.remove('is-gone');
    document.getElementById('co-done').focus();
    window.scrollTo({ top: 0, behavior: reducedMotion() ? 'auto' : 'smooth' });
  });
}
