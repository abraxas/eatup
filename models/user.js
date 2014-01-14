'use strict';

var mongoose = require('mongoose'),
    crypto = require('crypto'),
    uuid = require('node-uuid');


var hash = function (passwd, salt) {
    return crypto.createHmac('sha256', salt).update(passwd).digest('hex');
};

var userModel = function () {
    var userSchema = new mongoose.Schema({
        _id: {
            type: String
        },
        name: {
            type: String
        },
        passwordHash: {
            type: String
        },
        salt: {
            type: String,
            default: uuid.v1
        }
    });

    //Unique ID === email!
    userSchema.virtual('email').get(function () {
        return this._id;
    }).set(function (email) {
        this._id = email;
    });

    userSchema.virtual('password').set(function (password) {
        this.setPassword(password);
    });

    userSchema.static('findByEmail', function (email, fields, options, callback) {
        return this.findById(email, fields, options, callback);
    });

    userSchema.methods.setPassword = function (pass) {
        this.passwordHash = hash(pass, this.salt);
    };

    userSchema.methods.isValidPassword = function (pwd) {
        return this.passwordHash === hash(pwd, this.salt);
    };

    userSchema.methods.getRecipes = function (callback) {
        var Recipe = mongoose.model('Recipe');
        return Recipe.findByUser(this, callback);
    };

    return mongoose.model('User', userSchema);
};

module.exports = new userModel();

