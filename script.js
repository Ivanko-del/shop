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

/* --- utilities ----------------------------------------------------------- */
const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function formatPrice(n) {
  return Math.round(n).toLocaleString('uk-UA') + ' ₴';
}

function pluralizeGoods(n) {
  const mod10 = n % 10, mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return 'товар';
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) return 'товари';
  return 'товарів';
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
    return '<span class="now">' + formatPrice(product.price) + '</span><span class="old">' + formatPrice(product.oldPrice) + '</span>';
  }
  return '<span class="now">' + formatPrice(product.price) + '</span>';
}

function productCardHTML(product) {
  return '<a class="product-card" href="product.html?id=' + product.id + '" data-line="' + product.line + '" data-reveal="up">' +
    '<div class="product-media swatch">' + badgeHTML(product) +
      '<i class="' + product.icon + '" aria-hidden="true"></i>' +
      '<span class="swatch-tag">' + product.code + '</span>' +
      '<span class="quick-view">Дивитися модель</span>' +
    '</div>' +
    '<p class="product-cat">' + product.category + '</p>' +
    '<p class="product-name">' + product.name + '</p>' +
    '<p class="product-price price">' + priceHTML(product) + '</p>' +
  '</a>';
}

/* --- theme --------------------------------------------------------------- */
function initTheme() {
  const syncIcon = () => {
    const dark = document.documentElement.dataset.theme === 'dark';
    document.querySelectorAll('.theme-toggle i').forEach(i => {
      i.className = dark ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
    });
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', dark ? '#121210' : '#F6F4EF');
  };

  syncIcon();
  document.querySelectorAll('.theme-toggle').forEach(btn => {
    btn.addEventListener('click', () => {
      const dark = document.documentElement.dataset.theme === 'dark';
      if (dark) delete document.documentElement.dataset.theme;
      else document.documentElement.dataset.theme = 'dark';
      try { localStorage.setItem('maison-theme', dark ? 'light' : 'dark'); } catch (e) {}
      syncIcon();
    });
  });
}

/* --- scroll reveal ------------------------------------------------------- */
let revealObserver = null;

