/**
 * Library to send email notification
 */
'use strict';
var nodemailer = require("nodemailer");

var email = function() {
    

    // create reusable transport method (opens pool of SMTP connections)
    var smtpTransport = nodemailer.createTransport("SMTP",{
        service: "Gmail",
        auth: {
            user: "notifications.scholarmatch@gmail.com",
            pass: "scholar321q"
        }
    });    

    this.sendEmail = function(options, callback) {
        
        var mailOptions = {
            from: "ScholarMatch <notifications.scholarmatch@gmail.com>", // sender address
            to: options.to, // list of receivers
            cc: "notifications.scholarmatch@gmail.com", // always send cc to Scholarmatch
            subject: options.subject, // Subject line
            text: options.text , // plaintext body
            html: options.html  // html body
        }
        
        // send mail with defined transport object
        smtpTransport.sendMail(mailOptions, function(error, response){
            if(error){
              console.log('Message error' + error);
                return callback(error);
            }else{
              console.log("Message sent: " + response.message);
              callback(null, 'emailSent')                
            }

            // if you don't want to use this transport object anymore, uncomment following line
            //smtpTransport.close(); // shut down the connection pool, no more messages
        });
    };
};

module.exports = new email();
