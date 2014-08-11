'use strict';


var DashboardModel = require('../../models/dashboard'),
    mongoose = require('mongoose'),
    User = mongoose.model("User"),
    Meeting = mongoose.model("Meeting");

module.exports = function (router) {

    var model = new DashboardModel();


    router.get('/', function (req, res) {

        var viewname = 'dashboard/index';


        model.data = model.data || {};
        // model.data.user = req.user;
        model.data.user = JSON.parse(JSON.stringify(req.user));

        if (req.user.role === 'student') {
            viewname = 'dashboard/student';

        } else if (req.user.role === 'coach') {
            viewname = 'dashboard/coach';

        } else if (req.user.role === 'admin') {
            viewname = 'dashboard/admin';
        }

        model.data.meetings = model.data.meetings || {};
        model.data.meetings.upcoming = {
            count: 2,
            details: [{
                meetingid: '908',
                time: '07/16/2014 3:00PM',
                topic: 'LinkedIn Refinements',
                location: 'Telephonic',
                contact: '408-123-1234',
                notes: null,
                meetingWith: {
                    name: 'David Jenkins',
                    userid: '53d58729ff1102000050c0f1'
                },
            }, {
                meetingid: '918',
                time: '07/18/2014 7:00PM',
                topic: 'Insider scoop',
                location: 'Starbucks, 123 Rivermark Pl, Santa Clara, CA',
                contact: '650-111-1234',
                notes: null,
                meetingWith: {
                    name: 'Dave Higgers',
                    userid: '53d58729ff1102000050c0f1'
                }
            }]
        };

        model.data.meetings.past = {
            count: 3,
            details: [{
                meetingid: '908',
                time: '06/16/2014 3:00PM',
                topic: 'Insider Scoop',
                notes: null,
                meetingWith: {
                    name: 'David Jenkins',
                    userid: '53d58729ff1102000050c0f1'
                },
            }, {
                meetingid: '904',
                time: '05/26/2014 3:00PM',
                topic: 'Meet n Greet',
                notes: 'Good discussion to have with',
                meetingWith: {
                    name: 'David Jenkins',
                    userid: '53d58729ff1102000050c0f1'
                },
            }, {
                meetingid: '918',
                time: '06/18/2014 7:00PM',
                topic: 'Meet n Greet',
                notes: 'Dave is a great guy',
                meetingWith: {
                    name: 'Dave Higgers',
                    userid: '53d58729ff1102000050c0f1'
                }
            }]
        };

        // console.dir(model);
        res.render(viewname, model);

    });

    router.get('/getAllMeetings', function (req, res) {

        User.findByIdAndMeetings(req.query.userid, function (err, result) {
            if (err) {
                model.messages = err;
                res.send(err);
            } else {

                // 1
                var opts = [{
                    path: 'meetings.attendees'
                }];

                debugger;
                console.dir(result.meetings);

                Meeting.populate(result, opts, function (err, result2) {
                    res.send(result2);
                })
            }

        })

    });


};