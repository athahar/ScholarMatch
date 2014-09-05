require(['config'], function () {

    'use strict';

    var app = {
        initialize: function () {
            // Your code here

            require(['jquery'], function ($) {
                // require js file corresponding to current template
                var viewName = $('body').data('view-name') || false;

                var context = $('body').data('context') || "{}";

                // FIXME: Move this code to respective view names. 
                // - currently used for meetinginvite view

                if ($('form#meetingInvite #location').size() > 0) {
                    // loaded google maps js in the layout page itself
                    var autocomplete = new google.maps.places.Autocomplete(
                        (document.getElementById('location')), {
                            types: ['geocode']
                        });
                }


            });
        }
    };

    app.initialize();


});