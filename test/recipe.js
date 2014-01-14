/*global describe:false, it:false, before:false, after:false, afterEach:false*/

'use strict';


var app = require('../index'),
    Recipe = require('../models/recipe'),
    kraken = require('kraken-js'),
    request = require('supertest'),
    assert = require('assert');


describe('recipe', function () {

    var mock;


    beforeEach(function (done) {
        kraken.create(app).listen(function (err, server) {
            mock = server;
            done(err);
        });
    });


    afterEach(function (done) {
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

    it('should ROCK',function (done) {
      request(mock).get('/').end(function(err,res) {     
      Recipe.find({},function(e,o) {
        var env = process.env.NODE_ENV;
        
        console.log("Env " + env);
        console.log("E " + e);
        assert(!e,"E is null");        
        done();
      });
    });
    });

});
