/* ==========================================================================
   Maison — catalogue data, UI logic and motion
   ========================================================================== */

const PRODUCTS = {
  jacket: {
    id: 'jacket', category: 'Верхній одяг', line: 'women', name: 'Куртка оверсайз',
    price: 3450, oldPrice: null, badge: 'new',
    code: '№ 012', material: 'ВОВНА 60%', stock: 8,
    icon: 'fa-solid fa-vest',
    desc: 'Просторий крій, щільна тканина з легким начосом і мінімалістична фурнітура. Куртка, яка однаково добре виглядає з денімом і зі строгими брюками.',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: [{ name: 'Чорний', hex: '#22221F' }, { name: 'Бежевий', hex: '#D8CBB4' }, { name: 'Оливковий', hex: '#6B7455' }],
    care: 'Склад: вовна 60%, поліамід 40%. Пране при 30°C, не відбілювати, прасувати з виворітної сторони при середній температурі. Не сушити в сушильній машині.',
    shipping: 'Доставка Новою поштою — 1–3 дні. Безкоштовно при замовленні від 2 000 ₴. Обмін і повернення протягом 30 днів у первісному вигляді.',
    fit: 'Оверсайз. Модель на фото має зріст 178 см і носить розмір S. Якщо хочете щільнішу посадку — беріть на розмір менше.'
  },
  shirt: {
    id: 'shirt', category: 'Сорочки', line: 'men', name: 'Лляна сорочка',
    price: 960, oldPrice: 1200, badge: 'sale',
    code: '№ 004', material: 'ЛЬОН 100%', stock: 23,
    icon: 'fa-solid fa-shirt',
    desc: '100% льон щільного плетіння. Вільний крій, накладні кишені, перламутрові ґудзики. Дихаюча тканина для теплої погоди.',
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    colors: [{ name: 'Білий', hex: '#F2EFE7' }, { name: 'Блакитний', hex: '#A8BFCE' }, { name: 'Хакі', hex: '#8A8A6C' }],
    care: 'Склад: льон 100%. Машинне прання при 30°C у делікатному режимі. Прасувати, поки тканина ще волога.',
    shipping: 'Доставка Новою поштою — 1–3 дні. Безкоштовно при замовленні від 2 000 ₴. Обмін і повернення протягом 30 днів.',
    fit: 'Вільна посадка. Льон трохи сідає після першого прання — сітка вже враховує це.'
  },
  dress: {
    id: 'dress', category: 'Сукні', line: 'women', name: 'Сукня міді',
    price: 1890, oldPrice: null, badge: null,
    code: '№ 021', material: 'ВІСКОЗА 95%', stock: 14,
    icon: 'fa-solid fa-person-dress',
    desc: 'Приталений силует, розкльошена спідниця довжини міді, прихована блискавка ззаду. З віскози з легким матовим блиском.',
    sizes: ['XS', 'S', 'M', 'L'],
    colors: [{ name: 'Чорний', hex: '#22221F' }, { name: 'Бордовий', hex: '#6E2A31' }],
    care: 'Склад: віскоза 95%, еластан 5%. Делікатне ручне прання при 30°C або хімчистка. Не викручувати, сушити горизонтально.',
    shipping: 'Доставка Новою поштою — 1–3 дні. Безкоштовно при замовленні від 2 000 ₴. Обмін і повернення протягом 30 днів.',
    fit: 'Приталена посадка по лінії грудей і талії. Довжина міді — 112 см для розміру S.'
  },
  shoes: {
    id: 'shoes', category: 'Взуття', line: 'men', name: 'Кросівки класик',
    price: 2100, oldPrice: null, badge: null,
    code: '№ 038', material: 'ШКІРА 100%', stock: 19,
    icon: 'fa-solid fa-shoe-prints',
    desc: 'Мінімалістичні шкіряні кросівки на гумовій підошві. Класична колодка, зручна для щоденного носіння.',
    sizes: ['38', '39', '40', '41', '42', '43', '44'],
    colors: [{ name: 'Білий', hex: '#F2EFE7' }, { name: 'Чорний', hex: '#22221F' }],
    care: 'Верх: шкіра 100%, підошва: гума. Протирати вологою тканиною. Водовідштовхувальний спрей раз на сезон.',
    shipping: 'Доставка Новою поштою — 1–3 дні. Безкоштовно при замовленні від 2 000 ₴. Обмін і повернення протягом 30 днів.',
    fit: 'Розмір у розмір. Для широкої стопи радимо брати на пів розміру більше.'
  },
  coat: {
    id: 'coat', category: 'Верхній одяг', line: 'women', name: 'Пальто-халат',
    price: 5200, oldPrice: 6500, badge: 'sale',
    code: '№ 007', material: 'ВОВНА 80%', stock: 5,
    icon: 'fa-solid fa-user-tie',
    desc: 'Пальто без ґудзиків, із поясом у тон. Щільна вовняна тканина тримає силует, підкладка з віскози дає ковзання по одягу.',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [{ name: 'Camel', hex: '#B2875A' }, { name: 'Графіт', hex: '#4A4A46' }],
    care: 'Склад: вовна 80%, поліестер 20%. Тільки хімчистка. Зберігати на плічках у чохлі.',
    shipping: 'Доставка Новою поштою — 1–3 дні. Безкоштовно при замовленні від 2 000 ₴. Обмін і повернення протягом 30 днів.',
    fit: 'Пряма посадка з запасом на светр. Довжина — 118 см для розміру M.'
  },
  trousers: {
    id: 'trousers', category: 'Брюки', line: 'men', name: 'Брюки прямі',
    price: 1740, oldPrice: null, badge: 'new',
    code: '№ 029', material: 'БАВОВНА 98%', stock: 16,
    icon: 'fa-solid fa-socks',
    desc: 'Щільна костюмна бавовна, прямий крій від стегна, защипи спереду. Тримають складку без прасування після кожного носіння.',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: [{ name: 'Пісочний', hex: '#C8B79A' }, { name: 'Чорний', hex: '#22221F' }, { name: 'Синій', hex: '#3C4A63' }],
    care: 'Склад: бавовна 98%, еластан 2%. Прання при 30°C, прасувати через тканину.',
    shipping: 'Доставка Новою поштою — 1–3 дні. Безкоштовно при замовленні від 2 000 ₴. Обмін і повернення протягом 30 днів.',
    fit: 'Посадка на талії. Довжина по внутрішньому шву — 78 см, підшивку робимо безкоштовно.'
  },
  scarf: {
    id: 'scarf', category: 'Аксесуари', line: 'access', name: 'Шарф вовняний',
    price: 890, oldPrice: null, badge: null,
    code: '№ 044', material: 'ВОВНА 100%', stock: 31,
    icon: 'fa-solid fa-mitten',
    desc: 'Мериносова вовна без колючості, ручна обробка країв. Розмір 190 × 32 см — вистачає на подвійний оборот.',
    sizes: ['ONE'],
    colors: [{ name: 'Вівсяний', hex: '#DCCFB6' }, { name: 'Пляшковий', hex: '#2F4A3B' }, { name: 'Вишневий', hex: '#7A2B31' }],
    care: 'Склад: меринос 100%. Ручне прання в холодній воді зі спеціальним засобом для вовни.',
    shipping: 'Доставка Новою поштою — 1–3 дні. Безкоштовно при замовленні від 2 000 ₴. Обмін і повернення протягом 30 днів.',
    fit: 'Єдиний розмір — 190 × 32 см.'
  },
  bag: {
    id: 'bag', category: 'Аксесуари', line: 'access', name: 'Сумка-тоут',
    price: 2680, oldPrice: 3200, badge: 'sale',
    code: '№ 051', material: 'ШКІРА 100%', stock: 9,
    icon: 'fa-solid fa-bag-shopping',
    desc: 'Шкіряний тоут на одне відділення з внутрішньою кишенею на молнії. Тримає форму, поміщає ноутбук 14".',
    sizes: ['ONE'],
    colors: [{ name: 'Коньяк', hex: '#9A6438' }, { name: 'Чорний', hex: '#22221F' }],
    care: 'Верх: шкіра 100%. Обробляти кремом для шкіри двічі на рік. Уникати тривалої вологи.',
    shipping: 'Доставка Новою поштою — 1–3 дні. Безкоштовно при замовленні від 2 000 ₴. Обмін і повернення протягом 30 днів.',
    fit: 'Габарити — 38 × 30 × 12 см, довжина ручок 58 см.'
  }
};

