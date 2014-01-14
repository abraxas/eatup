'use strict';


var kraken = require('kraken-js'),    
    db = require("./lib/database"), 

    passport = require("passport"),
    auth = require("./lib/auth"), 
    flash = require("connect-flash"),

    nav = require("./lib/nav"), 
    app = {};


app.configure = function configure(nconf, next) {
    // Async method run on startup.
    db.config(nconf.get("databaseConfig"));
    auth.config(passport, nconf.get("authConfig"));
    next(null);
};


app.requestStart = function requestStart(server) {
    // Run before most express middleware has been registered.
    nav.init(server);
};


app.requestBeforeRoute = function requestBeforeRoute(server) {
    // Run before any routes have been added.
    server.use(flash());
    server.use(passport.initialize());
    server.use(passport.session());
    server.use(function(req,res,next) {
      res.locals.user = req.user;
      console.log("USER = " + res.locals.user);
      next();
    });
};


app.requestAfterRoute = function requestAfterRoute(server) {
    // Run after all routes have been added.
};


if (require.main === module) {
    kraken.create(app).listen(function (err) {
        if (err) {
            console.error(err);
        }
    });
}


module.exports = app;
