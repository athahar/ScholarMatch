/**
 * Library to send email notification
 */
'use strict';


var mongoosePlugins = function() {


  this.createdPlugin = function(schema, options) {
    schema.add({
      createdDate: {
        type: Date,
        default: Date.now
      },
      createdBy: {
        type: Schema.ObjectId,
        ref: options.userModel // 'User'
      }
    });

    schema.virtual('dateCreated').get(function() {
      return this.createdDate.toDateString() + ' ' + this.createdDate.getHours() + ':' + ('0' + this.createdDate.getMinutes()).slice(-2);
    });

    schema.pre('save', function(next, req) {
      if (this.isNew) {
        this.createdDate = new Date();
      }
      next();
    });
  }

}

module.exports = new mongoosePlugins();