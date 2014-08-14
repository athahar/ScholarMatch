'use strict';

// todo: use plugin for last modified from this example 
//  http://mongoosejs.com/docs/plugins.html


// Mistakes You’re Probably Making With MongooseJS, And How To Fix Them
// http://thecodebarbarian.wordpress.com/2013/06/06/61/


// http://jaketrent.com/post/mongoose-population/ 

var ContactModel = require('../../models/contact');

var mongoose = require('mongoose');
var schemas = require('../../models/schemas');
var User = mongoose.model("User");
var Meeting = mongoose.model("Meeting");

module.exports = function (router) {

    var model = new ContactModel();

    router.get('/saveperson', function (req, res) {

        var name = req.query["name"],
            age = req.query["age"];

        var person = new User({
            name: name,
            age: age
        });

        person.save(function (err, resp) {

            debugger;

            if (err) {
                return console.log(err);
            }

            console.log(" person save done .. now meeting ");
            var meeting = new Meeting({
                title: "New meeting - " + Date.now(),
                _creator: person._id, // assign the _id from the person
                attendees: [person._id, '53e49b374083ea4a50e37889'],
            });

            meeting.save(function (err) {
                if (err) return console.log(err);
                // thats it!
                console.log(" all done");
                person.meetings.push(meeting);
                person.studentsLinked.push('53e49fdc186527f555dae5cb', '53e49b503159307550e01f9f');
                person.save(function (err) {

                    if (err) return console.log(err);

                    res.send(person);
                });

            });
        })


        // res.render('contact/index', model);

    });






    router.get('/getAllMeetings', function (req, res) {

        var meetings = {};

        var personName = new RegExp(req.query["name"] || 'arun', 'i');
        // var title = req.query["title"] ;

        // var query = {_creator[name]: personName};

        var populateQuery = [{
            path: '_creator',
            select: 'name age'
        }, {
            path: 'attendees',
            select: 'name age'
        }];

        Meeting
            .find({})
            .populate(populateQuery)
        // .populate({
        //     path: '_creator',
        //     select: 'name age',
        //     // match: { age: { $gte: 21 }}
        // }) // only return the Users name
        // .populate({
        //   path: 'attendees',
        //   // match: { age: { $lte: 21 }},
        //   select: 'name age -_id',
        //   options: { limit: 15 }
        // })
        .exec(function (err, meetings) {

            debugger;
            if (err) return console.log(err);

            res.send(meetings);
        })



        // Meeting.find(function (err, meetings) {
        //        if (err) return console.error(err);
        //      console.dir(meetings)
        //      res.send(meetings);
        //    })

    });


    router.get('/getdata', function (req, res) {

        // populate the
        Meeting
            .findOne({
                title: 'Once upon a timex.'
            })
            .populate('_creator')
            .exec(function (err, meeting) {
                if (err) return console.log(err);
                console.log('The creator is %s', meeting._creator.name);
                // prints "The creator is Aaron"
                res.send(meeting);
            })


    });


    router.get('/findlinked', function (req, res) {


        var populateQuery = [{
            path: 'studentsLinked',
            select: 'name age meetings'
        }, {
            path: 'meetings',
            select: 'title attendees'
        }, {
            path: 'studentsLinked.meetings',
            select: 'title attendees'
        }];
        var userid = req.query["id"] || '53e4a5869dfaee175c3657cd'

        // populate the
        User
            .findOne({
                _id: userid
            })
            .populate(populateQuery)
        // .populate('studentsLinked meetings attendees attendees.name') 
        .exec(function (err, person) {


            if (err) return console.log(err);
            // console.log('The creator is %s', person._creator.name);
            // prints "The creator is Aaron"
            console.log('person : ', person);
            res.send(person);



            // Meeting
            // .populate(person.meetings) 
            // .exec(function (err, attendees) {

            //   console.log('attendees : ' , attendees);

            //   person.meetings.attendees = attendees;
            //   res.send(person);            

            // })
        })


    });


    router.get('/findperson', function (req, res) {

        var personName = new RegExp(req.query["name"] || 'arun', 'i');
        // var title = req.query["title"] ;

        var query = {
            name: personName
        }

        var populateQuery = [{
            path: '_creator',
            select: 'name age'
        }, {
            path: 'attendees',
            select: 'name age'
        }];

        User.find(query)
            .lean()
        // .populate({ path: 'meetings' })
        .populate(populateQuery)
            .exec(function (err, docs) {

                var options = {
                    path: 'meetings.attendees'
                    // model: 'attendees'
                };

                if (err) return res.json(500);
                Meeting.populate(docs, options, function (err, meetings) {
                    res.json(meetings);
                });
            })

        // User
        // .find(query)
        // // .populate('meetings') // only works if we pushed refs to children
        // .populate({
        //   path: 'meetings',
        //   // match: { age: { $lte: 21 }},
        //   select: '_creator',
        //   options: { limit: 15 }
        // })
        // .populate({
        //   path: '_creator',
        //   // match: { age: { $lte: 21 }},
        //   select: 'name age -_id',
        //   options: { limit: 15 }
        // })
        // .exec(function (err, persons) {
        //   if (err) return console.log(err);
        //   console.log(persons);
        //   res.send(persons);
        // })


    });


    router.get('/search', function (req, res) {

        var titledesc = new RegExp(req.query["title"], 'i');
        // var title = req.query["title"] ;

        var query = {
            title: titledesc
        }

        // ref : http://mongoosejs.com/docs/populate.html

        Meeting
            .find(query)
            .populate({
                path: '_creator',
                select: 'name age'
                // match: { age: { $gte: 21 }}
            }) // only return the Users name
        .populate({
            path: 'attendees',
            // match: { age: { $lte: 21 }},
            select: 'name age -_id',
            options: {
                limit: 15
            }
        })
            .exec(function (err, meetings) {

                debugger;
                if (err) return console.log(err);

                // meetings.
                // console.log('The creator is %s', meeting._creator.name);
                // // prints "The creator is Aaron"

                // console.log('The creators age is %s', meeting._creator.age);
                // // prints "The creators age is null'

                res.send(meetings);
            })

    });
};