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

                debugger;
                User.findByIdAndMeetings(req.user._id, function (err, result) {
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

                debugger;
                User.findByIdAndMeetings(req.user._id, function (err, result) {
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





        // model.data.meetings = model.data.meetings || {};
        // model.data.meetings.upcoming = {
        //     count: 2,
        //     details: [{
        //         meetingid: '908',
        //         time: '07/16/2014 3:00PM',
        //         topic: 'LinkedIn Refinements',
        //         location: 'Telephonic',
        //         contact: '408-123-1234',
        //         notes: null,
        //         meetingWith: {
        //             name: 'David Jenkins',
        //             userid: '53d58729ff1102000050c0f1'
        //         },
        //     }, {
        //         meetingid: '918',
        //         time: '07/18/2014 7:00PM',
        //         topic: 'Insider scoop',
        //         location: 'Starbucks, 123 Rivermark Pl, Santa Clara, CA',
        //         contact: '650-111-1234',
        //         notes: null,
        //         meetingWith: {
        //             name: 'Dave Higgers',
        //             userid: '53d58729ff1102000050c0f1'
        //         }
        //     }]
        // };

        // model.data.meetings.past = {
        //     count: 3,
        //     details: [{
        //         meetingid: '908',
        //         time: '06/16/2014 3:00PM',
        //         topic: 'Insider Scoop',
        //         notes: null,
        //         meetingWith: {
        //             name: 'David Jenkins',
        //             userid: '53d58729ff1102000050c0f1'
        //         },
        //     }, {
        //         meetingid: '904',
        //         time: '05/26/2014 3:00PM',
        //         topic: 'Meet n Greet',
        //         notes: 'Good discussion to have with',
        //         meetingWith: {
        //             name: 'David Jenkins',
        //             userid: '53d58729ff1102000050c0f1'
        //         },
        //     }, {
        //         meetingid: '918',
        //         time: '06/18/2014 7:00PM',
        //         topic: 'Meet n Greet',
        //         notes: 'Dave is a great guy',
        //         meetingWith: {
        //             name: 'Dave Higgers',
        //             userid: '53d58729ff1102000050c0f1'
        //         }
        //     }]
        // };

        // console.dir(model);


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