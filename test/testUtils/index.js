/**
 * Created by lmarkus on 2/8/17.
 */
const fs = require('fs');

let path = `${__dirname}/../scratch`;
if (!fs.existsSync(path)) {
    fs.mkdirSync(path);
}

module.exports = {
    GetMaintainersMocker: class GetMaintainersMocker {
        constructor() {
            this.maintainersFile = '';
        }

        use(path) {
            this.maintainersFile = path;
        }

        getMock() {
            return (function (parent) {
                return class MockGHU {
                    static getMaintainersFile(options = {}, callback) {
                        fs.readFile(parent.maintainersFile, 'utf-8',
                            function (err, data) {
                                callback(err, data.split('\n'));
                            }
                        );
                    }
                };
            }(this));
        }
    },

    LowMocker: class LowMocker {

        constructor() {
            this.low = require('lowdb');
            this.dbFile = '';
        }

        use(path) {
            this.dbFile = path;
        }

        getMock() {
            return (function () {
                return this.low(this.dbFile);
            }).bind(this);
        }
    }
};


