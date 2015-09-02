define(function(require, exports, module) {
	'use strict';

	var base = require('base');
	var angular = base.ng;

	var lpResponsive = require('../../responsive/scripts/libs/responsive');

	var tpl = {};
	var find = function(el, query){
		return angular.element(el && el.querySelector(query));
	};

	// @ngInject
	exports.lpField = function () {

		return {
			restrict: 'EA',
			replace: true,
			transclude: true,
			template: tpl.lpField,
			scope: {
				label: '@',
				tip: '@',
				help: '@',
				actionLabel: '@',
				action: '@'
			},
			controller: 'FieldController',
			link: function (scope, element, attrs, modelCtrl, transcludeFn) {

				scope.extraControls = attrs.extraControls && attrs.extraControls === 'true';

				//manually process the transclusion
				transcludeFn( scope.$parent, function( clonedTranscludedContent ) {

					//clear out empty content on nested widgets?
					var elementList = [];
					if(clonedTranscludedContent.length > 1) {
						for(var i = 0; i < clonedTranscludedContent.length; i++) {
							if(clonedTranscludedContent[i].nodeType === 1) {
								elementList.push(clonedTranscludedContent[i]);
							}
						}
					} else {
						elementList.push(clonedTranscludedContent[0]);
					}

					var field = angular.element(elementList[0]);

					// element.find('.field-area').prepend(field); // does not work withoout jQuery
					find(element[0], '.field-area').prepend(field);

					//if there are extra controls
					if(scope.extraControls) {
						var control = angular.element(elementList[1]);
						// element.find('.extra-control').prepend(control);
						find(element[0], '.extra-control').prepend(control);
					}
				});
			}
		};
	};

	// @ngInject
	exports.lpEnterPressed = function() {
		return {
			restrict: 'A',
			scope: true,
			link: function(scope, elem, attrs) {
				elem.on('keydown', function(e){
					//checks to see if ENTER was pressed
					if(e.which === 13) {
						e.preventDefault();
						scope.$apply(function() {
							scope.save(scope.model.value);
						});
					}
				});
			}
		};
	};





	// @ngInject
	exports.lpControl = function ($timeout, $sce, newlinesFilter) {

		// base.deprecated('please use lp-field=')
		//var TEMPLATE_PATH = '/scripts/components/field/templates/';

		// #TODO split it into multiple composable input field components
		function templateFn() {
			return tpl.lpControl;
		}

		return {
			restrict: 'EA',
			replace: true,
			transclude: true,
			template: templateFn,
			scope: {
				label: '@',
				tip: '@',
				validate: '&',
				loading: '='
			},
			require: ['^lpField', '?ngModel'],
			link: function(scope, element, attrs, ctrls) {
				var ngModelCtrl = ctrls[1],
					fieldCtrl = ctrls[0];

				scope.keepEdittingOpen = false;

				scope.readonly = angular.isDefined(attrs.readonly) ? scope.$parent.$eval(attrs.readonly) : false;

				//add keydown listener to open editting
				element.on('keydown', function(e) {
					if(e.which === 13 && !scope.editting) {
						scope.setEditMode(true);
					}
				});

				if (!ngModelCtrl) {
					scope.readonly = true;
					return;
				}

				var required = angular.isDefined(attrs.required) ? scope.$parent.$eval(attrs.required) : true;

				attrs.$observe('type', function(value) {
					scope.type = value || 'text';

					if (scope.type === 'select' || scope.type === 'checkbox' || scope.type === 'select-multiple' || scope.type === 'radio') {
						scope.options = scope.$parent.$eval(attrs.options);
					}
				});

				scope.model = {};

				var focusEl;
				var getFocusEl = function() {
					if (!focusEl) {
						focusEl = find(element[0], (scope.type === 'select' || scope.type === 'select-multiple') ? 'select' :
							(scope.type === 'textarea' ? 'textarea' : 'input'));
					}
					if(focusEl.length > 1) {
						return focusEl[1];
					} else {
						return focusEl;
					}
				};

				scope.edditing = false;
				scope.setEditMode = function(isEditting) {
					scope.editting = isEditting;

					if (scope.editting) {
						scope.model.value = angular.copy(ngModelCtrl.$modelValue);

						//small screen? don't auto focus
						if(!scope.keepEdittingOpen){
							$timeout(function() {
								getFocusEl().focus();
							}, 0);
						}
					} else {
						fieldCtrl.clearErrors();
					}
				};


				$timeout(function() {
                    lpResponsive.enable(element).rule({
                        'max-width': 240,
                        then: function() {
                            scope.keepEdittingOpen = true;
                            scope.setEditMode(true);
                        }
                    }).rule({
                        'min-width': 241,
                        then: function() {
                            scope.keepEdittingOpen = false;
                            scope.setEditMode(false);
                        }
                    });
                });

				scope.save = function(value) {
					fieldCtrl.clearErrors();

					// value = utils.escapeHtml(value);
					value = angular.element('<div>').text(value).html();

					var isValid = true, inputLength = value.length;

					// Check required
					if ( required && inputLength < 1) {
						fieldCtrl.addError('required');
						return false;
					}

					// Custom validation
					if ( isValid && attrs.validate ) {
						isValid = scope.validate({value: value});
						if (typeof isValid === 'string') {
							fieldCtrl.addError(isValid);
							isValid = false;
						}
					}

					if ( isValid ) {
						//is the viewport less than 200px? Don't close edit more
						if(!scope.keepEdittingOpen) {
							scope.setEditMode(false);
						}
						ngModelCtrl.$setViewValue(value);
						scope.model.text = $sce.trustAsHtml(scope.getText(value));
					}
				};

				scope.isChecked = function(value) {
					return ngModelCtrl.$modelValue.indexOf(value) > -1;
				};

				scope.toggleCheck = function(value) {
					var idx = scope.model.value.indexOf(value);
					if ( idx > -1 ) {
						scope.model.value.splice(idx, 1);
					} else {
						scope.model.value.push(value);
					}
				};

				scope.getText = function(value) {
					var options = scope.options, i, n;

					if (scope.type === 'textarea') {
						value = newlinesFilter(value);
					} else if (scope.type === 'select' || scope.type === 'radio') {
						for (i = 0, n = options.length; i < n; i++) {
							if (options[i].value.toString() === value.toString()) {
								return options[i].text;
							}
						}
					} else if (scope.type === 'checkbox' || scope.type === 'select-multiple') {
						var text = [];
						for (i = 0, n = options.length; i < n; i++) {
							if (value.indexOf(options[i].value) > -1) {
								text.push( options[i].text );
							}
						}
						return text.join(', ');
					}

					return value ? value.toString().replace('<br/>', '\n') : ''; //fix to remove <br /> tag from textarea when editing is open
				};

				ngModelCtrl.$render = function() {
					scope.model.text = $sce.trustAsHtml(scope.getText(ngModelCtrl.$modelValue));
					scope.model.value = scope.getText(ngModelCtrl.$modelValue);
				};
			}
		};
	};




	tpl.lpField = [
		'<div class="lp-field form-group">',
		'	<label class="col-sm-3 control-label">',
		'		<span lp-i18n="{{label}}">{{label}}</span> <i class="lp-icon lp-icon-info-sign" tooltip="{{tip}}" tooltip-append-to-body="true" ng-show="tip"></i>',
		'	</label>',
		'	<div class="col-sm-6 field-area">',
		'		<div ng-repeat="error in errorMessages" class="text-danger"><small>{{error}}</small></div>',
		'		<div class="lp-field-help" ng-show="help">',
		'			<small class="text-muted" lp-i18n="{{help}}">{{help}}</small>',
		'		</div>',
		'	</div>',
		'	<div class="col-sm-3 no-padding extra-control">',
		'		<a ng-if="action" ng-href="{{action}}"><small>{{actionLabel || action}}</small></a>',
		'	</div>',
		'</div>'
	].join('\n');


	tpl.fieldFn = function(type){
		return [
			'<div ng-switch-when="', type, '" class="input-group">',
			'	<input type="', type, '" ng-model="model.value" class="form-control" lp-enter-pressed="" />',
				tpl.inputGroupBtn,
			'</div>'
		].join('');

	};

	tpl.btnFn = function(className){
		return [
			'<div class="'+className+'">',
			'	<button type="button" class="btn btn-default" ng-click="save(model.value)">',
			'		<i class="lp-icon lp-icon-ok-sign"></i>',
			'	</button>',
			'	<button type="button" class="btn btn-default" ng-click="setEditMode(false)" ng-hide="keepEdittingOpen">',
			'		<i class="lp-icon lp-icon-remove"></i>',
			'	</button>',
			'</div>'
		].join('');

	};

	tpl.inputGroupBtn = tpl.btnFn('input-group-btn');

	tpl.inputGroupBtnRight = tpl.btnFn('btn-group pull-right');

	tpl.lpControl = [
		'<div class="lp-editable">',
		'	<div ng-hide="editting" class="has-feedback">',
		'		<input type="input" tabindex="-1" ng-model="model.text" class="form-control" readonly="readonly" />',
		'		<span class="lp-icon lp-icon-pencil pull-right lp-editable-edit" tabindex="0" ',
		'			ng-click="setEditMode(true)" ng-hide="readonly || loading" style="cursor:pointer;"></span>',
		'	</div>',

		'	<div ng-show="editting" ng-switch on="type">',

		// TEXT INPUT
		tpl.fieldFn('text'),

		// NUMBER INPUT
		tpl.fieldFn('number'),

		// TEL INPUT
		tpl.fieldFn('tel'),

		// EMAIL INPUT
		tpl.fieldFn('email'),

		// URL INPUT
		tpl.fieldFn('url'),

		// TEXTAREA
		'	<div ng-switch-when="textarea">',
		'		<textarea ng-model="model.value" class="form-control" rows="3" lp-enter-pressed=""></textarea>',
				tpl.inputGroupBtnRight,
		'	</div>',

		// SELECT
		'	<div ng-switch-when="select" class="input-group">',
		'		<select ng-model="model.value" class="form-control" ng-options="option.value as option.text for option in options"></select>',
				tpl.inputGroupBtn,
		'	</div>',

		// SELECT MULTIPLE
		'	<div ng-switch-when="select-multiple" class="input-group">',
		'		<select ng-model="model.value" multiple="multiple" class="form-control" ng-options="option.value as option.text for option in options"></select>',
		'		<span type="button" class="input-group-addon" ng-click="save(model.value)"><i class="lp-icon lp-icon-ok-sign"></i></span>',
		'		<span class="input-group-addon" ng-hide="keepEdittingOpen" ng-click="setEditMode(false)"><span class="lp-icon lp-icon-remove"></span></span>',
		'	</div>',

		// CHECKBOX
		'	<div ng-switch-when="checkbox">',
		'		<div class="btn-group pull-right">',
		'			<button type="button" class="btn btn-default" ng-click="save(model.value)"><i class="lp-icon lp-icon-ok-sign"></i></button>',
		'		</div>',
		'		<div class="checkbox" ng-repeat="option in options">',
		'			<label><input type="checkbox" value="{{option.value}}" ng-checked="isChecked(option.value)" ',
		'					ng-click="toggleCheck(option.value)"> {{option.text}}</label>',
		'		</div>',
		'	</div>',

		// RADIO
		'	<div ng-switch-when="radio">',
				tpl.inputGroupBtnRight,
		'		<div class="radio" ng-repeat="option in options">',
		'			<label><input type="radio" value="{{option.value}}" ng-model="model.value"> {{option.text}}</label>',
		'		</div>',
		'	</div>',

		'	</div>',
		'</div>'
	].join('\n');




});
