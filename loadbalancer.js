'use strict';

const lodash = require('lodash');
const Twitter = require('twitter');

const isTweet = lodash.conforms({
    user: lodash.isObject,
    id_str: lodash.isString,
    text: lodash.isString,
});
