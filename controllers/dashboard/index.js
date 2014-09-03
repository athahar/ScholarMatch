'use strict';


var DashboardModel = require('../../models/dashboard'),
    mongoose = require('mongoose'),
    User = mongoose.model("User"),
    Meeting = mongoose.model("Meeting"),
    async = require("async");

module.exports = function (router) {

    var model = new DashboardModel();


    router.get('/', function (req, res) {

        var viewname = 'dashboard/index';


        model.data = model.data || {};
        // model.data.user = req.user;
        // console.log(req.user);
        // debugger;
        model.data.user = JSON.parse(JSON.stringify(req.user));
        model.data.meetings = model.data.meetings || {};


        if (req.user.role === 'student') {

            viewname = 'dashboard/student';
            if (req.user.coachesLinked.length > 0 && req.user.meetings.length > 0) {

                User.findByIdAndMeetings(req.session.user._id, function (err, result) {
                    if (err) {
                        console.log('error')
                        // res.send(err);
                        res.render(viewname, model);
                    } else {
                        console.dir(result);
                        model.data.meetingDetails = JSON.parse(JSON.stringify(result));
                        res.render(viewname, model);
                    }
                })

            } else {
                res.render(viewname, model);
            }

        } else if (req.user.role === 'coach') {
            viewname = 'dashboard/coach';

            if (req.user.studentsLinked.length > 0 && req.user.meetings.length > 0) {

                User.findByIdAndMeetings(req.session.user._id, function (err, result) {
                    if (err) {
                        console.log('error')
                        // res.send(err);
                        res.render(viewname, model);
                    } else {
                        console.dir(result);
                        model.data.meetingDetails = JSON.parse(JSON.stringify(result));
                        res.render(viewname, model);
                    }
                })

            } else {
                res.render(viewname, model);
            }

        } else if (req.user.role === 'admin') {
            viewname = 'dashboard/admin';
            res.render(viewname, model);
        }

    });

    router.get('/getAllMeetings', function (req, res) {

        // var viewname = 'dashboard/student';

        // if (req.user.role === 'student') {
        //     viewname = 'dashboard/student';

        // } else if (req.user.role === 'coach') {
        //     viewname = 'dashboard/coach';

        // } else if (req.user.role === 'admin') {
        //     viewname = 'dashboard/admin';
        // }

        User.findByIdAndMeetings(req.query.userid, function (err, result) {
            if (err) {
                console.log('error')
                // model.messages = err;
                res.send(err);
            } else {
                console.log('success')

                // model.data.meetings = JSON.parse(JSON.stringify(result));

                res.send(result);
                // res.render(viewname, model);
                // res.send(result);
            }

        })

    });


};