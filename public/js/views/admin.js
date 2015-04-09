define([
        "jquery",
        "bootstrap",
        "view",
        "datetimepicker",
        "chosen"
    ],
    function ($, bootstrap, View, datetimepicker, chosen) {

        "use strict";

        var AdminView = View.extend({
            events: {
                "click a.updateStatus": "populateUserStatusModalData"
            },
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
            populateUserStatusModalData: function (e) {

                var $parentEl = $(e.currentTarget).parents("tr");
                debugger;

                var userId = $parentEl.data("userId");

                $("#userStatus #userName").val($parentEl.data("name"));
                $("#userStatus #userRole").val($parentEl.data("role"));
                $("#userStatus #currentStatus").val($parentEl.data("status"));

                // console.log(e);
                console.log($(e.currentTarget).parents("tr"));
            },

            initGooglePlaces: function () {

                // loaded google maps js in the initial layout rendering itself
                // Better option to be doing a AMD require for google places API

                var autocomplete = new google.maps.places.Autocomplete(
                    (document.getElementById('location')), {
                        types: ['geocode']
                    });

            },
            setupOrientation: function (ev) {
                // ev.preventDefault();
                $(".setupOrientation").addClass("disabled").text('Creating');
            }

        });

        return AdminView;
    });