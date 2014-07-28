/**
 * A model for our user
 */
'use strict';
var mongoose = require('mongoose'),    
    uniqueValidator = require('mongoose-unique-validator'),
    Schema = mongoose.Schema;
    // mongoosePlugins = require('../lib/mongoosePlugins')

var coachModel = function () {

        var coachSchema = Schema({            
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

        coachSchema.pre('save', function(next) {
            console.log('Saving coach', this);
            next();
        });

        // plugin architecture
        coachSchema.plugin(uniqueValidator);        
        
        return mongoose.model('Coach', coachSchema);
    };

module.exports = new coachModel();
