define([
        "jquery",
        "view",
        "datetimepicker"
    ],
    function ($, View, datetimepicker) {

        "use strict";

        var MeetingInviteView = View.extend({
            events: {},
            afterRender: function () {
                // call super method first
                View.prototype.afterRender.call(this);
                console.log("MeetingInviteView");

                this.initGooglePlaces();

                // init datetimepicker
                $("#meetingDate").datetimepicker({
                    format: "dd MM yyyy - HH:ii P",
                    showMeridian: true,
                    autoclose: true
                });

                // user form validation before submit
                // http://bootstrapvalidator.com/settings/
                // http://bootstrapvalidator.com/examples/toggle/
            },
            initGooglePlaces: function () {

                // loaded google maps js in the initial layout rendering itself
                // Better option to be doing a AMD require for google places API

                var autocomplete = new google.maps.places.Autocomplete(
                    (document.getElementById('location')), {
                        types: ['geocode']
                    });

            }
        });

        return MeetingInviteView;
    });