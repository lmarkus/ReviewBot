'use strict';
var IndexModel = require('../models/index');
const GitHubHook = require('../lib/github').getHookHandlerInstance();
module.exports = function (router) {

    var model = new IndexModel();


    /** HACK ALERT!
     * This hijacks the handler function from the githubhooks module, by forcibly drilling
     * into it's server (which I never initialized, on purpose).
     *
     * To make it work properly, we need to emulate (re-emit) the `data` and `end` events.
     *
     * This is nasty.
     *
     * Proper solutions:
     * 1) Implement my own github event handler. (Not very keen on re-inventing the wheel)
     * 2) Send a PR to the author of the GitHub module to expose the function on a more friendly manner
     * 3) Find another module that does everything I need.
     **/
    router.post('/hooks', function (req, res) {

        GitHubHook.server._events.request(req, res);
        req.emit('data', new Buffer(JSON.stringify(req.body)));
        req.emit('end');

    });

    router.get('/', function (req, res) {
        return res.render('index', model);
    });
};
