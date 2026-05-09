const db = require('../config/db');

// ─── Helpers ────────────────────────────────────────────────
async function attachItems(orders) {
  if (!orders.length) return orders;
  const ids = orders.map(o => o.id);
  const [items] = await db.query(
    `SELECT oi.order_id, oi.menu_item_id AS id, mi.name, oi.unit_price AS price, oi.quantity
     FROM order_items oi
     JOIN menu_items mi ON oi.menu_item_id = mi.id
     WHERE oi.order_id IN (?)`,
    [ids]
  );
  const byOrder = new Map();
  for (const item of items) {
    if (!byOrder.has(item.order_id)) byOrder.set(item.order_id, []);
    byOrder.get(item.order_id).push({
      id:       item.id,
      name:     item.name,
      price:    Number(item.price),
      quantity: item.quantity
    });
  }
  for (const o of orders) {
    o.items = byOrder.get(o.id) || [];
  }
  return orders;
}

// ─── Queries ────────────────────────────────────────────────
async function getAll() {
  const [rows] = await db.query(`
    SELECT o.*, t.table_number, u.name AS delivered_by_name
    FROM orders o
    JOIN tables t ON o.table_id = t.id
    LEFT JOIN users u ON o.delivered_by_user_id = u.id
    ORDER BY o.id DESC
  `);
  return attachItems(rows);
}

async function getById(id) {
  const [rows] = await db.query(`
    SELECT o.*, t.table_number, u.name AS delivered_by_name
    FROM orders o
    JOIN tables t ON o.table_id = t.id
    LEFT JOIN users u ON o.delivered_by_user_id = u.id
    WHERE o.id = ?
  `, [id]);
  if (!rows[0]) return null;
  await attachItems(rows);
  return rows[0];
}

async function getByTableNumber(tableNumber) {
  const [rows] = await db.query(`
    SELECT o.*, t.table_number, u.name AS delivered_by_name
    FROM orders o
    JOIN tables t ON o.table_id = t.id
    LEFT JOIN users u ON o.delivered_by_user_id = u.id
    WHERE t.table_number = ?
    ORDER BY o.id DESC
  `, [tableNumber]);
  return attachItems(rows);
}

async function getNextOrderNo() {
  const [rows] = await db.query('SELECT MAX(order_no) AS max_no FROM orders');
  return (rows[0].max_no || 0) + 1;
}

async function create({ tableId, items, note, totalPrice, estimatedServiceMinutes }) {
  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();
    const orderNo = await getNextOrderNo();
    const [result] = await conn.query(
      'INSERT INTO orders (table_id, order_no, note, total_price, estimated_service_minutes) VALUES (?, ?, ?, ?, ?)',
      [tableId, orderNo, note || '', totalPrice, estimatedServiceMinutes || null]
    );
    const orderId = result.insertId;
    for (const item of items) {
      await conn.query(
        'INSERT INTO order_items (order_id, menu_item_id, quantity, unit_price) VALUES (?, ?, ?, ?)',
        [orderId, item.id, item.quantity, item.price]
      );
    }
    await conn.commit();
    return getById(orderId);
  } catch (e) {
    await conn.rollback();
    throw e;
  } finally {
    conn.release();
  }
}

async function updateStatus(id, status, options = {}) {
  let setClause = 'status = ?';
  const params = [status];

  if (status === 'hazirlaniyor') {
    setClause += ', hazirlaniyor_at = COALESCE(hazirlaniyor_at, NOW())';
  } else if (status === 'hazir') {
    setClause += ', hazir_at = COALESCE(hazir_at, NOW())';
  } else if (status === 'teslim') {
    setClause += ', teslim_at = COALESCE(teslim_at, NOW()), payment_received = 0';
    if (options.deliveredByUserId) {
      setClause += ', delivered_by_user_id = ?';
      params.push(options.deliveredByUserId);
    }
  }

  params.push(id);
  await db.query(`UPDATE orders SET ${setClause} WHERE id = ?`, params);
  return getById(id);
}

async function markPaid(id) {
  await db.query(
    'UPDATE orders SET payment_received = 1, payment_received_at = NOW() WHERE id = ?',
    [id]
  );
  return getById(id);
}

async function clearAll() {
  await db.query('DELETE FROM order_items');
  await db.query('DELETE FROM orders');
}

async function getRecentCompleted(limit = 150) {
  const [rows] = await db.query(`
    SELECT o.*, t.table_number
    FROM orders o
    JOIN tables t ON o.table_id = t.id
    WHERE o.hazirlaniyor_at IS NOT NULL AND o.hazir_at IS NOT NULL
    ORDER BY o.id DESC
    LIMIT ?
  `, [limit]);
  return attachItems(rows);
}

module.exports = { getAll, getById, getByTableNumber, create, updateStatus, markPaid, clearAll, getRecentCompleted };
