'use strict';

var express = require('express'),
    passport = require('passport'),
    schemas = require('../models/schemas'),
    auth = require('../lib/auth'),
    userLib = require('./user')(),
    db = require('../lib/database');

module.exports = function spec(app) {
    app.on('middleware:after:session', function configPassport(eventargs) {
        //Tell passport to use our newly created local strategy for authentication
        passport.use(auth.localStrategy());
        //Give passport a way to serialize and deserialize a user. In this case, by the user's id.
        passport.serializeUser(userLib.serialize);
        passport.deserializeUser(userLib.deserialize);
        app.use(passport.initialize());
        app.use(passport.session());
    });
    return {
        onconfig: function (config, next) {

            var dbConfig = config.get('databaseConfig');

            db.config(dbConfig);
            // userLib.addUsers();
            next(null, config);
        }
    };

};