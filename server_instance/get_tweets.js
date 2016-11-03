'use strict';

const auth = require('./auth.json');

const AWS = require('aws-sdk');

const accountId = auth.aws.account_id;
const accessKeyId = auth.aws.access_key_id;
const secretAccessKey = auth.aws.secret_access_key;

AWS.config.update({
    accessKeyId: accessKeyId,
    secretAccessKey: secretAccessKey,
    region: auth.aws.region,
    apiVersions: auth.aws.api_versions
});

var sqs = new AWS.SQS({});
var queueUrl = '';

sqs.getQueueUrl({ QueueName: 'Tweets', QueueOwnerAWSAccountId: accountId }, function (err, data) {
    if (err) console.log(err, err.stack);
    else queueUrl = data.QueueUrl;
});

var messages;

module.exports = function (queries, callback) {
    var addMessages = function (response, complete) {
        for (var i = 0; i < response.length; i++) messages.push(response[i]);
        if (complete) return callback(messages);
    }

    messages = []
    for (var i = 0; i < 1; i++) getMessages(addMessages, (i == 0));
}

var getMessages = function (callback, complete) {
    sqs.receiveMessage({
        QueueUrl: queueUrl,
        MaxNumberOfMessages: 10,
        VisibilityTimeout: 5, 
        WaitTimeSeconds: 1,
        AttributeNames: [
            "All"
        ],
        MessageAttributeNames: [
            "All"
        ]
    }, function (err, data) {
        if (err) console.log(err, err.stack);
        else {
            var response = []
            for (var i = 0; i < data.Messages.length; i++) {
                response.push({
                    'text': data.Messages[i].Body,
                    'screen_name': data.Messages[i].MessageAttributes.screen_name.StringValue,
                    'name': data.Messages[i].MessageAttributes.name.StringValue
                });
            }
            callback(response, complete);
        }
    });
}