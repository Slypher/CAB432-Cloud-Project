'use strict';

const auth = require('./auth.json');

const AWS = require('aws-sdk');
const Twitter = require('twitter');
const lodash = require('lodash');

const accessKeyId = auth.aws.access_key_id;
const secretAccessKey = auth.aws.secret_access_key;
const credentials = new AWS.Credentials(accessKeyId, secretAccessKey);

AWS.config.Credentials = credentials;

var sqs = new AWS.SQS({ apiVersion: '2012-11-05' });

//sqs.createQueue();

//var ec2 = new AWS.EC2({ apiVersion: '2016-09-15' });

const isTweet = lodash.conforms({
    user: lodash.isObject,
    id_str: lodash.isString,
    text: lodash.isString,
});

const client = new Twitter({
    consumer_key: auth.twitter.consumer_key,
    consumer_secret: auth.twitter.consumer_secret,
    access_token_key: auth.twitter.access_token_key,
    access_token_secret: auth.twitter.access_token_secret
});

var stream = client.stream('statuses/sample', { language: 'en' });

stream.on('data', function (event) {
    //console.log(event && event.text);
    if (isTweet(event)) tweets.push(event);
});

stream.on('error', function (error) {
    console.log(error);
});