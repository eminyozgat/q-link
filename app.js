// Q-Link Frontend v2.0 — REST API + Socket.IO

// ─── API Yardımcıları ───────────────────────────────────────
function getToken()       { return localStorage.getItem('qlink_token'); }
function setToken(t)      { localStorage.setItem('qlink_token', t); }
function clearToken()     { localStorage.removeItem('qlink_token'); }

async function apiFetch(method, path, body) {
  const token   = getToken();
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = 'Bearer ' + token;

  const res = await fetch(path, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Sunucu hatası' }));
    const e   = new Error(err.error || 'Hata');
    e.status  = res.status;
    throw e;
  }
  return res.json();
}

const api = {
  get:    (p)       => apiFetch('GET',    p),
  post:   (p, b)    => apiFetch('POST',   p, b),
  patch:  (p, b)    => apiFetch('PATCH',  p, b),
  put:    (p, b)    => apiFetch('PUT',    p, b),
  del:    (p)       => apiFetch('DELETE', p)
};

// ─── Socket.IO ──────────────────────────────────────────────
let _socket = null;

function getSocket() {
  if (!_socket) _socket = io();
  return _socket;
}

function joinRoom(room) {
  getSocket().emit('join', String(room));
}

// ─── Auth ────────────────────────────────────────────────────
async function loginUser(name, password, role) {
  const data = await api.post('/api/auth/login', { name, password, role });
  setToken(data.token);
  sessionStorage.setItem('qlink_user', JSON.stringify(data.user));
  return data;
}

function getLoggedInUser() {
  try { return JSON.parse(sessionStorage.getItem('qlink_user') || 'null'); }
  catch { return null; }
}

function logoutUser() {
  clearToken();
  sessionStorage.removeItem('qlink_user');
}

// ─── Menü Verileri ────────────────────────────────────────────
async function getMenuData() {
  return api.get('/api/menu');
}

async function getCategories() {
  const d = await getMenuData();
  return (d.categories || []).map(c => c.name);
}

async function getProducts() {
  const d = await getMenuData();
  return (d.items || []).map(item => ({
    id:                           item.id,
    name:                         item.name,
    price:                        Number(item.price),
    category:                     item.category_name,
    image:                        item.image_url || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=900&q=80',
    desc:                         item.description || '',
    estimatedServiceMinutes:      item.estimated_service_minutes,
    dynamicEstimatedServiceMinutes: item.dynamic_estimated_service_minutes
  }));
}

// ─── Siparişler ───────────────────────────────────────────────
function normalizeOrder(o) {
  return {
    id:                     o.id,
    orderNo:                o.order_no,
    tableNo:                o.table_number ?? o.tableNo,
    items:                  o.items || [],
    note:                   o.note || '',
    total:                  Number(o.total_price ?? o.total ?? 0),
    status:                 o.status,
    createdAt:              new Date(o.created_at).toLocaleString('tr-TR'),
    createdAtTs:            new Date(o.created_at).getTime(),
    hazirlaniyorAtTs:       o.hazirlaniyor_at ? new Date(o.hazirlaniyor_at).getTime() : null,
    hazirAtTs:              o.hazir_at        ? new Date(o.hazir_at).getTime()        : null,
    estimatedServiceMinutes: o.estimated_service_minutes,
    paymentReceived:        !!o.payment_received,
    deliveredByWaiterName:  o.delivered_by_name || ''
  };
}

async function getOrders(params = {}) {
  const qs  = new URLSearchParams(params).toString();
  const arr = await api.get('/api/orders' + (qs ? '?' + qs : ''));
  return arr.map(normalizeOrder);
}

async function getLatestOrderByTable(tableNo) {
  const orders = await getOrders({ tableNumber: tableNo });
  const sorted = orders.sort((a, b) => b.id - a.id);
  return sorted.find(o => !(o.status === 'teslim' && o.paymentReceived)) || sorted[0] || null;
}

