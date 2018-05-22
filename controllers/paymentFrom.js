const express = require('express');
const { check, validationResult } = require('express-validator/check');
const bodyParser = require('body-parser');
const rp = require('request-promise');
const config = require('config');
const uuidv4 = require('uuid/v4');
const creditCardType = require('credit-card-type');

const database = require('../models/mongodb');
const cache = require('../models/redis');

const router = express.Router();
const gateways = config.get('paymentGateway');

const getGateway = (gateways, cardNumber, currency) => {
  let gateway;
  const cardType = creditCardType(cardNumber);

  if (currency !== 'HKD') {
    gateway = gateways[0];
  } else {
    gateway = gateways[1];
  }

  if (cardType[0].type === 'american-express') {
    gateway = gateways[0];
  }

  return gateway;
};

const sendToGateway = async (data, gateway) => {
  const options = {
    method: 'POST',
    uri: `http://${gateway.host}:${gateway.port}`,
    body: data,
    json: true,
  };
  const gatewayReq = await rp(options);
  return gatewayReq.id;
};

const insertData = async (record, databaseClient, cacheClient) => {
  await database.insert(databaseClient, 'record', record);

  const cacheKey = JSON.stringify({
    id: record.id,
    name: record.name,
  });
  await cache.set(cacheClient, cacheKey, JSON.stringify(record));
}

const getDatabaseClient = async () => {
  const databaseClient = await database.connect();
  const cacheClient = await cache.connect();

  router.use(bodyParser.json());
  router.use(bodyParser.urlencoded({ extended: true }));

  router.get('/', (req, res) => {
    res.render('index.jade');
  });

  router.post('/submit', [
    check('name').exists(),
    check('phone').exists(),
    check('currency').exists(),
    check('price').exists(),
    check('cardName').exists(),
    check('cardNumber').exists(),
    check('cardExpiration').exists(),
    check('cardCcv').exists(),
  ], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.send({ status: 'fail' });
    }

    const { cardNumber, currency } = req.body;
    const gateway = getGateway(gateways, cardNumber, currency);
    const gatewayResponseId = await sendToGateway(req.body, gateway);

    if (!gatewayResponseId) {
      return res.send({ status: 'fail' });
    }

    const id = uuidv4();
    const record = {
      id,
      name: req.body.name,
      phone: req.body.phone,
      currency: req.body.currency,
      price: req.body.price,
      gatewayResponseId,
    };
    await insertData (record, databaseClient, cacheClient);

    return res.send({
      id,
      status: 'success',
    });
  });
};

getDatabaseClient();

module.exports = router;
