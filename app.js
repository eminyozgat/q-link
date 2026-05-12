const STORAGE_KEYS = {
  orders: 'qlink_orders',
  tables: 'qlink_tables',
  categories: 'qlink_categories',
  products: 'qlink_products',
  waiterCalls: 'qlink_waiter_calls',
  waiters: 'qlink_waiters',
  panelPasswords: 'qlink_panel_passwords',
  qrBaseUrl: 'qlink_qr_base_url'
};

let siparisler = [];

function siparisEkle(urun, masa) {
  siparisler.push({
    urun: urun,
    masa: masa
  });

  console.log(siparisler);
  goster();
}

function goster() {
  let ul = document.getElementById("liste");
  ul.innerHTML = "";

  siparisler.forEach(s => {
    ul.innerHTML += `<li>${s.urun} - Masa ${s.masa}</li>`;
  });
}

const DEFAULT_CATEGORIES = ['burger', 'pizza', 'icecek', 'tatli', 'yan', 'salata', 'makarna', 'ana yemek', 'kahvalti'];
const DEFAULT_PRODUCTS = [
  {
    id: 1,
    name: 'Cheeseburger',
    price: 220,
    category: 'burger',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=900&q=80',
    desc: 'Et, cheddar, turşu ve özel sos.',
    estimatedServiceMinutes: 15
  },
  {
    id: 2,
    name: 'Karışık Pizza',
    price: 280,
    category: 'pizza',
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=900&q=80',
    desc: 'Sucuk, mantar, zeytin ve bol peynir.',
    estimatedServiceMinutes: 20
  },
  {
    id: 3,
    name: 'Kola',
    price: 45,
    category: 'icecek',
    image: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?auto=format&fit=crop&w=900&q=80',
    desc: '330 ml soğuk içecek.',
    estimatedServiceMinutes: 3
  },
  {
    id: 4,
    name: 'Cheesecake',
    price: 110,
    category: 'tatli',
    image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?auto=format&fit=crop&w=900&q=80',
    desc: 'Frambuaz soslu özel tatlı.',
    estimatedServiceMinutes: 8
  },
  {
    id: 5,
    name: 'Patates Kızartması',
    price: 95,
    category: 'yan',
    image: 'https://images.unsplash.com/photo-1576107232684-1279f390859f?auto=format&fit=crop&w=900&q=80',
    desc: 'Çıtır ve sıcak servis.',
    estimatedServiceMinutes: 10
  },
  {
    id: 6,
    name: 'Limonata',
    price: 60,
    category: 'icecek',
    image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=900&q=80',
    desc: 'Taze limon ve nane.',
    estimatedServiceMinutes: 4
  },
  {
    id: 7,
    name: 'Tavuk Burger',
    price: 205,
    category: 'burger',
    image: 'https://images.unsplash.com/photo-1606755962773-d324e0a13086?auto=format&fit=crop&w=900&q=80',
    desc: 'Izgara tavuk, marul, domates ve balli hardal sos.',
    estimatedServiceMinutes: 14
  },
  {
    id: 8,
    name: 'Double Burger',
    price: 310,
    category: 'burger',
    image: 'https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?auto=format&fit=crop&w=900&q=80',
    desc: 'Cift kofteli, cheddar peynirli doyurucu burger.',
    estimatedServiceMinutes: 18
  },
  {
    id: 9,
    name: 'Margherita Pizza',
    price: 245,
    category: 'pizza',
    image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=900&q=80',
    desc: 'Domates sos, mozzarella ve taze feslegen.',
    estimatedServiceMinutes: 18
  },
  {
    id: 10,
    name: 'Tavuklu Pizza',
    price: 295,
    category: 'pizza',
    image: 'https://images.unsplash.com/photo-1601924582975-7d95c9aeb5d9?auto=format&fit=crop&w=900&q=80',
    desc: 'Tavuk parcalari, misir, biber ve mozzarella.',
    estimatedServiceMinutes: 21
  },
  {
    id: 11,
    name: 'Tavuklu Sezar Salata',
    price: 185,
    category: 'salata',
    image: 'https://images.unsplash.com/photo-1550304943-4f24f54ddde9?auto=format&fit=crop&w=900&q=80',
    desc: 'Izgara tavuk, kruton, parmesan ve sezar sos.',
    estimatedServiceMinutes: 10
  },
  {
    id: 12,
    name: 'Akdeniz Salata',
    price: 155,
    category: 'salata',
    image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=900&q=80',
    desc: 'Yesillik, beyaz peynir, zeytin ve zeytinyagli sos.',
    estimatedServiceMinutes: 8
  },
  {
    id: 13,
    name: 'Penne Alfredo',
    price: 235,
    category: 'makarna',
    image: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=900&q=80',
    desc: 'Kremali sos, mantar, tavuk ve parmesan.',
    estimatedServiceMinutes: 16
  },
  {
    id: 14,
    name: 'Spaghetti Bolonez',
    price: 225,
    category: 'makarna',
    image: 'https://images.unsplash.com/photo-1622973536968-3ead9e780960?auto=format&fit=crop&w=900&q=80',
    desc: 'Dana kiymali domates sos ve parmesan.',
    estimatedServiceMinutes: 17
  },
  {
    id: 15,
    name: 'Izgara Tavuk',
    price: 260,
    category: 'ana yemek',
    image: 'https://images.unsplash.com/photo-1532550907401-a500c9a57435?auto=format&fit=crop&w=900&q=80',
    desc: 'Izgara tavuk, pilav, salata ve patates.',
    estimatedServiceMinutes: 22
  },
  {
    id: 16,
    name: 'Kofte Tabagi',
    price: 285,
    category: 'ana yemek',
    image: 'https://images.unsplash.com/photo-1529042410759-befb1204b468?auto=format&fit=crop&w=900&q=80',
    desc: 'Izgara kofte, piyaz, patates ve lavas.',
    estimatedServiceMinutes: 24
  },
  {
    id: 17,
    name: 'Ayran',
    price: 35,
    category: 'icecek',
    image: 'https://images.unsplash.com/photo-1625944525801-6c63f837d8fd?auto=format&fit=crop&w=900&q=80',
    desc: 'Soguk ve kopuklu klasik ayran.',
    estimatedServiceMinutes: 2
  },
  {
    id: 18,
    name: 'Soguk Kahve',
    price: 85,
    category: 'icecek',
    image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=900&q=80',
    desc: 'Buzlu espresso, sut ve hafif vanilya.',
    estimatedServiceMinutes: 5
  },
  {
    id: 19,
    name: 'Brownie',
    price: 125,
    category: 'tatli',
    image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=900&q=80',
    desc: 'Sicak cikolatali brownie ve dondurma.',
    estimatedServiceMinutes: 8
  },
  {
    id: 20,
    name: 'Serpme Kahvalti',
    price: 340,
    category: 'kahvalti',
    image: 'https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?auto=format&fit=crop&w=900&q=80',
    desc: 'Peynir, zeytin, yumurta, recel, bal ve sicak ekmek.',
    estimatedServiceMinutes: 15
  }
];
const DEFAULT_TABLES = [
  { number: 1, status: 'bos' },
  { number: 2, status: 'bos' },
  { number: 3, status: 'bos' },
  { number: 4, status: 'bekliyor' },
  { number: 5, status: 'bos' },
  { number: 6, status: 'bos' },
  { number: 7, status: 'hazirlaniyor' },
  { number: 8, status: 'hazir' },
  { number: 9, status: 'bos' }
];
const DEFAULT_WAITERS = [
  { id: 1, name: 'Ahmet', phone: '0555 000 00 01', pin: '1001', active: true },
  { id: 2, name: 'Elif', phone: '0555 000 00 02', pin: '1002', active: true }
];
const MIN_DYNAMIC_SERVICE_SAMPLE_COUNT = 100;
const DEFAULT_PANEL_PASSWORDS = {
  admin: '1234',
  waiter: '1234'
};

