const express = require('express');
const uuidv4 = require('uuid/v4');
const bodyParser = require('body-parser');

const router = express.Router();

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

router.post('/', (req, res) => {
  const { price, currency } = req.body;
  const time = new Date().toISOString();
  const response = {
    id: uuidv4(),
    createTime: time,
    updateTime: time,
    state: 'created',
    intent: 'sale',
    payer: {
      'payment_method': 'credit card'
    },
    transactions: [{
      amount: {
        total: price,
        currency: currency,
      },
    }],
  };

  res.setHeader('Content-Type', 'application/json');
  res.send(JSON.stringify(response));
})

module.exports = router;
