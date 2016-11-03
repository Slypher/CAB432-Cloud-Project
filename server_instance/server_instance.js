'use strict';

const express = require('express');
const app = express();
const port = 3000;

const morgan = require('morgan');
const favicon = require('serve-favicon');
const bodyParser = require('body-parser');

app.use(morgan('\x1b[90m:date[web] \x1b[92m:remote-addr \x1b[90m:method :url \x1b[36m:status\x1b[32m')); // log requests
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json()); // get information from HTML forms
app.use(favicon('./public/images/favicon.ico')); // app icon
app.use(express.static('public')); // make public folder available to app

app.set('view engine', 'ejs'); // set up ejs for templating

require('./routes.js')(app); // load routes

app.listen(port); // launch
console.log('\x1b[90mListening on port \x1b[36m' + port + '\x1b[32m');