const FREE_SHIPPING_FROM = 2000;
const SHIPPING_FEE = 99;
const MAX_QTY = 10;
const CART_KEY = 'maison-cart';
const WISH_KEY = 'maison-wishlist';
const THEME_KEY = 'maison-theme';
const FILTER_KEY = 'maison-filter';

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
        '<div class="product-media swatch">' +
          '<i class="' + escapeHTML(product.icon) + '" aria-hidden="true"></i>' +
          '<span class="swatch-tag">' + escapeHTML(product.code) + '</span>' +
        '</div>' +
        badgeHTML(product) +
        '<span class="tilt-glare" aria-hidden="true"></span>' +
        '<span class="quick-view">Дивитися модель</span>' +
      '</div>' +
      '<p class="product-cat">' + escapeHTML(product.category) + '</p>' +
      '<p class="product-name">' + name + '</p>' +
      '<p class="product-price price">' + priceHTML(product) + '</p>' +
    '</a>' +
    '<button type="button" class="card-add" data-add="' + escapeHTML(product.id) + '" ' +
      'aria-label="Швидко додати «' + name + '» у кошик"><i class="fa-solid fa-plus" aria-hidden="true"></i></button>' +
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
    qty: Math.min(Math.max(Number.isFinite(qty) ? qty : 1, 1), MAX_QTY)
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
  if (match) match.qty = Math.min(match.qty + line.qty, MAX_QTY);
  else cart.push(line);
  writeCart(cart);
  if (document.getElementById('cart-items')) { cartState = cart; renderCart(); }
  return line;
}

