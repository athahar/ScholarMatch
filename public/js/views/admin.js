define([
        "jquery",
        "view"
    ],
    function ($, View) {

        "use strict";

        var AdminView = View.extend({
            events: {},
            afterRender: function () {
                // call super method first
                View.prototype.afterRender.call(this);
                console.log("AdminView");
            }
        });

        return AdminView;
    });