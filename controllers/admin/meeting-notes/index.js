'use strict';


var MeetingNotesModel = require('../../../models/meeting-notes'),
mongoose = require('mongoose'),   
async = require('async'),
MeetingNotes = mongoose.model("MeetingNotes"),
User = mongoose.model("User");

module.exports = function (router) {

    var model = new MeetingNotesModel();
    var userrole = '';
    var notesExists = 0;

    router.get('/', function (req, res) {

        if (req.session.user._id) {
            model.data = model.data || {};
            model.data.meetingId = req.query.meetingId; 
            model.data.userId = req.session.user._id;
            
            MeetingNotes.findAllByMeetingId(req.query.meetingId, function (err, meetingnotesrec) {
            	debugger;
                if (err) {
                    console.log('Error looking up meeting notes');
                    callback(err);

                   }
                console.log(meetingnotesrec)
                if(meetingnotesrec) {
                    model.data = model.data || {};
                    model.data.meetingnotes = model.data.meetingnotes || {};
                    model.data.meetingnotes = JSON.parse(JSON.stringify(meetingnotesrec));
                    for(var i=0; i < model.data.meetingnotes.length; i++) {
            			if(model.data.meetingnotes[i].notesBy.role == 'coach') {
            				model.data.coach = {};
            				model.data.coach.notesWriter = model.data.meetingnotes[i].notesBy.fullName;
            				model.data.coach.interactionType = model.data.meetingnotes[i].interactionType;
            				model.data.coach.materialUsefulness = model.data.meetingnotes[i].materialUsefulness;
            				model.data.coach.topicAppropriateness = model.data.meetingnotes[i].topicAppropriateness;
            				model.data.coach.timeUtilization = model.data.meetingnotes[i].timeUtilization;
            				model.data.coach.collaborationDescription = model.data.meetingnotes[i].collaborationDescription;
            				model.data.coach.nextCollaborationDescription = model.data.meetingnotes[i].nextCollaborationDescription;
            				model.data.coach.participationSentiment = model.data.meetingnotes[i].participationSentiment;
            				model.data.coach.speakWithStaff = model.data.meetingnotes[i].speakWithStaff;

            			}
            			else if(model.data.meetingnotes[i].notesBy.role == 'student') {
            				model.data.student.notesWriter = model.data.meetingnotes[i].notesBy.fullName;
            				model.data.student.interactionType = model.data.meetingnotes[i].interactionType;
            				model.data.student.materialUsefulness = model.data.meetingnotes[i].materialUsefulness;
            				model.data.student.topicAppropriateness = model.data.meetingnotes[i].topicAppropriateness;
            				model.data.student.timeUtilization = model.data.meetingnotes[i].timeUtilization;
            				model.data.student.collaborationDescription = model.data.meetingnotes[i].collaborationDescription;
            				model.data.student.nextCollaborationDescription = model.data.meetingnotes[i].nextCollaborationDescription;
            				model.data.student.participationSentiment = model.data.meetingnotes[i].participationSentiment;
            				model.data.student.speakWithStaff = model.data.meetingnotes[i].speakWithStaff;
						}
            		}
                	console.log('note exists')
                	res.render('admin/meeting-notes/existing', model);   
            	}
            	else {
                	console.log('new note')
                	res.redirect('/dashboard');
            	}
            });	

        
        }
        else {
          res.redirect('/login');  
        }
        
    });
}