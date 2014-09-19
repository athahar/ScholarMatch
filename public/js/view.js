/**
 * Base view class for all views in this app.
 */
define([
        "jquery",
        "backbone",
        "BaseView",
        "app"
    ],
    function ($, Backbone, BaseView, App) {

        "use strict";

        var View = BaseView.extend({

            el: $("#wrapper"),
            events: {},
            trimInput: function (ev) {
                var input = $(ev.target);
                input.val($.trim(input.val()));
            },
            afterRender: function () {
                // make context object available to view
                this.context = this.model.attributes;

                $('input[type=text]').on('blur', function (ev) {
                    this.trimInput(ev);
                }.bind(this));


                // commented this temporarily            
                //this._handleForms();

                // after rendering view, scroll to top and hide any soft keyboards
                setTimeout(function () {
                    // window.scrollTo(0, 0);
                }, 1);

                if ($(document.activeElement).is("input")) {
                    document.activeElement.blur();
                }

                console.log("Base View");

                // form submission tracking
                $("form button").on("click", function (e) {
                    var form = $(e.target).parents("form").attr("id"),
                        data = form.serialize();

                    window.mixpanel.track(form + "submitted", {
                        "data": data
                    })
                })


                window.mixpanel.identify("13487");
                window.mixpanel.people.set({
                    "$first_name": "Joe",
                    "$last_name": "Doe",
                    "$created": "2013-04-01T09:02:00",
                    "$email": "joe.doe@example.com"
                });

                mixpanel.track(this.context.viewName);
                
                // track user profile
                // 
                // if (this.context && this.context.response && this.context.response.user) {
                //     debugger;
                //     mixpanel.identify(this.context.response.user.email);

                //     mixpanel.register({
                //         "$email": this.context.response.user.email,
                //         "account type": this.context.response.user.role,
                //         "city": this.context.response.user.city,
                //         "isConnected": this.context.response.user.isConnected
                //     });
                // }

                // if (this.context && this.context.viewName) {
                //     // track every page
                //     mixpanel.track(this.context.viewName);
                //     debugger;
                // }


                mixpanel.identify("athahar@email.com");

                mixpanel.register({
                    "$email": "athahar@email.com",
                    "account type": "student",
                    "city": "San Francisco",
                    "isConnected": true
                });

                mixpanel.track("Dashboard page");

            },
            // handle form submissions with ajax
            _handleForms: function () {
                var forms = this.$el.find("form");

                // use ajax to submit forms
                forms.on("submit", $.proxy(function (ev) {
                    var form = $(ev.target);

                    // user form validation before submit
                    // http://bootstrapvalidator.com/settings/
                    // http://bootstrapvalidator.com/examples/toggle/
                    // https://github.com/nghuuphuoc/bootstrapvalidator/blob/master/demo/ajaxSubmit.html

                    // trigger form post event
                    form.trigger("post");

                    this._ajaxFormPost(form);

                }, this));
            },

            formProcessingIndicator: function (form, state) {

                var submitInput = $("input[type=submit], button[type=submit]", form);

                if (state === "start") {

                    submitInput.addClass("processing");
                    submitInput.addClass("disabled");

                } else {

                    //state === "stop"
                    submitInput.removeClass("processing");
                    submitInput.removeClass("disabled");

                }
            },
            _ajaxPageGet: function (form, pageUrl) {
                this.formProcessingIndicator(form, "start");

                if (!pageUrl) {
                    return;
                }

                $.ajax({
                    type: "get",
                    url: pageUrl,
                    success: $.proxy(function (response) {
                        App.handleResponse(response, this, form);
                    }, this),
                    error: $.proxy(function () {
                        // TODO: display request failure error
                        // remove loading indicator on error
                        this.formProcessingIndicator(form, "stop");
                    }, this)
                });
            },
            _ajaxFormPost: function (form) {

                this.formProcessingIndicator(form, "start");

                var data = form.serialize();

                $.ajax({
                    type: "post",
                    url: form.attr("action"),
                    data: data,
                    success: $.proxy(function (response) {
                        App.handleResponse(response, this, form);
                    }, this),
                    error: $.proxy(function () {
                        // TODO: display request failure error
                        // remove loading indicator on error
                        this.formProcessingIndicator(form, "stop");
                    }, this)
                });
            },
            formSuccess: function (form, response) {
                // function to be used in child views for form response control
            }
        });
        return View;
    });