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
    app.get("/recipes/new", function(req, res) {
        var model = {
            recipe: {}
        };
        model.recipe.name = "blah";
        model.recipe.steps = [ "this", "is", "a", "test" ];
        var tmpstep = model.recipe.steps;
        tmpstep.push("");
        model.recipe.raw_steps = tmpstep;
        model.recipe.steps = [];
        var i = 1;
        tmpstep.forEach(function(x) {
            model.recipe.steps.push({
                step: x,
                offset: i++
            });
        });
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