'use strict';


var MatchModel = require('../../models/match');
var userLib = require('../../lib/user')();
var auth = require('../../lib/auth');
var async = require('async');


module.exports = function (router) {

    var model = new MatchModel();


    router.get('/', auth.isAuthenticated('coach'), function (req, res) {
        model.messages = ''; //clear msgs
        res.render('match/index', model);
    });

    router.post('/', function (req, res) {


        var options = {};
        
        options.fullName = req.body.fullName;        
        options.industry = req.body.industry;
        options.city = req.body.city;
        options.role = req.body.role;


        userLib.queryAllUsers(options, function(err, result){

             if(err){
                 model.messages = err;             
                res.render('match/index', model)
            }else{

                // model.messages = 'sucessfully connected';
                model.data = model.data || {};
                model.data.results = JSON.parse(JSON.stringify(result));
                
                res.render('match/results', model);
            }
            
        })
        
        // res.render('match/index', model);
    });

    router.get('/findcoach', function(req, res){
        
        var options = {};

        options.role = "coach";

         userLib.findAllUsers(options, function(err, result){
            model.result = JSON.parse(JSON.stringify(result));
            console.dir(model);
            res.render('match/index', model);
        })
    })
    router.get('/findstudent', function(req, res){
        
        var options = {};

        options.role = "student";

         userLib.findAllUsers(options, function(err, result){
            model.result = JSON.parse(JSON.stringify(result));
            console.dir(model);
            res.render('match/index', model);
        })
    })

    router.get('/connect', function(req, res){

        // FIXME : get the params dynamically from the UI  & change the GET /connect to POST / connect

        var studentid = req.body.studentid || '53d58729ff1102000050c0f1';
        var coachid = req.body.coachid || '53d587742a4069000042a0bc';

        async.parallel([
            function(callback){
                userLib.connectStudentWithCoach(studentid, coachid, function(err, result){
                    if(err){
                        model.messages = err;             
                        callback(err);
                    }else{
                       callback(null, result);
                   }

                })  
            }, 
            function(callback){

                userLib.connectCoachWithStudent(studentid, coachid, function(err, result){
                    if(err){
                        model.messages = err;             
                        callback(err);
                    }else{
                       callback(null, result);
                   }
                });  
            }],
            function (err, result) {


                if(err){
                     model.messages = err;             
                    res.render('match/index', model)
                }else{

                    model.messages = 'sucessfully connected';
                    model.data = JSON.stringify(result);;             
                    
                    //TODO: response handling shoudl be better

                    res.render('match/success', model);
                }
            }
        );
        
    })
};
