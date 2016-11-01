'use strict';

const get_tweets = require('../get_tweets.js');

module.exports = function (req, res) {
    var renderPage = function (tweets) { res.render('index.ejs', { tweets: tweets }); }
    get_tweets(req.query, renderPage);
}