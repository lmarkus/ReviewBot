'use strict';

const express = require('express')
    , kraken = require('kraken-js')
    , github = require('./lib/github')
    , debuglog = require('util').debuglog('reviewBot')
    ;


let options, app;
/*
 * Create and configure application. Also exports application instance for use by tests.
 * See https://github.com/krakenjs/kraken-js#options for additional configuration options.
 */
options = {
    onconfig: function (config, next) {

        github.init(config.get('app') || {}, function () {
            next(null, config);
        });
    }
};

app = module.exports = express();
app.use(kraken(options));
app.on('start', function () {
    debuglog('Application ready to serve requests.');
    debuglog('Environment: %s', app.kraken.get('env:env'));
});
