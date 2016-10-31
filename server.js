'use strict';

const auth = require('./auth.json');

const express = require('express');
const app = express();
const port = 3000;

const lodash = require('lodash');
const morgan = require('morgan');
const favicon = require('serve-favicon');
const bodyParser = require('body-parser');
const Twitter = require('twitter');

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

app.use(morgan('\x1b[90m:date[web] \x1b[92m:remote-addr \x1b[90m:method :url \x1b[36m:status\x1b[32m')); // log requests
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json()); // get information from HTML forms
app.use(favicon('./public/images/favicon.ico')); // app icon
app.use(express.static('public')); // make public folder available to app

app.set('view engine', 'ejs'); // set up ejs for templating

require('./routes.js')(app); // load routes

app.listen(port); // launch
console.log('\x1b[90mListening on port \x1b[36m' + port + '\x1b[32m');

var tweets = [];

// Helper Functions
const isTweet = lodash.conforms({
    user: lodash.isObject,
    id_str: lodash.isString,
    text: lodash.isString,
});

module.exports['getTweets'] = function (queries) {
    return tweets;
}