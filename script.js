const PRODUCTS = {
  jacket: {
    id: 'jacket', category: 'Верхній одяг', name: 'Куртка оверсайз',
    price: 3450, oldPrice: null, badge: 'new',
    code: '№ 012', material: 'ВОВНА 60%', stock: 8,
    icon: 'fa-solid fa-vest',
    desc: 'Просторий крій, щільна тканина з легким начосом і мінімалістична фурнітура. Куртка, яка однаково добре виглядає з денімом і зі строгими брюками.',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: ['Чорний', 'Бежевий', 'Оливковий'],
    care: 'Пране при 30°C, не відбілювати, прасувати з виворітної сторони при середній температурі. Не сушити в сушильній машині.',
    shipping: 'Доставка Новою поштою — 1–3 дні. Безкоштовно при замовленні від 2 000 ₴. Обмін і повернення протягом 30 днів у первісному вигляді.'
  },
  shirt: {
    id: 'shirt', category: 'Сорочки', name: 'Лляна сорочка',
    price: 960, oldPrice: 1200, badge: 'sale',
    code: '№ 004', material: 'ЛЬОН 100%', stock: 23,
    icon: 'fa-solid fa-shirt',
    desc: '100% льон щільного плетіння. Вільний крій, накладні кишені, перламутрові ґудзики. Дихаюча тканина для теплої погоди.',
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Білий', 'Блакитний', 'Хакі'],
    care: 'Машинне прання при 30°C у делікатному режимі. Прасувати вологою, поки тканина ще волога.',
    shipping: 'Доставка Новою поштою — 1–3 дні. Безкоштовно при замовленні від 2 000 ₴. Обмін і повернення протягом 30 днів.'
  },
  dress: {
    id: 'dress', category: 'Сукні', name: 'Сукня міді',
    price: 1890, oldPrice: null, badge: null,
    code: '№ 021', material: 'ВІСКОЗА 95%', stock: 14,
    icon: 'fa-solid fa-person-dress',
    desc: 'Приталений силует, розкльошена спідниця довжини міді, прихована блискавка ззаду. З віскози з легким матовим блиском.',
    sizes: ['XS', 'S', 'M', 'L'],
    colors: ['Чорний', 'Бордовий'],
    care: 'Делікатне ручне прання при 30°C або хімчистка. Не викручувати, сушити в горизонтальному положенні.',
    shipping: 'Доставка Новою поштою — 1–3 дні. Безкоштовно при замовленні від 2 000 ₴. Обмін і повернення протягом 30 днів.'
  },
  shoes: {
    id: 'shoes', category: 'Взуття', name: 'Кросівки класик',
    price: 2100, oldPrice: null, badge: null,
    code: '№ 038', material: 'ШКІРА 100%', stock: 19,
    icon: 'fa-solid fa-shoe-prints',
    desc: 'Мінімалістичні шкіряні кросівки на гумовій підошві. Класична колодка, зручна для щоденного носіння.',
    sizes: ['38', '39', '40', '41', '42', '43', '44'],
    colors: ['Білий', 'Чорний'],
    care: 'Протирати вологою тканиною. Використовувати водовідштовхувальний спрей для шкіри раз на сезон.',
    shipping: 'Доставка Новою поштою — 1–3 дні. Безкоштовно при замовленні від 2 000 ₴. Обмін і повернення протягом 30 днів.'
  }
};

function formatPrice(n) {
  return n.toLocaleString('uk-UA') + ' ₴';
}

function pluralizeGoods(n) {
  const mod10 = n % 10, mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return 'товар';
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) return 'товари';
  return 'товарів';
}

function badgeHTML(product) {
  if (product.badge === 'sale' && product.oldPrice) {
    const pct = Math.round((1 - product.price / product.oldPrice) * 100);
    return '<span class="badge badge-sale">-' + pct + '%</span>';
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
  return '<a class="product-card" href="product.html?id=' + product.id + '">' +
    '<div class="product-media swatch">' + badgeHTML(product) +
      '<i class="' + product.icon + '" aria-hidden="true"></i>' +
      '<span class="swatch-tag">' + product.code + '</span>' +
    '</div>' +
    '<p class="product-name">' + product.name + '</p>' +
    '<p class="product-price price">' + priceHTML(product) + '</p>' +
  '</a>';
}

function initMobileMenu() {
  const toggle = document.querySelector('.menu-toggle');
  const menu = document.querySelector('.mobile-menu');
  const close = document.querySelector('.mobile-menu-close');
  if (!toggle || !menu) return;
  toggle.addEventListener('click', () => menu.classList.add('open'));
  if (close) close.addEventListener('click', () => menu.classList.remove('open'));
  menu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => menu.classList.remove('open')));
}

