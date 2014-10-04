/**
 * Base view class for all views in this app.
 */
define([
        "jquery",
        "backbone",
        "BaseView",
        "app",
        "placeholder"
    ],
    function ($, Backbone, BaseView, App, placeholder) {

        "use strict";

        var View = BaseView.extend({

            el: $("#wrapper"),
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

                $('input, textarea').placeholder();


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