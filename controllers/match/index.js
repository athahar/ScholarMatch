'use strict';


var MatchModel = require('../../models/match');
var userLib = require('../../lib/user')();
var auth = require('../../lib/auth');
var async = require('async');
var matchRequest = require('../../lib/matchRequest')();
var emailContent = require('../../lib/emailContent');
var email = require('../../lib/email');

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
        options.college = req.body.college;
        options.gender = req.body.gender;
        options.role = req.body.role || 'coach';

        model.messages = ''; //clear msgs

        userLib.queryMatchingAlgorithm(options, function (err, result) {

            if (err) {
                model.messages = err;
                res.render('match/index', model)
            } else {

                // model.messages = 'sucessfully connected';
                model.data = model.data || {};
                model.data.results = JSON.parse(JSON.stringify(result));
                model.data.count = result.length;

                res.render('match/results', model);
            }

        })

        // res.render('match/index', model);
    });

    router.get('/findcoach', function (req, res) {

        var options = {};

        options.role = "coach";

        userLib.queryAllUsers(options, function (err, result) {

            if (!err) {
                model.data = model.data || {};
                model.data.results = JSON.parse(JSON.stringify(result));
                model.data.count = result.length;
                // console.dir(model);
                res.render('match/results', model);
            } else {
                res.send(err);
            }

        })
    })
    router.get('/findstudent', function (req, res) {

        var options = {};

        options.role = "student";

        userLib.queryAllUsers(options, function (err, result) {
            model.data = model.data || {};
            model.data.results = JSON.parse(JSON.stringify(result));
            model.data.count = result.length;
            // console.dir(model);
            res.render('match/results', model);
        })
    })



    router.get('/connect', function (req, res) {

        var studentId = req.query.studentId;
        var coachId = req.query.coachId;

        matchRequest.requestConnection(studentId, coachId, function (err, result) {

            if (err) {
                model.messages = err;
                res.render('match/index', model)
            } else {
                model.messages = 'Requested for getting connected';
                model.data = model.data || {};
                model.data.result = JSON.parse(JSON.stringify(result));

                //TODO: response handling shoudl be better

                res.render('match/success', model);
            }

        })

    })

    router.get('/pending', function (req, res) {

        model.messages = null;

        matchRequest.showPendingConnections(function (err, result) {

            if (err) {
                model.messages = err;
                res.render('match/index', model)
            } else {

                debugger;
                model.data = model.data || {};
                console.dir(result);
                model.data.result = JSON.parse(JSON.stringify(result));

                //TODO: response handling shoudl be better

                res.render('match/pending', model);
            }

        })

    })

    router.get('/approve', function (req, res) {

        // FIXME : get the params dynamically from the UI  & change the GET /connect to POST / connect

        var studentId = req.query.studentId;
        var coachId = req.query.coachId;
        var matchingRequestId = req.query.matchRequest;

        debugger;
        async.parallel({

                connectStudentWithCoach: function (callback) {
                    userLib.connectStudentWithCoach(studentId, coachId, function (err, result) {
                        if (err) {
                            model.messages = err;
                            callback(err);
                        } else {
                            callback(null, result);
                        }

                    })
                },
                connectCoachWithStudent: function (callback) {

                    userLib.connectCoachWithStudent(studentId, coachId, function (err, result) {
                        if (err) {
                            model.messages = err;
                            callback(err);
                        } else {
                            callback(null, result);
                        }
                    });
                },
                approveConnection: function (callback) {

                    matchRequest.approveConnection(matchingRequestId, function (err, result) {
                        if (err) {
                            model.messages = err;
                            callback(err);
                        } else {
                            callback(null, result);
                        }
                    });
                }
            },
            function (err, result) {


                if (err) {
                    model.messages = err;
                    res.render('match/index', model)
                } else {

                    console.dir(result.approveConnection);
                    debugger;

                    var student = result.approveConnection.student,
                        coach = result.approveConnection.coach;


                    var emailList = new Array();
                    emailList.push(student.email);
                    emailList.push(coach.email);

                    var options = {
                        to: emailList.toString(),
                        subject: 'Coach/Student - You are connected', // Subject line
                        text: emailContent.matchSuccessText(student, coach), // plaintext body
                        html: emailContent.matchSuccess(student, coach) // html body
                    }


                    // users were succesfully connected, now send an email
                    email.sendEmail(options, function (err, result) {

                        if (err) {
                            console.log(err);
                            model.messages = err;
                            res.render('errors/500', model);
                        } else {

                            console.dir(model);
                            model.messages = 'sucessfully connected';
                            model.data = model.data || {};
                            model.data.result = JSON.parse(JSON.stringify(result));

                            //TODO: response handling shoudl be better

                            res.render('match/approved', model);
                            // res.render('meeting-invite/emailSent', model);
                        }
                    })


                }
            }
        );

    })
};