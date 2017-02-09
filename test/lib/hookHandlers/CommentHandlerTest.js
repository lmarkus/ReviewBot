/**
 * Created by lmarkus on 2/8/17.
 */
const fs = require('fs')
    , mockery = require('mockery')
    , assert = require('chai').assert
    , testUtils = require('../../testUtils')
    ;

let mockData = {
    action: 'created',
    repository: {
        owner: {
            login: 'reviewBotOrg'
        },
        name: 'reviewBot',
    },
    issue: {
        number: 42
    },
    comment: {
        body: 'assign @heisenberg'
    }
};

describe('Comment Handler Tests', function () {
    let CommentHandler;

    it('Does not reassign a person twice', function (next) {
        let ch = new CommentHandler({});

        //Make the same call twice,
        ch.handle('myRepo', 'master', mockData,
            function () {
                assert.equal(getHeisenbergCount(), 1, 'First assignment set correctly');
                ch.handle('myRepo', 'master', mockData, function () {
                    assert.equal(getHeisenbergCount(), 1, 'Second assignment is ignored');
                    return next();
                });
            });

    });

    /*******
     SETUP
     */

    function getHeisenbergCount() {
        let db = require('../../../lib/DBUtils');
        return db.get('repos.reviewBotOrg/reviewBot.maintainers.heisenberg.count');
    }

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
        mockery.registerMock('./GitHubUtils', class MockGHU {
            static getMaintainersFile(options = {}, callback) {
                fs.readFile('test/fixtures/MAINTAINERS.txt', 'utf-8',
                    function (err, data) {
                        callback(err, data.split('\n'));
                    }
                );
            }
        });
        CommentHandler = require('../../../lib/hookHandlers/CommentHandler');
        return next();
    });

    /**
     * Reset the mock DB before every test
     */
    beforeEach(function (next) {
        let db = require('../../../lib/DBUtils');
        db.getInstance().setState({});
        next();
    });

    after(function (next) {
        mockery.deregisterAll();
        next();
    });

});


