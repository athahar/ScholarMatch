'use strict';


var MeetingNotesModel = require('../../models/meeting-notes'),
mongoose = require('mongoose'),   
async = require('async'),
MeetingNotes = mongoose.model("MeetingNotes"),
Meeting = mongoose.model("Meeting"),
User = mongoose.model("User");

module.exports = function (router) {

    var model = new MeetingNotesModel();
    var userrole = '';
    var notesExists = 0;

    router.get('/meeting-notes', function (req, res) {
        // debugger;
        model.data = model.data || {};
        model.data.meetingId = req.query.meetingId; 

        MeetingNotes.findByUserAndMeetingId(req.session.userid, req.query.meetingId, function (err, meetingnotesrec) {

                // debugger;
                if (err) {
                    callback(err);

                }
                meetingnotesrec = meetingnotesrec[0].toJSON();
                if(meetingnotesrec) {
                    model.data._id = meetingnotesrec._id;
                    model.data.interactionType = meetingnotesrec.interactionType;
                    model.data.materialUsefulness = meetingnotesrec.materialUsefulness;
                    model.data.topicAppropriateness = meetingnotesrec.topicAppropriateness;
                    model.data.collaborationDescription = meetingnotesrec.collaborationDescription;
                    model.data.nextCollaborationDescription = meetingnotesrec.nextCollaborationDescription;
                    model.data.participationSentiment = meetingnotesrec.participationSentiment;
                    model.data.speakWithStaff = meetingnotesrec.speakWithStaff; 
                
                    res.render('meeting-notes/index', model);   
                }
                else {
                    res.render('meeting-notes/existing', model);
                }
            }); 
     
    });


    router.get('/', function (req, res) {
      	
        if (req.session.user._id) {
            model.data = model.data || {};
            model.data.meetingId = req.query.meetingId; 
            model.data.userId = req.session.user._id;
            

            Meeting.findById(req.query.meetingId, function( err, meetingRec) {
                debugger;
 
                if(err) {
                    console.log('Error looking up meeting record');
                    callback(err);
                }
 
                if(meetingRec) {
                    model.data.meetingrec = model.data.meetingRec || {};
                    model.data.meetingrec = JSON.parse(JSON.stringify(meetingRec));
                    for(var i = 0; i < model.data.meetingrec.attendees.length; i++){
                        if(model.data.meetingrec.attendees[i]._id === req.session.user._id) {
                            model.data.meetingrec.notescreator = model.data.meetingrec.attendees[i].fullName;
                        }
                        else {
                            model.data.meetingrec.attendee = model.data.meetingrec.attendees[i].fullName;
                        }
                    }
                    console.log(model.data.meetingrec);

                    MeetingNotes.findByUserAndMeetingId(req.session.user._id, req.query.meetingId, function (err, meetingnotesrec) {

                       if (err) {
                        console.log('Error looking up meeting notes');
                        callback(err);

                        }

                        model.data = model.data || {};
                        model.data.meetingnotes = model.data.meetingnotes || {};

                        // console.log(meetingnotesrec)
                        if(meetingnotesrec) {
                            model.data.meetingnotes = JSON.parse(JSON.stringify(meetingnotesrec));
                   
                            console.log('note exists')
                            //res.render('meeting-notes/existing', model);   

                            res.render('meeting-notes/index', model);
                        }
                        else {
                            //debugger;
                            console.log('new note');
                            //Find the meeting by id
                            res.render('meeting-notes/index', model);
                        }
                    });                
                }
            }); 
        }
        else {
          res.redirect('/login');  
        }
        
    });

    router.post('/', function (req, res) {

        debugger;
        if (req.session.user._id) {

            var meetingnotes = new MeetingNotes({
                notesBy: req.session.user._id,
                notesCreator: req.body.notesCreator,
                attendee: req.body.attendee, 
                meetingId: req.body.meetingId,
                interactionType: req.body.interactionType,
                materialUsefulness: req.body.materialUsefulness,
                timeUtilization: req.body.timeUtilization,
                topicAppropriateness: req.body.topicAppropriateness,
                collaborationDescription: req.body.collaborationDescription,
                nextCollaborationDescription: req.body.nextCollaborationDescription,
                participationSentiment: req.body.participationSentiment,
                speakWithStaff: req.body.speakWithStaff
            });

             // save the meeting notes
            meetingnotes.save(function (err, result) {
                if (err) {
                    model.messages = err;
                    res.redirect('/dashboard');
                } else {
                    model.messages = 'Meeting notes Updated';
                    res.render('meeting-notes/success');
                }
             });  
             
        } else {
            res.redirect('/login');
        }    

    });

};
