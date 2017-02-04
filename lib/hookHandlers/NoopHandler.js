const BaseHandler = require('./BaseHandler')
    , debuglog = require('util').debuglog('GitHubHooks')
    ;

module.exports = class NoopHandler extends BaseHandler {
    constructor() {
        super();
    }

    handle() {
        debuglog('No-Op');
    }
};
