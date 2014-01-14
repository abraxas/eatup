"use strict";

var LocalStrategy = require("passport-local").Strategy, User = require("../models/user");

var local_auth = new LocalStrategy({
    usernameField: "email"
}, function(email, password, done) {
    console.log("Attempting to authenticate");
    console.log("for: " + email);
    User.findOne({email: email}, function(err, user) {
        console.log("AND GOT: " + err);
        if (err) {
            return done(err);
        }
        console.log("AND GOT: " + user);
        if (!user) {
            return done(null, false, {
                message: "Incorrect email."
            });
        }
        if (!user.isValidPassword(password)) {
            return done(null, false, {
                message: "Incorrect password."
            });
        }
        return done(null, user);
    });
});

var user_serialize = function(user, done) {
    done(null, user._id);
};

var user_deserialize = function(id, done) {
    User.findById(id, function(err, user) {
        done(err, user);
    });
};

var guarantee_admin = function(adminuser) {
    User.findById(adminuser.email, function(err, user) {
        if (err) {
            console.log("Guarantee Error: " + err);
        } else {
            if (!user) {
                User.create(adminuser, function(err, u) {
                    if (err) {
                        console.log("ERROR creating adminuser!");
                    }
                });
            }
        }
    });
};

var auth = function() {
    var conf;
    return {
        config: function(passport, confdata) {
            conf = confdata;
            if (conf && conf.owner) {
                guarantee_admin(conf.owner);
            }
            console.log("Connecting auth...");
            passport.use(local_auth);
            passport.serializeUser(user_serialize);
            passport.deserializeUser(user_deserialize);
        }
    };
};

module.exports = auth();
