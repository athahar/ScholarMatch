define([
        "jquery",
        "view"
    ],
    function ($, View) {

        "use strict";

        var MatchView = View.extend({
            events: {},
            afterRender: function () {
                // call super method first
                View.prototype.afterRender.call(this);
                console.log("MatchView");
            }
        });

        return MatchView;
    });