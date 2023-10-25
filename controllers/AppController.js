const redis = require('../utils/redis');
const db = require('../utils/db');

const AppController = {
  getStatus: function(req, res){
    return res.json({ redis: redis.isAlive(), db: db.isAlive() });
  },
  getStats: async function(req, res){
    return res.json({ users: await db.nbUsers(), files: await db.nbFiles() });
  }
}

module.exports = AppController;
