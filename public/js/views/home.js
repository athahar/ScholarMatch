define([
        "jquery",
        "view"
    ],
    function ($, View) {

        "use strict";

        var HomeView = View.extend({
            template: "index",
            events: {},
            afterRender: function () {
                // call super method first
                View.prototype.afterRender.call(this);
                console.log("Home View");
            }
        });

        return HomeView;
    });