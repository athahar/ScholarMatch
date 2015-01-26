'use strict';


var Meetings = require('../../models/meetings'),
mongoose = require('mongoose'),   
async = require('async'),
Meeting = mongoose.model("Meeting"),
email = require('../../lib/email'),
emailContent = require('../../lib/emailContent'),
User = mongoose.model("User");

module.exports = function (router) {

    var model = new Meetings();
    var userrole = '';
    var notesExists = 0;

    router.get('/cancel', function (req, res) {

         //debugger;
        if (req.session.user._id) {
            model.data = model.data || {};
            model.data.meetingId = req.query.meetingId; 
            model.data.userId = req.session.user._id;
            
            Meeting.findById(req.query.meetingId, function (err, meetingrec) {
                //debugger;
                if (err) {
                    console.log('Error looking up meeting notes');
                    callback(err);

                   }
                // console.log(meetingrec)
                if(meetingrec) {
                    //debugger;
                    model.data = model.data || {};
                    model.data.meeting = model.data.meeting || {};
                    model.data.meeting = JSON.parse(JSON.stringify(meetingrec));
                }
                //Send cancellation notice
                //debugger;
                var emailList = new Array();
                for(var i = 0; i < model.data.meeting.attendees.length ; i++){
                    emailList.push(model.data.meeting.attendees[i].email);
                    User.removeMeetingFromSchemaById(model.data.meeting.attendees[i]._id, req.query.meetingId, function(err) {
                        if(err) {
                            console.log("Error removing meeting from user");
                            res.redirect('/dashboard'); 
                        }
                    });
                }
                //Remove meeting from db
                Meeting.removeMeetingById(req.query.meetingId, function(err) {
                    if(err) {
                        console.log("error removing meeting from meeting schema");
                        res.redirect('/dashboard'); 
                    }

                });
                var sub = 'Coach/Student meeting - ' + model.data.meeting.topic + " on " + model.data.meeting.meetingdate + " cancellation notice"; // Subject line
                var txt =  emailContent.createMeetingCancelledText(model.data.meeting);
                var htmlContent = emailContent.createMeetingCancelled(model.data.meeting);
                var options = {
                    to: emailList.toString(),
                    subject: sub,
                    text: txt, // plaintext body
                    html: htmlContent // html body
                }
                email.sendEmail(options, function (err, result) {

                            if (err) {
                                console.log(err);
                                model.messages = err;
                                res.redirect('/dashboard');
                            } else {
                                // console.log(result);
                                model.emailSent = model.emailSent || {};
                                model.emailSent = {
                                    "meetingParticipants": emailList
                                };

                                console.dir(model);
                                res.render('meeting-cancelled/emailSent', model);
                           }
            })
        }); 
                
        }
        else {
          res.redirect('/login');  
        }
        
    });

    router.get('/edit', function (req, res) {

         //debugger;
        if (req.session.user._id) {
            model.data = model.data || {};
            model.data.meetingId = req.query.meetingId; 
            model.data.userId = req.session.user._id;
            
            Meeting.findById(req.query.meetingId, function (err, meetingrec) {
                //debugger;
                if (err) {
                    console.log('Error looking up meeting');
                    callback(err);

                   }
                // console.log(meetingrec)
                if(meetingrec) {
                    //debugger;
                    model.data = model.data || {};
                    model.data.meeting = model.data.meeting || {};
                    model.data.meeting = JSON.parse(JSON.stringify(meetingrec));
                    //Topic
                    if(model.data.meeting.topic === 'Resume & Linked In profile creation') {
                        model.data.meeting.resume = true;
                    }
                    else if(model.data.meeting.topic === 'Mock Interview') {
                        model.data.meeting.interview = true;
                    }
                    else if(model.data.meeting.topic === 'Office Visit') {
                        model.data.meeting.visit = true;
                    }
                    else if(model.data.meeting.topic === 'Insider Scoop') {
                        model.data.meeting.scoop = true;
                    }
                    else if(model.data.meeting.topic === 'Internship or Job Search') {
                        model.data.meeting.internship = true;
                    }
                    else if(model.data.meeting.topic === 'Professional Etiquette') {
                        model.data.meeting.etiquette = true;
                    }
                    else if(model.data.meeting.topic === 'Other') {
                        model.data.meeting.other = true;
                    }
                    
                    //Type
                    if(model.data.meeting.meetingtype === 'In Person') {
                        model.data.meeting.inperson = true;
                    }
                    else if(model.data.meeting.meetingtype === 'Telephone') {
                        model.data.meeting.telephone = true;
                    }
                    else if(model.data.meeting.meetingtype === 'Video Call') {
                        model.data.meeting.video = true;
                    }  
                    console.log("date " + model.data.meeting.meetingdate); 
                    res.render("meeting-invite/editmeeting", model);
                }    
            });    
        }
          
    });           

    /*router.post('/edit', function (req, res) {

         //debugger;
        if (req.session.user._id) {
            var meeting = {
            meetingdate: req.body.meetingDate,
            meetinglocation: req.body.location,
            meetinglandmark: req.body.landmark,
            meetingType: req.body.meetingType,
            meetingTopic: req.body.topic,
            otherTopic: req.body.otherTopic
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
                        //debugger;
                    if(meeting.meetingTopic === 'Other') {
                        meeting.meetingTopic = meeting.otherTopic;
                    }    

                   


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

                    // save the meeting invite  id, time, topic, type, location, landmark,
                    Meeting.updateMeeting(req.body.meetingid, meeting.meetingdate, meeting.meetingTopic, meeting.meetingType, meeting.meetinglocation, meeting.landmark, function (err, result) {
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
};*/


    router.post('/editmeeting', function (req, res) {

        var meeting = {
            meetingdate: req.body.meetingDate,
            meetinglocation: req.body.location,
            meetinglandmark: req.body.landmark,
            meetingType: req.body.meetingType,
            meetingTopic: req.body.topic,
            otherTopic: req.body.otherTopic
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
                        //debugger;
                    if(meeting.meetingTopic === 'Other') {
                        meeting.meetingTopic = meeting.otherTopic;
                    }    

                    var meetingRequest = new MeetingRequest({
                        topic: meeting.meetingTopic,
                        _creator: inviteCreator._id, // assign the _id from the person
                        meetingdate: meeting.meetingdate,
                        location: meeting.meetinglocation,
                        meetingtype: meeting.meetingType,
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
                    Meeting.updateMeeting(req.body.meetingid, meeting.meetingdate, meeting.meetingTopic, meeting.meetingType, meeting.meetinglocation, meeting.landmark, function (err, result) {
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








