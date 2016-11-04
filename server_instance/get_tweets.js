'use strict';

const auth = require('./auth.json');

const natural = require('natural');
const AWS = require('aws-sdk');

const accountId = auth.aws.account_id;
const accessKeyId = auth.aws.access_key_id;
const secretAccessKey = auth.aws.secret_access_key;

AWS.config.update({ // update credentials, region and api versions
    accessKeyId: accessKeyId,
    secretAccessKey: secretAccessKey,
    region: auth.aws.region,
    apiVersions: auth.aws.api_versions
});

var sqs = new AWS.SQS({});
var queueUrl = '';

sqs.getQueueUrl({ QueueName: 'tweets', QueueOwnerAWSAccountId: accountId }, function (err, data) { // get the tweet queue from SQS
    if (err) console.log(err, err.stack);
    else queueUrl = data.QueueUrl;
});

var messages;
var counter;

module.exports = function (queries, callback) { // the get_tweets() function
    var addMessages = function (response) {
        counter += 1; // counter used to prevent an infinite recursion loop
        // loop through response, check if valid and push formatted valid message
        for (var i = 0; i < response.length; i++) if (validMessage(queries, response[i])) messages.push(formatMessage(response[i]));

        if (counter >= 20) return callback([]); // prevent infinite recursion after 20 * 10 messages filtered
        if (messages.length >= 1) callback(messages); // return at minimum one tweet
        else getMessages(addMessages); // recursion entry point
    }

    messages = [];
    counter = 0;
    getMessages(addMessages);
}

var getMessages = function (callback) { // function to request 10 messages at a time from SQS
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
    }, function (err, data) { // response
        if (err) console.log(err, err.stack);
        else {
            var response = []
            if (!data.Messages) return callback([]); // empty response
            for (var i = 0; i < data.Messages.length; i++) { // loop through response messages
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

var validMessage = function (queries, message) { // function to determine if a message passes through queries
    if (queries == undefined || queries == null || queries == '') return true;
    
    for (var i = 0; i < queries.length; i++) generateLoad(1000); // artifical load generation :(

    var tokenizer = new natural.WordTokenizer();
    var tokens = tokenizer.tokenize(message.text.toLowerCase()); // tokenize the tweet
    // loop through each query and check if the corresponding token exists - case is ignored
    for (var i = 0; i < queries.length; i++) if (tokens.indexOf(queries[i].toLowerCase()) === -1) return false;
    return true;
}

var formatMessage = function (message) { // function to add sentiment and remove twitter formatting
    if (message.text.substring(0, 3) == 'RT ') message.text = message.text.substring(3);
    var sentiment = require('sentiment');
    message.sentiment = sentiment(message.text);
    return message;
}

var generateLoad = function (ms) { // artifical load generation
	var now = new Date().getTime();
	var result = 0;
	while(true) {
		result += Math.random() * Math.random();
		if (new Date().getTime() > now +ms)
			break;
	}	
}