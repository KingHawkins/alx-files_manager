const { createClient } = require('redis');

class RedisClient {
  constructor () {
    this.client = createClient();

    this.client.on('error', (error) => {
      console.error('Redis client error', error);
    }).connect()
  }

  isAlive () {
     return this.client.isOpen;
  }

  async get (key) {
    return await this.client.get(key)
  }

  async set (key, value, duration) {
    await this.client.set(key, value);
    await this.client.expire(key, duration);
  }

  async del(key){
    await this.client.del(key);
  }
}

const redisClient = new RedisClient();
module.exports = redisClient;

