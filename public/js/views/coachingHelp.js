define([
        "jquery",
        "view"
    ],
    function ($, View) {

        "use strict";

        var CoachingHelpView = View.extend({
            events: {},
            afterRender: function () {
                // call super method first
                View.prototype.afterRender.call(this);
                console.log("CoachingHelpView");
            }
        });

        return CoachingHelpView;
    });