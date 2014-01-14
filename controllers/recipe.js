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
          var model = {recipe: {}};
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
