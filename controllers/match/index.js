'use strict';


var MatchModel = require('../../models/match');
var userLib = require('../../lib/user')();
var auth = require('../../lib/auth');
var async = require('async');
var relationship = require('../../lib/matchRequest')();
var emailContent = require('../../lib/emailContent');
var email = require('../../lib/email');
var mongoose = require('mongoose');
var Industry = mongoose.model("Industry");

module.exports = function (router) {

    var model = new MatchModel();
    model.viewName = 'match';

    router.get('/', auth.isAuthenticated('coach'), function (req, res) {
        model.messages = ''; //clear msgs
        model.data = model.data || {};
        model.data.industry = model.data.industry || {};

        Industry.findAll(function(err, result){
            if(err) {
                console.log('error in reading the industries from DB');
            }
            else
            {
                console.log(result);
                model.data.industry = JSON.parse(JSON.stringify(result));
            }
        })

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
        options.industry = req.body.industry;

        model.messages = ''; //clear msgs

        userLib.queryMatchingAlgorithm(options, function (err, result) {

            model.data = model.data || {};
            if (err) {

                model.data.industry = model.data.industry || {};

                Industry.findAll(function(err, result){
                    if(err) {
                        console.log('error in reading the industries from DB');
                    }
                    else
                    {
                        console.log(result);
                        model.data.industry = JSON.parse(JSON.stringify(result));
                    } 
                })               

                model.messages = err;
                res.render('match/index', model)
            } else {

                // model.messages = 'sucessfully connected';
                model.data.results = JSON.parse(JSON.stringify(result));
                model.data.count = result.length;

                res.render('match/results', model);
            }

        })

        // res.render('match/index', model);
    });


    router.get('/search', function (req, res) {
        model.messages = ''; //clear msgs

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

    router.get('/findcoach', function (req, res) {

        model.messages = ''; //clear msgs
        var options = {};

        options.role = "coach";

        userLib.queryAllCoaches(options, function(err, result) {
        //userLib.queryAllUsers(options, function (err, result) {

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

        model.messages = ''; //clear msgs
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
        model.messages = ''; //clear msgs

        var studentId = req.query.studentId;
        var coachId = req.query.coachId;

        relationship.requestConnection(studentId, coachId, function (err, result) {

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

        relationship.showConnectionPending(function (err, result) {

            if (err) {
                model.messages = err;
                res.render('match/index', model)
            } else {

                // debugger;
                model.data = model.data || {};
                console.dir(result);
                model.data.result = JSON.parse(JSON.stringify(result));

                //TODO: response handling shoudl be better

                res.render('match/pending', model);
            }

        })

    });

    router.get('/pendingOrientation', function (req, res) {

        model.messages = null;

        relationship.showOrientationPending(function (err, result) {

            if (err) {
                model.messages = err;
                res.render('match/index', model)
            } else {

                // debugger;
                model.data = model.data || {};
                console.dir(result);
                model.data.result = JSON.parse(JSON.stringify(result));

                //TODO: response handling shoudl be better

                res.render('match/orientationPending', model);
            }

        })

    });



    router.get('/setupOrientation', function (req, res) {

        // debugger;
        model.messages = null;

        var relationshipId = req.query.relationshipId;
        var meetingDate = req.query.meetingDate;

        var student = {
                name: req.query.studentName,
                email: req.query.studentEmail,
            },
            coach = {
                name: req.query.coachName,
                email: req.query.coachEmail,
            };

        relationship.setupOrientation(relationshipId, function (err, result) {

            // debugger;
            if (err) {
                model.messages = err;
                res.render('match/orientationPending', model)
            } else {

                var emailList = new Array();
                emailList.push(student.email);
                emailList.push(coach.email);

                var options = {
                    to: emailList.toString(),
                    subject: 'Coach/Student - Your orientation meeting', // Subject line
                    // text: emailContent.orientationMeetingText(student, coach), // plaintext body
                    html: emailContent.orientationMeeting(student, coach, meetingDate) // html body
                }


                // users were succesfully connected, now send an email
                email.sendEmail(options, function (err, result) {
                    // debugger;
                    if (err) {
                        console.log(err);
                        model.messages = err;
                        res.render('errors/500', model);
                    } else {

                        console.dir(model);
                        // model.messages = 'sucessfully connected';
                        model.data = model.data || {};
                        model.data.result = JSON.parse(JSON.stringify(result));

                        //TODO: response handling shoudl be better
                        // AJAX call - hence send a JSON response.
                        res.send('match/orientationPending', model);
                        // res.render('meeting-invite/emailSent', model);
                    }
                })


            }
        });


    })

    router.get('/orientationInProgress', function (req, res) {

        model.messages = null;

        relationship.showOrientationProgress(function (err, result) {

            if (err) {
                model.messages = err;
                res.render('match/index', model)
            } else {

                // debugger;
                model.data = model.data || {};
                console.dir(result);
                model.data.result = JSON.parse(JSON.stringify(result));

                //TODO: response handling shoudl be better

                res.render('match/orientationProgress', model);
            }

        })

    })

    router.get('/completeOrientation', function (req, res) {

        // debugger;
        model.messages = null;
        var relationshipId = req.query.relationshipId;

        relationship.completeOrientation(relationshipId, function (err, result) {

            if (err) {
                model.messages = err;
                res.render('match/orientationProgress', model)
            } else {

                // debugger;
                model.data = model.data || {};
                console.dir(result);
                model.data.result = JSON.parse(JSON.stringify(result));

                //TODO: response handling shoudl be better

                // res.render('admin', model);
                res.redirect('/admin')
            }

        })

    })
    router.get('/approve', function (req, res) {

        // FIXME : get the params dynamically from the UI  & change the GET /connect to POST / connect

        var studentId = req.query.studentId;
        var coachId = req.query.coachId;
        var relationshipId = req.query.relationshipId;

        // debugger;
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

                    relationship.approveConnection(relationshipId, function (err, result) {
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
                    // debugger;

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



    /**
     * Manually search and connect
     * @param  {[type]} req [description]
     * @param  {[type]} res [description]
     * @return {[type]}     [description]
     */
    router.get('/manualconnection', function (req, res) {

        async.parallel({
                coaches: function (callback) {

                    var options = {};

                    options.role = "coach";
                    userLib.queryAllUsers(options, function (err, result) {
                        // debugger;
                        if (err) {
                            model.messages = err;
                            callback(err);
                        } else {
                            callback(null, result);
                        }
                    })
                },
                students: function (callback) {

                    var options = {};

                    options.role = "student";
                    userLib.queryAllUsers(options, function (err, result) {
                        // debugger;
                        if (err) {
                            model.messages = err;
                            callback(err);
                        } else {
                            callback(null, result);
                        }
                    })

                }
            },
            function (err, results) {

                if (err) {
                    model.messages = err;
                    // res.render('meeting-invite/index', model)
                } else {

                    model.data = model.data || {};
                    // model.data.results = JSON.stringify(results);
                    model.data.results = JSON.parse(JSON.stringify(results));

                    // console.log(model.data.results);

                    res.render('match/manualconnection', model);
                }
            }
        )
    });


    router.post('/manualconnection', function (req, res) {
        model.messages = ''; //clear msgs

        debugger;
        var studentId = req.body.student;
        var coachId = req.body.coach;

        relationship.requestConnection(studentId, coachId, function (err, result) {

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


}