function armReveal(root) {
  const items = (root || document).querySelectorAll('[data-reveal]:not([data-reveal-armed])');
  items.forEach(el => {
    el.setAttribute('data-reveal-armed', '');

    /* children of a [data-stagger] container inherit a cascading delay */
    const group = el.parentElement && el.parentElement.hasAttribute('data-stagger') ? el.parentElement : null;
    if (group && !el.style.getPropertyValue('--reveal-delay')) {
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

/* --- header state, scroll progress, back-to-top -------------------------- */
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

/* --- animated counters --------------------------------------------------- */
function initCounters() {
  const nodes = document.querySelectorAll('[data-count]');
  if (!nodes.length) return;

  const render = (el, value) => {
    const decimals = el.dataset.count.includes('.') ? 1 : 0;
    const suffix = el.dataset.suffix || '';
    el.innerHTML = value.toFixed(decimals).replace('.', ',') +
      (suffix ? '<small>' + suffix + '</small>' : '');
  };

  const run = el => {
    const target = parseFloat(el.dataset.count);
    const duration = 1400;
    const start = performance.now();
    const step = now => {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      render(el, target * eased);
      if (t < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };

  /* the markup already carries the final figures, so no-JS and
     reduced-motion readers see real numbers, not a row of zeros */
  if (reducedMotion() || !('IntersectionObserver' in window)) return;
  nodes.forEach(el => render(el, 0));

  const obs = new IntersectionObserver((entries, o) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      run(entry.target);
      o.unobserve(entry.target);
    });
  }, { threshold: 0.5 });
  nodes.forEach(el => obs.observe(el));
}

/* --- hero parallax + cursor glow ----------------------------------------- */
function initHeroMotion() {
  const hero = document.querySelector('.hero');
  if (!hero || reducedMotion()) return;
  const layers = hero.querySelectorAll('[data-parallax]');

  hero.addEventListener('pointermove', e => {
    const rect = hero.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;

    hero.style.setProperty('--glow-x', (e.clientX - rect.left) + 'px');
    hero.style.setProperty('--glow-y', (e.clientY - rect.top) + 'px');

    layers.forEach(layer => {
      const depth = parseFloat(layer.dataset.parallax) || 0;
      layer.style.transform =
        'translate3d(' + (px - .5) * rect.width * depth + 'px,' +
        (py - .5) * rect.height * depth + 'px, 0)';
    });
  });

  hero.addEventListener('pointerleave', () => {
    layers.forEach(layer => { layer.style.transform = ''; });
  });
}

/* --- mobile menu --------------------------------------------------------- */
function initMobileMenu() {
  const toggle = document.querySelector('.menu-toggle');
  const menu = document.querySelector('.mobile-menu');
  const close = document.querySelector('.mobile-menu-close');
  if (!toggle || !menu) return;

  const open = () => { menu.classList.add('open'); document.body.classList.add('modal-open'); };
  const shut = () => { menu.classList.remove('open'); document.body.classList.remove('modal-open'); };

  toggle.addEventListener('click', open);
  if (close) close.addEventListener('click', shut);
  menu.querySelectorAll('a').forEach(a => a.addEventListener('click', shut));
  document.addEventListener('keydown', e => { if (e.key === 'Escape') shut(); });
}

/* --- home: catalogue grid + filters ------------------------------------- */
function renderBestsellers() {
  const grid = document.getElementById('bestsellers-grid');
  if (!grid) return;
  const order = ['shirt', 'jacket', 'coat', 'dress', 'trousers', 'shoes', 'bag', 'scarf'];
  grid.innerHTML = order.map(id => productCardHTML(PRODUCTS[id])).join('');
  armReveal(grid);

  const tabs = document.getElementById('filter-tabs');
  if (!tabs) return;
  tabs.addEventListener('click', e => {
    const btn = e.target.closest('button');
    if (!btn) return;
    tabs.querySelectorAll('button').forEach(b => b.classList.toggle('active', b === btn));
    const filter = btn.dataset.filter;
    grid.querySelectorAll('.product-card').forEach((card, i) => {
      const match = filter === 'all' || card.dataset.line === filter;
      card.classList.toggle('is-hidden', !match);
      if (match) {
        /* replay the reveal so a freshly filtered grid animates in again */
        card.classList.remove('is-revealed');
        card.style.setProperty('--reveal-delay', (i % 8) * 0.05 + 's');
        requestAnimationFrame(() => card.classList.add('is-revealed'));
      }
    });
  });
}

/* --- promo countdown ----------------------------------------------------- */
function initCountdown() {
  const root = document.getElementById('promo-countdown');
  if (!root) return;
  const units = {
    days: root.querySelector('[data-unit="days"]'),
    hours: root.querySelector('[data-unit="hours"]'),
    minutes: root.querySelector('[data-unit="minutes"]'),
    seconds: root.querySelector('[data-unit="seconds"]')
  };
  /* always ends at the next midnight seven days out, so the demo never expires */
  const end = new Date();
  end.setHours(0, 0, 0, 0);
  end.setDate(end.getDate() + 7);

  const pad = n => String(n).padStart(2, '0');
  const tick = () => {
    const left = Math.max(end - Date.now(), 0);
    const s = Math.floor(left / 1000);
    units.days.textContent = pad(Math.floor(s / 86400));
    units.hours.textContent = pad(Math.floor(s / 3600) % 24);
    units.minutes.textContent = pad(Math.floor(s / 60) % 60);
    units.seconds.textContent = pad(s % 60);
  };
  tick();
  setInterval(tick, 1000);
}

/* --- quantity stepper ---------------------------------------------------- */
function initQtyStepper(stepper) {
  if (!stepper) return;
  const display = stepper.querySelector('span');
  const minus = stepper.querySelector('.qty-minus');
  const plus = stepper.querySelector('.qty-plus');
  let qty = Number(display.textContent) || 1;

  const set = next => {
    qty = next;
    display.textContent = String(qty);
    display.classList.remove('bump');
    void display.offsetWidth;
    display.classList.add('bump');
    stepper.dispatchEvent(new CustomEvent('qtychange'));
  };

  minus.addEventListener('click', () => { if (qty > 1) set(qty - 1); });
  plus.addEventListener('click', () => { if (qty < 10) set(qty + 1); });
}

/* --- cart badge ---------------------------------------------------------- */
function bumpCartCount(delta) {
  const count = document.querySelector('.cart-count');
  if (!count) return;
  count.textContent = String(Number(count.textContent) + delta);
  count.classList.remove('bump');
  void count.offsetWidth;
  count.classList.add('bump');
}

/* --- product page -------------------------------------------------------- */
function initProductPage() {
  const root = document.querySelector('.product-detail');
  if (!root) return;

  const params = new URLSearchParams(window.location.search);
  const product = PRODUCTS[params.get('id')] || PRODUCTS.jacket;

  document.title = product.name + ' — Maison';
  document.getElementById('breadcrumb-category').textContent = product.category;
  document.getElementById('breadcrumb-name').textContent = product.name;

  document.querySelectorAll('.gallery-icon').forEach(i => { i.className = 'gallery-icon ' + product.icon; });
  document.getElementById('gallery-tag').textContent = product.code;

  const thumbs = document.querySelectorAll('.gallery-thumbs button');
  thumbs.forEach(thumb => {
    thumb.addEventListener('click', () => {
      thumbs.forEach(t => t.classList.remove('active'));
      thumb.classList.add('active');
      const main = document.getElementById('gallery-main');
      if (main) {
        main.classList.remove('swap');
        void main.offsetWidth;
        main.classList.add('swap');
      }
    });
  });

  /* pointer spotlight over the main gallery tile */
  const main = document.getElementById('gallery-main');
  if (main && !reducedMotion()) {
    main.addEventListener('pointermove', e => {
      const rect = main.getBoundingClientRect();
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
    priceOld.style.display = '';
    priceSave.textContent = 'економія ' + formatPrice(product.oldPrice - product.price);
    priceSave.style.display = '';
  } else {
    priceOld.style.display = 'none';
    priceSave.style.display = 'none';
  }

  document.getElementById('product-desc').textContent = product.desc;
  document.getElementById('care-text').textContent = product.care;
  document.getElementById('shipping-text').textContent = product.shipping;
  document.getElementById('fit-text').textContent = product.fit;

  const sizeList = document.getElementById('size-list');
  sizeList.innerHTML = product.sizes
    .map((s, i) => '<button type="button" class="' + (i === 0 ? 'active' : '') + '">' + s + '</button>')
    .join('');
  sizeList.addEventListener('click', e => {
    const btn = e.target.closest('button');
    if (!btn) return;
    sizeList.querySelectorAll('button').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
  });

  const colorList = document.getElementById('color-list');
  colorList.innerHTML = product.colors
    .map((c, i) => '<button type="button" class="' + (i === 0 ? 'active' : '') + '">' +
      '<span class="color-dot" style="background:' + c.hex + '" aria-hidden="true"></span>' + c.name +
      '</button>')
    .join('');
  colorList.addEventListener('click', e => {
    const btn = e.target.closest('button');
    if (!btn) return;
    colorList.querySelectorAll('button').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
  });

  initQtyStepper(document.querySelector('.product-info .qty-stepper'));

  const addBtn = document.getElementById('add-to-cart-btn');
  const addNote = document.getElementById('add-note');
  const addLabel = addBtn.textContent;
  let resetTimer = null;
  addBtn.addEventListener('click', () => {
    const qtyEl = document.querySelector('.product-info .qty-stepper span');
    const qty = qtyEl ? Number(qtyEl.textContent) : 1;
    const size = sizeList.querySelector('button.active');
    const color = colorList.querySelector('button.active');

    bumpCartCount(qty);
    addNote.textContent = 'Додано · ' + (size ? size.textContent : '') +
      (color ? ' · ' + color.textContent.trim() : '') + ' · ' + qty + ' шт.';
    addNote.classList.add('show');
    addBtn.innerHTML = 'Додано <i class="fa-solid fa-check" aria-hidden="true"></i>';
    showToast(product.name + ' — у кошику');

    clearTimeout(resetTimer);
    resetTimer = setTimeout(() => {
      addBtn.textContent = addLabel;
      addNote.classList.remove('show');
    }, 2600);
  });

  document.querySelectorAll('.accordion-trigger').forEach(trigger => {
    trigger.addEventListener('click', () => {
      const item = trigger.closest('.accordion-item');
      const wasOpen = item.classList.contains('open');
      document.querySelectorAll('.accordion-item').forEach(i => i.classList.remove('open'));
      item.classList.toggle('open', !wasOpen);
    });
  });

  const relatedGrid = document.getElementById('related-grid');
  if (relatedGrid) {
    const others = Object.keys(PRODUCTS)
      .filter(id => id !== product.id)
      .slice(0, 4)
      .map(id => PRODUCTS[id]);
    relatedGrid.innerHTML = others.map(productCardHTML).join('');
    armReveal(relatedGrid);
  }
}

/* --- cart page ----------------------------------------------------------- */
function updateLineTotal(line) {
  const price = Number(line.dataset.price);
  const qty = Number(line.querySelector('.qty-stepper span').textContent);
  line.querySelector('.cart-line-total').textContent = formatPrice(price * qty);
  recalcCart();
}

function recalcCart() {
  const lines = document.querySelectorAll('.cart-line:not(.removing)');
  const list = document.getElementById('cart-items');
  const empty = document.getElementById('cart-empty');
  const summary = document.getElementById('order-summary');
  const countLabel = document.getElementById('cart-item-count');

  if (countLabel) countLabel.textContent = lines.length + ' ' + pluralizeGoods(lines.length) + ' у кошику';

  if (lines.length === 0) {
    if (empty) empty.style.display = 'block';
    if (summary) summary.style.display = 'none';
    if (list) list.style.display = 'none';
    return;
  }
  if (empty) empty.style.display = 'none';
  if (summary) summary.style.display = '';
  if (list) list.style.display = '';

  let subtotal = 0;
  lines.forEach(line => {
    subtotal += Number(line.dataset.price) * Number(line.querySelector('.qty-stepper span').textContent);
  });

  const discount = window.cartDiscount || 0;
  const discounted = subtotal * (1 - discount);
  const shipping = discounted >= FREE_SHIPPING_FROM ? 0 : SHIPPING_FEE;

  document.getElementById('summary-subtotal').textContent = formatPrice(subtotal);
  const discountRow = document.getElementById('summary-discount-row');
  if (discount > 0) {
    discountRow.style.display = 'flex';
    document.getElementById('summary-discount').textContent = '-' + formatPrice(subtotal * discount);
  } else if (discountRow) {
    discountRow.style.display = 'none';
  }
  document.getElementById('summary-shipping').textContent = shipping === 0 ? 'Безкоштовно' : formatPrice(shipping);
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

  list.querySelectorAll('.cart-line').forEach(line => {
    const stepper = line.querySelector('.qty-stepper');
    initQtyStepper(stepper);
    stepper.addEventListener('qtychange', () => updateLineTotal(line));

    line.querySelector('.remove-btn').addEventListener('click', () => {
      const name = line.querySelector('.cart-line-name').textContent.trim();
      line.style.maxHeight = line.scrollHeight + 'px';
      line.classList.add('removing');
      recalcCart();
      const drop = () => { line.remove(); recalcCart(); };
      if (reducedMotion()) drop();
      else line.addEventListener('animationend', drop, { once: true });
      showToast(name + ' — видалено з кошика');
    });
  });

  recalcCart();

  const promoBtn = document.getElementById('promo-apply');
  if (promoBtn) {
    promoBtn.addEventListener('click', () => {
      const input = document.getElementById('promo-input');
      const msg = document.getElementById('promo-msg');
      const code = input.value.trim().toUpperCase();
      if (code === 'MAISON10') {
        window.cartDiscount = 0.1;
        msg.textContent = 'Промокод застосовано: -10%';
        msg.className = 'promo-msg success';
      } else if (code === '') {
        window.cartDiscount = 0;
        msg.textContent = 'Введіть промокод';
        msg.className = 'promo-msg error';
      } else {
        window.cartDiscount = 0;
        msg.textContent = 'Промокод недійсний';
        msg.className = 'promo-msg error';
      }
      recalcCart();
    });
  }

  const checkoutBtn = document.getElementById('checkout-btn');
  if (checkoutBtn) {
    checkoutBtn.addEventListener('click', () => {
      const msg = document.getElementById('checkout-msg');
      msg.textContent = 'Дякуємо за замовлення! Це демонстраційна версія сайту без реальної оплати.';
      msg.style.display = 'block';
    });
  }

  const suggest = document.getElementById('cart-suggest-grid');
  if (suggest) {
    suggest.innerHTML = ['scarf', 'bag', 'trousers', 'shoes'].map(id => productCardHTML(PRODUCTS[id])).join('');
    armReveal(suggest);
  }
}

/* --- overlays: modal + search ------------------------------------------- */
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
    '<div class="search-panel" role="dialog" aria-modal="true">' +
      '<div class="search-input-row">' +
        '<i class="fa-solid fa-magnifying-glass" aria-hidden="true"></i>' +
        '<input type="text" id="search-input" placeholder="Пошук товарів…" aria-label="Пошук товарів">' +
        '<button type="button" class="search-close" aria-label="Закрити пошук"><i class="fa-solid fa-xmark" aria-hidden="true"></i></button>' +
      '</div>' +
      '<div class="search-results" id="search-results"></div>' +
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

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') { closeModal(); closeSearch(); }
    /* ⌘K / Ctrl+K opens search, like a proper storefront */
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); openSearch(); }
  });
}

