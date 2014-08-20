'use strict';


var SignupModel = require('../../models/signup');
var userLib = require('../../lib/user')();
var ProfileModel = require('../../models/profile');
var passport = require('passport');
var expressValidator = require('express-validator');

module.exports = function (router) {

    var model = new SignupModel();
    var profilemodel = new ProfileModel();


    router.get('/', function (req, res) {
        
        model.messages = ''; // clear flash messages
        res.render('signup/index', model);
        
    });

	router.post('/', function (req, res) {
        
        // ref : https://github.com/IEEE-NU/DevElement/blob/996e29ac8d01aa45f918a71f8814d9b97ff2f73b/controllers/user.js
       
       // TODO: Need to know how to access the flash errors in UI
        
        // req.assert('username', 'Email is not valid').isEmail();
        // req.assert('password', 'Password must be at least 4 characters long').len(4);
        // req.assert('confirmPassword', 'Passwords do not match').equals(req.body.password);

        // var errors = req.validationErrors();

        // if (errors) {
        //     req.flash('errors', errors);            
        //     console.dir(req);
        //     return res.redirect('/signup');
        // }

        
        var options = {};
        
        options.username = req.body.username;
        // options.login = req.body.username;
        options.password = req.body.password;
        options.role = req.body.role;


        userLib.createUser(options, function (err, result) {

        	if(err){
                model.messages = err;        		
        		res.render('signup/index', model);
        	}else{
        		console.log('result '  + result);
        		
                req.session.firstlogin = true;
                
                // After signup, do a user login & send to profile page

                passport.authenticate('local', {
                    successRedirect: '/profile',
                    failureRedirect: '/login',
                    failureFlash: true
                })(req, res);

        	}

        });
         
    });


};
