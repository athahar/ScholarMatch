'use strict';


var MeetingNotesModel = require('../../models/meeting-notes'),
mongoose = require('mongoose'),   
async = require('async'),
MeetingNotes = mongoose.model("MeetingNotes");


module.exports = function (router) {

    var model = new MeetingNotesModel();

    router.get('/', function (req, res) {

      	debugger;
        if (req.user._id) {
            model.data = model.data || {};
            model.data.meetingId = req.query.meetingId; 
            model.data.userId = req.user._id;
            MeetingNotes.findByUserAndMeetingId(req.user._id, req.query.meetingId, function (err, meetingnotesrec) {

                // console.log('111aaa');
                if (err) {
                    callback(err);

                }
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
        
                res.render('meeting-notes/existing', model);   
            }
            else {
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

                // console.log('111aaa');
                if (err) {
                    callback(err);

                }
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
                materialUsefulness: req.body.materialUsefulness, // assign the _id from the person
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
                    // model.messages.status = 'error';  - Need to add this later
                    res.render('profile/index', model);
                } else {
                    // console.log('result '  + result);
                    // model.messages.status = 'success';
                    model.messages = 'Meeting notes Updated';
                    res.render('profile/index', model);
                }
             });  
             //TODO: update the meeting schema too? 
            /*model.data = model.data || {};
            model.data.interactionType = model.data.interactionType || {}
            model.data.materialUsefulness = req.body.materialUsefulness;
            model.data.topicAppropriateness = req.body.topicAppropriateness;
            model.data.collaborationDescription = req.body.collaborationDescription;
            model.data.nextCollaborationDescription = req.body.nextCollaborationDescription;
            model.data.participationSentiment = req.body.participationSentiment;
            model.data.speakWithStaff = req.body.speakWithStaff;*/

            // console.dir(model.data.userDetails);

            /*meetingNotesLib.addMeetingNotes(model.data.meeting-notes, function (err, result) {

                if (err) {
                    model.messages = err;
                    // model.messages.status = 'error';  - Need to add this later
                    res.render('profile/index', model);
                } else {
                    // console.log('result '  + result);
                    // model.messages.status = 'success';
                    model.messages = 'Meeting notes Updated';
                    res.render('profile/index', model);
                }

            });*/
        } else {
            res.redirect('/login');
        }    

    });

    // good example for joins
    // http://luiselizondo.net/blogs/luis-elizondo/joins-mongodb-mongoose-and-nodejs
    // https://coderwall.com/p/6v5rcw
};
