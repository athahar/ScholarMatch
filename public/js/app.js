require(['config'], function () {

    'use strict';

    var app = {
        initialize: function () {
            // Your code here

            require(['jquery', 'typeahead'], function ($) {

                // require js file corresponding to current template
                var viewName = $('body').data('view-name') || false;

                var context = $('body').data('context') || "{}";


                // For meetings view, set the selected user's email, phone number & fullname in respective hidde fields

                // var $invitee = null;
                // if ($(".coaches").size() > 0) {
                //     $invitee = $(".coaches option:selected")
                // }
                // if ($(".students").size() > 0) {
                //     $invitee = $(".students option:selected")
                // }

                // $("#invitedEmail").val($invitee.attr("email"));
                // $("#invitedName").val($invitee.attr("fullName"))
                // $("#invitedPhone").val($invitee.attr("phone"))

                // not a good logic to put this stuff in client side,
                // ideal case is pass the id to mongodb, and let the backend get the info required.


                var substringMatcher = function (strs) {
                    return function findMatches(q, cb) {
                        var matches, substrRegex;

                        // an array that will be populated with substring matches
                        matches = [];

                        // regex used to determine if a string contains the substring `q`
                        substrRegex = new RegExp(q, 'i');

                        // iterate through the pool of strings and for any string that
                        // contains the substring `q`, add it to the `matches` array
                        $.each(strs, function (i, str) {
                            if (substrRegex.test(str)) {
                                // the typeahead jQuery plugin expects suggestions to a
                                // JavaScript object, refer to typeahead docs for more info
                                matches.push({
                                    value: str
                                });
                            }
                        });

                        cb(matches);
                    };
                };

                var states = ['Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California',
                    'Colorado', 'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Hawaii',
                    'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana',
                    'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota',
                    'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire',
                    'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota',
                    'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island',
                    'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont',
                    'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'
                ];

                $('#bloodhound .typeahead').typeahead({
                    hint: true,
                    highlight: true,
                    minLength: 1
                }, {
                    name: 'states',
                    displayKey: 'value',
                    source: substringMatcher(states)
                });

            });
        }
    };

    app.initialize();


});