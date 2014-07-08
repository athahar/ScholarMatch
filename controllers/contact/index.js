'use strict';


var ContactModel = require('../../models/contact');


module.exports = function (router) {

    var model = new ContactModel();


    router.get('/', function (req, res) {
        
        res.render('contact/index', model);
        
    });

};
