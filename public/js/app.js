define([
        "jquery",
        "backbone",
        "BaseView",
        "nougat"
    ],
    function ($, Backbone, BaseView, nougat) {

        "use strict";

        var App = {
            initialize: function () {

                var body = $("body"),
                    initialContext = {
                        "viewName": body.data("viewName")
                    };

                // ajaxify links with "xhr" class
                $("body").on("click", ".xhr", $.proxy(function (event) {
                    var element = $(event.currentTarget);

                    event.preventDefault();

                    $.ajax({
                        type: "get",
                        url: element.attr("href"),
                        success: $.proxy(function (response) {
                            this.handleResponse(response, this.view);
                        }, this)
                    });
                }, this));


                if (initialContext.viewName) {
                    // render first view using afterRender() only because the server already render the template and calling 
                    // render() would require content to be in the response json which it is not
                    require(["views/" + initialContext.viewName], $.proxy(function (ViewClass) {
                        this.view = new ViewClass();

                        // render view with response data
                        this.view.model = new Backbone.Model();
                        this.view.model.set(initialContext);
                        this.view.afterRender();

                        // start recording history for backbone for Ajax'd content
                        Backbone.history.start({
                            pushState: true, // Use HTML5 Push State
                            hashChange: false, // Do full page refresh if Push State isn't supported
                            root: "/businessexp/" //Initial path for app
                        });

                    }, this));
                }

                body.data("viewName", null);
                body[0].removeAttribute("data-view-name");

            },

            // render view and given data       
            renderContext: function (context) {

                var viewName = context.viewName;

                // undelegate events
                this.view.undelegateEvents();

                require(['views/' + viewName], $.proxy(function (ViewClass) {
                    this.view = new ViewClass();

                    // render view with response data
                    this.view.model = new Backbone.Model();
                    this.view.model.set(context);
                    this.view.render();

                    // delegate events
                    this.view.delegateEvents();
                }, this));
            },

            // handles an ajax response made by the app
            // response - json context object
            // currentView - the view that made the request that created the given response
            // form - the form that made the request [optional]
            handleResponse: function (response, currentView, form) {

                // trigger before push state event
                currentView.trigger("beforePushState", response);
                this.renderContext(response);

            }
        };

        return App;
    });




//Bram CODE BELOW
var overviewClicked = false;
var CandidatesClicked = false;
var HowItWorksClicked = false;
var StudentExpectationsClicked = false;
var CoachExpectationsClicked = false;
$("#Overview").click(function() {
    if(!overviewClicked){
        $("#OverviewAnswer").css("visibility","visible");
        $("#OverviewAnswer").css("padding","10px");
        $("#OverviewAnswer").css("height","100%");
        overviewClicked = true;
    }
    else{
        $("#OverviewAnswer").css("visibility","hidden");
        $("#OverviewAnswer").css("padding","0px");
        $("#OverviewAnswer").css("height","0px");
        overviewClicked = false;
    }
});
$("#Candidates").click(function() {
    if(!CandidatesClicked){
        $("#CandidatesAnswer").css("visibility","visible");
        $("#CandidatesAnswer").css("padding","10px");
        $("#CandidatesAnswer").css("height","100%");
        CandidatesClicked = true;
    }
    else{
        $("#CandidatesAnswer").css("visibility","hidden");
        $("#CandidatesAnswer").css("padding","0px");
        $("#CandidatesAnswer").css("height","0px");
        CandidatesClicked = false;
    }
});
$("#HowItWorks").click(function() {
    if(!HowItWorksClicked){
        $("#HowItWorksAnswer").css("visibility","visible");
        $("#HowItWorksAnswer").css("padding","10px");
        $("#HowItWorksAnswer").css("height","100%");
        HowItWorksClicked = true;
    }
    else{
        $("#HowItWorksAnswer").css("visibility","hidden");
        $("#HowItWorksAnswer").css("padding","0px");
        $("#HowItWorksAnswer").css("height","0px");
        HowItWorksClicked = false;
    }
});
$("#StudentExpectations").click(function() {
    if(!StudentExpectationsClicked){
        $("#StudentExpectationsAnswer").css("visibility","visible");
        $("#StudentExpectationsAnswer").css("padding","10px");
        $("#StudentExpectationsAnswer").css("height","100%");
        StudentExpectationsClicked = true;
    }
    else{
        $("#StudentExpectationsAnswer").css("visibility","hidden");
        $("#StudentExpectationsAnswer").css("padding","0px");
        $("#StudentExpectationsAnswer").css("height","0px");
        StudentExpectationsAnswerClicked = false;
    }
});
$("#CoachExpectations").click(function() {
    if(!CoachExpectationsClicked){
        $("#CoachExpectationsAnswer").css("visibility","visible");
        $("#CoachExpectationsAnswer").css("padding","10px");
        $("#CoachExpectationsAnswer").css("height","100%");
        CoachExpectationsClicked = true;
    }
    else{
        $("#CoachExpectationsAnswer").css("visibility","hidden");
        $("#CoachExpectationsAnswer").css("padding","0px");
        $("#CoachExpectationsAnswer").css("height","0px");
        CoachExpectationsClicked = false;
    }
});