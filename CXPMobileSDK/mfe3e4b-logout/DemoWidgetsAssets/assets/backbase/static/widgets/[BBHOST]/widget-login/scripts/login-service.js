define(function(require, exports, module) {
    'use strict';

    // @ngInject
    exports.LoginService = function($http, $window, lpPortal, lpCoreUtils) {

        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        // Login model
        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

        var self = this;
        var config = {
            loginUrl: lpPortal.root + '/j_spring_security_check',
            logoutUrl: lpPortal.root + '/j_spring_security_logout?portalName=' + lpPortal.name,
            successPage: null
        };
        var loginStorageConfig = {
            userId: 'launchpad.userId',
            userData: 'launchpad.userData'
        };

        // Allow user to configure some attributes
        this.configure = function(_config) {
            lpCoreUtils.extend(config, _config);
        };

        /**
         * Login
         */
        this.doLogin = function(userId, password) {
            var promise = this.getLoginPromise(userId, password).success(function( response ) {
                //if really logged in, response comes back empty
                //if our creds were wrong, the response is the HTML of the login failure page
                if (response) {
                    self.error = 'CANNOT_AUTHENTICATE';
                } else {
                    self.error = null;
                    self.handleSuccessfulLogin(response);
                }
            }).error(function(response) {
                self.error = response.errors[0].code;
            });

            return promise;
        };

        this.getLoginPromise = function(userId, password) {
            /*eslint-disable camelcase*/
            var data = {
                j_username: userId,
                j_password: password,
                portal_name: lpPortal.name,
                page_name: lpPortal.page.name
            };
            /*eslint-enable */

            return $http.post(config.loginUrl, lpCoreUtils.buildQueryString(data), {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/x-www-form-urlencoded;',
                    'Cache-Control': 'no-cache, no-store, must-revalidate',
                    'Pragma': 'no-cache',
                    'Expires': '0'
                }
            });
        };


        /**
         * Handle succesful authentication attempt.
         */
        this.handleSuccessfulLogin = function( response ) {

            //TODO: why do i get a success view? how can i force a reload?
            if($window.location.protocol.indexOf('file:') === 0) {
                response.successView = null;
            }

            if ( response.successView ) {
                // Redirect
                //TODO: paramaterize the context path
                $window.location.replace(lpPortal.root + response.successView);
            } else {
                var currentLocation;
                // Refresh
                if($window.location.protocol.indexOf('file:') === 0) {
                    //need to strip out url to state when running on the files system
                    currentLocation =
                        $window.location.pathname.split('//')[0] + $window.location.search + $window.location.hash;
                } else {
                    currentLocation = $window.location.href;
                }
                $window.location.replace(currentLocation);
            }
        };

        /**
         * Logout
         */
        this.doLogout = function() {
            $window.sessionStorage.clear();
            $window.location.href = config.logoutUrl;
        };

        // Retrieve stored user data
        this.getStoredData = function() {
            return $window.sessionStorage.getItem( loginStorageConfig.userData );
        };
    };
});

