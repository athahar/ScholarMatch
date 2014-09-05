define([
        "jquery",
        "view"
    ],
    function ($, View) {

        "use strict";

        var MeetingInviteView = View.extend({
            events: {},
            afterRender: function () {
                // call super method first
                View.prototype.afterRender.call(this);
                console.log("MeetingInviteView");
            }
        });

        return MeetingInviteView;
    });