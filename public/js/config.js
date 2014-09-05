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
            'dustHelpers': 'lib/dust-helpers.min'
        },
        shim: {
            'dust-helpers': {
                deps: ['dustjs']
            },
            'dust': {
                exports: 'Dust'
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
            }
        },
        waitSeconds: 15
    });

})();