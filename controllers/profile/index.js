'use strict';

var userLib = require('../../lib/user')();
var mongoose = require('mongoose');
var User = mongoose.model("User");
var logger = require('tracer').colorConsole();
var validator = require('express-validator');
var Industry = mongoose.model("Industry");
var School = mongoose.model("School");
var Major = mongoose.model("Major");

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

    router.get('/edit', function (req, res) {

        // debugger;

        if (req.session.user._id) {

            model.data = model.data || {};
            model.data.result = model.data.result || {};
            model.data.result.industry = {};
            model.data.result.school = {};
            model.data.result.major = {};

            model.data.result.userid = req.user._id;
 
            model.messages = ''; // clear any messages
            userLib.findUser(model.data.result, function (err, result) {

                if (err) {
                    console.log('error')
                    // model.messages = err;
                    res.send(err);
                } else {
                    //console.log(result)
                    model.data.result = JSON.parse(JSON.stringify(result));
                    model.data.result.isConnected = true;

                    Industry.findAll(function(err, result){
                        if(err) {
                            console.log('error in reading the industries from DB');
                        } 
                        else
                        {
                            //console.log(result);
                            model.data.result.industry = JSON.parse(JSON.stringify(result));
                        } 
                    })

                    School.findAll(function(err, result){
                        if(err) {
                            console.log('error in reading the schools from DB');
                        }
                        else
                        {
                            //console.log(result);
                            model.data.result.school = JSON.parse(JSON.stringify(result));
                        } 
                    })

                    Major.findAll(function(err, result){
                        if(err) {
                            console.log('error in reading the majors from DB');
                        }
                        else
                        {
                            //console.log(result);
                            model.data.result.major = JSON.parse(JSON.stringify(result));
                        } 
                    })                    

                    model.data.result.phoneTypeList = {};
                    model.data.result.phoneTypeList = [{"type": "Home"}, 
                                                        {"type":"Mobile"}, 
                                                        {"type":"Work"}];

                    console.log("phoneTypeList: " + model.data.result.phoneTypeList);
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



    router.post('/edit', function (req, res) {

        // debugger;

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
                    // console.log(result)
                    model.data.result = JSON.parse(JSON.stringify(result));
                    model.data.result.isConnected = true;

                    Industry.findAll(function(err, result){
                        if(err) {
                            console.log('error in reading the industries from DB');
                        }
                        else {
                            // console.log(result);
                            model.data.industry = JSON.parse(JSON.stringify(result));
                        } 
                    })

                    // res.render(result);
                    if(model.data.result.role == 'coach') {
                        res.render('profile/coach', model);    
                    } else {
                        res.render('profile/student', model);
                    }
                }
            });
        }
    });

    router.post('/', function (req, res) {

        // debugger;

        if (req.session.user._id) {
            
            model.data = model.data || {};
            model.data.result = model.data.result || {};

            model.data.result.userid = req.session.user._id;
            model.data.result.login = req.session.user.login;
            model.data.result.fullName = req.body.fullName;
            model.data.result.preferredName = req.body.preferredName;
            model.data.result.email = req.body.email;
            model.data.result.phone = req.body.phone;
            model.data.result.phoneType = req.body.phoneType;
            model.data.result.address = req.body.address;
            model.data.result.location = req.body.location;
            model.data.result.gender = req.body.genderRadios;
            model.data.result.role = req.body.role;

            model.data.result.preferredMeetingFormat = model.data.result.preferredMeetingFormat || {};
            model.data.result.preferredMeetingFormat.call = req.body.preferredMeetingFormatCall;
            model.data.result.preferredMeetingFormat.email = req.body.preferredMeetingFormatEmail;
            model.data.result.preferredMeetingFormat.skype = req.body.preferredMeetingFormatSkype;
            model.data.result.preferredMeetingFormat.inPerson = req.body.preferredMeetingFormatInPerson;
            
            model.data.result.linkedinProfileUrl = req.body.linkedinProfileUrl;
            model.data.result.additionalPersonalInfo = req.body.additionalPersonalInfo;

            model.data.firstlogin = req.session.firstlogin;
            req.session.firstlogin = false; // clear initial login flag

            if(req.body.role == "coach"){

                // validate mandatory fields
                req.checkBody('linkedinProfileUrl', 'Linkedin profile url is required').notEmpty();

                var errors = req.validationErrors();
                console.log(errors);

                if(errors) {
                    req.flash(errors[0].msg);
                    model.messages = errors[0].msg;
                    res.render('profile/coach', model);
                    return;
                } 

                model.data.result.underGradSchool = model.data.result.underGradSchool || {};
                if((req.body.underGradSchoolName && (req.body.underGradSchoolName != "-1")) ||
                    (req.body.otherUnderGradSchoolName)) {

                    if(req.body.underGradSchoolName) {
                        model.data.result.underGradSchool.name = req.body.underGradSchoolName;
                        model.data.result.underGradSchool.otherName = null;
                    } else {
                        model.data.result.underGradSchool.name = req.body.otherUnderGradSchoolName;
                        model.data.result.underGradSchool.otherName = req.body.otherUnderGradSchoolName;
                    }

                }

                if((req.body.underGradSchoolMajor && (req.body.underGradSchoolMajor != "-1")) ||
                    (req.body.otherUnderGradSchoolMajor)) {

                    if(req.body.underGradSchoolMajor) {
                        model.data.result.underGradSchool.major = req.body.underGradSchoolMajor;
                        model.data.result.underGradSchool.otherMajor = null;
                    } else {
                        model.data.result.underGradSchool.major = req.body.otherUnderGradSchoolMajor;
                        model.data.result.underGradSchool.otherMajor = req.body.otherUnderGradSchoolMajor;
                    }
                }
                
                model.data.result.gradSchool = model.data.result.gradSchool || {};
                if((req.body.gradSchoolName && (req.body.gradSchoolName != "-1")) ||
                    (req.body.otherGradSchoolName)) {

                    if(req.body.gradSchoolName) {
                        model.data.result.gradSchool.name = req.body.gradSchoolName;
                        model.data.result.gradSchool.otherName = null;
                    } else {
                        model.data.result.gradSchool.name = req.body.otherGradSchoolName;
                        model.data.result.gradSchool.otherName = req.body.otherGradSchoolName;
                    }

                }

                if((req.body.gradSchoolMajor && (req.body.gradSchoolMajor != "-1")) ||
                    (req.body.otherGradSchoolMajor)) {

                    if(req.body.gradSchoolMajor) {
                        model.data.result.gradSchool.major = req.body.gradSchoolMajor;
                        model.data.result.gradSchool.otherMajor = null;
                    } else {
                        model.data.result.gradSchool.major = req.body.otherGradSchoolMajor;
                        model.data.result.gradSchool.otherMajor = req.body.otherGradSchoolMajor;
                    }
                }
                
                model.data.result.primaryIndustry = model.data.result.primaryIndustry || {};
                if((req.body.primaryIndustryName && (req.body.primaryIndustryName != "-1")) ||
                  (req.body.otherPrimaryIndustryName)) {    

                    if(req.body.primaryIndustryName) {
                        model.data.result.primaryIndustry.industryName = req.body.primaryIndustryName;
                        model.data.result.primaryIndustry.otherIndustryName = null;
                    } else {
                        model.data.result.primaryIndustry.industryName = req.body.otherPrimaryIndustryName;
                        model.data.result.primaryIndustry.otherIndustryName = req.body.otherPrimaryIndustryName;
                    }

                    model.data.result.primaryIndustry.jobTitle = req.body.primaryIndustryJobTitle
                    model.data.result.primaryIndustry.yearsOfExperience = req.body.primaryIndustryYearsOfExperience;
                    model.data.result.primaryIndustry.company = req.body.primaryIndustryCompany;
                }

                model.data.result.secondaryIndustry = model.data.result.secondaryIndustry || {};
                if((req.body.secondaryIndustryName && (req.body.secondaryIndustryName !=  "-1")) ||
                  (req.body.otherSecondaryIndustryName)) {    

                    if(req.body.secondaryIndustryName) {
                        model.data.result.secondaryIndustry.industryName = req.body.secondaryIndustryName;
                        model.data.result.secondaryIndustry.otherIndustryName = null;
                    } else {
                        model.data.result.secondaryIndustry.industryName = req.body.otherSecondaryIndustryName;
                        model.data.result.secondaryIndustry.otherIndustryName = req.body.otherSecondaryIndustryName;
                    }

                    model.data.result.secondaryIndustry.jobTitle = req.body.secondaryIndustryJobTitle;
                    model.data.result.secondaryIndustry.yearsOfExperience = req.body.secondaryIndustryYearsOfExperience;
                    model.data.result.secondaryIndustry.company = req.body.secondaryIndustryCompany;
                }
                
                model.data.result.coachingInterest = req.body.coachingInterest;
                model.data.result.studentMatchPreference = req.body.studentMatchPreference;
                model.data.result.heardFrom = req.body.heardFrom;

                model.data.result.primaryReference = model.data.result.primaryReference || {};
                model.data.result.primaryReference.name = req.body.primaryReferenceName;
                model.data.result.primaryReference.phone = req.body.primaryReferencePhone;
                model.data.result.primaryReference.email = req.body.primaryReferenceEmail;
                model.data.result.primaryReference.relationship = req.body.primaryReferenceRelationship;
                model.data.result.primaryReference.yearsKnown = req.body.primaryReferenceYearsKnown;

                model.data.result.secondaryReference = model.data.result.secondaryReference || {};
                model.data.result.secondaryReference.name = req.body.secondaryReferenceName;
                model.data.result.secondaryReference.phone = req.body.secondaryReferencePhone;
                model.data.result.secondaryReference.email = req.body.secondaryReferenceEmail;
                model.data.result.secondaryReference.relationship = req.body.secondaryReferenceRelationship;
                model.data.result.secondaryReference.yearsKnown = req.body.secondaryReferenceYearsKnown;
            } else if(req.body.role == "student"){
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
                model.data.result.secondPreviousJobs = req.body.secondPreviousJobs;
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
                // console.log(result)
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
                // console.log(result)
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