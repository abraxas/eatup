"use strict";

var nodeenv = process.env.NODE_ENV;

if (!(nodeenv && nodeenv === "test")) {
    process.env.NODE_ENV = "test";
    console.log("SETTING ENV TO TEST");
}

var app = require("../index"), mongoose = require("mongoose"), kraken = require("kraken-js"), request = require("supertest"), assert = require("assert");

describe("user", function() {
    var mock;
    beforeEach(function(done) {
        kraken.create(app).listen(function(err, server) {
            mock = server;
            done(err);
        });
    });
    afterEach(function(done) {
        User.remove({}, function() {
            mongoose.connection.close();
            mock.close(done);
        });
    });
    it('should say "hello"', function(done) {
        request(mock).get("/").expect(200).expect("Content-Type", /html/).expect(/Hello, /).end(function(err, res) {
            if (err) return done(err);
            done();
        });
    });
    it("should search users", function(done) {
        request(mock).get("/").end(function(err, res) {
            User.find({}, function(e, o) {
                var env = process.env.NODE_ENV;
                assert(!e, "E is null");
                done();
            });
        });
    });
});