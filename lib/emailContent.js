/**
 * Library to send email notification
 */
'use strict';


// TODO: Use this -  https://github.com/andris9/nodemailer-html-to-text

var emailContent = function () {

    // Use email templates to build the template - https://github.com/niftylettuce/node-email-templates

    this.welcomeUser = function (userName, role) {
        //if student signed up, send the student email, else send coach email
        if(role.toUpperCase() == "STUDENT"){
            var html = "Congratulations, " + userName + "!" + " We have received your request to participate in Career Connections. Thank you for your interest!" + 
                "<br /><br />" + 
                "This is an opportunity for you to partner with a professional who works in your future career and allows you to ask all of your questions about the industry. " +
                    "All of our Career Coach volunteers believe in you as a student and want to invest in your professional development." + 
                    "<br /><br />" + 
                    "Before you are eligible to be matched with a Career Coach, here are the next steps:" + 
                    "<br />" + 
                    "<ol>" + 
                        "<li>Read and complete the Pre-Orientation Homework assignment (" + "<a href='http://scholarmatch.org/wordpress/wp-content/uploads/2014/05/C2C-Info-Page.pdf' target='_blank'>click here</a>)</li>" +
                        "<li>Briefly review the Student Manual to see which career sessions seem useful to you. (<a href='http://scholarmatch.org/wordpress/wp-content/uploads/2014/06/Training-Manual-Student.pdf' target='_blank'>click here</a>)</li>" +
                        "<li>"+"Respond to this email with:" +
                            "<ul>" + 
                                "<li>Answers to the Pre-Orientation questions (found in the link in #1)</li>" +
                                "<li>Three questions that you plan to ask your Career Coach</li>" + 
                                "<li>Your availability to schedule an Orientation call with ScholarMatch staff. <i>**Include 3 different time slots for a 1-hour conversation. During this call, we will review your homework answers, speak about how to partner with your Career Coach, and discuss program details.</i></li>" +
                            "</ul>" +
                        "</li>" +
                    "</ol>" +
                    "<br />" +
                    "We are excited for you to participate in this program!" + "<br /><br />" +
                    "Questions? <a href='mailto:c2c@scholarmatch.org?Subject=Career Connections Question'>Email Us</a> or call (415) 652 - 2766." +
                    "<br /><br />" +
                    "Warmly, <br /> The ScholarMatch Team";
        }
        else{
            var html = "Congratulations, " + userName + "!" + " We have received your request to participate in Career Connections. Thank you for your interest!" + "<br /><br />" + 
                "This is a meaningful opportunity for you to partner with a college student who is interested in your profession or career field. " + 
                    "Thank you for believing in our students and investing in their professional development. Our students are low-income, under-resourced, and determined young adults who lack a professional network. " +
                    "Your guidance and support will be the critical link these students need gain professional skills and boost their confidence before they embark on their careers." + 
                    "<br /><br />" + 
                    "Before the match can begin, here are the next steps:" + 
                    "<br /><br />" + 
                    "<ol>" + 
                        "<li>Briefly review the Career Coach Manual (<a href='http://scholarmatch.org/wordpress/wp-content/uploads/2014/06/Training-Manual-Career-Coach.pdf' target='_blank'>click here</a>)</li>" +
                        "<li>Respond to this email with your availability for the next 2 weeks for a 20-minute Orientation Call. " +
                            "This call will review the program, expectations, and answer any questions that you have about becoming a Career Coach.</li>" +
                    "</ol>" +
                    "<br /><br />" +
                    "We look forward to partnering with you!" + "<br /><br />" +
                    "Questions? <a href='mailto:c2c@scholarmatch.org?Subject=Career Connections Question'>Email Us</a> or call (415) 652 - 2766." +
                    "<br /><br />" +
                    "Warmly, <br /> The ScholarMatch Team";
        }

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

        var text = "Congratulations " + student.fullName + " and " + coach.fullName + "," +
            +"You have been officially matched as a Career Coach and aspiring Student. We are excited to see this partnership grow." + 
            "<br /><br />" +
            "Before your interactions begin, we want to introduce you to each other. Therefore, we need to schedule a brief, 15-minute Introduction Call to 'meet.'"+
                " During this call we will also set goals and decide on the best professional skills to work on together. " +
            "<br /><br />" +
            "Please respond to this email with at least 3 large time slots that work with your schedule within the next 2 weeks." +
            "<br /><br />" +
            "Have a great day!" +
            "<br /><br />" +
             "Questions? <a href='mailto:c2c@scholarmatch.org?Subject=Career Connections Question'>Email Us</a> or call (415) 652 - 2766." +
                    "<br /><br />" +
                    "Warmly, <br /> The ScholarMatch Team";

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
