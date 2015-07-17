/**
 * Controllers
 * @module controllers
 */
define(function (require, exports) {

    'use strict';

    // @ngInject
    exports.MainCtrl = function($scope) {
        var ctrl = this;

        ctrl.tasks = [
            {description: 'Write a todo widget with Launchpad 12', done: true}
        ];

	    gadgets.pubsub.subscribe('ToDos',function(data){

			if(data && data.description){
				ctrl.addTask(data);
			}
	    });

        ctrl.addTask = function(data) {
            var newTask = {
                done: false,
                description: data.description
            };

            ctrl.tasks.push(newTask);
	        $scope.$apply();
        };

        ctrl.removeTask = function(taskId) {
            ctrl.tasks.splice(taskId, 1);
        };
    };
});
