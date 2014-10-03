define([
        "jquery",
        "view",
        "datetimepicker",
        "chosen"
    ],
    function ($, View, datetimepicker, chosen) {

        "use strict";

        var AdminView = View.extend({
            events: {},
            afterRender: function () {
                // call super method first
                View.prototype.afterRender.call(this);
                console.log("AdminView");

                 this.initDateTimePicker();
                 this.initGooglePlaces();
                 $(".form-control.topic").chosen();
            },
             initDateTimePicker: function () {

                var date = new Date();
                date.setDate(date.getDate() - 1);

                // init datetimepicker
                $("#meetingDate").datetimepicker({
                    format: "dd MM yyyy - HH:ii P",
                    showMeridian: true,
                    autoclose: true,
                    startDate: date
                });


            },
            initGooglePlaces: function () {

                // loaded google maps js in the initial layout rendering itself
                // Better option to be doing a AMD require for google places API

                var autocomplete = new google.maps.places.Autocomplete(
                    (document.getElementById('location')), {
                        types: ['geocode']
                    });

            },
        });

        return AdminView;
    });