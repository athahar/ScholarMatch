'use strict';


var IndexModel = require('../models/index'),
    passport = require('passport');


module.exports = function (router) {

    var indexmodel = new IndexModel();

    /**
     * Render the home page
     *
     */
    router.get('/', function (req, res) {
        indexmodel.viewName = "home";
        res.render('index', indexmodel);
    });


    /**
     * Receive the login credentials and authenticate.
     * Successful authentications will go to /profile or if the user was trying to access a secured resource, the URL
     * that was originally requested.
     *
     * Failed authentications will go back to the login page with a helpful error message to be displayed.
     */
    router.post('/', function (req, res) {

        passport.authenticate('local', {
            successRedirect: req.session.goingTo || '/dashboard',
            failureRedirect: '/login',
            failureFlash: true
        })(req, res);

    });


    /**
     * Allow the users to log out
     */
    router.get('/logout', function (req, res) {
        req.logout();
        res.redirect('/login');
    });

};