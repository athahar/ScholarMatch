/**
 * A model for our user
 */
'use strict';
var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    bcrypt = require('bcryptjs'),
    uniqueValidator = require('mongoose-unique-validator'),
    mongooseHidden = require('mongoose-hidden')({
        defaultHidden: {
            password: true
        }
    });
// refer: https://github.com/madhums/mongoose-user/blob/master/lib/mongoose-user.js

var userSchema = Schema({
    login: {
        type: String,
        required: true,
        unique: true
    }, //Ensure logins are unique.
    email: {
        type: String,
        required: true,
        unique: true
    }, //Ensure emails are unique.
    password: {
        type: String,
        required: true,
        hide: true
    }, //We'll store bCrypt hashed passwords.  Just say no to plaintext!
    fullName: String,
    role: String,
    preferredName: String,
    phone: String,
    phoneType: String,
    address: String,
    location: String,
    heardFrom: String,
    underGradSchool: {
        name: String,
        otherName: String,
        major: String,
        otherMajor: String
    },
    gradSchool: {
        name: String,
        otherName: String,
        major: String,
        otherMajor: String
    },
    primaryIndustry: {
        industryName: String,
        otherIndustryName: String,
        jobTitle: String,
        company: String,
        yearsOfExperience: String
    },
    secondaryIndustry: {
        industryName: String,
        otherIndustryName: String,
        jobTitle: String,
        company: String,
        yearsOfExperience: String
    },
    coachingInterest: String,
    studentMatchPreference: String,
    gender: String,
    preferredMeetingFormat: {
        call: Boolean,
        email: Boolean,
        skype: Boolean,
        inPerson: Boolean
    },
    linkedinProfileUrl: String,
    primaryReference: {
        name: String,
        phone: String,
        email: String,
        relationship: String,
        yearsKnown: String
    },
    secondaryReference: {
        name: String,
        phone: String,
        email: String,
        relationship: String,
        yearsKnown: String
    },
    studentList: String,
    studentsLinked: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],

    school: {
        name: String,
        otherName: String,
        major: String,
        currentYear: String
    },
    industry: {
        desired: String,
        interestedIn: String,
        secondary: String
    },
    previousJobs: String,
    secondPreviousJobs: String,
    additionalPersonalInfo: String,
    coachList: String,
    coachesLinked: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],

    creationDate: {
        type: Date
    },
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    lastLoginDate: {
        type: Date
    },
    lastModifiedDate: {
        type: Date,
        default: Date.now
    },
    meetings: [{
        type: Schema.Types.ObjectId,
        ref: 'Meeting'
    }],
    relationships: [{
        type: Schema.Types.ObjectId,
        ref: 'Relationship'
    }]
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
    // var hashedPwd = bcrypt.hashSync(user.password, crypto.getCryptLevel());

    var salt = bcrypt.genSaltSync(10);
    var hashedPwd = bcrypt.hashSync(user.password, salt);

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

userSchema.statics.findByEmail = function (email, callback) {
    this.find({
        email: email
    }, callback);
};

userSchema.statics.findByUsername = function (username, callback) {
    this.find({
        username: username
    }, callback);
};

userSchema.statics.findById = function (id, callback) {
    this.findOne({
        _id: id
    }, callback);

};

userSchema.statics.findAll = function (callback) {
    this.find({}, callback);

};

// userSchema.statics.findByIdAndMeetings = function (id, callback) {

//     var that = this;

//     this.findOne({
//         _id: id
//     }).populate({
//         path: 'meetings.meeting'
//     })
//         .exec(function (err, docs) {
//             debugger;

//             var options = {
//                 path: 'meetings.attendees',
//                 model: 'Attendee'
//             };

//             if (err) {
//                 console.log("500: error - findByIdAndMeetings")
//                 return callback(err);
//             }

//             that.populate(docs, options, function (err, users) {
//                 debugger;
//                 callback(null, users);
//             });
//         });
// }

userSchema.statics.findByIdAndMeetings = function (id, callback) {
    this.findOne({
        _id: id
    }).populate({
        path: 'meetings',
        select: '_creator topic location meetingdate attendees'
        // }).populate({
        //     path: 'meetings.attendees',
        //     model: Attendee
    }).populate({
        path: 'coachesLinked',
        select: 'fullName email phone college industry role gender experience city'
    }).populate({
        path: 'studentsLinked',
        select: 'fullName email phone college industry role gender experience city'
    })
        .exec(callback);
};

