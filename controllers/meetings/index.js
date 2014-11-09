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
}
