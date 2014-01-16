"use strict";

var RecipeModel = require("../models/recipe");

module.exports = function(app) {
    var model = new RecipeModel();
    app.get("/recipes", function(req, res) {
        RecipeModel.find({}, function(e, o) {
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
};