function openModal(title, bodyHTML) {
  document.getElementById('modal-title').textContent = title;
  document.getElementById('modal-body').innerHTML = bodyHTML;
  document.getElementById('modal-overlay').classList.add('open');
  document.body.classList.add('modal-open');
  setTimeout(() => document.querySelector('#modal-overlay .modal').focus(), 60);
}
function closeModal() {
  document.getElementById('modal-overlay').classList.remove('open');
  if (!document.getElementById('search-overlay').classList.contains('open')) {
    document.body.classList.remove('modal-open');
  }
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
  document.getElementById('search-overlay').classList.add('open');
  document.body.classList.add('modal-open');
  const input = document.getElementById('search-input');
  document.getElementById('search-results').innerHTML = SEARCH_HINT;
  input.value = '';
  setTimeout(() => input.focus(), 60);
}
function closeSearch() {
  document.getElementById('search-overlay').classList.remove('open');
  if (!document.getElementById('modal-overlay').classList.contains('open')) {
    document.body.classList.remove('modal-open');
  }
}

function searchResultHTML(p) {
  return '<a class="search-result" href="product.html?id=' + p.id + '">' +
    '<div class="search-result-media swatch"><i class="' + p.icon + '" aria-hidden="true"></i></div>' +
    '<div><p class="search-result-name">' + p.name + '</p>' +
    '<p class="search-result-price price">' + formatPrice(p.price) + '</p></div>' +
    '<i class="fa-solid fa-arrow-right search-result-go" aria-hidden="true"></i>' +
  '</a>';
}

