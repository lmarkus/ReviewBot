'use strict';
const _ = require('lodash')
    , db = require('./DBUtils')
    , GitHubUtils = require('./GitHubUtils')
    ;

module.exports = class ReviewUtils {

    /**
     * For a given repo, retrieve a random set of reviewers, according to the repo configuration.
     * @param options
     * @param callback
     */
    static getReviewers(options = {}, callback) {
        ReviewUtils.getRepoMaintainers(options, function (err, maintainers) {
            let reviewers, maintainersArray;

            reviewers = [];
            maintainersArray = ReviewUtils.getMaintainersArray(maintainers);

            while (reviewers.length < options.appConfig.reviewers && maintainersArray.length > 0) {
                let low, lowLevel, reviewer;

                // The default count for new reviewers should match the current low, so they don't start too far behind.
                low = ReviewUtils.getHighLow(maintainersArray).low;

                // Get the people with the lowest number of reviews, by count
                lowLevel = maintainersArray.filter((maintainer) => maintainer.count <= low);

                //Get a random reviewer
                reviewer = lowLevel[Math.floor(Math.random() * lowLevel.length)];

                // Remove this person from rotation
                // (Unlike filter, this mutates the array)
                _.pullAllBy(maintainersArray, [reviewer], 'name');

                // Update the count
                maintainers[reviewer.name].count++;

                // If active, assign
                // Skip self
                // (We do this after updating the count so inactive people get "counted"
                // in rotations. Otherwise, they'd need to play catch up.
                if (!reviewer.isInactive && reviewer.name !== options.skip) {
                    reviewers.push(reviewer);
                }
            }

            // Persist updated counts.
            db.set(`repos.${options.owner}/${options.repo}.maintainers`, maintainers);

            callback(null, reviewers);
        });
    }

    /**
     * Retrieve the maintainers of a repository.
     * This retrieves the MAINTAINERS files and updates the local storage based on it.
     * @param options
     * @param callback
     */
    static getRepoMaintainers(options, callback) {
        GitHubUtils.getMaintainersFile(options, function (err, maintainersFile) {
            let currentMaintainers, newMaintainers = {}, counts;

            currentMaintainers = db.get(`repos.${options.owner}/${options.repo}.maintainers`, {});
            counts = ReviewUtils.getHighLow(ReviewUtils.getMaintainersArray(currentMaintainers));

            maintainersFile.forEach(maintainer => {
                let name = /\(@(\w+)\)/.exec(maintainer);
                if (!name) {
                    return;
                }
                name = name[1];

                let isInactive = maintainer.toLowerCase().includes('inactive');

                // Put them at the bottom of the queue
                newMaintainers[name] = {
                    name,
                    count: counts.low,
                    isInactive
                };
            });

            currentMaintainers = ReviewUtils.mergeMaintainers(currentMaintainers, newMaintainers);
            return callback(null, currentMaintainers);
        });
    }

    /**
     * Assign a set of maintainers a to a PR
     * @param options
     * @param assignees
     */
    static setAssigned(options, assignees) {
        let issuePath = `repos.${options.owner}/${options.repo}.issues.${options.pr}`;
        // Default init
        if (!db.has(issuePath)) {
            db.set(issuePath, {reviewers: []});
        }

        let currentAssignees = db.get(issuePath + '.reviewers');
        assignees = _.union(currentAssignees, assignees);
        db.set(issuePath + '.reviewers', assignees);
    }

    /**
     * Determines if a maintainer is already assigned to a to a PR
     * @param options
     * @param assignee
     */
    static isAssigned(options, assignee) {
        let issuePath = `repos.${options.owner}/${options.repo}.issues.${options.pr}`
            , currentAssignees = db.get(issuePath + '.reviewers')
            ;

        return currentAssignees && currentAssignees.some(current => current.name === assignee.name);
    }

    /**
     * Get the highest and lowest counts of reviews performed by the maintainers of a repo.
     * @param maintainers
     * @returns {*}
     */
    static getHighLow(maintainers) {

        let counts = {high: 0, low: 0};
        /* eslint "indent":0 */
        switch (maintainers.length) {
            case 0:
                return counts;
            case 1:
                return {high: maintainers[0].count, low: maintainers[0].count};
            default: {
                return {
                    low: (maintainers[0] || {count: 0}).count, // Last Element
                    high: (maintainers[maintainers.length - 1] || {count: 0}).count // First Element
                };
            }
        }
    }

    /**
     * Transforms a nested maintainers object into a sorted (By review count) array.
     * @param maintainersObject
     * @returns {Array.<T>}
     */
    static getMaintainersArray(maintainersObject) {
        let maintainers = Object.keys(maintainersObject).map(key => maintainersObject[key]);
        return maintainers.sort((a, b) => {
            return a.count - b.count;
        });
    }

    /**
     * Outer Join, to remove deleted maintainers, but keep existing counts.
     * @param current
     * @param next
     */
    static mergeMaintainers(current, next) {
        // Update active status before merging
        Object.keys(next).forEach(name => {
            if (current[name]) {
                current[name].isInactive = !!next[name].isInactive;
            }
        });

        current = ReviewUtils.getMaintainersArray(current);
        next = ReviewUtils.getMaintainersArray(next);
        let trimmedCurrent = _.intersectionBy(current, next, 'name');
        current = _.unionBy(trimmedCurrent, next, 'name');

        //Turn back into an object
        return current.reduce((accumulator, maintainer) => {
                accumulator[maintainer.name] = maintainer;
                return accumulator;
            },
            {});
    }
};


