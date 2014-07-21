'use strict';


var ProfileModel = require('../../models/profile');
var userLib = require('../../lib/user')();

module.exports = function (router) {

    
	var model = new ProfileModel();
   
	router.get('/', function(req, res) {
        
        model.data = model.data || {};

        model.messages = ''; // clear any messages
        
        model.data.userDetails = model.data.userDetails || {}
        model.data.userDetails.name = req.user.name;
        model.data.userDetails.role = req.user.role;
        model.data.userDetails.phone = req.user.phone;
        model.data.userDetails.college = req.user.college;
        model.data.userDetails.experience = req.user.experience;
        model.data.userDetails.gender = req.user.gender;
        model.data.userDetails.city = req.user.city;

        model.data.userDetails.userid = req.session.userid = req.user._id

        // console.dir(model);

        res.render('profile/index', model);
    });


    router.post('/', function(req, res) {
        
        if(req.session.userid){

        	model.data = model.data || {};        
	        model.data.userDetails = model.data.userDetails || {}

	        // console.log("req.session.userid  : " + req.session.userid );
	        // model.data.userDetails._id		= req.body.userid;
	        model.data.userDetails.phone = req.body.phone;
	        model.data.userDetails.college = req.body.college;
	        model.data.userDetails.industry = req.body.industry;
	        model.data.userDetails.experience = req.body.experience;
	        model.data.userDetails.gender = req.body.gender;
	        model.data.userDetails.city = req.body.city;

	        // console.dir(model.data.userDetails);

	        userLib.updateUser(model.data.userDetails , function (err, result) {

	        	if(err){
	        		// console.log('error : '+ err);
	        		// req.flash('error', err);
	        		model.messages = err;        		
	        		res.render('profile/index', model);
	        	}else{
	        		// console.log('result '  + result);

	        		model.messages = 'Profile Updated';        		
	        		res.render('profile/index', model);
	        		
	        	}

	        });
        }else{
        	res.redirect('/login');
        }
		
    });


    router.get('/:name', function (req, res) {
        
        res.render('profile/student', model);
        
    });
};
