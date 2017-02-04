/**
 * Created by lmarkus on 1/22/17.
 */
const
    _ = require('lodash')
    , GH = require('../../lib/github')
    , github = GH.api
    , GitHubUtils = require('../GitHubUtils')
    , ReviewUtils = require('../ReviewUtils')
    , SlackUtils = require('../SlackUtils')
    , BaseHandler = require('./BaseHandler')
    , debuglog = require('util').debuglog('GitHubHooks')
    ;

let config;

module.exports = class PullRequestHandler extends BaseHandler {

    constructor(options) {
        super();
        config = options;
    }

    handle(repo, ref, data, callback) {

        if ( // New PR
        _.get(data, 'action') === 'opened' &&
        _.get(data, 'pull_request.state') === 'open'
        ) {
            debuglog('PR Opened!');

            let options = {
                owner: data.repository.owner.login,
                repo: data.repository.name,
                pr: `PR_${data.pull_request.number}`,
                number: data.pull_request.number,
                skip: data.pull_request.user.login,
                appConfig: config
            };

            ReviewUtils.getReviewers(
                options,
                function (err, reviewers) {

                    //Async, fire & forget
                    ReviewUtils.setAssigned(options, reviewers);
                    SlackUtils.announceAssignees(reviewers, data.pull_request.html_url, config.slack);

                    options.body = "The following people have been assigned to review:\n" + reviewers.map(r=>'@' + r.name).join(', ');
                    return GitHubUtils.addComment(options, callback);
                });
        }
    }
};
