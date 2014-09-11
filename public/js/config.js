(function () {
    'use strict';

    requirejs.config({
        baseURL: '/js',
        // urlArgs: 'bust=' + new Date(),
        paths: {
            'backbone': 'lib/backbone',
            'underscore': 'lib/underscore',
            'jquery': 'lib/jquery-1.11.1.min', //for IEx compatibility
            'typeahead': 'lib/typeahead.bundle.min',
            'bootstrap': 'lib/bootstrap.min',
            'dust': 'lib/dust-full.min',
            'dust-helpers': 'lib/dust-helpers.min',
            'dust-helpers-supplement': 'lib/dust-helpers-supplement',
            'datetimepicker': 'lib/bootstrap-datetimepicker',
            'jqueryMask': 'lib/jquery.maskedinput.js',

            'nougat': 'core/nougat',
            'BaseView': 'core/baseView',

            // app views
            'view': 'view',
            'admin': 'views/admin',
            'dashboard': 'views/dashboard',
            'login': 'views/login',
            'meetingInvite': 'views/meetingInvite',
            'meetingNotes': 'views/meetingNotes',
            'profile': 'views/profile',
            'signup': 'views/signup',
            'coachingHelp': 'views/coachingHelp'

        },
        shim: {
            "dust": {
                exports: "dust"
            },
            "dust-helpers": {
                deps: ["dust"]
            },
            "dust-helpers-supplement": {
                deps: ["dust", "dust-helpers"]
            },
            'underscore': {
                exports: '_'
            },
            'backbone': {
                exports: 'Backbone'
            },
            'bootstrap': {
                deps: ['jquery']
            },
            'typeahead': {
                deps: ['jquery']
            },
            "view": {
                deps: ["BaseView"]
            },
            "app": {
                deps: ["jquery"]
            },
        },
        waitSeconds: 15
    });

})();