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
    const value = await this.client.get(key)
    return value
  }

  async set (key, value, duration) {
    await this.client.set(key, value, {
      EX: duration,
      NX: true,
    });
  }

  async del(key){
    await this.client.del(key);
  }
}
let redisClient = new RedisClient();
module.exports = redisClient
