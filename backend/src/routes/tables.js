const router = require('express').Router();
const { requireAuth } = require('../middleware/auth');
const ctrl   = require('../controllers/tableController');

router.get('/',                           ctrl.getTables);
router.post('/',    requireAuth(['admin']), ctrl.createTable);
router.delete('/:id', requireAuth(['admin']), ctrl.deleteTable);
router.patch('/:id/status', requireAuth(['admin']), ctrl.updateTableStatus);
router.post('/reset', requireAuth(['admin']), ctrl.resetAll);

module.exports = router;