function renderBestsellers() {
  const grid = document.getElementById('bestsellers-grid');
  if (!grid) return;
  const order = ['shirt', 'jacket', 'dress', 'shoes'];
  grid.innerHTML = order.map(id => productCardHTML(PRODUCTS[id])).join('');
}

function initQtyStepper(stepper) {
  if (!stepper) return;
  const display = stepper.querySelector('span');
  const minus = stepper.querySelector('.qty-minus');
  const plus = stepper.querySelector('.qty-plus');
  let qty = Number(display.textContent) || 1;
  minus.addEventListener('click', () => {
    if (qty > 1) { qty -= 1; display.textContent = String(qty); stepper.dispatchEvent(new CustomEvent('qtychange')); }
  });
  plus.addEventListener('click', () => {
    if (qty < 10) { qty += 1; display.textContent = String(qty); stepper.dispatchEvent(new CustomEvent('qtychange')); }
  });
}

function initProductPage() {
  const root = document.querySelector('.product-detail');
  if (!root) return;

  const params = new URLSearchParams(window.location.search);
  const requested = params.get('id');
  const product = PRODUCTS[requested] || PRODUCTS.jacket;

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
    });
  });

  document.getElementById('product-badge-row').innerHTML = badgeHTML(product);
  document.getElementById('product-name').textContent = product.name;
  document.getElementById('stock-note').textContent = 'У наявності: ' + product.stock + ' шт. · ' + product.material;

  document.getElementById('price-now').textContent = formatPrice(product.price);
  const priceOld = document.getElementById('price-old');
  if (product.oldPrice) {
    priceOld.textContent = formatPrice(product.oldPrice);
    priceOld.style.display = '';
  } else {
    priceOld.style.display = 'none';
  }

  document.getElementById('product-desc').textContent = product.desc;
  document.getElementById('care-text').textContent = product.care;
  document.getElementById('shipping-text').textContent = product.shipping;

  const sizeList = document.getElementById('size-list');
  sizeList.innerHTML = product.sizes.map((s, i) => '<button type="button" class="' + (i === 0 ? 'active' : '') + '">' + s + '</button>').join('');
  sizeList.addEventListener('click', e => {
    const btn = e.target.closest('button');
    if (!btn) return;
    sizeList.querySelectorAll('button').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
  });

  const colorList = document.getElementById('color-list');
  colorList.innerHTML = product.colors.map((c, i) => '<button type="button" class="' + (i === 0 ? 'active' : '') + '">' + c + '</button>').join('');
  colorList.addEventListener('click', e => {
    const btn = e.target.closest('button');
    if (!btn) return;
    colorList.querySelectorAll('button').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
  });

  initQtyStepper(document.querySelector('.product-info .qty-stepper'));

  const addBtn = document.getElementById('add-to-cart-btn');
  const addNote = document.getElementById('add-note');
  addBtn.addEventListener('click', () => {
    const qtyEl = document.querySelector('.product-info .qty-stepper span');
    const qty = qtyEl ? Number(qtyEl.textContent) : 1;
    const count = document.querySelector('.cart-count');
    if (count) count.textContent = String(Number(count.textContent) + qty);
    addNote.textContent = 'Додано в кошик · ' + qty + ' шт.';
    const original = addBtn.textContent;
    addBtn.textContent = 'Додано';
    setTimeout(() => { addBtn.textContent = original; addNote.textContent = ''; }, 2400);
  });

  document.querySelectorAll('.accordion-trigger').forEach(trigger => {
    trigger.addEventListener('click', () => {
      const item = trigger.closest('.accordion-item');
      const panel = item.querySelector('.accordion-panel');
      const isOpen = item.classList.contains('open');
      document.querySelectorAll('.accordion-item').forEach(i => {
        i.classList.remove('open');
        i.querySelector('.accordion-panel').style.maxHeight = null;
      });
      if (!isOpen) {
        item.classList.add('open');
        panel.style.maxHeight = panel.scrollHeight + 'px';
      }
    });
  });

  const relatedGrid = document.getElementById('related-grid');
  if (relatedGrid) {
    const others = Object.keys(PRODUCTS).filter(id => id !== product.id).map(id => PRODUCTS[id]);
    relatedGrid.innerHTML = others.map(productCardHTML).join('');
  }
}

