const router = require('express').Router();
const controllers = require('../controllers');

router.post('/shortenurl', controllers.createUrl);
router.get('/:shortUrl', controllers.goToUrl);
router.get('/:shortUrl/stats', controllers.getStats);

module.exports = router;
