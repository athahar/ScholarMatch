/**
 * Library to send email notification
 */
'use strict';


// TODO: Use this -  https://github.com/andris9/nodemailer-html-to-text

var emailContent = function () {

    // Use email templates to build the template - https://github.com/niftylettuce/node-email-templates

    this.welcomeUser = function (userName, role) {

        var html = "Hello " + userName + "," + "<br/>" + "Welcome to ScholarMatch " + "<br/>" + "<br/>" + " - ScholarMatch team";

        return html;
    };

    this.createMeeting = function (inviteCreator, invited, meeting) {

        var html = "Hello " + inviteCreator.fullName + " and " + invited.fullName + "," + "<br/>" + "You both have a meeting scheduled" + " on : " + meeting.meetingdate + " at " + meeting.meetinglocation + ", Landmark (" + meeting.meetinglandmark + ")." + "<br/>" + "<br/>" + inviteCreator.fullName + "'s phone number : " + inviteCreator.phone + "<br/>" + invited.fullName + "'s phone number : " + invited.phone + ". " + "<br/>" + "If you can't make it please reply to this email." + "<br/>" + "<br/>" + "Topic of discussion : " + meeting.meetingTopic + "<br/>" + "<br/>" + " - ScholarMatch team";

        return html;
    };

    this.createMeetingCancelled = function (meeting) {

        var html = "Hello, " + "<br/>" + "Your meeting scheduled" + " on : " + meeting.meetingdate + " at " + meeting.location + ", has been cancelled" ;

        return html;
    };

    this.createMeetingText = function (inviteCreator, invited, meeting) {

        var text = "Hello " + inviteCreator.fullName + " and " + invited.fullName + "," +
            +"You both have a meeting scheduled" + " on : " + meeting.meetingdate + " " + meeting.meetingtime + " at " + meeting.meetinglocation + "." + inviteCreator.fullName + "'s phone number : " + inviteCreator.phone + "; " + invited.fullName + "'s phone number : " + invited.phone + ". " + "If you can't make it please reply to this email."

        return text;
    };

    this.createMeetingCancelledText = function (meeting) {

        var text = "Hello, " + "Your meeting scheduled" + " on : " + meeting.meetingdate  + " at " + meeting.location + " has been cancelled";
        return text;
    };

    this.matchSuccessText = function (student, coach) {

        var text = "Hello " + student.fullName + " and " + coach.fullName + "," +
            +"Congratulations!! You both have been paired as a part of ScholarMatch's College 2 career program. " + student.fullName + "'s phone number : " + student.phone + "; " + coach.fullName + "'s phone number : " + coach.phone + ". " + "Feel free to start communicating with each other."

        return text;

    }

    this.matchSuccess = function (student, coach) {

        var text = "Hello " + student.fullName + " and " + coach.fullName + "," + "<br/>" + "Congratulations!! You both have been paired as a part of ScholarMatch's College 2 career program. " + "<br/>" + "<br/>" + student.fullName + "'s phone number : " + student.phone + "; " + coach.fullName + "'s phone number : " + coach.phone + ". " + "<br/>" + "<br/>" + "Feel free to start communicating with each other." + "<br/>" + "<br/>" + " - ScholarMatch team";

        return text;

    }

    this.resetPassword = function (req, token) {
        var html = 'You are receiving this because you (or someone else) have requested the reset of the password for your account.' + "<br/>" + "<br/>" +
            'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
            '<a href="http://' + req.headers.host + '/login/reset/' + token + '">Reset Password</a>' + "<br/>" + "<br/>" +
            'If you did not request this, please ignore this email and your password will remain unchanged.\n';
        return html;
    }

    this.passwordChanged = function () {
        var html = 'This is to confirm you have changed your password. ' + "<br/>" + "<br/>" + " - ScholarMatch team";
        return html;
    }


    this.orientationMeeting = function (student, coach, meetingDate) {
        var html = "Dear " + student.name + " &amp; " + coach.name + ". <br/>" + "As a first step of our career connection program, we will have an orientation call with both of you introducingeach other, and set the expectations by ScholarMatch staff on " + meetingDate + ". <br/> Conference dialin: 650-123-1234, passcode: 1111 " + "<br/><br/>" + " - ScholarMatch team";
        return html;
    }
};

module.exports = new emailContent();
