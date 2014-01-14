'use strict';


var IndexModel = require('../models/index');


module.exports = function (app) {

    var model = new IndexModel();


    app.get('/', function (req, res) {
        console.log('GOT');
        
        res.render('index', model);
        
    });

};
