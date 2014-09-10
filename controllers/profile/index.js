'use strict';

var userLib = require('../../lib/user')();
var mongoose = require('mongoose');
var User = mongoose.model("User");
var logger = require('tracer').colorConsole();

module.exports = function (router) {

    var model = new User();
    model.viewName = 'profile';

    router.get('/', function (req, res) {

        debugger;


        model.data = model.data || {};
        model.data.userDetails = model.data.userDetails || {};

        model.data.userDetails.userid = req.user._id;

        model.messages = ''; // clear any messages

        userLib.findUser(model.data.userDetails, function (err, result) {

            if (err) {
                res.render('profile/index', model);
            } else {
                model.data.userDetails.userid = req.user._id;
                model.data.userDetails.login = req.user.login;
                model.data.userDetails.role = result.role;
                model.data.userDetails.fullName = result.fullName;
                model.data.userDetails.preferredName = result.preferredName;
                model.data.userDetails.email = result.email;
                model.data.userDetails.phone = result.phone;
                model.data.userDetails.location = result.location;
                model.data.userDetails.gender = result.gender;
                if (result.preferredMeetingFormat) {
                    model.data.userDetails.preferredMeetingFormat = model.data.userDetails.preferredMeetingFormat || {};
                    model.data.userDetails.preferredMeetingFormat.phone = result.preferredMeetingFormat.phone;
                    model.data.userDetails.preferredMeetingFormat.email = result.preferredMeetingFormat.email;
                    model.data.userDetails.preferredMeetingFormat.skype = result.preferredMeetingFormat.skype;
                    model.data.userDetails.preferredMeetingFormat.inPerson = result.preferredMeetingFormat.inPerson;
                }

                model.data.userDetails.linkedinProfileUrl = result.linkedinProfileUrl;

                model.data.firstlogin = req.session.firstlogin;
                req.session.firstlogin = false; // clear initial login flag

                if(result.role == "coach"){
                    if(result.underGradSchool){
                        model.data.userDetails.underGradSchool = model.data.userDetails.underGradSchool || {};
                        model.data.userDetails.underGradSchool.name = result.underGradSchool.name;
                        model.data.userDetails.underGradSchool.major = result.underGradSchool.major;
                    }

                    if(result.gradSchool){
                        model.data.userDetails.gradSchool = model.data.userDetails.gradSchool || {};
                        model.data.userDetails.gradSchool.name = result.gradSchool.name;
                        model.data.userDetails.gradSchool.major = result.gradSchool.major;
                    }                    

                    if(result.primaryIndustry){
                        model.data.userDetails.primaryIndustry = model.data.userDetails.primaryIndustry || {};
                        model.data.userDetails.primaryIndustry.industryName = result.primaryIndustry.industryName;
                        model.data.userDetails.primaryIndustry.jobTitle = result.primaryIndustry.jobTitle;
                        model.data.userDetails.primaryIndustry.yearsOfExperience = result.primaryIndustry.yearsOfExperience;
                        model.data.userDetails.primaryIndustry.company = result.primaryIndustry.company;
                    }
                    
                    if(result.secondaryIndustry){
                        model.data.userDetails.secondaryIndustry = model.data.userDetails.secondaryIndustry || {};
                        model.data.userDetails.secondaryIndustry.industryName = result.secondaryIndustry.industryName;
                        model.data.userDetails.secondaryIndustry.jobTitle = result.secondaryIndustry.jobTitle;
                        model.data.userDetails.secondaryIndustry.yearsOfExperience = result.secondaryIndustry.yearsOfExperience;
                        model.data.userDetails.secondaryIndustry.company = result.secondaryIndustry.company;
                    }

                    model.data.userDetails.coachingInterest = result.coachingInterest;
                    model.data.userDetails.studentMatchPreference = result.studentMatchPreference;

                    if(result.primaryReference){
                        model.data.userDetails.primaryReference = model.data.userDetails.primaryReference || {};
                        model.data.userDetails.primaryReference.name = result.primaryReference.name;
                        model.data.userDetails.primaryReference.phone = result.primaryReference.phone;
                        model.data.userDetails.primaryReference.email = result.primaryReference.email;
                    }

                    if(result.secondaryReference){
                        model.data.userDetails.secondaryReference = model.data.userDetails.secondaryReference || {};
                        model.data.userDetails.secondaryReference.name = result.secondaryReference.name;
                        model.data.userDetails.secondaryReference.phone = result.secondaryReference.phone;
                        model.data.userDetails.secondaryReference.email = result.secondaryReference.email;
                    }

                    model.data.userDetails.studentList = result.studentList;

                    res.render('profile/coach', model);
                }else if(result.role == "student"){
                    if(result.school){
                        model.data.userDetails.school = model.data.userDetails.school || {};
                        model.data.userDetails.school.name = result.school.name;
                        model.data.userDetails.school.major = result.school.major;
                        model.data.userDetails.school.currentYear = result.school.currentYear;
                    }

                    if(result.industry){
                        model.data.userDetails.industry = model.data.userDetails.industry || {};
                        model.data.userDetails.industry.desired = result.industry.desired;
                        model.data.userDetails.industry.interestedIn = result.industry.interestedIn;
                        model.data.userDetails.industry.secondary = result.industry.secondary;
                    }

                    model.data.userDetails.previousJobs = result.previousJobs;
                    model.data.userDetails.coachList = result.coachList;

                    res.render('profile/student', model);
                }
            }
        });
    });


    router.post('/', function (req, res) {

        debugger;

        if (req.session.user._id) {
            model.data = model.data || {};
            model.data.userDetails = model.data.userDetails || {};

            model.data.userDetails.userid = req.session.user._id;
            model.data.userDetails.login = req.session.user.login;
            model.data.userDetails.fullName = req.body.fullName;
            model.data.userDetails.preferredName = req.body.preferredName;
            model.data.userDetails.email = req.body.email;
            model.data.userDetails.phone = req.body.phone;
            model.data.userDetails.location = req.body.location;
            model.data.userDetails.underGradSchool.name = req.body.underGradSchoolName;
            model.data.userDetails.underGradSchool.major = req.body.underGradSchoolMajor;
            model.data.userDetails.gradSchool.name = req.body.gradSchoolName;
            model.data.userDetails.gradSchool.major = req.body.gradSchoolMajor;
            model.data.userDetails.primaryIndustry.industryName = req.body.primaryIndustryName;
            model.data.userDetails.primaryIndustry.jobTitle = req.body.primaryIndustryJobTitle
            model.data.userDetails.primaryIndustry.yearsOfExperience = req.body.primaryIndustryYearsOfExperience;
            model.data.userDetails.primaryIndustry.company = req.body.primaryIndustryCompany;
            model.data.userDetails.secondaryIndustry.industryName = req.body.secondaryIndustryName;
            model.data.userDetails.secondaryIndustry.jobTitle = req.body.secondaryIndustryJobTitle;
            model.data.userDetails.secondaryIndustry.yearsOfExperience = req.body.secondaryIndustryYearsOfExperience;
            model.data.userDetails.secondaryIndustry.company = req.body.secondaryIndustryCompany;
            model.data.userDetails.coachingInterest = req.body.coachingInterest;
            model.data.userDetails.studentMatchPreference = req.body.studentMatchPreference;
            model.data.userDetails.gender = req.body.genderRadios;

            model.data.userDetails.preferredMeetingFormat = model.data.userDetails.preferredMeetingFormat || {};
            model.data.userDetails.preferredMeetingFormat.call = req.body.preferredMeetingFormatCall;
            model.data.userDetails.preferredMeetingFormat.email = req.body.preferredMeetingFormatEmail;
            model.data.userDetails.preferredMeetingFormat.skype = req.body.preferredMeetingFormatSkype;
            model.data.userDetails.preferredMeetingFormat.inPerson = req.body.preferredMeetingFormatInPerson;
            
            model.data.userDetails.linkedinProfileUrl = req.body.linkedinProfileUrl;

            if(req.body.role == "coach"){
                model.data.userDetails.underGradSchool = model.data.userDetails.underGradSchool || {};
                model.data.userDetails.underGradSchool.name = req.body.underGradSchoolName;
                model.data.userDetails.underGradSchool.major = req.body.underGradSchoolMajor;
                
                model.data.userDetails.gradSchool = model.data.userDetails.gradSchool || {};
                model.data.userDetails.gradSchool.name = req.body.gradSchoolName;
                model.data.userDetails.gradSchool.major = req.body.gradSchoolMajor;
                
                model.data.userDetails.primaryIndustry = model.data.userDetails.primaryIndustry || {};
                model.data.userDetails.primaryIndustry.industryName = req.body.primaryIndustryName;
                model.data.userDetails.primaryIndustry.jobTitle = req.body.primaryIndustryJobTitle
                model.data.userDetails.primaryIndustry.yearsOfExperience = req.body.primaryIndustryYearsOfExperience;
                model.data.userDetails.primaryIndustry.company = req.body.primaryIndustryCompany;

                model.data.userDetails.secondaryIndustry = model.data.userDetails.secondaryIndustry || {};
                model.data.userDetails.secondaryIndustry.industryName = req.body.secondaryIndustryName;
                model.data.userDetails.secondaryIndustry.jobTitle = req.body.secondaryIndustryJobTitle;
                model.data.userDetails.secondaryIndustry.yearsOfExperience = req.body.secondaryIndustryYearsOfExperience;
                model.data.userDetails.secondaryIndustry.company = req.body.secondaryIndustryCompany;
                
                model.data.userDetails.coachingInterest = req.body.coachingInterest;
                model.data.userDetails.studentMatchPreference = req.body.studentMatchPreference;

                model.data.userDetails.primaryReference = model.data.userDetails.primaryReference || {};
                model.data.userDetails.primaryReference.name = req.body.primaryReferenceName;
                model.data.userDetails.primaryReference.phone = req.body.primaryReferencePhone;
                model.data.userDetails.primaryReference.email = req.body.primaryReferenceEmail;

                model.data.userDetails.secondaryReference = model.data.userDetails.secondaryReference || {};
                model.data.userDetails.secondaryReference.name = req.body.secondaryReferenceName;
                model.data.userDetails.secondaryReference.phone = req.body.secondaryReferencePhone;
                model.data.userDetails.secondaryReference.email = req.body.secondaryReferenceEmail;

                model.data.userDetails.studentList = req.body.studentList;
            }else if(req.body.role == "student"){
                model.data.userDetails.school = model.data.userDetails.school || {};
                model.data.userDetails.school.name = req.body.schoolName;
                model.data.userDetails.school.major = req.body.schoolMajor;
                model.data.userDetails.school.currentYear = req.body.schoolCurrentYear;

                model.data.userDetails.industry = model.data.userDetails.industry || {};
                model.data.userDetails.industry.desired = req.body.industryDesired;
                model.data.userDetails.industry.interestedIn = req.body.industryInterestedIn;
                model.data.userDetails.industry.secondary = req.body.industrySecondary;

                model.data.userDetails.previousJobs = req.body.previousJobs;
                model.data.userDetails.additionalPersonalInfo = req.body.additionalPersonalInfo;
                model.data.userDetails.coachList = req.body.coachList;

            }

            userLib.updateUser(model.data.userDetails, function (err, result) {
                if (err) {
                    model.messages = err;
                    res.render('profile/index', model);
                } else {
                    model.messages = 'Profile Updated';
                    res.render('profile/index', model);
                }
            });
        } else {
            logger.trace("i am here in update.......");
            res.redirect('/login');
        }

    });

    router.get('/user', function (req, res) {

        User.findByIdAndMeetings(req.query.userId, function (err, result) {
            if (err) {
                console.log('error')
                // model.messages = err;
                res.send(err);
            } else {
                console.log(result)
                model.data.result = JSON.parse(JSON.stringify(result));

                // res.render(result);
                res.render('profile/user', model);
            }
        })
    });

    router.get('/:name', function (req, res) {
        res.render('profile/student', model);
    });
};