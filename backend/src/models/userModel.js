const db     = require('../config/db');
const bcrypt = require('bcryptjs');

async function getAll() {
  const [rows] = await db.query(
    'SELECT id, name, role, phone, is_active FROM users ORDER BY id'
  );
  return rows;
}

async function getById(id) {
  const [rows] = await db.query('SELECT * FROM users WHERE id = ?', [id]);
  return rows[0] || null;
}

async function getByRole(role) {
  const [rows] = await db.query(
    'SELECT id, name, role, phone, is_active FROM users WHERE role = ? ORDER BY id',
    [role]
  );
  return rows;
}

async function findByNameAndRole(name, role) {
  const [rows] = await db.query(
    'SELECT * FROM users WHERE name = ? AND role = ? AND is_active = 1',
    [name, role]
  );
  return rows[0] || null;
}

async function verifyPassword(user, password) {
  if (!user || !user.password_hash) return false;
  return bcrypt.compare(String(password), user.password_hash);
}

async function create({ name, role, password, phone }) {
  const hash = await bcrypt.hash(String(password), 10);
  const [result] = await db.query(
    'INSERT INTO users (name, role, password_hash, phone) VALUES (?, ?, ?, ?)',
    [name, role, hash, phone || null]
  );
  const [rows] = await db.query(
    'SELECT id, name, role, phone, is_active FROM users WHERE id = ?',
    [result.insertId]
  );
  return rows[0];
}

async function update(id, { name, phone, password }) {
  if (password) {
    const hash = await bcrypt.hash(String(password), 10);
    await db.query(
      'UPDATE users SET name=?, phone=?, password_hash=? WHERE id=?',
      [name, phone || null, hash, id]
    );
  } else {
    await db.query(
      'UPDATE users SET name=?, phone=? WHERE id=?',
      [name, phone || null, id]
    );
  }
  const [rows] = await db.query(
    'SELECT id, name, role, phone, is_active FROM users WHERE id = ?',
    [id]
  );
  return rows[0];
}

async function remove(id) {
  await db.query('DELETE FROM users WHERE id = ?', [id]);
}

module.exports = { getAll, getById, getByRole, findByNameAndRole, verifyPassword, create, update, remove };
