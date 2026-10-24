/* ---------- FreshCart Application Logic ---------- */
const $ = id => document.getElementById(id);
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const money = n => '₹' + (Math.round(n * 100) / 100).toFixed(2).replace(/\.00$/, '');
const load = (k, d) => { try { const v = JSON.parse(localStorage.getItem(k)); return v ?? d; } catch { return d; } };
const save = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} };

const ADMIN_PASSWORD = 'admin123';
const FREE_DELIVERY_ABOVE = 299, DELIVERY_FEE = 30;
const STATUSES = ['Placed', 'Packed', 'Out for delivery', 'Delivered'];

// Coupons available in the store
const AVAILABLE_COUPONS = [
  { code: 'FRESH50', minSubtotal: 399, discount: 50, type: 'flat', desc: '₹50 OFF on orders above ₹399' },
  { code: 'FREEDEL', minSubtotal: 0, discount: DELIVERY_FEE, type: 'delivery', desc: 'Free delivery on your order' },
  { code: 'FIRST100', minSubtotal: 599, discount: 100, type: 'flat', desc: '₹100 OFF on orders above ₹599' },
  { code: 'VEGGIE10', minSubtotal: 200, discount: 0.10, maxDiscount: 80, type: 'percent', desc: '10% OFF up to ₹80 above ₹200' }
];

