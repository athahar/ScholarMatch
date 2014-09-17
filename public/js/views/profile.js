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

                // $(".phone").mask("(999) 999-9999");

            }
        });

        return ProfileView;
    });