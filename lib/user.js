'use strict';

var mongoose = require('mongoose'),
    User = mongoose.model("User");

var UserLibrary = function () {
    return {
        createUser: function (options, callback) {
            var newuser = new User({
                // username: options.login,
                login: options.username,
                email: options.username,
                password: options.password,
                role: options.role
            })

            // TODO:
            // 1. Verify passowrd & confirm password same
            // 2.     

            // console.log('newuser: save : ', newuser);

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
        updateUser: function (options, callback) {

            // console.log('111');

            User.findById(options.userid, function (err, user) {

                // console.log('111aaa');
                if (err) {
                    callback(err);

                } else {

                    // console.log('111bbb');

                    user.fullName = options.fullName;
                    user.phone = options.phone;
                    user.college = options.college;
                    user.industry = options.industry;
                    user.experience = options.experience;
                    user.gender = options.gender;
                    user.city = options.city;

                    user.save(function (err, result) {
                        // console.log('updateUser: err : ' + err);
                        console.log('updateUser: result : ' + result);
                        if (err) return callback(err);
                        callback(null, result);
                    });

                }
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


            // var finalQuery = {
            //           $and: [
            //               {role: options.role},
            //               innerQuery
            //           ]
            //       };

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
        queryMatchingAlgorithm: function (options, callback) {


            var innerQuery = {
                    $or: []
                },
                regexpFullname;

            // if(options.role){
            //      innerQuery.$or.push({ role: options.role});
            // }
            if (options.industry) {
                innerQuery.$or.push({
                    industry: options.industry
                });
            }
            if (options.city) {
                innerQuery.$or.push({
                    city: {
                        $regex: new RegExp(options.city, "i")
                    }
                });
            }

            if (options.fullName) {
                innerQuery.$or.push({
                    fullName: {
                        $regex: new RegExp(options.fullName, "i")
                    }
                });
            }

            if (options.college) {
                innerQuery.$or.push({
                    college: {
                        $regex: new RegExp(options.college, "i")
                    }
                });
            }

            if (options.gender) {
                innerQuery.$or.push({
                    gender: options.gender
                });
            }

            var finalQuery = {
                $and: [{
                        role: options.role
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
                        console.dir(users);
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