/*globals jQuery*/
/**
 * Controllers
 * @module controllers
 */
define(function (require, exports) {
    'use strict';

    var $ = require('jquery');

    // @ngInject
    exports.NavBarAdvancedController = function($scope, $timeout, lpWidget, lpPortal, lpCoreBus, lpCoreUtils) {

        var bus = lpCoreBus;
        var util = lpCoreUtils;
        var $widgetBody = $(lpWidget.body);

        var initialize = function () {

            //set up widget preferences
            //data sources
            //general nav preferences
            $scope.navSticky = lpWidget.getPreference('navSticky');
            $scope.containerType = lpWidget.getPreference('containerType');
            $scope.scrollSetting = 'lp-' + lpWidget.getPreference('scrollSetting') + '-scroll' || 'lp-normal-scroll';
            $scope.showPageTitle = util.parseBoolean(lpWidget.getPreference('showPageTitle'));

            //logo preferences
            $scope.logoUrl = util.resolvePortalPlaceholders(lpWidget.getPreference('logoURL')) || '';
            $scope.mobileLogoUrl = util.resolvePortalPlaceholders(lpWidget.getPreference('mobileLogoURL')) || '';
            $scope.launcherIcon = lpWidget.getPreference('launcherIcon') || 'arrow-left';

            //nav and launcher icon preferences
            $scope.animationHook = lpWidget.getPreference('navigationIconAnimationHook') || 'arrow';
            $scope.showNotificationsBadge = util.parseBoolean(lpWidget.getPreference('showNotificationsBadge'));

            // locales list for the switch
            $scope.locales = lpWidget.getPreference('locales');

            $scope.showMenu = true;
            //the current active page
            $scope.activePage = '';
            //the current active context
            $scope.activeContext = '';
            //fix for issue in portal manager
            $scope.isDesignMode = lpPortal.designMode;

            $scope.elementHeight = 0;

            //preset animation hooks
            $scope.animationPrepend = 'animation-';
            $scope.defaultAnimationClass = 'none';
            $scope.animationClass = $scope.animationPrepend + $scope.defaultAnimationClass;


            //button enum
            $scope.buttons = {
                logo: 'logo',
                icon: 'icon'
            };

            //scroll settings
            $scope.scrollSettingsEnum = {
                'normal': 'lp-normal-scroll',
                'transparency': 'lp-transparency-scroll',
                'hide-show': 'lp-hide-show-scroll'
            };

            bus.subscribe('launchpad-retail.activeContextChanged', function(data) {
                $timeout(function() {
                    $scope.activeContext = data.newActiveContext.length > 0 ?
                        data.newActiveContext : $scope.activePage;
                }, 25);
            });

            if($scope.navSticky) {
                //nav must be sticky1
                bus.publish('launchpad-retail.stickyNavBar');
            }

        };

        //toggle the menu open/closed by changing the $scope.animationClass variable
        $scope.toggleMenu = function () {

            $scope.showMenu = !$scope.showMenu;

            if($scope.animationHook.length > 0) {
                //apply animation
                if(!$scope.showMenu) {
                    //showing menu
                    $scope.animationClass = $scope.animationPrepend + $scope.animationHook;
                } else {
                    //hiding menu
                    $scope.animationClass = $scope.animationPrepend + $scope.defaultAnimationClass;
                }
            }
        };

        $scope.updateSize = function(data) {
            if ($scope.navSticky && ($scope.elementHeight !== data.height)) {
                $scope.elementHeight = data.height;

                // wrap with setTimeout to take a right position value
                setTimeout(function(){
                    var isStatic = ['absolute', 'fixed'].indexOf($('.navbar', lpWidget.body).css('position')) < 0;

                    bus.publish('launchpad-retail.offsetTopCorrection', {
                        isStatic: isStatic,
                        offsetTopCorrection: $scope.elementHeight
                    });
                }, 10);
            }
        };

        //toggle the launcher menu open or closed
        $scope.toggleLauncherMenu = function() {
            bus.publish('launchpad-retail.toggleLauncherMenu');
        };

        //Get all the links and mark as active the one that matches the url
        $widgetBody.find('a[data-uuid="' + lpPortal.linkId + '"]').parents('li').addClass('active');





        initialize();
    };
});