userSchema.statics.linkedCoach = function (id, callback) {
    this.findOne({
        _id: id
    }).populate({
        path: 'coachesLinked',
        select: 'fullName email phone college industry role gender experience city'
    })
        .exec(callback);
};

userSchema.statics.linkedStudents = function (id, callback) {
    this.findOne({
        _id: id
    }).populate({
        path: 'studentsLinked',
        select: 'fullName email phone college industry role gender experience city'
    })
        .exec(callback);
};

userSchema.statics.load = function (options, callback) {
    // this.find({}, callback);
    var criteria = options.criteria || {}
    var populate = options.populate || []
    var select = options.select || ''

    this.find(criteria)
        .select(options.select)
        .populate(options.populate)
        .exec(cb)
};

userSchema.statics.findByObjQuery = function (objQuery, display, callback) {
    console.log("---- findByObjQuery ----- ");
    console.dir(objQuery);
    // find({$or: [{role: 'coach'}]}, {fullName:1,role:1,city:1,industry:1})
    this.find(objQuery, display, callback);

    // find({$or: [{role: 'coach'}]}, {fullName:1,role:1,city:1,industry:1}).
};

userSchema.statics.removeMeetingFromSchemaById = function(id, meetingid, callback) {
    this.update(
    { _id: id},
    { $pull: { meetings: {_id: meetingid} } }, callback);
};

userSchema.statics.findAllCoaches = function(callback) {
    console.log("----findAllCoaches - unmatched -------");
    this.find({
        role: 'coach',
        studentsLinked: {$size: 0}
    }).exec(callback);
}
userSchema.statics.findEveryCoach = function(callback) {
   this.find({
        role: 'coach',
    }).exec(callback);
}
userSchema.statics.findEveryStudent = function(callback) {
    this.find({
        role: 'student',
        }).exec(callback);
}

var meetingSchema = Schema({
    _creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    topic: String,
    location: String,
    meetingdate: String,
    meetinglandmark: String,
    meetingtype: String, 
    attendees: [attendeeSchema]
});


meetingSchema.statics.findAll = function (callback) {
    // this.find({}, callback);
    this.find({}).populate({
        path: 'attendees',
        model: 'User',
        select: 'fullName email phone college industry role gender experience city'
    })
        .exec(callback);
};
meetingSchema.statics.findById = function (id, callback) {
    // this.find({}, callback);
    this.findOne({_id: id}).populate({
        path: 'attendees',
        model: 'User',
        select: 'fullName email phone college industry role gender experience city'
    })
        .exec(callback);
};

meetingSchema.statics.removeMeetingById = function (id, callback) {

    this.findOne({_id: id}).remove(callback);
};

meetingSchema.statics.updateMeetingById = function (id, time, topic, type, location, landmark, callback) {

    this.update({_id: id}, {$set: {topic: topic, location: location, meetingdate: time, landmark: landmark, meetingtype: type}}, callback);

};

var relationshipSchema = Schema({
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    coach: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    lastModifiedDate: {
        type: Date,
        default: Date.now
    },
    requestedDate: {
        type: Date,
        default: Date.now
    },
    connectStatus: {
        type: String,
        default: 'pending'
    },
    orientationStatus: {
        type: String,
        default: 'pending'
    },
    // meetings: [{
    //     type: Schema.Types.ObjectId,
    //     ref: 'Meeting'
    // }], // can be updated with meeting details in this collection
    completionStatus: {
        type: String,
        default: 'pending'
    }
});

relationshipSchema.statics.findConnectionPending = function (callback) {
    console.log("---- findConnectionPending ----- ");
    this.find({
        connectStatus: 'pending'
    }).populate({
        path: 'student',
        select: 'fullName email phone college industry role gender experience city'
    }).populate({
        path: 'coach',
        select: 'fullName email phone college industry role gender experience city'
    })
        .exec(callback);

};

