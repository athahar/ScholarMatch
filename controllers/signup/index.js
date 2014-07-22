'use strict';


var SignupModel = require('../../models/signup');
var userLib = require('../../lib/user')();
var ProfileModel = require('../../models/profile');
var passport = require('passport');

module.exports = function (router) {

    var model = new SignupModel();
    var profilemodel = new ProfileModel();


    router.get('/', function (req, res) {
        
        model.messages = ''; // clear flash messages
        res.render('signup/index', model);
        
    });

	router.post('/', function (req, res) {
        
        var options = {};
        
        options.username = req.body.username;
        // options.login = req.body.username;
        options.password = req.body.password;
        options.role = req.body.role;


        // FIXME : if password !== confirm throw error.
         

        userLib.createUser(options, function (err, result) {

        	if(err){
                model.messages = err;        		
        		res.render('signup/index', model);
        	}else{
        		console.log('result '  + result);
        		
                req.session.firstlogin = true;
                
                // After signup, do a user login & send to profile page

                passport.authenticate('local', {
                    successRedirect: req.session.goingTo || '/profile',
                    failureRedirect: '/login',
                    failureFlash: true
                })(req, res);

        	}

        });

         
        // res.render('signup/index', model);
        
    });


};
