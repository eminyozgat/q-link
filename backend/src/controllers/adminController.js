const userModel = require('../models/userModel');

async function getWaiters(req, res, next) {
  try {
    res.json(await userModel.getByRole('waiter'));
  } catch (e) { next(e); }
}

async function createWaiter(req, res, next) {
  try {
    const { name, phone, pin } = req.body;
    if (!name || !pin) return res.status(400).json({ error: 'Ad ve PIN zorunlu' });
    const waiter = await userModel.create({ name, role: 'waiter', password: pin, phone });
    res.status(201).json(waiter);
  } catch (e) { next(e); }
}

async function updateWaiter(req, res, next) {
  try {
    const { name, phone, pin } = req.body;
    if (!name) return res.status(400).json({ error: 'Ad zorunlu' });
    const waiter = await userModel.update(Number(req.params.id), {
      name,
      phone,
      password: pin || undefined
    });
    res.json(waiter);
  } catch (e) { next(e); }
}

async function deleteWaiter(req, res, next) {
  try {
    await userModel.remove(Number(req.params.id));
    res.json({ success: true });
  } catch (e) { next(e); }
}

module.exports = { getWaiters, createWaiter, updateWaiter, deleteWaiter };
