const router = require('express').Router();
const controllers = require('../controllers');

router.post('/', controllers.createUrl);
router.get('/', controllers.getAllUrls);

router.get('/:shortUrl/', controllers.goToUrl);
router.get('/:shortUrl/stats', controllers.getStats);

module.exports = router;
