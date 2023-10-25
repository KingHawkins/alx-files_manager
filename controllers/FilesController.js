const db = require('../utils/db')
const redis = require('../utils/redis')
const { ObjectId} = require('mongodb')
const {v4} = require('uuid')
const path = require('path')
const fs = require('fs')
const fse = require('fs-extra')

const FilesController = {
  postUpload: async function(req, res){
    let id = await redis.get(req.headers['x-token'])
    let user = await db.client.db().collection('users').findOne({'_id': new ObjectId(id)});
    if(!user) return res.status(401).json({ error: 'Unauthorized' });

    const {name, type, parentId = 0, isPublic = false, data} = req.body;

    if(!name) return res.status(400).json({error: "Missing name"});
    if(!type) return res.status(400).json({error: "Missing type"});
    if(!data && type !== 'folder') return res.status(400).json({error: "Missing data"});

    if(parentId){
      let file = await db.client.db().collection('files').findOne({parentId: parentId});
      if(!file) return res.status(400).json({error: "Parent not found"});
      if(file.type !== 'folder') return res.status(400).json({error: "Parent is not a folder"}); 
    }
    if(type === 'folder'){
      let result = await db.client.db().collection('files').insertOne({
        userId: user._id,
        name: name,
        type: type,
        isPublic: isPublic,
        data: data, 
        parentId: parentId
      })
      return res.status(201).json(result.ops[0])
    }else{
      let id = v4().toString();

      
      let filePath = process.env.FOLDER_PATH ? process.env.FOLDER_PATH + '/' + id : `/tmp/files_manager/${id}`;
      let result = await db.client.db().collection('files').insertOne({
        userId: user._id,
        name: name,
        type: type,
        isPublic: isPublic,
        parentId: parentId,
        localPath: filePath
      })

      let content = Buffer.from(data, 'base64').toString();
      await fse.outputFile(filePath, content);

      return res.status(201).json(result.ops[0])
    }
  }
}

module.exports = FilesController;
