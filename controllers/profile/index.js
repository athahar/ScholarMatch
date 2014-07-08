'use strict';


var ProfileModel = require('../../models/profile');


module.exports = function (router) {

    var model = new ProfileModel();


    router.get('/', function (req, res) {
        
        res.render('profile/index', model);
        
    });

};
