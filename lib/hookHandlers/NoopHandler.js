const BaseHandler = require('./BaseHandler');

module.exports = class NoopHandler extends BaseHandler {
    constructor(){
        super();
    }
    handle() {
        console.log('No-Op');
    }
};
