'use strict';


var AdminModel = require('../../models/admin'),
    mongoose = require('mongoose'),
    User = mongoose.model("User"),
    userLib = require('../../lib/user')(),
    MeetingRequest = mongoose.model("Meeting"),
    async = require('async'),
    email = require('../../lib/email'),
    emailContent = require('../../lib/emailContent'),
    moment = require('moment'),
    auth = require('../../lib/auth');


module.exports = function (router) {

    var model = new AdminModel();

    model.viewName = 'admin';

    router.get('/', auth.isAuthenticated('admin'), auth.injectUser(), auth.isAdmin(), function (req, res) {
        res.render('admin/index', model);
    });

    router.get('/listUserStatus', function (req, res) {

        model.messages = ''; //clear msgs

        var options = {};

        userLib.listAllUsers(options, function (err, result) {

            if (!err) {
                model.data = model.data || {};
                model.data.results = JSON.parse(JSON.stringify(result));
                console.log(model.data.results);
                model.data.count = result.length;


                res.render('admin/updateUserStatus.dust', model);
            } else {
                res.send(err);
            }

        })        

    });

    router.post('/UpdateUserStatus', function (req, res) {

        var userId = req.body.userId;
        var newStatus = req.body.newStatus;


        // debugger;
        userLib.updateStatus(userId, "Profile Approved", function (err, result) {
            if (err) {
                req.flash('error', 'approval failed');
                return res.redirect('/admin/listUserStatus');
            } else {
                req.flash('success', 'sucessfully approved');
                return res.redirect('/admin/listUserStatus');
            }
        });

    });

    router.get('/exitInterviewComplete', function (req, res) {

                model.messages = ''; //clear msgs

        var options = {};

        options.status = "Profile Created";

        userLib.queryAllUsers(options, function (err, result) {

            if (!err) {
                model.data = model.data || {};
                model.data.results = JSON.parse(JSON.stringify(result));
                console.log(model.data.results);
                model.data.count = result.length;


                res.render('admin/approveSignup', model);
            } else {
                res.send(err);
            }

        })        

        res.render('admin/exitInterviewComplete');
    });

    router.get('/allmeetings', auth.isAdmin(), function (req, res) {
        // debugger;
        MeetingRequest.findAll(function (err, result) {
            // debugger;
            if (err) {
                console.log(err);
                model.messages = err;
                // res.render('meeting-invite/index', model);
                res.send(model);
            } else {
                // console.dir(result);
                model.data = model.data || {};
                model.data.meetingDetails = JSON.parse(JSON.stringify(result));
                for (var i = 0; i < model.data.meetingDetails.length; i++) {
                    console.log("Meeting date from DB " + model.data.meetingDetails[i].meetingdate);
                    var now = new Date();
                    var nowMoment = moment(now);
                    //var meetDate = new Date(model.data.meetingDetails[i].meetingdate);
                    //16 September 2014 - 06:30 PM
                    var meetingtimeNew = model.data.meetingDetails[i].meetingdate;
                    var arr = meetingtimeNew.split(" ");
                    if (arr.length > 4) {
                        var hour = arr[4].split(":");
                        var hr = hour[0];
                        var min = hour[1];
                        if (arr[5] == "PM") {
                            hr = hr + 12;
                        }
                        meetingtimeNew = arr[0] + " " + arr[1] + " " + arr[2] + " - " + hr + min;
                    }
                    console.log("New meeting time = " + meetingtimeNew);
                    var meetDate = moment(model.data.meetingDetails[i].meetingdate, "D MMM YYYY - HH:mm");
                    console.log("now " + nowMoment);


                    //var meetDate = moment("");
                    console.log("Meeting Date " + meetDate);
                    if (now > meetDate) {
                        model.data.meetingDetails[i].isMeetingCompleted = "true";
                        console.log("IS meeting completed? " + model.data.meetingDetails[i].isMeetingCompleted);
                    } /*else {
                        model.data.meetingDetails[i].isMeetingCompleted = false;
                        console.log("IS meeting completed? " + model.data.meetingDetails[i].isMeetingCompleted);
                    }*/
                }
                res.render('admin/allmeetings', model);
            }
        });

    });

    router.get('/meeting-setup', function (req, res) {
        // debugger;
        var options = {
            role: 'coach'
        };
        userLib.queryEveryCoach(options, function (err, result) {
            if (err) {
                console.log(err);
                model.messages = err;
                // res.render('meeting-invite/index', model);
                res.send(model);
            } else {
                // debugger;
                // console.dir(result);
                model.data = model.data || {};
                //model.data.view = "MeetingInvite"
                model.data.coaches = JSON.parse(JSON.stringify(result));

                //res.render("admin/meeting-invite/index", model);
            }
        })
        options = {
            role: 'student'
        };
        userLib.queryEveryStudent(options, function (err, result) {

            if (err) {
                console.log(err);
                model.messages = err;
                // res.render('meeting-invite/index', model);
                res.send(model);
            } else {
                // debugger;
                // console.dir(result);
                model.data = model.data || {};
                //model.data.view = "MeetingInvite"
                model.data.students = model.data.students || {};
                model.data.students = JSON.parse(JSON.stringify(result));
                model.data._id = req.session.user._id;
                res.render("admin/meeting-invite/index", model);
            }
        })


    });

    router.post('/meeting-setup', function (req, res) {
        // debugger;
        var meeting = {
            meetingdate: req.body.meetingDate,
            meetinglocation: req.body.location,
            meetinglandmark: req.body.landmark,
            meetingType: req.body.meetingType,
            meetingTopic: req.body.topic
        }

        console.log("meeting : ", meeting);

        async.parallel({
                inviteCreator: function (callback) {
                    // debugger;
                    User.findById(req.body.invitee_coach, function (err, inviteCreator) {
                        if (err) {
                            model.messages = err;
                            callback(err);
                        } else {
                            callback(null, inviteCreator);
                        }

                    })
                },
                invitee: function (callback) {

                    User.findById(req.body.invitee_student, function (err, invitee) {
                        if (err) {
                            model.messages = err;
                            callback(err);
                        } else {
                            callback(null, invitee);
                        }
                    });
                }
            },

            function (err, result) {

                if (err) {
                    model.messages = err;
                    res.render("admin/meeting-invite/index", model);
                } else {

                    // now create a meeting invite

                    var invitee = result.invitee,
                        inviteCreator = result.inviteCreator;

                    var meetingRequest = new MeetingRequest({
                        topic: meeting.meetingTopic,
                        _creator: inviteCreator._id, // assign the _id from the person
                        meetingdate: meeting.meetingdate,
                        location: meeting.meetinglocation,
                        meetingType: meeting.meetingType,
                        meetinglandmark: meeting.landmark,
                        attendees: [inviteCreator._id, invitee._id],
                    });


                    var emailList = new Array();
                    emailList.push(invitee.email);
                    emailList.push(inviteCreator.email);

                    var options = {
                        to: emailList.toString(),
                        subject: 'Coach/Student meeting - ' + meeting.meetingTopic + " on " + meeting.meetingdate, // Subject line
                        text: emailContent.createMeetingText(inviteCreator, invitee, meeting), // plaintext body
                        html: emailContent.createMeeting(inviteCreator, invitee, meeting) // html body
                    }

                    //create .ics file : https://github.com/shanebo/icalevent

                    // save the meeting invite
                    meetingRequest.save(function (err, result) {
                        if (err) {
                            return console.log(err);
                        }

                        // save the meeting in every user's profile
                        async.parallel({
                                inviteCreatorMeetingSave: function (callback) {
                                    inviteCreator.meetings.push(meetingRequest);
                                    inviteCreator.save(function (err, result) {
                                        if (err) {
                                            callback(err);
                                        } else {
                                            callback(null, result);
                                        }

                                    })
                                },
                                inviteeMeetingSave: function (callback) {
                                    invitee.meetings.push(meetingRequest);
                                    invitee.save(function (err, result) {
                                        if (err) {
                                            callback(err);
                                        } else {
                                            callback(null, result);
                                        }

                                    })
                                }
                            },

                            function (err, result) {

                                if (err) {

                                    model.messages = err;
                                    res.render("admin/meeting-invite/index", model);

                                } else {

                                    // if meeting invite was saved, now send an email
                                    email.sendEmail(options, function (err, result) {

                                        if (err) {
                                            console.log(err);
                                            model.messages = err;
                                            res.render("admin/meeting-invite/index", model);
                                        } else {
                                            // console.log(result);
                                            model.emailSent = model.emailSent || {};
                                            model.emailSent = {
                                                "inviteCreator": inviteCreator,
                                                "invited": invitee,
                                                "meeting": meeting
                                            };

                                            console.dir(model);
                                            res.render('meeting-invite/emailSent', model);
                                        }
                                    })


                                }
                            }
                        )
                    });

                }
            }
        );
    });

};