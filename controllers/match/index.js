'use strict';


var MatchModel = require('../../models/match');
var userLib = require('../../lib/user')();
var auth = require('../../lib/auth');


module.exports = function (router) {

    var model = new MatchModel();


    router.get('/', auth.isAuthenticated('coach'), function (req, res) {
        
        res.render('match/index', model);
    });

    router.post('/', function (req, res) {


        var options = {};
        
        options.fullName = req.body.fullName;        
        options.industry = req.body.industry;
        options.city = req.body.city;

        userLib.findAllUsers(options, function(err, result){
            model.result = result;
            console.dir(model);
            res.render('match/index', model);
        })
        
        // res.render('match/index', model);
    });

};
