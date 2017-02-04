/**
 * Created by lmarkus on 1/22/17.
 */
'use strict';
const debuglog = require('util').debuglog('GitHubHooks');


class BaseHandler {

    constructor() {
    }

    handle() {
        debuglog('Handler not implemented');
    }
}

module.exports = BaseHandler;
