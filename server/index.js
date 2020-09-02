const express = require('express');
const bodyParser = require('body-parser');
const pino = require('express-pino-logger')();
const multer = require('multer');
const multerS3 = require('multer-s3');
const AWS = require('aws-sdk');

require('dotenv').config();
const BUCKET_NAME = process.env.aws_bucket_name;



const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(pino);

const s3 = new AWS.S3({ apiVersion: '2006-03-01' });
const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: BUCKET_NAME,
    metadata: function (req, file, cb) {
      cb(null, { fieldName: file.fieldname });
    },
    key: function (req, file, cb) {
      cb(null, JSON.stringify(req.query.user) + '/' + Date.now().toString() + '-' + file.originalname)
    }
  })
});

app.post('/api/uploads', upload.any(), (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(JSON.stringify({ message: `files uploaded` }));
});



app.get('/api/uploads', async (req, res) => {
  const userId = req.query.user;

  function listObjects(userId, cb) {
    var params = {
      Bucket: BUCKET_NAME,
      Prefix: JSON.stringify(userId) + '/'
    }

    s3.listObjects(params, function (err, data) {
      if (err) throw err;
      cb(data.Contents);
    });
  }

  listObjects(userId, (cbContents) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({ contents: cbContents }));
  })
});



app.get('/api/uploads/image', async (req, res) => {
  const key = req.query.key;

  function getObject(key, cb) {
    var params = {
      Bucket: BUCKET_NAME,
      Key: key
    }

    s3.getObject(params, function (err, data) {
      if (err) return err;
      cb(data.Body);
    });
  }

  getObject(key, (image) => {
    res.setHeader('Content-Type', 'image/jpeg');
    res.send(image);
  })
});



app.delete('/api/uploads/image', async (req, res) => {
  const key = req.query.key;

  function getObject(key, cb) {
    var params = {
      Bucket: BUCKET_NAME,
      Key: key
    }

    s3.deleteObject(params, function (err, data) {
      if (err) return err;
      cb();
    });
  }

  getObject(key, () => {
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({ message: `files deleted` }));
  })
});



app.listen(3001, () =>
  console.log('Express server is running on localhost:3001')
);