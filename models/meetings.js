'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var meetingsModel = function() {

  var meetingsSchema = new Schema({
    _id: { type: String},
    topic: { type: String, default: '' },
    location: { type: String, default: '' },
    time: { type: Date },
    attendees: Array // ref: https://github.com/backjo/OrganizationManager/blob/5fd7a9ba0507d1cacc441c55f98b44f00ad7524d/models/Meeting.js
    created : { type : Date, default: Date.now },
    lastModifiedDate: { type : Date, default: Date.now }
  });

  // Validations
  meetingsSchema.path('date').validate(function(v) {
    now = new Date();
    return v > now;
  }, 'Meeting date should be in the future');


  meetingsSchema.pre('save', function(next) {
    console.log('Saving Meeting', this);
    next();
  });




  /**
   * ref: https://github.com/chamerling/meeting-bot/blob/0a81843e61337e3c377e72e3dc562b3307b17d2e/app/models/meeting.js
   *   
   * Statics
   *
   * @type {{load: Function, list: Function}}
   */
  meetingsSchema.statics = {

    /**
     * Find meeting by id
     *
     * @param {ObjectId} id
     * @param {Function} cb
     * @api private
     */
    load: function(id, cb) {
      this.findOne({
        _id: id
      })
        .exec(cb)
    },

    /**
     * Get a list of meetings based on criteria
     *
     * @param options
     * @param cb
     */
    list: function(options, cb) {
      var criteria = options.criteria || {}

      this.find(criteria)
        .sort({
          'created': -1
        }) // sort by date
      .limit(options.perPage)
        .skip(options.perPage * options.page)
        .exec(cb)
    },

    /**
     * Get the current meeting ie the last one which is started by not ended...
     *
     * @param cb callback with err, meeting
     */
    current: function(cb) {
      this.findOne({
        'stop': null
      }).exists('start').sort({
        'created': -1
      }).exec(cb);
    },

    // db.collection.find( { field: { $gt: value1, $lt: value2 } } );

    /**
     * Update the meeting with the input data
     *
     * @param id
     * @param data
     * @param cb
     */
    update: function(id, data, cb) {
      this.findByIdAndUpdate(id, data, cb);
    }
  }


  mongoose.model('Meetings', meetingsSchema);
};


module.exports = new meetingsModel();