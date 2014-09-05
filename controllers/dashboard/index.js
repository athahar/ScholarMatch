'use strict';


var DashboardModel = require('../../models/dashboard'),
    mongoose = require('mongoose'),
    User = mongoose.model("User"),
    Meeting = mongoose.model("Meeting"),
    async = require("async");

module.exports = function (router) {

    var model = new DashboardModel();


    router.get('/', function (req, res) {

        var view = 'dashboard/index';


        model.data = model.data || {};
        // model.data.user = req.user;
        // console.log(req.user);
        // debugger;
        model.data.user = JSON.parse(JSON.stringify(req.user));
        model.data.meetings = model.data.meetings || {};
        model.viewName = 'dashboard';


        if (req.user.role === 'student') {

            view = 'dashboard/student';

            if ((req.user.coachesLinked && (req.user.coachesLinked.length > 0)) && (req.user.meetings && (req.user.meetings.length > 0))) {

                User.findByIdAndMeetings(req.session.user._id, function (err, result) {
                    if (err) {
                        console.log('error')
                        // res.send(err);
                        res.render(view, model);
                    } else {
                        console.dir(result);
                        model.data.meetingDetails = JSON.parse(JSON.stringify(result));
                        res.render(view, model);
                    }
                })

            } else {
                res.render(view, model);
            }

        } else if (req.user.role === 'coach') {
            view = 'dashboard/coach';

            if ((req.user.studentsLinked && (req.user.studentsLinked.length > 0)) && (req.user.meetings && (req.user.meetings.length > 0))) {

                User.findByIdAndMeetings(req.session.user._id, function (err, result) {
                    if (err) {
                        console.log('error')
                        // res.send(err);
                        res.render(view, model);
                    } else {
                        console.dir(result);
                        model.data.meetingDetails = JSON.parse(JSON.stringify(result));
                        res.render(view, model);
                    }
                })

            } else {
                res.render(view, model);
            }

        } else if (req.user.role === 'admin') {
            view = 'dashboard/admin';
            res.render(view, model);
        }

    });

    router.get('/getAllMeetings', function (req, res) {

        // var view = 'dashboard/student';

        // if (req.user.role === 'student') {
        //     view = 'dashboard/student';

        // } else if (req.user.role === 'coach') {
        //     view = 'dashboard/coach';

        // } else if (req.user.role === 'admin') {
        //     view = 'dashboard/admin';
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
                // res.render(view, model);
                // res.send(result);
            }

        })

    });


};