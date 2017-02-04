'use strict';

const app = require('./index')
    , http = require('http')
    , debuglog = require('util').debuglog('GitHubHooks')
    ;


let server;

/*
 * Create and start HTTP server.
 */

server = http.createServer(app);
//github.init(config.get('app') || {});

server.listen(process.env.PORT || 8000, process.env.HOST);
server.on('listening', function () {
    debuglog('Server listening on http://localhost:%d', this.address().port);
});
