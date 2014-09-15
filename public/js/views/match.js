define([
        "jquery",
        "bootstrap",
        "view",
        "datetimepicker"
    ],
    function ($, bootstrap, View, datetimepicker) {

        "use strict";

        var MatchView = View.extend({
            events: {
                "click a.setupMeeting": "populateOrientationModalData",
                "click .setupOrientation": "submitCreateOrientationMeeting"
            },
            afterRender: function () {
                // call super method first
                View.prototype.afterRender.call(this);
                console.log("MatchView");
                this.initDateTimePicker();


                // $("#orientationModal").on("shown.bs.modal", function (e) {

                // })

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
            populateOrientationModalData: function (e) {

                var $parentEl = $(e.currentTarget).parents("tr");
                debugger;

                var studentId = $parentEl.data("studentid");
                var coachId = $parentEl.data("coachid");
                var relationshipId = $parentEl.data("relationshipid");

                $("#meetingInvite #studentId").val($parentEl.data("studentid"));
                $("#meetingInvite #coachId").val($parentEl.data("coachid"));
                $("#meetingInvite #relationshipId").val($parentEl.data("relationshipid"));
                $("#meetingInvite #studentEmail").val($parentEl.data("studentemail"));
                $("#meetingInvite #coachEmail").val($parentEl.data("coachemail"));


                $("#meetingInvite #studentName").html($parentEl.data("studentname"));
                $("#meetingInvite #coachName").html($parentEl.data("coachname"));



                // console.log(e);
                console.log($(e.currentTarget).parents("tr"));
            },
            submitCreateOrientationMeeting: function (e) {

                var $form = $("form#meetingInvite"),
                    data = $form.serialize(),
                    action = $form.attr("action"); // "/match/setupOrientation"

                $.ajax({
                    type: "get",
                    url: action,
                    data: data,
                    success: $.proxy(function (response) {
                        // App.handleResponse(response, this, form);

                        console.log(response);
                        $("#orientationModal").modal('hide');
                        window.location.reload();

                    }, this),
                    error: $.proxy(function () {
                        // TODO: display request failure error
                        // remove loading indicator on error
                        // this.formProcessingIndicator(form, "stop");
                    }, this)
                });
            }
        });

        return MatchView;
    });