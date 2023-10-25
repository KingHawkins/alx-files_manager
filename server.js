const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const sha = require('sha1')
const db = require('./utils/db')
const router = require('./routes/index');

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cookieParser())


app.use('/', router);
app.listen(process.env.HOST || 5000);
