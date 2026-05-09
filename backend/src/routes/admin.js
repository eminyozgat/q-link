const router    = require('express').Router();
const { requireAuth } = require('../middleware/auth');
const menuCtrl  = require('../controllers/menuController');
const adminCtrl = require('../controllers/adminController');
const orderCtrl = require('../controllers/orderController');

// Tüm admin route'ları JWT admin yetkisi gerektirir
router.use(requireAuth(['admin']));

// Menü
router.post('/menu',             menuCtrl.createMenuItem);
router.put('/menu/:id',          menuCtrl.updateMenuItem);
router.delete('/menu/:id',       menuCtrl.deleteMenuItem);

// Kategoriler
router.get('/categories',        menuCtrl.getCategories);
router.post('/categories',       menuCtrl.createCategory);
router.put('/categories/:id',    menuCtrl.updateCategory);
router.delete('/categories/:id', menuCtrl.deleteCategory);

// Garsonlar
router.get('/waiters',           adminCtrl.getWaiters);
router.post('/waiters',          adminCtrl.createWaiter);
router.put('/waiters/:id',       adminCtrl.updateWaiter);
router.delete('/waiters/:id',    adminCtrl.deleteWaiter);

// Raporlar
router.get('/reports',           orderCtrl.getReports);

module.exports = router;
