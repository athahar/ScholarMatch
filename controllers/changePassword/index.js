'use strict';

var userLib = require('../../lib/user')();
var mongoose = require('mongoose');
var User = mongoose.model("User");
var logger = require('tracer').colorConsole();


module.exports = function (router) {

    var model = new User();
    model.viewName = 'profile';

    router.get('/', function (req, res) {

        model.data = model.data || {};
        model.data.userid = req.user._id;
	
        model.messages = ''; // clear any messages

        userLib.findUser(model.data, function (err, result) {

            if (err) {
                console.log('error');
                // model.messages = err;
                res.send(err);
            } else {
                console.log(result);

                model.data.result = model.data.result || {};
                model.data.result = JSON.parse(JSON.stringify(result));

                // res.render(result);
                model.data.result.ownProfile = true;
                model.data.result.isConnected = true;
                res.render('change-password/index', model);
            }
        });
    });

    router.post('/', function (req, res) {

//        debugger;

        if (req.session.user._id) {

            model.data = model.data || {};
            model.data.result = model.data.result || {};

            model.data.result.userid = req.user._id;
			
			if(!req.body.currentPassword) {
				model.messages = 'Please enter the current password';
				res.render("change-password/index", model);
			} else if (!req.body.newPassword) {
				model.messages = 'Please enter a new password';
				res.render("change-password/index", model);
			} else if(req.body.newPassword != req.body.newPasswordRepeat) {
				model.messages = 'Please re-enter the new password correctly"';
				res.render("change-password/index", model);
			} else {
 
				model.data.result.password = req.body.newPassword;
				
				userLib.findUser(model.data, function (err, result) {

					if (err) {
						console.log('error');
						model.messages = "System error. Password not changed. Try again later";
						res.render('profile/user', model);
					} else {
				
						console.log(result);

						model.data.result = model.data.result || {};
						model.data.result = JSON.parse(JSON.stringify(result));

						model.data.result.ownProfile = true;
						model.data.result.isConnected = true;
						
						if(!result.passwordMatches(req.body.currentPassword)) {
							model.messages = "Incorrect current password";
							res.render("change-password/index", model);
						} else {

							result.password = req.body.newPassword;						
							//save password in hash & clear the token & expires object
							result.save(function (err) {
								if(err) {
									model.messages = "System error. Password not changed. Try again later";
									res.render('profile/user', model);
								} else {
									model.messages = "Password Changed";
									res.render('profile/user', model);
								}
							});
						}
					}
                });
			}
		}
    });
};