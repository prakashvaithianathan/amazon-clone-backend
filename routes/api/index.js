const router = require('express').Router();
const user = require('./user')
const product = require('./product')
const payment = require('./payment')

router.use('/user',user);
router.use('/product',product);
router.use('/payment',payment);
module.exports = router;
