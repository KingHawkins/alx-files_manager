const sha = require('sha1')
const db = require('../utils/db')
const redis = require('../utils/redis')
const { v4: uuidv4 } = require('uuid')
const { ObjectId } = require('mongodb')

const AuthController = {
  getConnect: async function(req, res){
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Basic ')) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    const credentials = Buffer.from(authHeader.slice('Basic '.length), 'base64').toString();
    const [email, password] = credentials.split(':');
    let user = await db.client.db().collection('users').findOne({email: email});

    if(!user || user.password !== password){
      return res.status(401).json({ error: 'Unauthorized' })
    }
    const id = uuidv4().toString();
    await redis.set(id, user._id.toString(), 86400);
    return res.status(200).json({ token: id })
  },
  getDisconnect: async function(req, res){
    let user = await redis.get(req.headers['x-token']);
    if(!user) return res.status(401).json({ error: 'Unauthorized' });
    await redis.del(req.headers['x-token'])
    return res.status(204)
  },
  getMe: async function(req, res){
    let id = await redis.get(req.headers['x-token']);
    if(!id) return res.status(401).json({ error: 'Unauthorized' })
    let user = await db.client.db().collection('users').findOne({ _id: new ObjectId(id)})
    return res.json({ email: user.email, id: user._id })
  }
}

module.exports = AuthController;
