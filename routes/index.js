'use strict';

const qs = require('qs');
const server = require('../server.js');

module.exports = function (req, res) {
    res.render('index.ejs', { tweets: server.getTweets(req.query) });
}