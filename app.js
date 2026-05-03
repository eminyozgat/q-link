const STORAGE_KEYS = {
  orders: 'qlink_orders',
  tables: 'qlink_tables',
  categories: 'qlink_categories',
  products: 'qlink_products',
  waiterCalls: 'qlink_waiter_calls',
  waiters: 'qlink_waiters',
  panelPasswords: 'qlink_panel_passwords'
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

const DEFAULT_CATEGORIES = ['burger', 'pizza', 'icecek', 'tatli', 'yan'];
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
function getProducts() { return readStorage(STORAGE_KEYS.products, DEFAULT_PRODUCTS); }
function saveProducts(v) { writeStorage(STORAGE_KEYS.products, v); }

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

function createOrder({ tableNo, items, note }) {
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
