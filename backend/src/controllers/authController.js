const jwt       = require('jsonwebtoken');
const userModel = require('../models/userModel');
const { JWT_SECRET } = require('../middleware/auth');

async function login(req, res, next) {
  try {
    const { name, password, role } = req.body;
    if (!name || !password || !role) {
      return res.status(400).json({ error: 'Ad, şifre ve rol zorunlu' });
    }
    const user = await userModel.findByNameAndRole(name, role);
    if (!user) {
      return res.status(401).json({ error: 'Kullanıcı bulunamadı veya aktif değil' });
    }
    const valid = await userModel.verifyPassword(user, password);
    if (!valid) {
      return res.status(401).json({ error: 'Şifre hatalı' });
    }
    const token = jwt.sign(
      { id: user.id, name: user.name, role: user.role },
      JWT_SECRET,
      { expiresIn: '8h' }
    );
    res.json({ token, user: { id: user.id, name: user.name, role: user.role } });
  } catch (e) { next(e); }
}

module.exports = { login };
