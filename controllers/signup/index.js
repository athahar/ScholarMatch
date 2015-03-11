'use strict';


var SignupModel = require('../../models/signup');
var userLib = require('../../lib/user')();
var passport = require('passport');
var expressValidator = require('express-validator');
var email = require('../../lib/email');
var emailContent = require('../../lib/emailContent');

module.exports = function (router) {

    var model = new SignupModel();
    model.viewName = 'signup';


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

        options.fullName = req.body.fullName;
        options.username = req.body.username;
        // options.login = req.body.username;
        options.password = req.body.password;
        options.role = req.body.role;
        options.status = "Profile Created";


        userLib.createUser(options, function (err, result) {

            if (err) {
                model.messages = err;
                res.render('signup/index', model);
            } else {

                var emailList = new Array();
                emailList.push(options.username);

                var emailOptions = {
                    to: emailList.toString(),
                    subject: 'Welcome to Career Connections', // Subject line
                    text: emailContent.welcomeUser(options.fullName, options.role), // plaintext body
                    html: emailContent.welcomeUser(options.fullName, options.role) // html body
                };

                email.sendEmail(emailOptions, function (err, result) {

                    if (err) {
                        console.log(err);
//                        model.messages = err;
//                        res.render('meeting-invite/index', model);
                    } else {
                        // console.log(result);
                        /*model.emailSent = model.emailSent || {};
                        model.emailSent = {
                            "inviteCreator": inviteCreator,
                            "invited": invitee,
                            "meeting": meeting
                        };

                        console.dir(model);
                        res.render('meeting-invite/emailSent', model);
                        */
                    }
                });

                console.log('result ' + result);

                req.session.firstlogin = true;

                // After signup, do a user login & send to profile page

                passport.authenticate('local', {
                    successRedirect: '/profile/edit',
                    failureRedirect: '/login',
                    failureFlash: true
                })(req, res);

            }

        });

    });


};