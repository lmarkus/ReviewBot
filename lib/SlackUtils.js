/**
 * Created by lmarkus on 2/2/17.
 */
"use strict";
const
    _ = require('lodash')
    , WebClient = require('@slack/client').WebClient
    ;

module.exports = class SlackUtils {

    static setup(_config) {
        config = _config;
    }

    static announceAssignees(assignees, pr, slackConfig) {
        let web = new WebClient(slackConfig.token);
        assignees = assignees.map(a=>`<@${a.name}>`).join(', ');
        web.chat.postMessage('lenny_test', `${assignees} : You've been assigned to ${pr}`, {as_user: true}, function (err, res) {
            if (err) {
                console.log('Error:', err);
            } else {
                console.log('Message sent: ', res);
            }
        });
    }
}
