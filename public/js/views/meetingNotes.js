define([
        "jquery",
        "view"
    ],
    function ($, View) {

        "use strict";

        var MeetingNotesView = View.extend({
            events: {},
            afterRender: function () {
                // call super method first
                View.prototype.afterRender.call(this);
                console.log("MeetingNotesView");
            }
        });

        return MeetingNotesView;
    });