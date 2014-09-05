'use strict';


var MeetingNotesModel = require('../../models/meeting-notes');


module.exports = function (router) {

    var model = new MeetingNotesModel();
    model.viewName = 'meetingNotes';

    router.get('/', function (req, res) {
        if (req.body.meetingId !== null) {
            res.render('meeting-notes/existing', model);
        } else {
            res.render('meeting-notes/index', model);
        }

    });

    // good example for joins
    // http://luiselizondo.net/blogs/luis-elizondo/joins-mongodb-mongoose-and-nodejs
    // https://coderwall.com/p/6v5rcw
};