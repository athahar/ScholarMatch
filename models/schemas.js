'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var personSchema = Schema({    
    name: String,
    age: Number,
    meetings: [{
        type: Schema.Types.ObjectId,
        ref: 'Meeting'
    }]
});

var meetingSchema = Schema({
    _creator: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Person' 
    },        
    title: String,
    attendees: [{
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Person' 
    }]
});

var Meeting = mongoose.model('Meeting', meetingSchema);
var Person = mongoose.model('Person', personSchema);

// debugger;

module.exports.Meeting = Meeting;
module.exports.Person = Person;