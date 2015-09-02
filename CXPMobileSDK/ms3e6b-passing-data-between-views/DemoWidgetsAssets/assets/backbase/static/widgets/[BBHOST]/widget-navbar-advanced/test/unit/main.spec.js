/**
 *  ----------------------------------------------------------------
 *  Copyright © Backbase B.V.
 *  ----------------------------------------------------------------
 *  Author : Backbase R&D - Amsterdam - New York
 *  Filename : main.spec.js
 *  Description:
 *  ----------------------------------------------------------------
 */

var main = require('../../scripts/main');
var Widget = require('./widget.mock');
require('angular-mocks');

var ngModule = window.module;
var ngInject = window.inject;

// Mock __WIDGET__ object
main.value('lpWidget',  new Widget());

/*----------------------------------------------------------------*/
/* Widget unit tests
/*----------------------------------------------------------------*/
describe('Navbar Advanced Widget', function() {
    //var ctrl, scope, controller;


    /*----------------------------------------------------------------*/
    /* Mock modules/Providers
    /*----------------------------------------------------------------*/
    beforeEach(ngModule(main.name, function($provide) {

    }));

    /**
     * Inject
     * inject is used for resolving references that you need to use in your tests,
     * don't use this as a normal beforeEach, this beforeEach is used to resolve references
     */


    /*----------------------------------------------------------------*/
    /* Main Module
    /*----------------------------------------------------------------*/
    describe('Module', function() {
        it('should be an object', function() {
            expect(main).toBeObject();
        });

    });


    describe('Controllers', function() {

        var createController;

        beforeEach(ngInject(function($controller, $rootScope, $timeout) {
            createController = function(ctrlName) {
                return $controller(ctrlName, {
                    $scope: $rootScope
                    //, $timeout, widget, lpCoreBus
                    // add dep injections mock here
                });
            };
        }));
        // MainCtrl
        describe('NavBarAdvancedController', function() {
            var ctrl;
            beforeEach(function(){
                ctrl = createController('NavBarAdvancedController');
            });

            it('should exists', function() {
                expect(ctrl).toBeObject();
            });

        });

    });



});