function runSearch(query) {
  const results = document.getElementById('search-results');
  const q = query.trim().toLowerCase();
  if (!q) { results.innerHTML = SEARCH_HINT; return; }
  const matches = Object.values(PRODUCTS).filter(p =>
    p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q));
  results.innerHTML = matches.length
    ? matches.map(searchResultHTML).join('')
    : '<p class="search-hint">Нічого не знайдено за запитом «' + query.trim() + '»</p>';
}

function initSearch() {
  document.querySelectorAll('.search-trigger').forEach(btn => btn.addEventListener('click', openSearch));
  const input = document.getElementById('search-input');
  input.addEventListener('input', () => runSearch(input.value));

  document.getElementById('search-results').addEventListener('click', e => {
    const chip = e.target.closest('.search-suggest button');
    if (!chip) return;
    input.value = chip.textContent;
    runSearch(input.value);
    input.focus();
  });
}

/* --- info modals --------------------------------------------------------- */
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
  return '<form id="account-form">' +
    '<label>Email<input type="email" required></label>' +
    '<label>Пароль<input type="password" required minlength="6"></label>' +
    '<button type="submit" class="btn btn-primary btn-block">Увійти</button>' +
    '</form>' +
    '<p class="modal-note">Реєстрація працює тим самим способом.</p>' +
    '<p class="form-msg" id="account-msg">Це демонстраційна версія — вхід і реєстрація не підключені до реального сервера.</p>';
}
function contactModalHTML() {
  return '<form id="contact-form">' +
    '<label>Ім\'я<input type="text" required></label>' +
    '<label>Email<input type="email" required></label>' +
    '<label>Повідомлення<textarea required></textarea></label>' +
    '<button type="submit" class="btn btn-primary btn-block">Надіслати</button>' +
    '</form>' +
    '<p class="form-msg" id="contact-msg">Дякуємо! Це демо-версія, тож повідомлення нікуди не пішло, але в реальному ательє ми відповіли б протягом дня.</p>';
}

