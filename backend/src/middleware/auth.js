const jwt = require('jsonwebtoken');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

const JWT_SECRET = process.env.JWT_SECRET || 'qlink_secret';

function requireAuth(roles = []) {
  return (req, res, next) => {
    const header = req.headers.authorization;
    if (!header || !header.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Yetkilendirme token gerekli' });
    }
    try {
      const token  = header.slice(7);
      const payload = jwt.verify(token, JWT_SECRET);
      if (roles.length && !roles.includes(payload.role)) {
        return res.status(403).json({ error: 'Yetersiz yetki' });
      }
      req.user = payload;
      next();
    } catch {
      return res.status(401).json({ error: 'Geçersiz veya süresi dolmuş token' });
    }
  };
}

module.exports = { requireAuth, JWT_SECRET };
