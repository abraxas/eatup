"use strict";

var express = require("express");

var User = require("../models/user");

var passport = require("passport");

module.exports = function(app) {
    var model = new User();
    app.get("/login", function(req, res) {
        res.render("login", {});
    });
    app.get("/new_account", function(req, res) {
        return res.json({
            FAIL: 1
        });
        //res.render("new_account", {});
    });
    app.post("/login", passport.authenticate("local", {
        failureRedirect: "/login"
    }), function(req, res, next) {
        issueToken(req.user, function(err, token) {
            if (err) {
                return next(err);
            }
            res.cookie("remember_me", token, {
                path: "/",
                httpOnly: true,
                maxAge: 6048e5
            });
            return next();
        });
        res.redirect("/");
    });
    app.post("/new_account", function(req, res) {
        return res.json({
            FAIL: 1
        });
        /*
        var proto = req.body;
        console.log("BOOYA!");
        res.locals.user = new User(proto);
        console.log("BOOYAZ!" + JSON.stringify(req.body));
        res.locals.user.save(function(err, obj) {
            console.log("savd!" + err);
            console.log("savd!" + obj);
            req.login(res.locals.user, function(e, u) {
                console.log("huh!" + e);
                if (!err) {
                    res.redirect("/recipes");
                } else {
                    console.log("WHAT " + err);
                    res.render("new_account", {});
                }
            });
        });
        */
    });
    app.get("/logout", function(req, res) {
        res.clearCookie("remember_me");
        req.logout();
        res.redirect("/login");
    });
    app.get("/user", function(req, res) {
        res.format({
            json: function() {
                res.json(model);
            },
            html: function() {
                res.render("user", model);
            }
        });
    });
};

var randomString = function(len) {
    var buf = [], chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789", charlen = chars.length;
    for (var i = 0; i < len; ++i) {
        buf.push(chars[getRandomInt(0, charlen - 1)]);
    }
    return buf.join("");
};

var getRandomInt = function(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

var issueToken = function(user, done) {
    var token = randomString(64);
    saveRememberMeToken(token, user.id, function(err) {
        if (err) {
            return done(err);
        }
        return done(null, token);
    });
};

var tokens = {};

var saveRememberMeToken = function(token, uid, fn) {
    tokens[token] = uid;
    express.session("remember_me", tokens);
    return fn();
};
