/**
 * Created by lmarkus on 1/22/17.
 */
const
    _ = require('lodash')
    , db = require('../DBUtils')
    , ReviewUtils = require('../ReviewUtils')
    , SlackUtils = require('../SlackUtils')
    , BaseHandler = require('./BaseHandler')
    , debuglog = require('util').debuglog('GitHubHooks')
    ;

let config;

/**
 * Listen for incoming "Comment" events, which are used to manually assign a reviewer to a PR.
 * @type {CommentHandler}
 */
module.exports = class CommentHandler extends BaseHandler {
    constructor(options) {
        super();
        config = options;
    }

    handle(repo, ref, data, callback) {
        if ( // New comment, manually assigning people.
        _.get(data, 'action') === 'created' &&
        _.get(data, 'comment.body', '').match(/^(assign|asign)/i) //Assignment lines must start with "assign" (or common typos)
        ) {
            debuglog('New Assignment Comment');

            let assignee, assignees = [], regex = /@(\w+)/g;

            // Filter out assignees from the comment body
            /* eslint "no-cond-assign":0 */
            while (assignee = regex.exec(data.comment.body)) {
                assignees.push(assignee[1]);
            }

            // NoOp
            if (assignees.length === 0) {
                return callback();
            }

            // Increase count for the assigned reviewers
            let options = {
                owner: data.repository.owner.login,
                repo: data.repository.name,
                pr: `PR_${data.issue.number}`
            };

            ReviewUtils.getRepoMaintainers(options, function (err, maintainers) {
                assignees =
                    assignees
                        .map(assignee => maintainers[assignee])
                        .filter(Boolean);

                assignees.forEach(assignee => assignee.count++);

                db.set(`repos.${options.owner}/${options.repo}.maintainers`, maintainers);
                ReviewUtils.setAssigned(options, assignees);
                SlackUtils.announceAssignees(assignees, data.issue.html_url, config.slack);

                return callback(err);
            });
        }
    }
};



