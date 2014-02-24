"use strict";

var Recipe = require("../models/recipe");

var os = require("os");

module.exports = function(app) {
    app.get("/recipe*", function(req, res, next) {
        if (req.user) {
            return next();
        }
        //        return res.json({
        //            FAIL: 1
        //        });
        return res.redirect("/login");
    });
    var model = new Recipe();
    app.get("/recipes", function(req, res) {
        Recipe.find({}, function(e, recipes) {
            model.recipes = recipes;
            res.format({
                json: function() {
                    res.json(model);
                },
                html: function() {
                    res.render("recipes/index", model);
                }
            });
        });
    });
    var prep_form = function(model, errors) {
        console.log("PRE_PREP " + JSON.stringify(model));
        model = model || {};
        model.recipe = model.recipe || {};
        model.recipe.steps = model.recipe.steps || [];
        model.recipe.steps.push("");
        var i = 1;
        model.recipe.steps = model.recipe.steps.map(function(x, y) {
            var v = {
                step: x,
                offset: i++
            };
            return v;
        });
        model.recipe.ingredients = model.recipe.ingredients || [ {} ];
        model.recipe.ingredients = model.recipe.ingredients.map(function(i) {
            if (i.custom_ingredient) {
                i.show_custom = 1;
            }
            return i;
        });
        console.log("POST_PREP " + JSON.stringify(model));
        console.log("POST_PREP " + JSON.stringify(model.recipe.steps));
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
            res.render("recipes/edit", prep_form({
                recipe: recipe.toObject()
            }));
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
    app.post("/recipes/:id/save_image", function(req, res) {
        var rval = {
            success: 1
        };
        if (req.files) {
            Recipe.findById(req.params.id, function(err, recipe) {
                recipe.saveImage(req.files["recipe-image-upload"], function(err, file) {
                    if (err) {
                        console.log("IMAGESAVE ERROR: " + err);
                    }
                    return res.json(rval);
                });
            });
        } else {
            return res.json({
                error: "file not received"
            });
        }
    });
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
            if (err) {
                console.log("ERROR: " + err);
            }
            rval._id = rec._id;
            return res.json(rval);
        });
    });
    app.post("/recipes/:id/edit", function(req, res) {
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
        Recipe.findById(req.params.id, function(err, rec) {
            rec.name = data.name;
            rec.description = data.description;
            rec.ingredients = data.ingredients;
            rec.steps = data.steps;
            rec.save(function(err, rec) {
                if (err) {
                    console.log("ERROR: " + err);
                }
                rval._id = rec._id;
                return res.json(rval);
            });
        });
    });
};