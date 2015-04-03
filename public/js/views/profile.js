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
                // $(".phone").mask("(999) 999-9999");
            }
        });

        return ProfileView;
    });


            var onPage = "";

            var afterHash = window.location.href.split("#");
            var menuIDs = ["edit-settings-header-about","edit-settings-header-contact","edit-settings-header-education","edit-settings-header-industry","edit-settings-header-references"];
            var contentIDs = ["edit-settings-content-about","edit-settings-content-contact","edit-settings-content-education","edit-settings-content-industry","edit-settings-content-references"];

            //all or about
            if (afterHash.length < 2 || afterHash[1].toUpperCase() == "ABOUT"){
                $("#" + menuIDs[0]).css("background-color","white");
                $("#" + contentIDs[0]).toggleClass("edit-settings-content-items-hidden");
                onPage = "about";
            }
            //update email, phone, location, meeting format
            else if(afterHash[1].toUpperCase() == "CONTACT"){
                $("#" + menuIDs[1]).css("background-color","white");
                $("#" + contentIDs[1]).toggleClass("edit-settings-content-items-hidden");
                onPage = "contact";
            }
            //update school, major & year if student |||| school, major, grad school, major if coach
            else if(afterHash[1].toUpperCase() == "EDUCATION"){
                $("#" + menuIDs[2]).css("background-color","white");
                $("#" + contentIDs[2]).toggleClass("edit-settings-content-items-hidden");
                onPage = "education";
            }
            //update desired primary, secondary industries & previous jobs for student
            //update industry, job title, years, company for both primary and secondary for coach
            else if(afterHash[1].toUpperCase() == "INDUSTRY"){
                $("#" + menuIDs[3]).css("background-color","white");
                $("#" + contentIDs[3]).toggleClass("edit-settings-content-items-hidden");
                onPage = "industry";
            }
            //only for coach, update primary & secondary reference's phone, email, name
            else if(afterHash[1].toUpperCase() == "REFERENCES"){
                $("#" + menuIDs[4]).css("background-color","white");
                $("#" + contentIDs[4]).toggleClass("edit-settings-content-items-hidden");
                onPage = "references";
            }

            //if click on another header, open that
            $('#edit-settings-header-about').on('click', function(e) {
                loadAbout();
            });
            $('#edit-settings-header-contact').on('click', function(e) {
                loadContact();
            });
            $('#edit-settings-header-education').on('click', function(e) {
                loadEducation();
            });
            $('#edit-settings-header-industry').on('click', function(e) {
                loadIndustry();
            });
            $('#edit-settings-header-references').on('click', function(e) {
                loadReferences();
            });

            function loadAbout(){
                for(var i = 0; i < contentIDs.length; i++){
                    $("#" + contentIDs[i]).removeClass();
                    $("#" + contentIDs[i]).addClass("edit-settings-content-items-hidden");             
                    $("#" + contentIDs[i]).css('height','0px');
                    $("#" + menuIDs[i]).css("background-color","#EFECE0");
                }
                $("#" + menuIDs[0]).css("background-color","white");
                $("#" + contentIDs[0]).toggleClass("edit-settings-content-items-hidden");          
                $("#" + contentIDs[0]).css('height','100%');
                $("html,body").animate({scrollTop: 0},750);
                onPage = "about";
            }

            function loadContact(){
                for(var i = 0; i < contentIDs.length; i++){
                    $("#" + contentIDs[i]).removeClass();
                    $("#" + contentIDs[i]).addClass("edit-settings-content-items-hidden");          
                    $("#" + contentIDs[i]).css('height','0px');
                    $("#" + menuIDs[i]).css("background-color","#EFECE0");
                }
                $("#" + menuIDs[1]).css("background-color","white");
                $("#" + contentIDs[1]).toggleClass("edit-settings-content-items-hidden");        
                $("#" + contentIDs[1]).css('height','100%');
                $("html,body").animate({scrollTop: 0}, 750);
                onPage = "contact";
            }

            function loadEducation(){
                for(var i = 0; i < contentIDs.length; i++){
                    $("#" + contentIDs[i]).removeClass();
                    $("#" + contentIDs[i]).addClass("edit-settings-content-items-hidden");          
                    $("#" + contentIDs[i]).css('height','0px');
                    $("#" + menuIDs[i]).css("background-color","#EFECE0");
                }
                $("#" + menuIDs[2]).css("background-color","white");
                $("#" + contentIDs[2]).toggleClass("edit-settings-content-items-hidden");        
                $("#" + contentIDs[2]).css('height','100%');
                $("html,body").animate({scrollTop: 0}, 750);
                onPage = "education";
            }

            function loadIndustry(){
                for(var i = 0; i < contentIDs.length; i++){
                    $("#" + contentIDs[i]).removeClass();
                    $("#" + contentIDs[i]).addClass("edit-settings-content-items-hidden");          
                    $("#" + contentIDs[i]).css('height','0px');
                    $("#" + menuIDs[i]).css("background-color","#EFECE0");
                }
                $("#" + menuIDs[3]).css("background-color","white");
                $("#" + contentIDs[3]).toggleClass("edit-settings-content-items-hidden");        
                $("#" + contentIDs[3]).css('height','100%');
                $("html,body").animate({scrollTop: 0}, 750);
                onPage = "industry";
            }

            function loadReferences(){
                for(var i = 0; i < contentIDs.length; i++){
                    $("#" + contentIDs[i]).removeClass();
                    $("#" + contentIDs[i]).addClass("edit-settings-content-items-hidden");          
                    $("#" + contentIDs[i]).css('height','0px');
                    $("#" + menuIDs[i]).css("background-color","#EFECE0");
                }
                $("#" + menuIDs[4]).css("background-color","white");
                $("#" + contentIDs[4]).toggleClass("edit-settings-content-items-hidden");        
                $("#" + contentIDs[4]).css('height','100%');
                $("html,body").animate({scrollTop: 0}, 750);
                onPage = "references";
            }

    $(".phone").text(function(i, text) {
        text = text.replace(/(\d{3})(\d{3})(\d{4})/, "(" + "$1" + ")" + " $2-$3");
        text = text.replace(/(\d{3})\-?(\d{3})\-?(\d{4})/, "(" + "$1" + ")" + " $2-$3");
        text = text.replace(/(\d{3})\ ?(\d{3})\ ?(\d{4})/, "(" + "$1" + ")" + " $2-$3");
        return text;
    });