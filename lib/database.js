/**
 * A custom library to establish a database connection
 */
'use strict';
var mongoose = require('mongoose');

var db = function () {
    return {

        /**
         * Open a connection to the database
         * @param conf
         */
        config: function (conf) {


            var uristring = 
                  process.env.MONGOLAB_URI || 
                  process.env.MONGOHQ_URL || 
                  'mongodb://' + conf.host + '/' + conf.database;

            console.log("process.env.MONGOLAB_URI: " + process.env.MONGOLAB_URI);
            console.log("process.env.MONGOHQ_URL: " + process.env.MONGOHQ_URL);
            
            mongoose.connect(uristring);    
            
            var db = mongoose.connection;
            db.on('error', console.error.bind(console, 'connection error:'));
            db.once('open', function callback() {
                console.log('db connection open');
            });
        }
    };
};

module.exports = db();
