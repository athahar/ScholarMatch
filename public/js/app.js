'use strict';


requirejs.config({
    paths: {
    	// "jquery": "/components/jquery/dist/jquery"    	
    }
});


require([], function ($) {

    var app = {
        initialize: function () {
            // Your code here
              
            // FIXME : Move this code or use a better plugin
            // Simple jQuery snippet to convert form labels into inline placeholders
            // Use this : http://webdesign.tutsplus.com/articles/implementing-the-float-label-form-pattern--webdesign-16407
    //  	      $("form :input").each(function(index, elem) {
			 //    var eId = $(elem).attr("id");
			 //    var label = null;
			 //    if (eId && (label = $(elem).parents("form").find("label[for="+eId+"]")).length == 1) {
			 //        $(elem).attr("placeholder", $(label).html());
			 //        $(label).remove();
			 //    }
			 // });

        }
    };

    app.initialize();

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