async function createOrder({ tableNo, items, note }) {
  const o = await api.post('/api/orders', { tableNo, items, note });
  return normalizeOrder(o);
}

async function updateOrderStatus(orderId, newStatus, options = {}) {
  const o = await api.patch(`/api/orders/${orderId}/status`, { status: newStatus });
  return normalizeOrder(o);
}

async function markOrderPaid(orderId) {
  const o = await api.patch(`/api/orders/${orderId}/payment`, {});
  return normalizeOrder(o);
}

// ─── Masalar ──────────────────────────────────────────────────
async function getTables() {
  const tables = await api.get('/api/tables');
  return tables.map(t => ({ id: t.id, number: t.table_number, status: t.status }));
}

// ─── Garson Çağırma ───────────────────────────────────────────
async function recordWaiterCall(tableNo) {
  return api.post('/api/waiter/call', { tableNo });
}

async function getWaiterCalls() {
  return api.get('/api/waiter/calls');
}

async function clearWaiterCallApi(tableNo, ts) {
  return api.post('/api/waiter/ack', { tableNo, ts });
}

async function getLastWaiterCallTs(tableNo) {
  const calls = await getWaiterCalls();
  const ts    = calls[String(tableNo)];
  return Number.isFinite(Number(ts)) ? Number(ts) : null;
}

// ─── Admin: Garsonlar ─────────────────────────────────────────
async function getWaiters() {
  return api.get('/api/admin/waiters');
}

// ─── ETA Yardımcıları ─────────────────────────────────────────
function getOrderRemainingMs(order, nowTs = Date.now()) {
  const mins = Number(order?.estimatedServiceMinutes);
  if (!Number.isFinite(mins) || mins <= 0 || !order?.hazirlaniyorAtTs) return null;
  return Math.max(0, order.hazirlaniyorAtTs + mins * 60_000 - nowTs);
}

function getOrderDisplayNo(order) {
  return order?.orderNo || order?.order_no || order?.id;
}

// ─── UI Yardımcıları ──────────────────────────────────────────
function escapeHtml(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;').replaceAll("'", '&#39;');
}

function escapeAttr(value) { return escapeHtml(value); }

function jsStringArg(value) {
  return escapeAttr(JSON.stringify(String(value ?? '')));
}

function formatCategoryLabel(cat) {
  if (!cat) return '';
  return cat.charAt(0).toUpperCase() + cat.slice(1);
}

function statusLabel(status) {
  return { alindi: 'Sipariş Alındı', hazirlaniyor: 'Hazırlanıyor', hazir: 'Servise Hazır', teslim: 'Teslim Edildi' }[status] || status;
}

function statusBadge(status) {
  return {
    alindi:      'bg-yellow-100 text-yellow-700',
    hazirlaniyor:'bg-blue-100 text-blue-700',
    hazir:       'bg-green-100 text-green-700',
    teslim:      'bg-gray-200 text-gray-700'
  }[status] || 'bg-gray-100 text-gray-700';
}

function tableStatusText(status) {
  return { bos:'Boş', bekliyor:'Sipariş Bekliyor', hazirlaniyor:'Hazırlanıyor', hazir:'Servise Hazır', teslim:'Servis Edildi' }[status] || status;
}

function tableSimpleStatusClass(status) {
  return {
    bos:         'bg-green-100 text-green-700',
    bekliyor:    'bg-yellow-100 text-yellow-700',
    hazirlaniyor:'bg-yellow-100 text-yellow-700',
    hazir:       'bg-orange-100 text-orange-700',
    teslim:      'bg-purple-100 text-purple-700'
  }[status] || 'bg-gray-100 text-gray-700';
}

function formatMsAsMinutesSeconds(ms) {
  const total = Math.max(0, Math.floor(Number(ms || 0) / 1000));
  return `${Math.floor(total / 60)}:${String(total % 60).padStart(2, '0')}`;
}

function formatMsAsMinutesRoundedUp(ms) {
  return `${Math.max(0, Math.ceil(Number(ms || 0) / 60_000))} dk`;
}
