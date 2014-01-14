'use strict';


var UserModel = require('../models/user');


module.exports = function (app) {

    var model = new UserModel();


    app.get('/user', function (req, res) {
        
        res.format({
            json: function () {
                res.json(model);
            },
            html: function () {
                res.render('user', model);
            }
        });
    });

};
