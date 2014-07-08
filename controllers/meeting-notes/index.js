'use strict';


var MeetingNotesModel = require('../../models/meeting-notes');


module.exports = function (router) {

    var model = new MeetingNotesModel();


    router.get('/', function (req, res) {
        
        res.render('meeting-notes/index', model);
        
    });

};
