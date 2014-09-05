(function () {
    "use strict";

    require(["config"], function (config) {

        require(["jquery", "app"], function ($, App) {

            console.log("main calling app.initialize");
            App.initialize();

        });

    });

}());