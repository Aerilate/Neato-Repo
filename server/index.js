require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const pino = require('express-pino-logger')();
const multer = require('multer');
const multerS3 = require('multer-s3');
const AWS = require('aws-sdk');
const {
  connectToDB,
  disconnectFromDB,
  insertImageDoc,
  updateImageDocAccess,
  deleteImageDoc,
  getPersonalImageDocs,
  getPublicImageDocs
} = require('./mongo')


const BUCKET_NAME = process.env.aws_bucket_name;
const MONGO_CLIENT = connectToDB()

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

app.post('/api/uploads', upload.any(), async (req, res) => {
  const userId = req.query.user;
  for (const obj of req.files) {
    insertImageDoc(await MONGO_CLIENT, userId, obj.key, false)
  }

  res.setHeader('Content-Type', 'application/json');
  res.send(JSON.stringify({ message: 'files uploaded' }));
});



app.get('/api/uploads/public', async (req, res) => {
  const files = await getPublicImageDocs(await MONGO_CLIENT);
  delete files.id;
  
  res.setHeader('Content-Type', 'application/json');
  res.send(JSON.stringify(await files));
});



app.get('/api/uploads', async (req, res) => {
  const user = req.query.user;
  const files = await getPersonalImageDocs(await MONGO_CLIENT, user);
  delete files.id;

  res.setHeader('Content-Type', 'application/json');
  res.send(JSON.stringify(await files));
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

  getObject(key, async () => {
    deleteImageDoc(await MONGO_CLIENT, key)

    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({ message: `files deleted` }));
  })
});



app.patch('/api/uploads/image', async (req, res) => {
  const key = req.query.key;
  const access = req.query.access;
  await updateImageDocAccess(await MONGO_CLIENT, key, access === "true")
  
  res.setHeader('Content-Type', 'application/json');
  res.send(JSON.stringify({ message: 'access updated' }));
});



app.listen(3001, () =>
  console.log('Express server is running on localhost:3001')
);



process.on('SIGINT', async () => { disconnectFromDB(await MONGO_CLIENT) });
process.on('SIGTERM', async () => { disconnectFromDB(await MONGO_CLIENT) });