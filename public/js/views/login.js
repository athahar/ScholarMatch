define([
        "jquery",
        "view"
    ],
    function ($, View) {

        "use strict";

        var LoginView = View.extend({
            events: {},
            afterRender: function () {
                // call super method first
                View.prototype.afterRender.call(this);
                console.log("LoginView");
            }
        });

        return LoginView;
    });