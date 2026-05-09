const db = require('../config/db');

// ─── Categories ────────────────────────────────────────────────
async function getAllCategories() {
  const [rows] = await db.query('SELECT * FROM categories ORDER BY name');
  return rows;
}

async function getCategoryByName(name) {
  const [rows] = await db.query('SELECT * FROM categories WHERE name = ?', [name]);
  return rows[0] || null;
}

async function getCategoryById(id) {
  const [rows] = await db.query('SELECT * FROM categories WHERE id = ?', [id]);
  return rows[0] || null;
}

async function createCategory(name) {
  const [result] = await db.query('INSERT INTO categories (name) VALUES (?)', [name]);
  return { id: result.insertId, name };
}

async function updateCategory(id, newName) {
  await db.query('UPDATE categories SET name = ? WHERE id = ?', [newName, id]);
  // Update all menu items with old category
}

async function deleteCategoryById(id) {
  await db.query('DELETE FROM categories WHERE id = ?', [id]);
}

// ─── Menu Items ────────────────────────────────────────────────
async function getActiveItems() {
  const [rows] = await db.query(`
    SELECT mi.*, c.name AS category_name
    FROM menu_items mi
    JOIN categories c ON mi.category_id = c.id
    WHERE mi.is_active = 1
    ORDER BY c.name, mi.name
  `);
  return rows;
}

async function getAllItems() {
  const [rows] = await db.query(`
    SELECT mi.*, c.name AS category_name
    FROM menu_items mi
    JOIN categories c ON mi.category_id = c.id
    ORDER BY c.name, mi.name
  `);
  return rows;
}

async function getItemById(id) {
  const [rows] = await db.query(`
    SELECT mi.*, c.name AS category_name
    FROM menu_items mi
    JOIN categories c ON mi.category_id = c.id
    WHERE mi.id = ?
  `, [id]);
  return rows[0] || null;
}

async function createItem({ categoryId, name, price, description, imageUrl, estimatedServiceMinutes }) {
  const [result] = await db.query(
    'INSERT INTO menu_items (category_id, name, price, description, image_url, estimated_service_minutes) VALUES (?, ?, ?, ?, ?, ?)',
    [categoryId, name, price, description || null, imageUrl || null, estimatedServiceMinutes || null]
  );
  return getItemById(result.insertId);
}

async function updateItem(id, { categoryId, name, price, description, imageUrl, estimatedServiceMinutes }) {
  await db.query(
    'UPDATE menu_items SET category_id=?, name=?, price=?, description=?, image_url=?, estimated_service_minutes=?, dynamic_estimated_service_minutes=NULL WHERE id=?',
    [categoryId, name, price, description || null, imageUrl || null, estimatedServiceMinutes || null, id]
  );
  return getItemById(id);
}

async function deactivateItem(id) {
  await db.query('UPDATE menu_items SET is_active = 0 WHERE id = ?', [id]);
}

async function updateDynamicEta(productId, avgMinutes) {
  await db.query(
    'UPDATE menu_items SET dynamic_estimated_service_minutes = ? WHERE id = ?',
    [avgMinutes, productId]
  );
}

// Bir kategorideki tüm ürünleri başka kategoriye taşı
async function reassignCategory(oldCategoryId, newCategoryId) {
  await db.query(
    'UPDATE menu_items SET category_id = ? WHERE category_id = ?',
    [newCategoryId, oldCategoryId]
  );
}

module.exports = {
  getAllCategories, getCategoryByName, getCategoryById, createCategory, updateCategory, deleteCategoryById, reassignCategory,
  getActiveItems, getAllItems, getItemById, createItem, updateItem, deactivateItem, updateDynamicEta
};