function updateLineTotal(line) {
  const price = Number(line.dataset.price);
  const qty = Number(line.querySelector('.qty-stepper span').textContent);
  line.querySelector('.cart-line-total').textContent = formatPrice(price * qty);
  recalcCart();
}

function recalcCart() {
  const lines = document.querySelectorAll('.cart-line');
  const list = document.getElementById('cart-items');
  const empty = document.getElementById('cart-empty');
  const summary = document.getElementById('order-summary');
  const countLabel = document.getElementById('cart-item-count');

  if (countLabel) countLabel.textContent = lines.length + ' ' + pluralizeGoods(lines.length);

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
    const price = Number(line.dataset.price);
    const qty = Number(line.querySelector('.qty-stepper span').textContent);
    subtotal += price * qty;
  });

  const discount = window.cartDiscount || 0;
  const discounted = subtotal * (1 - discount);
  const shipping = discounted >= 2000 ? 0 : 99;
  const total = discounted + shipping;

  document.getElementById('summary-subtotal').textContent = formatPrice(subtotal);
  const discountRow = document.getElementById('summary-discount-row');
  if (discount > 0) {
    discountRow.style.display = 'flex';
    document.getElementById('summary-discount').textContent = '-' + formatPrice(subtotal * discount);
  } else if (discountRow) {
    discountRow.style.display = 'none';
  }
  document.getElementById('summary-shipping').textContent = shipping === 0 ? 'Безкоштовно' : formatPrice(shipping);
  document.getElementById('summary-total').textContent = formatPrice(total);
}

function initCartPage() {
  const list = document.getElementById('cart-items');
  if (!list) return;

  list.querySelectorAll('.cart-line').forEach(line => {
    const stepper = line.querySelector('.qty-stepper');
    initQtyStepper(stepper);
    stepper.addEventListener('qtychange', () => updateLineTotal(line));
    line.querySelector('.remove-btn').addEventListener('click', () => {
      line.remove();
      recalcCart();
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
      msg.style.display = 'block';
      msg.textContent = 'Дякуємо за замовлення! Це демонстраційна версія сайту без реальної оплати.';
    });
  }
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
    '<div class="search-panel" role="dialog" aria-modal="true">' +
      '<div class="search-input-row">' +
        '<i class="fa-solid fa-magnifying-glass" aria-hidden="true"></i>' +
        '<input type="text" id="search-input" placeholder="Пошук товарів…" aria-label="Пошук товарів">' +
        '<button type="button" class="search-close" aria-label="Закрити пошук"><i class="fa-solid fa-xmark" aria-hidden="true"></i></button>' +
      '</div>' +
      '<div class="search-results" id="search-results"></div>' +
    '</div>';
  document.body.appendChild(search);

  modal.addEventListener('click', e => { if (e.target === modal) closeModal(); });
  search.addEventListener('click', e => { if (e.target === search) closeSearch(); });
  modal.querySelector('.modal-close').addEventListener('click', closeModal);
  search.querySelector('.search-close').addEventListener('click', closeSearch);

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') { closeModal(); closeSearch(); }
  });
}

