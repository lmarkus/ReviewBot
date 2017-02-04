"use strict";
const _ = require('lodash')
    , util = require('util')
    , GH = require('./github')
    , github = GH.api
    , debuglog = require('util').debuglog('GitHubHooks')
    ;

module.exports = class GitHubUtils {

    /**
     * Retrieve the MAINTAINERS file for a given repo, and massage it into a usable format.
     * @param options
     * @param callback
     */
    static getMaintainersFile(options = {}, callback) {
        GH.authenticate();

        options = _.merge(
            options,
            {
                path: "MAINTAINERS"
            });

        github().repos.getContent(options, function (err, file) {
                debuglog("Retrieved Maintainers: \n" + util.inspect(file));
                let maintainersFile =
                    new Buffer(file.content, 'base64')
                        .toString('ascii')
                        .split('\n')
                        .filter(line => line.length > 0);
                return callback(err, maintainersFile);
            }
        )
    }

    static addComment(options, callback) {
        github().issues.createComment(
            options,
            function (err, result) {
                return callback();
            });
    }
};
