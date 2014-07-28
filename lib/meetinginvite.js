/**
 * Library to send email notification
 */
'use strict';


var meetinginvite = function() {
   
    // Use email templates to build the template - https://github.com/niftylettuce/node-email-templates

    this.buildHTMLInvite = function(student, coach, meeting) {
        
        var html = "Hello " + student.name  + " and " + coach.name + "," + "<br/>" 
                   + "You both have a meeting scheduled"
                   + " on : " + meeting.meetingdate + " " + meeting.meetingtime 
                   + " at " + meeting.meetinglocation + "."
                   + "<br/>" + "<br/>" 
                   + student.name + "'s phone number : " + student.phone + "<br/>" 
                   + coach.name + "'s phone number : " + coach.phone + ". " + "<br/>" 
                   + "If you can't make it please reply to this email." 
                   + "<br/>" + "<br/>" 
                   + "Topic of discussion : " + meeting.meetingTopic 
                   + "<br/>" + "<br/>" 
                   +" - ScholarMatch team";

        return html;         
    };

    this.buildTextInvite = function(student, coach, meeting) {
        
        var text = "Hello " + student.name  + " and " + coach.name + "," + 
                   + "You both have a meeting scheduled"
                   + " on : " + meeting.meetingdate + " " + meeting.meetingtime 
                   + " at " + meeting.meetinglocation + "."                   
                   + student.name + "'s phone number : " + student.phone + "; " 
                   + coach.name + "'s phone number : " + coach.phone + ". "
                   + "If you can't make it please reply to this email."

        return text;         
    };
};

module.exports = new meetinginvite();
