'use strict';


var AdminModel = require('../../models/admin'),
    mongoose = require('mongoose'),
    User = mongoose.model("User"),
    MeetingRequest = mongoose.model("Meeting"),
    async = require('async'),
    auth = require('../../lib/auth');


module.exports = function (router) {

    var model = new AdminModel();

    model.viewName = 'admin';

    router.get('/', auth.isAuthenticated('admin'), auth.injectUser(), function (req, res) {
        res.render('admin/index', model);
    });

    router.get('/allmeetings', function (req, res) {

        MeetingRequest.findAll(function (err, result) {
            if (err) {
                console.log(err);
                model.messages = err;
                // res.render('meeting-invite/index', model);
                res.send(model);
            } else {
                console.dir(result);
                model.data = model.data || {};
                model.data.meetingDetails = JSON.parse(JSON.stringify(result));

                res.render('admin/allmeetings', model);
            }
        })

    });

};