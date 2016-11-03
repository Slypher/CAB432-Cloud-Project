'use strict';

const auth = require('./auth.json');

const sentiment = require('sentiment');
const natural = require('natural');
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

sqs.getQueueUrl({ QueueName: 'tweets', QueueOwnerAWSAccountId: accountId }, function (err, data) {
    if (err) console.log(err, err.stack);
    else queueUrl = data.QueueUrl;
});

var messages;
var counter;

module.exports = function (queries, callback) {
    var addMessages = function (response) {
        counter += 1;
        for (var i = 0; i < response.length; i++) if (validMessage(queries, response[i])) messages.push(formatMessage(response[i]));

        if (counter >= 20) return callback([]);
        if (messages.length >= 1) callback(messages);
        else getMessages(addMessages);
    }

    messages = [];
    counter = 0;
    getMessages(addMessages);
}

var getMessages = function (callback) {
    sqs.receiveMessage({
        QueueUrl: queueUrl,
        MaxNumberOfMessages: 10,
        VisibilityTimeout: 60, 
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
                    'name': data.Messages[i].MessageAttributes.name.StringValue,
                    'image_url': data.Messages[i].MessageAttributes.image_url.StringValue
                });
            }
            callback(response);
        }
    });
}

var validMessage = function (queries, message) {
    if (queries == undefined || queries == null || queries == '') return true;

    var tokenizer = new natural.WordTokenizer();
    var tokens = tokenizer.tokenize(message.text.toLowerCase());
    for (var i = 0; i < queries.length; i++) if (!tokens.includes(queries[i].toLowerCase())) return false;
    return true;
}

var formatMessage = function (message) {
    if (message.text.substring(0, 3) == 'RT ') message.text = message.text.substring(3);
    message.sentiment = sentiment(message.text);
    return message;
}