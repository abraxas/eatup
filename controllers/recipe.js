"use strict";

var Recipe = require("../models/recipe");

module.exports = function(app) {
    var model = new Recipe();
    app.get("/recipes", function(req, res) {
        Recipe.find({}, function(e, recipes) {
          model.recipes = recipes;
            res.format({
                json: function() {
                    res.json(model);
                },
                html: function() {
                    res.render("recipes", model);
                }
            });
        });
    });

    var prep_form = function(model,errors) {
        model = model || {};
        model.recipe = model.recipe || {};

        model.recipe.steps = model.recipe.steps || [];
        model.recipe.steps.push("");

        var tmpstep = model.recipe.steps;
        model.recipe.steps = [];
        var i = 1;
        tmpstep.forEach(function(x) {
            model.recipe.steps.push({
                step: x,
                offset: i++
            });
        });

        model.ingredients = [
          {amount: "1",measure:"tsp",ingredient: "fnord"},
          {custom_ingredient: "magic to taste", show_custom: 1}
        ];
      
        return model;
    }


    app.get("/recipes/new", function(req, res) {
        var model = prep_form();

        res.format({
            json: function() {
                res.json(model);
            },
            html: function() {
                res.render("recipes/new", model);
            }
        });
    });

    app.get("/recipes/:id/delete", function(req, res) {
        Recipe.remove({_id: req.params.id}, function(err) {

        res.format({
            json: function() {
                res.json(model);
            },
            html: function() {
                res.redirect("/recipes");
            }
        });
        });
    });

    app.post("/recipes/new", function(req,res) {
        var rval = {success: 1};
        
        console.log("BLAH: " + JSON.stringify(req.files));
        var data = req.body;
        if(req.user) {
          data.user_email = req.user.email;
        }
        delete data._csrf;

        console.log("GOT: " + JSON.stringify(data));
        Recipe.create(data,function(err,rec) {
          if(err) {
            console.log("ERROR: " + err);
          }
          return res.json(rval);          
        });
    });
};
