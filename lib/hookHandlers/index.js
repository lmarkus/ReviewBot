/**
 * Created by lmarkus on 1/22/17.
 */
const
    util = require('util'),
    debuglog = util.debuglog('GitHubHooks')
    ;

// Handlers
const
    PullRequestHandler = require('./PullRequestHandler'),
    CommentHandler = require('./CommentHandler'),
    NoopHandler = new require('./NoopHandler')
    ;

let
    pullRequestHandler,
    commentHandler,
    noopHandler
    ;

module.exports = class GitHubHookRouter {

    constructor(config) {
        pullRequestHandler = new PullRequestHandler(config);
        commentHandler = new CommentHandler(config);
        noopHandler = new NoopHandler(config);
    }

    getRouter() {
        return function route(event, repo, ref, data) {

            debuglog(`"${event}" received from ${repo}/${ref}`);
            //debuglog(`Payload: \n ${util.inspect(data, {depth: null})}`);

            return getHandler(event).handle(repo, ref, data,function(){
                console.log('routing complete');
            });
        }
    }
};


function getHandler(event) {
    switch (event.toLowerCase()) {
        case 'pull_request':
        {
            return pullRequestHandler;
        }
        case 'issue_comment':
        {
            return commentHandler;
        }
        default:
        {
            return noopHandler;
        }
    }
}
