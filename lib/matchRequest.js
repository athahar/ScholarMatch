'use strict';

var mongoose = require('mongoose'),
    MatchRequest = mongoose.model("MatchRequest");

var MatchRequestLibrary = function () {
    return {

        requestConnection: function (studentid, coachid, callback) {
            debugger;

            var matchingRequest = new MatchRequest({
                student: studentid,
                coach: coachid,
                status: 'pending' // new request                
            })

            matchingRequest.save(function (err, result) {
                if (err) {
                    callback(err);
                } else {
                    callback(null, result);
                }
            });

        },
        showPendingConnections: function (callback) {
            debugger;

            MatchRequest.findPending(function (err, result) {
                if (err) {
                    callback(err);
                } else {
                    callback(null, result);
                }
            });
        },
        approveConnection: function (matchingRequestId, callback) {
            debugger;

            var query = {
                "_id": matchingRequestId
            };
            var update = {
                status: 'complete'
            };
            var options = {
                new: true
            };

            MatchRequest.findOneAndUpdate(query, update, options).populate({
                path: 'student',
                select: 'fullName email phone college industry role gender experience city'
            }).populate({
                path: 'coach',
                select: 'fullName email phone college industry role gender experience city'
            })
                .exec(callback);
        },
        rejectConnection: function (matchingRequestId, callback) {
            debugger;

            var query = {
                "_id": matchingRequestId
            };
            var update = {
                status: 'rejected'
            };
            var options = {
                new: true
            };

            MatchRequest.findOneAndUpdate(query, update, options).populate({
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

module.exports = MatchRequestLibrary;