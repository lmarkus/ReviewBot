/**
 * Created by lmarkus on 2/3/17.
 * Quirk of the lowDB module... needs to be treated as a singleton
 */
"use strict";
const low = require('lowdb')
    , db = low('public/counts.json')
    ;

db.defaults(
    {
        repos: {}
    }
).values();

module.exports = class DBUtils{

    static get(query,defaultValue){
        return db.get(query,defaultValue).value();
    }

    static set(path,value){
        return db.set(path,value).value();
    }

    static has(query){
        return db.has(query).value();
    }

};
