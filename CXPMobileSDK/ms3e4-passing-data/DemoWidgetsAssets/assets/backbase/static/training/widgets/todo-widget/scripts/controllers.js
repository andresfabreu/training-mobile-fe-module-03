/**
 * Controllers
 * @module controllers
 */
define(function (require, exports) {

    'use strict';

    // @ngInject
    exports.MainCtrl = function($scope) {
        var ctrl = this;

        // listen for pubsub event from other widget, if data is there, add task
        gadgets.pubsub.subscribe('ToDos', function(data) {
            if(data && data.description) {
                ctrl.addTask(data);
                $scope.$apply();
            }
        });

        ctrl.tasks = [
            {description: 'Write a todo widget with Launchpad 12', done: true}
        ];

        ctrl.addTask = function(data) {
            var newTask = {
                done: false,
                description: data.description
            };

            ctrl.tasks.push(newTask);
        };

        ctrl.removeTask = function(taskId) {
            // console.log(taskId);
            ctrl.tasks.splice(taskId, 1);
        };
    };
});
