define([
        "jquery",
        "view"
    ],
    function ($, View) {

        "use strict";

        var SignupView = View.extend({
            events: {},
            afterRender: function () {
                // call super method first
                View.prototype.afterRender.call(this);
                console.log("SignupView");
            }
        });

        return SignupView;
    });