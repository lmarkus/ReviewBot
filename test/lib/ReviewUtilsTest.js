/**
 * Created by lmarkus on 2/16/17.
 */
'use strict';

const mockery = require('mockery')
    , assert = require('chai').assert
    , testUtils = require('../testUtils')
    ;

describe('ReviewUtils test suite', function () {

    let mockGHU = new testUtils.GetMaintainersMocker();


    it('Does not cache active status', function (next) {
        let reviewUtils = require('../../lib/ReviewUtils')
            , db = require('../../lib/DBUtils')
            , config = {appConfig: {reviewers: 2}}
            ;

        // First call: Load from the inactive maintainers file.
        mockGHU.use('test/fixtures/MAINTAINERS-INACTIVE');
        reviewUtils.getReviewers(config, function () {
            let isInactive = db.get('repos.undefined/undefined.maintainers.badger.isInactive');
            assert.isTrue(isInactive, 'Correctly sets active status');

            // Second call: Load from the active maintainers file.
            mockGHU.use('test/fixtures/MAINTAINERS');
            reviewUtils.getReviewers(config, function () {
                let isInactive = db.get('repos.undefined/undefined.maintainers.badger.isInactive');
                assert.isFalse(isInactive, 'Does not cache active status');
                next();
            });

        });

    });


    before(function (next) {
        mockery.enable({
            warnOnReplace: false,
            warnOnUnregistered: false,
            useCleanCache: true
        });

        let mockLow = new testUtils.LowMocker();
        mockLow.use('test/scratch/counts.json');
        mockery.registerMock('lowdb', mockLow.getMock());
        mockery.registerMock('../SlackUtils', class MockSlackUtils {
            static announceAssignees() {/*noop*/
            }
        });

        mockery.registerMock('./GitHubUtils', mockGHU.getMock());
        next();
    });

    /**
     * Reset the mock DB before every test
     */
    beforeEach(function (next) {
        let db = require('../../lib/DBUtils');
        db.getInstance().setState({});
        next();
    });

    after(function (next) {
        mockery.deregisterAll();
        next();
    });
});
