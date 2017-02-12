/**
 * Created by lmarkus on 2/8/17.
 */
const fs = require('fs');

let path = `${__dirname}/../scratch`;
if (!fs.existsSync(path)) {
    fs.mkdirSync(path);
}

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


