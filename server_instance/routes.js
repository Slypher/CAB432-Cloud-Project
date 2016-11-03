const http = require('http');

'use strict';

module.exports = function (app) {

    app.get('/', require('./routes/index.js'));
    app.get('/about', require('./routes/about.js'));
};