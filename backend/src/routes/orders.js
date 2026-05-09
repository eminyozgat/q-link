const router = require('express').Router();
const { requireAuth } = require('../middleware/auth');
const ctrl   = require('../controllers/orderController');

router.get('/',                      ctrl.getOrders);
router.post('/',                     ctrl.createOrder);
router.get('/stats',                 ctrl.getKitchenStats);
router.get('/:id',                   ctrl.getOrder);
router.patch('/:id/status',          ctrl.updateOrderStatus);
router.patch('/:id/payment', requireAuth(['admin']), ctrl.markPayment);

module.exports = router;