function openModal(title, bodyHTML) {
  document.getElementById('modal-title').textContent = title;
  document.getElementById('modal-body').innerHTML = bodyHTML;
  document.getElementById('modal-overlay').classList.add('open');
  document.body.classList.add('modal-open');
}
function closeModal() {
  document.getElementById('modal-overlay').classList.remove('open');
  document.body.classList.remove('modal-open');
}
function openSearch() {
  document.getElementById('search-overlay').classList.add('open');
  document.body.classList.add('modal-open');
  const input = document.getElementById('search-input');
  document.getElementById('search-results').innerHTML = '<p class="search-hint">Почніть вводити назву товару</p>';
  input.value = '';
  setTimeout(() => input.focus(), 50);
}
function closeSearch() {
  document.getElementById('search-overlay').classList.remove('open');
  document.body.classList.remove('modal-open');
}
function searchResultHTML(p) {
  return '<a class="search-result" href="product.html?id=' + p.id + '">' +
    '<div class="search-result-media swatch"><i class="' + p.icon + '" aria-hidden="true"></i></div>' +
    '<div><p class="search-result-name">' + p.name + '</p><p class="search-result-price price">' + formatPrice(p.price) + '</p></div>' +
  '</a>';
}
function initSearch() {
  document.querySelectorAll('.search-trigger').forEach(btn => btn.addEventListener('click', openSearch));
  const input = document.getElementById('search-input');
  input.addEventListener('input', () => {
    const q = input.value.trim().toLowerCase();
    const results = document.getElementById('search-results');
    if (!q) { results.innerHTML = '<p class="search-hint">Почніть вводити назву товару</p>'; return; }
    const matches = Object.values(PRODUCTS).filter(p => p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q));
    results.innerHTML = matches.length
      ? matches.map(searchResultHTML).join('')
      : '<p class="search-hint">Нічого не знайдено за запитом «' + input.value.trim() + '»</p>';
  });
}

const INFO_CONTENT = {
  shipping: {
    title: 'Доставка та оплата',
    body: '<p>Доставляємо Новою поштою по всій Україні — 1–3 дні. Безкоштовно при замовленні від 2 000 ₴, інакше 99 ₴ за відправлення.</p><p>Оплата карткою онлайн одразу після оформлення або готівкою чи карткою при отриманні у відділенні.</p>'
  },
  returns: {
    title: 'Повернення та обмін',
    body: '<p>Поверніть або обміняйте товар протягом 30 днів з дня отримання — якщо він у первісному вигляді, з бирками і без слідів носіння.</p><p>Кошти повертаються на карту протягом 5 робочих днів після того, як ми отримаємо посилку.</p>'
  },
  sizes: {
    title: 'Розмірна сітка',
    body: '<table class="size-table"><thead><tr><th>Розмір</th><th>Груди, см</th><th>Талія, см</th><th>Стегна, см</th></tr></thead><tbody>' +
      '<tr><td>XS</td><td>82–85</td><td>62–65</td><td>88–91</td></tr>' +
      '<tr><td>S</td><td>86–89</td><td>66–69</td><td>92–95</td></tr>' +
      '<tr><td>M</td><td>90–94</td><td>70–74</td><td>96–100</td></tr>' +
      '<tr><td>L</td><td>95–99</td><td>75–79</td><td>101–105</td></tr>' +
      '<tr><td>XL</td><td>100–105</td><td>80–85</td><td>106–111</td></tr>' +
      '<tr><td>XXL</td><td>106–112</td><td>86–92</td><td>112–118</td></tr>' +
      '</tbody></table>'
  },
  about: {
    title: 'Про ательє',
    body: '<p>Maison — ательє готового одягу. Ми віримо, що добрий крій не має бути одноразовим захопленням: працюємо з натуральними тканинами й перевіреними виробництвами, щоб речі тримали форму не один сезон.</p><p>Кожна модель проходить кілька приміряннь на реальних людях, перш ніж потрапити у колекцію.</p>'
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

function showToast(message) {
  let toast = document.getElementById('toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast';
    toast.className = 'toast';
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(window._toastTimer);
  window._toastTimer = setTimeout(() => toast.classList.remove('show'), 2600);
}

function initNewsletterForms() {
  document.querySelectorAll('.newsletter-form').forEach(form => {
    const btn = form.querySelector('button');
    const input = form.querySelector('input');
    btn.addEventListener('click', () => {
      const email = input.value.trim();
      const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
      if (!valid) { showToast('Введіть коректний email'); return; }
      showToast('Дякуємо за підписку! Знижка 10% додана на пошту.');
      input.value = '';
    });
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

document.addEventListener('DOMContentLoaded', () => {
  injectOverlays();
  initMobileMenu();
  initSearch();
  initInfoLinks();
  initNewsletterForms();
  initWishlist();
  renderBestsellers();
  initProductPage();
  initCartPage();
});
