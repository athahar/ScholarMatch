'use strict';


var MeetingInviteModel = require('../../models/meeting-invite'),
	email = require('../../lib/email'),
	meetinginvite = require('../../lib/meetinginvite');;


module.exports = function (router) {

    var model = new MeetingInviteModel();


    router.get('/', function (req, res) {
        
        res.render('meeting-invite/index', model);
        
    });

     router.get('/sendmail', function (req, res) {
        
     	var student = {
     		name: 'Athahar Mohammed',
     		phone: '408-123-1234',
     		email: 'athahar@gmail.com'     		
     	};
     	var coach = {
     		name: 'Zach Merill',
     		phone: '408-211-2111',
     		email: 'athahar@yahoo.com'     		
     	};
     	var meeting = {
     		meetingdate : '12/Aug/2014',
     		meetingtime : '10:10AM PDT',
     		meetinglocation : 'Starbucks - Rivermark Plaza, Santa Clara, CA',
			meetingTopic : 'LinkedIn Resume Discussion'
     	}

     	var senderslist = new Array();
     	senderslist.push(student.email);
     	senderslist.push(coach.email);

        var options = {        	
            to: senderslist.toString(),
            subject: 'Coach/Student meeting - ' + meeting.meetingTopic, // Subject line
            text: meetinginvite.buildTextInvite(student, coach, meeting), // plaintext body
            html: meetinginvite.buildHTMLInvite(student, coach, meeting)  // html body
        }
        
        email.sendEmail(options, function(err, result){

        	if(err){
        		console.log(err);
        		model.messages = err;        		
        		res.render('meeting-invite/index', model);
        	}else{
        		console.log(result);
        		model.emailSent = model.emailSent || {};
        		model.emailSent = {
        			"student" : student,
        			"coach" : coach,
        			"meeting" : meeting
        		};

        		console.dir(model);
        		res.render('meeting-invite/emailSent', model);
        	}
        })

    });

};
