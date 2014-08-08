'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var personSchema = Schema({    
    name: String,
    age: Number,
    meetings: [{
        type: Schema.Types.ObjectId,
        ref: 'Meeting'
    }],
    coachesLinked: [{
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Person' 
    }],
    studentsLinked: [{
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Person' 
    }]
});

var meetingSchema = Schema({
    _creator: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Person' 
    },        
    title: String,
    attendees: [attendeeSchema]
});


var attendeeSchema = Schema({
    _id:false,
    attendee: { type: String, required: true, ref: 'Person' }
})

var Meeting = mongoose.model('Meeting', meetingSchema);
var Person = mongoose.model('Person', personSchema);

// debugger;

module.exports.Meeting = Meeting;
module.exports.Person = Person;