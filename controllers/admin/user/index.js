'use strict';


var AdminModel = require('../../../models/admin'),
    mongoose = require('mongoose'),
    User = mongoose.model("User"),
    userLib = require('../../../lib/user')(),
    MeetingRequest = mongoose.model("Meeting"),
    async = require('async'),
    email = require('../../../lib/email'),
    emailContent = require('../../../lib/emailContent'),
    moment = require('moment'),
    auth = require('../../../lib/auth');


module.exports = function (router) {

    var model = new AdminModel();

    model.viewName = 'admin';

    // router.get('/createAdmin', auth.injectUser(), function (req, res) {
    //     res.render('admin/createAdmin', model);
    // });


    router.get('/createAdmin', auth.isAdmin(), function (req, res) {

        model.messages = ''; //clear msgs
        var options = {};

        options.role = "coach";

        userLib.queryEveryCoach(options, function (err, result) {
            //userLib.queryAllUsers(options, function (err, result) {

            if (!err) {
                model.data = model.data || {};
                model.data.results = JSON.parse(JSON.stringify(result));
                model.data.count = result.length;
                console.dir(model.data);
                // model.data.forStudent = true; // search done by student for coach
                // console.dir(model);
                res.render('admin/createAdmin', model);
            } else {
                res.send(err);
            }

        })
    })

    router.post('/createAdmin', function (req, res) {
        // debugger;

        model.messages = ''; //clear msgs

        var userId = req.body.coach;

        userLib.makeAdmin(userId, function (err, result) {
            //userLib.queryAllUsers(options, function (err, result) {

            if (!err) {
                model.data = model.data || {};
                model.data.results = JSON.parse(JSON.stringify(result));
                model.data.count = result.length;
                console.dir(model.data);
                model.messages = "Admin access granted"
                // model.data.forStudent = true; // search done by student for coach
                // console.dir(model);
                res.render('admin/access', model);
            } else {
                res.send(err);
            }

        })

    });

};
