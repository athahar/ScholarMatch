'use strict';


var ProfileModel = require('../../models/profile');
var userLib = require('../../lib/user')();
var mongoose = require('mongoose');
var User = mongoose.model("User");

module.exports = function (router) {


    var model = new ProfileModel();

    router.get('/', function (req, res) {

        model.data = model.data || {};

        model.messages = ''; // clear any messages

        model.data.userDetails = model.data.userDetails || {}
        model.data.userDetails.login = req.user.login;
        model.data.userDetails.fullName = req.user.fullName;
        model.data.userDetails.role = req.user.role;
        model.data.userDetails.phone = req.user.phone;
        model.data.userDetails.college = req.user.college;
        model.data.userDetails.industry = req.user.industry;
        model.data.userDetails.experience = req.user.experience;
        model.data.userDetails.gender = req.user.gender;
        model.data.userDetails.city = req.user.city;

        model.data.userDetails.userid = req.session.userid = req.user._id

        model.data.firstlogin = req.session.firstlogin;

        req.session.firstlogin = false; // clear initial login flag

        // should use this
        //model.data.user = JSON.parse(JSON.stringify(req.user));                
        res.render('profile/index', model);
    });


    router.post('/', function (req, res) {

        if (req.session.userid) {

            model.data = model.data || {};
            model.data.userDetails = model.data.userDetails || {}

            model.data.userDetails.fullName = req.body.fullName;
            model.data.userDetails.phone = req.body.phone;
            model.data.userDetails.college = req.body.college;
            model.data.userDetails.industry = req.body.industry;
            model.data.userDetails.experience = req.body.experience;
            model.data.userDetails.gender = req.body.gender;
            model.data.userDetails.city = req.body.city;
            model.data.userDetails.login = req.user.login;
            model.data.userDetails.userid = req.session.userid;

            model.data.firstlogin = req.session.firstlogin = false;


            userLib.updateUser(model.data.userDetails, function (err, result) {

                if (err) {
                    model.messages = err;
                    // model.messages.status = 'error';	 - Need to add this later
                    res.render('profile/index', model);
                } else {
                    // console.log('result '  + result);
                    // model.messages.status = 'success';
                    model.messages = 'Profile Updated';
                    res.render('profile/index', model);
                }

            });
        } else {
            res.redirect('/login');
        }

    });


    router.get('/user', function (req, res) {


        User.findByIdAndMeetings(req.query.userId, function (err, result) {
            if (err) {
                console.log('error')
                // model.messages = err;
                res.send(err);
            } else {
                console.log(result)

                model.data.result = JSON.parse(JSON.stringify(result));

                // res.render(result);
                res.render('profile/user', model);

            }

        })



    });
};