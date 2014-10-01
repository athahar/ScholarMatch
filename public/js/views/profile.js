define([
        "jquery",
        "view",
        "jqueryMask"
    ],
    function ($, View, jqueryMask) {

        "use strict";

        var ProfileView = View.extend({
            events: {},
            afterRender: function () {
                // call super method first
                View.prototype.afterRender.call(this);
                console.log("ProfileView");

            var afterHash = window.location.href.split("#");
            var menuIDs = ["edit-settings-header-about","edit-settings-header-contact","edit-settings-header-education","edit-settings-header-industry","edit-settings-header-references"];
            var contentIDs = ["edit-settings-content-about","edit-settings-content-contact","edit-settings-content-education","edit-settings-content-industry","edit-settings-content-references"];

            //all or about
            if (afterHash.length < 2 || afterHash[1].toUpperCase() == "ABOUT"){
                $("#" + menuIDs[0]).css("background-color","white");
                $("#" + contentIDs[0]).toggleClass("edit-settings-content-items-hidden");
            }
            //update email, phone, location, meeting format
            else if(afterHash[1].toUpperCase() == "CONTACT"){
                $("#" + menuIDs[1]).css("background-color","white");
                $("#" + contentIDs[1]).toggleClass("edit-settings-content-items-hidden");
            }
            //update school, major & year if student |||| school, major, grad school, major if coach
            else if(afterHash[1].toUpperCase() == "EDUCATION"){
                $("#" + menuIDs[2]).css("background-color","white");
                $("#" + contentIDs[2]).toggleClass("edit-settings-content-items-hidden");
            }
            //update desired primary, secondary industries & previous jobs for student
            //update industry, job title, years, company for both primary and secondary for coach
            else if(afterHash[1].toUpperCase() == "INDUSTRY"){
                $("#" + menuIDs[3]).css("background-color","white");
                $("#" + contentIDs[3]).toggleClass("edit-settings-content-items-hidden");
            }
            //only for coach, update primary & secondary reference's phone, email, name
            else if(afterHash[1].toUpperCase() == "REFERENCES"){
                $("#" + menuIDs[4]).css("background-color","white");
                $("#" + contentIDs[4]).toggleClass("edit-settings-content-items-hidden");
            }

            //if click on another header, open that
            $('#edit-settings-header-about').on('click', function(e) {
                for(var i = 0; i < contentIDs.length; i++){
                    $("#" + contentIDs[i]).removeClass();
                    $("#" + contentIDs[i]).addClass("edit-settings-content-items-hidden");
                    $("#" + menuIDs[i]).css("background-color","#EFECE0");
                }
                $("#" + menuIDs[0]).css("background-color","white");
                $("#" + contentIDs[0]).toggleClass("edit-settings-content-items-hidden");
            });
            $('#edit-settings-header-contact').on('click', function(e) {
                for(var i = 0; i < contentIDs.length; i++){
                    $("#" + contentIDs[i]).removeClass();
                    $("#" + contentIDs[i]).addClass("edit-settings-content-items-hidden");
                    $("#" + menuIDs[i]).css("background-color","#EFECE0");
                }
                $("#" + menuIDs[1]).css("background-color","white");
                $("#" + contentIDs[1]).toggleClass("edit-settings-content-items-hidden");
            });
            $('#edit-settings-header-education').on('click', function(e) {
                for(var i = 0; i < contentIDs.length; i++){
                    $("#" + contentIDs[i]).removeClass();
                    $("#" + contentIDs[i]).addClass("edit-settings-content-items-hidden");
                    $("#" + menuIDs[i]).css("background-color","#EFECE0");
                }
                $("#" + menuIDs[2]).css("background-color","white");
                $("#" + contentIDs[2]).toggleClass("edit-settings-content-items-hidden");
            });
            $('#edit-settings-header-industry').on('click', function(e) {
                for(var i = 0; i < contentIDs.length; i++){
                    $("#" + contentIDs[i]).removeClass();
                    $("#" + contentIDs[i]).addClass("edit-settings-content-items-hidden");
                    $("#" + menuIDs[i]).css("background-color","#EFECE0");
                }
                $("#" + menuIDs[3]).css("background-color","white");
                $("#" + contentIDs[3]).toggleClass("edit-settings-content-items-hidden");
            });
            $('#edit-settings-header-references').on('click', function(e) {
                for(var i = 0; i < contentIDs.length; i++){
                    $("#" + contentIDs[i]).removeClass();
                    $("#" + contentIDs[i]).addClass("edit-settings-content-items-hidden");
                    $("#" + menuIDs[i]).css("background-color","#EFECE0");
                }
                $("#" + menuIDs[4]).css("background-color","white");
                $("#" + contentIDs[4]).toggleClass("edit-settings-content-items-hidden");
            });

                // $(".phone").mask("(999) 999-9999");
            }
        });

        return ProfileView;
    });


