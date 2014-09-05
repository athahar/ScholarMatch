'use strict';


var CoachingHelpModel = require('../../models/coaching-help');


module.exports = function (router) {

    var model = new CoachingHelpModel();
    model.viewName = 'coachingHelp';

    router.get('/', function (req, res) {

        res.render('coaching-help/index', model);

    });

};