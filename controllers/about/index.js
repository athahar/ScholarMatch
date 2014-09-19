'use strict';

var ContactModel = require('../../models/about');

module.exports = function (router) {

    var model = new ContactModel();
    model.viewName = 'about';

    router.get('/', function (req, res) {

        res.render('about/index', model);

    });

};