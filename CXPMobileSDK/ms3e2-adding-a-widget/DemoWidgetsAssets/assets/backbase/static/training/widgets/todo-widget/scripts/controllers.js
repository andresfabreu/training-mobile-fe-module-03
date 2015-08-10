/**
 * Controllers
 * @module controllers
 */
define(function (require, exports) {

    'use strict';

    // @ngInject
    exports.MainCtrl = function() {
        var ctrl = this;

        console.log('PATH',b$.portal.config.resourceRoot)

        ctrl.fu = "fuuuuuu";

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
