'use strict';


var LoginModel = require('../../models/login'),
    passport = require('passport'),
    async = require('async'),
    mongoose = require('mongoose'),
    User = mongoose.model("User"),
    crypto = require('crypto'),
    emailContent = require('../../lib/emailContent'),
    email = require('../../lib/email');



module.exports = function (router) {

    var model = new LoginModel();


    /**
     * Display the login page. We also want to display any error messages that result from a failed login attempt.
     */
    router.get('/', function (req, res) {

        console.dir(model);
        //Include any error messages that come from the login process.
        model.messages = req.flash('error');
        res.render('login', model);
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


        // passport.authenticate('local', function (err, user, info) {
        //     if (err) return next(err)
        //     if (!user) {
        //         return res.redirect('/login')
        //     }
        //     req.logIn(user, function (err) {
        //         if (err) return next(err);
        //         return res.redirect('/');
        //     });
        // })(req, res, next);

    });

    /**
     * Route for Forgot password
     * @param  {[type]} req object
     * @param  {[type]} res object
     * response.render
     */
    router.get('/forgot', function (req, res) {
        res.render('forgot/index', {
            user: req.user
        });
    });

    /**
     * Forgot password post function accepting an email in the body
     * @param  {[type]} req
     * @param  {[type]} res
     * @return {[type]}
     */
    router.post('/forgot', function (req, res) {
        var emailAddress = req.body.username;

        async.waterfall([

            // generate a crypto token 
            function (done) {
                crypto.randomBytes(20, function (err, buf) {
                    var token = buf.toString('hex');
                    done(err, token);
                });
            },
            // save a crypto token & expired time
            function (token, done) {

                if (!emailAddress) {
                    // TODO: Better error handling
                    err = 'No email entered';
                    model.messages = req.flash('Please enter your email');
                    done(err, 'done');
                }

                // could be refactored to use a User.findOne
                User.findByEmail(emailAddress, function (err, users) {
                    if (!users) {
                        req.flash('error', 'No account with this email address (' + emailAddress + ') exists.');
                        // return res.render('forgot/index');
                        done(err, null);
                    }

                    var user = users[0];

                    user.resetPasswordToken = token;
                    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour                    
                    user.save(function (err) {
                        done(err, token, user);
                    });
                });
            },
            //send email to the user with a reset link
            function (token, user, done) {

                var options = {
                    to: emailAddress,
                    subject: 'ScholarMatch Password Reset', // Subject line
                    // text: emailContent.buildTextResetpassword(req, token), // plaintext body
                    html: emailContent.resetPassword(req, token) // html body
                }

                // users were succesfully connected, now send an email
                email.sendEmail(options, function (err, result) {

                    if (err) {
                        model.messages = err;
                        done(err, 'done');
                    } else {

                        model.messages = 'An e-mail has been sent to ' + emailAddress + ' with further instructions.';
                        model.data = model.data || {};
                        model.data.result = JSON.parse(JSON.stringify(result));

                        //TODO: response handling shoudl be better
                        done(err, model);
                    }
                })

            }
        ], function (err, model) {
            if (err) {
                console.log('ERROR: ' + err);
                return res.render('forgot/index');
            }

            res.render('forgot/sent', model);
        });
    });

    /**
     * When the user clicks the reset link in the email, validate the token
     * and render a password change page.
     * TODO: if the token is invalid display a proper error message and redirect to forgot password page
     * @param  {[type]} req
     * @param  {[type]} res
     * @return {[type]}
     */
    router.get('/reset/:token', function (req, res) {
        User.findOne({
            resetPasswordToken: req.params.token,
            resetPasswordExpires: {
                $gt: Date.now()
            }
        }, function (err, user) {
            if (!user) {
                // TODO: have a better handling of the flash message to the user
                req.flash('error', 'Password reset token is invalid or has expired.');
                return res.redirect('/login/forgot');
            }
            res.render('account/reset', {
                user: user
            });
        });
    });


    /**
     * Once the token is validated, now the user can change the password
     * and an email confirmation is sent.
     * @param  {[type]} req
     * @param  {[type]} res
     * @return {[type]}
     */
    router.post('/reset/:token', function (req, res) {

        req.flash('error', 'Password reset token is invalid or has expired.');

        async.waterfall([

            // find the user with the token
            function (done) {
                User.findOne({
                    resetPasswordToken: req.params.token,
                    resetPasswordExpires: {
                        $gt: Date.now()
                    }
                }, function (err, user) {
                    if (!user) {
                        req.flash('error', 'Password reset token is invalid or has expired.');
                        return res.redirect('back');
                    }

                    // TODO: Validate the password & confirm password

                    user.password = req.body.password;
                    user.resetPasswordToken = undefined;
                    user.resetPasswordExpires = undefined;

                    //save password in hash & clear the token & expires object
                    user.save(function (err) {
                        done(err, user);
                    });
                });
            },

            // send email confirmation that password has been changed
            function (user, done) {

                var options = {
                    to: user.email,
                    subject: 'ScholarMatch Password Changed', // Subject line
                    // text: emailContent.buildTextResetpassword(req, token), // plaintext body
                    html: emailContent.passwordChanged(req) // html body
                }

                // users were succesfully connected, now send an email
                email.sendEmail(options, function (err, result) {

                    if (err) {
                        model.messages = err;
                        done(err, null);
                    } else {

                        model.messages = 'Confirmation Email sent';
                        model.data = model.data || {};
                        model.data.result = JSON.parse(JSON.stringify(result));

                        //TODO: response handling shoudl be better
                        done(err, model);

                    }
                })

            }
        ], function (err, result) {

            model.messages = err;
            req.flash = err;
            res.render('account/passwordChanged', result);

            // After reset password, do a user login & send to profile page

            // passport.authenticate('local', {
            //     successRedirect: '/profile',
            //     failureRedirect: '/login',
            //     failureFlash: true
            // })(req, res);


        });
    });


};