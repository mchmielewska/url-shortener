const router = require('express').Router();
const controllers = require('../controllers');

router.post('/shortenurl', controllers.createUrl);
router.get('/:shortUrl', controllers.getUrl);

module.exports = router;