function readStorage(key, fallback) {
  const raw = localStorage.getItem(key);
  if (raw) {
    try {
      return JSON.parse(raw);
    } catch (e) {
      console.error('Storage parse error', key, e);
    }
  }
  localStorage.setItem(key, JSON.stringify(fallback));
  return structuredClone(fallback);
}

function writeStorage(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function escapeHtml(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function escapeAttr(value) {
  return escapeHtml(value);
}

function jsStringArg(value) {
  return escapeAttr(JSON.stringify(String(value ?? '')));
}

function normalizeAllergens(value) {
  if (Array.isArray(value)) {
    return value.map(item => String(item || '').trim()).filter(Boolean);
  }
  return String(value || '')
    .split(',')
    .map(item => item.trim())
    .filter(Boolean);
}

function inferProductNutrition(product) {
  const name = String(product?.name || '').toLocaleLowerCase('tr');
  const category = String(product?.category || '').toLocaleLowerCase('tr');

  if (name.includes('cheeseburger')) return { calories: 720, allergens: ['gluten', 'süt ürünü', 'susam'] };
  if (name.includes('karışık pizza') || name.includes('karÄ±ÅŸÄ±k pizza')) return { calories: 860, allergens: ['gluten', 'süt ürünü'] };
  if (name.includes('kola')) return { calories: 140, allergens: [] };
  if (name.includes('cheesecake')) return { calories: 430, allergens: ['gluten', 'süt ürünü', 'yumurta'] };
  if (name.includes('patates')) return { calories: 360, allergens: [] };
  if (name.includes('limonata')) return { calories: 120, allergens: [] };
  if (name.includes('tavuk burger')) return { calories: 640, allergens: ['gluten', 'yumurta', 'hardal'] };
  if (name.includes('double burger')) return { calories: 980, allergens: ['gluten', 'süt ürünü', 'susam'] };
  if (name.includes('margherita')) return { calories: 720, allergens: ['gluten', 'süt ürünü'] };
  if (name.includes('tavuklu pizza')) return { calories: 790, allergens: ['gluten', 'süt ürünü'] };
  if (name.includes('sezar')) return { calories: 520, allergens: ['gluten', 'süt ürünü', 'yumurta'] };
  if (name.includes('akdeniz salata')) return { calories: 310, allergens: ['süt ürünü'] };
  if (name.includes('alfredo')) return { calories: 760, allergens: ['gluten', 'süt ürünü'] };
  if (name.includes('bolonez')) return { calories: 690, allergens: ['gluten', 'süt ürünü'] };
  if (name.includes('izgara tavuk')) return { calories: 620, allergens: [] };
  if (name.includes('kofte') || name.includes('köfte')) return { calories: 740, allergens: ['gluten'] };
  if (name.includes('ayran')) return { calories: 95, allergens: ['süt ürünü'] };
  if (name.includes('soguk kahve') || name.includes('soğuk kahve')) return { calories: 180, allergens: ['süt ürünü'] };
  if (name.includes('brownie')) return { calories: 510, allergens: ['gluten', 'süt ürünü', 'yumurta'] };
  if (name.includes('kahvalti') || name.includes('kahvaltı')) return { calories: 980, allergens: ['gluten', 'süt ürünü', 'yumurta'] };

  if (category.includes('icecek')) return { calories: 120, allergens: [] };
  if (category.includes('tatli')) return { calories: 420, allergens: ['gluten', 'süt ürünü'] };
  if (category.includes('salata')) return { calories: 350, allergens: [] };
  if (category.includes('burger')) return { calories: 700, allergens: ['gluten'] };
  if (category.includes('pizza') || category.includes('makarna')) return { calories: 720, allergens: ['gluten', 'süt ürünü'] };
  return { calories: null, allergens: [] };
}

function normalizeProduct(product) {
  const inferred = inferProductNutrition(product);
  const caloriesRaw = Number(product?.calories);
  const calories = Number.isFinite(caloriesRaw) && caloriesRaw > 0 ? Math.round(caloriesRaw) : inferred.calories;
  const allergens = normalizeAllergens(
    product && Object.prototype.hasOwnProperty.call(product, 'allergens')
      ? product.allergens
      : inferred.allergens
  );
  return { ...product, calories, allergens };
}

function getOrders() { return readStorage(STORAGE_KEYS.orders, []); }
function saveOrders(v) { writeStorage(STORAGE_KEYS.orders, v); }
function getTables() {
  const tables = readStorage(STORAGE_KEYS.tables, DEFAULT_TABLES);
  // Backward compat: eski verilerde "aktif" vardı; artık kaldırıldı.
  return (tables || []).map(t => (t && t.status === 'aktif') ? { ...t, status: 'bos' } : t);
}
function saveTables(v) { writeStorage(STORAGE_KEYS.tables, v); }
function getCategories() { return readStorage(STORAGE_KEYS.categories, DEFAULT_CATEGORIES); }
function saveCategories(v) { writeStorage(STORAGE_KEYS.categories, v); }
function getProducts() { return readStorage(STORAGE_KEYS.products, DEFAULT_PRODUCTS).map(normalizeProduct); }
function saveProducts(v) { writeStorage(STORAGE_KEYS.products, (v || []).map(normalizeProduct)); }

function ensureDefaultMenuCatalog() {
  const categories = getCategories();
  const missingCategories = DEFAULT_CATEGORIES.filter(defaultCategory =>
    !categories.some(category =>
      String(category).localeCompare(defaultCategory, 'tr', { sensitivity: 'base' }) === 0
    )
  );
  if (missingCategories.length) {
    saveCategories([...categories, ...missingCategories]);
  }

  const products = getProducts();
  const existingIds = new Set(products.map(product => Number(product?.id)).filter(Number.isFinite));
  const existingNames = new Set(products.map(product => String(product?.name || '').toLocaleLowerCase('tr')));
  const missingProducts = DEFAULT_PRODUCTS.filter(defaultProduct =>
    !existingIds.has(Number(defaultProduct.id)) &&
    !existingNames.has(String(defaultProduct.name).toLocaleLowerCase('tr'))
  );
  if (missingProducts.length) {
    saveProducts([...products, ...structuredClone(missingProducts)]);
  }
}

ensureDefaultMenuCatalog();

function getWaiterCalls() { return readStorage(STORAGE_KEYS.waiterCalls, {}); }
function saveWaiterCalls(v) { writeStorage(STORAGE_KEYS.waiterCalls, v); }
function getWaiters() { return readStorage(STORAGE_KEYS.waiters, DEFAULT_WAITERS); }
function saveWaiters(v) { writeStorage(STORAGE_KEYS.waiters, v); }
function getPanelPasswords() { return readStorage(STORAGE_KEYS.panelPasswords, DEFAULT_PANEL_PASSWORDS); }
function savePanelPasswords(v) { writeStorage(STORAGE_KEYS.panelPasswords, v); }

function getWaiterById(waiterId) {
  const id = Number(waiterId);
  return getWaiters().find(w => Number(w?.id) === id) || null;
}

function verifyWaiterCredentials(waiterId, pin) {
  const waiter = getWaiterById(waiterId);
  if (!waiter || waiter.active === false) return null;
  const expectedPin = String(waiter.pin || '');
  if (!expectedPin || expectedPin !== String(pin || '')) return null;
  return waiter;
}

function checkPanelPassword(role, password) {
  const key = String(role || '');
  const expected = getPanelPasswords()[key];
  if (typeof expected !== 'string' || !expected) return false;
  return String(password || '') === expected;
}

function ensurePanelAccess(role, { redirectTo = 'index.html', maxAttempts = 3 } = {}) {
  const key = String(role || '');
  const sessionKey = `qlink_auth_${key}`;
  if (sessionStorage.getItem(sessionKey) === 'ok') return true;
  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    const input = prompt(`${key === 'admin' ? 'Yönetim' : 'Garson'} paneli şifresi:`);
    if (input == null) break;
    if (checkPanelPassword(key, input)) {
      sessionStorage.setItem(sessionKey, 'ok');
      return true;
    }
    alert(`Şifre hatalı. Kalan deneme: ${maxAttempts - attempt}`);
  }
  window.location.href = redirectTo;
  return false;
}

function recordWaiterCall(tableNo) {
  const n = Number(tableNo);
  const calls = getWaiterCalls();
  calls[String(n)] = Date.now();
  saveWaiterCalls(calls);
}

function clearWaiterCall(tableNo, expectedTs = null) {
  const n = Number(tableNo);
  const key = String(n);
  const calls = getWaiterCalls();
  if (!(key in calls)) return;
  if (expectedTs != null) {
    const currentTs = Number(calls[key]);
    if (Number.isFinite(currentTs) && currentTs !== Number(expectedTs)) return;
  }
  delete calls[key];
  saveWaiterCalls(calls);
}

function getLastWaiterCallTs(tableNo) {
  const n = Number(tableNo);
  const calls = getWaiterCalls();
  const ts = calls[String(n)];
  return Number.isFinite(Number(ts)) ? Number(ts) : null;
}

function clearOrders() { localStorage.removeItem(STORAGE_KEYS.orders); }
function resetAllData() {
  // Operasyonel sıfırlama:
  // - Siparişleri temizle
  // - Mevcut masaların durumunu "bos" yap
  // - Menü/kategori/masa sayısını değiştirme
  saveOrders([]);
  saveTables(getTables().map(t => ({ ...t, status: 'bos' })));
}

function recomputeProductDynamicServiceMinutes({ sampleLimit = 150 } = {}) {
  const orders = getOrders()
    .filter(o => Number.isFinite(Number(o?.id)))
    .sort((a, b) => Number(b.id) - Number(a.id))
    .slice(0, sampleLimit);

  const byProduct = new Map(); // id -> { sumMin, count }
  for (const order of orders) {
    const startTs =
      Number(order?.hazirlaniyorAtTs) ||
      Number(order?.alindiAtTs) ||
      Number(order?.createdAtTs) ||
      Number(order?.id);
    const endTs = Number(order?.hazirAtTs);
    if (!Number.isFinite(startTs) || !Number.isFinite(endTs) || endTs <= startTs) continue;

    const durationMin = Math.max(1, Math.round((endTs - startTs) / 60000));
    for (const item of order.items || []) {
      const pid = Number(item?.id);
      const qty = Math.max(1, Number(item?.quantity) || 1);
      if (!Number.isFinite(pid)) continue;
      const prev = byProduct.get(pid) || { sumMin: 0, count: 0 };
      prev.sumMin += durationMin * qty;
      prev.count += qty;
      byProduct.set(pid, prev);
    }
  }

  const products = getProducts();
  const updated = products.map(p => {
    const pid = Number(p?.id);
    const agg = byProduct.get(pid);
    // En az 100 sipariş adedine ulaşmadan otomatik ortalama devreye girmez;
    // bu aşamada yönetim panelindeki manuel süre kullanılır.
    if (!agg || agg.count < MIN_DYNAMIC_SERVICE_SAMPLE_COUNT) {
      return { ...p, dynamicEstimatedServiceMinutes: null };
    }
    const avg = Math.max(1, Math.round(agg.sumMin / agg.count));
    return { ...p, dynamicEstimatedServiceMinutes: avg };
  });
  saveProducts(updated);
}

function computeOrderEstimatedServiceMinutes(items) {
  const productById = new Map(getProducts().map(p => [Number(p.id), p]));
  let maxMinutes = null;
  for (const item of items || []) {
    const product = productById.get(Number(item.id));
    const minutes = product
      ? Number(product.dynamicEstimatedServiceMinutes ?? product.estimatedServiceMinutes)
      : NaN;
    if (!Number.isFinite(minutes) || minutes <= 0) continue;
    maxMinutes = maxMinutes == null ? minutes : Math.max(maxMinutes, minutes);
  }
  return maxMinutes == null ? null : Math.round(maxMinutes);
}

function getOrderCreatedAtTs(order) {
  const fromField = order && Number.isFinite(Number(order.createdAtTs)) ? Number(order.createdAtTs) : null;
  if (fromField != null) return fromField;
  // Backward compat: older orders used Date.now() as id
  const fromId = order && Number.isFinite(Number(order.id)) ? Number(order.id) : null;
  return fromId != null ? fromId : Date.now();
}

function getOrderEtaEndsAtTs(order) {
  const fromField = order && Number.isFinite(Number(order.etaEndsAtTs)) ? Number(order.etaEndsAtTs) : null;
  if (fromField != null) return fromField;
  const minsRaw = order ? Number(order.estimatedServiceMinutes) : NaN;
  const mins = Number.isFinite(minsRaw) && minsRaw > 0 ? minsRaw : null;
  if (mins == null) return null;
  const status = order?.status;
  if (status === 'alindi') return null;
  const startedAtTs = order && Number.isFinite(Number(order.hazirlaniyorAtTs)) ? Number(order.hazirlaniyorAtTs) : getOrderCreatedAtTs(order);
  return startedAtTs + mins * 60 * 1000;
}

function getOrderRemainingMs(order, nowTs = Date.now()) {
  const etaEndsAtTs = getOrderEtaEndsAtTs(order);
  if (etaEndsAtTs == null) return null;
  return Math.max(0, etaEndsAtTs - nowTs);
}

function formatMsAsMinutesSeconds(ms) {
  const totalSeconds = Math.max(0, Math.floor(Number(ms || 0) / 1000));
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${m}:${String(s).padStart(2, '0')}`;
}

function getNextOrderNo() {
  const maxNo = getOrders().reduce((max, order) => {
    const no = Number(order?.orderNo);
    return Number.isFinite(no) && no > max ? no : max;
  }, 0);
  return maxNo + 1;
}

function getOrderDisplayNo(order) {
  const no = Number(order?.orderNo);
  if (Number.isFinite(no) && no > 0) return no;
  return Number(order?.id);
}

function getCurrentPageBaseUrl() {
  if (window.location.protocol === 'http:' || window.location.protocol === 'https:') {
    return window.location.origin;
  }
  return '';
}

function normalizeQrBaseUrl(value) {
  const raw = String(value || '').trim().replace(/\/+$/, '');
  if (!raw) return '';
  try {
    const parsed = new URL(raw);
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') return '';
    return parsed.origin;
  } catch {
    return '';
  }
}

function getQrBaseUrl() {
  const saved = normalizeQrBaseUrl(localStorage.getItem(STORAGE_KEYS.qrBaseUrl));
  return saved || getCurrentPageBaseUrl();
}

function saveQrBaseUrl(value) {
  const normalized = normalizeQrBaseUrl(value);
  if (normalized) localStorage.setItem(STORAGE_KEYS.qrBaseUrl, normalized);
  else localStorage.removeItem(STORAGE_KEYS.qrBaseUrl);
  return normalized;
}

function getCustomerUrlForTable(tableNo) {
  const n = Number(tableNo);
  const base = getQrBaseUrl();
  const baseUrl = base
    ? new URL('musteri.html', `${base}/`)
    : new URL('musteri.html', window.location.href);
  if (Number.isFinite(n) && n >= 1 && n <= 999) {
    baseUrl.searchParams.set('masa', String(Math.trunc(n)));
  }
  return baseUrl.href;
}

function getQrImageUrlForTable(tableNo, size = 180) {
  const safeSize = Math.min(500, Math.max(120, Number(size) || 180));
  const url = getCustomerUrlForTable(tableNo);
  return `https://api.qrserver.com/v1/create-qr-code/?size=${safeSize}x${safeSize}&data=${encodeURIComponent(url)}`;
}

function ensureTableExists(tableNo) {
  const n = Number(tableNo);
  if (!Number.isFinite(n) || n < 1 || n > 999) return false;
  const tableNumber = Math.trunc(n);
  const tables = getTables();
  if (!tables.some(t => Number(t.number) === tableNumber)) {
    tables.push({ number: tableNumber, status: 'bos' });
    saveTables(tables);
  }
  return true;
}

function createOrder({ tableNo, items, note }) {
  ensureTableExists(tableNo);
  const orders = getOrders();
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const nowTs = Date.now();
  const orderId = nowTs * 1000 + Math.floor(Math.random() * 1000);
  const estimatedServiceMinutes = computeOrderEstimatedServiceMinutes(items);
  const orderNo = getNextOrderNo();
  const order = {
    id: orderId,
    orderNo,
    tableNo: Number(tableNo),
    items,
    note: typeof note === 'string' ? note.trim() : '',
    total,
    status: 'alindi',
    createdAt: new Date(nowTs).toLocaleString('tr-TR'),
    createdAtTs: nowTs,
    alindiAtTs: nowTs,
    estimatedServiceMinutes,
    etaEndsAtTs: null
  };
  orders.unshift(order);
  saveOrders(orders);
  syncTableStatusFromOrders();
  return order;
}

function updateOrderStatus(orderId, newStatus, options = {}) {
  const nowTs = Date.now();
  const waiterMeta = options && typeof options === 'object' ? options.waiter : null;
  const orders = getOrders().map(order =>
    order.id === orderId
      ? {
          ...order,
          status: newStatus,
          ...(newStatus === 'hazirlaniyor'
            ? {
                hazirlaniyorAtTs: order.hazirlaniyorAtTs || nowTs,
                etaEndsAtTs: (() => {
                  const mins = Number(order.estimatedServiceMinutes);
                  return Number.isFinite(mins) && mins > 0
                    ? (order.hazirlaniyorAtTs || nowTs) + mins * 60 * 1000
                    : null;
                })()
              }
            : {}),
          ...(newStatus === 'hazir'
            ? { hazirAtTs: order.hazirAtTs || nowTs }
            : {}),
          ...(newStatus === 'teslim'
            ? {
                teslimAtTs: order.teslimAtTs || nowTs,
                paymentReceived: false,
                paymentReceivedAtTs: null,
                ...(waiterMeta && Number.isFinite(Number(waiterMeta.id))
                  ? {
                      deliveredByWaiterId: Number(waiterMeta.id),
                      deliveredByWaiterName: String(waiterMeta.name || '')
                    }
                  : {})
              }
            : {})
        }
      : order
  );
  saveOrders(orders);
  syncTableStatusFromOrders();
  if (newStatus === 'hazir') {
    recomputeProductDynamicServiceMinutes();
  }
}

function markOrderPaid(orderId) {
  const nowTs = Date.now();
  const orders = getOrders().map(order => {
    if (order.id !== orderId) return order;
    return {
      ...order,
      paymentReceived: true,
      paymentReceivedAtTs: nowTs
    };
  });
  saveOrders(orders);
  syncTableStatusFromOrders();
}

function getLatestOrderByTable(tableNo) {
  const n = Number(tableNo);
  const orders = getOrders()
    .filter(order => Number(order.tableNo) === n)
    .sort((a, b) => Number(b.id) - Number(a.id));
  return orders.find(order => !(order.status === 'teslim' && order.paymentReceived)) || orders[0];
}

function formatCategoryLabel(cat) {
  if (!cat) return '';
  return cat.charAt(0).toUpperCase() + cat.slice(1);
}

function statusLabel(status) {
  return {
    alindi: 'Sipariş Alındı',
    hazirlaniyor: 'Hazırlanıyor',
    hazir: 'Servise Hazır',
    teslim: 'Teslim Edildi'
  }[status] || status;
}

function statusBadge(status) {
  return {
    alindi: 'bg-yellow-100 text-yellow-700',
    hazirlaniyor: 'bg-blue-100 text-blue-700',
    hazir: 'bg-green-100 text-green-700',
    teslim: 'bg-gray-200 text-gray-700'
  }[status] || 'bg-gray-100 text-gray-700';
}

function tableStatusText(status) {
  return {
    bos: 'Boş',
    bekliyor: 'Sipariş Bekliyor',
    hazirlaniyor: 'Hazırlanıyor',
    hazir: 'Servise Hazır',
    teslim: 'Servis Edildi'
  }[status] || status;
}

function tableSimpleStatusClass(status) {
  return {
    bos: 'bg-green-100 text-green-700',
    bekliyor: 'bg-yellow-100 text-yellow-700',
    hazirlaniyor: 'bg-yellow-100 text-yellow-700',
    hazir: 'bg-orange-100 text-orange-700',
    teslim: 'bg-purple-100 text-purple-700'
  }[status] || 'bg-gray-100 text-gray-700';
}

function syncTableStatusFromOrders() {
  const tables = getTables();
  const orders = getOrders();
  const priorityByStatus = {
    hazir: 4,
    hazirlaniyor: 3,
    alindi: 2,
    teslim: 1
  };
  const activeByTable = new Map();
  // Aynı masada birden fazla açık sipariş varsa masada en acil durumu göster.
  for (const order of orders) {
    if (order.status === 'teslim' && order.paymentReceived) continue;
    const key = order.tableNo;
    const prev = activeByTable.get(key);
    const orderPriority = priorityByStatus[order.status] || 0;
    const prevPriority = priorityByStatus[prev?.status] || 0;
    if (
      !prev ||
      orderPriority > prevPriority ||
      (orderPriority === prevPriority && Number(order.id) > Number(prev.id))
    ) {
      activeByTable.set(key, order);
    }
  }
  const updated = tables.map(table => {
    const order = activeByTable.get(table.number);
    if (!order) return { ...table, status: 'bos' };
    const mappedStatus = {
      alindi: 'bekliyor',
      hazirlaniyor: 'hazirlaniyor',
      hazir: 'hazir',
      // Teslim edildi -> masa mor; ödeme alındı işaretlenirse tekrar boş/yeşil
      teslim: 'teslim'
    }[order.status] || table.status;
    return { ...table, status: mappedStatus };
  });
  saveTables(updated);
}
