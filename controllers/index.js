const express = require('express');
const router = express.Router();

router.use('/', require('./paymentFrom'));
router.use('/record', require('./paymentRecord'));

module.exports = router;
