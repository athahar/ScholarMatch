'use strict';


requirejs.config({
    paths: {
    	"jquery": "/components/jquery/dist/jquery"    	
    }
});


require(["jquery"], function ($) {

    var app = {
        initialize: function () {
            // Your code here
              
            // FIXME : Move this code or use a better plugin
            // Simple jQuery snippet to convert form labels into inline placeholders
            // Use this : http://webdesign.tutsplus.com/articles/implementing-the-float-label-form-pattern--webdesign-16407
     	      $("form :input").each(function(index, elem) {
			    var eId = $(elem).attr("id");
			    var label = null;
			    if (eId && (label = $(elem).parents("form").find("label[for="+eId+"]")).length == 1) {
			        $(elem).attr("placeholder", $(label).html());
			        $(label).remove();
			    }
			 });

        }
    };

    app.initialize();

});
