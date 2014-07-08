'use strict';


var SignupModel = require('../../models/signup');


module.exports = function (router) {

    var model = new SignupModel();


    router.get('/', function (req, res) {
        
        res.render('signup/index', model);
        
    });

};
