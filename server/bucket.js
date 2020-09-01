const AWS = require('aws-sdk');

var s3 = new AWS.S3({apiVersion: '2006-03-01'});



const uploadToS3 = (fileContent) => {
    var base64data = Buffer.from(fileContent, 'binary');

    const params = {
        Bucket: 'neato-reapo-bucket',
        Body: base64data
    };

    s3.upload(params, function(err, data) {
        if (err) {
            throw err;
        }
        console.log(`File uploaded successfully. ${data.Location}`);
    });
};

module.exports = uploadToS3;