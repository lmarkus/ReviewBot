/**
 * Created by lmarkus on 2/8/17.
 */
module.exports = {

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


