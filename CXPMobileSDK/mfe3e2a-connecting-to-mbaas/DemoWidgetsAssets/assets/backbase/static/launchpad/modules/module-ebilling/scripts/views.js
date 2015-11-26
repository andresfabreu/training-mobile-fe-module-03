define(function(require, exports, module) {

	'use strict';

	var $ = window.jQuery;

	// Store directives
	var directives = {};

	/**
	 * Ebilling list item directive
	 * @type {Array} angular js directive
	 */
	directives.eBillListItem = ['$timeout', '$compile', 'lpEbillingUtils', function ($timeout, $compile, utils) {

		var TPL = ['<div>',
					'<div class="list-view-container"',
						'on-swipe="onSwipe($event)"',
						'ng-click="onClick($event)"',
						'ng-keypress="onKeyPressed($event)"',
						'tabindex="0"',
						'ng-class="{\'bill-overdue\': bill.isOverdue}"',
						'on-gesture-options="{ dragLockToAxisX: true,  dragBlockHorizontal: true }">',
						'<div class="col-xs-7 e-bill-list-info column text-left">',
							'<div class="centered">',
								'<span class="sr-only">Name</span>',
								'<div class="h4 counterparty-name"><strong>{{title}}</strong></div>',
								'<div class="h6 text-muted">{{subtitle}}</div>',
							'</div>',
						'</div>',
						'<div class="col-xs-5 e-bill-list-amount-wrapper column text-right">',
							'<div class="centered">',
								'<div class="e-bill-list-amount">',
									'<span class="sr-only">Amount</span>',
									'<span class="h4">{{amount}}</span>',
								'</div>',
								'<div class="e-bill-list-info-amount">',
									'<span class="e-bill-auto-pay-stamp badge" ng-if="auto">Auto</span>',
									'<span class="e-bill-list-due-date badge" ng-if="date">',
										'<i class="glyphicon glyphicon-calendar"></i> {{date}}',
									'</span>',
								'</div>',
							'</div>',
						'</div>',
						'<div class="toggle-list">',
							'<i class="lp-icon" ng-class="{ \'lp-icon-angle-up\' : bill.opened, \'lp-icon-angle-down\': !bill.opened}"></i>',
						'</div>',
					'</div>',
					'<div ng-transclude></div>',
				'</div>'].join(' ');

		/*----------------------------------------------------------------*/
		/* Private's
		/*----------------------------------------------------------------*/
		var swipeLeft = function($el, width, cb) {
			var $scope = this;
			$('.list-view-container.swiped-out').css({ left: 0 }).removeClass('swiped-out');

			$el.stop().animate({
				width: $el.width() - width
			}, 0, function() {
				$scope.isSwiped = true;
				if (typeof cb === 'function') { cb.call(null); }
			}).addClass('swiped-out');
		};

		var swipeRight = function($el, cb) {
			var $scope = this;
			$el.stop().animate({
				width: '100%'
			}, 0, function() {
				$scope.isSwiped = false;
				if (typeof cb === 'function') { cb.call(null); }
			}).removeClass('swiped-out');
		};

		/*----------------------------------------------------------------*/
		/* Instance
		/*----------------------------------------------------------------*/
		var linkFn = function ($scope, $element, $attrs, modelCtrl) {
			var actionElWidth;
			var dragedEl = $element.find('.list-view-container');

			$scope.isSwiped = false;
			$scope.bill.opened = false;

			if($scope.bill.status === 'HANDLING') {
				$scope.bill.processing = true;
			}

			$scope.title = $scope.bill.mandate.creditor.name;
			$scope.subtitle = $scope.bill.mandate.creditor.reference;
			$scope.amount = $scope.bill.amountFiltered;
			$scope.date = $scope.bill.scheduledDateFiltered;
			$scope.auto = $scope.bill.mandate.directDebit;

			switch($attrs.eBillListItem) {
				case 'history' :
					$scope.subtitle = $scope.bill.statusReasonInformation ? $scope.bill.status + ' - ' + $scope.bill.statusReasonInformation : $scope.bill.status;
				break;
				case 'newbills' :
					$scope.subtitle = $scope.bill.mandate.creditor.reference;
				break;
			}

			$scope.onKeyPressed = function($event) {

				if($event.keyCode === 13 || $event.which === 32) {
					$scope.onClick($event);
					$event.preventDefault();
				}
			};

			$scope.onClick = function($event) {
				$scope.bill.opened = !$scope.bill.opened;
			};

			$scope.onSwipe = function($event) {

				var $itemList = $element.find('.list-view-container');
				actionElWidth = $element.find('.list-view-actions').width();

				if(+actionElWidth <= 0) { return; }

				if($scope.bill.opened) {
					$scope.bill.opened = false;
				}

				if( $scope.isSwiped) {
					$event.srcEvent.stopPropagation();
				}
				$timeout(function(){
					switch($event.direction) {
						case 2 : swipeLeft.call($scope, $itemList, actionElWidth); break; //left
						case 4 : swipeRight.call($scope, $itemList, actionElWidth); break; // right
					}
				}, 23);
			};

			$scope.$on('$destroy', function() {
				// Clean up
			});

			$scope.$watch('bill.opened', function(val) {
				if( $scope.isSwiped || ($scope.isSwiped && !!val) ) {
					swipeRight.call($scope, dragedEl);
				}
			});

			$scope.$watch('bill.autoPay', function(val) {
				actionElWidth = $element.find('.list-view-actions').width();
				$timeout(function(){
					actionElWidth = $element.find('.list-view-actions').width();
					if($scope.isSwiped) {
						$('.list-view-container.swiped-out').css({ left: -actionElWidth });
					}
				});
			});
		};

		var compileFn = function() {
			return linkFn;
		};
		return {
			restrict: 'EA',
			require: '?ngModel',
			priority: Number.MAX_VALUE,
			transclude: true,
			compile: compileFn,
			template: TPL,
			scope: {
				bill: '=ngModel'
			}
		};
	}];

	/**
	 * Ebilling Amount input Directive
	 * @param  {[type]} $timeout [description]
	 * @return {[type]}          [description]
	 */
	directives.eBillAmountInput = ['$timeout', function ($timeout) {
		var TPL = ['<div class="input-group clearfix">',
						'<span class="input-group-addon" ng-bind="currencySym" ng-if="currencySym"></span>',
						'<input name="noDecimal"  placeholder="0" lp-number-input lp-max-length="4" min="0" class="form-control whole-amount-input pull-left text-right" type="number" ng-model="noDecimal"/>',
						'<div class="pull-left decimal"><span class="decimal-point">.</span></div>',
						'<input name="decimal" lp-number-input type="number" ng-model="decimal" placeholder="0" lp-max-length="2" min="0" maxlength="2" max="99" class="text-right form-control pull-left decimal-amount-input" /> ',
					'</div>'].join('');

		var linkFn = function linkFnBillAmountInput (scope, $element, $attrs, modelCtrl) {

			var config = scope.config || {};
			scope.currencySym = config.currencySym || '';

			scope.decimal = 0;
			scope.noDecimal = 0;

			function pad(n, width, z) {
				z = z || '0';
				n = n + '';
				return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
			}

			function combineDecimals () {
				var decimal = pad(parseInt(scope.decimal, 10) || 0, 2);
				var noDecimal = parseInt(scope.noDecimal, 10) || 0;
				return parseFloat(noDecimal + '.' + decimal).toFixed(2);
			}

			scope.$watch('noDecimal+decimal', function() {
				var newValue = combineDecimals();
				scope.amount = parseFloat(newValue);
				modelCtrl.$setViewValue( scope.amount );
			});

			scope.$on('$destroy', function() {
				// Destroy
			});

		};
		return {
			restrict: 'EA',
			require: '?ngModel',
			priority: Number.MAX_VALUE,
			transclude: true,
			link: linkFn,
			template: TPL,
			scope: {
				amount: '=ngModel',
				config: '=eBillAmountInput'
			}
		};

	}];

	/*----------------------------------------------------------------*/
	/* Exports
	/*----------------------------------------------------------------*/
	exports.directives = directives;
});
