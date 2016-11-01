'use strict';

const get_tweets = require('../get_tweets.js');

module.exports = function (req, res) {
    res.render('index.ejs', { tweets: get_tweets(req.query) });
}