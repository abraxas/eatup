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
          Recipe.remove({},function() {
            mock = server;
            done(err);
          });
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

    it('should search recipes',function (done) {
      request(mock).get('/').end(function(err,res) {     
      Recipe.find({},function(e,o) {
        var env = process.env.NODE_ENV;
        
        assert(!e,"E is null");        
        done();
      });
    });
    });

    it('should add a recipe and find it',function (done) {
      Recipe.create({
        user_email: "test@user.com",
        name: "Blah",
        steps: ["Test","Then"],
        ingredients: [
           {raw_amount: '1/2',amount: 0.5, measure: 'tsp', ingredient: 'awesomeness'},
           {raw_amount: '1/4',amount: 0.25, measure: 'tsp', ingredient: 'coolitude'},
        ]
      },function(e,o) {
        assert(!e,"E is null");        
        assert(o,"O is not null");        
        Recipe.findOne({name: "Blah"},function(e,o2) {
          assert(!e,"E is null");        
          assert.equal(o.name,o2.name,"Got what I gave: name");
          assert.equal(JSON.stringify(o.steps),JSON.stringify(o2.steps),"Got what I gave: steps");
          assert.equal(o.description,o2.description,"Got what I gave: desc");
          assert.equal(JSON.stringify(o.ingredients),JSON.stringify(o2.ingredients),"Got what I gave: ing");
          done();
        });


      });



    });

});
