'use strict';


var SignupModel = require('../../models/signup');
var userLib = require('../../lib/user')();
var ProfileModel = require('../../models/profile');

module.exports = function (router) {

    var model = new SignupModel();
    var profilemodel = new ProfileModel();


    router.get('/', function (req, res) {
        
        res.render('signup/index', model);
        
    });

	router.post('/', function (req, res) {
        
        var options = {};

        options.username = req.body.username;
        options.login = req.body.username;
        options.password = req.body.password;
        options.role = req.body.role;


        // FIXME : if password !== confirm throw error.
         

        userLib.createUser(options, function (err, result) {

        	if(err){
        		console.log('error : '+ err);
        		// req.flash('error', err);
        		model.messages = err;        		
        		res.render('signup/index', model);
        	}else{
        		console.log('result '  + result);
        		res.redirect('/profile');
        	}

        });

         
        // res.render('signup/index', model);
        
    });


};
