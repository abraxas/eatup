/*global describe:false, it:false, before:false, after:false, afterEach:false*/

'use strict';

var nodeenv = process.env.NODE_ENV;
if(! ( nodeenv && nodeenv === "test" ) ) {
  process.env.NODE_ENV = "test";
  console.log("SETTING ENV TO TEST");
}

var app = require('../index'),
    mongoose = require('mongoose'),
    kraken = require('kraken-js'),
    request = require('supertest'),
    assert = require('assert');


describe('user', function () {

    var mock;


    beforeEach(function (done) {
        kraken.create(app).listen(function (err, server) {
            mock = server;
            done(err);
        });
    });


    afterEach(function (done) {
        mongoose.connection.close();
        mock.close(done);
    });


    it('should say "hello"', function (done) {
        request(mock)
            .get('/')
            .expect(200)
            .expect('Content-Type', /html/)
            .expect(/Hello, /)
            .end(function(err, res){
                if (err) return done(err);
                done()
            });
    });

});
