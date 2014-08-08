'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var personSchema = Schema({    
    name: String,
    age: Number,
    stories: [{
        type: Schema.Types.ObjectId,
        ref: 'Story'
    }]
});

var storySchema = Schema({
    _creator: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Person' 
    },        
    title: String,
    fans: [{
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Person' 
    }]
});

var Story = mongoose.model('Story', storySchema);
var Person = mongoose.model('Person', personSchema);

// debugger;

module.exports.Story = Story;
module.exports.Person = Person;