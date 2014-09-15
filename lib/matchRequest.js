'use strict';

var mongoose = require('mongoose'),
    Relationship = mongoose.model("Relationship"),
    User = mongoose.model("User");

var RelationshipLibrary = function () {
    return {

        requestConnection: function (studentid, coachid, callback) {
            // debugger;

            var relationship = new Relationship({
                student: studentid,
                coach: coachid,
                connectStatus: 'pending' // new request                
            })

            relationship.save(function (err, result) {
                if (err) {
                    callback(err);
                } else {
                    callback(null, result);
                }
            });

        },
        showConnectionPending: function (callback) {
            // debugger;

            Relationship.findConnectionPending(function (err, result) {
                if (err) {
                    callback(err);
                } else {
                    callback(null, result);
                }
            });
        },
        showOrientationPending: function (callback) {
            // debugger;

            Relationship.findOrientationPending(function (err, result) {
                if (err) {
                    callback(err);
                } else {
                    callback(null, result);
                }
            });
        },
        showOrientationProgress: function (callback) {
            // debugger;

            Relationship.findOrientationProgress(function (err, result) {
                if (err) {
                    callback(err);
                } else {
                    callback(null, result);
                }
            });
        },
        showOrientationComplete: function (callback) {
            // debugger;

            Relationship.findOrientationComplete(function (err, result) {
                if (err) {
                    callback(err);
                } else {
                    callback(null, result);
                }
            });
        },
        approveConnection: function (relationshipId, callback) {
            // debugger;

            var query = {
                "_id": relationshipId
            };
            var update = {
                connectStatus: 'complete',
                orientationStatus: 'pending'
            };
            var options = {
                new: true
            };

            Relationship.findOneAndUpdate(query, update, options).populate({
                path: 'student',
                select: 'fullName email phone college industry role gender experience city'
            }).populate({
                path: 'coach',
                select: 'fullName email phone college industry role gender experience city'
            })
                .exec(callback);
        },
        setupOrientation: function (relationshipId, callback) {
            // debugger;

            var query = {
                "_id": relationshipId
            };
            var update = {
                orientationStatus: 'progress'
            };
            var options = {
                new: true
            };

            Relationship.findOneAndUpdate(query, update, options).populate({
                path: 'student',
                select: 'fullName email phone college industry role gender experience city'
            }).populate({
                path: 'coach',
                select: 'fullName email phone college industry role gender experience city'
            })
                .exec(callback);
        },
        completeOrientation: function (relationshipId, callback) {
            // debugger;

            var query = {
                "_id": relationshipId
            };
            var update = {
                orientationStatus: 'completed'
            };
            var options = {
                new: true
            };

            Relationship.findOneAndUpdate(query, update, options).populate({
                path: 'student',
                select: 'fullName email phone college industry role gender experience city'
            }).populate({
                path: 'coach',
                select: 'fullName email phone college industry role gender experience city'
            })
                .exec(callback);
        },
        completeRelationship: function (relationshipId, callback) {
            // debugger;

            var query = {
                "_id": relationshipId
            };
            var update = {
                completionStatus: 'completed'
            };
            var options = {
                new: true
            };

            Relationship.findOneAndUpdate(query, update, options).populate({
                path: 'student',
                select: 'fullName email phone college industry role gender experience city'
            }).populate({
                path: 'coach',
                select: 'fullName email phone college industry role gender experience city'
            })
                .exec(callback);
        },
        rejectConnection: function (relationshipId, callback) {
            // debugger;

            var query = {
                "_id": relationshipId
            };
            var update = {
                status: 'rejected'
            };
            var options = {
                new: true
            };

            Relationship.findOneAndUpdate(query, update, options).populate({
                path: 'student',
                select: 'fullName email phone college industry role gender experience city'
            }).populate({
                path: 'coach',
                select: 'fullName email phone college industry role gender experience city'
            })
                .exec(callback);
        }

    };
};

module.exports = RelationshipLibrary;