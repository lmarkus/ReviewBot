'use strict';

var app = require('./index');
var http = require('http');


var server;

/*
 * Create and start HTTP server.
 */

server = http.createServer(app);
server.listen(process.env.PORT || 8000, process.env.HOST);//,'10.231.70.37');
server.on('listening', function () {
    console.log('Server listening on http://localhost:%d', this.address().port);
});
