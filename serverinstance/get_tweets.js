'use strict';

const auth = require('./auth.json');

const AWS = require('aws-sdk');

const accountId = auth.aws.account_id;
const accessKeyId = auth.aws.access_key_id;
const secretAccessKey = auth.aws.secret_access_key;
const credentials = new AWS.Credentials(accessKeyId, secretAccessKey);

AWS.config.Credentials = credentials;

var sqs = new AWS.SQS({ apiVersion: '2012-11-05' });
var queueUrl = '';

sqs.getQueueUrl({ QueueName: 'Tweets', QueueOwnerAWSAccountId: accountId }, function (err, data) {
    if (err) console.log(err, err.stack);
    else queueUrl = data.QueueUrl;
});

module.exports = function (queries) {
    return '';
}