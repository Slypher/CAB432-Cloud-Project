'use strict';

const get_tweets = require('../get_tweets.js');

module.exports = function (req, res) {
    var renderPage = function (tweets) { res.render('index.ejs', { tweets: tweets }); }
    var sendJSON = function (tweets) { res.json({ tweets: tweets })}

    if (req.xhr) get_tweets(req.query, sendJSON);
    else get_tweets(req.query, renderPage);
}