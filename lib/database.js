"use strict";

var mongoose = require("mongoose"), autoIncrement = require("mongoose-auto-increment");

var db = function() {
    return {
        config: function(conf) {
            mongoose.connect("mongodb://" + conf.host + "/" + conf.database);
            console.log("CONNECTING TO: mongodb://" + conf.host + "/" + conf.database);
            autoIncrement.initialize(mongoose.connection);
            var db = mongoose.connection;
            db.on("error", console.error.bind(console, "connection error:"));
            db.once("open", function callback() {
                console.log("db connection open");
            });
        }
    };
};

module.exports = db();