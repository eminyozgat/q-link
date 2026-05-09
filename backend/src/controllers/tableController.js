const tableModel = require('../models/tableModel');
const orderModel = require('../models/orderModel');

async function getTables(req, res, next) {
  try {
    res.json(await tableModel.getAll());
  } catch (e) { next(e); }
}

async function createTable(req, res, next) {
  try {
    const n = Number(req.body.tableNumber);
    if (!Number.isFinite(n) || n < 1) {
      return res.status(400).json({ error: 'Geçerli masa numarası zorunlu' });
    }
    if (await tableModel.getByNumber(n)) {
      return res.status(409).json({ error: 'Bu masa numarası zaten var' });
    }
    const table = await tableModel.create(n);
    if (req.io) req.io.emit('tables:updated');
    res.status(201).json(table);
  } catch (e) { next(e); }
}

async function deleteTable(req, res, next) {
  try {
    await tableModel.remove(Number(req.params.id));
    if (req.io) req.io.emit('tables:updated');
    res.json({ success: true });
  } catch (e) { next(e); }
}

async function updateTableStatus(req, res, next) {
  try {
    await tableModel.updateStatus(Number(req.params.id), req.body.status);
    if (req.io) req.io.emit('tables:updated');
    res.json({ success: true });
  } catch (e) { next(e); }
}

async function resetAll(req, res, next) {
  try {
    await orderModel.clearAll();
    const tables = await tableModel.getAll();
    for (const t of tables) await tableModel.updateStatus(t.id, 'bos');
    if (req.io) {
      req.io.emit('tables:updated');
      req.io.emit('orders:reset');
    }
    res.json({ success: true });
  } catch (e) { next(e); }
}

module.exports = { getTables, createTable, deleteTable, updateTableStatus, resetAll };
