'use strict';
/*
db.defaults(
    {
        repos: {}
    }
).values();
*/
var IndexModel = require('../models/index');

module.exports = function (router) {

    var model = new IndexModel();

    router.get('/', function (req, res) {
        return res.render('index', model);
    });
};
