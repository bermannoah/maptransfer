const router = require('express').Router();

router.use('/transfers', require('./transfer'));

module.exports = router;
