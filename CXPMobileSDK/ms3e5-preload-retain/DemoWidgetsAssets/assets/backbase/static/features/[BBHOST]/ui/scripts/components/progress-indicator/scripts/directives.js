define(function(require, exports, module) {
	'use strict';

	// @ngInject
	exports.progressIndicator = function($templateCache, $compile) {


		$templateCache.put('$progressIndicator.html',
			'<div ng-show="showProgress" class="panel panel-default progress-indicator">' +
				'<div class="panel-body">' +
					'<p class="panel-message text-center {{customClasses}}"><i class="lp-icon lp-icon-spinner2 lp-spin loading-icon"></i></p>' +
				'</div>' +
			'</div>'
		);

		return {
			restrict: 'A',
			scope: {
				isLoading: '=',
				progressIndicator: '=',
				customClasses: '='
			},
			link: function (scope, element) {

				(function(val){
					scope.showProgress = scope[val];
					scope.$watch(val, function(){
						scope.showProgress = scope[val];
					});
				})(typeof scope.isLoading === 'undefined' ? 'progressIndicator' : 'isLoading');


				var initialize = function() {
					element.wrap('<div class="progress-indicator-container"></div>');
					var indicator = $compile($templateCache.get('$progressIndicator.html'))(scope);

					element.append(indicator);
				};

				initialize();
			}
		};

	};

});
