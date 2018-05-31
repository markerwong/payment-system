const expect = require('chai').expect;
const sinon = require('sinon');
const redis = require('redis');
const config = require('config');
const { promisify } = require('util');

const redisFunctions = require('../../../models/redis');

describe('models/redis', () => {
  const sandbox = sinon.createSandbox();

  afterEach(() => {
    sandbox.restore();
  });

  describe('connect', () => {
    it('should run connect with correct port', async () => {
      sandbox.stub(config, 'get').returns({
        port: 6379,
      });
      sandbox.stub(redis, 'createClient');

      const connect = await redisFunctions.connect();

      expect(config.get.calledOnce).to.be.true;
      expect(redis.createClient.calledOnce).to.be.true;
      expect(redis.createClient.getCall(0).args[0]).to.equal(6379);
    });
  });

  describe('get', () => {
    it('should run get with key', async () => {
      const testKey = 'test ket';
      const doc = 'test doc';
      const client = {
        get: sandbox.stub()
          .callsFake((key, cb) => {
            cb(null, doc);
          }),
      };

      await redisFunctions.get(client, testKey);

      expect(client.get.calledOnce).to.be.true;
      expect(client.get.getCall(0).args[0]).to.equal(testKey);
    });
  });

  describe('set', () => {
    it('should run set with input', async () => {
      const testKey = 'test ket';
      const testValue = 'test value';
      const client = {
        set: sandbox.stub()
          .callsFake((key, value, cb) => {
            cb(null);
          }),
      };

      await redisFunctions.set(client, testKey, testValue);

      expect(client.set.calledOnce).to.be.true;
      expect(client.set.getCall(0).args[0]).to.equal(testKey);
      expect(client.set.getCall(0).args[1]).to.equal(testValue);
    });
  });
});
