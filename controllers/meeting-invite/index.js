'use strict';


var MeetingInviteModel = require('../../models/meeting-invite');


module.exports = function (router) {

    var model = new MeetingInviteModel();


    router.get('/', function (req, res) {
        
        res.render('meeting-invite/index', model);
        
    });

};
