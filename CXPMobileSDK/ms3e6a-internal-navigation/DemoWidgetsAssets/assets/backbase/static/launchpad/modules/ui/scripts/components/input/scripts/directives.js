define(function(require, exports, module) {

	function buildInputDirective(type) {

		// @ngInject
		return function() {

			function lpInputLink(ctrl, el, attrs) {
				ctrl.placeholder = attrs.placeholder;
				ctrl.label = attrs.label;

				ctrl.change = function change(event) {
					ctrl.onChange({ $event: event });
				};

				if ('autofocus' in attrs) {
                    el.find('input').attr('autofocus', true);
                }
			}

            var tmpl = function () {
                return [
                    '<div class="form-group">',
                        '<label class="control-label" ng-show="label">{{label | translate}}</label>',
                        '<input type="' + type + '" lp-focus-id="{{focusId}}" placeholder="{{placeholder | translate}}" ng-disabled="disabled" ng-model="val" ng-change="change($event)" class="form-control" />',
                    '</div>'
                ].join('');
            }(type);

			return {
				scope: {
					config: '=lpInput',
					val: '=ngModel',
					focusId: '@',
					disabled: '=ngDisabled',
					onChange: '&'
				},
				restrict: 'AE',
				link: lpInputLink,
				template: tmpl
			};
		};
	}

	exports.lpTextInput = buildInputDirective('text');
	exports.lpPasswordInput = buildInputDirective('password');
});
