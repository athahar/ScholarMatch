/**
 * Library to send email notification
 */
'use strict';


var meetinginvite = function () {

    // Use email templates to build the template - https://github.com/niftylettuce/node-email-templates

    this.buildHTMLInvite = function (inviteCreator, invited, meeting) {

        var html = "Hello " + inviteCreator.fullName + " and " + invited.fullName + "," + "<br/>" + "You both have a meeting scheduled" + " on : " + meeting.meetingdate + " " + meeting.meetingtime + " at " + meeting.meetinglocation + "." + "<br/>" + "<br/>" + inviteCreator.fullName + "'s phone number : " + inviteCreator.phone + "<br/>" + invited.fullName + "'s phone number : " + invited.phone + ". " + "<br/>" + "If you can't make it please reply to this email." + "<br/>" + "<br/>" + "Topic of discussion : " + meeting.meetingTopic + "<br/>" + "<br/>" + " - ScholarMatch team";

        return html;
    };

    this.buildTextInvite = function (inviteCreator, invited, meeting) {

        var text = "Hello " + inviteCreator.fullName + " and " + invited.fullName + "," +
            +"You both have a meeting scheduled" + " on : " + meeting.meetingdate + " " + meeting.meetingtime + " at " + meeting.meetinglocation + "." + inviteCreator.fullName + "'s phone number : " + inviteCreator.phone + "; " + invited.fullName + "'s phone number : " + invited.phone + ". " + "If you can't make it please reply to this email."

        return text;
    };
};

module.exports = new meetinginvite();