const express = require('express');
const { check, validationResult } = require('express-validator/check');
const bodyParser = require('body-parser');

const database = require('../models/mongodb');
const cache = require('../models/redis');

const router = express.Router();

const getDataFromCache = async (cacheClient, params) => {
  const cacheKey = JSON.stringify(params);
  const dataFromCache = await cache.get(cacheClient, 'cacheKey');
  let data = {};

  if (dataFromCache) {
    const dataFromCacheJson = JSON.parse(dataFromCache);
    data = {
      id: dataFromCacheJson.id,
      name: dataFromCacheJson.name,
      phone: dataFromCacheJson.phone,
      currency: dataFromCacheJson.currency,
      price: dataFromCacheJson.price,
    };
  }
  return data;
};

const getDataFromDatabase = async (databaseClient, cacheClient, params) => {
  const dataFromDatabase = await database.get(databaseClient, 'record', params);

  if (!dataFromDatabase.length) {
    return {};
  }

  const cacheKey = JSON.stringify(params);
  await cache.set(cacheClient, cacheKey, JSON.stringify(dataFromDatabase[0]));

  const { name, phone, currency, price } = dataFromDatabase[0];

  return {
    id: params.code,
    name,
    phone,
    currency,
    price,
  };
};

const getDatabaseClient = async () => {
  const databaseClient = await database.connect();
  const cacheClient = await cache.connect();

  router.use(bodyParser.json());
  router.use(bodyParser.urlencoded({ extended: true }));

  router.get('/', (req, res) => {
    res.render('record.jade');
  });

  router.post('/submit', [
    check('name').exists(),
    check('code').exists(),
  ], async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.send({ status: 'fail' });
    }

    const params = {
      id: req.body.code,
      name: req.body.name,
    };
    let data = await getDataFromCache(cacheClient, params);

    if (!data.name) {
      data = await getDataFromDatabase(databaseClient, cacheClient, params);
    }

    if(!data.name) {
      return res.send({ status: 'fail' });
    }

    return res.send({
      data,
      status: 'success',
    });
  });
};

getDatabaseClient();

module.exports = router;
