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
    try{
      const value = await this.client.get(key)
      await this.client.disconnect();
      return value;
    }catch(error){
      await this.client.connect();
      const value = await this.client.get(key);
      await this.client.disconnect()
      return value;
    }
  }

  async set (key, value, duration) {
    try{
      await this.client.set(key, value);
      await this.client.expire(key, duration);
      await this.client.disconnect();
    }catch(error){
      await this.client.connect();
      await this.client.set(key, value);
      await this.client.expire(key, duration);
      await this.client.disconnect();
    }
    
  }

  async del(key){
    this.client.on('error', (error) => {
      await this.client.connect();
      await this.client.del(key);
      await this.client.disconnect();
    })
    this.client.on('connect', () => {
      await this.client.del(key));
      await this.client.disconnect();
    }
  }
}

const redisClient = new RedisClient();
module.exports = redisClient;
