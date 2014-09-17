'use strict';


var MeetingNotesModel = require('../../models/meeting-notes'),
mongoose = require('mongoose'),   
async = require('async'),
MeetingNotes = mongoose.model("MeetingNotes"),
User = mongoose.model("User");

module.exports = function (router) {

    var model = new MeetingNotesModel();
    var userrole = '';
    var notesExists = 0;

    router.get('/', function (req, res) {

      	debugger;
        if (req.session.user._id) {
            model.data = model.data || {};
            model.data.meetingId = req.query.meetingId; 
            model.data.userId = req.session.user._id;
            //Find the role of user, if admin show all notes by all users else show only that user's notes
            User.findById(req.session.user._id, function(err, userrecresult) {
                debugger;
                if(err) {
                    callback(err);
                }
                console.log(userrecresult)
                var userrec = JSON.parse(JSON.stringify(userrecresult));
                userrole = userrec.role;
            }
            );
            
            MeetingNotes.findByUserAndMeetingId(req.session.user._id, req.query.meetingId, function (err, meetingnotesrec) {

                if (err) {
                    callback(err);

                   }
                console.log(meetingnotesrec)
                if(meetingnotesrec) {
                    model.data = model.data || {};
                    model.data.meetingnotes = model.data.meetingnotes || {};
                    model.data.meetingnotes = JSON.parse(JSON.stringify(meetingnotesrec));
                    notesExists = 1;
                }
            } 
            );
            
            if(notesExists == 1) {
                console.log(notesExists)
                res.render('meeting-notes/existing', model);   
            }
            else {
                console.log(notesExists)
                res.render('meeting-notes/index', model);
            }
        
        }
        else {
          res.redirect('/login');  
        }
        
    });

    router.get('/meeting-notes', function (req, res) {
        debugger;
        model.data = model.data || {};
        model.data.meetingId = req.query.meetingId; 

        MeetingNotes.findByUserAndMeetingId(req.session.userid, req.query.meetingId, function (err, meetingnotesrec) {

                debugger;
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
                }
               } 
              );
            
            if(model.data.interactionType) {
        
                res.render('meeting-notes/index', model);   
            }
            else {
                res.render('meeting-notes/existing', model);
            }
    });
    
    router.post('/', function (req, res) {

        debugger;
        if (req.session.user._id) {

            var meetingnotes = new MeetingNotes({
                notesBy: req.session.user._id,
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
                    res.redirect('/dashboard');
                }
             });  
             
        } else {
            res.redirect('/login');
        }    

    });

};
