'use strict';


var MeetingNotesModel = require('../../models/meeting-notes');


module.exports = function (router) {

    var model = new MeetingNotesModel();


    router.get('/', function (req, res) {
    	if(req.body.meetingId!== null){
    		res.render('meeting-notes/existing', model);	
    	}else{
    		res.render('meeting-notes/index', model);	
    	}
        
    });
     
};
