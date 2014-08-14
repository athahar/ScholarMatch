'use strict';


var MeetingInviteModel = require('../../models/meeting-invite'),
    email = require('../../lib/email'),
    meetingLib = require('../../lib/meetinginvite'),
    mongoose = require('mongoose'),
    User = mongoose.model("User"),
    Meeting = mongoose.model("Meeting"),
    async = require('async');


module.exports = function (router) {

    var model = new MeetingInviteModel();

    router.get('/', function (req, res) {

        if (req.user.role === 'student') {
            User.linkedCoach(req.user._id, function (err, result) {
                if (err) {
                    console.log(err);
                    model.messages = err;
                    // res.render('meeting-invite/index', model);
                    res.send(model);
                } else {

                    console.dir(result);
                    model.result = JSON.parse(JSON.stringify(result));

                    // res.send(model);
                    res.render('meeting-invite/index', model);
                }
            })

        }
        if (req.user.role === 'coach') {

            User.linkedStudents(req.user._id, function (err, result) {
                if (err) {
                    console.log(err);
                    model.messages = err;
                    // res.render('meeting-invite/index', model);
                    res.send(model);
                } else {

                    model.result = JSON.parse(JSON.stringify(result));
                    console.dir(model);
                    res.render('meeting-invite/index', model);
                }
            })
        }

    });


    router.get('/all', function (req, res) {

        Meeting.findAll(function (err, result) {
            if (err) {
                console.log(err);
                model.messages = err;
                // res.render('meeting-invite/index', model);
                res.send(model);
            } else {
                console.dir(result);
                model.data = model.data || {};
                model.data.meetingDetails = JSON.parse(JSON.stringify(result));

                res.render('meeting-invite/all', model);
            }
        })

    });


    router.post('/', function (req, res) {

        var meetingType = req.body.meetingType,
            meetingType = ((meetingType === 1) ? " In Person" : " Telephonic"),
            meeting = {
                meetingdate: req.body.meetingDate,
                meetingtime: req.body.meetingTime + " (PDT) ",
                meetinglocation: req.body.location,
                meetingType: meetingType,
                meetingTopic: req.body.topic
            }

        async.parallel({
                inviteCreator: function (callback) {
                    User.findById(req.body.inviteCreator, function (err, inviteCreator) {
                        if (err) {
                            model.messages = err;
                            callback(err);
                        } else {
                            callback(null, inviteCreator);
                        }

                    })
                },
                invitee: function (callback) {

                    User.findById(req.body.invitee, function (err, invitee) {
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
                    res.render('meeting-invite/index', model)
                } else {

                    // now create a meeting invite

                    var invitee = result.invitee,
                        inviteCreator = result.inviteCreator;

                    var meetinginvite = new Meeting({
                        topic: meeting.meetingTopic,
                        _creator: inviteCreator._id, // assign the _id from the person
                        meetingdate: meeting.meetingdate,
                        location: meeting.meetinglocation,
                        attendees: [inviteCreator._id, invitee._id],
                    });


                    var emailList = new Array();
                    emailList.push(invitee.email);
                    emailList.push(inviteCreator.email);

                    var options = {
                        to: emailList.toString(),
                        subject: 'Coach/Student meeting - ' + meeting.meetingTopic + " on " + meeting.meetingdate, // Subject line
                        text: meetingLib.buildTextInvite(inviteCreator, invitee, meeting), // plaintext body
                        html: meetingLib.buildHTMLInvite(inviteCreator, invitee, meeting) // html body
                    }


                    // save the meeting invite
                    meetinginvite.save(function (err, result) {
                        if (err) {
                            return console.log(err);
                        }

                        // save the meeting in every user's profile
                        async.parallel({
                                inviteCreatorMeetingSave: function (callback) {
                                    inviteCreator.meetings.push(meetinginvite);
                                    inviteCreator.save(function (err, result) {
                                        if (err) {
                                            callback(err);
                                        } else {
                                            callback(null, result);
                                        }

                                    })
                                },
                                inviteeMeetingSave: function (callback) {
                                    invitee.meetings.push(meetinginvite);
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
                                    res.render('meeting-invite/index', model)

                                } else {

                                    // if meeting invite was saved, now send an email
                                    email.sendEmail(options, function (err, result) {

                                        if (err) {
                                            console.log(err);
                                            model.messages = err;
                                            res.render('meeting-invite/index', model);
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