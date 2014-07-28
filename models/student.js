/**
 * A model for our user
 */
'use strict';
var mongoose = require('mongoose'),    
    uniqueValidator = require('mongoose-unique-validator'),
    Schema = mongoose.Schema;
    // mongoosePlugins = require('../lib/mongoosePlugins')

var studentModel = function () {

        var studentSchema = Schema({            
            login: { type: String,  required: true,  unique: true },  //Ensure logins are unique.
            email: { type: String,  required: true,  unique: true },  //Ensure logins are unique.
            lastModifiedDate: Date,
            school: String,
            gender: String,
            phone: String,
            location: String,
            coach: Array,
            linkedin: {},
            search: [String],
            user: {
                type: Schema.ObjectId,
                ref: 'User'
            }
            
        });

        studentSchema.pre('save', function(next) {
            console.log('Saving Student', this);
            next();
        });

        // plugin architecture
        studentSchema.plugin(uniqueValidator);        
        
        return mongoose.model('Student', studentSchema);
    };

module.exports = new studentModel();
