'use strict';

const auth = require('./auth.json');

const AWS = require('aws-sdk');
const Twitter = require('twitter');
const lodash = require('lodash');

const accessKeyId = auth.aws.access_key_id;
const secretAccessKey = auth.aws.secret_access_key;

AWS.config.update({ // update credentials, region and api versions
    accessKeyId: accessKeyId,
    secretAccessKey: secretAccessKey,
    region: auth.aws.region,
    apiVersions: auth.aws.api_versions
});

var sqs = new AWS.SQS({  });
var queueUrl = '';

sqs.createQueue({ QueueName: 'tweets' }, function (err, data) { // get the tweet queue from SQS
    if (err) console.log(err, err.stack);
    else queueUrl = data.QueueUrl;
});

const isTweet = lodash.conforms({ // function to determine if the event is a tweet
    user: lodash.isObject,
    id_str: lodash.isString,
    text: lodash.isString,
});

const client = new Twitter({ // supply twitter API with credentials from auth.json
    consumer_key: auth.twitter.consumer_key,
    consumer_secret: auth.twitter.consumer_secret,
    access_token_key: auth.twitter.access_token_key,
    access_token_secret: auth.twitter.access_token_secret
});

var stream = client.stream('statuses/sample', { language: 'en' });

var Entries = []
stream.on('data', function (event) { // the data stream from the twitter API
    if (isTweet(event)) { // if data is a tweet
        Entries.push({ // add to entries and convert to SQS message format
            Id: Entries.length.toString(),
            MessageBody: event.text,
            MessageAttributes: {
                'name': {
                    DataType: 'String',
                    StringValue: event.user.name
                },
                'screen_name': {
                    DataType: 'String',
                    StringValue: event.user.screen_name
                },
                'image_url': {
                    DataType: 'String',
                    StringValue: event.user.profile_image_url
                }
            }
        });

        if (Entries.length === 10) {
            sqs.sendMessageBatch({ // send 10 messages at a time to SQS
                Entries: Entries,
                QueueUrl: queueUrl
            }, function (err, data) {
                if (err) console.log(err, err.stack);
                else console.log('Messages added');
            });

            Entries = [];
        }
    }
});

stream.on('error', function (error) {
    console.log(error);
});