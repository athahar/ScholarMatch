define([
        "jquery",
        "view"
    ],
    function ($, View) {

        "use strict";

        var DashboardView = View.extend({
            template: "index",
            events: {},
            afterRender: function () {
                // call super method first
                View.prototype.afterRender.call(this);
                console.log("DashboardView");
            }
        });

        return DashboardView;
    });