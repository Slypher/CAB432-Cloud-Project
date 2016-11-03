'use strict';

const get_tweets = require('../get_tweets.js');

module.exports = function (req, res) {
    var renderPage = function (tweets) { res.render('index.ejs', { tweets: tweets }); }
    var sendJSON = function (tweets) { res.json({ tweets: tweets })}

    var queries = req.query.queries;
    if (queries !== undefined && queries !== null && queries !== '') queries = queries.split(',');

    if (req.xhr) get_tweets(queries, sendJSON); // if request is made from AJAX send tweets in json
    else get_tweets(queries, renderPage); // else render page
}