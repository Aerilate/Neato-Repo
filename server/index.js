const bodyParser = require('body-parser');
const pino = require('express-pino-logger')();
const express = require('express');
const multer = require('multer');
const multerS3 = require('multer-s3');

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(pino);

const AWS = require('aws-sdk');
var s3 = new AWS.S3({ apiVersion: '2006-03-01' });

const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: 'neato-reapo-bucket',
    metadata: function (req, file, cb) {
      cb(null, { fieldName: file.fieldname });
    },
    key: function (req, file, cb) {
      cb(null, Date.now().toString() + '-' + file.originalname)
    }
  })
})

app.post('/api', upload.any(), (req, res) => {
  console.log(req.files);
  res.setHeader('Content-Type', 'application/json');
  res.send(JSON.stringify({ greeting: `Hello friend!` }));
});

app.listen(3001, () =>
  console.log('Express server is running on localhost:3001')
);