const DEFAULT_PRODUCTS = [
  { id: 1, name: 'Tomato', emoji: '🍅', category: 'vegetables', price: 30, unit: 'kg', stock: 50, img: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=400&q=80' },
  { id: 2, name: 'Potato', emoji: '🥔', category: 'vegetables', price: 28, unit: 'kg', stock: 80, img: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=400&q=80' },
  { id: 3, name: 'Onion', emoji: '🧅', category: 'vegetables', price: 35, unit: 'kg', stock: 80, img: 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?auto=format&fit=crop&w=400&q=80' },
  { id: 4, name: 'Carrot', emoji: '🥕', category: 'vegetables', price: 45, unit: 'kg', stock: 40, img: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?auto=format&fit=crop&w=400&q=80' },
  { id: 5, name: 'Spinach', emoji: '🥬', category: 'leafy greens', price: 20, unit: 'bunch', stock: 30, img: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&w=400&q=80' },
  { id: 6, name: 'Coriander', emoji: '🌿', category: 'leafy greens', price: 15, unit: 'bunch', stock: 40, img: 'https://images.unsplash.com/photo-1515543237350-b3eea1ec8082?auto=format&fit=crop&w=400&q=80' },
  { id: 7, name: 'Cabbage', emoji: '🥬', category: 'vegetables', price: 25, unit: 'pc', stock: 30, img: 'https://images.unsplash.com/photo-1594282486552-05b4d80fbb9f?auto=format&fit=crop&w=400&q=80' },
  { id: 8, name: 'Cauliflower', emoji: '🥦', category: 'vegetables', price: 40, unit: 'pc', stock: 25, img: 'https://images.unsplash.com/photo-1568584711075-3d021a7c3ca3?auto=format&fit=crop&w=400&q=80' },
  { id: 9, name: 'Broccoli', emoji: '🥦', category: 'exotic', price: 90, unit: 'pc', stock: 15, img: 'https://images.unsplash.com/photo-1459411621453-7b03977f4bfc?auto=format&fit=crop&w=400&q=80' },
  { id: 10, name: 'Brinjal', emoji: '🍆', category: 'vegetables', price: 38, unit: 'kg', stock: 35, img: 'https://images.unsplash.com/photo-1528825871115-3581a5387919?auto=format&fit=crop&w=400&q=80' },
  { id: 11, name: 'Green Chilli', emoji: '🌶️', category: 'vegetables', price: 60, unit: 'kg', stock: 20, img: 'https://images.unsplash.com/photo-1588252303782-cb80119abd6d?auto=format&fit=crop&w=400&q=80' },
  { id: 12, name: 'Cucumber', emoji: '🥒', category: 'vegetables', price: 32, unit: 'kg', stock: 40, img: 'https://images.unsplash.com/photo-1449300079323-02e209d9d3a6?auto=format&fit=crop&w=400&q=80' },
  { id: 13, name: 'Capsicum', emoji: '🫑', category: 'vegetables', price: 70, unit: 'kg', stock: 25, img: 'https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?auto=format&fit=crop&w=400&q=80' },
  { id: 14, name: 'Sweet Corn', emoji: '🌽', category: 'vegetables', price: 20, unit: 'pc', stock: 50, img: 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?auto=format&fit=crop&w=400&q=80' },
  { id: 15, name: 'Garlic', emoji: '🧄', category: 'vegetables', price: 160, unit: 'kg', stock: 20, img: 'https://images.unsplash.com/photo-1540148426945-6cf22a6b2383?auto=format&fit=crop&w=400&q=80' },
  { id: 16, name: 'Banana', emoji: '🍌', category: 'fruits', price: 50, unit: 'dozen', stock: 40, img: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&w=400&q=80' },
  { id: 17, name: 'Apple', emoji: '🍎', category: 'fruits', price: 160, unit: 'kg', stock: 40, img: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=400&q=80' },
  { id: 18, name: 'Orange', emoji: '🍊', category: 'fruits', price: 90, unit: 'kg', stock: 35, img: 'https://images.unsplash.com/photo-1547514701-42782101795e?auto=format&fit=crop&w=400&q=80' },
  { id: 19, name: 'Mango', emoji: '🥭', category: 'fruits', price: 130, unit: 'kg', stock: 30, img: 'https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&w=400&q=80' },
  { id: 20, name: 'Grapes', emoji: '🍇', category: 'fruits', price: 110, unit: 'kg', stock: 25, img: 'https://images.unsplash.com/photo-1537640538966-79f369143f8f?auto=format&fit=crop&w=400&q=80' },
  { id: 21, name: 'Watermelon', emoji: '🍉', category: 'fruits', price: 25, unit: 'kg', stock: 30, img: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=400&q=80' },
  { id: 22, name: 'Pineapple', emoji: '🍍', category: 'fruits', price: 60, unit: 'pc', stock: 20, img: 'https://images.unsplash.com/photo-1550258987-190a2d41a8ba?auto=format&fit=crop&w=400&q=80' },
  { id: 23, name: 'Strawberry', emoji: '🍓', category: 'exotic', price: 120, unit: 'box', stock: 12, img: 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?auto=format&fit=crop&w=400&q=80' },
  { id: 24, name: 'Lemon', emoji: '🍋', category: 'fruits', price: 80, unit: 'kg', stock: 30, img: 'https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?auto=format&fit=crop&w=400&q=80' }
];

const API_BASE = window.location.origin.includes('localhost:8080') ? '/api' : 'http://localhost:8080/api';
let isBackendConnected = false;

async function checkBackend() {
  try {
    const res = await fetch(`${API_BASE}/products`, { signal: AbortSignal.timeout(2500) });
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        products = data;
        isBackendConnected = true;
      }
    }
  } catch (err) {
    isBackendConnected = false;
  }

  const badge = $('backendBadge');
  if (badge) {
    if (isBackendConnected) {
      badge.textContent = '🟢 Spring Boot (MySQL)';
      badge.style.background = '#1b5e20';
      badge.title = 'Connected to Java Spring Boot REST API & MySQL Database (freshcart_db)';
    } else {
      badge.textContent = '🟠 Offline Demo';
      badge.style.background = '#e65100';
      badge.title = 'Running in standalone browser localStorage mode';
    }
  }

  if (isBackendConnected) {
    try {
      const oRes = await fetch(`${API_BASE}/orders`);
      if (oRes.ok) {
        const oData = await oRes.json();
        if (Array.isArray(oData)) {
          orders = oData.map(o => ({
            ...o,
            customer: {
              name: o.customerName,
              phone: o.customerPhone,
              pin: o.customerPin,
              address: o.customerAddress
            },
            date: o.orderDate
          }));
        }
      }
    } catch {}
  }
  renderShop();
}

async function refreshBackendData() {
  if (!isBackendConnected) return;
  try {
    const [pRes, oRes] = await Promise.all([
      fetch(`${API_BASE}/products`),
      fetch(`${API_BASE}/orders`)
    ]);
    if (pRes.ok) products = await pRes.json();
    if (oRes.ok) {
      const oData = await oRes.json();
      orders = oData.map(o => ({
        ...o,
        customer: {
          name: o.customerName,
          phone: o.customerPhone,
          pin: o.customerPin,
          address: o.customerAddress
        },
        date: o.orderDate
      }));
    }
  } catch {}
}

let products = load('fc_products', null);
if (!products || !products[0]?.img) {
  products = DEFAULT_PRODUCTS;
  save('fc_products', products);
} else {
  // Sync images if any default product is missing its photo URL
  products.forEach(p => {
    if (!p.img) {
      const def = DEFAULT_PRODUCTS.find(d => d.name.toLowerCase() === p.name.toLowerCase());
      if (def && def.img) p.img = def.img;
    }
  });
  save('fc_products', products);
}
let cart = load('fc_cart', {});            // { productId: qty }
let orders = load('fc_orders', []);
let appliedCoupon = load('fc_coupon', null);
let isAdmin = false;
let category = 'all';
let adminTab = 'orders';
let chosenSlot = null;
let currentPayMode = 'Cash on delivery';
let qrTimerInterval = null;
let upiVerified = false;

const step = p => p.unit === 'kg' ? 0.5 : 1;
const prod = id => products.find(p => p.id == id);
const qtyLabel = (q, u) => q + ' ' + u;

/* ---------- Navigation & Toasts ---------- */
function go(view) {
  ['shop', 'orders', 'admin'].forEach(v => {
    $('view-' + v).classList.toggle('hidden', v !== view);
    $('nav-' + v).classList.toggle('active', v === view);
  });
  if (view === 'shop') renderShop();
  if (view === 'orders') renderOrders();
  if (view === 'admin') renderAdmin();
  window.scrollTo(0, 0);
}

function toast(msg) {
  const t = document.createElement('div');
  t.className = 'toast';
  t.textContent = msg;
  document.body.appendChild(t);
  setTimeout(() => t.remove(), 2400);
}

/* ---------- Promo & Coupon System ---------- */
function renderCouponBanner() {
  const el = $('couponBanner');
  if (!el) return;
  el.innerHTML = AVAILABLE_COUPONS.map(c => `
    <div class="coupon-tag-pill" title="Click to apply" onclick="applyQuickCoupon('${c.code}')">
      <span>🏷️</span> <b>${c.code}</b> <span>• ${c.desc}</span>
    </div>
  `).join('');
}

function applyQuickCoupon(code) {
  if (cartItems().length === 0) {
    appliedCoupon = code;
    save('fc_coupon', appliedCoupon);
    toast(`Coupon ${code} selected! Add items to cart.`);
    return;
  }
  applyCoupon(code);
}

function applyCoupon(code) {
  code = (code || '').trim().toUpperCase();
  if (!code) { toast('Please enter a coupon code.'); return false; }
  const c = AVAILABLE_COUPONS.find(x => x.code === code);
  if (!c) { toast('Invalid coupon code.'); return false; }
  
  const sub = cartItems().reduce((s, x) => s + x.p.price * x.q, 0);
  if (sub < c.minSubtotal) {
    toast(`Add ${money(c.minSubtotal - sub)} more to activate ${code}`);
    return false;
  }
  appliedCoupon = code;
  save('fc_coupon', appliedCoupon);
  toast(`Coupon ${code} applied successfully! 🎉`);
  if ($('cartLayer').innerHTML) openCart();
  return true;
}

function removeCoupon() {
  appliedCoupon = null;
  save('fc_coupon', null);
  toast('Coupon removed.');
  if ($('cartLayer').innerHTML) openCart();
}

/* ---------- Shop View ---------- */
function renderShop() {
  renderCouponBanner();
  const cats = ['all', ...new Set(products.map(p => p.category))];
  $('chips').innerHTML = cats.map(c =>
    `<button class="chip ${c === category ? 'active' : ''}" onclick="setCat('${esc(c)}')">${c === 'all' ? 'All' : esc(c[0].toUpperCase() + c.slice(1))}</button>`).join('');

  const q = ($('q') ? $('q').value.trim().toLowerCase() : '');
  const inStockOnly = $('inStockOnly') ? $('inStockOnly').checked : false;
  const sortBy = $('sortBy') ? $('sortBy').value : 'featured';

  let list = products.filter(p => {
    const matchCat = (category === 'all' || p.category.toLowerCase() === category.toLowerCase());
    const matchQuery = (!q || p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q));
    const matchStock = (!inStockOnly || p.stock > 0);
    return matchCat && matchQuery && matchStock;
  });

  // Sorting
  if (sortBy === 'price-asc') list.sort((a, b) => a.price - b.price);
  else if (sortBy === 'price-desc') list.sort((a, b) => b.price - a.price);
  else if (sortBy === 'name-asc') list.sort((a, b) => a.name.localeCompare(b.name));

  if ($('productCount')) {
    $('productCount').textContent = `Showing ${list.length} item${list.length === 1 ? '' : 's'}`;
  }

  $('grid').innerHTML = list.length ? list.map(card).join('') : '<div class="empty" style="grid-column:1/-1">No products found 🥕</div>';
  updateCartCount();
}

function setCat(c) {
  category = c;
  renderShop();
}

function card(p) {
  const q = cart[p.id] || 0;
  const action = p.stock <= 0
    ? `<button class="add" disabled>Out of stock</button>`
    : q > 0
      ? `<div class="stepper"><button onclick="change(${p.id},-1)">−</button><span>${qtyLabel(q, p.unit)}</span><button onclick="change(${p.id},1)">+</button></div>`
      : `<button class="add" onclick="change(${p.id},1)">Add</button>`;

  const visual = p.img
    ? `<img src="${esc(p.img)}" alt="${esc(p.name)}" class="pimg" onerror="this.onerror=null;this.replaceWith(Object.assign(document.createElement('div'),{className:'emoji',textContent:'${esc(p.emoji)}'}))">`
    : `<div class="emoji">${esc(p.emoji)}</div>`;

  return `<div class="card">${visual}
    <h3>${esc(p.name)}</h3><div class="cat">${esc(p.category)}</div>
    <div class="price">${money(p.price)} <small>/ ${esc(p.unit)}</small></div>
    <div class="low">${p.stock > 0 && p.stock <= 10 ? 'Only ' + p.stock + ' left' : ''}</div>${action}</div>`;
}

/* ---------- Cart Operations ---------- */
function change(id, dir) {
  const p = prod(id);
  if (!p) return;
  let q = (cart[id] || 0) + dir * step(p);
  q = Math.round(q * 10) / 10;
  if (q > p.stock) { toast('Only ' + p.stock + ' ' + p.unit + ' in stock'); return; }
  if (q <= 0) delete cart[id];
  else cart[id] = q;

  save('fc_cart', cart);
  renderShop();
  if ($('cartLayer').innerHTML) openCart();
}

function cartItems() {
  return Object.keys(cart).map(id => ({ p: prod(id), q: cart[id] })).filter(x => x.p);
}

function totals() {
  const sub = cartItems().reduce((s, x) => s + x.p.price * x.q, 0);
  let baseFee = sub === 0 ? 0 : (sub >= FREE_DELIVERY_ABOVE ? 0 : DELIVERY_FEE);
  let discount = 0;
  let fee = baseFee;
  let activeCoupon = null;

  if (appliedCoupon && sub > 0) {
    const c = AVAILABLE_COUPONS.find(x => x.code === appliedCoupon);
    if (c && sub >= c.minSubtotal) {
      activeCoupon = c;
      if (c.type === 'flat') {
        discount = Math.min(c.discount, sub);
      } else if (c.type === 'delivery') {
        discount = baseFee;
        fee = 0;
      } else if (c.type === 'percent') {
        discount = Math.min(Math.round(sub * c.discount), c.maxDiscount || Infinity);
      }
    }
  }

  const total = Math.max(0, sub - (activeCoupon && activeCoupon.type !== 'delivery' ? discount : 0) + fee);
  return { sub, baseFee, fee, discount, activeCoupon, total };
}

function updateCartCount() {
  $('cartCount').textContent = cartItems().length;
}

function openCart() {
  const items = cartItems(), t = totals();
  const couponBadge = t.activeCoupon ? `
    <div class="coupon-active-badge">
      <span>🏷️ Code <b>${esc(t.activeCoupon.code)}</b> applied (-${money(t.discount)})</span>
      <button class="coupon-remove-btn" onclick="removeCoupon()">✕</button>
    </div>` : `
    <div class="coupon-input-group">
      <input id="cartCouponInput" placeholder="Enter coupon (e.g. FRESH50)" value="${esc(appliedCoupon || '')}">
      <button class="coupon-apply-btn" onclick="applyCoupon($('cartCouponInput').value)">Apply</button>
    </div>
    <div class="coupon-list-hint">Available: <b>FRESH50</b> (₹50 off &gt; ₹399) • <b>FREEDEL</b> (Free Delivery)</div>`;

  $('cartLayer').innerHTML = `<div class="overlay" onclick="closeCart()"></div>
  <div class="drawer">
    <header><b>Your Cart (${items.length})</b><button style="background:none;color:#fff;font-size:22px" onclick="closeCart()">✕</button></header>
    <div class="body">${items.length ? items.map(x => `<div class="crow">
      ${x.p.img ? `<img src="${esc(x.p.img)}" alt="${esc(x.p.name)}" class="cart-thumb" onerror="this.outerHTML='<div class=\\'e\\'>${esc(x.p.emoji)}</div>'">` : `<div class="e">${esc(x.p.emoji)}</div>`}
      <div class="info"><b>${esc(x.p.name)}</b><small>${money(x.p.price)} / ${esc(x.p.unit)}</small></div>
      <div class="mini"><button onclick="change(${x.p.id},-1)">−</button><span>${qtyLabel(x.q, x.p.unit)}</span><button onclick="change(${x.p.id},1)">+</button></div>
      <b style="min-width:60px;text-align:right">${money(x.p.price * x.q)}</b></div>`).join('') : '<div class="empty">Your cart is empty 🛒</div>'}
    </div>
    <div class="foot">
      <div class="line"><span>Subtotal</span><span>${money(t.sub)}</span></div>
      ${t.discount > 0 ? `<div class="line" style="color:var(--green)"><span>Discount</span><span>-${money(t.discount)}</span></div>` : ''}
      <div class="line"><span>Delivery fee</span><span>${t.sub === 0 ? '-' : t.fee ? money(t.fee) : 'FREE'}</span></div>
      ${t.sub > 0 && t.fee > 0 ? `<div class="line" style="color:var(--muted);font-size:12px"><span>Add ${money(FREE_DELIVERY_ABOVE - t.sub)} more for free delivery</span></div>` : ''}
      
      <div class="coupon-sec">${couponBadge}</div>

      <div class="line total"><span>Total Payable</span><span>${money(t.total)}</span></div>
      <button class="primary" ${items.length ? '' : 'disabled'} onclick="openCheckout()">Proceed to Checkout</button>
    </div>
  </div>`;
}

function closeCart() {
  $('cartLayer').innerHTML = '';
}

/* ---------- Checkout & Payment Simulation ---------- */
function buildSlots() {
  const defs = [['6 AM – 8 AM', 6], ['8 AM – 10 AM', 8], ['5 PM – 7 PM', 17], ['7 PM – 9 PM', 19]];
  const now = new Date(), out = [];
  for (let d = 0; d < 2; d++) {
    const day = new Date(now);
    day.setDate(now.getDate() + d);
    const dayLabel = d === 0 ? 'Today' : 'Tomorrow';
    defs.forEach(([label, start]) => {
      const slotTime = new Date(day);
      slotTime.setHours(start, 0, 0, 0);
      const available = slotTime - now > 2 * 3600 * 1000;   // 2 hours packing buffer
      out.push({ id: dayLabel + ' ' + label, label: dayLabel + ' • ' + label, available });
    });
  }
  return out;
}

function openCheckout() {
  closeCart();
  chosenSlot = null;
  currentPayMode = 'Cash on delivery';
  upiVerified = false;
  if (qrTimerInterval) clearInterval(qrTimerInterval);

  const t = totals(), slots = buildSlots();
  const saved = load('fc_customer', { name: '', phone: '', address: '', pin: '' });

  $('modalLayer').innerHTML = `<div class="modal"><div class="mbox">
    <h2>Checkout</h2>
    <label>Full name</label><input id="c_name" value="${esc(saved.name)}" placeholder="e.g. Rahul Sharma">
    <div class="row2">
      <div><label>Phone</label><input id="c_phone" value="${esc(saved.phone)}" maxlength="10" inputmode="numeric" placeholder="10-digit number"></div>
      <div><label>Pincode</label><input id="c_pin" value="${esc(saved.pin)}" maxlength="6" inputmode="numeric" placeholder="6-digit pincode"></div>
    </div>
    <label>Delivery address</label><input id="c_addr" value="${esc(saved.address)}" placeholder="House/Flat no, building, street, landmark">

    <label>Select delivery slot</label>
    <div class="slots">${slots.map(s => `<button class="slot" ${s.available ? '' : 'disabled'} data-id="${esc(s.id)}" onclick="pickSlot(this)">${esc(s.label)}</button>`).join('')}</div>

    <label>Choose payment method</label>
    <div class="pay">
      <label><input type="radio" name="pay" value="Cash on delivery" checked onchange="setPayMode(this.value)"> Cash on delivery</label>
      <label><input type="radio" name="pay" value="UPI (demo)" onchange="setPayMode(this.value)"> UPI (Instant QR / ID)</label>
      <label><input type="radio" name="pay" value="Card (demo)" onchange="setPayMode(this.value)"> Debit / Credit Card</label>
    </div>

    <div id="payDetailsContainer" class="pay-details-box">
      <p style="font-size:13px;color:var(--muted)">💵 Pay with cash or scan delivery partner's QR at the doorstep upon arrival.</p>
    </div>

    <div class="line total" style="margin-top:16px">
      <span>Amount payable</span>
      <span>${money(t.total)}</span>
    </div>
    ${t.discount > 0 ? `<div style="font-size:12px;color:var(--green);font-weight:700">Includes ${money(t.discount)} discount from coupon ${esc(t.activeCoupon.code)}</div>` : ''}

    <div class="err" id="c_err"></div>
    <button class="primary" id="placeOrderBtn" onclick="placeOrder()">Place Order • ${money(t.total)}</button>
    <button class="primary" style="background:#eceff1;color:#333;margin-top:8px" onclick="closeModal()">Back to Shop</button>
  </div></div>`;
}

function pickSlot(btn) {
  document.querySelectorAll('.slot').forEach(b => b.classList.remove('sel'));
  btn.classList.add('sel');
  chosenSlot = btn.dataset.id;
}

function setPayMode(mode) {
  currentPayMode = mode;
  const box = $('payDetailsContainer');
  if (qrTimerInterval) clearInterval(qrTimerInterval);

  if (mode === 'Cash on delivery') {
    box.innerHTML = `<p style="font-size:13px;color:var(--muted)">💵 Pay with cash or scan delivery partner's QR at the doorstep upon delivery. No extra charge.</p>`;
  } else if (mode === 'UPI (demo)') {
    let timeLeft = 300;
    box.innerHTML = `
      <div class="qr-container">
        <div class="qr-frame">
          <svg width="150" height="150" viewBox="0 0 150 150" style="display:block">
            <rect width="150" height="150" fill="#ffffff"/>
            <!-- Corner Finder 1 -->
            <rect x="10" y="10" width="40" height="40" fill="#1b5e20" rx="6"/>
            <rect x="18" y="18" width="24" height="24" fill="#ffffff" rx="4"/>
            <rect x="24" y="24" width="12" height="12" fill="#1b5e20" rx="2"/>
            <!-- Corner Finder 2 -->
            <rect x="100" y="10" width="40" height="40" fill="#1b5e20" rx="6"/>
            <rect x="108" y="18" width="24" height="24" fill="#ffffff" rx="4"/>
            <rect x="114" y="24" width="12" height="12" fill="#1b5e20" rx="2"/>
            <!-- Corner Finder 3 -->
            <rect x="10" y="100" width="40" height="40" fill="#1b5e20" rx="6"/>
            <rect x="18" y="108" width="24" height="24" fill="#ffffff" rx="4"/>
            <rect x="24" y="114" width="12" height="12" fill="#1b5e20" rx="2"/>
            <!-- Data Matrix Dots -->
            <rect x="60" y="15" width="10" height="10" fill="#2e7d32"/>
            <rect x="80" y="25" width="10" height="10" fill="#2e7d32"/>
            <rect x="60" y="35" width="10" height="10" fill="#2e7d32"/>
            <rect x="25" y="65" width="10" height="10" fill="#2e7d32"/>
            <rect x="40" y="75" width="10" height="10" fill="#2e7d32"/>
            <rect x="60" y="60" width="30" height="30" fill="#e8f5e9" rx="6"/>
            <text x="75" y="82" font-size="20" text-anchor="middle" dominant-baseline="central">🥦</text>
            <rect x="105" y="65" width="10" height="10" fill="#2e7d32"/>
            <rect x="120" y="80" width="10" height="10" fill="#2e7d32"/>
            <rect x="60" y="105" width="10" height="10" fill="#2e7d32"/>
            <rect x="80" y="115" width="10" height="10" fill="#2e7d32"/>
            <rect x="115" y="115" width="10" height="10" fill="#2e7d32"/>
          </svg>
        </div>
        <div class="qr-timer" id="upiTimer">Scan with GPay / PhonePe / Paytm • Expires in 05:00</div>
        <div style="font-size:12px;color:var(--muted)">OR Enter UPI ID:</div>
        <div class="upi-form">
          <input id="upiIdInput" placeholder="username@okhdfcbank" value="customer@upi">
          <button class="upi-verify-btn" onclick="verifyUpiId()">Verify</button>
        </div>
        <div id="upiStatusTag" class="verified-tag">✓ Ready for instant demo authorization</div>
      </div>`;
    qrTimerInterval = setInterval(() => {
      timeLeft--;
      if (timeLeft <= 0) {
        clearInterval(qrTimerInterval);
        if ($('upiTimer')) $('upiTimer').textContent = 'QR Code expired. Refresh to generate new.';
      } else {
        const m = String(Math.floor(timeLeft / 60)).padStart(2, '0');
        const s = String(timeLeft % 60).padStart(2, '0');
        if ($('upiTimer')) $('upiTimer').textContent = `Scan with GPay / PhonePe / Paytm • Expires in ${m}:${s}`;
      }
    }, 1000);
  } else if (mode === 'Card (demo)') {
    box.innerHTML = `
      <div class="card-form-wrap">
        <label style="margin:0">Card number</label>
        <div class="card-input-with-icon">
          <input id="cardNum" maxlength="19" placeholder="4532 8901 2345 6789" oninput="formatCardNumber(this)">
          <span class="card-badge" id="cardNetworkBadge">VISA</span>
        </div>
        <div class="row2">
          <div><label>Expiry date</label><input id="cardExp" maxlength="5" placeholder="MM/YY" oninput="formatExpiry(this)"></div>
          <div><label>CVV</label><input id="cardCvv" maxlength="3" type="password" placeholder="•••"></div>
        </div>
        <div><label>Name on card</label><input id="cardHolder" placeholder="Rahul Sharma"></div>
        <div style="font-size:11px;color:var(--green);font-weight:600">🔒 256-Bit SSL Demo Sandbox (No actual charge)</div>
      </div>`;
  }
}

function verifyUpiId() {
  const val = $('upiIdInput').value.trim();
  if (!val.includes('@') || val.length < 5) {
    toast('Please enter a valid UPI ID (e.g. name@bank)');
    return;
  }
  upiVerified = true;
  $('upiStatusTag').innerHTML = `<span style="color:var(--green)">✓ Verified Account (${esc(val)})</span>`;
  toast('UPI ID verified successfully!');
}

function formatCardNumber(el) {
  let v = el.value.replace(/\D/g, '').slice(0, 16);
  el.value = v.replace(/(\d{4})(?=\d)/g, '$1 ');
  const badge = $('cardNetworkBadge');
  if (!badge) return;
  if (v.startsWith('4')) badge.textContent = 'VISA';
  else if (v.startsWith('5')) badge.textContent = 'MC';
  else if (v.startsWith('6')) badge.textContent = 'RuPay';
  else badge.textContent = 'CARD';
}

function formatExpiry(el) {
  let v = el.value.replace(/\D/g, '').slice(0, 4);
  if (v.length >= 2) el.value = v.slice(0, 2) + '/' + v.slice(2);
  else el.value = v;
}

function closeModal() {
  if (qrTimerInterval) clearInterval(qrTimerInterval);
  $('modalLayer').innerHTML = '';
}

async function placeOrder() {
  const name = $('c_name').value.trim(),
        phone = $('c_phone').value.trim(),
        pin = $('c_pin').value.trim(),
        addr = $('c_addr').value.trim();
  const err = m => { $('c_err').textContent = m; };

  if (name.length < 2) return err('Please enter your full name.');
  if (!/^[6-9]\d{9}$/.test(phone)) return err('Enter a valid 10-digit mobile number.');
  if (!/^\d{6}$/.test(pin)) return err('Enter a valid 6-digit delivery pincode.');
  if (addr.length < 5) return err('Please enter your complete delivery address.');
  if (!chosenSlot) return err('Please choose a delivery slot.');

  // Validate payment inputs
  let payDetailNote = currentPayMode;
  if (currentPayMode === 'UPI (demo)') {
    const upiInput = $('upiIdInput') ? $('upiIdInput').value.trim() : '';
    payDetailNote = upiInput ? `UPI (${upiInput})` : 'UPI (Scan QR)';
  } else if (currentPayMode === 'Card (demo)') {
    const cNum = ($('cardNum') ? $('cardNum').value.replace(/\s/g, '') : '');
    const cExp = ($('cardExp') ? $('cardExp').value.trim() : '');
    const cCvv = ($('cardCvv') ? $('cardCvv').value.trim() : '');
    if (cNum.length < 15) return err('Enter a valid 16-digit card number.');
    if (!/^\d{2}\/\d{2}$/.test(cExp)) return err('Enter a valid expiry date (MM/YY).');
    if (cCvv.length < 3) return err('Enter a valid 3-digit CVV.');
    payDetailNote = `Card (ending in ${cNum.slice(-4)})`;
  }

  const items = cartItems();
  if (!items.length) return err('Your cart is empty.');
  for (const x of items) {
    if (x.q > x.p.stock) return err(`${x.p.name} only has ${x.p.stock} ${x.p.unit} remaining.`);
  }

  const t = totals();

  // If connected to Spring Boot, persist order to H2 and let the backend atomically deduct stock
  if (isBackendConnected) {
    try {
      const payload = {
        customerName: name,
        customerPhone: phone,
        customerPin: pin,
        customerAddress: addr,
        subtotal: t.sub,
        fee: t.fee,
        discount: t.discount,
        couponCode: t.activeCoupon ? t.activeCoupon.code : '',
        total: t.total,
        slot: chosenSlot,
        payment: payDetailNote,
        items: items.map(x => ({
          productId: x.p.id,
          name: x.p.name,
          emoji: x.p.emoji,
          img: x.p.img || '',
          unit: x.p.unit,
          price: x.p.price,
          qty: x.q,
          total: Math.round(x.p.price * x.q * 100) / 100
        }))
      };

      const res = await fetch(`${API_BASE}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        return err(errJson.message || 'Error processing order in backend');
      }

      const created = await res.json();
      const order = {
        ...created,
        customer: { name, phone, pin, address: addr },
        date: created.orderDate || new Date().toISOString()
      };
      orders.unshift(order);
      cart = {};
      appliedCoupon = null;
      save('fc_cart', cart);
      save('fc_coupon', null);
      save('fc_customer', { name, phone, address: addr, pin });

      if (qrTimerInterval) clearInterval(qrTimerInterval);
      await refreshBackendData();
      showSuccessModal(order);
      renderShop();
      return;
    } catch (e) {
      console.warn('Backend order submission failed, falling back to local:', e);
    }
  }

  // Stock deduction (Local fallback)
  items.forEach(x => {
    x.p.stock = Math.round((x.p.stock - x.q) * 10) / 10;
  });

  const orderId = 'FC' + Date.now().toString().slice(-7);
  const order = {
    id: orderId,
    invoiceNo: 'INV-' + orderId,
    date: new Date().toISOString(),
    customer: { name, phone, pin, address: addr },
    items: items.map(x => ({
      id: x.p.id,
      name: x.p.name,
      emoji: x.p.emoji,
      img: x.p.img || '',
      unit: x.p.unit,
      price: x.p.price,
      qty: x.q,
      total: Math.round(x.p.price * x.q * 100) / 100
    })),
    sub: t.sub,
    fee: t.fee,
    discount: t.discount,
    couponCode: t.activeCoupon ? t.activeCoupon.code : null,
    total: t.total,
    slot: chosenSlot,
    payment: payDetailNote,
    status: 'Placed'
  };

  orders.unshift(order);
  cart = {};
  appliedCoupon = null;
  save('fc_orders', orders);
  save('fc_products', products);
  save('fc_cart', cart);
  save('fc_coupon', null);
  save('fc_customer', { name, phone, address: addr, pin });

  if (qrTimerInterval) clearInterval(qrTimerInterval);
  showSuccessModal(order);
  renderShop();
}

function showSuccessModal(order) {
  $('modalLayer').innerHTML = `<div class="modal"><div class="mbox" style="text-align:center">
    <div style="font-size:60px">✅</div>
    <h2>Order Placed Successfully!</h2>
    <p>Order <b>#${esc(order.id)}</b></p>
    <p style="margin:6px 0;color:var(--muted)">Scheduled Slot: <b>${esc(order.slot)}</b></p>
    <p style="margin:8px 0;font-size:15px"><b>${money(order.total)}</b> • <span style="color:var(--green)">${esc(order.payment)}</span></p>
    <div style="display:flex;gap:10px;margin-top:16px;flex-direction:column">
      <button class="primary" onclick="showInvoice('${esc(order.id)}')">🧾 View & Print Tax Invoice</button>
      <button class="primary" style="background:#eceff1;color:#333;margin:0" onclick="closeModal();go('orders')">Track in My Orders</button>
    </div>
  </div></div>`;
}

/* ---------- Customer Orders View ---------- */
function renderOrders() {
  const box = $('orderList');
  if (!orders.length) {
    box.innerHTML = '<div class="empty">No orders placed yet. Start shopping! 🥕</div>';
    return;
  }
  box.innerHTML = orders.map(o => {
    const idx = STATUSES.indexOf(o.status);
    const track = o.status === 'Cancelled' ? '<div style="color:var(--red);font-size:13px;font-weight:700;margin:8px 0">❌ Order was cancelled</div>' :
      `<div class="track">${STATUSES.map((s, i) => `<div class="step ${i <= idx ? 'done' : ''}">${s}</div>`).join('')}</div>`;

    return `<div class="panel">
      <div class="ohead">
        <b>#${esc(o.id)}</b>
        <span class="status ${esc(o.status)}">${esc(o.status)}</span>
      </div>
      <div class="items" style="display:flex;flex-wrap:wrap;gap:6px;align-items:center">${o.items.map(i => {
        const visual = i.img ? `<img src="${esc(i.img)}" class="order-item-thumb" onerror="this.remove()">` : (i.emoji || '🥦');
        return `<span class="order-item-pill">${visual} ${esc(i.name)} × ${i.qty} ${esc(i.unit)}</span>`;
      }).join('')}</div>
      ${track}
      <div class="line" style="margin-top:10px">
        <span>Delivery Slot: <b>${esc(o.slot)}</b></span>
        <b style="font-size:16px">${money(o.total)}</b>
      </div>
      <div class="items" style="margin-top:4px">
        ${new Date(o.date).toLocaleString()} • ${esc(o.payment)}
        ${o.discount > 0 ? ` • <span style="color:var(--green)">Saved ${money(o.discount)} (${esc(o.couponCode)})</span>` : ''}
      </div>
      <div style="margin-top:12px;display:flex;gap:8px;flex-wrap:wrap">
        <button class="sm" onclick="showInvoice('${esc(o.id)}')">🧾 Invoice</button>
        <button class="sm" style="background:#546e7a" onclick="reorder('${esc(o.id)}')">Reorder</button>
        ${o.status === 'Placed' ? `<button class="sm red" onclick="cancelOrder('${esc(o.id)}')">Cancel order</button>` : ''}
      </div>
    </div>`;
  }).join('');
}

function reorder(id) {
  const o = orders.find(x => x.id === id);
  if (!o) return;
  let added = 0;
  o.items.forEach(i => {
    const p = products.find(p => p.name === i.name);
    if (p && p.stock >= i.qty) {
      cart[p.id] = i.qty;
      added++;
    }
  });
  save('fc_cart', cart);
  renderShop();
  toast(added ? 'Items added back to your cart!' : 'Items currently out of stock.');
  if (added) openCart();
}

async function cancelOrder(id) {
  const o = orders.find(x => x.id === id);
  if (!o || o.status !== 'Placed') return;
  if (!confirm('Are you sure you want to cancel this order? Stock will be restored.')) return;

  if (isBackendConnected) {
    try {
      const res = await fetch(`${API_BASE}/orders/${id}/cancel`, { method: 'POST' });
      if (res.ok) {
        await refreshBackendData();
        renderOrders();
        toast('Order cancelled and inventory restored in database.');
        return;
      }
    } catch (e) {
      console.warn('Backend cancel failed, falling back to local:', e);
    }
  }

  o.status = 'Cancelled';
  // Restore inventory stock
  o.items.forEach(i => {
    const p = products.find(p => p.name === i.name);
    if (p) p.stock = Math.round((p.stock + i.qty) * 10) / 10;
  });
  save('fc_orders', orders);
  save('fc_products', products);
  renderOrders();
  toast('Order cancelled and inventory restored.');
}

/* ---------- Printable Tax Invoice ---------- */
function showInvoice(orderId) {
  const o = orders.find(x => x.id === orderId);
  if (!o) { toast('Order not found'); return; }

  // Exemption calculation: Raw vegetables & fresh fruits have 0% GST under Indian GST laws; delivery services have 5% GST
  const deliveryGst = Math.round((o.fee * 0.05 / 1.05) * 100) / 100;
  const taxableDelivery = Math.round((o.fee - deliveryGst) * 100) / 100;

  $('modalLayer').innerHTML = `
    <div class="modal">
      <div class="mbox" style="max-width:680px;padding:0">
        <div class="inv-container" id="printableInvoice">
          <div class="inv-header">
            <div>
              <div class="inv-brand">🥦 FreshCart Retail Pvt. Ltd.</div>
              <div style="font-size:12px;color:#555;margin-top:2px">Farm Fresh Groceries & Deliveries</div>
              <div style="font-size:11px;color:#777">GSTIN: 27AABCF1234F1Z5 • FSSAI: 11521019000123</div>
            </div>
            <div class="inv-meta">
              <b>TAX INVOICE</b>
              <div><b>No:</b> ${esc(o.invoiceNo || 'INV-' + o.id)}</div>
              <div><b>Date:</b> ${new Date(o.date).toLocaleDateString()}</div>
              <div><b>Time:</b> ${new Date(o.date).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}</div>
            </div>
          </div>

          <div class="inv-details-grid">
            <div>
              <b style="color:var(--green-d)">Billed & Delivered To:</b>
              <div><b>${esc(o.customer.name)}</b></div>
              <div>${esc(o.customer.address)}</div>
              <div>PIN: ${esc(o.customer.pin)}</div>
              <div>Phone: +91 ${esc(o.customer.phone)}</div>
            </div>
            <div>
              <b style="color:var(--green-d)">Order & Dispatch Details:</b>
              <div>Order ID: <b>#${esc(o.id)}</b></div>
              <div>Scheduled Slot: <b>${esc(o.slot)}</b></div>
              <div>Payment Mode: <b>${esc(o.payment)}</b></div>
              <div>Status: <b>${esc(o.status)}</b></div>
            </div>
          </div>

          <table class="inv-table">
            <thead>
              <tr>
                <th style="width:30px">#</th>
                <th>Item Description</th>
                <th>Rate</th>
                <th>Qty</th>
                <th style="text-align:right">Amount</th>
              </tr>
            </thead>
            <tbody>
              ${o.items.map((it, idx) => `
                <tr>
                  <td>${idx + 1}</td>
                  <td>${esc(it.name)} <small style="color:#777">(${esc(it.unit)})</small></td>
                  <td>${money(it.price)}</td>
                  <td>${it.qty} ${esc(it.unit)}</td>
                  <td style="text-align:right">${money(it.total || it.price * it.qty)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>

          <div class="inv-summary">
            <div>
              <div style="font-size:11px;color:#666">
                * Fresh unprocessed vegetables & fruits are exempt from GST (Nil Rated).<br>
                * Delivery & logistical charges are subject to 5% GST.<br>
              </div>
              <div class="inv-stamp">✓ VERIFIED & DISPATCHED</div>
            </div>
            <div class="inv-calc">
              <div class="inv-calc-row"><span>Items Subtotal:</span><span>${money(o.sub)}</span></div>
              ${o.discount > 0 ? `<div class="inv-calc-row" style="color:var(--green)"><span>Coupon (${esc(o.couponCode)}):</span><span>-${money(o.discount)}</span></div>` : ''}
              <div class="inv-calc-row"><span>Delivery Charges:</span><span>${o.fee ? money(o.fee) : 'FREE'}</span></div>
              <div class="inv-calc-row" style="font-size:11px;color:#777"><span>(CGST 2.5% + SGST 2.5% on delivery):</span><span>${o.fee ? money(deliveryGst) : '₹0.00'}</span></div>
              <div class="inv-calc-row total"><span>Total Amount Paid:</span><span>${money(o.total)}</span></div>
            </div>
          </div>

          <div class="inv-footer">
            Thank you for shopping healthy with FreshCart! • Customer Care: support@freshcart.demo
          </div>
        </div>

        <div class="inv-actions no-print" style="padding:14px 24px;background:#f9fbf9;border-top:1px solid var(--border)">
          <button class="primary" style="margin:0" onclick="window.print()">🖨️ Print / Save PDF</button>
          <button class="primary" style="margin:0;background:#cfd8dc;color:#37474f" onclick="closeModal()">Close</button>
        </div>
      </div>
    </div>`;
}

/* ---------- Admin Management ---------- */
function renderAdmin() {
  const v = $('view-admin');
  if (!isAdmin) {
    v.innerHTML = `<div class="panel" style="max-width:380px;margin:30px auto">
      <h2>Admin Login</h2>
      <label>Password</label>
      <input id="a_pw" type="password" style="width:100%;padding:10px;border:1px solid var(--border);border-radius:8px">
      <div class="err" id="a_err"></div>
      <button class="primary" onclick="adminLogin()">Login</button>
      <p style="font-size:12px;color:var(--muted);margin-top:8px">Demo password: <b>admin123</b></p>
    </div>`;
    return;
  }
  const active = orders.filter(o => o.status !== 'Cancelled');
  const revenue = active.reduce((s, o) => s + o.total, 0);
  const pending = orders.filter(o => o.status === 'Placed' || o.status === 'Packed' || o.status === 'Out for delivery').length;
  const low = products.filter(p => p.stock <= 10).length;

  v.innerHTML = `<div class="stats">
    <div class="stat"><b>${orders.length}</b><span>Total Orders</span></div>
    <div class="stat"><b>${money(revenue)}</b><span>Net Revenue</span></div>
    <div class="stat"><b>${pending}</b><span>Active Deliveries</span></div>
    <div class="stat"><b>${low}</b><span>Low-stock Alerts</span></div>
  </div>
  <div class="tabs">
    <button class="chip ${adminTab === 'orders' ? 'active' : ''}" onclick="adminTab='orders';renderAdmin()">Orders</button>
    <button class="chip ${adminTab === 'products' ? 'active' : ''}" onclick="adminTab='products';renderAdmin()">Products & Inventory</button>
    <button class="chip" onclick="isAdmin=false;renderAdmin()">Logout</button>
  </div>
  <div id="adminBody"></div>`;

  $('adminBody').innerHTML = adminTab === 'orders' ? adminOrders() : adminProducts();
}

function adminLogin() {
  if ($('a_pw').value === ADMIN_PASSWORD) {
    isAdmin = true;
    renderAdmin();
  } else {
    $('a_err').textContent = 'Invalid administrator password.';
  }
}

function adminOrders() {
  if (!orders.length) return '<div class="empty">No customer orders placed yet.</div>';
  return `<div class="tablewrap"><table>
    <tr>
      <th>Order ID</th>
      <th>Customer & Contact</th>
      <th>Items & Qty</th>
      <th>Slot</th>
      <th>Total</th>
      <th>Actions / Status</th>
    </tr>
    ${orders.map(o => `<tr>
      <td><b>#${esc(o.id)}</b><br><small><a href="javascript:void(0)" onclick="showInvoice('${esc(o.id)}')">🧾 View Bill</a></small></td>
      <td><b>${esc(o.customer.name)}</b><br><small>${esc(o.customer.phone)}<br>${esc(o.customer.address)} (${esc(o.customer.pin)})</small></td>
      <td><small>${o.items.map(i => esc(i.name + ' × ' + i.qty + ' ' + i.unit)).join(', ')}</small></td>
      <td><small>${esc(o.slot)}</small></td>
      <td>${money(o.total)}<br><small style="color:var(--muted)">${esc(o.payment)}</small></td>
      <td>
        <select onchange="setStatus('${esc(o.id)}', this.value)">
          ${[...STATUSES, 'Cancelled'].map(s => `<option ${s === o.status ? 'selected' : ''}>${s}</option>`).join('')}
        </select>
      </td>
    </tr>`).join('')}
  </table></div>`;
}

// Status updates with Spring Boot API synchronization
async function setStatus(id, newStatus) {
  const o = orders.find(x => x.id === id);
  if (!o || o.status === newStatus) return;
  const oldStatus = o.status;

  if (isBackendConnected) {
    try {
      const res = await fetch(`${API_BASE}/orders/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        await refreshBackendData();
        renderAdmin();
        toast('Order status updated in Spring Boot database!');
        return;
      } else {
        const errJson = await res.json().catch(() => ({}));
        toast(errJson.message || 'Failed to update order status');
        renderAdmin();
        return;
      }
    } catch (e) {
      console.warn('Backend status update failed, using local:', e);
    }
  }

  // Local fallback: Transition TO Cancelled -> Restore product stock
  if (newStatus === 'Cancelled' && oldStatus !== 'Cancelled') {
    o.items.forEach(i => {
      const p = products.find(p => p.name === i.name);
      if (p) p.stock = Math.round((p.stock + i.qty) * 10) / 10;
    });
    save('fc_products', products);
  }
  // Transition FROM Cancelled back to Active -> Re-deduct product stock
  else if (oldStatus === 'Cancelled' && newStatus !== 'Cancelled') {
    for (const i of o.items) {
      const p = products.find(p => p.name === i.name);
      if (p && p.stock < i.qty) {
        toast(`Cannot uncancel: ${i.name} only has ${p.stock} in stock.`);
        renderAdmin();
        return;
      }
    }
    o.items.forEach(i => {
      const p = products.find(p => p.name === i.name);
      if (p) p.stock = Math.round((p.stock - i.qty) * 10) / 10;
    });
    save('fc_products', products);
  }

  o.status = newStatus;
  save('fc_orders', orders);
  renderAdmin();
  toast('Order status updated to ' + newStatus);
}

function adminProducts() {
  return `<div class="form">
    <div><label>Product Name</label><input id="n_name" placeholder="e.g. Blueberries"></div>
    <div><label>Emoji</label><input id="n_emoji" value="🫐" maxlength="4"></div>
    <div><label>Image URL (Optional)</label><input id="n_img" placeholder="https://... photo url"></div>
    <div><label>Category</label><input id="n_cat" placeholder="fruits / vegetables / exotic"></div>
    <div><label>Price (₹)</label><input id="n_price" type="number" min="0" step="0.5" placeholder="50"></div>
    <div><label>Unit</label><select id="n_unit"><option>kg</option><option>pc</option><option>bunch</option><option>dozen</option><option>box</option></select></div>
    <div><label>Initial Stock</label><input id="n_stock" type="number" min="0" step="0.5" placeholder="25"></div>
    <div><button class="primary" style="margin:0" onclick="addProduct()">Add Product</button></div>
  </div>
  <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;padding:8px 12px;background:#fff;border-radius:8px;border:1px solid var(--border)">
    <span style="font-size:13px;font-weight:700">Inventory Catalog (${products.length} items)</span>
    <button class="sm" style="background:#546e7a" onclick="resetToDefaultCatalog()">🔄 Restore Original 24 Photos</button>
  </div>
  <div class="tablewrap"><table>
    <tr>
      <th>Visual</th>
      <th>Product Details</th>
      <th>Category</th>
      <th>Price (₹)</th>
      <th>Current Stock</th>
      <th>Action</th>
    </tr>
    ${products.map(p => `<tr>
      <td style="font-size:24px;text-align:center">
        ${p.img ? `<img src="${esc(p.img)}" style="width:36px;height:36px;object-fit:cover;border-radius:6px">` : esc(p.emoji)}
      </td>
      <td><b>${esc(p.name)}</b><br><small>per ${esc(p.unit)}</small></td>
      <td><span class="cat">${esc(p.category)}</span></td>
      <td><input type="number" min="0" step="0.5" value="${p.price}" onchange="editProd(${p.id},'price',this.value)"></td>
      <td><input type="number" min="0" step="0.5" value="${p.stock}" onchange="editProd(${p.id},'stock',this.value)"></td>
      <td><button class="sm red" onclick="delProduct(${p.id})">Delete</button></td>
    </tr>`).join('')}
  </table></div>`;
}

async function addProduct() {
  const name = $('n_name').value.trim(),
        price = parseFloat($('n_price').value),
        stock = parseFloat($('n_stock').value),
        img = $('n_img') ? $('n_img').value.trim() : '';

  if (!name || isNaN(price) || price < 0 || isNaN(stock) || stock < 0) {
    toast('Please fill name, valid price, and stock quantity.');
    return;
  }

  if (isBackendConnected) {
    try {
      const res = await fetch(`${API_BASE}/products`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          emoji: $('n_emoji').value.trim() || '🥬',
          img,
          category: ($('n_cat').value.trim() || 'vegetables').toLowerCase(),
          price,
          unit: $('n_unit').value,
          stock
        })
      });
      if (res.ok) {
        await refreshBackendData();
        renderAdmin();
        toast('Product successfully saved to Spring Boot database!');
        return;
      }
    } catch (e) {}
  }

  const id = products.reduce((m, p) => Math.max(m, p.id), 0) + 1;
  products.push({
    id,
    name,
    emoji: $('n_emoji').value.trim() || '🥬',
    img,
    category: ($('n_cat').value.trim() || 'vegetables').toLowerCase(),
    price,
    unit: $('n_unit').value,
    stock
  });
  save('fc_products', products);
  renderAdmin();
  toast('Product successfully added!');
}

async function editProd(id, field, val) {
  const p = prod(id), n = parseFloat(val);
  if (!p || isNaN(n) || n < 0) { renderAdmin(); return; }

  if (isBackendConnected) {
    try {
      const payload = {};
      payload[field] = n;
      fetch(`${API_BASE}/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      }).then(() => refreshBackendData());
    } catch (e) {}
  }

  p[field] = n;
  save('fc_products', products);
  toast('Saved');
}

async function delProduct(id) {
  if (!confirm('Are you sure you want to delete this product?')) return;

  if (isBackendConnected) {
    try {
      await fetch(`${API_BASE}/products/${id}`, { method: 'DELETE' });
      await refreshBackendData();
      delete cart[id];
      save('fc_cart', cart);
      renderAdmin();
      toast('Product deleted from database.');
      return;
    } catch (e) {}
  }

  products = products.filter(p => p.id !== id);
  delete cart[id];
  save('fc_products', products);
  save('fc_cart', cart);
  renderAdmin();
  toast('Product deleted.');
}

async function resetToDefaultCatalog() {
  if (!confirm('Reset all 24 products back to default items with original high-definition photos?')) return;

  if (isBackendConnected) {
    try {
      const res = await fetch(`${API_BASE}/products/reset`, { method: 'POST' });
      if (res.ok) {
        products = await res.json();
        cart = {};
        save('fc_cart', cart);
        renderAdmin();
        renderShop();
        toast('Catalog reset with fresh photos in Spring Boot DB!');
        return;
      }
    } catch (e) {}
  }

  products = JSON.parse(JSON.stringify(DEFAULT_PRODUCTS));
  cart = {};
  save('fc_products', products);
  save('fc_cart', cart);
  renderAdmin();
  renderShop();
  toast('Catalog reset with fresh photos!');
}

// Initial view boot & Backend probe
go('shop');
checkBackend();