function initInfoLinks() {
  document.querySelectorAll('[data-modal]').forEach(el => {
    el.addEventListener('click', e => {
      e.preventDefault();
      const key = el.dataset.modal;

      if (key === 'account') {
        openModal('Увійти в акаунт', accountModalHTML());
        document.getElementById('account-form').addEventListener('submit', ev => {
          ev.preventDefault();
          document.getElementById('account-msg').classList.add('show');
        });
        return;
      }
      if (key === 'contact') {
        openModal('Контакти', contactModalHTML());
        const form = document.getElementById('contact-form');
        form.addEventListener('submit', ev => {
          ev.preventDefault();
          document.getElementById('contact-msg').classList.add('show');
          form.reset();
        });
        return;
      }
      const info = INFO_CONTENT[key];
      if (info) openModal(info.title, info.body);
    });
  });

  document.querySelectorAll('[data-toast]').forEach(el => {
    el.addEventListener('click', e => {
      e.preventDefault();
      showToast(el.dataset.toast);
    });
  });
}

/* --- toast --------------------------------------------------------------- */
function showToast(message) {
  let toast = document.getElementById('toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast';
    toast.className = 'toast';
    toast.setAttribute('role', 'status');
    document.body.appendChild(toast);
  }
  toast.innerHTML = '<i class="fa-solid fa-circle-check" aria-hidden="true"></i><span></span>';
  toast.querySelector('span').textContent = message;
  toast.classList.add('show');
  clearTimeout(window._toastTimer);
  window._toastTimer = setTimeout(() => toast.classList.remove('show'), 2800);
}

