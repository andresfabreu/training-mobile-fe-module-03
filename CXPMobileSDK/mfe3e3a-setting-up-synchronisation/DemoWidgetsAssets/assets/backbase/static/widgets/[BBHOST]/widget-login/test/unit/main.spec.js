/**
 *  ----------------------------------------------------------------
 *  Copyright © Backbase B.V.
 *  ----------------------------------------------------------------
 *  Author : Backbase R&D - Amsterdam - New York
 *
 */

var main = require('../../scripts/main');

require('angular-mocks');

var ngModule = window.module;
var ngInject = window.inject;

// Mock __WIDGET__ object
var Widget = require('./widget.mock');
var LoginService = require('./login-service.mock.js');

/*----------------------------------------------------------------*/
/* Widget unit tests
/*----------------------------------------------------------------*/
describe('Widget Login ', function() {

    /*----------------------------------------------------------------*/
    /* Mock modules/Providers
    /*----------------------------------------------------------------*/
    beforeEach(ngModule(main.name, function($provide) {
        $provide.value('lpWidget', new Widget());
        $provide.value('LoginService', new LoginService());
    }));

    /*----------------------------------------------------------------*/
    /* Main Module
    /*----------------------------------------------------------------*/
    describe('Module', function() {
        it('should be an object', function() {
            expect(main).toBeObject();
        });
    });

    /*----------------------------------------------------------------*/
    /* Controllers
    /*----------------------------------------------------------------*/
    describe('Controllers', function() {

        var createController, scope;

        beforeEach(inject(function($controller, $rootScope) {
            scope = $rootScope.$new();
            createController = function(ctrlName) {
                return $controller(ctrlName, {
                    $scope: scope
                });
            };
        }));
        // Login Controller
        describe('LoginController', function() {
            beforeEach(function() {
                ctrl = createController('LoginController');
            });

            it('should be an object', function() {
                expect(ctrl).toBeObject();
            });

            it('should have user object', function() {
                expect(scope.user).toBeObject();
            });

        });

    });

});
