
'use strict';

// todo: use plugin for last modified from this example 
//  http://mongoosejs.com/docs/plugins.html

var ContactModel = require('../../models/contact');

var mongoose = require('mongoose');
var schemas = require('../../models/schemas');
var Person = mongoose.model("Person");
var Story = mongoose.model("Story");

module.exports = function(router) {

    var model = new ContactModel();


    router.get('/saveperson', function(req, res) {


    	var name = req.query["name"],
    		age = req.query["age"];


        var person = new Person({
            name: name,
            age: age
        });

	

        person.save(function(err, resp) {

        	debugger;

            if (err) {
            	console.log(err);
            	return;
            } 

            console.log(" person save done .. now story ");
            var story2 = new Story({
                title: "new again upon a magic time.",
                _creator: person._id, // assign the _id from the person
                fans:[person._id, '53e48a428abc4c2e3c24b61a']
            });

            story2.save(function(err) {
                if (err) return console.log(err);
                // thats it!
                console.log(" all done");
                person.stories.push(story2);
                person.save(function(err){

                      if (err) return console.log(err);

                    res.send(person);    
                });
                
            });
        })


        // res.render('contact/index', model);

    });


    router.get('/getAllStories', function(req, res) {

    	var stories = {};


    	Story.find(function (err, stories) {
            if (err) return console.error(err);
          console.dir(stories)
          res.send(stories);
        })
    	
    	// Story.find({}, function (err, story) {
    	// 	if(err){
    	// 		return console.log(err);
    	// 	}
    	// 	debugger;
	    //     stories[story._id] = story;
	    //     res.send(stories);
	    // });

  //   	// populate the
  //   	Story
		// .findOne({ title: 'Once upon a timex.' })
		// .populate('_creator') 
		// .exec(function (err, story) {
		//   if (err) return console.log(err);
		//   console.log('The creator is %s', story._creator.name);
		//   // prints "The creator is Aaron"
		//   res.send(story);
		// })
        

    });


    router.get('/getdata', function(req, res) {

    	// populate the
    	Story
		.findOne({ title: 'Once upon a timex.' })
		.populate('_creator') 
		.exec(function (err, story) {
		  if (err) return console.log(err);
		  console.log('The creator is %s', story._creator.name);
		  // prints "The creator is Aaron"
		  res.send(story);
		})
        

    });


    router.get('/findperson', function(req, res) {

         var personName = new RegExp(req.query["name"] || 'arun', 'i');
     // var title = req.query["title"] ;

      var query = {name: personName}

        Person
        .find(query)
        .populate('stories') // only works if we pushed refs to children
        .exec(function (err, persons) {
          if (err) return console.log(err);
          console.log(persons);
          res.send(persons);
        })
        

    });




    router.get('/search', function(req,res){


        // var storydesc = req.query["s"] || 'time',
        //     regexStory = new RegExp('^'+storydesc+'$', "i");

        // Story.findOne({name: new RegExp('^'+storydesc+'$', "i")}, function(err, doc) {
        //   //Do your action here..
        // });


      // var query = { description: /req.query["title"]/i };

     var titledesc = new RegExp(req.query["title"], 'i');
     // var title = req.query["title"] ;

      var query = {title: titledesc}

    // ref : http://mongoosejs.com/docs/populate.html

        Story
        .find(query)
        .populate({
            path: '_creator',
            select: 'name age',
            match: { age: { $gte: 21 }}
        }) // only return the Persons name
        .populate({
          path: 'fans',
          match: { age: { $lte: 21 }},
          select: 'name age -_id',
          options: { limit: 15 }
        })
        .exec(function (err, stories) {

            debugger;
          if (err) return console.log(err);
          
          // stories.
          // console.log('The creator is %s', story._creator.name);
          // // prints "The creator is Aaron"
          
          // console.log('The creators age is %s', story._creator.age);
          // // prints "The creators age is null'

          res.send(stories);
        })

    });
};