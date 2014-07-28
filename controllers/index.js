'use strict';


var IndexModel = require('../models/index'),
    ProfileModel = require('../models/profile'),
    AdminModel = require('../models/admin'),
    auth = require('../lib/auth');


module.exports = function (router) {

    var indexmodel = new IndexModel();
    var profilemodel = new ProfileModel();
    var adminmodel = new AdminModel();


    router.get('/', function (req, res) {
        res.render('index', indexmodel);
    });

    
    // router.get('/profile', function(req, res) {
        
    //     profilemodel.data = profilemodel.data || {};
        
    //     profilemodel.data.userDetails = profilemodel.data.userDetails || {}
    //     profilemodel.data.userDetails.name = req.user.name;
    //     profilemodel.data.userDetails.role = req.user.role;
    //     profilemodel.data.userDetails.userid = req.user._id

    //     console.dir(profilemodel);
                
    //     res.render('profile/index', profilemodel);
    // });


    router.get('/admin', auth.isAuthenticated('admin'), auth.injectUser(), function(req, res) {
        res.render('admin', adminmodel);
    });

    /**
     * Allow the users to log out
     */
    router.get('/logout', function (req, res) {
        req.logout();
        res.redirect('/login');
    });

};
