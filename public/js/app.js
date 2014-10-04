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

//change the active tag in header based on which page it's on
var parts = window.location.href.split("/");
for(var i = 0; i < parts.length; i++){
    parts[i] = parts[i].toUpperCase();
}

var linkIds = ["home","about","dashboard","profile","login-or-logout","sign-up","contact"];

if(parts.indexOf("DASHBOARD")>0){
    for(var i = 0; i < linkIds.length; i++)
        $("#"+linkIds[i]).removeClass();
    document.getElementById("dashboard").className = "active-link";
}
else if(parts.indexOf("ABOUT")>0){
    for(var i = 0; i < linkIds.length; i++)
        $("#"+linkIds[i]).removeClass();
    document.getElementById("about").className = "active-link";
}
else if(parts.indexOf("PROFILE")>0){
    for(var i = 0; i < linkIds.length; i++)
        $("#"+linkIds[i]).removeClass();
    document.getElementById("profile").className = "active-link";
}
else if(parts.indexOf("LOGIN")>0 || parts.indexOf("LOGIN#")>0){
    for(var i = 0; i < linkIds.length; i++)
        $("#"+linkIds[i]).removeClass();
    document.getElementById("login-or-logout").className = "active-link";
}
else if(parts.indexOf("SIGNUP")>0){
    for(var i = 0; i < linkIds.length; i++)
        $("#"+linkIds[i]).removeClass();
    document.getElementById("sign-up").className = "active-link";
}
else if(parts.indexOf("CONTACT")>0){
    for(var i = 0; i < linkIds.length; i++)
        $("#"+linkIds[i]).removeClass();
    document.getElementById("contact").className = "active-link";
}
else{ //if anything else is selected, underline home for now
    for(var i = 0; i < linkIds.length; i++)
        $("#"+linkIds[i]).removeClass();
    document.getElementById("home").className = "active-link";
}

$('#click-to-open').on('click',function(e){
    $( "#open-text" ).fadeOut( 100, function() {
        $( "#opened-text" ).slideDown( "slow", function() {  
            $('#opened-text').css("cursor","default");
        });
    });
});

$('#login-or-logout').on('click',function(e){
    window.location.href = "/login";
    /* commented out until we can fix - nice to have
    $('#login-section').slideDown("fast",function(){
    //for(var i = 0; i < linkIds.length; i++)
        //$("#"+linkIds[i]).removeClass();
    //document.getElementById("login-or-logout").className = "active-link";
    });
    */
});

function redirectPage(page){
    window.location.href = "/" + page;
}

function scrollTo(element){
    var heightHeader = $('.fixed-header').height();
    $("html, body").animate({ scrollTop: $('#'+element).offset().top  - heightHeader}, 1000);
}