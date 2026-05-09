const router = require('express').Router();
const ctrl   = require('../controllers/menuController');

router.get('/',    ctrl.getMenu);
router.get('/:id', ctrl.getMenuItem);

module.exports = router;
