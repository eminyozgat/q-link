const mysql = require('mysql2/promise');
const path  = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

const pool = mysql.createPool({
  host:             process.env.DB_HOST || 'localhost',
  user:             process.env.DB_USER || 'root',
  password:         process.env.DB_PASS || '',
  database:         process.env.DB_NAME || 'qlink',
  waitForConnections: true,
  connectionLimit:  10,
  queueLimit:       0,
  timezone:         '+03:00'
});

module.exports = pool;
