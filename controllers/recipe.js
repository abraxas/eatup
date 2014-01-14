'use strict';


var RecipeModel = require('../models/recipe');


module.exports = function (app) {

    var model = new RecipeModel();


    app.get('/recipe', function (req, res) {
        
      RecipeModel.find({},function(e,o) {
        res.format({
            json: function () {
                res.json(model);
            },
            html: function () {
                res.render('recipe', model);
            }
        });
      });
    });

};
