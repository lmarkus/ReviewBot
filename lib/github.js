'use strict';

const GitHubApi = require('github')
    , GitHubHook = require('githubhook')
    ;

let options
    , gitHubApi
    , gitHubHook
    ;

module.exports.init = function init(_options, callback) {
    options = _options;

    // Initialize API
    gitHubApi = new GitHubApi(options.github.api);

    // Initialize Hooks Listener
    const GitHubHookRouter = require('./hookHandlers'); // Initialized here to avoid circular reference
    const hookHandlers = new GitHubHookRouter(options);

    gitHubHook = GitHubHook(options.github.hooks);
    gitHubHook.on('*', hookHandlers.getRouter());
    gitHubHook.listen(callback);

};

module.exports.getInstance = function getInstance() {
    return gitHubHook;
};

module.exports.api = function () {
    return gitHubApi;
};

module.exports.authenticate = function () {
    module.exports.api().authenticate({
        type: 'token',
        token: options.github.api.token
    });
};
