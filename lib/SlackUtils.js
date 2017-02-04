/**
 * Created by lmarkus on 2/2/17.
 */
'use strict';
const WebClient = require('@slack/client').WebClient
    , debuglog = require('util').debuglog('GitHubHooks')
    ;


module.exports = class SlackUtils {


    static announceAssignees(assignees, pr, slackConfig) {
        let web = new WebClient(slackConfig.token);
        assignees = assignees.map(a => `<@${a.name}>`).join(', ');
        web.chat.postMessage(slackConfig.notifyChannel, `${assignees} : You've been assigned to ${pr}`, {as_user: true}, function (err, res) {
            if (err) {
                debuglog('Error:', err);
            } else {
                debuglog('Message sent: ', res);
            }
        });
    }
};
