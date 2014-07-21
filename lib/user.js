'use strict';

var User = require('../models/user');

var UserLibrary = function() {
    return {
        createUser: function(options, callback){
            var newuser = new User({
                name: options.username,
                login: options.login,
                password: options.password,
                role: options.role
            })

            // TODO:
            // 1. Verify passowrd & confirm password same
            // 2.     

             newuser.save(function(err, result){

                if(err){
                    if(err.name === 'ValidationError' && 
                        err.errors.login.type === 'user defined'){                        
                        callback('User ID is already taken');    
                    }else{
                       callback(err);    
                    }                    
                    
                }else{
                    callback(null, result);    
                }
                
             });
        },
        updateUser: function(options, callback){

            // console.log('111');

            User.findById(options.userid, function (err, user) {
              
              // console.log('111aaa');
              if(err){
                    callback(err);                        
                    
                }else{

                    // console.log('111bbb');

                    user.phone = options.phone;
                    user.college = options.college;
                    user.industry = options.industry;
                    user.experience = options.experience;
                    user.gender = options.gender;
                    user.city = options.city;

                    user.save(function (err, result) {
                        // console.log('updateUser: err : ' + err);
                        // console.log('updateUser: result : ' + result);
                        if (err) return callback(err);
                            callback(null, result);    
                      });

                }
            })
        },
        addUsers: function() { //add two users
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
        serialize: function(user, done) {
            done(null, user.id);
        },
        deserialize: function(id, done) {
            User.findOne({
                _id: id
            }, function(err, user) {
                done(null, user);
            });
        }
    };
};

module.exports = UserLibrary;
