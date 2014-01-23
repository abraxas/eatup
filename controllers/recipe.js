"use strict";

var Recipe = require("../models/recipe");

var os = require("os");

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
    var prep_form = function(model, errors) {
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
        model.ingredients = [ {
            amount: "1",
            measure: "tsp",
            ingredient: "fnord"
        }, {
            custom_ingredient: "magic to taste",
            show_custom: 1
        } ];
        return model;
    };
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

    app.get("/recipes/:id/image", function(req, res) {
        console.log("IMAGGY");
        Recipe.findById(req.params.id, function(err, recipe) {
            console.log("ERR " + err);
            console.log("ERR " + recipe);
            recipe.getImageStream(res, "Image not found");
        });
    });
    app.get("/recipes/:id/edit", function(req, res) {
        Recipe.findById(req.params.id, function(err, recipe) {
            res.render("recipes/edit",{recipe: recipe});
        });
    });
    app.get("/recipes/:id/delete", function(req, res) {
        Recipe.remove({
            _id: req.params.id
        }, function(err) {
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


    app.post("/recipes/:id/save_image", function(req,res) {
      var rval = {
            success: 1
        }
      if(req.files) {
        Recipe.findById(req.params.id, function(err, recipe) {
          recipe.saveImage(req.files["recipe-image-upload"], function(err, file) {
            if (err) {
                    console.log("IMAGESAVE ERROR: " + err);
                }
                return res.json(rval);
            });
        });
      }
      else {
        return res.json({error: "file not received"});
      }
    })


    app.post("/recipes/new", function(req, res) {
        var rval = {
            success: 1
        };
        var data = req.body;
        if (req.user) {
            data.user_email = req.user.email;
        }
        delete data._csrf;
        delete data.image;
        console.log("A2S " + JSON.stringify(req.body));
        Recipe.create(data, function(err, rec) {
            var done = function(err, req, file) {
                if (err) {
                    console.log("ERROR: " + err);
                }
                rval._id = rec._id;
                return res.json(rval);
            };
//            if (req.files && req.files["recipe-image-upload"]) {
//                rec.saveImage(req.files["recipe-image-upload"], function(err, file) {
//                    return done(err, rec, file);
//                });
//            } else {
                return done(err, rec, null);
//            }
        });
    });
};
