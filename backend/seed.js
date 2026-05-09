// Q-Link Seed Script
// Kullanım: cd backend && npm run seed

require('dotenv').config();
const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');

async function seed() {
  const conn = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASS || '',
    database: process.env.DB_NAME || 'qlink',
    multipleStatements: true
  });

  console.log('Seed başlıyor...');

  const adminHash   = await bcrypt.hash('1234', 10);
  const waiter1Hash = await bcrypt.hash('1001', 10);
  const waiter2Hash = await bcrypt.hash('1002', 10);

  await conn.query('DELETE FROM notifications');
  await conn.query('DELETE FROM waiter_calls');
  await conn.query('DELETE FROM order_items');
  await conn.query('DELETE FROM orders');
  await conn.query('DELETE FROM menu_items');
  await conn.query('DELETE FROM categories');
  await conn.query('DELETE FROM tables');
  await conn.query('DELETE FROM users');

  await conn.query(
    'INSERT INTO users (name, role, password_hash, phone, is_active) VALUES ?',
    [[
      ['Admin', 'admin',  adminHash,    null,             1],
      ['Ahmet', 'waiter', waiter1Hash,  '0555 000 00 01', 1],
      ['Elif',  'waiter', waiter2Hash,  '0555 000 00 02', 1]
    ]]
  );

  const tableRows = [];
  for (let i = 1; i <= 12; i++) tableRows.push([i, 'bos']);
  await conn.query('INSERT INTO tables (table_number, status) VALUES ?', [tableRows]);

  await conn.query(
    'INSERT INTO categories (name) VALUES ?',
    [[['burger'], ['pizza'], ['icecek'], ['tatli'], ['yan']]]
  );

  const [cats] = await conn.query('SELECT id, name FROM categories');
  const catMap = {};
  cats.forEach(c => { catMap[c.name] = c.id; });

  const items = [
    [catMap['burger'], 'Cheeseburger',      220.00, 'Et, cheddar, turşu ve özel sos.',      'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=900&q=80', 15],
    [catMap['pizza'],  'Karışık Pizza',      280.00, 'Sucuk, mantar, zeytin ve bol peynir.', 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=900&q=80', 20],
    [catMap['icecek'], 'Kola',               45.00,  '330 ml soğuk içecek.',                 'https://images.unsplash.com/photo-1544145945-f90425340c7e?auto=format&fit=crop&w=900&q=80',  3],
    [catMap['tatli'],  'Cheesecake',         110.00, 'Frambuaz soslu özel tatlı.',            'https://images.unsplash.com/photo-1563805042-7684c019e1cb?auto=format&fit=crop&w=900&q=80',  8],
    [catMap['yan'],    'Patates Kızartması', 95.00,  'Çıtır ve sıcak servis.',               'https://images.unsplash.com/photo-1576107232684-1279f390859f?auto=format&fit=crop&w=900&q=80', 10],
    [catMap['icecek'], 'Limonata',           60.00,  'Taze limon ve nane.',                  'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=900&q=80',  4]
  ];
  await conn.query(
    'INSERT INTO menu_items (category_id, name, price, description, image_url, estimated_service_minutes) VALUES ?',
    [items]
  );

  await conn.end();
  console.log('Seed tamamlandı.');
  console.log('Admin  : Ad=Admin  Şifre=1234');
  console.log('Garson1: Ad=Ahmet  PIN=1001');
  console.log('Garson2: Ad=Elif   PIN=1002');
}

seed().catch(err => { console.error(err); process.exit(1); });
