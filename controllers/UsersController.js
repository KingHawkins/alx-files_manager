const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const sha = require('sha1')
const db = require('../utils/db')


const UsersController = {
  createUsers: async function(req, res){
    if(!req.body.email){
      return res.status(400).json({error: "Missing email"})
    }else if(!req.body.password){
      return res.status(400).json({error: "Missing password"})
    }else{
      let email = await db.client.db().collection('users').findOne({email: req.body.email});
      if (email){
        res.status(400).json({error: 'Already exist'});
      }else{
        let password = sha(req.body.password);
        let user = await db.client.db().collection('users').insertOne({email: req.body.email, password: password});
        return res.status(201).json({id: user.ops[0]._id, email: user.ops[0].email})
      }
    }
  }
}

module.exports = {UsersController};
