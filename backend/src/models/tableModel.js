const db = require('../config/db');

async function getAll() {
  const [rows] = await db.query('SELECT * FROM tables ORDER BY table_number');
  return rows;
}

async function getById(id) {
  const [rows] = await db.query('SELECT * FROM tables WHERE id = ?', [id]);
  return rows[0] || null;
}

async function getByNumber(tableNumber) {
  const [rows] = await db.query('SELECT * FROM tables WHERE table_number = ?', [tableNumber]);
  return rows[0] || null;
}

async function create(tableNumber, status = 'bos') {
  const [result] = await db.query(
    'INSERT INTO tables (table_number, status) VALUES (?, ?)',
    [tableNumber, status]
  );
  return getById(result.insertId);
}

async function updateStatus(id, status) {
  await db.query('UPDATE tables SET status = ? WHERE id = ?', [status, id]);
}

async function remove(id) {
  await db.query('DELETE FROM tables WHERE id = ?', [id]);
}

// Aktif siparişlerden masa durumlarını otomatik senkronize et
async function syncFromOrders(orders) {
  const tables = await getAll();
  const priority = { hazir: 4, hazirlaniyor: 3, alindi: 2, teslim: 1 };
  const activeByTable = new Map();

  for (const order of orders) {
    if (order.status === 'teslim' && order.payment_received) continue;
    const key = order.table_number;
    const prev = activeByTable.get(key);
    const op = priority[order.status] || 0;
    const pp = priority[prev?.status] || 0;
    if (!prev || op > pp || (op === pp && order.id > (prev?.id || 0))) {
      activeByTable.set(key, order);
    }
  }

  const statusMap = { alindi: 'bekliyor', hazirlaniyor: 'hazirlaniyor', hazir: 'hazir', teslim: 'teslim' };
  for (const table of tables) {
    const order = activeByTable.get(table.table_number);
    const newStatus = order ? (statusMap[order.status] || table.status) : 'bos';
    if (newStatus !== table.status) {
      await updateStatus(table.id, newStatus);
    }
  }
}

module.exports = { getAll, getById, getByNumber, create, updateStatus, remove, syncFromOrders };
