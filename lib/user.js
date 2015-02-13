'use strict';

//var User = require('../models/user');
var mongoose = require('mongoose');
var User = mongoose.model("User");

var UserLibrary = function () {
    return {
        createUser: function (options, callback) {
            var newuser = new User({
                fullName: options.fullName,
                login: options.username,
                email: options.username,
                password: options.password,
                role: options.role
            })

            // TODO:
            // 1. Verify passowrd & confirm password same
            // 2.     

            console.log('newuser: save : ', newuser);

            newuser.save(function (err, result) {

                if (err) {
                    if (err.name === 'ValidationError' && err.errors && err.errors.login &&
                        err.errors.login.type === 'user defined') {
                        callback('User ID is already taken');
                    } else {
                        callback(err);
                    }

                } else {
                    callback(null, result);
                }

            });
        },
        findUser: function (options, callback) {
            debugger;

            console.log("inside UserLibrary.findUser for userid " + options.userid);

            User.findById(options.userid, function (err, user) {
                console.log("after User.findById for userid " + options.userid);

                if (err) {
                    console.log("failed to find user for userid " + options.userid);
                    callback(err);
                } else {
                    console.log("found user for userid " + options.userid);
                    callback(null, user);
                }
            })
        },
        updateUser: function (options, callback) {


            User.findById(options.userid, function (err, user) {

                if (err) {
                    callback(err);

                } else {
                    user.fullName = options.fullName;
                    user.preferredName = options.preferredName;
                    user.email = options.email;
                    user.phone = options.phone;
                    user.phoneType = options.phoneType;
                    user.address = options.address;
                    user.heardFrom = options.heardFrom;
                    user.location = options.location;
                    user.zipCode = options.zipCode;

                    user.gender = options.gender;

                    user.preferredMeetingFormat = user.preferredMeetingFormat || {};
                    user.preferredMeetingFormat.call = options.preferredMeetingFormat.call;
                    user.preferredMeetingFormat.email = options.preferredMeetingFormat.email;
                    user.preferredMeetingFormat.skype = options.preferredMeetingFormat.skype;
                    user.preferredMeetingFormat.inPerson = options.preferredMeetingFormat.inPerson;

                    user.linkedinProfileUrl = options.linkedinProfileUrl;
                    user.additionalPersonalInfo = options.additionalPersonalInfo;

                    if (options.role == 'coach') {
                        user.underGradSchool = user.underGradSchool || {};
                        user.underGradSchool.name = options.underGradSchool.name;
                        user.underGradSchool.otherName = options.underGradSchool.otherName;
                        user.underGradSchool.major = options.underGradSchool.major;
                        user.underGradSchool.otherMajor = options.underGradSchool.otherMajor;

                        user.gradSchool = user.gradSchool || {};
                        user.gradSchool.name = options.gradSchool.name;
                        user.gradSchool.otherName = options.gradSchool.otherName;
                        user.gradSchool.major = options.gradSchool.major;
                        user.gradSchool.otherMajor = options.gradSchool.otherMajor;

                        user.primaryIndustry = user.primaryIndustry || {};
                        user.primaryIndustry.industryName = options.primaryIndustry.industryName;
                        user.primaryIndustry.otherIndustryName = options.primaryIndustry.otherIndustryName;
                        user.primaryIndustry.jobTitle = options.primaryIndustry.jobTitle;
                        user.primaryIndustry.yearsOfExperience = options.primaryIndustry.yearsOfExperience;
                        user.primaryIndustry.company = options.primaryIndustry.company;

                        user.secondaryIndustry = user.secondaryIndustry || {};
                        user.secondaryIndustry.industryName = options.secondaryIndustry.industryName;
                        user.secondaryIndustry.otherIndustryName = options.secondaryIndustry.otherIndustryName;
                        user.secondaryIndustry.jobTitle = options.secondaryIndustry.jobTitle;
                        user.secondaryIndustry.yearsOfExperience = options.secondaryIndustry.yearsOfExperience;
                        user.secondaryIndustry.company = options.secondaryIndustry.company;

                        user.coachingInterest = options.coachingInterest;
                        user.studentMatchPreference = options.studentMatchPreference;

                        user.primaryReference = user.primaryReference || {};
                        user.primaryReference.name = options.primaryReference.name;
                        user.primaryReference.phone = options.primaryReference.phone;
                        user.primaryReference.email = options.primaryReference.email;
                        user.primaryReference.relationship = options.primaryReference.relationship;
                        user.primaryReference.yearsKnown = options.primaryReference.yearsKnown;

                        user.secondaryReference = user.secondaryReference || {};
                        user.secondaryReference.name = options.secondaryReference.name;
                        user.secondaryReference.phone = options.secondaryReference.phone;
                        user.secondaryReference.email = options.secondaryReference.email;
                        user.secondaryReference.relationship = options.secondaryReference.relationship;
                        user.secondaryReference.yearsKnown = options.secondaryReference.yearsKnown;

                        user.remoteLocation = options.remoteLocation;

                        user.studentList = options.studentList;
                    } else if (options.role == 'student') {
                        user.school.name = options.school.name;
                        user.school.otherName = options.school.otherName;
                        user.school.major = options.school.major;
                        user.school.otherMajor = options.school.otherMajor;
                        user.school.currentYear = options.school.currentYear;

                        user.industry.desired = options.industry.desired;
                        user.industry.otherDesired = options.industry.otherDesired;
                        user.industry.interestedIn = options.industry.interestedIn;
                        user.industry.otherInterestedIn = options.industry.otherInterestedIn;
                        user.industry.secondary = options.industry.secondary;
                        user.industry.otherSecondary = options.industry.otherSecondary;

                        user.previousJobs = options.previousJobs;
                        user.secondPreviousJobs = options.secondPreviousJobs;
                    }
                    user.lastModifiedDate = new Date();

                    user.save(function (err, result) {
                        // console.log('updateUser: err : ' + err);
                        // console.log('updateUser: result : ' + result);
                        if (err) return callback(err);
                        callback(null, result);
                    });
                }
            })
        },

        makeAdmin: function (userId, callback) {

            User.findById(userId, function (err, user) {

                if (err) {
                    return callback('User not found');
                }

                user.role = 'admin';
                user.save(function (err, result) {
                    if (err) {
                        return callback('Admin creation failed');
                    }
                    callback(null, result);
                });
            })

        },

        connectStudentWithCoach: function (studentid, coachid, callback) {
            debugger;
            User.findById(studentid, function (err, user) {

                debugger;
                if (err) {
                    return callback('student not found');
                }


                if (user.coachesLinked.indexOf(coachid) < 0) {
                    user.coachesLinked.push(coachid);
                    user.save(function (err, result) {
                        if (err) {
                            return callback('student save failed');
                        }
                        callback(null, result);
                    });
                } else {
                    return callback('student already linked to the same coach');
                }
            })
        },
        connectCoachWithStudent: function (studentid, coachid, callback) {
            debugger;
            User.findById(coachid, function (err, user) {
                debugger;
                if (err) {
                    return callback('student not found');
                }

                if (user.studentsLinked.indexOf(studentid) < 0) {
                    user.studentsLinked.push(studentid);
                    user.save(function (err, result) {
                        if (err) {
                            return callback('coach save failed');
                        }
                        callback(null, result);
                    });
                } else {
                    return callback('coach already linked to the same student');
                }
            })
        },
        queryAllUsers: function (options, callback) {


            var innerQuery = {
                $or: []
            };


            if (options.role) {
                innerQuery.$or.push({
                    role: options.role
                });
            }

            if (options.role == 'coach') {
                innerQuery.$and.push({
                    studentsLinked: {
                        $size: 0
                    }
                });
            }

            var display = {
                email: 1,
                fullName: 1,
                role: 1,
                city: 1,
                college: 1,
                industry: 1,
                gender: 1
            }

            // query.push(display);

            // {$or: [{role: 'coach'}]}, {fullName:1,role:1,city:1,industry:1}

            User.findByObjQuery(innerQuery, display, function (err, users) {
                if (err) {
                    callback(err);

                } else {
                    // console.dir(users);
                    callback(null, users);
                }
            });
        },

        queryAllCoaches: function (options, callback) {


            var display = {
                email: 1,
                fullName: 1,
                role: 1,
                city: 1,
                college: 1,
                industry: 1,
                gender: 1
            }


            User.findAllCoaches(function (err, users) {
                if (err) {
                    callback(err);

                } else {
                    // console.dir(users);
                    callback(null, users);
                }
            });
        },

        queryEveryCoach: function (options, callback) {


            var display = {
                email: 1,
                fullName: 1,
                role: 1,
                city: 1,
                college: 1,
                industry: 1,
                gender: 1
            }


            User.findEveryCoach(function (err, users) {
                if (err) {
                    callback(err);

                } else {
                    // console.dir(users);
                    callback(null, users);
                }
            });
        },

        queryEveryStudent: function (options, callback) {


            var display = {
                email: 1,
                fullName: 1,
                role: 1,
                city: 1,
                college: 1,
                industry: 1,
                gender: 1
            }


            User.findEveryStudent(function (err, users) {
                if (err) {
                    callback(err);

                } else {
                    // console.dir(users);
                    callback(null, users);
                }
            });
        },

        queryMatchingAlgorithm: function (options, callback) {

            var innerQuery = {};

            // if(options.role){
            //      innerQuery.$or.push({ role: options.role});
            // }
            if (options.industry && (options.industry != -1)) {

                innerQuery.$or = [];

                innerQuery.$or.push({
                    "primaryIndustry.industryName": options.industry
                }, {
                    "secondaryIndustry.industryName": options.industry
                });
            }

            if (options.city) {

                innerQuery.$or = [];

                innerQuery.$or.push({
                    city: {
                        $regex: new RegExp(options.city, "i")
                    }
                });
            }

            if (options.fullName) {

                innerQuery.$or = [];

                innerQuery.$or.push({
                    fullName: {
                        $regex: new RegExp(options.fullName, "i")
                    }
                });
            }

            if (options.college) {

                innerQuery.$or = [];

                innerQuery.$or.push({
                    college: {
                        $regex: new RegExp(options.college, "i")
                    }
                });
            }

            if (options.gender && (options.gender != "-1")) {

                innerQuery.$or = [];

                innerQuery.$or.push({
                    gender: options.gender
                });
            }

            var finalQuery = {
                $and: [{
                        role: options.role
                    }, {
                        studentsLinked: {
                            $size: 0
                        }
                    },
                    innerQuery
                ]
            };

            // query.$or.push({ 
            //     role: options.role, 
            //     industry:options.industry
            //   });

            // TODO : Improve this query - for $OR and $and
            var display = {
                email: 1,
                fullName: 1,
                role: 1,
                city: 1,
                college: 1,
                industry: 1,
                gender: 1
            }

            // query.push(display);

            // {$or: [{role: 'coach'}]}, {fullName:1,role:1,city:1,industry:1}

            User.findByObjQuery(finalQuery, display, function (err, users) {
                if (err) {
                    callback(err);

                } else {
                    // console.dir(users);
                    callback(null, users);
                }
            });
        },
        findAllUsers: function (options, callback) {


            User.findAll(
                function (err, users) {
                    if (!err) {
                        // console.dir(users);
                        callback(null, users)
                    } else {
                        console.log(err);
                        return callback(err)
                            // res.json({"status":"error", "error":"Error finding all items"});
                    }
                }
            )

            //  User.find({"role": 'student'}, 'role city industry', function (err, users) {
            // // User.find( {"role": options.role},{fullName:1,role:1,city:1,industry:1}, function (err, users) {
            //    // console.log('111aaa');
            //    if(err){
            //          callback(err);                        

            //      }else{
            //          console.dir(users);
            //          callback(null, users);

            //      }
            //  })

            // User
            // .find({ role: /coach/ })
            // // .where('fullName').equals('Athahar')
            // // .where('age').gt(17).lt(66)
            // // .where('likes').in(['vaporizing', 'talking'])
            // .limit(10)
            // .sort('-industry')
            // .select('fullName industry')
            // .exec(callback);

        },
        addUsers: function () { //add two users
            var u1 = new User({
                name: 'Kraken McSquid',
                login: 'kraken',
                password: 'kraken',
                role: 'admin'
            });

            var u2 = new User({
                name: 'Ash Williams',
                login: 'ash',
                password: 'ash',
                role: 'user'
            });

            //Ignore errors. In this case, the errors will be for duplicate keys as we run this app more than once.
            u1.save();
            u2.save();
        },
        serialize: function (user, done) {
            done(null, user.id);
        },
        deserialize: function (id, done) {
            User.findOne({
                _id: id
            }, function (err, user) {
                done(null, user);
            });
        }
    };
};

module.exports = UserLibrary;