define([
        "jquery",
        "view"
    ],
    function ($, View) {

        "use strict";

        var ProfileView = View.extend({
            events: {},
            afterRender: function () {
                // call super method first
                View.prototype.afterRender.call(this);
                console.log("ProfileView");
            }
        });

        return ProfileView;
    });