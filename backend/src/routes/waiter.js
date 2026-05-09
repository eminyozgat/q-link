const router = require('express').Router();
const ctrl   = require('../controllers/waiterController');

router.post('/call', ctrl.callWaiter);
router.post('/ack',  ctrl.acknowledgeCall);
router.get('/calls', ctrl.getCalls);

module.exports = router;
