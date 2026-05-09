const db         = require('../config/db');
const tableModel = require('../models/tableModel');

// In-memory cooldown: tableNumber → timestamp
const cooldowns = new Map();

async function callWaiter(req, res, next) {
  try {
    const { tableNo } = req.body;
    if (!tableNo) return res.status(400).json({ error: 'Masa numarası zorunlu' });
    const n   = Number(tableNo);
    const now = Date.now();
    const last = cooldowns.get(n);
    if (last && now - last < 60_000) {
      return res.status(429).json({
        error: 'Çok sık çağrı',
        retryAfter: Math.ceil((60_000 - (now - last)) / 1000)
      });
    }
    cooldowns.set(n, now);

    const table = await tableModel.getByNumber(n);
    if (table) {
      await db.query('INSERT INTO waiter_calls (table_id) VALUES (?)', [table.id]);
    }
    if (req.io) req.io.to('waiter').emit('waiter:call', { tableNo: n, ts: now });
    res.json({ success: true, ts: now });
  } catch (e) { next(e); }
}

async function acknowledgeCall(req, res, next) {
  try {
    const { tableNo, ts } = req.body;
    const n = Number(tableNo);
    if (cooldowns.get(n) === Number(ts)) cooldowns.delete(n);

    await db.query(
      `UPDATE waiter_calls
       SET acknowledged_by = ?, acknowledged_at = NOW()
       WHERE table_id = (SELECT id FROM tables WHERE table_number = ?)
         AND acknowledged_at IS NULL`,
      [req.user?.id || null, n]
    );
    if (req.io) req.io.to('waiter').emit('waiter:callCleared', { tableNo: n });
    res.json({ success: true });
  } catch (e) { next(e); }
}

async function getCalls(req, res, next) {
  try {
    const calls = {};
    cooldowns.forEach((ts, tableNo) => { calls[tableNo] = ts; });
    res.json(calls);
  } catch (e) { next(e); }
}

module.exports = { callWaiter, acknowledgeCall, getCalls };
