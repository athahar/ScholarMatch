'use strict';


var MeetingInviteModel = require('../../models/meeting-invite'),
    email = require('../../lib/email'),
    emailContent = require('../../lib/emailContent'),
    mongoose = require('mongoose'),
    User = mongoose.model("User"),
    MeetingRequest = mongoose.model("Meeting"),
    async = require('async');


module.exports = function (router) {

    var model = new MeetingInviteModel();
    model.viewName = 'meetingInvite';
    model.data = model.data || {};

    /**
     * Show the meeting setup page
     * @param  {[type]} req
     * @param  {[type]} res
     * @return {[type]}
     */
    router.get('/', function (req, res) {

        if (req.user.role === 'student') {
            User.linkedCoach(req.user._id, function (err, result) {
                if (err) {
                    console.log(err);
                    model.messages = err;
                    // res.render('meeting-invite/index', model);
                    res.send(model);
                } else {

                    // console.dir(result);
                    model.data.viewName = "MeetingInvite"
                    model.data.result = JSON.parse(JSON.stringify(result));

                    // res.send(model);
                    res.render("meeting-invite/index", model);
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
                    // console.dir(result);
                    model.data.view = "MeetingInvite"
                    model.data.result = JSON.parse(JSON.stringify(result));

                    res.render("meeting-invite/index", model);
                }
            })
        }

    });

    /**
     * Create a meeting request
     * @param  {[type]} req
     * @param  {[type]} res
     * @return {[type]}
     */
    router.post('/', function (req, res) {

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

                                            // console.dir(model);
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