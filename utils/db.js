const { MongoClient } = require('mongodb');

class DBClient {
  constructor () {
    this.host = process.env.DB_HOST || 'localhost';
    this.port = process.env.DB_PORT || 27017;
    this.database = process.env.DB_DATABASE || 'files_manager';
    this.client = new MongoClient(
      `mongodb://${this.host}:${this.port}/${this.database}`,
      { useNewUrlParser: true, useUnifiedTopology: true }
    );
    this.client.on('error', error => console.error(error)).connect(); 
  }

  isAlive () {
    return this.client.topology.isConnected();
  }

  async nbUsers () {
    return await this.client.db().collection('users').countDocuments();
  }

  async nbFiles () {
    return await this.client.db().collection('files').countDocuments();
  }
}

let dbClient = new DBClient();
module.exports = dbClient;
