const router = require('express').Router();
const ctrl   = require('../controllers/tableController');

router.get('/', ctrl.getTables);

module.exports = router;
