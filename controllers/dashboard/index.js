'use strict';


var DashboardModel = require('../../models/dashboard'),
    mongoose = require('mongoose'),
    User = mongoose.model("User"),
    Relationship = mongoose.model("Relationship"),
    Meeting = mongoose.model("Meeting"),
    Industry = mongoose.model("Industry"),
    moment = require('moment'),
    async = require("async");

module.exports = function (router) {

    var model = new DashboardModel();


    router.get('/', function (req, res) {

        var view = 'dashboard/index';


        model.data = model.data || {};
        // model.data.user = req.user;
        // console.log(req.user);
        // debugger;
        model.data.user = JSON.parse(JSON.stringify(req.user));
        model.data.industry = model.data.industry || {};
        model.data.meetings = model.data.meetings || {};
        model.viewName = 'dashboard';


        if (req.user.role === 'student') {
            view = 'dashboard/student';

            Industry.findAll(function(err, result){
                if(err) {
                    console.log('error in reading the industries from DB');
                }
                else
                {
                    // console.log(result);
                    model.data.industry = JSON.parse(JSON.stringify(result));
                }
            })

            if (req.user.coachesLinked && (req.user.coachesLinked.length > 0)) {
                User.linkedCoach(req.session.user._id ,function (error, linkresult) {
                     debugger;
                     if (error) {
                        console.log('error')
                        res.render(view, model);
                    } else {
                        model.data.coachInfo  = JSON.parse(JSON.stringify(linkresult));
                            model.data.isStudent = "true";
                            model.data.coachName = model.data.coachInfo.coachesLinked[0].fullName;
                    }
                       
                
                if (req.user.meetings && (req.user.meetings.length > 0)) {

                User.findByIdAndMeetings(req.session.user._id, function (err, result) {
                    if (err) {
                        console.log('error')
                        // res.send(err);
                        res.render(view, model);
                    } else {
                        // console.dir(result);
                        /*model.data.meetingDetails = JSON.parse(JSON.stringify(result));
                        console.log(model.data.meetingDetails);
                        res.render(view, model);*/
                        //debugger;
                       
                        model.data.meetingDetails = JSON.parse(JSON.stringify(result));
                        console.log(model.data.meetingDetails);
                        console.log(model.data.meetingDetails.meetings.length);
                        for(var i = 0; i < model.data.meetingDetails.meetings.length; i++) {
                            model.data.meetingDetails.meetings[i].fullName = model.data.meetingDetails.coachesLinked[0].fullName;
                            console.log("Meeting date from DB " + model.data.meetingDetails.meetings[i].meetingdate);
                            var now = new Date();
                            var nowMoment = moment(now);
                            var meetingtimeNew = model.data.meetingDetails.meetings[i].meetingdate;
                            console.log("now " + now);
                            var arr = meetingtimeNew.split(" ");
                            if (arr.length > 4) {
                                var hour = arr[4].split(":");
                                var hr = hour[0];
                                var min = hour[1];
                                if (arr[5] == "PM") {
                                    hr = hr + 12;
                                }
                                meetingtimeNew = arr[0] + " " + arr[1] + " " + arr[2] + " - " + hr + min;
                            }
                            console.log("New meeting time = " + meetingtimeNew);
                            var meetDate = moment(model.data.meetingDetails.meetings[i].meetingdate, "D MMM YYYY - HH:mm");
                            console.log("now " + nowMoment);
                            console.log("Meeting Date " + meetDate);
                            if(now > meetDate) {
                                model.data.meetingDetails.meetings[i].isMeetingCompleted = "true";
                                console.log("IS meeting completed? " + model.data.meetingDetails.meetings[i].isMeetingCompleted);          
                            }
                            /*else {
                                model.data.meetingDetails.meetings[i].isMeetingCompleted = false;
                            }*/
                            
                        }  
                        res.render(view, model); 
                       } 
                     });   
                    }  else {
                        res.render(view, model);
                    }
                
              }); 

            
         } else {
                res.render(view, model);
         }
        } else if (req.user.role === 'coach') {
            view = 'dashboard/coach';

            if (req.user.studentsLinked && (req.user.studentsLinked.length > 0) ) {

                     User.linkedStudents(req.session.user._id ,function (error, linkresult) {
                     if (error) {
                        console.log('error')
                        res.render(view, model);
                    } else {
                        model.data.studentInfo  = JSON.parse(JSON.stringify(linkresult));
                            
                            model.data.studentName = model.data.studentInfo.studentsLinked[0].fullName;
                        }
                       
                if(req.user.meetings && (req.user.meetings.length > 0)) {

                User.findByIdAndMeetings(req.session.user._id, function (err, result) {
                    if (err) {
                        console.log('error')
                        res.render(view, model);
                    } else {
                        // console.dir(result);
                        model.data.meetingDetails = JSON.parse(JSON.stringify(result));
                        console.log(model.data.meetingDetails);
                        console.log(model.data.meetingDetails.meetings.length);
                        for(var i = 0; i < model.data.meetingDetails.meetings.length; i++) {
                            model.data.meetingDetails.meetings[i].fullName = model.data.meetingDetails.studentsLinked[0].fullName;
                            console.log("Meeting date from DB " + model.data.meetingDetails.meetings[i].meetingdate);
                            var now = new Date();
                            var nowMoment = moment(now);
                            var meetingtimeNew = model.data.meetingDetails.meetings[i].meetingdate;
                            console.log("now " + now);
                            var arr = meetingtimeNew.split(" ");
                            if (arr.length > 4) {
                                var hour = arr[4].split(":");
                                var hr = hour[0];
                                var min = hour[1];
                                if (arr[5] == "PM") {
                                    hr = hr + 12;
                                }
                                meetingtimeNew = arr[0] + " " + arr[1] + " " + arr[2] + " - " + hr + min;
                            }
                            console.log("New meeting time = " + meetingtimeNew);
                            var meetDate = moment(model.data.meetingDetails.meetings[i].meetingdate, "D MMM YYYY - HH:mm");
                            console.log("now " + nowMoment);
                            console.log("Meeting Date " + meetDate);
                            console.log("now " + now);

                            if(now > meetDate) {
                                model.data.meetingDetails.meetings[i].isMeetingCompleted = "true";
                                console.log("IS meeting completed? " + model.data.meetingDetails.meetings[i].isMeetingCompleted);          
                            }
                            /*else {
                                model.data.meetingDetails.meetings[i].isMeetingCompleted = false;
                            }*/
                            
                        } 
                        res.render(view, model);  
                    }
                })


            } else {
                res.render(view, model);
            }
           });   
          } else {
                res.render(view, model);
          }  

        } else if (req.user.role === 'admin') {
            view = 'dashboard/admin';
            res.render(view, model);
        }

    });

    router.get('/getAllMeetings', function (req, res) {

        // var view = 'dashboard/student';

        // if (req.user.role === 'student') {
        //     view = 'dashboard/student';

        // } else if (req.user.role === 'coach') {
        //     view = 'dashboard/coach';

        // } else if (req.user.role === 'admin') {
        //     view = 'dashboard/admin';
        // }

        User.findByIdAndMeetings(req.query.userid, function (err, result) {
            if (err) {
                console.log('error')
                // model.messages = err;
                res.send(err);
            } else {
                console.log('success')

                // model.data.meetings = JSON.parse(JSON.stringify(result));

                res.send(result);
                // res.render(view, model);
                // res.send(result);
            }

        })

    });


};