function readWishlist() {
  const stored = readJSON(WISH_KEY);
  return Array.isArray(stored) ? stored.filter(hasProduct) : [];
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
function initQtyStepper(stepper) {
  if (!stepper) return;
  const display = stepper.querySelector('span');
  const minus = stepper.querySelector('.qty-minus');
  const plus = stepper.querySelector('.qty-plus');
  if (!display || !minus || !plus) return;
  let qty = Math.min(Math.max(Number(display.textContent) || 1, 1), MAX_QTY);

  const set = next => {
    qty = next;
    display.textContent = String(qty);
    minus.disabled = qty <= 1;
    plus.disabled = qty >= MAX_QTY;
    display.classList.remove('bump');
    void display.offsetWidth;
    display.classList.add('bump');
    stepper.dispatchEvent(new CustomEvent('qtychange'));
  };

  minus.disabled = qty <= 1;
  plus.disabled = qty >= MAX_QTY;
  minus.addEventListener('click', () => { if (qty > 1) set(qty - 1); });
  plus.addEventListener('click', () => { if (qty < MAX_QTY) set(qty + 1); });
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

  document.querySelectorAll('.gallery-icon').forEach(i => { i.className = 'gallery-icon ' + product.icon; });
  document.getElementById('gallery-tag').textContent = product.code;

  const main = document.getElementById('gallery-main');
  const thumbs = document.querySelectorAll('.gallery-thumbs button');
  thumbs.forEach(thumb => {
    thumb.addEventListener('click', () => {
      thumbs.forEach(t => { t.classList.remove('active'); t.setAttribute('aria-pressed', 'false'); });
      thumb.classList.add('active');
      thumb.setAttribute('aria-pressed', 'true');
      if (!main) return;
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
  document.getElementById('stock-note').textContent =
    'У наявності: ' + product.stock + ' шт. · ' + product.material;

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

  initQtyStepper(document.querySelector('.product-info .qty-stepper'));

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

  const relatedGrid = document.getElementById('related-grid');
  if (relatedGrid) {
    const others = Object.keys(PRODUCTS).filter(id => id !== product.id).slice(0, 4);
    relatedGrid.innerHTML = others.map(id => productCardHTML(PRODUCTS[id])).join('');
    armReveal(relatedGrid);
    armTilt(relatedGrid);
  }
}

/* ==========================================================================
   Cart page
   ========================================================================== */
let cartState = [];
let cartDiscount = 0;

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
    initQtyStepper(stepper);
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
  renderCart();

  const promoBtn = document.getElementById('promo-apply');
  const promoInput = document.getElementById('promo-input');
  if (promoBtn && promoInput) {
    const msg = document.getElementById('promo-msg');
    const apply = () => {
      const code = promoInput.value.trim().toUpperCase();
      if (code === 'MAISON10') {
        cartDiscount = 0.1;
        msg.textContent = 'Промокод застосовано: -10%';
        msg.className = 'promo-msg success';
      } else if (code === '') {
        cartDiscount = 0;
        msg.textContent = 'Введіть промокод';
        msg.className = 'promo-msg error';
      } else {
        cartDiscount = 0;
        msg.textContent = 'Промокод недійсний';
        msg.className = 'promo-msg error';
      }
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
  syncCartCount();

  initReveal();
  renderBestsellers();
  initProductPage();
  initCartPage();

  armTilt(document);
  initCounters();
  initScrollChrome();
  initHeroGlow();
  initCountdown();
  initPageTransitions();
});

/* another tab may have changed the cart; keep this one honest */
window.addEventListener('storage', e => {
  if (e.key !== CART_KEY) return;
  syncCartCount();
  if (document.getElementById('cart-items')) { cartState = readCart(); renderCart(); }
});

/* a bfcache restore would otherwise leave the exit veil covering the page */
window.addEventListener('pageshow', () => {
  const veil = document.getElementById('page-veil');
  if (veil) veil.classList.remove('show');
  syncCartCount();
});
