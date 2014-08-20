'use strict';


requirejs.config({
    paths: {
        "jquery": "/components/jquery/dist/jquery"
    }
});


require(['jquery'], function ($) {

    var app = {
        initialize: function () {

            debugger;

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

            // For meetings view, set the selected user's email, phone number & fullname in respective hidde fields

            var $invitee = null;
            if ($(".coaches").size() > 0) {@
                $invitee = $(".coaches option:selected")
            }
            if ($(".students").size() > 0) {@
                $invitee = $(".students option:selected")
            }

            $("#invitedEmail").val($invitee.attr("email"));
            $("#invitedName").val($invitee.attr("fullName"))
            $("#invitedPhone").val($invitee.attr("phone"))

            // not a good logic to put this stuff in client side,
            // ideal case is pass the id to mongodb, and let the backend get the info required.

        }
    };

    app.initialize();

});