/* --- newsletter + wishlist ---------------------------------------------- */
function initNewsletterForms() {
  document.querySelectorAll('.newsletter-form').forEach(form => {
    const btn = form.querySelector('button');
    const input = form.querySelector('input');
    const submit = () => {
      const email = input.value.trim();
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { showToast('Введіть коректний email'); return; }
      showToast('Дякуємо за підписку! Знижка 10% додана на пошту.');
      input.value = '';
    };
    btn.addEventListener('click', submit);
    input.addEventListener('keydown', e => { if (e.key === 'Enter') submit(); });
  });
}

function initWishlist() {
  const btn = document.getElementById('wishlist-btn');
  if (!btn) return;
  btn.addEventListener('click', () => {
    const icon = btn.querySelector('i');
    const nowActive = icon.classList.toggle('fa-solid');
    icon.classList.toggle('fa-regular', !nowActive);
    btn.classList.toggle('active', nowActive);
    showToast(nowActive ? 'Додано в обране' : 'Видалено з обраного');
  });
}

/* --- page transitions ---------------------------------------------------- */
function initPageTransitions() {
  if (reducedMotion()) return;
  document.addEventListener('click', e => {
    const link = e.target.closest('a[href]');
    if (!link || e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
    if (link.target === '_blank' || link.hasAttribute('download')) return;

    const href = link.getAttribute('href');
    if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:')) return;

    const url = new URL(href, window.location.href);
    if (url.origin !== window.location.origin || !url.pathname.endsWith('.html')) return;
    if (url.pathname === window.location.pathname && url.search === window.location.search) return;

    e.preventDefault();
    const veil = document.getElementById('page-veil');
    if (veil) veil.classList.add('show');
    setTimeout(() => { window.location.href = url.href; }, 260);
  });
}

/* --- boot ---------------------------------------------------------------- */
document.addEventListener('DOMContentLoaded', () => {
  injectOverlays();
  initTheme();
  initMobileMenu();
  initSearch();
  initInfoLinks();
  initNewsletterForms();
  initWishlist();

  initReveal();
  renderBestsellers();
  initProductPage();
  initCartPage();

  initCounters();
  initScrollChrome();
  initHeroMotion();
  initCountdown();
  initPageTransitions();
});

/* a bfcache restore would otherwise leave the exit veil covering the page */
window.addEventListener('pageshow', () => {
  const veil = document.getElementById('page-veil');
  if (veil) veil.classList.remove('show');
});