relationshipSchema.statics.findOrientationPending = function (callback) {
    console.log("---- findOrientationPending ----- ");
    this.find({
        connectStatus: 'complete',
        orientationStatus: 'pending'
    }).populate({
        path: 'student',
        select: 'fullName email phone college industry role gender experience city'
    }).populate({
        path: 'coach',
        select: 'fullName email phone college industry role gender experience city'
    })
        .exec(callback);

};

relationshipSchema.statics.findOrientationProgress = function (callback) {
    console.log("---- findOrientationProgress ----- ");
    this.find({
        orientationStatus: 'progress'
    }).populate({
        path: 'student',
        select: 'fullName email phone college industry role gender experience city'
    }).populate({
        path: 'coach',
        select: 'fullName email phone college industry role gender experience city'
    })
        .exec(callback);

};

relationshipSchema.statics.findOrientationComplete = function (callback) {
    console.log("---- findOrientationComplete ----- ");
    this.find({
        orientationStatus: 'complete'
    }).populate({
        path: 'student',
        select: 'fullName email phone college industry role gender experience city'
    }).populate({
        path: 'coach',
        select: 'fullName email phone college industry role gender experience city'
    })
        .exec(callback);

};

relationshipSchema.statics.findCompletionPending = function (callback) {
    console.log("---- findCompletionPending ----- ");
    this.find({
        completionStatus: 'pending'
    }).populate({
        path: 'student',
        select: 'fullName email phone college industry role gender experience city'
    }).populate({
        path: 'coach',
        select: 'fullName email phone college industry role gender experience city'
    })
        .exec(callback);

};
relationshipSchema.statics.findById = function (id, callback) {
    this.findOne({
        _id: id
    }, callback);

};

var attendeeSchema = Schema({
    _id: false,
    attendee: {
        type: String,
        required: true,
        ref: 'User'
    }
})

var meetingNotesSchema = Schema({
    notesBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    meetingId: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Meeting'
    },
    notesCreator: String,
    attendee: String,
    interactionType: String,
    materialUsefulness:Number,
    topicAppropriateness:Number,
    timeUtilization: Number,
    collaborationDescription: String,
    nextCollaborationDescription: String,
    participationSentiment: String,
    speakWithStaff: String
});

meetingNotesSchema.statics.findAll = function(callback) {
    this.find({}, callback);
};
meetingNotesSchema.statics.findByUserAndMeetingId = function(userid, meetingid, callback) {
    this.findOne({
        meetingId: meetingid,
        notesBy: userid
    }, callback); 
};

meetingNotesSchema.statics.findAllByMeetingId = function(meetingid, callback) {
    this.find({
        meetingId: meetingid
    }).populate({
        path: 'notesBy',
        select: 'login email fullName role preferredName'
    }).exec(callback);

}

var industrySchema = new Schema({
    _id: false,
    field: String,
    specialty: [String]
}, {collection: 'industry'});

industrySchema.statics.findAll = function(callback) {
    this.find({},
            function(err, docs) {
                if (!err){ 
                    // console.log(docs);
                }
                else { throw err;}

                }).exec(callback);
};

var schoolSchema = new Schema({
    _id: false,
    name: String
}, {collection: 'school'});

schoolSchema.statics.findAll = function(callback) {
    this.find({},
            function(err, docs) {
                if (!err){ 
                    // console.log(docs);
                }
                else { throw err;}

                }).exec(callback);
};

var majorSchema = new Schema({
    _id: false,
    name: String
}, {collection: 'major'});

majorSchema.statics.findAll = function(callback) {
    this.find({},
            function(err, docs) {
                if (!err){ 
                    //console.log(docs);
                }
                else { throw err;}

                }).exec(callback);
};

var Meeting = mongoose.model('Meeting', meetingSchema);
var User = mongoose.model('User', userSchema);
var Attendee = mongoose.model('Attendee', attendeeSchema);
var MeetingNotes = mongoose.model('MeetingNotes', meetingNotesSchema);
var Relationship = mongoose.model('Relationship', relationshipSchema);
var Industry = mongoose.model('Industry', industrySchema);
var School = mongoose.model('School', schoolSchema);
var Major = mongoose.model('Major', majorSchema);

module.exports.Meeting = Meeting;
module.exports.User = User;
module.exports.MeetingNotes = MeetingNotes;
module.exports.Industry = Industry;
module.exports.School = School;
module.exports.Major = Major;
