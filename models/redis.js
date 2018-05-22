const redis = require("redis");
const { promisify } = require('util');
const config = require('config');

exports.connect = async () => {
  const redisConfig = config.get('database.redis');
  return await redis.createClient(redisConfig.port);
}

exports.get = async (client, key) => {
  const getAsync = promisify(client.get).bind(client);
  return await getAsync(key);
}

exports.set = async (client, key, value) => {
  const setAsync = promisify(client.set).bind(client);
  return await setAsync(key, value);
}
