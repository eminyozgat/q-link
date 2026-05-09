const express = require('express');
const cors    = require('cors');
const http    = require('http');
const { Server } = require('socket.io');
const path    = require('path');
require('dotenv').config();

const authRoutes   = require('./src/routes/auth');
const menuRoutes   = require('./src/routes/menu');
const orderRoutes  = require('./src/routes/orders');
const tableRoutes  = require('./src/routes/tables');
const waiterRoutes = require('./src/routes/waiter');
const adminRoutes  = require('./src/routes/admin');
const { errorHandler } = require('./src/middleware/errorHandler');
const { initSocket }   = require('./src/socket');

const app    = express();
const server = http.createServer(app);
const io     = new Server(server, {
  cors: { origin: '*', methods: ['GET', 'POST'] }
});

app.use(cors());
app.use(express.json());

// Frontend statik dosyaları (proje kökünden)
app.use(express.static(path.join(__dirname, '..')));

// Her isteğe io ekle (controllers Socket.IO kullanabilsin)
app.use((req, res, next) => { req.io = io; next(); });

// API route'ları
app.use('/api/auth',   authRoutes);
app.use('/api/menu',   menuRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/tables', tableRoutes);
app.use('/api/waiter', waiterRoutes);
app.use('/api/admin',  adminRoutes);

app.get('/api/health', (req, res) => res.json({ status: 'ok', version: '2.0.0' }));

// Temiz URL route'ları (SDD §4.2)
const PUBLIC = path.join(__dirname, '..', 'public');
app.get('/masa/:no', (req, res) => res.sendFile(path.join(PUBLIC, 'customer', 'index.html')));
app.get('/mutfak',   (req, res) => res.sendFile(path.join(PUBLIC, 'kitchen',  'index.html')));
app.get('/garson',   (req, res) => res.sendFile(path.join(PUBLIC, 'waiter',   'index.html')));
app.get('/yonetim',  (req, res) => res.sendFile(path.join(PUBLIC, 'admin',    'index.html')));

// Hata işleyici (en sona)
app.use(errorHandler);

initSocket(io);

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Q-Link sunucu çalışıyor → http://localhost:${PORT}`);
  console.log(`Ortam: ${process.env.NODE_ENV || 'development'}`);
});
