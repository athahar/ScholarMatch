'use strict';

var userLib = require('../../lib/user')();
var mongoose = require('mongoose');
var User = mongoose.model("User");
var logger = require('tracer').colorConsole();
var mongoose = require('mongoose');
var Industry = mongoose.model("Industry");

module.exports = function (router) {

    var model = new User();
    model.viewName = 'profile';

    router.get('/', function (req, res) {

        model.data = model.data || {};
        model.data.userid = req.user._id;

        model.messages = ''; // clear any messages

        userLib.findUser(model.data, function (err, result) {

            if (err) {
                console.log('error');
                // model.messages = err;
                res.send(err);
            } else {
                console.log(result);

                model.data.result = model.data.result || {};
                model.data.result = JSON.parse(JSON.stringify(result));

                // res.render(result);
                model.data.result.ownProfile = true;
                model.data.result.isConnected = true;
                res.render('profile/user', model);
            }
        });
    });


    router.post('/edit', function (req, res) {

        debugger;

        if (req.session.user._id) {

            model.data = model.data || {};
            model.data.result = model.data.result || {};
            model.data.industry = model.data.industry || {};

            model.data.result.userid = req.user._id;
 
            model.messages = ''; // clear any messages
            userLib.findUser(model.data.result, function (err, result) {

                if (err) {
                    console.log('error')
                    // model.messages = err;
                    res.send(err);
                } else {
                    console.log(result)
                    model.data.result = JSON.parse(JSON.stringify(result));
                    model.data.result.isConnected = true;

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

                    // res.render(result);
                    if(model.data.result.role == 'coach'){
                        res.render('profile/coach', model);    
                    } else {
                        res.render('profile/student', model);
                    }
                }
            });
        }
    });

    router.post('/', function (req, res) {

        debugger;

        if (req.session.user._id) {
            
            model.data = model.data || {};
            model.data.result = model.data.result || {};

            model.data.result.userid = req.session.user._id;
            model.data.result.login = req.session.user.login;
            model.data.result.fullName = req.body.fullName;
            model.data.result.preferredName = req.body.preferredName;
            model.data.result.email = req.body.email;
            model.data.result.phone = req.body.phone;
            model.data.result.location = req.body.location;
            model.data.result.gender = req.body.genderRadios;
            model.data.result.role = req.body.role;

            model.data.result.preferredMeetingFormat = model.data.result.preferredMeetingFormat || {};
            model.data.result.preferredMeetingFormat.call = req.body.preferredMeetingFormatCall;
            model.data.result.preferredMeetingFormat.email = req.body.preferredMeetingFormatEmail;
            model.data.result.preferredMeetingFormat.skype = req.body.preferredMeetingFormatSkype;
            model.data.result.preferredMeetingFormat.inPerson = req.body.preferredMeetingFormatInPerson;
            
            model.data.result.linkedinProfileUrl = req.body.linkedinProfileUrl;

            model.data.firstlogin = req.session.firstlogin;
            req.session.firstlogin = false; // clear initial login flag

            if(req.body.role == "coach"){
                model.data.result.underGradSchool = model.data.result.underGradSchool || {};
                model.data.result.underGradSchool.name = req.body.underGradSchoolName;
                model.data.result.underGradSchool.major = req.body.underGradSchoolMajor;
                
                model.data.result.gradSchool = model.data.result.gradSchool || {};
                model.data.result.gradSchool.name = req.body.gradSchoolName;
                model.data.result.gradSchool.major = req.body.gradSchoolMajor;
                
                
                model.data.result.primaryIndustry = model.data.result.primaryIndustry || {};
                if(req.body.primaryIndustryName && (req.body.primaryIndustryName != "-1")) {                
                    model.data.result.primaryIndustry.industryName = req.body.primaryIndustryName;
                }
                model.data.result.primaryIndustry.jobTitle = req.body.primaryIndustryJobTitle
                model.data.result.primaryIndustry.yearsOfExperience = req.body.primaryIndustryYearsOfExperience;
                model.data.result.primaryIndustry.company = req.body.primaryIndustryCompany;

                model.data.result.secondaryIndustry = model.data.result.secondaryIndustry || {};
                if(req.body.secondaryIndustryName && (req.body.secondaryIndustryName !=  "-1")) {
                    model.data.result.secondaryIndustry.industryName = req.body.secondaryIndustryName;
                }
                model.data.result.secondaryIndustry.jobTitle = req.body.secondaryIndustryJobTitle;
                model.data.result.secondaryIndustry.yearsOfExperience = req.body.secondaryIndustryYearsOfExperience;
                model.data.result.secondaryIndustry.company = req.body.secondaryIndustryCompany;
                
                model.data.result.coachingInterest = req.body.coachingInterest;
                model.data.result.studentMatchPreference = req.body.studentMatchPreference;

                model.data.result.primaryReference = model.data.result.primaryReference || {};
                model.data.result.primaryReference.name = req.body.primaryReferenceName;
                model.data.result.primaryReference.phone = req.body.primaryReferencePhone;
                model.data.result.primaryReference.email = req.body.primaryReferenceEmail;

                model.data.result.secondaryReference = model.data.result.secondaryReference || {};
                model.data.result.secondaryReference.name = req.body.secondaryReferenceName;
                model.data.result.secondaryReference.phone = req.body.secondaryReferencePhone;
                model.data.result.secondaryReference.email = req.body.secondaryReferenceEmail;
            }else if(req.body.role == "student"){
                model.data.result.school = model.data.result.school || {};
                model.data.result.school.name = req.body.schoolName;
                model.data.result.school.major = req.body.schoolMajor;
                if(req.body.schoolCurrentYear && (req.body.schoolCurrentYear != "-1")) {
                    model.data.result.school.currentYear = req.body.schoolCurrentYear;
                }

                model.data.result.industry = model.data.result.industry || {};
                if(req.body.industryDesired && (req.body.industryDesired != "-1")) {
                    model.data.result.industry.desired = req.body.industryDesired;
                }
                if(req.body.industryInterestedIn && (req.body.industryInterestedIn != "-1")) {
                    model.data.result.industry.interestedIn = req.body.industryInterestedIn;
                }
                if(req.body.industrySecondary && (req.body.industrySecondary != "-1")) {
                    model.data.result.industry.secondary = req.body.industrySecondary;
                }

                model.data.result.previousJobs = req.body.previousJobs;
                model.data.result.additionalPersonalInfo = req.body.additionalPersonalInfo;
            }

            userLib.updateUser(model.data.result, function (err, result) {

                model.data.result.ownProfile = true;
                model.data.result.isConnected = true;

                if (err) {
                    model.messages = err;
                    res.render('profile/user', model);
                } else {
                    model.messages = 'Profile Updated';
                    res.render('profile/user', model);
                }
            });
        } else {
            logger.trace("i am here in update.......");
            res.redirect('/login');
        }

    });

    router.get('/otherProfile', function (req, res) {

        User.findByIdAndMeetings(req.query.userId, function (err, result) {
            if (err) {
                console.log('error')
                // model.messages = err;
                res.send(err);
            } else {
                console.log(result)
                model.data = model.data || {};
                model.data.result = model.data.result || {};
                model.data.result = JSON.parse(JSON.stringify(result));
                model.data.result.ownProfile = false;
                model.data.result.isConnected = false;

                // res.render(result);
                res.render('profile/user', model);
            }
        })
    });

    router.get('/user', function (req, res) {

        User.findByIdAndMeetings(req.query.userId, function (err, result) {
            if (err) {
                console.log('error')
                // model.messages = err;
                res.send(err);
            } else {
                console.log(result)
                model.data = model.data || {};
                model.data.result = model.data.result || {};
                model.data.result = JSON.parse(JSON.stringify(result));
                model.data.result.ownProfile = false;
                model.data.result.isConnected = true;

                // res.render(result);
                res.render('profile/user', model);
            }
        })
    });

    router.get('/:name', function (req, res) {
        res.render('profile/student', model);
    });
};