/**
 * A model for our user
 */
'use strict';
var mongoose = require('mongoose'),
    bcrypt = require('bcrypt'),
    crypto = require('../lib/crypto'),
    uniqueValidator = require('mongoose-unique-validator'),
    mongooseHidden = require('mongoose-hidden')({ defaultHidden: { password: true } });

var userModel = function () {

        var userSchema = mongoose.Schema({
            login: { type: String,  required: true,  unique: true },  //Ensure logins are unique.
            email: { type: String,  required: true,  unique: true },  //Ensure emails are unique.
            // email: { type: String },  //Ensure emails are unique.
            password: { type: String, required: true, hide: true }, //We'll store bCrypt hashed passwords.  Just say no to plaintext!
            fullName: String,            
            role: String,   
            phone: String,    
            college: String,
            industry: String,
            experience: Number, 
            gender: String,
            city: String,    
            creationDate: { type: Date},
            resetPasswordToken: String,
            resetPasswordExpires: Date,
            lastLoginDate:{ type: Date},
            lastModifiedDate:{ type: Date, default: Date.now },
            coachLinked: Array,
            studentsLinked: Array,
            linkedin: {},
            search: [String]
        });

        // plugin architecture
        userSchema.plugin(uniqueValidator);
        userSchema.plugin(mongooseHidden); // hide passowrd from the user response object using hide:true in password field
        /**
         * Helper function that hooks into the 'save' method, and replaces plaintext passwords with a hashed version.
         */
        userSchema.pre('save', function (next) {
            var user = this;

            //If the password has not been modified in this save operation, leave it alone (So we don't double hash it)
            if (!user.isModified('password')) {
                next();
                return;
            }
            //Encrypt it using bCrypt. Using the Sync method instead of Async to keep the code simple.
            var hashedPwd = bcrypt.hashSync(user.password, crypto.getCryptLevel());

            //Replace the plaintext pw with the Hash+Salted pw;
            user.password = hashedPwd;

            //Continue with the save operation
            next();
        });

        /**
         * Helper function that takes a plaintext password and compares it against the user's hashed password.
         * @param plainText
         * @returns true/false
         */
        userSchema.methods.passwordMatches = function (plainText) {
            var user = this;
            return bcrypt.compareSync(plainText, user.password);
        };

        userSchema.statics.findByEmail = function(email, callback){
            this.find({ email : email}, callback);
        };

        userSchema.statics.findByUsername = function(username, callback){
            this.find({ username : username}, callback);
        };

        userSchema.statics.findById = function(id, callback){
            this.findOne({_id: id},callback);
            
        };

        userSchema.statics.findAll = function(callback){
            this.find({}, callback);
        };

        userSchema.statics.findByObjQuery = function(objQuery, display, callback){
            console.log("---- findByObjQuery ----- ");
            console.dir(objQuery);
            // find({$or: [{role: 'coach'}]}, {fullName:1,role:1,city:1,industry:1})
            this.find(objQuery,display, callback);

            // find({$or: [{role: 'coach'}]}, {fullName:1,role:1,city:1,industry:1}).
        };

        

        return mongoose.model('User', userSchema);
    };

module.exports = new userModel();
