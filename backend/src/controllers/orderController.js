const orderModel = require('../models/orderModel');
const menuModel  = require('../models/menuModel');
const tableModel = require('../models/tableModel');

function computeEta(items, menuItems) {
  const byId = new Map(menuItems.map(m => [m.id, m]));
  let max = null;
  for (const item of items) {
    const mi   = byId.get(item.id);
    if (!mi) continue;
    const mins = Number(mi.dynamic_estimated_service_minutes ?? mi.estimated_service_minutes);
    if (!Number.isFinite(mins) || mins <= 0) continue;
    max = max == null ? mins : Math.max(max, mins);
  }
  return max;
}

async function recomputeDynamicEta() {
  const orders = await orderModel.getRecentCompleted(150);
  const byProduct = new Map();
  for (const order of orders) {
    const startTs = order.hazirlaniyor_at ? new Date(order.hazirlaniyor_at).getTime() : null;
    const endTs   = order.hazir_at        ? new Date(order.hazir_at).getTime()        : null;
    if (!startTs || !endTs || endTs <= startTs) continue;
    const durationMin = Math.max(1, Math.round((endTs - startTs) / 60000));
    for (const item of order.items || []) {
      const qty  = Math.max(1, item.quantity || 1);
      const prev = byProduct.get(item.id) || { sumMin: 0, count: 0 };
      prev.sumMin += durationMin * qty;
      prev.count  += qty;
      byProduct.set(item.id, prev);
    }
  }
  for (const [pid, agg] of byProduct) {
    if (agg.count >= 100) {
      await menuModel.updateDynamicEta(pid, Math.max(1, Math.round(agg.sumMin / agg.count)));
    }
  }
}

async function getOrders(req, res, next) {
  try {
    const { status, tableNumber } = req.query;
    let orders = tableNumber
      ? await orderModel.getByTableNumber(Number(tableNumber))
      : await orderModel.getAll();
    if (status) orders = orders.filter(o => o.status === status);
    res.json(orders);
  } catch (e) { next(e); }
}

async function getOrder(req, res, next) {
  try {
    const order = await orderModel.getById(Number(req.params.id));
    if (!order) return res.status(404).json({ error: 'Sipariş bulunamadı' });
    res.json(order);
  } catch (e) { next(e); }
}

async function createOrder(req, res, next) {
  try {
    const { tableNo, items, note } = req.body;
    if (!tableNo || !items?.length) {
      return res.status(400).json({ error: 'Masa numarası ve ürünler zorunlu' });
    }
    const table = await tableModel.getByNumber(Number(tableNo));
    if (!table) return res.status(404).json({ error: 'Masa bulunamadı' });

    const menuItems  = await menuModel.getActiveItems();
    const totalPrice = items.reduce((s, i) => s + Number(i.price) * i.quantity, 0);
    const eta        = computeEta(items, menuItems);

    const order = await orderModel.create({ tableId: table.id, items, note, totalPrice, estimatedServiceMinutes: eta });

    const allOrders = await orderModel.getAll();
    await tableModel.syncFromOrders(allOrders);

    if (req.io) {
      req.io.to('kitchen').emit('order:new', order);
      req.io.emit('tables:updated');
    }
    res.status(201).json(order);
  } catch (e) { next(e); }
}

async function updateOrderStatus(req, res, next) {
  try {
    const { status } = req.body;
    if (!['hazirlaniyor', 'hazir', 'teslim'].includes(status)) {
      return res.status(400).json({ error: 'Geçersiz durum' });
    }
    const options = {};
    if (status === 'teslim' && req.user) options.deliveredByUserId = req.user.id;

    const order = await orderModel.updateStatus(Number(req.params.id), status, options);
    if (!order) return res.status(404).json({ error: 'Sipariş bulunamadı' });

    const allOrders = await orderModel.getAll();
    await tableModel.syncFromOrders(allOrders);

    if (status === 'hazir') recomputeDynamicEta().catch(console.error);

    if (req.io) {
      req.io.emit('order:statusUpdate', order);
      req.io.emit('tables:updated');
      if (status === 'hazir')  req.io.to('waiter').emit('order:statusUpdate', order);
      if (status === 'teslim') req.io.to(`table_${order.table_number}`).emit('order:delivered', order);
    }
    res.json(order);
  } catch (e) { next(e); }
}

async function markPayment(req, res, next) {
  try {
    const order = await orderModel.markPaid(Number(req.params.id));
    if (!order) return res.status(404).json({ error: 'Sipariş bulunamadı' });
    const allOrders = await orderModel.getAll();
    await tableModel.syncFromOrders(allOrders);
    if (req.io) {
      req.io.emit('order:paymentReceived', order);
      req.io.emit('tables:updated');
    }
    res.json(order);
  } catch (e) { next(e); }
}

async function getReports(req, res, next) {
  try {
    const orders       = await orderModel.getAll();
    const totalRevenue = orders.reduce((s, o) => s + Number(o.total_price), 0);
    const productMap   = {};
    orders.forEach(o => (o.items || []).forEach(i => {
      productMap[i.name] = (productMap[i.name] || 0) + i.quantity;
    }));
    const popular = Object.entries(productMap).sort((a, b) => b[1] - a[1]).slice(0, 10);
    res.json({ orders, totalRevenue, popular });
  } catch (e) { next(e); }
}

async function getKitchenStats(req, res, next) {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const orders    = await orderModel.getAll();
    const todayOrders = orders.filter(o => new Date(o.created_at) >= today);
    const completedToday = todayOrders.filter(o => ['hazir', 'teslim'].includes(o.status));
    const withTimes = todayOrders.filter(o => o.hazirlaniyor_at && o.hazir_at);
    let avgPrepMinutes = null;
    if (withTimes.length > 0) {
      const totalMins = withTimes.reduce((sum, o) => {
        const start = new Date(o.hazirlaniyor_at).getTime();
        const end   = new Date(o.hazir_at).getTime();
        return sum + Math.max(0, (end - start) / 60000);
      }, 0);
      avgPrepMinutes = Math.round(totalMins / withTimes.length);
    }
    res.json({ todayCount: todayOrders.length, completedCount: completedToday.length, avgPrepMinutes });
  } catch (e) { next(e); }
}

module.exports = { getOrders, getOrder, createOrder, updateOrderStatus, markPayment, getReports, getKitchenStats };
