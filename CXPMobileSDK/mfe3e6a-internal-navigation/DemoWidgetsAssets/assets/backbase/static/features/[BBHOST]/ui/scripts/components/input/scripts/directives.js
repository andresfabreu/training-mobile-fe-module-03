define(function(require, exports, module) {

    'use strict';

	function buildInputDirective(type, name) {

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

				if (type === 'text') {
					el.find('input').attr('autocorrect', 'autocorrect' in attrs ? 'on' : 'off');
					el.find('input').attr('spellcheck', 'spellcheck' in attrs);
				}
			}

            var tmpl =
				'<div class="form-group">' +
					'<label class="control-label" ng-show="label">{{label | translate}}</label>' +
					'<input ' +
						'type="' + type + '" ' +
						'name="' + name + '" ' +
						'lp-focus-id="{{focusId}}" ' +
						'placeholder="{{placeholder | translate}}" ' +
						'ng-disabled="disabled" ' +
						'ng-model="val" ' +
						'ng-change="change($event)" ' +
						'class="form-control"' +
					'/>' +
				'</div>';

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

	exports.lpTextInput = buildInputDirective('text', 'username');
	exports.lpPasswordInput = buildInputDirective('password', 'password');
});
