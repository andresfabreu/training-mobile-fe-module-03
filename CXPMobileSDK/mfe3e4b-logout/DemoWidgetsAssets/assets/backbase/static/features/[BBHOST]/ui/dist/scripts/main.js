(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("base"), require("core"), require("jquery"), require("hammerjs"));
	else if(typeof define === 'function' && define.amd)
		define(["base", "core", "jquery", "hammerjs"], factory);
	else if(typeof exports === 'object')
		exports["ui"] = factory(require("base"), require("core"), require("jquery"), require("hammerjs"));
	else
		root["ui"] = factory(root["base"], root["core"], root["jquery"], root["hammerjs"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_2__, __WEBPACK_EXTERNAL_MODULE_7__, __WEBPACK_EXTERNAL_MODULE_49__, __WEBPACK_EXTERNAL_MODULE_59__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/* WEBPACK VAR INJECTION */(function(module) {!(__WEBPACK_AMD_DEFINE_RESULT__ = function(require, exports, module) {
	    'use strict';

	    module.name = 'ui';

	    var base = __webpack_require__(2);

	    // 3rd party vendor
	    // Using angular boostrap
	    __webpack_require__(3);

	    var deps = [
	        'ui.bootstrap',
	        __webpack_require__(4).name,
	        __webpack_require__(6).name,
	        __webpack_require__(9).name,
	        __webpack_require__(11).name,
	        __webpack_require__(15).name,
	        __webpack_require__(18).name,
	        __webpack_require__(21).name,
	        __webpack_require__(23).name,
	        __webpack_require__(25).name,
	        __webpack_require__(27).name,
	        __webpack_require__(29).name,
	        __webpack_require__(31).name,
	        __webpack_require__(33).name,
	        __webpack_require__(36).name,
	        __webpack_require__(38).name,
	        __webpack_require__(41).name,
	        __webpack_require__(43).name,
	        __webpack_require__(45).name,
	        __webpack_require__(47).name,
	        __webpack_require__(57).name,
	        __webpack_require__(60).name,
	        __webpack_require__(63).name,
	        __webpack_require__(66).name,
	        __webpack_require__(68).name,
	        // ui utils
	        __webpack_require__(70).name
	   ];

	    module.exports = base.createModule(module.name, deps);

	}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)(module)))

/***/ },
/* 1 */
/***/ function(module, exports) {

	module.exports = function(module) {
		if(!module.webpackPolyfill) {
			module.deprecate = function() {};
			module.paths = [];
			// module.parent = undefined by default
			module.children = [];
			module.webpackPolyfill = 1;
		}
		return module;
	}


/***/ },
/* 2 */
/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_2__;

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/* eslint-disable*/
	// todo: remove this - it's required for requirejs to know to load
	// angular before loading this.
	!(__WEBPACK_AMD_DEFINE_RESULT__ = function(require, exports, module) {

	  var angular = __webpack_require__(2).ng;
	/*
	 * angular-ui-bootstrap
	 * http://angular-ui.github.io/bootstrap/

	 * Version: 0.11.0-SNAPSHOT - 2014-02-24
	 * License: MIT
	 */
	angular.module("ui.bootstrap", ["ui.bootstrap.tpls", "ui.bootstrap.transition","ui.bootstrap.collapse","ui.bootstrap.accordion", 'ui.bootstrap.dateparser', "ui.bootstrap.alert","ui.bootstrap.bindHtml","ui.bootstrap.buttons","ui.bootstrap.carousel","ui.bootstrap.position","ui.bootstrap.datepicker","ui.bootstrap.dropdown","ui.bootstrap.dropdownSelect","ui.bootstrap.modal","ui.bootstrap.pagination","ui.bootstrap.tooltip","ui.bootstrap.popover","ui.bootstrap.progressbar","ui.bootstrap.rating","ui.bootstrap.tabs","ui.bootstrap.timepicker","ui.bootstrap.typeahead"]);
	angular.module("ui.bootstrap.tpls", ["template/accordion/accordion-group.html","template/accordion/accordion.html","template/alert/alert.html","template/carousel/carousel.html","template/carousel/slide.html","template/datepicker/datepicker.html","template/datepicker/day.html","template/datepicker/month.html","template/datepicker/popup.html","template/datepicker/year.html","template/dropdownSelect/option.html","template/dropdownSelect/placeholder-empty.html","template/dropdownSelect/select.html","template/modal/backdrop.html","template/modal/window.html","template/pagination/pager.html","template/pagination/pagination.html","template/tooltip/tooltip-html-unsafe-popup.html","template/tooltip/tooltip-popup.html","template/popover/popover.html","template/progressbar/bar.html","template/progressbar/progress.html","template/progressbar/progressbar.html","template/rating/rating.html","template/tabs/tab.html","template/tabs/tabset.html","template/timepicker/timepicker.html","template/typeahead/typeahead-match.html","template/typeahead/typeahead-popup.html"]);
	angular.module('ui.bootstrap.transition', [])

	/**
	 * $transition service provides a consistent interface to trigger CSS 3 transitions and to be informed when they complete.
	 * @param  {DOMElement} element  The DOMElement that will be animated.
	 * @param  {string|object|function} trigger  The thing that will cause the transition to start:
	 *   - As a string, it represents the css class to be added to the element.
	 *   - As an object, it represents a hash of style attributes to be applied to the element.
	 *   - As a function, it represents a function to be called that will cause the transition to occur.
	 * @return {Promise}  A promise that is resolved when the transition finishes.
	 */
	.factory('$transition', ['$q', '$timeout', '$rootScope', function($q, $timeout, $rootScope) {

	  var $transition = function(element, trigger, options) {
	    options = options || {};
	    var deferred = $q.defer();
	    var endEventName = $transition[options.animation ? 'animationEndEventName' : 'transitionEndEventName'];

	    var transitionEndHandler = function(event) {
	      $rootScope.$apply(function() {
	        element.unbind(endEventName, transitionEndHandler);
	        deferred.resolve(element);
	      });
	    };

	    if (endEventName) {
	      element.bind(endEventName, transitionEndHandler);
	    }

	    // Wrap in a timeout to allow the browser time to update the DOM before the transition is to occur
	    $timeout(function() {
	      if ( angular.isString(trigger) ) {
	        element.addClass(trigger);
	      } else if ( angular.isFunction(trigger) ) {
	        trigger(element);
	      } else if ( angular.isObject(trigger) ) {
	        element.css(trigger);
	      }
	      //If browser does not support transitions, instantly resolve
	      if ( !endEventName ) {
	        deferred.resolve(element);
	      }
	    });

	    // Add our custom cancel function to the promise that is returned
	    // We can call this if we are about to run a new transition, which we know will prevent this transition from ending,
	    // i.e. it will therefore never raise a transitionEnd event for that transition
	    deferred.promise.cancel = function() {
	      if ( endEventName ) {
	        element.unbind(endEventName, transitionEndHandler);
	      }
	      deferred.reject('Transition cancelled');
	    };

	    return deferred.promise;
	  };

	  // Work out the name of the transitionEnd event
	  var transElement = document.createElement('trans');
	  var transitionEndEventNames = {
	    'WebkitTransition': 'webkitTransitionEnd',
	    'MozTransition': 'transitionend',
	    'OTransition': 'oTransitionEnd',
	    'transition': 'transitionend'
	  };
	  var animationEndEventNames = {
	    'WebkitTransition': 'webkitAnimationEnd',
	    'MozTransition': 'animationend',
	    'OTransition': 'oAnimationEnd',
	    'transition': 'animationend'
	  };
	  function findEndEventName(endEventNames) {
	    for (var name in endEventNames){
	      if (transElement.style[name] !== undefined) {
	        return endEventNames[name];
	      }
	    }
	  }
	  $transition.transitionEndEventName = findEndEventName(transitionEndEventNames);
	  $transition.animationEndEventName = findEndEventName(animationEndEventNames);
	  return $transition;
	}]);

	angular.module('ui.bootstrap.collapse', ['ui.bootstrap.transition'])

	  .directive('collapse', ['$transition', function ($transition) {

	    return {
	      link: function (scope, element, attrs) {

	        var initialAnimSkip = true;
	        var currentTransition;

	        function doTransition(change) {
	          var newTransition = $transition(element, change);
	          if (currentTransition) {
	            currentTransition.cancel();
	          }
	          currentTransition = newTransition;
	          newTransition.then(newTransitionDone, newTransitionDone);
	          return newTransition;

	          function newTransitionDone() {
	            // Make sure it's this transition, otherwise, leave it alone.
	            if (currentTransition === newTransition) {
	              currentTransition = undefined;
	            }
	          }
	        }

	        function expand() {
	          if (initialAnimSkip) {
	            initialAnimSkip = false;
	            expandDone();
	          } else {
	            element.removeClass('collapse').addClass('collapsing');
	            doTransition({ height: element[0].scrollHeight + 'px' }).then(expandDone);
	          }
	        }

	        function expandDone() {
	          element.removeClass('collapsing');
	          element.addClass('collapse in');
	          element.css({height: 'auto'});
	        }

	        function collapse() {
	          if (initialAnimSkip) {
	            initialAnimSkip = false;
	            collapseDone();
	            element.css({height: 0});
	          } else {
	            // CSS transitions don't work with height: auto, so we have to manually change the height to a specific value
	            element.css({ height: element[0].scrollHeight + 'px' });
	            //trigger reflow so a browser realizes that height was updated from auto to a specific value
	            var x = element[0].offsetWidth;

	            element.removeClass('collapse in').addClass('collapsing');

	            doTransition({ height: 0 }).then(collapseDone);
	          }
	        }

	        function collapseDone() {
	          element.removeClass('collapsing');
	          element.addClass('collapse');
	        }

	        scope.$watch(attrs.collapse, function (shouldCollapse) {
	          if (shouldCollapse) {
	            collapse();
	          } else {
	            expand();
	          }
	        });
	      }
	    };
	  }]);

	angular.module('ui.bootstrap.accordion', ['ui.bootstrap.collapse'])

	.constant('accordionConfig', {
	  closeOthers: true
	})

	.controller('AccordionController', ['$scope', '$attrs', 'accordionConfig', function ($scope, $attrs, accordionConfig) {

	  // This array keeps track of the accordion groups
	  this.groups = [];

	  // Ensure that all the groups in this accordion are closed, unless close-others explicitly says not to
	  this.closeOthers = function(openGroup) {
	    var closeOthers = angular.isDefined($attrs.closeOthers) ? $scope.$eval($attrs.closeOthers) : accordionConfig.closeOthers;
	    if ( closeOthers ) {
	      angular.forEach(this.groups, function (group) {
	        if ( group !== openGroup ) {
	          group.isOpen = false;
	        }
	      });
	    }
	  };

	  // This is called from the accordion-group directive to add itself to the accordion
	  this.addGroup = function(groupScope) {
	    var that = this;
	    this.groups.push(groupScope);

	    groupScope.$on('$destroy', function (event) {
	      that.removeGroup(groupScope);
	    });
	  };

	  // This is called from the accordion-group directive when to remove itself
	  this.removeGroup = function(group) {
	    var index = this.groups.indexOf(group);
	    if ( index !== -1 ) {
	      this.groups.splice(index, 1);
	    }
	  };

	}])

	// The accordion directive simply sets up the directive controller
	// and adds an accordion CSS class to itself element.
	.directive('accordion', function () {
	  return {
	    restrict:'EA',
	    controller:'AccordionController',
	    transclude: true,
	    replace: false,
	    templateUrl: 'template/accordion/accordion.html'
	  };
	})

	// The accordion-group directive indicates a block of html that will expand and collapse in an accordion
	.directive('accordionGroup', function() {
	  return {
	    require:'^accordion',         // We need this directive to be inside an accordion
	    restrict:'EA',
	    transclude:true,              // It transcludes the contents of the directive into the template
	    replace: true,                // The element containing the directive will be replaced with the template
	    templateUrl:'template/accordion/accordion-group.html',
	    scope: {
	      heading: '@',               // Interpolate the heading attribute onto this scope
	      isOpen: '=?',
	      isDisabled: '=?'
	    },
	    controller: function() {
	      this.setHeading = function(element) {
	        this.heading = element;
	      };
	    },
	    link: function(scope, element, attrs, accordionCtrl) {
	      accordionCtrl.addGroup(scope);

	      scope.$watch('isOpen', function(value) {
	        if ( value ) {
	          accordionCtrl.closeOthers(scope);
	        }
	      });

	      scope.toggleOpen = function() {
	        if ( !scope.isDisabled ) {
	          scope.isOpen = !scope.isOpen;
	        }
	      };
	    }
	  };
	})

	// Use accordion-heading below an accordion-group to provide a heading containing HTML
	// <accordion-group>
	//   <accordion-heading>Heading containing HTML - <img src="..."></accordion-heading>
	// </accordion-group>
	.directive('accordionHeading', function() {
	  return {
	    restrict: 'EA',
	    transclude: true,   // Grab the contents to be used as the heading
	    template: '',       // In effect remove this element!
	    replace: true,
	    require: '^accordionGroup',
	    link: function(scope, element, attr, accordionGroupCtrl, transclude) {
	      // Pass the heading to the accordion-group controller
	      // so that it can be transcluded into the right place in the template
	      // [The second parameter to transclude causes the elements to be cloned so that they work in ng-repeat]
	      accordionGroupCtrl.setHeading(transclude(scope, function() {}));
	    }
	  };
	})

	// Use in the accordion-group template to indicate where you want the heading to be transcluded
	// You must provide the property on the accordion-group controller that will hold the transcluded element
	// <div class="accordion-group">
	//   <div class="accordion-heading" ><a ... accordion-transclude="heading">...</a></div>
	//   ...
	// </div>
	.directive('accordionTransclude', function() {
	  return {
	    require: '^accordionGroup',
	    link: function(scope, element, attr, controller) {
	      scope.$watch(function() { return controller[attr.accordionTransclude]; }, function(heading) {
	        if ( heading ) {
	          element.html('');
	          element.append(heading);
	        }
	      });
	    }
	  };
	});

	angular.module('ui.bootstrap.alert', [])

	.controller('AlertController', ['$scope', '$attrs', function ($scope, $attrs) {
	  $scope.closeable = 'close' in $attrs;
	}])

	.directive('alert', function () {
	  return {
	    restrict:'EA',
	    controller:'AlertController',
	    templateUrl:'template/alert/alert.html',
	    transclude:true,
	    replace:true,
	    scope: {
	      type: '@',
	      close: '&'
	    }
	  };
	});

	angular.module('ui.bootstrap.bindHtml', [])

	  .directive('bindHtmlUnsafe', function () {
	    return function (scope, element, attr) {
	      element.addClass('ng-binding').data('$binding', attr.bindHtmlUnsafe);
	      scope.$watch(attr.bindHtmlUnsafe, function bindHtmlUnsafeWatchAction(value) {
	        element.html(value || '');
	      });
	    };
	  });
	angular.module('ui.bootstrap.buttons', [])

	.constant('buttonConfig', {
	  activeClass: 'active',
	  toggleEvent: 'click'
	})

	.controller('ButtonsController', ['buttonConfig', function(buttonConfig) {
	  this.activeClass = buttonConfig.activeClass || 'active';
	  this.toggleEvent = buttonConfig.toggleEvent || 'click';
	}])

	.directive('btnRadio', function () {
	  return {
	    require: ['btnRadio', 'ngModel'],
	    controller: 'ButtonsController',
	    link: function (scope, element, attrs, ctrls) {
	      var buttonsCtrl = ctrls[0], ngModelCtrl = ctrls[1];

	      //model -> UI
	      ngModelCtrl.$render = function () {
	        element.toggleClass(buttonsCtrl.activeClass, angular.equals(ngModelCtrl.$modelValue, scope.$eval(attrs.btnRadio)));
	      };

	      //ui->model
	      element.bind(buttonsCtrl.toggleEvent, function () {
	        if (!element.hasClass(buttonsCtrl.activeClass)) {
	          scope.$apply(function () {
	            ngModelCtrl.$setViewValue(scope.$eval(attrs.btnRadio));
	            ngModelCtrl.$render();
	          });
	        }
	      });
	    }
	  };
	})

	.directive('btnCheckbox', function () {
	  return {
	    require: ['btnCheckbox', 'ngModel'],
	    controller: 'ButtonsController',
	    link: function (scope, element, attrs, ctrls) {
	      var buttonsCtrl = ctrls[0], ngModelCtrl = ctrls[1];

	      function getTrueValue() {
	        return getCheckboxValue(attrs.btnCheckboxTrue, true);
	      }

	      function getFalseValue() {
	        return getCheckboxValue(attrs.btnCheckboxFalse, false);
	      }

	      function getCheckboxValue(attributeValue, defaultValue) {
	        var val = scope.$eval(attributeValue);
	        return angular.isDefined(val) ? val : defaultValue;
	      }

	      //model -> UI
	      ngModelCtrl.$render = function () {
	        element.toggleClass(buttonsCtrl.activeClass, angular.equals(ngModelCtrl.$modelValue, getTrueValue()));
	      };

	      //ui->model
	      element.bind(buttonsCtrl.toggleEvent, function () {
	        scope.$apply(function () {
	          ngModelCtrl.$setViewValue(element.hasClass(buttonsCtrl.activeClass) ? getFalseValue() : getTrueValue());
	          ngModelCtrl.$render();
	        });
	      });
	    }
	  };
	});

	/**
	* @ngdoc overview
	* @name ui.bootstrap.carousel
	*
	* @description
	* AngularJS version of an image carousel.
	*
	*/
	angular.module('ui.bootstrap.carousel', ['ui.bootstrap.transition'])
	.controller('CarouselController', ['$scope', '$timeout', '$transition', function ($scope, $timeout, $transition) {
	  var self = this,
	    slides = self.slides = $scope.slides = [],
	    currentIndex = -1,
	    currentTimeout, isPlaying;
	  self.currentSlide = null;

	  var destroyed = false;
	  /* direction: "prev" or "next" */
	  self.select = $scope.select = function(nextSlide, direction) {
	    var nextIndex = slides.indexOf(nextSlide);
	    //Decide direction if it's not given
	    if (direction === undefined) {
	      direction = nextIndex > currentIndex ? 'next' : 'prev';
	    }
	    if (nextSlide && nextSlide !== self.currentSlide) {
	      if ($scope.$currentTransition) {
	        $scope.$currentTransition.cancel();
	        //Timeout so ng-class in template has time to fix classes for finished slide
	        $timeout(goNext);
	      } else {
	        goNext();
	      }
	    }
	    function goNext() {
	      // Scope has been destroyed, stop here.
	      if (destroyed) { return; }
	      //If we have a slide to transition from and we have a transition type and we're allowed, go
	      if (self.currentSlide && angular.isString(direction) && !$scope.noTransition && nextSlide.$element) {
	        //We shouldn't do class manip in here, but it's the same weird thing bootstrap does. need to fix sometime
	        nextSlide.$element.addClass(direction);
	        var reflow = nextSlide.$element[0].offsetWidth; //force reflow

	        //Set all other slides to stop doing their stuff for the new transition
	        angular.forEach(slides, function(slide) {
	          angular.extend(slide, {direction: '', entering: false, leaving: false, active: false});
	        });
	        angular.extend(nextSlide, {direction: direction, active: true, entering: true});
	        angular.extend(self.currentSlide||{}, {direction: direction, leaving: true});

	        $scope.$currentTransition = $transition(nextSlide.$element, {});
	        //We have to create new pointers inside a closure since next & current will change
	        (function(next,current) {
	          $scope.$currentTransition.then(
	            function(){ transitionDone(next, current); },
	            function(){ transitionDone(next, current); }
	          );
	        }(nextSlide, self.currentSlide));
	      } else {
	        transitionDone(nextSlide, self.currentSlide);
	      }
	      self.currentSlide = nextSlide;
	      currentIndex = nextIndex;
	      //every time you change slides, reset the timer
	      restartTimer();
	    }
	    function transitionDone(next, current) {
	      angular.extend(next, {direction: '', active: true, leaving: false, entering: false});
	      angular.extend(current||{}, {direction: '', active: false, leaving: false, entering: false});
	      $scope.$currentTransition = null;
	    }
	  };
	  $scope.$on('$destroy', function () {
	    destroyed = true;
	  });

	  /* Allow outside people to call indexOf on slides array */
	  self.indexOfSlide = function(slide) {
	    return slides.indexOf(slide);
	  };

	  $scope.next = function() {
	    var newIndex = (currentIndex + 1) % slides.length;

	    //Prevent this user-triggered transition from occurring if there is already one in progress
	    if (!$scope.$currentTransition) {
	      return self.select(slides[newIndex], 'next');
	    }
	  };

	  $scope.prev = function() {
	    var newIndex = currentIndex - 1 < 0 ? slides.length - 1 : currentIndex - 1;

	    //Prevent this user-triggered transition from occurring if there is already one in progress
	    if (!$scope.$currentTransition) {
	      return self.select(slides[newIndex], 'prev');
	    }
	  };

	  $scope.isActive = function(slide) {
	     return self.currentSlide === slide;
	  };

	  $scope.$watch('interval', restartTimer);
	  $scope.$on('$destroy', resetTimer);

	  function restartTimer() {
	    resetTimer();
	    var interval = +$scope.interval;
	    if (!isNaN(interval) && interval>=0) {
	      currentTimeout = $timeout(timerFn, interval);
	    }
	  }

	  function resetTimer() {
	    if (currentTimeout) {
	      $timeout.cancel(currentTimeout);
	      currentTimeout = null;
	    }
	  }

	  function timerFn() {
	    if (isPlaying) {
	      $scope.next();
	      restartTimer();
	    } else {
	      $scope.pause();
	    }
	  }

	  $scope.play = function() {
	    if (!isPlaying) {
	      isPlaying = true;
	      restartTimer();
	    }
	  };
	  $scope.pause = function() {
	    if (!$scope.noPause) {
	      isPlaying = false;
	      resetTimer();
	    }
	  };

	  self.addSlide = function(slide, element) {
	    slide.$element = element;
	    slides.push(slide);
	    //if this is the first slide or the slide is set to active, select it
	    if(slides.length === 1 || slide.active) {
	      self.select(slides[slides.length-1]);
	      if (slides.length == 1) {
	        $scope.play();
	      }
	    } else {
	      slide.active = false;
	    }
	  };

	  self.removeSlide = function(slide) {
	    //get the index of the slide inside the carousel
	    var index = slides.indexOf(slide);
	    slides.splice(index, 1);
	    if (slides.length > 0 && slide.active) {
	      if (index >= slides.length) {
	        self.select(slides[index-1]);
	      } else {
	        self.select(slides[index]);
	      }
	    } else if (currentIndex > index) {
	      currentIndex--;
	    }
	  };

	}])

	/**
	 * @ngdoc directive
	 * @name ui.bootstrap.carousel.directive:carousel
	 * @restrict EA
	 *
	 * @description
	 * Carousel is the outer container for a set of image 'slides' to showcase.
	 *
	 * @param {number=} interval The time, in milliseconds, that it will take the carousel to go to the next slide.
	 * @param {boolean=} noTransition Whether to disable transitions on the carousel.
	 * @param {boolean=} noPause Whether to disable pausing on the carousel (by default, the carousel interval pauses on hover).
	 *
	 * @example
	<example module="ui.bootstrap">
	  <file name="index.html">
	    <carousel>
	      <slide>
	        <img src="http://placekitten.com/150/150" style="margin:auto;">
	        <div class="carousel-caption">
	          <p>Beautiful!</p>
	        </div>
	      </slide>
	      <slide>
	        <img src="http://placekitten.com/100/150" style="margin:auto;">
	        <div class="carousel-caption">
	          <p>D'aww!</p>
	        </div>
	      </slide>
	    </carousel>
	  </file>
	  <file name="demo.css">
	    .carousel-indicators {
	      top: auto;
	      bottom: 15px;
	    }
	  </file>
	</example>
	 */
	.directive('carousel', [function() {
	  return {
	    restrict: 'EA',
	    transclude: true,
	    replace: true,
	    controller: 'CarouselController',
	    require: 'carousel',
	    templateUrl: 'template/carousel/carousel.html',
	    scope: {
	      interval: '=',
	      noTransition: '=',
	      noPause: '='
	    }
	  };
	}])

	/**
	 * @ngdoc directive
	 * @name ui.bootstrap.carousel.directive:slide
	 * @restrict EA
	 *
	 * @description
	 * Creates a slide inside a {@link ui.bootstrap.carousel.directive:carousel carousel}.  Must be placed as a child of a carousel element.
	 *
	 * @param {boolean=} active Model binding, whether or not this slide is currently active.
	 *
	 * @example
	<example module="ui.bootstrap">
	  <file name="index.html">
	<div ng-controller="CarouselDemoCtrl">
	  <carousel>
	    <slide ng-repeat="slide in slides" active="slide.active">
	      <img ng-src="{{slide.image}}" style="margin:auto;">
	      <div class="carousel-caption">
	        <h4>Slide {{$index}}</h4>
	        <p>{{slide.text}}</p>
	      </div>
	    </slide>
	  </carousel>
	  Interval, in milliseconds: <input type="number" ng-model="myInterval">
	  <br />Enter a negative number to stop the interval.
	</div>
	  </file>
	  <file name="script.js">
	function CarouselDemoCtrl($scope) {
	  $scope.myInterval = 5000;
	}
	  </file>
	  <file name="demo.css">
	    .carousel-indicators {
	      top: auto;
	      bottom: 15px;
	    }
	  </file>
	</example>
	*/

	.directive('slide', function() {
	  return {
	    require: '^carousel',
	    restrict: 'EA',
	    transclude: true,
	    replace: true,
	    templateUrl: 'template/carousel/slide.html',
	    scope: {
	      active: '=?'
	    },
	    link: function (scope, element, attrs, carouselCtrl) {
	      carouselCtrl.addSlide(scope, element);
	      //when the scope is destroyed then remove the slide from the current slides array
	      scope.$on('$destroy', function() {
	        carouselCtrl.removeSlide(scope);
	      });

	      scope.$watch('active', function(active) {
	        if (active) {
	          carouselCtrl.select(scope);
	        }
	      });
	    }
	  };
	});

	angular.module('ui.bootstrap.position', [])

	/**
	 * A set of utility methods that can be use to retrieve position of DOM elements.
	 * It is meant to be used where we need to absolute-position DOM elements in
	 * relation to other, existing elements (this is the case for tooltips, popovers,
	 * typeahead suggestions etc.).
	 */
	  .factory('$position', ['$document', '$window', function ($document, $window) {

	    function getStyle(el, cssprop) {
	      if (el.currentStyle) { //IE
	        return el.currentStyle[cssprop];
	      } else if ($window.getComputedStyle) {
	        return $window.getComputedStyle(el)[cssprop];
	      }
	      // finally try and get inline style
	      return el.style[cssprop];
	    }

	    /**
	     * Checks if a given element is statically positioned
	     * @param element - raw DOM element
	     */
	    function isStaticPositioned(element) {
	      return (getStyle(element, 'position') || 'static' ) === 'static';
	    }

	    /**
	     * returns the closest, non-statically positioned parentOffset of a given element
	     * @param element
	     */
	    var parentOffsetEl = function (element) {
	      var docDomEl = $document[0];
	      var offsetParent = element.offsetParent || docDomEl;
	      while (offsetParent && offsetParent !== docDomEl && isStaticPositioned(offsetParent) ) {
	        offsetParent = offsetParent.offsetParent;
	      }
	      return offsetParent || docDomEl;
	    };

	    return {
	      /**
	       * Provides read-only equivalent of jQuery's position function:
	       * http://api.jquery.com/position/
	       */
	      position: function (element) {
	        var elBCR = this.offset(element);
	        var offsetParentBCR = { top: 0, left: 0 };
	        var offsetParentEl = parentOffsetEl(element[0]);
	        if (offsetParentEl != $document[0]) {
	          offsetParentBCR = this.offset(angular.element(offsetParentEl));
	          offsetParentBCR.top += offsetParentEl.clientTop - offsetParentEl.scrollTop;
	          offsetParentBCR.left += offsetParentEl.clientLeft - offsetParentEl.scrollLeft;
	        }

	        var boundingClientRect = element[0].getBoundingClientRect();
	        return {
	          width: boundingClientRect.width || element.prop('offsetWidth'),
	          height: boundingClientRect.height || element.prop('offsetHeight'),
	          top: elBCR.top - offsetParentBCR.top,
	          left: elBCR.left - offsetParentBCR.left
	        };
	      },

	      /**
	       * Provides read-only equivalent of jQuery's offset function:
	       * http://api.jquery.com/offset/
	       */
	      offset: function (element) {
	        var boundingClientRect = element[0].getBoundingClientRect();
	        return {
	          width: boundingClientRect.width || element.prop('offsetWidth'),
	          height: boundingClientRect.height || element.prop('offsetHeight'),
	          top: boundingClientRect.top + ($window.pageYOffset || $document[0].documentElement.scrollTop),
	          left: boundingClientRect.left + ($window.pageXOffset || $document[0].documentElement.scrollLeft)
	        };
	      },

	      /**
	       * Provides coordinates for the targetEl in relation to hostEl
	       */
	      positionElements: function (hostEl, targetEl, positionStr, appendToBody) {

	        var positionStrParts = positionStr.split('-');
	        var pos0 = positionStrParts[0], pos1 = positionStrParts[1] || 'center';

	        var hostElPos,
	          targetElWidth,
	          targetElHeight,
	          targetElPos;

	        hostElPos = appendToBody ? this.offset(hostEl) : this.position(hostEl);

	        targetElWidth = targetEl.prop('offsetWidth');
	        targetElHeight = targetEl.prop('offsetHeight');

	        var shiftWidth = {
	          center: function () {
	            return hostElPos.left + hostElPos.width / 2 - targetElWidth / 2;
	          },
	          left: function () {
	            return hostElPos.left;
	          },
	          right: function () {
	            return hostElPos.left + hostElPos.width;
	          }
	        };

	        var shiftHeight = {
	          center: function () {
	            return hostElPos.top + hostElPos.height / 2 - targetElHeight / 2;
	          },
	          top: function () {
	            return hostElPos.top;
	          },
	          bottom: function () {
	            return hostElPos.top + hostElPos.height;
	          }
	        };

	        switch (pos0) {
	          case 'right':
	            targetElPos = {
	              top: shiftHeight[pos1](),
	              left: shiftWidth[pos0]()
	            };
	            break;
	          case 'left':
	            targetElPos = {
	              top: shiftHeight[pos1](),
	              left: hostElPos.left - targetElWidth
	            };
	            break;
	          case 'bottom':
	            targetElPos = {
	              top: shiftHeight[pos0](),
	              left: shiftWidth[pos1]()
	            };
	            break;
	          default:
	            targetElPos = {
	              top: hostElPos.top - targetElHeight,
	              left: shiftWidth[pos1]()
	            };
	            break;
	        }

	        return targetElPos;
	      }
	    };
	  }]);


	angular.module('ui.bootstrap.dateparser', [])

	.service('dateParser', ['$locale', 'orderByFilter', function($locale, orderByFilter) {

	  this.parsers = {};

	  var formatCodeToRegex = {
	    'yyyy': {
	      regex: '\\d{4}',
	      apply: function(value) { this.year = +value; }
	    },
	    'yy': {
	      regex: '\\d{2}',
	      apply: function(value) { this.year = +value + 2000; }
	    },
	    'y': {
	      regex: '\\d{1,4}',
	      apply: function(value) { this.year = +value; }
	    },
	    'MMMM': {
	      regex: $locale.DATETIME_FORMATS.MONTH.join('|'),
	      apply: function(value) { this.month = $locale.DATETIME_FORMATS.MONTH.indexOf(value); }
	    },
	    'MMM': {
	      regex: $locale.DATETIME_FORMATS.SHORTMONTH.join('|'),
	      apply: function(value) { this.month = $locale.DATETIME_FORMATS.SHORTMONTH.indexOf(value); }
	    },
	    'MM': {
	      regex: '0[1-9]|1[0-2]',
	      apply: function(value) { this.month = value - 1; }
	    },
	    'M': {
	      regex: '[1-9]|1[0-2]',
	      apply: function(value) { this.month = value - 1; }
	    },
	    'dd': {
	      regex: '[0-2][0-9]{1}|3[0-1]{1}',
	      apply: function(value) { this.date = +value; }
	    },
	    'd': {
	      regex: '[1-2]?[0-9]{1}|3[0-1]{1}',
	      apply: function(value) { this.date = +value; }
	    },
	    'EEEE': {
	      regex: $locale.DATETIME_FORMATS.DAY.join('|')
	    },
	    'EEE': {
	      regex: $locale.DATETIME_FORMATS.SHORTDAY.join('|')
	    }
	  };

	  this.createParser = function(format) {
	    var map = [], regex = format.split('');

	    angular.forEach(formatCodeToRegex, function(data, code) {
	      var index = format.indexOf(code);

	      if (index > -1) {
	        format = format.split('');

	        regex[index] = '(' + data.regex + ')';
	        format[index] = '$'; // Custom symbol to define consumed part of format
	        for (var i = index + 1, n = index + code.length; i < n; i++) {
	          regex[i] = '';
	          format[i] = '$';
	        }
	        format = format.join('');

	        map.push({ index: index, apply: data.apply });
	      }
	    });

	    return {
	      regex: new RegExp('^' + regex.join('') + '$'),
	      map: orderByFilter(map, 'index')
	    };
	  };

	  this.parse = function(input, format) {
	    if ( !angular.isString(input) ) {
	      return input;
	    }

	    format = $locale.DATETIME_FORMATS[format] || format;

	    if ( !this.parsers[format] ) {
	      this.parsers[format] = this.createParser(format);
	    }

	    var parser = this.parsers[format],
	        regex = parser.regex,
	        map = parser.map,
	        results = input.match(regex);

	    if ( results && results.length ) {
	      var fields = { year: 1900, month: 0, date: 1, hours: 0 }, dt;

	      for( var i = 1, n = results.length; i < n; i++ ) {
	        var mapper = map[i-1];
	        if ( mapper.apply ) {
	          mapper.apply.call(fields, results[i]);
	        }
	      }

	      if ( isValid(fields.year, fields.month, fields.date) ) {
	        dt = new Date( fields.year, fields.month, fields.date, fields.hours);
	      }

	      return dt;
	    }
	  };

	  // Check if date is valid for specific month (and year for February).
	  // Month: 0 = Jan, 1 = Feb, etc
	  function isValid(year, month, date) {
	    if ( month === 1 && date > 28) {
	        return date === 29 && ((year % 4 === 0 && year % 100 !== 0) || year % 400 === 0);
	    }

	    if ( month === 3 || month === 5 || month === 8 || month === 10) {
	        return date < 31;
	    }

	    return true;
	  }
	}]);

	angular.module('ui.bootstrap.datepicker', ['ui.bootstrap.dateparser', 'ui.bootstrap.position'])

	.constant('datepickerConfig', {
	  formatDay: 'dd',
	  formatMonth: 'MMMM',
	  formatYear: 'yyyy',
	  formatDayHeader: 'EEE',
	  formatDayTitle: 'MMMM yyyy',
	  formatMonthTitle: 'yyyy',
	  datepickerMode: 'day',
	  minMode: 'day',
	  maxMode: 'year',
	  showWeeks: false,
	  startingDay: 0,
	  yearRange: 20,
	  minDate: null,
	  maxDate: null
	})

	.controller('DatepickerController', ['$scope', '$attrs', '$parse', '$interpolate', '$timeout', '$log', 'dateFilter', 'datepickerConfig', function($scope, $attrs, $parse, $interpolate, $timeout, $log, dateFilter, datepickerConfig) {
	  var self = this,
	      ngModelCtrl = { $setViewValue: angular.noop }; // nullModelCtrl;

	  // Modes chain
	  this.modes = ['day', 'month', 'year'];

	  // Configuration attributes
	  angular.forEach(['formatDay', 'formatMonth', 'formatYear', 'formatDayHeader', 'formatDayTitle', 'formatMonthTitle',
	                   'minMode', 'maxMode', 'showWeeks', 'startingDay', 'yearRange'], function( key, index ) {
	    self[key] = angular.isDefined($attrs[key]) ? (index < 8 ? $interpolate($attrs[key])($scope.$parent) : $scope.$parent.$eval($attrs[key])) : datepickerConfig[key];
	  });

	  // Watchable attributes
	  angular.forEach(['minDate', 'maxDate'], function( key ) {
	    if ( $attrs[key] ) {
	      $scope.$parent.$watch($parse($attrs[key]), function(value) {
	        self[key] = value ? new Date(value) : null;
	        self.refreshView();
	      });
	    } else {
	      self[key] = datepickerConfig[key] ? new Date(datepickerConfig[key]) : null;
	    }
	  });

	  $scope.datepickerMode = $scope.datepickerMode || datepickerConfig.datepickerMode;

	  $scope.uniqueId = 'datepicker-' + $scope.$id + '-' + Math.floor(Math.random() * 10000);
	  this.activeDate = angular.isDefined($attrs.initDate) ? $scope.$parent.$eval($attrs.initDate) : new Date();

	  $scope.isActive = function(dateObject) {
	    if (self.compare(dateObject.date, self.activeDate) === 0) {
	      $scope.activeDateId = dateObject.uid;
	      return true;
	    }
	    return false;
	  };

	  this.init = function( ngModelCtrl_ ) {
	    ngModelCtrl = ngModelCtrl_;

	    ngModelCtrl.$render = function() {
	      self.render();
	    };
	  };

	  this.render = function() {
	    if ( ngModelCtrl.$modelValue ) {
	      var date = new Date( ngModelCtrl.$modelValue ),
	          isValid = !isNaN(date);

	      if ( isValid ) {
	        this.activeDate = date;
	      } else {
	        $log.error('Datepicker directive: "ng-model" value must be a Date object, a number of milliseconds since 01.01.1970 or a string representing an RFC2822 or ISO 8601 date.');
	      }
	      ngModelCtrl.$setValidity('date', isValid);
	    }
	    this.refreshView();
	  };

	  this.refreshView = function() {
	    if ( this.element ) {
	      this._refreshView();

	      var date = ngModelCtrl.$modelValue ? new Date(ngModelCtrl.$modelValue) : null;
	      ngModelCtrl.$setValidity('date-disabled', !date || (this.element && !this.isDisabled(date)));
	    }
	  };

	  this.createDateObject = function(date, format) {
	    var model = ngModelCtrl.$modelValue ? new Date(ngModelCtrl.$modelValue) : null;
	    return {
	      date: date,
	      label: dateFilter(date, format),
	      selected: model && this.compare(date, model) === 0,
	      disabled: this.isDisabled(date),
	      current: this.compare(date, new Date()) === 0
	    };
	  };

	  this.isDisabled = function( date ) {
	    return ((this.minDate && this.compare(date, this.minDate) < 0) || (this.maxDate && this.compare(date, this.maxDate) > 0) || ($attrs.dateDisabled && $scope.dateDisabled({date: date, mode: $scope.datepickerMode})));
	  };

	  // Split array into smaller arrays
	  this.split = function(arr, size) {
	    var arrays = [];
	    while (arr.length > 0) {
	      arrays.push(arr.splice(0, size));
	    }
	    return arrays;
	  };

	  $scope.select = function( date ) {
	    if ( $scope.datepickerMode === self.minMode ) {
	      var dt = ngModelCtrl.$modelValue ? new Date( ngModelCtrl.$modelValue ) : new Date(0, 0, 0, 0, 0, 0, 0);
	      dt.setFullYear( date.getFullYear(), date.getMonth(), date.getDate() );
	      ngModelCtrl.$setViewValue( dt );
	      ngModelCtrl.$render();
	    } else {
	      self.activeDate = date;
	      $scope.datepickerMode = self.modes[ self.modes.indexOf( $scope.datepickerMode ) - 1 ];
	    }
	  };

	  $scope.move = function( direction ) {
	    var year = self.activeDate.getFullYear() + direction * (self.step.years || 0),
	        month = self.activeDate.getMonth() + direction * (self.step.months || 0);
	    self.activeDate.setFullYear(year, month, 1);
	    self.refreshView();
	  };

	  $scope.toggleMode = function( direction ) {
	    direction = direction || 1;

	    if (($scope.datepickerMode === self.maxMode && direction === 1) || ($scope.datepickerMode === self.minMode && direction === -1)) {
	      return;
	    }

	    $scope.datepickerMode = self.modes[ self.modes.indexOf( $scope.datepickerMode ) + direction ];
	  };

	  // Key event mapper
	  $scope.keys = { 13:'enter', 32:'space', 33:'pageup', 34:'pagedown', 35:'end', 36:'home', 37:'left', 38:'up', 39:'right', 40:'down' };

	  var focusElement = function() {
	    $timeout(function() {
	      self.element[0].focus();
	    }, 0 , false);
	  };

	  // Listen for focus requests from popup directive
	  $scope.$on('datepicker.focus', focusElement);

	  $scope.keydown = function( evt ) {
	    var key = $scope.keys[evt.which];

	    if ( !key || evt.shiftKey || evt.altKey ) {
	      return;
	    }

	    evt.preventDefault();
	    evt.stopPropagation();

	    if (key === 'enter' || key === 'space') {
	      if ( self.isDisabled(self.activeDate)) {
	        return; // do nothing
	      }
	      $scope.select(self.activeDate);
	      focusElement();
	    } else if (evt.ctrlKey && (key === 'up' || key === 'down')) {
	      $scope.toggleMode(key === 'up' ? 1 : -1);
	      focusElement();
	    } else {
	      self.handleKeyDown(key, evt);
	      self.refreshView();
	    }
	  };
	}])

	.directive( 'datepicker', function () {
	  return {
	    restrict: 'EA',
	    replace: true,
	    templateUrl: 'template/datepicker/datepicker.html',
	    scope: {
	      datepickerMode: '=?',
	      dateDisabled: '&'
	    },
	    require: ['datepicker', '?^ngModel'],
	    controller: 'DatepickerController',
	    link: function(scope, element, attrs, ctrls) {

	      var datepickerCtrl = ctrls[0], ngModelCtrl = ctrls[1];

	      if(attrs.datepickerMode) {
	          scope.datepickerMode = attrs.datepickerMode;
	      }

	      if ( ngModelCtrl ) {
	        datepickerCtrl.init( ngModelCtrl );
	      }
	    }
	  };
	})

	.directive('daypicker', ['dateFilter', function (dateFilter) {
	  return {
	    restrict: 'EA',
	    replace: true,
	    templateUrl: 'template/datepicker/day.html',
	    require: '^datepicker',
	    link: function(scope, element, attrs, ctrl) {
	      scope.showWeeks = ctrl.showWeeks;

	      ctrl.step = { months: 1 };
	      ctrl.element = element;

	      function getDaysInMonth( year, month ) {
	        return 32 - new Date(year, month, 32).getDate();
	      }

	      function getDates(startDate, n) {
	        var dates = new Array(n), current = new Date(startDate), i = 0;
	        current.setHours(12); // Prevent repeated dates because of timezone bug
	        while ( i < n ) {
	          dates[i++] = new Date(current);
	          current.setDate( current.getDate() + 1 );
	        }
	        return dates;
	      }

	      ctrl._refreshView = function() {
	        var year = ctrl.activeDate.getFullYear(),
	            month = ctrl.activeDate.getMonth(),
	            firstDayOfMonth = new Date(year, month, 1),
	            difference = ctrl.startingDay - firstDayOfMonth.getDay(),
	            numDisplayedFromPreviousMonth = (difference > 0) ? 7 - difference : - difference,
	            firstDate = new Date(firstDayOfMonth), numDates = 0;

	        if ( numDisplayedFromPreviousMonth > 0 ) {
	          firstDate.setDate( - numDisplayedFromPreviousMonth + 1 );
	          numDates += numDisplayedFromPreviousMonth; // Previous
	        }
	        numDates += getDaysInMonth(year, month); // Current
	        numDates += (7 - numDates % 7) % 7; // Next

	        var days = getDates(firstDate, numDates);
	        for (var i = 0; i < numDates; i ++) {
	          days[i] = angular.extend(ctrl.createDateObject(days[i], ctrl.formatDay), {
	            secondary: days[i].getMonth() !== month,
	            uid: scope.uniqueId + '-' + i
	          });
	        }

	        scope.labels = new Array(7);
	        for (var j = 0; j < 7; j++) {
	          scope.labels[j] = {
	            abbr: dateFilter(days[j].date, ctrl.formatDayHeader),
	            full: dateFilter(days[j].date, 'EEEE')
	          };
	        }

	        scope.title = dateFilter(ctrl.activeDate, ctrl.formatDayTitle);
	        scope.rows = ctrl.split(days, 7);

	        if ( scope.showWeeks ) {
	          scope.weekNumbers = [];
	          var weekNumber = getISO8601WeekNumber( scope.rows[0][0].date ),
	              numWeeks = scope.rows.length;
	          while( scope.weekNumbers.push(weekNumber++) < numWeeks ) {}
	        }
	      };

	      ctrl.compare = function(date1, date2) {
	        return (new Date( date1.getFullYear(), date1.getMonth(), date1.getDate() ) - new Date( date2.getFullYear(), date2.getMonth(), date2.getDate() ) );
	      };

	      function getISO8601WeekNumber(date) {
	        var checkDate = new Date(date);
	        checkDate.setDate(checkDate.getDate() + 4 - (checkDate.getDay() || 7)); // Thursday
	        var time = checkDate.getTime();
	        checkDate.setMonth(0); // Compare with Jan 1
	        checkDate.setDate(1);
	        return Math.floor(Math.round((time - checkDate) / 86400000) / 7) + 1;
	      }

	      ctrl.handleKeyDown = function( key, evt ) {
	        var date = ctrl.activeDate.getDate();

	        if (key === 'left') {
	          date = date - 1;   // up
	        } else if (key === 'up') {
	          date = date - 7;   // down
	        } else if (key === 'right') {
	          date = date + 1;   // down
	        } else if (key === 'down') {
	          date = date + 7;
	        } else if (key === 'pageup' || key === 'pagedown') {
	          var month = ctrl.activeDate.getMonth() + (key === 'pageup' ? - 1 : 1);
	          ctrl.activeDate.setMonth(month, 1);
	          date = Math.min(getDaysInMonth(ctrl.activeDate.getFullYear(), ctrl.activeDate.getMonth()), date);
	        } else if (key === 'home') {
	          date = 1;
	        } else if (key === 'end') {
	          date = getDaysInMonth(ctrl.activeDate.getFullYear(), ctrl.activeDate.getMonth());
	        }
	        ctrl.activeDate.setDate(date);
	      };

	      ctrl.refreshView();
	    }
	  };
	}])

	.directive('monthpicker', ['dateFilter', function (dateFilter) {
	  return {
	    restrict: 'EA',
	    replace: true,
	    templateUrl: 'template/datepicker/month.html',
	    require: '^datepicker',
	    link: function(scope, element, attrs, ctrl) {
	      ctrl.step = { years: 1 };
	      ctrl.element = element;

	      ctrl._refreshView = function() {
	        var months = new Array(12),
	            year = ctrl.activeDate.getFullYear();

	        for ( var i = 0; i < 12; i++ ) {
	          months[i] = angular.extend(ctrl.createDateObject(new Date(year, i, 1), ctrl.formatMonth), {
	            uid: scope.uniqueId + '-' + i
	          });
	        }

	        scope.title = dateFilter(ctrl.activeDate, ctrl.formatMonthTitle);
	        scope.rows = ctrl.split(months, 3);
	      };

	      ctrl.compare = function(date1, date2) {
	        return new Date( date1.getFullYear(), date1.getMonth() ) - new Date( date2.getFullYear(), date2.getMonth() );
	      };

	      ctrl.handleKeyDown = function( key, evt ) {
	        var date = ctrl.activeDate.getMonth();

	        if (key === 'left') {
	          date = date - 1;   // up
	        } else if (key === 'up') {
	          date = date - 3;   // down
	        } else if (key === 'right') {
	          date = date + 1;   // down
	        } else if (key === 'down') {
	          date = date + 3;
	        } else if (key === 'pageup' || key === 'pagedown') {
	          var year = ctrl.activeDate.getFullYear() + (key === 'pageup' ? - 1 : 1);
	          ctrl.activeDate.setFullYear(year);
	        } else if (key === 'home') {
	          date = 0;
	        } else if (key === 'end') {
	          date = 11;
	        }
	        ctrl.activeDate.setMonth(date);
	      };

	      ctrl.refreshView();
	    }
	  };
	}])

	.directive('yearpicker', ['dateFilter', function (dateFilter) {
	  return {
	    restrict: 'EA',
	    replace: true,
	    templateUrl: 'template/datepicker/year.html',
	    require: '^datepicker',
	    link: function(scope, element, attrs, ctrl) {
	      var range = ctrl.yearRange;

	      ctrl.step = { years: range };
	      ctrl.element = element;

	      function getStartingYear( year ) {
	        return parseInt((year - 1) / range, 10) * range + 1;
	      }

	      ctrl._refreshView = function() {
	        var years = new Array(range);

	        for ( var i = 0, start = getStartingYear(ctrl.activeDate.getFullYear()); i < range; i++ ) {
	          years[i] = angular.extend(ctrl.createDateObject(new Date(start + i, 0, 1), ctrl.formatYear), {
	            uid: scope.uniqueId + '-' + i
	          });
	        }

	        scope.title = [years[0].label, years[range - 1].label].join(' - ');
	        scope.rows = ctrl.split(years, 5);
	      };

	      ctrl.compare = function(date1, date2) {
	        return date1.getFullYear() - date2.getFullYear();
	      };

	      ctrl.handleKeyDown = function( key, evt ) {
	        var date = ctrl.activeDate.getFullYear();

	        if (key === 'left') {
	          date = date - 1;   // up
	        } else if (key === 'up') {
	          date = date - 5;   // down
	        } else if (key === 'right') {
	          date = date + 1;   // down
	        } else if (key === 'down') {
	          date = date + 5;
	        } else if (key === 'pageup' || key === 'pagedown') {
	          date += (key === 'pageup' ? - 1 : 1) * ctrl.step.years;
	        } else if (key === 'home') {
	          date = getStartingYear( ctrl.activeDate.getFullYear() );
	        } else if (key === 'end') {
	          date = getStartingYear( ctrl.activeDate.getFullYear() ) + range - 1;
	        }
	        ctrl.activeDate.setFullYear(date);
	      };

	      ctrl.refreshView();
	    }
	  };
	}])

	.constant('datepickerPopupConfig', {
	  datepickerPopup: 'yyyy-MM-dd',
	  currentText: 'Today',
	  clearText: 'Clear',
	  closeText: 'Done',
	  closeOnDateSelection: true,
	  appendToBody: false,
	  showButtonBar: true
	})

	.directive('datepickerPopup', ['$compile', '$parse', '$document', '$position', 'dateFilter', 'datepickerPopupConfig', 'dateParser',
	function ($compile, $parse, $document, $position, dateFilter, datepickerPopupConfig, dateParser) {
	  return {
	    restrict: 'EA',
	    require: 'ngModel',
	    scope: {
	      isOpen: '=?',
	      currentText: '@',
	      clearText: '@',
	      closeText: '@',
	      dateDisabled: '&'
	    },
	    link: function(scope, element, attrs, ngModel) {
	      var dateFormat,
	          closeOnDateSelection = angular.isDefined(attrs.closeOnDateSelection) ? scope.$parent.$eval(attrs.closeOnDateSelection) : datepickerPopupConfig.closeOnDateSelection,
	          appendToBody = angular.isDefined(attrs.datepickerAppendToBody) ? scope.$parent.$eval(attrs.datepickerAppendToBody) : datepickerPopupConfig.appendToBody;

	      scope.showButtonBar = angular.isDefined(attrs.showButtonBar) ? scope.$parent.$eval(attrs.showButtonBar) : datepickerPopupConfig.showButtonBar;
	      scope.datepickerMode = angular.isDefined(attrs.datepickerMode) ? attrs.datepickerMode : 'day';
	      scope.showWeeks = angular.isDefined(attrs.showWeeks) ? attrs.showWeeks : false;

	      scope.getText = function( key ) {
	        return scope[key + 'Text'] || datepickerPopupConfig[key + 'Text'];
	      };

	      attrs.$observe('datepickerPopup', function(value) {
	          dateFormat = value || datepickerPopupConfig.datepickerPopup;
	          ngModel.$render();
	      });

	      // popup element used to display calendar
	      var popupEl = angular.element('<div datepicker-popup-wrap><div datepicker></div></div>');
	      popupEl.attr({
	        'ng-model': 'date',
	        'ng-change': 'dateSelection()'
	      });

	      function cameltoDash( string ){
	        return string.replace(/([A-Z])/g, function($1) { return '-' + $1.toLowerCase(); });
	      }

	      // datepicker element
	      var datepickerEl = angular.element(popupEl.children()[0]);

	      if ( attrs.datepickerOptions ) {
	        angular.forEach(scope.$parent.$eval(attrs.datepickerOptions), function( value, option ) {
	          datepickerEl.attr( cameltoDash(option), value );
	        });
	      }

	      angular.forEach(['minDate', 'maxDate'], function( key ) {
	        if ( attrs[key] ) {
	          scope.$parent.$watch($parse(attrs[key]), function(value){
	            scope[key] = value;
	          });
	          datepickerEl.attr(cameltoDash(key), key);
	        }
	      });
	      if (attrs.dateDisabled) {
	        datepickerEl.attr('date-disabled', 'dateDisabled({ date: date, mode: mode })');
	      }



	      function parseDate(viewValue) {
	        if (!viewValue) {
	          ngModel.$setValidity('date', true);
	          return null;
	        } else if (angular.isDate(viewValue) && !isNaN(viewValue)) {
	          ngModel.$setValidity('date', true);
	          return viewValue;
	        } else if (angular.isString(viewValue)) {
	          var date = dateParser.parse(viewValue, dateFormat);
	          if (isNaN(date)) {
	            ngModel.$setValidity('date', false);
	            return undefined;
	          } else {
	            ngModel.$setValidity('date', true);
	            return date;
	          }
	        } else {
	          ngModel.$setValidity('date', false);
	          return undefined;
	        }
	      }
	      ngModel.$parsers.unshift(parseDate);

	      // Inner change
	      scope.dateSelection = function(dt) {
	        if (angular.isDefined(dt)) {
	          scope.date = dt;
	        }
	        ngModel.$setViewValue(scope.date);
	        ngModel.$render();

	        if ( closeOnDateSelection ) {
	          scope.isOpen = false;
	          element[0].focus();
	        }
	      };

	      element.bind('input change keyup', function() {
	        scope.$apply(function() {
	          scope.date = ngModel.$modelValue;
	        });
	      });

	      // Outter change
	      ngModel.$render = function() {
	        var date = ngModel.$viewValue ? dateFilter(ngModel.$viewValue, dateFormat) : '';
	        element.val(date);
	        scope.date = parseDate( ngModel.$modelValue );
	      };

	      var documentClickBind = function(event) {
	        if (scope.isOpen && event.target !== element[0]) {
	          scope.$apply(function() {
	            scope.isOpen = false;
	          });
	        }
	      };


	      var addButtonAndInputListeners = function() {
	        $document.find("input").bind('click', documentClickBind);
	        $document.find("button").bind('click', documentClickBind);

	        $popup.find("input").unbind('click', documentClickBind);
	        $popup.find("button").unbind('click', documentClickBind);
	      };

	      var removeButtonAndInputListeners = function() {
	        $document.find("input").unbind('click', documentClickBind);
	        $document.find("button").unbind('click', documentClickBind);
	      };



	      var keydown = function(evt, noApply) {
	        scope.keydown(evt);
	      };
	      element.bind('keydown', keydown);

	      scope.keydown = function(evt) {
	        if (evt.which === 27) {
	          evt.preventDefault();
	          evt.stopPropagation();
	          scope.close();
	        } else if (evt.which === 40 && !scope.isOpen) {
	          scope.isOpen = true;
	        }
	      };

	      scope.$watch('isOpen', function(value) {
	        if (value) {
	          scope.$broadcast('datepicker.focus');
	          scope.position = appendToBody ? $position.offset(element) : $position.position(element);
	          scope.position.top = scope.position.top + element.prop('offsetHeight');

	          $document.bind('click', documentClickBind);
	          addButtonAndInputListeners();
	        } else {
	          $document.unbind('click', documentClickBind);
	          removeButtonAndInputListeners();
	        }
	      });

	      scope.select = function( date ) {
	        if (date === 'today') {
	          var today = new Date();
	          if (angular.isDate(ngModel.$modelValue)) {
	            date = new Date(ngModel.$modelValue);
	            date.setFullYear(today.getFullYear(), today.getMonth(), today.getDate());
	          } else {
	            date = new Date(today.setHours(0, 0, 0, 0));
	          }
	        }
	        scope.dateSelection( date );
	      };

	      scope.close = function() {
	        scope.isOpen = false;
	        element[0].focus();
	      };

	      var $popup = $compile(popupEl)(scope);


	      if ( appendToBody ) {
	        $document.find('body').append($popup);
	      } else {
	        element.after($popup);
	      }

	      scope.$on('$destroy', function() {
	        $popup.remove();
	        element.unbind('keydown', keydown);
	        $document.unbind('click', documentClickBind);
	        removeButtonAndInputListeners();
	      });
	    }
	  };
	}])

	.directive('datepickerPopupWrap', function() {
	  return {
	    restrict:'EA',
	    replace: true,
	    transclude: true,
	    templateUrl: 'template/datepicker/popup.html',
	    link:function (scope, element, attrs) {
	      element.bind('click', function(event) {
	        event.preventDefault();
	        event.stopPropagation();
	      });

	      element.bind('keydown', function(event) {
	        if(event.which === 9) {
	          scope.$apply(function() {
	            scope.isOpen = false;
	          });
	        }
	      });
	    }
	  };
	});

	angular.module('ui.bootstrap.dropdown', [])

	.constant('dropdownConfig', {
	  openClass: 'open'
	})

	.service('dropdownService', ['$document', function($document) {
	  var self = this, openScope = null;

	  this.open = function( dropdownScope ) {
	    if ( !openScope ) {
	      $document.bind('click', closeDropdown);
	      $document.bind('keydown', escapeKeyBind);
	    }

	    if ( openScope && openScope !== dropdownScope ) {
	        openScope.isOpen = false;
	    }

	    openScope = dropdownScope;
	  };

	  this.close = function( dropdownScope ) {
	    if ( openScope === dropdownScope ) {
	      openScope = null;
	      $document.unbind('click', closeDropdown);
	      $document.unbind('keydown', escapeKeyBind);
	    }
	  };

	  var closeDropdown = function() {
	    openScope.$apply(function() {
	      openScope.isOpen = false;
	    });
	  };

	  var escapeKeyBind = function( evt ) {
	    if ( evt.which === 27 ) {
	      closeDropdown();
	    }
	  };
	}])

	.controller('DropdownController', ['$scope', '$attrs', '$parse', 'dropdownConfig', 'dropdownService', '$animate', function($scope, $attrs, $parse, dropdownConfig, dropdownService, $animate) {
	  var self = this,
	      scope = $scope.$new(), // create a child scope so we are not polluting original one
	      openClass = dropdownConfig.openClass,
	      getIsOpen,
	      setIsOpen = angular.noop,
	      toggleInvoker = $attrs.onToggle ? $parse($attrs.onToggle) : angular.noop;

	  this.init = function( element ) {
	    self.$element = element;

	    if ( $attrs.isOpen ) {
	      getIsOpen = $parse($attrs.isOpen);
	      setIsOpen = getIsOpen.assign;

	      $scope.$watch(getIsOpen, function(value) {
	        scope.isOpen = !!value;
	      });
	    }
	  };

	  this.toggle = function( open ) {
	    return scope.isOpen = arguments.length ? !!open : !scope.isOpen;
	  };

	  // Allow other directives to watch status
	  this.isOpen = function() {
	    return scope.isOpen;
	  };

	  scope.focusToggleElement = function() {
	    if ( self.triggerElement ) {
	      self.triggerElement[0].focus();
	    }
	  };

	  scope.$watch('isOpen', function( isOpen, wasOpen ) {
	    $animate[isOpen ? 'addClass' : 'removeClass'](self.$element, openClass);

	    if ( isOpen ) {
	      dropdownService.open( scope );
	    } else {
	      dropdownService.close( scope );

	      if ( wasOpen ) {
	        scope.focusToggleElement();
	      }
	    }

	    setIsOpen($scope, isOpen);
	    toggleInvoker($scope, { open: !!isOpen });
	  });

	  $scope.$on('$locationChangeSuccess', function() {
	    scope.isOpen = false;
	  });

	  $scope.$on('$destroy', function() {
	    scope.$destroy();
	  });
	}])

	.directive('dropdown', function() {
	  return {
	    restrict: 'CA',
	    controller: 'DropdownController',
	    link: function(scope, element, attrs, dropdownCtrl) {
	      dropdownCtrl.init( element );
	    }
	  };
	})

	.directive('dropdownToggle', function() {
	  return {
	    restrict: 'CA',
	    require: '?^dropdown',
	    link: function(scope, element, attrs, dropdownCtrl) {
	      if ( !dropdownCtrl ) {
	        return;
	      }

	      dropdownCtrl.triggerElement = element;

	      element.bind('click', function(event) {
	        event.preventDefault();
	        event.stopPropagation();

	        if ( !element.hasClass('disabled') && !element.prop('disabled') ) {
	          scope.$apply(function() {
	            dropdownCtrl.toggle();
	          });
	        }
	      });

	      // WAI-ARIA
	      element.attr({ 'aria-haspopup': true, 'aria-expanded': false });
	      scope.$watch(dropdownCtrl.isOpen, function( isOpen ) {
	        element.attr('aria-expanded', !!isOpen);
	      });
	    }
	  };
	});

	angular.module('ui.bootstrap.dropdownSelect', ['ui.bootstrap.dropdown'])

	.constant('dropdownSelectConfig', {
	  emptyPlaceholderText: 'Nothing selected'
	})

	.factory('optionsParser', ['$parse', function ($parse) {

	  var DROPDOWN_REGEXP   = /^\s*(.*?)(?:\s+as\s+(.*?))?(?:\s+group\s+by\s+(.*))?\s+for\s+(?:([\$\w][\$\w\d]*))\s+in\s+(.*)$/;
	  return {
	    parse:function (input) {
	      var match = input.match(DROPDOWN_REGEXP);
	      if (!match) {
	        throw new Error(
	            'Expected dropdown specification in form of "_viewValue_ (as _label_)? (group by _groupname_)? for _item_ in _collection_"' +
	                ' but got "' + input + '".');
	      }

	      var valueName = match[4] || match[6];
	      return {
	        displayFn: $parse(match[2] || match[1]),
	        valueName: valueName,
	        keyName: match[5],
	        groupByFn: $parse(match[3] || ''),
	        valueFn: $parse(match[2] ? match[1] : valueName),
	        valuesFn: $parse(match[5])
	      };
	    }
	  };
	}])

	.controller('DropdownSelectController', ['$scope', '$attrs', '$parse', 'optionsParser', 'dropdownSelectConfig', 'filterFilter', '$timeout',
	  function($scope, $attrs, $parse, optionsParser, dropdownSelectConfig, filterFilter, $timeout) {
	  var self = this,
	      parserResult = optionsParser.parse($attrs.ngOptions),
	      ngModelCtrl  = { $setViewValue: angular.noop },
	      element,
	      toggleInvoker = $attrs.onToggle ? $parse($attrs.onToggle) : angular.noop;

	  $scope.wasOpen = false;
	  $scope.multiple = angular.isDefined($attrs.multiple) ? $scope.$parent.$eval($attrs.multiple) : false;
	  $scope.filter = {
	    enabled: angular.isDefined($attrs.filter) ? $scope.$parent.$eval($attrs.filter) : false,
	    value: '',
	    key: $scope.filterKey
	  };
	  $scope.options = [];

	  this.init = function(ngModelCtrl_, element_) {
	    ngModelCtrl = ngModelCtrl_;
	    element = element_;

	    ngModelCtrl.$render = function() {
	      self.render();
	    };
	  };

	  this.onOptionsChange = function(sourceValues) {
	    var locals = {};
	    $scope.groups = {};
	    $scope.options.length = 0;

	    angular.forEach(sourceValues, function(value, index) {
	      locals[parserResult.valueName] = value;

	      var groupName = parserResult.groupByFn($scope, locals) || '';
	      if (!(group = $scope.groups[groupName])) {
	        group = $scope.groups[groupName] = { options: [] };
	      }

	      var option = {
	        label: parserResult.displayFn($scope, locals),
	        value: parserResult.valueFn($scope, locals),
	        id: $scope.uniqueId + '-' + index
	      };

	      if ( $scope.filter.key ) {
	        option[$scope.filter.key] = value[$scope.filter.key];
	      }

	      group.options.push(option);
	      $scope.options.push(option);
	    });

	    $scope.filterOptions();
	    this.render();
	  };

	  $scope.filterOptions = function() {
	    if ( !$scope.filter.value ) {
	      $scope.validOptions = $scope.options;
	      angular.forEach($scope.options, function(option) {
	        option.valid = true;
	      });
	    } else {
	      var filter = {}, filterKey = $scope.filter.key || 'label';
	      filter [filterKey] = $scope.filter.value;

	      $scope.validOptions = filterFilter( $scope.options, filter );
	      angular.forEach($scope.options, function(option) {
	        option.valid = $scope.validOptions.indexOf(option) > -1;
	      });
	    }
	  };

	  this.render = function() {
	    if ( $scope.multiple ) {
	      renderMultiple();
	    } else {
	      renderSingle();
	    }
	  };

	  $scope.isActive = function(option) {
	    return option === $scope.activeOption;
	  };

	  function renderSingle() {
	    $scope.selectedOption = null;
	    $scope.activeOption = null;
	    var found = false;
	    angular.forEach($scope.options, function(option) {
	      option.selected = ( !found && angular.equals(ngModelCtrl.$viewValue, option.value) );
	      if ( option.selected ) {
	        $scope.selectedOption = option;
	        $scope.activeOption = option;
	        found = true;
	      }
	    });
	  }

	  function renderMultiple() {
	    $scope.selectedOption = [];

	    var viewValue = angular.isArray(ngModelCtrl.$viewValue) ? ngModelCtrl.$viewValue : [];
	    angular.forEach($scope.options, function(option) {
	      option.selected = viewValue.indexOf(option.value) > -1;

	      if ( option.selected ) {
	        $scope.selectedOption.push(option);
	      }
	    });
	  }

	  this.selectSingle = function(option) {
	    ngModelCtrl.$setViewValue(option.value);
	    ngModelCtrl.$render();
	  };

	  this.selectMultiple = function(option) {
	    var values = ngModelCtrl.$viewValue || [];

	    option.selected = !option.selected;
	    if (option.selected) {
	      values.push(option.value);
	    } else {
	      values.splice(values.indexOf(option.value), 1);
	    }
	    ngModelCtrl.$setViewValue(values);
	    ngModelCtrl.$render();
	  };

	  $scope.select = function(option, e) {
	    if ($scope.multiple) {
	      self.selectMultiple(option);
	    } else {
	      self.selectSingle(option);
	      $scope.isopen = false;
	    }
	  };

	  $scope.isEmpty = function() {
	    return !$scope.selectedOption || ($scope.multiple && $scope.selectedOption.length === 0);
	  };

	  $scope.prevent = function(evt) {
	    evt.preventDefault();
	    evt.stopPropagation();
	  };

	  $scope.$parent.$watchCollection(parserResult.valuesFn, function(sourceValues) {
	      self.onOptionsChange(sourceValues);
	  });

	  $scope.onKeydown = function( evt ) {
	    if (!$scope.isopen) {
	      return;
	    }

	    if (/^(38|40|13|32|9)$/.test(evt.which)) {
	      evt.preventDefault();
	      evt.stopPropagation();

	      var options = $scope.validOptions,
	          index = options.indexOf($scope.activeOption);

	      var listItems = element.find("li");

	      for(var i = 0; i < listItems.length; i++) {
	        var el = angular.element(listItems[i]);

	        if(el.attr("role") !== "option") {
	            listItems.splice(i, 1);
	            i--;
	        }
	      }

	      if ((evt.which === 13 || evt.which === 32 || evt.which === 9) && index > -1) {
	        $scope.select(options[index]);
	        return;
	      }

	      if (evt.which === 38 && index > 0) {
	        index--;   // up
	      } else if (evt.which === 40 && index < options.length - 1) {
	        index++;   // down
	      }

	      listItems[index].focus();

	      $scope.activeOption = options[index];
	    }
	  };

	  // Respond on ng-disabled changes
	  if ($attrs.ngDisabled || $attrs.disabled) {
	    $attrs.$observe('disabled', function(value) {
	      if (angular.isDefined(value)) {
	        $scope.isDisabled = value;
	      }
	    });
	  }
	}])

	.directive('dropdownSelect', function () {
	  var instance = 0;
	  return {
	    require: ['dropdownSelect', '?^ngModel'],
	    restrict:'EA',
	    replace:true,
	    scope: {
	      type: '@',
	      size: '@',
	      emptyPlaceholderText: '@',
	      filterPlaceholderText: '@',
	      optionTemplateUrl: '@',
	      filterKey: '@',
	      label: '@'
	    },
	    templateUrl:'template/dropdownSelect/select.html',
	    controller: 'DropdownSelectController',
	    link: function(scope, element, attrs, ctrls) {
	      var dropdownSelectCtrl = ctrls[0], ngModelCtrl = ctrls[1];

	      scope.uniqueId = 'select-' + (instance++) + '-' + Math.floor(Math.random() * 10000);

	      if (ngModelCtrl) {
	        dropdownSelectCtrl.init( ngModelCtrl, element );
	      }
	    }
	  };
	})

	.directive('selectOption', ['$http', '$templateCache', '$compile', '$parse', function ($http, $templateCache, $compile, $parse) {
	  return {
	    require: '^dropdownSelect',
	    restrict:'A',
	    scope:{
	      option:'=selectOption'
	    },
	    compile: function(elem, attrs) {
	      var templateUrlExpr = $parse(attrs.templateUrl);
	      return function (scope, element, attrs) {
	        var templateUrl = templateUrlExpr(scope.$parent) || 'template/dropdownSelect/option.html';

	        $http.get(templateUrl, {cache: $templateCache}).success(function(tplContent){
	            tplContent = tplContent.replace(/(^\s+|\s+$)/g, '');
	            element.append($compile(tplContent)(scope));
	        });
	      };
	    }
	  };
	}])

	.directive('placeholderEmpty', ['dropdownSelectConfig', function (dropdownSelectConfig) {
	  return {
	    restrict:'EA',
	    scope:{
	      emptyPlaceholderText: '@'
	    },
	    replace: true,
	    templateUrl: 'template/dropdownSelect/placeholder-empty.html',
	    link: function (scope, element, attrs) {
	      scope.getEmptyText = function() {
	        return scope.emptyPlaceholderText || dropdownSelectConfig.emptyPlaceholderText;
	      };
	    }
	  };
	}]);

	angular.module('ui.bootstrap.modal', ['ui.bootstrap.transition'])

	/**
	 * A helper, internal data structure that acts as a map but also allows getting / removing
	 * elements in the LIFO order
	 */
	  .factory('$$stackedMap', function () {
	    return {
	      createNew: function () {
	        var stack = [];

	        return {
	          add: function (key, value) {
	            stack.push({
	              key: key,
	              value: value
	            });
	          },
	          get: function (key) {
	            for (var i = 0; i < stack.length; i++) {
	              if (key == stack[i].key) {
	                return stack[i];
	              }
	            }
	          },
	          keys: function() {
	            var keys = [];
	            for (var i = 0; i < stack.length; i++) {
	              keys.push(stack[i].key);
	            }
	            return keys;
	          },
	          top: function () {
	            return stack[stack.length - 1];
	          },
	          remove: function (key) {
	            var idx = -1;
	            for (var i = 0; i < stack.length; i++) {
	              if (key == stack[i].key) {
	                idx = i;
	                break;
	              }
	            }
	            return stack.splice(idx, 1)[0];
	          },
	          removeTop: function () {
	            return stack.splice(stack.length - 1, 1)[0];
	          },
	          length: function () {
	            return stack.length;
	          }
	        };
	      }
	    };
	  })

	/**
	 * A helper directive for the $modal service. It creates a backdrop element.
	 */
	  .directive('modalBackdrop', ['$timeout', function ($timeout) {
	    return {
	      restrict: 'EA',
	      replace: true,
	      templateUrl: 'template/modal/backdrop.html',
	      link: function (scope) {

	        scope.animate = false;

	        //trigger CSS transitions
	        $timeout(function () {
	          scope.animate = true;
	        });
	      }
	    };
	  }])

	  .directive('modalWindow', ['$modalStack', '$timeout', function ($modalStack, $timeout) {
	    return {
	      restrict: 'EA',
	      scope: {
	        index: '@',
	        animate: '='
	      },
	      replace: true,
	      transclude: true,
	      templateUrl: 'template/modal/window.html',
	      link: function (scope, element, attrs) {
	        scope.windowClass = attrs.windowClass || '';

	        $timeout(function () {
	          // trigger CSS transitions
	          scope.animate = true;
	          // focus a freshly-opened modal
	          element[0].focus();
	        });

	        scope.close = function (evt) {
	          var modal = $modalStack.getTop();
	          if (modal && modal.value.backdrop && modal.value.backdrop != 'static' && (evt.target === evt.currentTarget)) {
	            evt.preventDefault();
	            evt.stopPropagation();
	            $modalStack.dismiss(modal.key, 'backdrop click');
	          }
	        };
	      }
	    };
	  }])

	  .factory('$modalStack', ['$transition', '$timeout', '$document', '$compile', '$rootScope', '$$stackedMap',
	    function ($transition, $timeout, $document, $compile, $rootScope, $$stackedMap) {

	      var OPENED_MODAL_CLASS = 'modal-open';

	      var backdropDomEl, backdropScope;
	      var openedWindows = $$stackedMap.createNew();
	      var $modalStack = {};

	      function backdropIndex() {
	        var topBackdropIndex = -1;
	        var opened = openedWindows.keys();
	        for (var i = 0; i < opened.length; i++) {
	          if (openedWindows.get(opened[i]).value.backdrop) {
	            topBackdropIndex = i;
	          }
	        }
	        return topBackdropIndex;
	      }

	      $rootScope.$watch(backdropIndex, function(newBackdropIndex){
	        if (backdropScope) {
	          backdropScope.index = newBackdropIndex;
	        }
	      });

	      function removeModalWindow(modalInstance) {

	        var body = $document.find('body').eq(0);
	        var modalWindow = openedWindows.get(modalInstance).value;

	        //clean up the stack
	        openedWindows.remove(modalInstance);

	        //remove window DOM element
	        removeAfterAnimate(modalWindow.modalDomEl, modalWindow.modalScope, 300, function() {
	          modalWindow.modalScope.$destroy();
	          body.toggleClass(OPENED_MODAL_CLASS, openedWindows.length() > 0);
	          checkRemoveBackdrop();
	        });
	      }

	      function checkRemoveBackdrop() {
	          //remove backdrop if no longer needed
	          if (backdropDomEl && backdropIndex() == -1) {
	            var backdropScopeRef = backdropScope;
	            removeAfterAnimate(backdropDomEl, backdropScope, 150, function () {
	              backdropScopeRef.$destroy();
	              backdropScopeRef = null;
	            });
	            backdropDomEl = undefined;
	            backdropScope = undefined;
	          }
	      }

	      function removeAfterAnimate(domEl, scope, emulateTime, done) {
	        // Closing animation
	        scope.animate = false;

	        var transitionEndEventName = $transition.transitionEndEventName;
	        if (transitionEndEventName) {
	          // transition out
	          var timeout = $timeout(afterAnimating, emulateTime);

	          domEl.bind(transitionEndEventName, function () {
	            $timeout.cancel(timeout);
	            afterAnimating();
	            scope.$apply();
	          });
	        } else {
	          // Ensure this call is async
	          $timeout(afterAnimating, 0);
	        }

	        function afterAnimating() {
	          if (afterAnimating.done) {
	            return;
	          }
	          afterAnimating.done = true;

	          domEl.remove();
	          if (done) {
	            done();
	          }
	        }
	      }

	      $document.bind('keydown', function (evt) {
	        var modal;

	        if (evt.which === 27) {
	          modal = openedWindows.top();
	          if (modal && modal.value.keyboard) {
	            $rootScope.$apply(function () {
	              $modalStack.dismiss(modal.key);
	            });
	          }
	        }
	      });

	      $modalStack.open = function (modalInstance, modal) {

	        openedWindows.add(modalInstance, {
	          deferred: modal.deferred,
	          modalScope: modal.scope,
	          backdrop: modal.backdrop,
	          keyboard: modal.keyboard
	        });

	        var body = $document.find('body').eq(0),
	            currBackdropIndex = backdropIndex();

	        if (currBackdropIndex >= 0 && !backdropDomEl) {
	          backdropScope = $rootScope.$new(true);
	          backdropScope.index = currBackdropIndex;
	          backdropDomEl = $compile('<div modal-backdrop></div>')(backdropScope);
	          body.append(backdropDomEl);
	        }

	        var angularDomEl = angular.element('<div modal-window></div>');
	        angularDomEl.attr('window-class', modal.windowClass);
	        angularDomEl.attr('index', openedWindows.length() - 1);
	        angularDomEl.attr('animate', 'animate');
	        angularDomEl.html(modal.content);

	        var modalDomEl = $compile(angularDomEl)(modal.scope);
	        openedWindows.top().value.modalDomEl = modalDomEl;
	        body.append(modalDomEl);
	        body.addClass(OPENED_MODAL_CLASS);
	      };

	      $modalStack.close = function (modalInstance, result) {
	        var modalWindow = openedWindows.get(modalInstance).value;
	        if (modalWindow) {
	          modalWindow.deferred.resolve(result);
	          removeModalWindow(modalInstance);
	        }
	      };

	      $modalStack.dismiss = function (modalInstance, reason) {
	        var modalWindow = openedWindows.get(modalInstance).value;
	        if (modalWindow) {
	          modalWindow.deferred.reject(reason);
	          removeModalWindow(modalInstance);
	        }
	      };

	      $modalStack.dismissAll = function (reason) {
	        var topModal = this.getTop();
	        while (topModal) {
	          this.dismiss(topModal.key, reason);
	          topModal = this.getTop();
	        }
	      };

	      $modalStack.getTop = function () {
	        return openedWindows.top();
	      };

	      return $modalStack;
	    }])

	  .provider('$modal', function () {

	    var $modalProvider = {
	      options: {
	        backdrop: true, //can be also false or 'static'
	        keyboard: true
	      },
	      $get: ['$injector', '$rootScope', '$q', '$http', '$templateCache', '$controller', '$modalStack',
	        function ($injector, $rootScope, $q, $http, $templateCache, $controller, $modalStack) {

	          var $modal = {};

	          function getTemplatePromise(options) {
	            return options.template ? $q.when(options.template) :
	              $http.get(options.templateUrl, {cache: $templateCache}).then(function (result) {
	                return result.data;
	              });
	          }

	          function getResolvePromises(resolves) {
	            var promisesArr = [];
	            angular.forEach(resolves, function (value, key) {
	              if (angular.isFunction(value) || angular.isArray(value)) {
	                promisesArr.push($q.when($injector.invoke(value)));
	              }
	            });
	            return promisesArr;
	          }

	          $modal.open = function (modalOptions) {

	            var modalResultDeferred = $q.defer();
	            var modalOpenedDeferred = $q.defer();

	            //prepare an instance of a modal to be injected into controllers and returned to a caller
	            var modalInstance = {
	              result: modalResultDeferred.promise,
	              opened: modalOpenedDeferred.promise,
	              close: function (result) {
	                $modalStack.close(modalInstance, result);
	              },
	              dismiss: function (reason) {
	                $modalStack.dismiss(modalInstance, reason);
	              }
	            };

	            //merge and clean up options
	            modalOptions = angular.extend({}, $modalProvider.options, modalOptions);
	            modalOptions.resolve = modalOptions.resolve || {};

	            //verify options
	            if (!modalOptions.template && !modalOptions.templateUrl) {
	              throw new Error('One of template or templateUrl options is required.');
	            }

	            var templateAndResolvePromise =
	              $q.all([getTemplatePromise(modalOptions)].concat(getResolvePromises(modalOptions.resolve)));


	            templateAndResolvePromise.then(function resolveSuccess(tplAndVars) {

	              var modalScope = (modalOptions.scope || $rootScope).$new();
	              modalScope.$close = modalInstance.close;
	              modalScope.$dismiss = modalInstance.dismiss;

	              var ctrlInstance, ctrlLocals = {};
	              var resolveIter = 1;

	              //controllers
	              if (modalOptions.controller) {
	                ctrlLocals.$scope = modalScope;
	                ctrlLocals.$modalInstance = modalInstance;
	                angular.forEach(modalOptions.resolve, function (value, key) {
	                  ctrlLocals[key] = tplAndVars[resolveIter++];
	                });

	                ctrlInstance = $controller(modalOptions.controller, ctrlLocals);
	              }

	              $modalStack.open(modalInstance, {
	                scope: modalScope,
	                deferred: modalResultDeferred,
	                content: tplAndVars[0],
	                backdrop: modalOptions.backdrop,
	                keyboard: modalOptions.keyboard,
	                windowClass: modalOptions.windowClass
	              });

	            }, function resolveError(reason) {
	              modalResultDeferred.reject(reason);
	            });

	            templateAndResolvePromise.then(function () {
	              modalOpenedDeferred.resolve(true);
	            }, function () {
	              modalOpenedDeferred.reject(false);
	            });

	            return modalInstance;
	          };

	          return $modal;
	        }]
	    };

	    return $modalProvider;
	  });

	angular.module('ui.bootstrap.pagination', [])

	.controller('PaginationController', ['$scope', '$attrs', '$parse', function ($scope, $attrs, $parse) {
	  var self = this,
	      ngModelCtrl = { $setViewValue: angular.noop }, // nullModelCtrl
	      setNumPages = $attrs.numPages ? $parse($attrs.numPages).assign : angular.noop;

	  this.init = function(ngModelCtrl_, config) {
	    ngModelCtrl = ngModelCtrl_;
	    this.config = config;

	    ngModelCtrl.$render = function() {
	      self.render();
	    };

	    if ($attrs.itemsPerPage) {
	      $scope.$parent.$watch($parse($attrs.itemsPerPage), function(value) {
	        self.itemsPerPage = parseInt(value, 10);
	        $scope.totalPages = self.calculateTotalPages();
	      });
	    } else {
	      this.itemsPerPage = config.itemsPerPage;
	    }
	  };

	  this.calculateTotalPages = function() {
	    var totalPages = this.itemsPerPage < 1 ? 1 : Math.ceil($scope.totalItems / this.itemsPerPage);
	    return Math.max(totalPages || 0, 1);
	  };

	  this.render = function() {
	    $scope.page = parseInt(ngModelCtrl.$viewValue, 10) || 1;
	  };

	  $scope.selectPage = function(page) {
	    if ( $scope.page !== page && page > 0 && page <= $scope.totalPages) {
	      ngModelCtrl.$setViewValue(page);
	      ngModelCtrl.$render();
	    }
	  };

	  $scope.getText = function( key ) {
	    return $scope[key + 'Text'] || self.config[key + 'Text'];
	  };
	  $scope.noPrevious = function() {
	    return $scope.page === 1;
	  };
	  $scope.noNext = function() {
	    return $scope.page === $scope.totalPages;
	  };

	  $scope.$watch('totalItems', function() {
	    $scope.totalPages = self.calculateTotalPages();
	  });

	  $scope.$watch('totalPages', function(value) {
	    setNumPages($scope.$parent, value); // Readonly variable

	    if ( $scope.page > value ) {
	      $scope.selectPage(value);
	    } else {
	      ngModelCtrl.$render();
	    }
	  });
	}])

	.constant('paginationConfig', {
	  itemsPerPage: 10,
	  boundaryLinks: false,
	  directionLinks: true,
	  firstText: 'First',
	  previousText: 'Previous',
	  nextText: 'Next',
	  lastText: 'Last',
	  rotate: true
	})

	.directive('pagination', ['$parse', 'paginationConfig', function($parse, paginationConfig) {
	  return {
	    restrict: 'EA',
	    scope: {
	      totalItems: '=',
	      firstText: '@',
	      previousText: '@',
	      nextText: '@',
	      lastText: '@'
	    },
	    require: ['pagination', '?ngModel'],
	    controller: 'PaginationController',
	    templateUrl: 'template/pagination/pagination.html',
	    replace: true,
	    link: function(scope, element, attrs, ctrls) {
	      var paginationCtrl = ctrls[0], ngModelCtrl = ctrls[1];

	      if (!ngModelCtrl) {
	         return; // do nothing if no ng-model
	      }

	      // Setup configuration parameters
	      var maxSize = angular.isDefined(attrs.maxSize) ? scope.$parent.$eval(attrs.maxSize) : paginationConfig.maxSize,
	          rotate = angular.isDefined(attrs.rotate) ? scope.$parent.$eval(attrs.rotate) : paginationConfig.rotate;
	      scope.boundaryLinks = angular.isDefined(attrs.boundaryLinks) ? scope.$parent.$eval(attrs.boundaryLinks) : paginationConfig.boundaryLinks;
	      scope.directionLinks = angular.isDefined(attrs.directionLinks) ? scope.$parent.$eval(attrs.directionLinks) : paginationConfig.directionLinks;

	      paginationCtrl.init(ngModelCtrl, paginationConfig);

	      if (attrs.maxSize) {
	        scope.$parent.$watch($parse(attrs.maxSize), function(value) {
	          maxSize = parseInt(value, 10);
	          paginationCtrl.render();
	        });
	      }

	      // Create page object used in template
	      function makePage(number, text, isActive) {
	        return {
	          number: number,
	          text: text,
	          active: isActive
	        };
	      }

	      function getPages(currentPage, totalPages) {
	        var pages = [];

	        // Default page limits
	        var startPage = 1, endPage = totalPages;
	        var isMaxSized = ( angular.isDefined(maxSize) && maxSize < totalPages );

	        // recompute if maxSize
	        if ( isMaxSized ) {
	          if ( rotate ) {
	            // Current page is displayed in the middle of the visible ones
	            startPage = Math.max(currentPage - Math.floor(maxSize/2), 1);
	            endPage   = startPage + maxSize - 1;

	            // Adjust if limit is exceeded
	            if (endPage > totalPages) {
	              endPage   = totalPages;
	              startPage = endPage - maxSize + 1;
	            }
	          } else {
	            // Visible pages are paginated with maxSize
	            startPage = ((Math.ceil(currentPage / maxSize) - 1) * maxSize) + 1;

	            // Adjust last page if limit is exceeded
	            endPage = Math.min(startPage + maxSize - 1, totalPages);
	          }
	        }

	        // Add page number links
	        for (var number = startPage; number <= endPage; number++) {
	          var page = makePage(number, number, number === currentPage);
	          pages.push(page);
	        }

	        // Add links to move between page sets
	        if ( isMaxSized && ! rotate ) {
	          if ( startPage > 1 ) {
	            var previousPageSet = makePage(startPage - 1, '...', false);
	            pages.unshift(previousPageSet);
	          }

	          if ( endPage < totalPages ) {
	            var nextPageSet = makePage(endPage + 1, '...', false);
	            pages.push(nextPageSet);
	          }
	        }

	        return pages;
	      }

	      var originalRender = paginationCtrl.render;
	      paginationCtrl.render = function() {
	        originalRender();
	        if (scope.page > 0 && scope.page <= scope.totalPages) {
	          scope.pages = getPages(scope.page, scope.totalPages);
	        }
	      };
	    }
	  };
	}])

	.constant('pagerConfig', {
	  itemsPerPage: 10,
	  previousText: '« Previous',
	  nextText: 'Next »',
	  align: true
	})

	.directive('pager', ['pagerConfig', function(pagerConfig) {
	  return {
	    restrict: 'EA',
	    scope: {
	      totalItems: '=',
	      previousText: '@',
	      nextText: '@'
	    },
	    require: ['pager', '?ngModel'],
	    controller: 'PaginationController',
	    templateUrl: 'template/pagination/pager.html',
	    replace: true,
	    link: function(scope, element, attrs, ctrls) {
	      var paginationCtrl = ctrls[0], ngModelCtrl = ctrls[1];

	      if (!ngModelCtrl) {
	         return; // do nothing if no ng-model
	      }

	      scope.align = angular.isDefined(attrs.align) ? scope.$parent.$eval(attrs.align) : pagerConfig.align;
	      paginationCtrl.init(ngModelCtrl, pagerConfig);
	    }
	  };
	}]);

	/**
	 * The following features are still outstanding: animation as a
	 * function, placement as a function, inside, support for more triggers than
	 * just mouse enter/leave, html tooltips, and selector delegation.
	 */
	angular.module( 'ui.bootstrap.tooltip', [ 'ui.bootstrap.position', 'ui.bootstrap.bindHtml' ] )

	/**
	 * The $tooltip service creates tooltip- and popover-like directives as well as
	 * houses global options for them.
	 */
	.provider( '$tooltip', function () {
	  // The default options tooltip and popover.
	  var defaultOptions = {
	    placement: 'top',
	    animation: true,
	    popupDelay: 0
	  };

	  // Default hide triggers for each show trigger
	  var triggerMap = {
	    'mouseenter': 'mouseleave',
	    'click': 'click',
	    'focus': 'blur'
	  };

	  // The options specified to the provider globally.
	  var globalOptions = {};

	  /**
	   * `options({})` allows global configuration of all tooltips in the
	   * application.
	   *
	   *   var app = angular.module( 'App', ['ui.bootstrap.tooltip'], function( $tooltipProvider ) {
	   *     // place tooltips left instead of top by default
	   *     $tooltipProvider.options( { placement: 'left' } );
	   *   });
	   */
	  this.options = function( value ) {
	    angular.extend( globalOptions, value );
	  };

	  /**
	   * This allows you to extend the set of trigger mappings available. E.g.:
	   *
	   *   $tooltipProvider.setTriggers( 'openTrigger': 'closeTrigger' );
	   */
	  this.setTriggers = function setTriggers ( triggers ) {
	    angular.extend( triggerMap, triggers );
	  };

	  /**
	   * This is a helper function for translating camel-case to snake-case.
	   */
	  function snake_case(name){
	    var regexp = /[A-Z]/g;
	    var separator = '-';
	    return name.replace(regexp, function(letter, pos) {
	      return (pos ? separator : '') + letter.toLowerCase();
	    });
	  }

	  /**
	   * Returns the actual instance of the $tooltip service.
	   * TODO support multiple triggers
	   */
	  this.$get = [ '$window', '$compile', '$timeout', '$parse', '$document', '$position', '$interpolate', function ( $window, $compile, $timeout, $parse, $document, $position, $interpolate ) {
	    return function $tooltip ( type, prefix, defaultTriggerShow ) {
	      var options = angular.extend( {}, defaultOptions, globalOptions );

	      /**
	       * Returns an object of show and hide triggers.
	       *
	       * If a trigger is supplied,
	       * it is used to show the tooltip; otherwise, it will use the `trigger`
	       * option passed to the `$tooltipProvider.options` method; else it will
	       * default to the trigger supplied to this directive factory.
	       *
	       * The hide trigger is based on the show trigger. If the `trigger` option
	       * was passed to the `$tooltipProvider.options` method, it will use the
	       * mapped trigger from `triggerMap` or the passed trigger if the map is
	       * undefined; otherwise, it uses the `triggerMap` value of the show
	       * trigger; else it will just use the show trigger.
	       */
	      function getTriggers ( trigger ) {
	        var show = trigger || options.trigger || defaultTriggerShow;
	        var hide = triggerMap[show] || show;
	        return {
	          show: show,
	          hide: hide
	        };
	      }

	      var directiveName = snake_case( type );

	      var startSym = $interpolate.startSymbol();
	      var endSym = $interpolate.endSymbol();
	      var template =
	        '<div '+ directiveName +'-popup '+
	          'title="'+startSym+'tt_title'+endSym+'" '+
	          'content="'+startSym+'tt_content'+endSym+'" '+
	          'placement="'+startSym+'tt_placement'+endSym+'" '+
	          'animation="tt_animation" '+
	          'is-open="tt_isOpen"'+
	          '>'+
	        '</div>';

	      return {
	        restrict: 'EA',
	        scope: true,
	        compile: function (tElem, tAttrs) {
	          var tooltipLinker = $compile( template );

	          return function link ( scope, element, attrs ) {
	            var tooltip;
	            var transitionTimeout;
	            var popupTimeout;
	            var appendToBody = angular.isDefined( options.appendToBody ) ? options.appendToBody : false;
	            var triggers = getTriggers( undefined );
	            var hasEnableExp = angular.isDefined(attrs[prefix+'Enable']);

	            var positionTooltip = function () {

	              var ttPosition = $position.positionElements(element, tooltip, scope.tt_placement, appendToBody);
	              ttPosition.top += 'px';
	              ttPosition.left += 'px';

	              // Now set the calculated positioning.
	              tooltip.css( ttPosition );
	            };

	            // By default, the tooltip is not open.
	            // TODO add ability to start tooltip opened
	            scope.tt_isOpen = false;

	            function toggleTooltipBind () {
	              if ( ! scope.tt_isOpen ) {
	                showTooltipBind();
	              } else {
	                hideTooltipBind();
	              }
	            }

	            // Show the tooltip with delay if specified, otherwise show it immediately
	            function showTooltipBind() {
	              if(hasEnableExp && !scope.$eval(attrs[prefix+'Enable'])) {
	                return;
	              }
	              if ( scope.tt_popupDelay ) {
	                popupTimeout = $timeout( show, scope.tt_popupDelay, false );
	                popupTimeout.then(function(reposition){reposition();});
	              } else {
	                show()();
	              }
	            }

	            function hideTooltipBind () {
	              scope.$apply(function () {
	                hide();
	              });
	            }

	            // Show the tooltip popup element.
	            function show() {


	              // Don't show empty tooltips.
	              if ( ! scope.tt_content ) {
	                return angular.noop;
	              }

	              createTooltip();

	              // If there is a pending remove transition, we must cancel it, lest the
	              // tooltip be mysteriously removed.
	              if ( transitionTimeout ) {
	                $timeout.cancel( transitionTimeout );
	              }

	              // Set the initial positioning.
	              tooltip.css({ top: 0, left: 0, display: 'block' });

	              // Now we add it to the DOM because need some info about it. But it's not
	              // visible yet anyway.
	              if ( appendToBody ) {
	                  $document.find( 'body' ).append( tooltip );
	              } else {
	                element.after( tooltip );
	              }

	              positionTooltip();

	              // And show the tooltip.
	              scope.tt_isOpen = true;
	              scope.$digest(); // digest required as $apply is not called

	              // Return positioning function as promise callback for correct
	              // positioning after draw.
	              return positionTooltip;
	            }

	            // Hide the tooltip popup element.
	            function hide() {
	              // First things first: we don't show it anymore.
	              scope.tt_isOpen = false;

	              //if tooltip is going to be shown after delay, we must cancel this
	              $timeout.cancel( popupTimeout );

	              // And now we remove it from the DOM. However, if we have animation, we
	              // need to wait for it to expire beforehand.
	              // FIXME: this is a placeholder for a port of the transitions library.
	              if ( scope.tt_animation ) {
	                transitionTimeout = $timeout(removeTooltip, 500);
	              } else {
	                removeTooltip();
	              }
	            }

	            function createTooltip() {
	              // There can only be one tooltip element per directive shown at once.
	              if (tooltip) {
	                removeTooltip();
	              }
	              tooltip = tooltipLinker(scope, function () {});

	              // Get contents rendered into the tooltip
	              scope.$digest();
	            }

	            function removeTooltip() {
	              if (tooltip) {
	                tooltip.remove();
	                tooltip = null;
	              }
	            }

	            /**
	             * Observe the relevant attributes.
	             */
	            attrs.$observe( type, function ( val ) {
	              scope.tt_content = val;

	              if (!val && scope.tt_isOpen ) {
	                hide();
	              }
	            });

	            attrs.$observe( prefix+'Title', function ( val ) {
	              scope.tt_title = val;
	            });

	            attrs.$observe( prefix+'Placement', function ( val ) {
	              scope.tt_placement = angular.isDefined( val ) ? val : options.placement;
	            });

	            attrs.$observe( prefix+'PopupDelay', function ( val ) {
	              var delay = parseInt( val, 10 );
	              scope.tt_popupDelay = ! isNaN(delay) ? delay : options.popupDelay;
	            });

	            var unregisterTriggers = function () {
	              element.unbind(triggers.show, showTooltipBind);
	              element.unbind(triggers.hide, hideTooltipBind);
	            };

	            attrs.$observe( prefix+'Trigger', function ( val ) {
	              unregisterTriggers();

	              triggers = getTriggers( val );

	              if ( triggers.show === triggers.hide ) {
	                element.bind( triggers.show, toggleTooltipBind );
	              } else {
	                element.bind( triggers.show, showTooltipBind );
	                element.bind( triggers.hide, hideTooltipBind );
	              }
	            });

	            var animation = scope.$eval(attrs[prefix + 'Animation']);
	            scope.tt_animation = angular.isDefined(animation) ? !!animation : options.animation;

	            attrs.$observe( prefix+'AppendToBody', function ( val ) {
	              appendToBody = angular.isDefined( val ) ? $parse( val )( scope ) : appendToBody;
	            });

	            // if a tooltip is attached to <body> we need to remove it on
	            // location change as its parent scope will probably not be destroyed
	            // by the change.
	            if ( appendToBody ) {
	              scope.$on('$locationChangeSuccess', function closeTooltipOnLocationChangeSuccess () {
	              if ( scope.tt_isOpen ) {
	                hide();
	              }
	            });
	            }

	            // Make sure tooltip is destroyed and removed.
	            scope.$on('$destroy', function onDestroyTooltip() {
	              $timeout.cancel( transitionTimeout );
	              $timeout.cancel( popupTimeout );
	              unregisterTriggers();
	              removeTooltip();
	            });
	          };
	        }
	      };
	    };
	  }];
	})

	.directive( 'tooltipPopup', function () {
	  return {
	    restrict: 'EA',
	    replace: true,
	    scope: { content: '@', placement: '@', animation: '&', isOpen: '&' },
	    templateUrl: 'template/tooltip/tooltip-popup.html'
	  };
	})

	.directive( 'tooltip', [ '$tooltip', function ( $tooltip ) {
	  return $tooltip( 'tooltip', 'tooltip', 'mouseenter' );
	}])

	.directive( 'tooltipHtmlUnsafePopup', function () {
	  return {
	    restrict: 'EA',
	    replace: true,
	    scope: { content: '@', placement: '@', animation: '&', isOpen: '&' },
	    templateUrl: 'template/tooltip/tooltip-html-unsafe-popup.html'
	  };
	})

	.directive( 'tooltipHtmlUnsafe', [ '$tooltip', function ( $tooltip ) {
	  return $tooltip( 'tooltipHtmlUnsafe', 'tooltip', 'mouseenter' );
	}]);

	/**
	 * The following features are still outstanding: popup delay, animation as a
	 * function, placement as a function, inside, support for more triggers than
	 * just mouse enter/leave, html popovers, and selector delegatation.
	 */
	angular.module( 'ui.bootstrap.popover', [ 'ui.bootstrap.tooltip' ] )

	.directive( 'popoverPopup', function () {
	  return {
	    restrict: 'EA',
	    replace: true,
	    scope: { title: '@', content: '@', placement: '@', animation: '&', isOpen: '&' },
	    templateUrl: 'template/popover/popover.html'
	  };
	})

	.directive( 'popover', [ '$tooltip', function ( $tooltip ) {
	  return $tooltip( 'popover', 'popover', 'click' );
	}]);

	angular.module('ui.bootstrap.progressbar', [])

	.constant('progressConfig', {
	  animate: true,
	  max: 100
	})

	.controller('ProgressController', ['$scope', '$attrs', 'progressConfig', function($scope, $attrs, progressConfig) {
	    var self = this,
	        animate = angular.isDefined($attrs.animate) ? $scope.$parent.$eval($attrs.animate) : progressConfig.animate;

	    this.bars = [];
	    $scope.max = angular.isDefined($attrs.max) ? $scope.$parent.$eval($attrs.max) : progressConfig.max;

	    this.addBar = function(bar, element) {
	        if ( !animate ) {
	            element.css({'transition': 'none'});
	        }

	        this.bars.push(bar);

	        bar.$watch('value', function( value ) {
	            bar.percent = +(100 * value / $scope.max).toFixed(2);
	        });

	        bar.$on('$destroy', function() {
	            element = null;
	            self.removeBar(bar);
	        });
	    };

	    this.removeBar = function(bar) {
	        this.bars.splice(this.bars.indexOf(bar), 1);
	    };
	}])

	.directive('progress', function() {
	    return {
	        restrict: 'EA',
	        replace: true,
	        transclude: true,
	        controller: 'ProgressController',
	        require: 'progress',
	        scope: {},
	        templateUrl: 'template/progressbar/progress.html'
	    };
	})

	.directive('bar', function() {
	    return {
	        restrict: 'EA',
	        replace: true,
	        transclude: true,
	        require: '^progress',
	        scope: {
	            value: '=',
	            type: '@'
	        },
	        templateUrl: 'template/progressbar/bar.html',
	        link: function(scope, element, attrs, progressCtrl) {
	            progressCtrl.addBar(scope, element);
	        }
	    };
	})

	.directive('progressbar', function() {
	    return {
	        restrict: 'EA',
	        replace: true,
	        transclude: true,
	        controller: 'ProgressController',
	        scope: {
	            value: '=',
	            type: '@'
	        },
	        templateUrl: 'template/progressbar/progressbar.html',
	        link: function(scope, element, attrs, progressCtrl) {
	            progressCtrl.addBar(scope, angular.element(element.children()[0]));
	        }
	    };
	});
	angular.module('ui.bootstrap.rating', [])

	.constant('ratingConfig', {
	  max: 5,
	  stateOn: null,
	  stateOff: null
	})

	.controller('RatingController', ['$scope', '$attrs', 'ratingConfig', function($scope, $attrs, ratingConfig) {
	  var ngModelCtrl  = { $setViewValue: angular.noop };

	  this.init = function(ngModelCtrl_) {
	    ngModelCtrl = ngModelCtrl_;
	    ngModelCtrl.$render = this.render;

	    this.stateOn = angular.isDefined($attrs.stateOn) ? $scope.$parent.$eval($attrs.stateOn) : ratingConfig.stateOn;
	    this.stateOff = angular.isDefined($attrs.stateOff) ? $scope.$parent.$eval($attrs.stateOff) : ratingConfig.stateOff;

	    var ratingStates = angular.isDefined($attrs.ratingStates) ? $scope.$parent.$eval($attrs.ratingStates) :
	                        new Array( angular.isDefined($attrs.max) ? $scope.$parent.$eval($attrs.max) : ratingConfig.max );
	    $scope.range = this.buildTemplateObjects(ratingStates);
	  };

	  this.buildTemplateObjects = function(states) {
	    for (var i = 0, n = states.length; i < n; i++) {
	      states[i] = angular.extend({ index: i }, { stateOn: this.stateOn, stateOff: this.stateOff }, states[i]);
	    }
	    return states;
	  };

	  $scope.rate = function(value) {
	    if ( !$scope.readonly && value >= 0 && value <= $scope.range.length ) {
	      ngModelCtrl.$setViewValue(value);
	      ngModelCtrl.$render();
	    }
	  };

	  $scope.enter = function(value) {
	    if ( !$scope.readonly ) {
	      $scope.value = value;
	    }
	    $scope.onHover({value: value});
	  };

	  $scope.reset = function() {
	    $scope.value = ngModelCtrl.$viewValue;
	    $scope.onLeave();
	  };

	  $scope.onKeydown = function(evt) {
	    if (/(37|38|39|40)/.test(evt.which)) {
	      evt.preventDefault();
	      evt.stopPropagation();
	      $scope.rate( $scope.value + (evt.which === 38 || evt.which === 39 ? 1 : -1) );
	    }
	  };

	  this.render = function() {
	    $scope.value = ngModelCtrl.$viewValue;
	  };
	}])

	.directive('rating', function() {
	  return {
	    restrict: 'EA',
	    require: ['rating', 'ngModel'],
	    scope: {
	      readonly: '=?',
	      onHover: '&',
	      onLeave: '&'
	    },
	    controller: 'RatingController',
	    templateUrl: 'template/rating/rating.html',
	    replace: true,
	    link: function(scope, element, attrs, ctrls) {
	      var ratingCtrl = ctrls[0], ngModelCtrl = ctrls[1];

	      if ( ngModelCtrl ) {
	        ratingCtrl.init( ngModelCtrl );
	      }
	    }
	  };
	});

	/**
	 * @ngdoc overview
	 * @name ui.bootstrap.tabs
	 *
	 * @description
	 * AngularJS version of the tabs directive.
	 */

	angular.module('ui.bootstrap.tabs', [])

	.controller('TabsetController', ['$scope', function TabsetCtrl($scope) {
	  var ctrl = this,
	      tabs = ctrl.tabs = $scope.tabs = [],
	      activeIndex;

	  ctrl.select = function(tab) {
	    angular.forEach(tabs, function(tab) {
	      tab.active = false;
	    });
	    tab.active = true;
	    activeIndex = tabs.indexOf(tab);
	  };

	  ctrl.addTab = function addTab(tab) {
	    tabs.push(tab);
	    if (tabs.length === 1 || tab.active) {
	      ctrl.select(tab);
	    }
	  };

	  ctrl.removeTab = function removeTab(tab) {
	    var index = tabs.indexOf(tab);
	    //Select a new tab if the tab to be removed is selected
	    if (tab.active && tabs.length > 1) {
	      //If this is the last tab, select the previous tab. else, the next tab.
	      var newActiveIndex = index == tabs.length - 1 ? index - 1 : index + 1;
	      ctrl.select(tabs[newActiveIndex]);
	    }
	    tabs.splice(index, 1);
	  };

	  $scope.onKeydown = function(evt) {
	    if (!/(37|38|39|40)/.test(evt.which) || evt.shiftKey || evt.altKey) return;
	    evt.preventDefault();
	    evt.stopPropagation();

	    // up & left = previous, down & right = next
	    var step = evt.which > 38 ? 1 : -1;

	    // Search the rest of the tabs for the closest not disabled
	    for (var i = 1, n = tabs.length; i < n; i++) {
	      var tabindex = (activeIndex + i * step + n) % n,
	          tab = tabs[tabindex];

	      if ( !tab.disabled ) {
	        // Activate & focus it's trigger element
	        tab.active = true;
	        tab.$element.find('a')[0].focus();
	        break;
	      }
	    }
	  }
	}])

	.directive('tabset', function() {
	  return {
	    restrict: 'EA',
	    transclude: true,
	    replace: true,
	    scope: {},
	    controller: 'TabsetController',
	    templateUrl: 'template/tabs/tabset.html',
	    link: function(scope, element, attrs) {
	      scope.vertical = angular.isDefined(attrs.vertical) ? scope.$parent.$eval(attrs.vertical) : false;
	      scope.justified = angular.isDefined(attrs.justified) ? scope.$parent.$eval(attrs.justified) : false;
	      scope.type = angular.isDefined(attrs.type) ? scope.$parent.$eval(attrs.type) : 'tabs';
	    }
	  };
	})

	.directive('tab', ['$parse', function($parse) {
	  var instance = 0;
	  return {
	    require: '^tabset',
	    restrict: 'EA',
	    replace: true,
	    templateUrl: 'template/tabs/tab.html',
	    transclude: true,
	    scope: {
	      heading: '@',
	      onSelect: '&select', //This callback is called in contentHeadingTransclude
	                          //once it inserts the tab's content into the dom
	      onDeselect: '&deselect'
	    },
	    controller: function() {
	      //Empty controller so other directives can require being 'under' a tab
	    },
	    compile: function(elm, attrs, transclude) {
	      return function postLink(scope, elm, attrs, tabsetCtrl) {
	        scope.$element = elm;

	        scope.uniqueId = 'select-' + (instance++) + '-' + Math.floor(Math.random() * 10000);

	        var getActive, setActive;
	        if (attrs.active) {
	          getActive = $parse(attrs.active);
	          setActive = getActive.assign;
	          scope.$parent.$watch(getActive, function updateActive(value, oldVal) {
	            // Avoid re-initializing scope.active as it is already initialized
	            // below. (watcher is called async during init with value ===
	            // oldVal)
	            if (value !== oldVal) {
	              scope.active = !!value;
	            }
	          });
	          scope.active = getActive(scope.$parent);
	        } else {
	          setActive = getActive = angular.noop;
	        }

	        scope.$watch('active', function(active) {
	          // Note this watcher also initializes and assigns scope.active to the
	          // attrs.active expression.
	          setActive(scope.$parent, active);
	          if (active) {
	            tabsetCtrl.select(scope);
	            scope.onSelect();
	          } else {
	            scope.onDeselect();
	          }
	        });

	        scope.disabled = false;
	        if ( attrs.disabled ) {
	          scope.$parent.$watch($parse(attrs.disabled), function(value) {
	            scope.disabled = !! value;
	          });
	        }

	        scope.select = function() {
	          if ( ! scope.disabled ) {
	            scope.active = true;
	          }
	        };

	        tabsetCtrl.addTab(scope);
	        scope.$on('$destroy', function() {
	          tabsetCtrl.removeTab(scope);
	          scope.$element = null;
	        });


	        //We need to transclude later, once the content container is ready.
	        //when this link happens, we're inside a tab heading.
	        scope.$transcludeFn = transclude;
	      };
	    }
	  };
	}])

	.directive('tabHeadingTransclude', [function() {
	  return {
	    restrict: 'A',
	    require: '^tab',
	    link: function(scope, elm, attrs, tabCtrl) {
	      scope.$watch('headingElement', function updateHeadingElement(heading) {
	        if (heading) {
	          elm.html('');
	          elm.append(heading);
	        }
	      });
	    }
	  };
	}])

	.directive('tabContentTransclude', function() {
	  return {
	    restrict: 'A',
	    require: '^tabset',
	    link: function(scope, elm, attrs) {
	      var tab = scope.$eval(attrs.tabContentTransclude);

	      //Now our tab is ready to be transcluded: both the tab heading area
	      //and the tab content area are loaded.  Transclude 'em both.
	      tab.$transcludeFn(tab.$parent, function(contents) {
	        angular.forEach(contents, function(node) {
	          if (isTabHeading(node)) {
	            //Let tabHeadingTransclude know.
	            tab.headingElement = node;
	          } else {
	            elm.append(node);
	          }
	        });
	      });
	    }
	  };
	  function isTabHeading(node) {
	    return node.tagName &&  (
	      node.hasAttribute('tab-heading') ||
	      node.hasAttribute('data-tab-heading') ||
	      node.tagName.toLowerCase() === 'tab-heading' ||
	      node.tagName.toLowerCase() === 'data-tab-heading'
	    );
	  }
	})

	;

	angular.module('ui.bootstrap.timepicker', [])

	.constant('timepickerConfig', {
	  hourStep: 1,
	  minuteStep: 1,
	  showMeridian: true,
	  meridians: null,
	  readonlyInput: false,
	  mousewheel: true
	})

	.controller('TimepickerController', ['$scope', '$attrs', '$parse', '$log', '$locale', 'timepickerConfig', function($scope, $attrs, $parse, $log, $locale, timepickerConfig) {
	  var selected = new Date(),
	      ngModelCtrl = { $setViewValue: angular.noop }, // nullModelCtrl
	      meridians = angular.isDefined($attrs.meridians) ? $scope.$parent.$eval($attrs.meridians) : timepickerConfig.meridians || $locale.DATETIME_FORMATS.AMPMS;

	  this.init = function( ngModelCtrl_, inputs ) {
	    ngModelCtrl = ngModelCtrl_;
	    ngModelCtrl.$render = this.render;

	    var hoursInputEl = inputs.eq(0),
	        minutesInputEl = inputs.eq(1);

	    var mousewheel = angular.isDefined($attrs.mousewheel) ? $scope.$parent.$eval($attrs.mousewheel) : timepickerConfig.mousewheel;
	    if ( mousewheel ) {
	      this.setupMousewheelEvents( hoursInputEl, minutesInputEl );
	    }

	    $scope.readonlyInput = angular.isDefined($attrs.readonlyInput) ? scope.$parent.$eval($attrs.readonlyInput) : timepickerConfig.readonlyInput;
	    this.setupInputEvents( hoursInputEl, minutesInputEl );
	  };

	  var hourStep = timepickerConfig.hourStep;
	  if ($attrs.hourStep) {
	    $scope.$parent.$watch($parse($attrs.hourStep), function(value) {
	      hourStep = parseInt(value, 10);
	    });
	  }

	  var minuteStep = timepickerConfig.minuteStep;
	  if ($attrs.minuteStep) {
	    $scope.$parent.$watch($parse($attrs.minuteStep), function(value) {
	      minuteStep = parseInt(value, 10);
	    });
	  }

	  // 12H / 24H mode
	  $scope.showMeridian = timepickerConfig.showMeridian;
	  if ($attrs.showMeridian) {
	    $scope.$parent.$watch($parse($attrs.showMeridian), function(value) {
	      $scope.showMeridian = !!value;

	      if ( ngModelCtrl.$error.time ) {
	        // Evaluate from template
	        var hours = getHoursFromTemplate(), minutes = getMinutesFromTemplate();
	        if (angular.isDefined( hours ) && angular.isDefined( minutes )) {
	          selected.setHours( hours );
	          refresh();
	        }
	      } else {
	        updateTemplate();
	      }
	    });
	  }

	  // Get $scope.hours in 24H mode if valid
	  function getHoursFromTemplate ( ) {
	    var hours = parseInt( $scope.hours, 10 );
	    var valid = ( $scope.showMeridian ) ? (hours > 0 && hours < 13) : (hours >= 0 && hours < 24);
	    if ( !valid ) {
	      return undefined;
	    }

	    if ( $scope.showMeridian ) {
	      if ( hours === 12 ) {
	        hours = 0;
	      }
	      if ( $scope.meridian === meridians[1] ) {
	        hours = hours + 12;
	      }
	    }
	    return hours;
	  }

	  function getMinutesFromTemplate() {
	    var minutes = parseInt($scope.minutes, 10);
	    return ( minutes >= 0 && minutes < 60 ) ? minutes : undefined;
	  }

	  function pad( value ) {
	    return ( angular.isDefined(value) && value.toString().length < 2 ) ? '0' + value : value;
	  }

	  // Respond on mousewheel spin
	  this.setupMousewheelEvents = function( hoursInputEl, minutesInputEl ) {
	    var isScrollingUp = function(e) {
	      if (e.originalEvent) {
	        e = e.originalEvent;
	      }
	      //pick correct delta variable depending on event
	      var delta = (e.wheelDelta) ? e.wheelDelta : -e.deltaY;
	      return (e.detail || delta > 0);
	    };

	    hoursInputEl.bind('mousewheel wheel', function(e) {
	      $scope.$apply( (isScrollingUp(e)) ? $scope.incrementHours() : $scope.decrementHours() );
	      e.preventDefault();
	    });

	    minutesInputEl.bind('mousewheel wheel', function(e) {
	      $scope.$apply( (isScrollingUp(e)) ? $scope.incrementMinutes() : $scope.decrementMinutes() );
	      e.preventDefault();
	    });

	  };

	  this.setupInputEvents = function( hoursInputEl, minutesInputEl ) {
	    if ( $scope.readonlyInput ) {
	      $scope.updateHours = angular.noop;
	      $scope.updateMinutes = angular.noop;
	      return;
	    }

	    var invalidate = function(invalidHours, invalidMinutes) {
	      ngModelCtrl.$setViewValue( null );
	      ngModelCtrl.$setValidity('time', false);
	      if (angular.isDefined(invalidHours)) {
	        $scope.invalidHours = invalidHours;
	      }
	      if (angular.isDefined(invalidMinutes)) {
	        $scope.invalidMinutes = invalidMinutes;
	      }
	    };

	    $scope.updateHours = function() {
	      var hours = getHoursFromTemplate();

	      if ( angular.isDefined(hours) ) {
	        selected.setHours( hours );
	        refresh( 'h' );
	      } else {
	        invalidate(true);
	      }
	    };

	    hoursInputEl.bind('blur', function(e) {
	      if ( !$scope.validHours && $scope.hours < 10) {
	        $scope.$apply( function() {
	          $scope.hours = pad( $scope.hours );
	        });
	      }
	    });

	    $scope.updateMinutes = function() {
	      var minutes = getMinutesFromTemplate();

	      if ( angular.isDefined(minutes) ) {
	        selected.setMinutes( minutes );
	        refresh( 'm' );
	      } else {
	        invalidate(undefined, true);
	      }
	    };

	    minutesInputEl.bind('blur', function(e) {
	      if ( !$scope.invalidMinutes && $scope.minutes < 10 ) {
	        $scope.$apply( function() {
	          $scope.minutes = pad( $scope.minutes );
	        });
	      }
	    });

	  };

	  this.render = function() {
	    var date = ngModelCtrl.$modelValue ? new Date( ngModelCtrl.$modelValue ) : null;

	    if ( isNaN(date) ) {
	      ngModelCtrl.$setValidity('time', false);
	      $log.error('Timepicker directive: "ng-model" value must be a Date object, a number of milliseconds since 01.01.1970 or a string representing an RFC2822 or ISO 8601 date.');
	    } else {
	      if ( date ) {
	        selected = date;
	      }
	      makeValid();
	      updateTemplate();
	    }
	  };

	  // Call internally when we know that model is valid.
	  function refresh( keyboardChange ) {
	    makeValid();
	    ngModelCtrl.$setViewValue( new Date(selected) );
	    updateTemplate( keyboardChange );
	  }

	  function makeValid() {
	    ngModelCtrl.$setValidity('time', true);
	    $scope.invalidHours = false;
	    $scope.invalidMinutes = false;
	  }

	  function updateTemplate( keyboardChange ) {
	    var hours = selected.getHours(), minutes = selected.getMinutes();

	    if ( $scope.showMeridian ) {
	      hours = ( hours === 0 || hours === 12 ) ? 12 : hours % 12; // Convert 24 to 12 hour system
	    }

	    $scope.hours = keyboardChange === 'h' ? hours : pad(hours);
	    $scope.minutes = keyboardChange === 'm' ? minutes : pad(minutes);
	    $scope.meridian = selected.getHours() < 12 ? meridians[0] : meridians[1];
	  }

	  function addMinutes( minutes ) {
	    var dt = new Date( selected.getTime() + minutes * 60000 );
	    selected.setHours( dt.getHours(), dt.getMinutes() );
	    refresh();
	  }

	  $scope.incrementHours = function() {
	    addMinutes( hourStep * 60 );
	  };
	  $scope.decrementHours = function() {
	    addMinutes( - hourStep * 60 );
	  };
	  $scope.incrementMinutes = function() {
	    addMinutes( minuteStep );
	  };
	  $scope.decrementMinutes = function() {
	    addMinutes( - minuteStep );
	  };
	  $scope.toggleMeridian = function() {
	    addMinutes( 12 * 60 * (( selected.getHours() < 12 ) ? 1 : -1) );
	  };
	}])

	.directive('timepicker', function () {
	  return {
	    restrict: 'EA',
	    require: ['timepicker', '?^ngModel'],
	    controller:'TimepickerController',
	    replace: true,
	    scope: {},
	    templateUrl: 'template/timepicker/timepicker.html',
	    link: function(sscope, element, attrs, ctrls) {
	      var timepickerCtrl = ctrls[0], ngModelCtrl = ctrls[1];

	      if ( ngModelCtrl ) {
	        timepickerCtrl.init( ngModelCtrl, element.find('input') );
	      }
	    }
	  };
	});

	angular.module('ui.bootstrap.typeahead', ['ui.bootstrap.position', 'ui.bootstrap.bindHtml'])

	/**
	 * A helper service that can parse typeahead's syntax (string provided by users)
	 * Extracted to a separate service for ease of unit testing
	 */
	  .factory('typeaheadParser', ['$parse', function ($parse) {

	  //                      00000111000000000000022200000000000000003333333333333330000000000044000
	  var TYPEAHEAD_REGEXP = /^\s*(.*?)(?:\s+as\s+(.*?))?\s+for\s+(?:([\$\w][\$\w\d]*))\s+in\s+(.*)$/;

	  return {
	    parse:function (input) {

	      var match = input.match(TYPEAHEAD_REGEXP);
	      if (!match) {
	        throw new Error(
	          'Expected typeahead specification in form of "_modelValue_ (as _label_)? for _item_ in _collection_"' +
	            ' but got "' + input + '".');
	      }

	      return {
	        itemName:match[3],
	        source:$parse(match[4]),
	        viewMapper:$parse(match[2] || match[1]),
	        modelMapper:$parse(match[1])
	      };
	    }
	  };
	}])

	  .directive('typeahead', ['$compile', '$parse', '$q', '$timeout', '$document', '$position', 'typeaheadParser',
	    function ($compile, $parse, $q, $timeout, $document, $position, typeaheadParser) {

	  var HOT_KEYS = [9, 13, 27, 38, 40];

	  return {
	    require:'ngModel',
	    link:function (originalScope, element, attrs, modelCtrl) {

	      //SUPPORTED ATTRIBUTES (OPTIONS)

	      //minimal no of characters that needs to be entered before typeahead kicks-in
	      var minSearch = originalScope.$eval(attrs.typeaheadMinLength) || 1;

	      //minimal wait time after last character typed before typehead kicks-in
	      var waitTime = originalScope.$eval(attrs.typeaheadWaitMs) || 0;

	      //should it restrict model values to the ones selected from the popup only?
	      var isEditable = originalScope.$eval(attrs.typeaheadEditable) !== false;

	      //binding to a variable that indicates if matches are being retrieved asynchronously
	      var isLoadingSetter = $parse(attrs.typeaheadLoading).assign || angular.noop;

	      //a callback executed when a match is selected
	      var onSelectCallback = $parse(attrs.typeaheadOnSelect);

	      var inputFormatter = attrs.typeaheadInputFormatter ? $parse(attrs.typeaheadInputFormatter) : undefined;

	      var appendToBody =  attrs.typeaheadAppendToBody ? originalScope.$eval(attrs.typeaheadAppendToBody) : false;

	      //INTERNAL VARIABLES

	      //model setter executed upon match selection
	      var $setModelValue = $parse(attrs.ngModel).assign;

	      //expressions used by typeahead
	      var parserResult = typeaheadParser.parse(attrs.typeahead);

	      var hasFocus;

	      // WAI-ARIA
	      element.attr({
	        'aria-autocomplete': 'list',
	        'aria-expanded': false
	      });

	      //pop-up element used to display matches
	      var popUpEl = angular.element('<div typeahead-popup></div>');
	      popUpEl.attr({
	        matches: 'matches',
	        active: 'activeIdx',
	        select: 'select(activeIdx)',
	        query: 'query',
	        position: 'position'
	      });
	      //custom item template
	      if (angular.isDefined(attrs.typeaheadTemplateUrl)) {
	        popUpEl.attr('template-url', attrs.typeaheadTemplateUrl);
	      }

	      //create a child scope for the typeahead directive so we are not polluting original scope
	      //with typeahead-specific data (matches, query etc.)
	      var scope = originalScope.$new();
	      originalScope.$on('$destroy', function(){
	        scope.$destroy();
	      });

	      var resetMatches = function() {
	        scope.matches = [];
	        scope.activeIdx = -1;
	        element.attr('aria-expanded', false);
	      };

	      var getMatchesAsync = function(inputValue) {

	        var locals = {$viewValue: inputValue};
	        isLoadingSetter(originalScope, true);
	        $q.when(parserResult.source(originalScope, locals)).then(function(matches) {

	          //it might happen that several async queries were in progress if a user were typing fast
	          //but we are interested only in responses that correspond to the current view value
	          if (inputValue === modelCtrl.$viewValue && hasFocus) {
	            if (matches.length > 0) {

	              scope.activeIdx = 0;
	              scope.matches.length = 0;

	              //transform labels
	              for(var i=0; i<matches.length; i++) {
	                locals[parserResult.itemName] = matches[i];
	                scope.matches.push({
	                  label: parserResult.viewMapper(scope, locals),
	                  model: matches[i]
	                });
	              }

	              scope.query = inputValue;
	              //position pop-up with matches - we need to re-calculate its position each time we are opening a window
	              //with matches as a pop-up might be absolute-positioned and position of an input might have changed on a page
	              //due to other elements being rendered
	              scope.position = appendToBody ? $position.offset(element) : $position.position(element);
	              scope.position.top = scope.position.top + element.prop('offsetHeight');

	              element.attr('aria-expanded', true);
	            } else {
	              resetMatches();
	            }
	            isLoadingSetter(originalScope, false);
	          }
	        }, function(){
	          resetMatches();
	          isLoadingSetter(originalScope, false);
	        });
	      };

	      resetMatches();

	      //we need to propagate user's query so we can higlight matches
	      scope.query = undefined;

	      //Declare the timeout promise var outside the function scope so that stacked calls can be cancelled later
	      var timeoutPromise;

	      //plug into $parsers pipeline to open a typeahead on view changes initiated from DOM
	      //$parsers kick-in on all the changes coming from the view as well as manually triggered by $setViewValue
	      modelCtrl.$parsers.unshift(function (inputValue) {

	        hasFocus = true;

	        if (inputValue && inputValue.length >= minSearch) {
	          if (waitTime > 0) {
	            if (timeoutPromise) {
	              $timeout.cancel(timeoutPromise);//cancel previous timeout
	            }
	            timeoutPromise = $timeout(function () {
	              getMatchesAsync(inputValue);
	            }, waitTime);
	          } else {
	            getMatchesAsync(inputValue);
	          }
	        } else {
	          isLoadingSetter(originalScope, false);
	          resetMatches();
	        }

	        if (isEditable) {
	          return inputValue;
	        } else {
	          if (!inputValue) {
	            // Reset in case user had typed something previously.
	            modelCtrl.$setValidity('editable', true);
	            return inputValue;
	          } else {
	            modelCtrl.$setValidity('editable', false);
	            return undefined;
	          }
	        }
	      });

	      modelCtrl.$formatters.push(function (modelValue) {

	        var candidateViewValue, emptyViewValue;
	        var locals = {};

	        if (inputFormatter) {

	          locals['$model'] = modelValue;
	          return inputFormatter(originalScope, locals);

	        } else {

	          //it might happen that we don't have enough info to properly render input value
	          //we need to check for this situation and simply return model value if we can't apply custom formatting
	          locals[parserResult.itemName] = modelValue;
	          candidateViewValue = parserResult.viewMapper(originalScope, locals);
	          locals[parserResult.itemName] = undefined;
	          emptyViewValue = parserResult.viewMapper(originalScope, locals);

	          return candidateViewValue!== emptyViewValue ? candidateViewValue : modelValue;
	        }
	      });

	      scope.select = function (activeIdx) {
	        //called from within the $digest() cycle
	        var locals = {};
	        var model, item;

	        locals[parserResult.itemName] = item = scope.matches[activeIdx].model;
	        model = parserResult.modelMapper(originalScope, locals);
	        $setModelValue(originalScope, model);
	        modelCtrl.$setValidity('editable', true);

	        onSelectCallback(originalScope, {
	          $item: item,
	          $model: model,
	          $label: parserResult.viewMapper(originalScope, locals)
	        });

	        resetMatches();

	        //return focus to the input element if a mach was selected via a mouse click event
	        element[0].focus();
	      };

	      //bind keyboard events: arrows up(38) / down(40), enter(13) and tab(9), esc(27)
	      element.bind('keydown', function (evt) {

	        //typeahead is open and an "interesting" key was pressed
	        if (scope.matches.length === 0 || HOT_KEYS.indexOf(evt.which) === -1) {
	          return;
	        }

	        evt.preventDefault();

	        if (evt.which === 40) {
	          scope.activeIdx = (scope.activeIdx + 1) % scope.matches.length;
	          scope.$digest();

	        } else if (evt.which === 38) {
	          scope.activeIdx = (scope.activeIdx ? scope.activeIdx : scope.matches.length) - 1;
	          scope.$digest();

	        } else if (evt.which === 13 || evt.which === 9) {
	          scope.$apply(function () {
	            scope.select(scope.activeIdx);
	          });

	        } else if (evt.which === 27) {
	          evt.stopPropagation();

	          resetMatches();
	          scope.$digest();
	        }
	      });

	      element.bind('blur', function (evt) {
	        hasFocus = false;
	      });

	      // Keep reference to click handler to unbind it.
	      var dismissClickHandler = function (evt) {
	        if (element[0] !== evt.target) {
	          resetMatches();
	          scope.$digest();
	        }
	      };

	      $document.bind('click', dismissClickHandler);

	      originalScope.$on('$destroy', function(){
	        $document.unbind('click', dismissClickHandler);
	      });

	      var $popup = $compile(popUpEl)(scope);
	      if ( appendToBody ) {
	        $document.find('body').append($popup);
	      } else {
	        element.after($popup);
	      }
	    }
	  };

	}])

	  .directive('typeaheadPopup', function () {
	    return {
	      restrict:'EA',
	      scope:{
	        matches:'=',
	        query:'=',
	        active:'=',
	        position:'=',
	        select:'&'
	      },
	      replace:true,
	      templateUrl:'template/typeahead/typeahead-popup.html',
	      link:function (scope, element, attrs) {

	        scope.templateUrl = attrs.templateUrl;

	        scope.isOpen = function () {
	          return scope.matches.length > 0;
	        };

	        scope.isActive = function (matchIdx) {
	          return scope.active == matchIdx;
	        };

	        scope.selectActive = function (matchIdx) {
	          scope.active = matchIdx;
	        };

	        scope.selectMatch = function (activeIdx) {
	          scope.select({activeIdx:activeIdx});
	        };
	      }
	    };
	  })

	  .directive('typeaheadMatch', ['$http', '$templateCache', '$compile', '$parse', function ($http, $templateCache, $compile, $parse) {
	    return {
	      restrict:'EA',
	      scope:{
	        index:'=',
	        match:'=',
	        query:'='
	      },
	      link:function (scope, element, attrs) {
	        var tplUrl = $parse(attrs.templateUrl)(scope.$parent) || 'template/typeahead/typeahead-match.html';
	        $http.get(tplUrl, {cache: $templateCache}).success(function(tplContent){
	           element.replaceWith($compile(tplContent.trim())(scope));
	        });
	      }
	    };
	  }])

	  .filter('typeaheadHighlight', function() {

	    function escapeRegexp(queryToEscape) {
	      return queryToEscape.replace(/([.?*+^$[\]\\(){}|-])/g, '\\$1');
	    }

	    return function(matchItem, query) {
	      return query ? ('' + matchItem).replace(new RegExp(escapeRegexp(query), 'gi'), '<strong>$&</strong>') : matchItem;
	    };
	  });
	angular.module("template/accordion/accordion-group.html", []).run(["$templateCache", function($templateCache) {
	  $templateCache.put("template/accordion/accordion-group.html",
	    "<div class=\"panel panel-default\">\n" +
	    "  <div class=\"panel-heading\">\n" +
	    "    <h4 class=\"panel-title\">\n" +
	    "      <a class=\"accordion-toggle\" ng-click=\"toggleOpen()\" accordion-transclude=\"heading\"><span ng-class=\"{'text-muted': isDisabled}\">{{heading}}</span></a>\n" +
	    "    </h4>\n" +
	    "  </div>\n" +
	    "  <div class=\"panel-collapse\" collapse=\"!isOpen\">\n" +
	    "   <div class=\"panel-body\" ng-transclude></div>\n" +
	    "  </div>\n" +
	    "</div>");
	}]);

	angular.module("template/accordion/accordion.html", []).run(["$templateCache", function($templateCache) {
	  $templateCache.put("template/accordion/accordion.html",
	    "<div class=\"panel-group\" ng-transclude></div>");
	}]);

	angular.module("template/alert/alert.html", []).run(["$templateCache", function($templateCache) {
	  $templateCache.put("template/alert/alert.html",
	    "<div class=\"alert\" ng-class=\"{'alert-{{type || 'warning'}}': true, 'alert-dismissable': closeable}\" role=\"alert\">\n" +
	    "    <button ng-show=\"closeable\" type=\"button\" class=\"close\" ng-click=\"close()\">\n" +
	    "        <span aria-hidden=\"true\">&times;</span>\n" +
	    "        <span class=\"sr-only\">Close</span>\n" +
	    "    </button>\n" +
	    "    <div ng-transclude></div>\n" +
	    "</div>\n" +
	    "");
	}]);

	angular.module("template/carousel/carousel.html", []).run(["$templateCache", function($templateCache) {
	  $templateCache.put("template/carousel/carousel.html",
	    "<div ng-mouseenter=\"pause()\" ng-mouseleave=\"play()\" class=\"carousel\" ng-swipe-right=\"prev()\" ng-swipe-left=\"next()\">\n" +
	    "    <ol class=\"carousel-indicators\" ng-show=\"slides.length > 1\">\n" +
	    "        <li ng-repeat=\"slide in slides track by $index\" ng-class=\"{active: isActive(slide)}\" ng-click=\"select(slide)\"></li>\n" +
	    "    </ol>\n" +
	    "    <div class=\"carousel-inner\" ng-transclude></div>\n" +
	    "    <a class=\"left carousel-control\" ng-click=\"prev()\" ng-show=\"slides.length > 1\"><span class=\"icon-prev\"></span></a>\n" +
	    "    <a class=\"right carousel-control\" ng-click=\"next()\" ng-show=\"slides.length > 1\"><span class=\"icon-next\"></span></a>\n" +
	    "</div>\n" +
	    "");
	}]);

	angular.module("template/carousel/slide.html", []).run(["$templateCache", function($templateCache) {
	  $templateCache.put("template/carousel/slide.html",
	    "<div ng-class=\"{\n" +
	    "    'active': leaving || (active && !entering),\n" +
	    "    'prev': (next || active) && direction=='prev',\n" +
	    "    'next': (next || active) && direction=='next',\n" +
	    "    'right': direction=='prev',\n" +
	    "    'left': direction=='next'\n" +
	    "  }\" class=\"item text-center\" ng-transclude></div>\n" +
	    "");
	}]);

	angular.module("template/datepicker/datepicker.html", []).run(["$templateCache", function($templateCache) {
	  $templateCache.put("template/datepicker/datepicker.html",
	    "<div ng-switch=\"datepickerMode\" role=\"application\" ng-keydown=\"keydown($event)\">\n" +
	    "  <div daypicker=\"daypicker\" ng-switch-when=\"day\" tabindex=\"0\"></div>\n" +
	    "  <div monthpicker=\"monthpicker\" ng-switch-when=\"month\" tabindex=\"0\"></div>\n" +
	    "  <div yearpicker=\"yearpicker\" ng-switch-when=\"year\" tabindex=\"0\"></div>\n" +
	    "</div>");
	}]);

	angular.module("template/datepicker/day.html", []).run(["$templateCache", function($templateCache) {
	  $templateCache.put("template/datepicker/day.html",
	    "<table role=\"grid\" aria-labelledby=\"{{uniqueId}}-title\" aria-activedescendant=\"{{activeDateId}}\">\n" +
	    "  <thead>\n" +
	    "    <tr>\n" +
	    "      <th><button type=\"button\" class=\"btn btn-default btn-sm pull-left\" ng-click=\"move(-1)\" tabindex=\"-1\"><i class=\"lp-icon lp-icon-angle-left\"></i></button></th>\n" +
	    "      <th colspan=\"{{5 + showWeeks}}\"><button style=\"width:100%;\" id=\"{{uniqueId}}-title\" role=\"heading\"       aria-live=\"assertive\" aria-atomic=\"true\" type=\"button\" class=\"btn btn-default btn-sm\" ng-click=\"toggleMode()\" tabindex=\"-1\"><strong>{{title}}</strong></button></th>\n" +
	    "      <th><button type=\"button\" class=\"btn btn-default btn-sm pull-right\" ng-click=\"move(1)\" tabindex=\"-1\"><i class=\"lp-icon lp-icon-angle-right\"></i></button></th>\n" +
	    "    </tr>\n" +
	    "    <tr>\n" +
	    "      <th ng-show=\"showWeeks\" class=\"text-center\"></th>\n" +
	    "      <th ng-repeat=\"label in labels track by $index\" class=\"text-center\"><small aria-label=\"{{label.full}}\">{{label.abbr}}</small></th>\n" +
	    "    </tr>\n" +
	    "  </thead>\n" +
	    "  <tbody>\n" +
	    "    <tr ng-repeat=\"row in rows track by $index\">\n" +
	    "      <td ng-show=\"showWeeks\" class=\"text-center h6\"><em>{{ weekNumbers[$index] }}</em></td>\n" +
	    "      <td ng-repeat=\"dt in row track by dt.date\" class=\"text-center\" role=\"gridcell\" id=\"{{dt.uid}}\" aria-disabled=\"{{!!dt.disabled}}\">\n" +
	    "        <button type=\"button\" style=\"width:100%;\" class=\"btn btn-default btn-sm\" ng-class=\"{'btn-muted': dt.secondary, 'btn-info': dt.selected, active: isActive(dt)}\" ng-click=\"select(dt.date)\" ng-disabled=\"dt.disabled\" tabindex=\"-1\"><span ng-class=\"{'text-muted': dt.secondary, 'text-info': dt.current}\">{{dt.label}}</span></button>\n" +
	    "      </td>\n" +
	    "    </tr>\n" +
	    "  </tbody>\n" +
	    "</table>\n" +
	    "");
	}]);

	angular.module("template/datepicker/month.html", []).run(["$templateCache", function($templateCache) {
	  $templateCache.put("template/datepicker/month.html",
	    "<table role=\"grid\" aria-labelledby=\"{{uniqueId}}-title\" aria-activedescendant=\"{{activeDateId}}\">\n" +
	    "  <thead>\n" +
	    "    <tr>\n" +
	    "      <th><button type=\"button\" class=\"btn btn-default btn-sm pull-left\" ng-click=\"move(-1)\" tabindex=\"-1\"><i class=\"lp-icon lp-icon-angle-left\"></i></button></th>\n" +
	    "      <th><button style=\"width:100%;\" id=\"{{uniqueId}}-title\" role=\"heading\" aria-live=\"assertive\" aria-atomic=\"true\" type=\"button\" class=\"btn btn-default btn-sm\" ng-click=\"toggleMode()\" tabindex=\"-1\"><strong>{{title}}</strong></button></th>\n" +
	    "      <th><button type=\"button\" class=\"btn btn-default btn-sm pull-right\" ng-click=\"move(1)\" tabindex=\"-1\"><i class=\"lp-icon lp-icon-angle-right\"></i></button></th>\n" +
	    "    </tr>\n" +
	    "  </thead>\n" +
	    "  <tbody>\n" +
	    "    <tr ng-repeat=\"row in rows track by $index\">\n" +
	    "      <td ng-repeat=\"dt in row track by dt.date\" class=\"text-center\" role=\"gridcell\" id=\"{{dt.uid}}\" aria-disabled=\"{{!!dt.disabled}}\">\n" +
	    "        <button type=\"button\" style=\"width:100%;\" class=\"btn btn-default\" ng-class=\"{'btn-info': dt.selected, active: isActive(dt)}\" ng-click=\"select(dt.date)\" ng-disabled=\"dt.disabled\" tabindex=\"-1\"><span ng-class=\"{'text-info': dt.current}\">{{dt.label}}</span></button>\n" +
	    "      </td>\n" +
	    "    </tr>\n" +
	    "  </tbody>\n" +
	    "</table>\n" +
	    "");
	}]);

	angular.module("template/datepicker/popup.html", []).run(["$templateCache", function($templateCache) {
	  $templateCache.put("template/datepicker/popup.html",
	    "<ul class=\"dropdown-menu lp-datepicker\" ng-style=\"{display: (isOpen && 'block') || 'none', top: position.top+'px', left: position.left+'px'}\" ng-keydown=\"keydown($event)\">\n" +
	    " <li ng-transclude></li>\n" +
	    " <li ng-if=\"showButtonBar\" style=\"padding:10px 9px 2px\">\n" +
	    "   <span class=\"btn-group\">\n" +
	    "     <button type=\"button\" class=\"btn btn-sm btn-info\" ng-click=\"select('today')\">{{ getText('current') }}</button>\n" +
	    "     <button type=\"button\" class=\"btn btn-sm btn-danger\" ng-click=\"select(null)\">{{ getText('clear') }}</button>\n" +
	    "   </span>\n" +
	    "   <button type=\"button\" class=\"btn btn-sm btn-success pull-right\" ng-click=\"close()\">{{ getText('close') }}</button>\n" +
	    " </li>\n" +
	    "</ul>\n" +
	    "");
	}]);

	angular.module("template/datepicker/year.html", []).run(["$templateCache", function($templateCache) {
	  $templateCache.put("template/datepicker/year.html",
	    "<table role=\"grid\" aria-labelledby=\"{{uniqueId}}-title\" aria-activedescendant=\"{{activeDateId}}\">\n" +
	    "  <thead>\n" +
	    "    <tr>\n" +
	    "      <th><button type=\"button\" class=\"btn btn-default btn-sm pull-left\" ng-click=\"move(-1)\" tabindex=\"-1\"><i class=\"lp-icon lp-icon-angle-left\"></i></button></th>\n" +
	    "      <th colspan=\"3\"><button id=\"{{uniqueId}}-title\" role=\"heading\" aria-live=\"assertive\" aria-atomic=\"true\" type=\"button\" class=\"btn btn-default btn-sm btn-block\" ng-click=\"toggleMode()\" tabindex=\"-1\"><strong>{{title}}</strong></button></th>\n" +
	    "      <th><button type=\"button\" class=\"btn btn-default btn-sm pull-right\" ng-click=\"move(1)\" tabindex=\"-1\"><i class=\"lp-icon lp-icon-angle-right\"></i></button></th>\n" +
	    "    </tr>\n" +
	    "  </thead>\n" +
	    "  <tbody>\n" +
	    "    <tr ng-repeat=\"row in rows track by $index\">\n" +
	    "      <td ng-repeat=\"dt in row track by dt.date\" class=\"text-center\" role=\"gridcell\" id=\"{{dt.uid}}\" aria-disabled=\"{{!!dt.disabled}}\">\n" +
	    "        <button type=\"button\" style=\"width:100%;\" class=\"btn btn-default\" ng-class=\"{'btn-info': dt.selected, active: isActive(dt)}\" ng-click=\"select(dt.date)\" ng-disabled=\"dt.disabled\" tabindex=\"-1\"><span ng-class=\"{'text-info': dt.current}\">{{dt.label}}</span></button>\n" +
	    "      </td>\n" +
	    "    </tr>\n" +
	    "  </tbody>\n" +
	    "</table>\n" +
	    "");
	}]);

	angular.module("template/dropdown/dropdown-multiple.html", []).run(["$templateCache", function($templateCache) {
	  $templateCache.put("template/dropdown/dropdown-multiple.html",
	    "<a tabindex=\"-1\">\n" +
	    " <i class=\"icon-ok pull-right\" ng-show=\"option.selected\"></i>\n" +
	    " <div bind-html-unsafe=\"option.label\" style=\"overflow: hidden;\"></div>\n" +
	    "</a>");
	}]);

	angular.module("template/dropdown/dropdown-option.html", []).run(["$templateCache", function($templateCache) {
	  $templateCache.put("template/dropdown/dropdown-option.html",
	    "<a tabindex=\"-1\" bind-html-unsafe=\"option.label\"></a>");
	}]);

	angular.module("template/dropdown/dropdown.html", []).run(["$templateCache", function($templateCache) {
	  $templateCache.put("template/dropdown/dropdown.html",
	    "<div class=\"btn-group dropdown\">\n" +
	    "    <button class=\"btn btn-block dropdown-toggle\" ng-class=\"[type && 'btn-' + type, disabled && 'disabled']\" style=\"text-align: left; padding-left:5px;\">\n" +
	    "        <span bind-html-unsafe=\"label || emptyLabel\"></span>\n" +
	    "        <span class=\"caret\" style=\"position: absolute; right: 12px\"></span>\n" +
	    "    </button>\n" +
	    "    <ul class=\"dropdown-menu\" style=\"min-width:100%;\">\n" +
	    "        <li ng-show=\"header\" ng-click=\"prevent($event)\"><h3 class=\"popover-title\" >{{header}}</h3></li>\n" +
	    "        <li ng-repeat-start=\"(group, options) in groups\" ng-click=\"prevent($event)\" style=\"padding-left:5px;\"><dt>{{group}}</dt></li>\n" +
	    "        <li ng-repeat=\"option in options\" ng-click=\"select($event, option)\" ng-class=\"{ disabled: option.disabled }\">\n" +
	    "            <div dropdown-option=\"dropdown-option\" option=\"option\" template-url=\"templateUrl\" multiple=\"multiple\"></div>\n" +
	    "        </li>\n" +
	    "        <li class=\"divider\" ng-hide=\"$index === numGroups - 1\" ng-repeat-end></li>\n" +
	    "    </ul>\n" +
	    "</div>\n" +
	    "");
	}]);

	angular.module("template/dropdownSelect/option.html", []).run(["$templateCache", function($templateCache) {
	  $templateCache.put("template/dropdownSelect/option.html",
	    "<span>{{option}}</span>");
	}]);

	angular.module("template/dropdownSelect/placeholder-empty.html", []).run(["$templateCache", function($templateCache) {
	  $templateCache.put("template/dropdownSelect/placeholder-empty.html",
	    "<span>{{getEmptyText()}}</span>");
	}]);

	angular.module("template/dropdownSelect/select.html", []).run(["$templateCache", function($templateCache) {
	  $templateCache.put("template/dropdownSelect/select.html",
	"<div class=\"btn-group dropdown\" ng-keydown=\"onKeydown($event)\" is-open=\"isopen\" role=\"combobox\" aria-activedescendant=\"{{activeOption.id}}\">\n" +
	    "    <button tabindex=\"0\" type=\"button\" class=\"btn dropdown-toggle\" ng-class=\"['btn-' + (type || 'default'), size && ('btn-' + size)]\" ng-disabled=\"isDisabled\" style=\"width:100%;\" aria-label=\"{{label}}\" >\n" +
	    "        <span placeholder-empty ng-if=\"isEmpty()\" empty-placeholder-text=\"{{emptyPlaceholderText}}\"></span>\n" +
	    "        <span ng-if=\"!isEmpty() && !multiple\" select-option=\"selectedOption.label\" template-url=\"optionTemplateUrl\"></span>\n" +
	    "        <span ng-if=\"!isEmpty() && multiple\" ng-repeat=\"option in selectedOption track by $index\"><span select-option=\"option.label\" template-url=\"optionTemplateUrl\"></span><span ng-if=\"!$last\">, </span></span>\n" +
	    "        <span class=\"caret\"></span>\n" +
	    "    </button>\n" +
	    "    <ul class=\"dropdown-menu\" style=\"width:100%;\" ng-click=\"prevent($event)\" role=\"listbox\" ng-if=\"isopen\">\n" +
	    "        <li ng-if=\"filter.enabled\" style=\"padding:5px\"><input tabindex=\"-1\" type=\"search\" class=\"form-control\" style=\"width: 100%\" ng-model=\"filter.value\" ng-change=\"filterOptions()\" aria-readonly=\"true\" aria-activedescendant=\"{{activeOption.id}}\" placeholder=\"{{filterPlaceholderText}}\"></li>\n" +
	    "        <li ng-repeat-start=\"(groupName, group) in groups track by $index\" class=\"dropdown-header\" ng-if=\"groupName\">{{groupName}}</li>\n" +
	    "        <li tabindex=\"{{isActive(option) ? 0 : -1}}\" ng-repeat=\"option in group.options track by $index\" ng-class=\"{active: isActive(option)}\" role=\"option\" ng-click=\"select(option, $event)\" ng-if=\"option.valid\" aria-selected=\"{{!!option.selected}}\" aria-labelledby=\"{{option.id}}\" >\n" +
	    "            <a href tabindex=\"-1\" select-option=\"option.label\" template-url=\"optionTemplateUrl\" id=\"{{option.id}}\">\n" +
	    "                <i ng-if=\"multiple && option.selected\" class=\"glyphicon glyphicon-ok pull-right\"></i>\n" +
	    "            </a>\n" +
	    "        </li>\n" +
	    "        <li class=\"divider\" ng-if=\"!$last\" ng-repeat-end></li>\n" +
	    "    </ul>\n" +
	    "</div>\n" +
	    "");
	}]);

	angular.module("template/modal/backdrop.html", []).run(["$templateCache", function($templateCache) {
	  $templateCache.put("template/modal/backdrop.html",
	    "<div class=\"modal-backdrop fade\"\n" +
	    "     ng-class=\"{in: animate}\"\n" +
	    "     ng-style=\"{'z-index': 1040 + (index && 1 || 0) + index*10}\"\n" +
	    "></div>\n" +
	    "");
	}]);

	angular.module("template/modal/window.html", []).run(["$templateCache", function($templateCache) {
	  $templateCache.put("template/modal/window.html",
	    "<div tabindex=\"-1\" class=\"modal fade {{ windowClass }}\" ng-class=\"{in: animate}\" ng-style=\"{'z-index': 1050 + index*10, display: 'block'}\" ng-click=\"close($event)\">\n" +
	    "    <div class=\"modal-dialog\"><div class=\"modal-content\" ng-transclude></div></div>\n" +
	    "</div>");
	}]);

	angular.module("template/pagination/pager.html", []).run(["$templateCache", function($templateCache) {
	  $templateCache.put("template/pagination/pager.html",
	    "<ul class=\"pager\">\n" +
	    "  <li ng-class=\"{disabled: noPrevious(), previous: align}\"><a href ng-click=\"selectPage(page - 1)\">{{getText('previous')}}</a></li>\n" +
	    "  <li ng-class=\"{disabled: noNext(), next: align}\"><a href ng-click=\"selectPage(page + 1)\">{{getText('next')}}</a></li>\n" +
	    "</ul>");
	}]);

	angular.module("template/pagination/pagination.html", []).run(["$templateCache", function($templateCache) {
	  $templateCache.put("template/pagination/pagination.html",
	    "<ul class=\"pagination\">\n" +
	    "  <li ng-if=\"boundaryLinks\" ng-class=\"{disabled: noPrevious()}\"><a href ng-click=\"selectPage(1)\">{{getText('first')}}</a></li>\n" +
	    "  <li ng-if=\"directionLinks\" ng-class=\"{disabled: noPrevious()}\"><a href ng-click=\"selectPage(page - 1)\">{{getText('previous')}}</a></li>\n" +
	    "  <li ng-repeat=\"page in pages track by $index\" ng-class=\"{active: page.active}\"><a href ng-click=\"selectPage(page.number)\">{{page.text}}</a></li>\n" +
	    "  <li ng-if=\"directionLinks\" ng-class=\"{disabled: noNext()}\"><a href ng-click=\"selectPage(page + 1)\">{{getText('next')}}</a></li>\n" +
	    "  <li ng-if=\"boundaryLinks\" ng-class=\"{disabled: noNext()}\"><a href ng-click=\"selectPage(totalPages)\">{{getText('last')}}</a></li>\n" +
	    "</ul>");
	}]);

	angular.module("template/tooltip/tooltip-html-unsafe-popup.html", []).run(["$templateCache", function($templateCache) {
	  $templateCache.put("template/tooltip/tooltip-html-unsafe-popup.html",
	    "<div class=\"tooltip {{placement}}\" ng-class=\"{ in: isOpen(), fade: animation() }\">\n" +
	    "  <div class=\"tooltip-arrow\"></div>\n" +
	    "  <div class=\"tooltip-inner\" bind-html-unsafe=\"content\"></div>\n" +
	    "</div>\n" +
	    "");
	}]);

	angular.module("template/tooltip/tooltip-popup.html", []).run(["$templateCache", function($templateCache) {
	  $templateCache.put("template/tooltip/tooltip-popup.html",
	    "<div class=\"tooltip {{placement}}\" ng-class=\"{ in: isOpen(), fade: animation() }\">\n" +
	    "  <div class=\"tooltip-arrow\"></div>\n" +
	    "  <div class=\"tooltip-inner\" ng-bind=\"content\"></div>\n" +
	    "</div>\n" +
	    "");
	}]);

	angular.module("template/popover/popover.html", []).run(["$templateCache", function($templateCache) {
	  $templateCache.put("template/popover/popover.html",
	    "<div class=\"popover {{placement}}\" ng-class=\"{ in: isOpen(), fade: animation() }\">\n" +
	    "  <div class=\"arrow\"></div>\n" +
	    "\n" +
	    "  <div class=\"popover-inner\">\n" +
	    "      <h3 class=\"popover-title\" ng-bind=\"title\" ng-show=\"title\"></h3>\n" +
	    "      <div class=\"popover-content\" ng-bind=\"content\"></div>\n" +
	    "  </div>\n" +
	    "</div>\n" +
	    "");
	}]);

	angular.module("template/progressbar/bar.html", []).run(["$templateCache", function($templateCache) {
	  $templateCache.put("template/progressbar/bar.html",
	    "<div class=\"progress-bar\" ng-class=\"type && 'progress-bar-' + type\" role=\"progressbar\" aria-valuenow=\"{{value}}\" aria-valuemin=\"0\" aria-valuemax=\"{{max}}\" ng-style=\"{width: percent + '%'}\" aria-valuetext=\"{{percent | number:0}}%\" ng-transclude></div>");
	}]);

	angular.module("template/progressbar/progress.html", []).run(["$templateCache", function($templateCache) {
	  $templateCache.put("template/progressbar/progress.html",
	    "<div class=\"progress\" ng-transclude></div>");
	}]);

	angular.module("template/progressbar/progressbar.html", []).run(["$templateCache", function($templateCache) {
	  $templateCache.put("template/progressbar/progressbar.html",
	    "<div class=\"progress\">\n" +
	    "  <div class=\"progress-bar\" ng-class=\"type && 'progress-bar-' + type\" role=\"progressbar\" aria-valuenow=\"{{value}}\" aria-valuemin=\"0\" aria-valuemax=\"{{max}}\" ng-style=\"{width: percent + '%'}\" aria-valuetext=\"{{percent | number:0}}%\" ng-transclude></div>\n" +
	    "</div>");
	}]);

	angular.module("template/rating/rating.html", []).run(["$templateCache", function($templateCache) {
	  $templateCache.put("template/rating/rating.html",
	    "<span ng-mouseleave=\"reset()\" ng-keydown=\"onKeydown($event)\" tabindex=\"0\" role=\"slider\" aria-valuemin=\"0\" aria-valuemax=\"{{range.length}}\" aria-valuenow=\"{{value}}\">\n" +
	    "    <i ng-repeat=\"r in range track by $index\" ng-mouseenter=\"enter($index + 1)\" ng-click=\"rate($index + 1)\" class=\"glyphicon\" ng-class=\"$index < value && (r.stateOn || 'glyphicon-star') || (r.stateOff || 'glyphicon-star-empty')\">\n" +
	    "        <span class=\"sr-only\">({{ $index < value ? '*' : ' ' }})</span>\n" +
	    "    </i>\n" +
	    "</span>");
	}]);

	angular.module("template/tabs/tab.html", []).run(["$templateCache", function($templateCache) {
	  $templateCache.put("template/tabs/tab.html",
	    "<li ng-class=\"{active: active, disabled: disabled}\" id=\"{{uniqueId}}\" role=\"presentation\" ng-click=\"select()\">\n" +
	    "  <a href role=\"tab\" tabindex=\"0\" aria-labelledby=\"{{uniqueId}}\" aria-expanded=\"{{!!active}}\" aria-selected=\"{{!!active}}\" tab-heading-transclude>{{heading}}</a>\n" +
	    "</li>\n" +
	    "");
	}]);

	angular.module("template/tabs/tabset.html", []).run(["$templateCache", function($templateCache) {
	  $templateCache.put("template/tabs/tabset.html",
	    "<div>\n" +
	    "  <ul ng-keydown=\"onKeydown($event)\" class=\"nav nav-{{type || 'tabs'}}\" ng-class=\"{'nav-stacked': vertical, 'nav-justified': justified}\" role=\"tablist\" ng-transclude></ul>\n" +
	    "  <div class=\"tab-content\">\n" +
	    "    <div class=\"tab-pane\" ng-repeat=\"tab in tabs\" ng-class=\"{active: tab.active}\"\n" +
	    "         role=\"tabpanel\" aria-hidden=\"{{!tab.active}}\"\n" +
	    "         tab-content-transclude=\"tab\">\n" +
	    "    </div>\n" +
	    "  </div>\n" +
	    "</div>\n" +
	    "");
	}]);

	angular.module("template/timepicker/timepicker.html", []).run(["$templateCache", function($templateCache) {
	  $templateCache.put("template/timepicker/timepicker.html",
	    "<table>\n" +
	    " <tbody>\n" +
	    "   <tr class=\"text-center\">\n" +
	    "     <td><a ng-click=\"incrementHours()\" class=\"btn btn-link\"><span class=\"glyphicon glyphicon-chevron-up\"></span></a></td>\n" +
	    "     <td>&nbsp;</td>\n" +
	    "     <td><a ng-click=\"incrementMinutes()\" class=\"btn btn-link\"><span class=\"glyphicon glyphicon-chevron-up\"></span></a></td>\n" +
	    "     <td ng-show=\"showMeridian\"></td>\n" +
	    "   </tr>\n" +
	    "   <tr>\n" +
	    "     <td style=\"width:50px;\" class=\"form-group\" ng-class=\"{'has-error': invalidHours}\">\n" +
	    "       <input type=\"text\" ng-model=\"hours\" ng-change=\"updateHours()\" class=\"form-control text-center\" ng-mousewheel=\"incrementHours()\" ng-readonly=\"readonlyInput\" maxlength=\"2\">\n" +
	    "     </td>\n" +
	    "     <td>:</td>\n" +
	    "     <td style=\"width:50px;\" class=\"form-group\" ng-class=\"{'has-error': invalidMinutes}\">\n" +
	    "       <input type=\"text\" ng-model=\"minutes\" ng-change=\"updateMinutes()\" class=\"form-control text-center\" ng-readonly=\"readonlyInput\" maxlength=\"2\">\n" +
	    "     </td>\n" +
	    "     <td ng-show=\"showMeridian\"><button type=\"button\" class=\"btn btn-default text-center\" ng-click=\"toggleMeridian()\">{{meridian}}</button></td>\n" +
	    "   </tr>\n" +
	    "   <tr class=\"text-center\">\n" +
	    "     <td><a ng-click=\"decrementHours()\" class=\"btn btn-link\"><span class=\"glyphicon glyphicon-chevron-down\"></span></a></td>\n" +
	    "     <td>&nbsp;</td>\n" +
	    "     <td><a ng-click=\"decrementMinutes()\" class=\"btn btn-link\"><span class=\"glyphicon glyphicon-chevron-down\"></span></a></td>\n" +
	    "     <td ng-show=\"showMeridian\"></td>\n" +
	    "   </tr>\n" +
	    " </tbody>\n" +
	    "</table>\n" +
	    "");
	}]);

	angular.module("template/typeahead/typeahead-match.html", []).run(["$templateCache", function($templateCache) {
	  $templateCache.put("template/typeahead/typeahead-match.html",
	    "<a tabindex=\"-1\" bind-html-unsafe=\"match.label | typeaheadHighlight:query\"></a>");
	}]);

	angular.module("template/typeahead/typeahead-popup.html", []).run(["$templateCache", function($templateCache) {
	  $templateCache.put("template/typeahead/typeahead-popup.html",
	    "<ul class=\"dropdown-menu\" ng-if=\"isOpen()\" ng-style=\"{top: position.top+'px', left: position.left+'px'}\" style=\"display: block;\" role=\"listbox\" aria-hidden=\"{{!isOpen()}}\">\n" +
	    "    <li ng-repeat=\"match in matches track by $index\" ng-class=\"{active: isActive($index) }\" ng-mouseenter=\"selectActive($index)\" ng-click=\"selectMatch($index)\" role=\"option\">\n" +
	    "        <div typeahead-match index=\"$index\" match=\"match\" query=\"query\" template-url=\"templateUrl\"></div>\n" +
	    "    </li>\n" +
	    "</ul>");
	}]);

	}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/* WEBPACK VAR INJECTION */(function(module) {!(__WEBPACK_AMD_DEFINE_RESULT__ = function(require, exports, module) {
	    'use strict';

	    var base = __webpack_require__(2);

	    module.name = 'ui.input-overflow';

	    module.exports = base.createModule(module.name, [])
	        .directive(__webpack_require__(5));
	}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)(module)))

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_RESULT__ = function(require, exports) {
	    'use strict';

	    var angular = __webpack_require__(2).ng;

	    /** @ngInject */
	    exports.lpInputOverflow = function ($timeout) {

	        function $getWrapper(fontSize) {
	            return angular.element(
	                '<div class="lp-input-overflow">' +
	                    '<div class="lp-input-overflow-indicator">' +
	                        '<span class="lp-input-overflow-elipsis">...</span>' +
	                    '</div>' +
	                    '<span class="lp-input-overflow-input-text" style="font-size: ' + fontSize + '"></span>' +
	                '</div>'
	            );
	        }

	        return {
	            require: 'ngModel',
	            link: function (scope, element, attrs, ngModelCtrls) {

	                var fontSize = element.css('font-size'),
	                    $wrapper = element.after($getWrapper(fontSize)).next().append(element),
	                    $span = $wrapper.find('.lp-input-overflow-input-text'),
	                    $indicator = $wrapper.find('.lp-input-overflow-indicator');


	                function showIndicator() {

	                    var textWidth = $span.text(ngModelCtrls.$modelValue).width(),
	                        inputWidth = element.width();

	                    $indicator.toggleClass('inactive', textWidth < inputWidth);
	                }

	                function hideIndicator() {
	                    if (!$indicator.hasClass('inactive')) {
	                        $indicator.addClass('inactive');
	                        element.focus();
	                    }
	                }

	                // Listen events to show/hide indicator
	                element.on('blur', showIndicator);
	                element.on('click focus', hideIndicator);
	                $indicator.on('click', hideIndicator);

	                // Add a little delay for overflow check just in case
	                $timeout(showIndicator, 100);
	            }
	        };
	    };
	    exports.lpInputOverflow.$inject = ["$timeout"];

	}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/* WEBPACK VAR INJECTION */(function(module) {!(__WEBPACK_AMD_DEFINE_RESULT__ = function(require, exports, module) {
	    'use strict';

	    module.name = 'ui.amount';

	    var base = __webpack_require__(2);
	    var core = __webpack_require__(7);

	    module.exports = base
	        .createModule(module.name, [
	            core.name
	        ])
	        .directive(__webpack_require__(8));
	}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)(module)))

/***/ },
/* 7 */
/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_7__;

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_RESULT__ = function(require, exports, module) {

	    'use strict';

	    // @ngInject
	    exports.lpAmount = function(lpCoreI18n) {

	        var CLASS_AMOUNT_NEGATIVE = 'lp-amount-negative';
	        var CLASS_AMOUNT_POSITIVE = 'lp-amount-positive';

	        function templateFn() {
	            return '<span class="{{signClass}}">{{formattedAmount}}</span>';
	        }

	        function linkFn(scope, element, attrs) {
	            function formatAmount() {
	                var amount = parseFloat(scope.amount);
	                scope.signClass = amount < 0 ? CLASS_AMOUNT_NEGATIVE : CLASS_AMOUNT_POSITIVE;
	                scope.formattedAmount = lpCoreI18n.formatCurrency(amount, scope.currency);
	            }

	            scope.$watch('amount', formatAmount);
	            scope.$watch('currency', formatAmount);

	            scope.$on('$localeChangeSuccess', formatAmount);
	        }

	        return {
	            restrict: 'EA',
	            //replace: false, DO NOT USE REPLACE  ([DEPRECATED!], will be removed in next major release)
	            template: templateFn,
	            link: linkFn,
	            // bindToController: true 1.3
	            scope: {
	                'amount': '=lpAmount',
	                'currency': '=lpAmountCurrency'
	            }
	        };
	    };
	    exports.lpAmount.$inject = ["lpCoreI18n"];
	}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/* WEBPACK VAR INJECTION */(function(module) {!(__WEBPACK_AMD_DEFINE_RESULT__ = function(require, exports, module) {
	    'use strict';

	    module.name = 'ui.list';

	    var base = __webpack_require__(2);
	    var core = __webpack_require__(7);

	    module.exports = base
	        .createModule(module.name, [
	            core.name
	        ])
	        .directive(__webpack_require__(10));
	}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)(module)))

/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_RESULT__ = function(require, exports, module) {

	    'use strict';

	    // @ngInject
	    exports.lpList = function() {

	        var ng = window.angular;
	        var CLASS_LIST = 'list-group';

	        function templateFn() {
	            return [
	                '<div class="list">',
	                '</div>'
	            ].join('');
	        }

	        function compileFn($element, $attr) {
	            // Create DOM.
	            var listEl = ng.element(templateFn())
	                .append( $element.contents() ) // transclude element contents
	                .addClass(CLASS_LIST);
	            $element.append(listEl);
	        }

	        return {
	            restrict: 'EA',
	            priority: Number.MAX_VALUE,
	            //replace: false, DO NOT USE REPLACE  ([DEPRECATED!], will be removed in next major release)
	            compile: compileFn,
	            // bindToController: true 1.3
	            scope: { }
	        };
	    };

	    // @ngInject
	    exports.lpItem = function() {

	        var ng = window.angular;
	        var CLASS_LIST_ITEM = 'list-group-item clearfix';
	        var CLASS_LIST_CONTAINER = 'list-group-container';

	        function ctrlFn(ctrl, el, attr) {
	            ctrl.href = function() {
	                return attr.href || attr.ngHref;
	            };
	            ctrl.target = function() {
	                return attr.target || '_self';
	            };
	        }

	        function templateFn(isAnchor) {
	            return [
	                '<div',
	                ((isAnchor) ? ' ng-href="{{href()}}" target="{{target()}}"' : ''),
	                '>',
	                '</div>'
	            ].join('');
	        }

	        function compileFn($element, $attrs) {
	            var isAnchor, itemEl;

	            // Create DOM.
	            isAnchor = ng.isDefined($attrs.href) || ng.isDefined($attrs.ngHref);

	            // If anchor item, (has href) use the anchor template.
	            itemEl = ng.element(templateFn(isAnchor));
	            itemEl.append($element.contents()); // transclude item contents.
	            itemEl.addClass(CLASS_LIST_ITEM);
	            $element.append(itemEl);

	            // Add class to the item element
	            $element.addClass(CLASS_LIST_CONTAINER);

	            return ctrlFn;
	        }

	        return {
	            restrict: 'EA',
	            compile: compileFn,
	            scope: true
	        };
	    };

	    // @ngInject
	    exports.lpItemCell = function() {

	        var ng = window.angular;

	        function templateFn() {
	            return [
	                '<div>',
	                '</div>'
	            ].join('');
	        }

	        // TODO: provide auto widths like flexbox.
	        function markupColumnWidths($element, $attrs) {
	            var supportedWidths = ['xs', 'sm', 'md', 'lg'];
	            var defaultWidth = ( ng.isDefined($attrs.width) ) ? $attrs.width : (Math.floor(12 / $element.children().length));
	            ng.forEach(supportedWidths, function(widthType) {
	                var widthAttr = widthType + 'Width';
	                var width = (ng.isDefined($attrs[widthAttr])) ? $attrs[widthAttr] : defaultWidth;
	                $element.addClass('col-' + widthType + '-' + width);
	            });
	        }

	        function compileFn($element, $attrs) {
	            var cellEl;

	            // Create DOM.
	            cellEl = ng.element(templateFn());
	            cellEl.append($element.contents()); // tranclude cell contents.

	            // Markup column widths.
	            markupColumnWidths($element, $attrs);

	            $element.append(cellEl);
	        }

	        return {
	            restrict: 'EA',
	            compile: compileFn,
	            scope: true
	        };
	    };

	}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/* WEBPACK VAR INJECTION */(function(module) {!(__WEBPACK_AMD_DEFINE_RESULT__ = function(require, exports, module) {
		'use strict';

		module.name = 'ui.field';

		var base = __webpack_require__(2);
		var core = __webpack_require__(7);
		var utils = base.utils;
		// var responsive = require('../../responsive/scripts/main');

		module.exports = base.createModule(module.name, [
			core.name
			// responsive.name
		])
		.directive(__webpack_require__(12))
		.controller(__webpack_require__(14))
		.value('defaultErrorMessages', {
			'required': 'This field is required.'
		})
		.filter('newlines', function () {
			return function(text) {
				if (utils.isString(text)) {
					return text.replace(/\n/g, '<br/>');
				}
				return text;
			};
		});
	}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)(module)))

/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_RESULT__ = function(require, exports, module) {
		'use strict';

		var base = __webpack_require__(2);
		var angular = base.ng;

		var lpResponsive = __webpack_require__(13);

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
		exports.lpControl.$inject = ["$timeout", "$sce", "newlinesFilter"];




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
				'<div class="' + className + '">',
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




	}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/* eslint-disable*/
	/**
	 * <p>Launchpad responsive library, allows you to apply responsive behaviors to widgets and other DOM element by
	 * applying CSS media query style rules to an HTML element.
	 *
	 * <p>This module is packaged as an AMD module, and should be include using the <i>define</i> syntax.
	 *
	 * @module responsive
	 * @exports Responsive
	 * @author philip@backbase.com, nikos@backbase.com
	 * @copyright Backbase B.V, 2013
	 *
	 * @example
	 * //Changing the inner html of a widget based on its size:
	 *
	 * //amd define imports the responsive module
	 * define('launchpad/lib/responsive', function(responsive) {
	 *
	 *   //Enable a dom element (the widget body) as responsive
	 *   var responsive = Responsive.enable(widget.body);
	 *
	 *   //chain a set of rules
	 *   responsive
	 *     .rule({
	 *       'max-width': 100,
	 *       then: function(e) {
	 *         widget.body.innerHTML('&lt;p&gt;Small widget&lt;/p>');
	 *       }
	 *     }).rule({
	 *       'min-width': 101,
	 *       'max-width' 500,
	 *       then: function(e) {
	 *         widget.body.innerHTML('&lt;p&gt;Medium widget&lt;/p&gt;');
	 *       }
	 *    }).rule({
	 *       'min-width': 501  ,
	 *       then: function(e) {
	 *         widget.body.innerHTML('&lt;p&gt;Large widget&lt;/p&gt;');
	 *       }
	 *   });
	 *
	 * });
	 */
	!(__WEBPACK_AMD_DEFINE_RESULT__ = function(require, exports, module) {

		'use strict';

		var jQuery = window.jQuery;

		/**
		 * How often should the element be polled to check for a size change
		 * @const
		 * @type {number}
		 */
		var DEFAULT_SIZE_CHECK_INTERVAL = 150;

		/**
		 * Return if an element is visible.
		 *
		 * @param {DomElemetn} element
		 * @return bool
		 */
		var _isVisible = function(element) {
			if (jQuery) {
				return jQuery(element).is(':visible');
			}
			else if (element[0]) {
				// Native element is visible.
				return (element[0].offsetParent === null);
			}
		};

		/**
		 * Return element width.
		 *
		 * @param {DomElemetn} element
		 * @return int
		 */
		var _elementWidth = function(element) {
			if (jQuery) {
				return jQuery(element).width();
			}
			else if (element[0]) {
				// Native element width.
				return element[0].offsetWidth;
			}
		};

		/**
		 * Constructs a new Responsive instance which monitors the given html element and fires callbacks associated with
		 * rules if a rule's media query matches the html element's width
		 *
		 * @constructor
		 * @alias module:responsive
		 * @private
		 * @param {Object} element  An html element to monitor for size changes
		 */
		var Responsive = function(element) {

			this.element = element;
			this.checkSizeInterval = DEFAULT_SIZE_CHECK_INTERVAL;
			this.rules = [];
			this.lastWidth = 0;

			//when new rules are added this is true
			this.forceCheck = false;
		};

		/**
		 * Stop polling the this responsive instance's dom node for size changes
		 *
		 * @return {Object} Responsive
		 */
		Responsive.prototype.stop = function () {

			window.clearTimeout(this.checkSizeTimeout);
			return this;
		};

		/**
		 * Start/resume polling. (Polling starts automatically). Only use this if you have manually stopped polling
		 *
		 * @return {Object} Responsive
		 */
		Responsive.prototype.start = function () {

			this._checkForSizeChange();
			return this;
		};

		/**
		 * Adds a new rule to this responsive object
		 * A rule object may contain min width and/or max width properties and a callback function <i>then</i>. The <i>then</i>
		 * function will be invoked when it the becomes active with an event parameter which contains one
		 * property, the current width.
		 *
		 * @param {Object} rule A responsive rule object
		 *
		 * @returns {Responsive} The responsive object to allow chaining
		 */
		Responsive.prototype.rule = function(rule) {

			//convert to camel case for internal use
			if('min-width' in rule) {
				rule.minWidth = rule['min-width'];
			}
			if('max-width' in rule) {
				rule.maxWidth = rule['max-width'];
			}

			//parse values
			rule.minWidth = parseInt(rule.minWidth, 10);
			rule.maxWidth = parseInt(rule.maxWidth, 10);

			//don't add an empty rule
			//probably need some kind of console warning here
			if(typeof rule.minWidth === 'number' || typeof rule.maxWidth === 'number') {
				//default active
				rule.active = false;

				//add to rules array
				this.rules.push(rule);

				//forces the check interval to check for changes if a new rule has been added
				this.forceCheck = true;
			}

			// Do one time check when a new rule is added
			this._hasSizeChanged();

			return this;
		};

		/**
		 * The given callback function will be called whenever any rule is triggered
		 * @param {Function} callback A callback function, when invoked it will be passed an event argument containing details
		 *                          of the size change
		 *
		 */
		Responsive.prototype.any = function(callback) {

			this.anyFn = callback;
			return this;
		};

		/**
		 * The given callback function will be called whenever the element's width changes
		 * @param {Function} callback A callback function, when invoked it will be passed an event argument containing details
		 *                          of the size change
		 *
		 */
		Responsive.prototype.resize = function(callback) {

			this.resize = callback;
			return this;
		};

		/**
		 * Polling for detecting size changes
		 * @private
		 * @return {Object} Responsive
		 */
		Responsive.prototype._checkForSizeChange = function () {

			var self = this;

			//poll width for changes
			this.checkSizeTimeout = window.setTimeout(function() {
				self._hasSizeChanged();
				self._checkForSizeChange();
			}, this.checkSizeInterval);

			return this;
		};


		/**
		 * Check if size has changed
		 * @private
		 * @return {Object} Responsive
		 */
		Responsive.prototype._hasSizeChanged = function () {
			var newWidth = this._isWidthChanged();
			if(newWidth > 0) {
				this._checkRules(newWidth);
				if(typeof this.resize === 'function') {
					this.resize.call(this.element, {
						width: newWidth
					});
				}
			}

			return this;
		};

		/**
		 * If the size has changed returns the new width, otherwise returns 0
		 *
		 * @private
		 * @return {Number}
		 */
		Responsive.prototype._isWidthChanged = function () {

			var width = _elementWidth(this.element);

			var sizeChanged = (width !== this.lastWidth) && _isVisible(this.element);
			if(sizeChanged || this.forceCheck) {
				this.lastWidth = width;
				return width;
			} else {
				return 0;
			}
		};

		/**
		 * Iterates through the registered rules looking for inactive rules with media queries which match the current
		 * width
		 * @private
		 */
		Responsive.prototype._checkRules = function(width) {

			var self = this;
			var i, rule, len = this.rules.length;
			for(i = 0; i < len; i++) {
				rule = this.rules[i];
				var match =
					(!rule.minWidth || (rule.minWidth && width >= rule.minWidth)) &&
					(!rule.maxWidth || (rule.maxWidth && width <= rule.maxWidth));

				if(match && !rule.active) {
					var e = {
						width: width
					};

					if(typeof rule.then === 'function') {
						rule.then.call(this.element, e);
					}
					if(typeof self.anyFn === 'function') {
						self.anyFn.call(this.element, e);
					}
				}
				rule.active = match;
			}
		};

		/**
		 * Factory function which enables responsive behavior on a DOM element and returns a Responsive instance on which
		 * rules can be applied.
		 * @param element The DOM element to monitor for size changes
		 * @returns {Responsive} A responsive instance object
		 */
		Responsive.enable = function (element) {
			var responsive = new Responsive(element);
			responsive.start();
			return responsive;
		};

		// export
		module.exports = Responsive;

		// export to window for springboard (TODO: Refactor springboard).
		window.lp = window.lp || {};
		window.lp.responsive = Responsive;
	}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_RESULT__ = function(require, exports, module) {

		'use strict';
		var base = __webpack_require__(2);
		// var utils = base.utils;
		var angular = base.ng;

		// @ngInject
		exports.FieldController = function($scope, $templateCache, $sce, $attrs, $parse, defaultErrorMessages) {

			var self = this, getErrors, setErrors;

			$scope.errors = [];

			var errorMessages = angular.isDefined($attrs.errorMessages) ? angular.copy($scope.$parent.$eval($attrs.errorMessages)) : {};
			errorMessages = angular.extend({}, defaultErrorMessages, errorMessages);

			if ( $attrs.errors ) {
				getErrors = $parse($attrs.errors);
				setErrors = getErrors.assign;

				$scope.$parent.$watch(getErrors, function(errors) {
					$scope.errors = errors;
					$scope.setErrorMessages();
				}, true);

				$scope.$watch('errors', function(errors) {
					if ( setErrors ) {
						setErrors($scope.$parent, errors);
					}
				});
			}

			$scope.setErrorMessages = function() {
				var messages = [];
				if ($scope.errors) {
					for (var i = 0, n = $scope.errors.length; i < n; i++) {
						var error = $scope.errors[i];
						messages.push(self.getErrorMessage(error));
					}
				}
				$scope.errorMessages = messages;
			};

			this.getErrorMessage = function(error) {
				return (errorMessages && errorMessages[error]) ? errorMessages[error] : error;
			};

			this.addError = function(error) {
				$scope.errors.push(error);
			};

			this.clearErrors = function() {
	            if ($scope.errors) {
	                $scope.errors.length = 0;
	            }
			};
		};
		exports.FieldController.$inject = ["$scope", "$templateCache", "$sce", "$attrs", "$parse", "defaultErrorMessages"];
	}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/* WEBPACK VAR INJECTION */(function(module) {!(__WEBPACK_AMD_DEFINE_RESULT__ = function(require, exports, module) {
	    'use strict';

	    module.name = 'ui.responsive';

	    var base = __webpack_require__(2);
	    var core = __webpack_require__(7);

	    var responsive = __webpack_require__(13);

	    module.exports = base
	        .createModule(module.name, [
	            core.name
	        ])
	        .constant('lpUIResponsiveConfig', {
	            classPattern: 'lp-{{size}}-size',
	            rules: [
	                { max: 200, size: 'tile' },
	                { min: 201, max: 350, size: 'small' },
	                { min: 351, size: 'large' }
	            ]
	        })
	        .controller(__webpack_require__(16))
	        .directive(__webpack_require__(17))
	        .factory('lpUIResponsive', function(){
	            return responsive;
	        });
	}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)(module)))

/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_RESULT__ = function(require, exports, module) {

	    'use strict';

	    var base = __webpack_require__(2);
	    var utils = base.utils;

	    // @ngInject
	    exports.ResponsiveController = function($scope, $attrs, $parse, $timeout, lpUIResponsiveConfig, lpUIResponsive) {
	        var self = this,
	            setSize = (!utils.isUndefined($attrs.lpSize)) ? $parse($attrs.lpSize).assign : null,
	            resizeFn = utils.identity;

	        this.init = function(element) {
	            this.element = element;
	            this.responsive = lpUIResponsive.enable(element);

	            var rules = (!utils.isUndefined($attrs.sizeRules)) ? $scope.$eval($attrs.sizeRules) : lpUIResponsiveConfig.rules;
	            this.addRules(rules);

	            if ( $attrs.lpOnResize ) {
	                resizeFn = $parse( $attrs.lpOnResize );
	                this.setResizeWatcher();
	            }
	        };

	        this.addRules = function(rules) {
	            utils.forEach(rules, function(rule) {
	                self.addRule(rule.min, rule.max, rule.size);
	            });
	        };

	        var expressionHandler;
	        if ($attrs.onSizeChange) {
	            expressionHandler = $parse($attrs.onSizeChange);
	        }

	        this.addRule = function(min, max, size) {
	            var rule = {};
	            if (min) {
	                rule['min-width'] = min;
	            }
	            if (max) {
	                rule['max-width'] = max;
	            }

	            utils.extend(rule, {
	                then: function() {
	                    var oldSize = self.size;

	                    $timeout(function() {
	                        self.toggleClass(size, oldSize);
	                        self.size = size;
	                        if (expressionHandler) {
	                            expressionHandler($scope, { size: size });
	                        }
	                    });
	                }
	            });

	            this.responsive.rule(rule);
	        };

	        this.toggleClass = function(newSize, oldSize) {
	            self.element.addClass(lpUIResponsiveConfig.classPattern.replace('{{size}}', newSize));
	            if (oldSize) {
	                self.element.removeClass(lpUIResponsiveConfig.classPattern.replace('{{size}}', oldSize));
	            }

	            if ( setSize ) {
	                setSize($scope, newSize);
	            }
	        };

	        var width = null;

	        this.setResizeWatcher = function() {
	            this.responsive.resize = function( object ) {
	                if ( object.width !== width ) {
	                    width = object.width;
	                    $scope.$apply( function() {
	                        resizeFn( $scope, {width: width} );
	                    });
	                }
	            };
	        };
	    };
	    exports.ResponsiveController.$inject = ["$scope", "$attrs", "$parse", "$timeout", "lpUIResponsiveConfig", "lpUIResponsive"];
	}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_RESULT__ = function(require, exports, module) {

	    'use strict';

	    // @ngInject
	    exports.lpResponsive = function() {

	        return {
	            replace: false,
	            controller: 'ResponsiveController',
	            link: function(scope, element, attrs, ctrl) {
	                ctrl.init(element);
	            }
	        };
	    };
	}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/* WEBPACK VAR INJECTION */(function(module) {!(__WEBPACK_AMD_DEFINE_RESULT__ = function(require, exports, module) {
	    'use strict';

	    module.name = 'ui.wizard';

	    var base = __webpack_require__(2);
	    var core = __webpack_require__(7);

	    module.exports = base.createModule(module.name, [
	        core.name
	    ])
	    .directive(__webpack_require__(19))
	    .controller(__webpack_require__(20));
	}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)(module)))

/***/ },
/* 19 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_RESULT__ = function(require, exports, module) {
	    'use strict';

	    var base = __webpack_require__(2);

	    var utils = base.utils;

	    // @ngInject
	    exports.lpWizard = function() {
	        return {
	            restrict: 'A',
	            transclude: true,
	            replace: true,
	            scope: {
	                wizard: '=lpWizard',
	                title: '@title'
	            },
	            controller: 'WizardController',
	            link: function(scope, element, attrs) {

	                scope.wizard = scope.wizard || {};

	                scope.currentStepIndex = 0;
	                // create functions in the parent scope of directive

	                scope.wizard.nextStep = function() {
	                    if (scope.wizardSteps[scope.currentStepIndex + 1]) {
	                        scope.wizardSteps[++scope.currentStepIndex].active = true;
	                    }
	                };

	                scope.wizard.getActiveStep = function() {
	                    return scope.currentStepIndex + 1;
	                };

	                scope.wizard.previousStep = function() {
	                    if (scope.wizardSteps[scope.currentStepIndex - 1]) {
	                        scope.wizardSteps[--scope.currentStepIndex].active = true;
	                    }
	                };

	                scope.wizard.goToStep = function(index) {
	                    --index;

	                    if (scope.wizardSteps[index]) {
	                        scope.currentStepIndex = index;
	                        scope.wizardSteps[scope.currentStepIndex].active = true;
	                    }
	                };

	                // not needed if we passing wizard="wizard"
	                scope.$parent.$parent[attrs.nextStep] = scope.wizard.nextStep;
	                scope.$parent.$parent[attrs.getActiveStep] = scope.wizard.getActiveStep;
	                scope.$parent.$parent[attrs.previousStep] = scope.wizard.previousStep;
	                scope.$parent.$parent[attrs.goToStep] = scope.wizard.goToStep;

	            },
	            template: '<div class="wizard-wrapper">' +
	                    '	<div class="panel panel-default wizard-header text-center" tabindex="0" aria-labelledby="{{wizardSteps[currentStepIndex].uniqueId}}">' +
	                    '		<div class="panel-heading">' +
	                    '			<h3 class="wizard-header-title" ng-show="title">{{title}}</h3>' +
	                    '			<div class="clearfix wizard-steps text-center" role="navigation" ng-transclude></div>' +
	                    '		</div>' +
	                    '	</div>' +
	                    '	<div>' +
	                    '		<div class="wizard-views">' +
	                    '			<div ng-repeat="step in wizardSteps" class="wizard-view" ng-show="step.active" lp-wizard-content-transclude="step"></div>' +
	                    '		</div>' +
	                    '	</div>' +
	                    '</div>'
	        };
	    };
	    // @ngInject
	    exports.lpWizardStep = function($parse) {
	        return {
	            require: '^lpWizard',
	            restrict: 'A',
	            replace: true,
	            template: '<div class="wizard-step-container">' +
	                    '	<i ng-if="stepIndex !== 1" class="glyphicon glyphicon-arrow-right pull-left wizard-step-arrow"></i>' +
	                    '	<div class="wizard-step pull-left" ng-class="{\'wizard-active-step\': active}" lp-wizard-heading-transclude="">' +
	                    '		<span class="wizard-step-number cursor-pointer" ng-click="goToStep(stepIndex)" ng-class="{\'wizard-step-number-active\': active, \'wizard-step-done\': completed, \'text-muted\': !completed && !active}">{{stepIndex}}</span>' +
	                    '		<span id="{{uniqueId}}" class="wizard-step-heading visible-xs-block visible-sm-inline visible-md-inline visible-lg-inline" ng-class="{\'wizard-active-step\': active, \'hidden-sm hidden-xs\': !active,\'text-muted\': !completed && !active}">{{heading}}</span>' +
	                    '	</div>' +
	                    '</div>',
	            transclude: true,
	            scope: {
	                active: '=?',
	                heading: '@'
	            },
	            controller: function() {
	            },
	            compile: function(element, attribs, transclude) {
	                return function postLink(scope, elm, attrs, wizardCtrl) {
	                    scope.uniqueId = 'wizardStep-' + (wizardCtrl.instance++) + '-' + Math.floor(Math.random() * 10000);
	                    scope.stepIndex = wizardCtrl.instance;
	                    scope.$watch('active', function(active) {
	                        if (active) {
	                            wizardCtrl.select(scope);
	                        }
	                    });
	                    scope.goToStep = wizardCtrl.goToStep;
	                    wizardCtrl.addStep(scope);
	                    scope.$transcludeFn = transclude;
	                };
	            }
	        };
	    };
	    exports.lpWizardStep.$inject = ["$parse"];

	    // @ngInject
	    exports.lpWizardHeadingTransclude = function() {
	        return {
	            restrict: 'A',
	            require: '^lpWizardStep',
	            link: function(scope, elm, attrs, wizardCtrl) {
	                scope.$watch('headingElement', function updateHeadingElement(heading) {
	                    if (heading) {
	                        elm.html('');
	                        elm.append(heading);
	                    }
	                });
	            }
	        };
	    };

	    // @ngInject
	    exports.lpWizardContentTransclude = function() {
	        return {
	            restrict: 'A',
	            require: '^lpWizard',
	            link: function(scope, elm, attrs) {
	                var step = scope.$eval(attrs.lpWizardContentTransclude);
	                step.$transcludeFn(step.$parent, function(contents) {
	                    utils.forEach(contents, function(node) {
	                        elm.append(node);
	                    });
	                });
	            }
	        };
	    };


	}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 20 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_RESULT__ = function(require, exports, module) {

	    'use strict';
	    var base = __webpack_require__(2);
	    var utils = base.utils;

	    // @ngInject
	    exports.WizardController = function( $scope) {
	        var ctrl = this,
	            wizardSteps = ctrl.wizardSteps = $scope.wizardSteps = [];
	        ctrl.instance = 0;

	        ctrl.select = function(selectedStep) {

	            utils.forEach(wizardSteps, function(step) {

	                step.active = false;
	                if(selectedStep.stepIndex > step.stepIndex) {
	                    step.completed = true;
	                } else {
	                    step.completed = false;
	                }
	            });
	            selectedStep.active = true;
	        };

	        ctrl.addStep = function addStep(step) {
	            wizardSteps.push(step);
	            if (wizardSteps.length === 1) {
	                step.active = true;
	            } else if (step.active) {
	                ctrl.select(step);
	            }
	        };

	        ctrl.goToStep = function(index) {
	            index--;
	            if(index < $scope.currentStepIndex) {
	                ctrl.select(wizardSteps[index]);
	                $scope.currentStepIndex = index;
	            }
	        };
	    };
	    exports.WizardController.$inject = ["$scope"];
	}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 21 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/* WEBPACK VAR INJECTION */(function(module) {!(__WEBPACK_AMD_DEFINE_RESULT__ = function(require, exports, module) {
	    'use strict';

	    module.name = 'ui.progress-indicator';

	    var base = __webpack_require__(2);
	    var core = __webpack_require__(7);

	    module.exports = base.createModule(module.name, [
	        core.name
	    ])
	    .directive(__webpack_require__(22));
	}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)(module)))

/***/ },
/* 22 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_RESULT__ = function(require, exports, module) {
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
		exports.progressIndicator.$inject = ["$templateCache", "$compile"];

	}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 23 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/* WEBPACK VAR INJECTION */(function(module) {!(__WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports, module) {
		'use strict';

		module.name = 'ui.input';

		var base = __webpack_require__(2);
		var core = __webpack_require__(7);

		var deps = [
			core.name
		];

		return base.createModule(module.name, deps)
			.directive(__webpack_require__(24));
	}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)(module)))

/***/ },
/* 24 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_RESULT__ = function(require, exports, module) {

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
	}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 25 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/* WEBPACK VAR INJECTION */(function(module) {!(__WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports, module) {
		'use strict';

		module.name = 'ui.checkbox';

		var base = __webpack_require__(2);
		var core = __webpack_require__(7);

		var deps = [
			core.name
		];

		return base.createModule(module.name, deps)
			.directive(__webpack_require__(26));
	}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)(module)))

/***/ },
/* 26 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports, module) {
		'use strict';

		// @ngInject
		exports.lpCheckbox = function() {

			function lpCheckboxCtrl(scope, el, attrs) {
				scope.label = attrs.label || '';
			}

			var tmpl = [
				'<label>',
					'<input type="checkbox" ng-model="checked" ng-disabled="disabled" /> {{label | translate}}',
				'</label>'
			].join('');

			function compileFn() {
				return lpCheckboxCtrl;
			}

			return {
				scope: {
					config: '=lpCheckbox',
					checked: '=ngModel',
					disabled: '=ngDisabled'
				},
				restrict: 'AE',
				require: '?^ngModel',
				compile: compileFn,
				template: tmpl
			};
		};
	}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 27 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/* WEBPACK VAR INJECTION */(function(module) {!(__WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports, module) {
		'use strict';

		module.name = 'ui.timer';

		var base = __webpack_require__(2);

		return base.createModule(module.name, [])
			.directive(__webpack_require__(28));
	}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)(module)))

/***/ },
/* 28 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports, module) {
	    'use strict';

	    // @ngInject
	    exports.lpTimer = function() {

	        function lpTimerCtrl(scope, el, attrs) {

	            var timeoutId, now, end,
	                interval = 100,
	                millis = parseInt(attrs.millis, 10),
	                delayCountdown = parseInt(attrs.delayCountdown, 10) || 0,
	                countdownStart = false;

	            function getFormattedTime(t) {
	                return Math.ceil(t / 1000) + 's';
	            }

	            function tick() {

	                timeoutId = setTimeout(function() {
	                    var delta = end - new Date();
	                    var timePassed = (millis + delayCountdown) - delta;
	                    var startIn = (delayCountdown - timePassed);

	                    scope.onTick({
	                        percentage: scope.percentage,
	                        time: delta,
	                        startIn: startIn
	                    });

	                    if (startIn > 0) {
	                        scope.percentage = 100;
	                        scope.formattedTime = getFormattedTime(millis);
	                        tick();
	                    }
	                    else if (delta > 0) {
	                        if (!countdownStart) {
	                            countdownStart = true;
	                            scope.onCountdownstart();
	                        }
	                        scope.percentage = (delta / (millis)) * 100;
	                        scope.formattedTime = getFormattedTime(delta);
	                        tick();
	                    }
	                    else {
	                        scope.percentage = 0;
	                        scope.formattedTime = '';
	                        scope.onFinish();
	                    }

	                    scope.$apply();
	                }, interval);
	            }

	            scope.run = function() {
	                if (scope.percentage === 100 || typeof scope.percentage === 'undefined') {
	                    now = +new Date();
	                    end = now + delayCountdown + millis;
	                    countdownStart = false;
	                    tick();
	                }
	            };

	            scope.pause = function() {
	                if (timeoutId) {
	                    clearTimeout(timeoutId);
	                }
	            };

	            scope.resume = tick;

	            scope.reset = function() {
	                scope.pause();
	                scope.animate = false;
	                scope.percentage = 100;
	                scope.formattedTime = getFormattedTime(millis);
	                scope.animate = true;
	            };

	            scope.reset();

	            if (attrs.autostart) {
	                scope.run();
	            }

	            scope.$on('timer-run', scope.run);
	            scope.$on('timer-pause', scope.pause);
	            scope.$on('timer-resume', scope.resume);
	            scope.$on('timer-reset', scope.reset);
	        }

	        var tmpl = [
	            '<div class="lp-timer">',
	                '<progressbar animate="animate" value="percentage" type="success"><b>{{formattedTime}}</b></progressbar>',
	            '</div>'
	        ].join('');

	        function compileFn() {
	            return lpTimerCtrl;
	        }

	        return {
	            scope: {
	                config: '=lpTimer',
	                onTick: '&',
	                onCountdownstart: '&',
	                onFinish: '&'
	            },
	            restrict: 'AE',
	            compile: compileFn,
	            template: tmpl
	        };
	    };
	}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 29 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/* WEBPACK VAR INJECTION */(function(module) {!(__WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports, module) {
	    'use strict';

	    module.name = 'ui.switcher';

	    var base = __webpack_require__(2);
	    var core = __webpack_require__(7);

	    var deps = [
	        core.name
	    ];

	    return base.createModule(module.name, deps)
	        .directive(__webpack_require__(30));
	}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)(module)))

/***/ },
/* 30 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports, module) {
	    'use strict';

	    /**
	     * @ngdoc directive
	     * @name lpEnableDisableToggle
	     *
	     * @description Implements simple two-positions switcher
	     *
	     * Changes state depending on parameter (boolean) passing into with directive parameter itself
	     *
	     * @param lp-enable-disable-toggle {=boolean} Required, switcher state variable
	     * @param enabled-text-long {@string} Optional, 'on' text inside switcher for wide screens (default: Enabled)
	     * @param enabled-text-short {@string} Optional, 'on' text inside switcher for mobile screens (default: On)
	     * @param disabled-text-long {@string} Optional, 'off' text inside switcher for wide screens (default: Disabled)
	     * @param disabled-text-short {@string} Optional, 'off' text inside switcher for mobile screens (default: Off)
	     *
	     * @param $templateCache
	     * @param $timeout
	     * @returns {{scope: {active: string}, restrict: string, template: *, link: Function}}
	     */
	    // @ngInject
	    exports.lpEnableDisableToggle = function($templateCache, $timeout) {
	        $templateCache.put('enable-disable-toggle.html',
	            '<div class="enable-disable-toggle-wrapper">' +
	                '<div class="enable-disable-slider {{ directiveAnimationClasses }}" ng-class="{\'is-disabled\': !active}">' +
	                    '<div class="enable-disable-enabled">' +
	                        '<div class="note note-text note-text-wide">{{ enabledTextLong | limitTo : 8 }}</div>' +
	                        '<div class="note note-text note-text-short">{{ enabledTextShort | limitTo : 3 }}</div>' +
	                    '</div>' +
	                    '<i class="zipper">&nbsp;</i>' +
	                    '<i class="zipper">&nbsp;</i>' +
	                    '<div class="enable-disable-disabled">' +
	                        '<div class="note note-text note-text-wide">{{ disabledTextLong | limitTo : 8 }}</div>' +
	                        '<div class="note note-text note-text-short">{{ disabledTextShort | limitTo : 3 }}</div>' +
	                    '</div>' +
	                '</div>' +
	            '</div>'
	        );

	        return {
	            scope: {
	                active: '=lpEnableDisableToggle'
	            },
	            restrict: 'A',
	            template: $templateCache.get('enable-disable-toggle.html'),
	            link: function($scope, el, attrs) {
	                // fill in configs we pass by attributes
	                $scope.enabledTextLong = attrs.enabledTextLong || 'Enabled';
	                $scope.disabledTextLong = attrs.disabledTextLong || 'Disabled';
	                $scope.enabledTextShort = attrs.enabledTextShort || 'On';
	                $scope.disabledTextShort = attrs.disabledTextShort || 'Off';

	                $scope.$watch('active', function(val, old) {
	                    if (val !== old) {
	                        $scope.directiveAnimationClasses = $scope.active ? 'animated slideInLeft' : 'animated slideInRight';
	                    } else {
	                        $scope.directiveAnimationClasses = '';
	                    }
	                    $timeout(function() { $scope.directiveAnimationClasses = ''; }, 3500);
	                });
	            }
	        };
	    };
	    exports.lpEnableDisableToggle.$inject = ["$templateCache", "$timeout"];
	}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 31 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/* WEBPACK VAR INJECTION */(function(module) {!(__WEBPACK_AMD_DEFINE_RESULT__ = function(require, exports, module) {
	    'use strict';

	    module.name = 'ui.card';

	    var base = __webpack_require__(2);
	    var core = __webpack_require__(7);
	    var deps = [core.name];

	    module.exports = base.createModule(module.name, deps)
	        .directive(__webpack_require__(32));
	}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)(module)))

/***/ },
/* 32 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_RESULT__ = function(require, exports) {

	    'use strict';

	    exports.lpCard = function() {

	        function templateFn() {
	            return [
	                '<div>',
	                    '<div class="panel panel-default">',
	                        '<div class="panel-heading clearfix">',
	                        '<h5 class="pull-left">{{title}}</h5>',
	                        '<div class="buttons pull-right">' +
	                            '<button ng-repeat="button in buttons" class="btn btn-default {{button.className}}" role="button" ' +
	                        '        ng-click="button.onclick(data)" ' +
	                        '        lp-i18n="{{button.label}}"></button>',
	                        '</div>',
	                    '</div>',
	                    '<div class="panel-body" ng-transclude></div>',
	                '</div>'
	            ].join('');
	        }

	        return {
	            restrict: 'AE',
	            transclude: true,
	            scope: {
	                data: '=',
	                title: '@',
	                buttons: '='
	            },
	            template: templateFn
	        };
	    };

	}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 33 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/* WEBPACK VAR INJECTION */(function(module) {!(__WEBPACK_AMD_DEFINE_RESULT__ = function(require, exports, module) {
	    'use strict';

	    var base = __webpack_require__(2);

	    module.name = 'ui.focus';

	    module.exports = base.createModule(module.name, [])
	        .directive(__webpack_require__(34))
	        .factory(__webpack_require__(35));

	}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)(module)))

/***/ },
/* 34 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_RESULT__ = function(require, exports) {

	    'use strict';

	    function focus(element) {
	        setTimeout(function() {
	            element.focus();

	            if (element.tagName === 'INPUT') {
	                element.select();
	            }
	        }, 50);
	    }

	    // @ngInject
	    exports.lpFocusOn = function($interpolate) {
	        return {
	            link: function (scope, element, attrs) {
	                var value = $interpolate(attrs.lpFocusOn)(scope);
	                scope.$on(value, function() {
	                    focus(element[0]);
	                });
	            }
	        };
	    };
	    exports.lpFocusOn.$inject = ["$interpolate"];

	    exports.lpFocusId = function () {
	        return {
	            link: function(scope, element, attr) {
	                scope.$on('lpFocusId', function(e, name) {
	                    if (name === attr.lpFocusId) {
	                        focus(element[0]);
	                    }
	                });
	            }
	        };
	    };

	    if (!('autofocus' in document.createElement('input'))) {
	        exports.autofocus = function() {
	            return {
	                link: function (scope, element) {
	                    // IE8: Use timeout
	                    setTimeout(function() {
	                        element[0].focus();
	                    }, 100);
	                }
	            };
	        };
	    }

	}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 35 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_RESULT__ = function(require, exports) {
	    'use strict';

	    // @ngInject
	    exports.lpFocus = function ($rootScope, $timeout) {
	        return function(name) {
	            $timeout(function() {
	                $rootScope.$broadcast('lpFocusId', name);
	            }, 100);
	        };
	    };
	    exports.lpFocus.$inject = ["$rootScope", "$timeout"];
	}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 36 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/* WEBPACK VAR INJECTION */(function(module) {!(__WEBPACK_AMD_DEFINE_RESULT__ = function(require, exports, module) {
	    'use strict';

	    var base = __webpack_require__(2);

	    module.name = 'ui.nav-icon';

	    module.exports = base.createModule(module.name, [])
	        .directive(__webpack_require__(37));
	}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)(module)))

/***/ },
/* 37 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_RESULT__ = function(require, exports) {
	    'use strict';

	    exports.navIcon = function() {

	        // Predefined icons
	        var icons = {
	            'arrow-left': 'chevron-left'
	        };

	        return {
	            scope: true,
	            replace: true,
	            template: '<span class="glyphicon glyphicon-{{icon}}"></span>',
	            link: function (scope, element, attrs) {

	                // Old deprecated definition uses setup like <div nav-icon="nav-icon" icon="'list'"></div>
	                // In this case fallback to icon attribute evaluation instead of default navIcon
	                if (attrs.icon) {
	                    scope.icon = scope.$eval(attrs.icon);
	                }
	                else if (attrs.navIcon !== 'nav-icon') {
	                    scope.icon = scope.$eval(attrs.navIcon);
	                }

	                // Check if scope.icon is predefined icon from the list of icons
	                if (scope.icon in icons) {
	                    scope.icon = icons[scope.icon];
	                }
	            }
	        };
	    };

	}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 38 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/* WEBPACK VAR INJECTION */(function(module) {!(__WEBPACK_AMD_DEFINE_RESULT__ = function(require, exports, module) {
	    'use strict';

	    var base = __webpack_require__(2);

	    module.name = 'ui.aria';

	    module.exports = base.createModule(module.name, [])
	        .directive(__webpack_require__(39))
	        .filter(__webpack_require__(40));
	}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)(module)))

/***/ },
/* 39 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_RESULT__ = function(require, exports) {
	    'use strict';

	    /** @ngInject */
	    exports.lpAriaNumber = function ($filter) {
	        function link(scope) {
	            scope.$watch('lpAriaNumber', function (val) {
	                scope.srNumber = $filter('lpAriaNumber')(val);
	            });
	        }

	        return {
	            restrict: 'A',
	            link: link,
	            scope: {
	                lpAriaNumber: '='
	            },
	            template:
	                '<span aria-hidden="true">{{lpAriaNumber}}</span>' +
	                '<span class="sr-only">{{srNumber}}</span>'
	        };
	    };
	    exports.lpAriaNumber.$inject = ["$filter"];

	}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 40 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_RESULT__ = function(require, exports) {
	    'use strict';

	    exports.lpAriaNumber = function () {
	        return function(input) {
	            return input ? String(input).split('').join(' ') : '';
	        };
	    };
	}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 41 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/* WEBPACK VAR INJECTION */(function(module) {!(__WEBPACK_AMD_DEFINE_RESULT__ = function(require, exports, module) {
	    'use strict';

	    var base = __webpack_require__(2);

	    module.name = 'ui.scrolling-hook';

	    module.exports = base.createModule(module.name, [])
	        .directive(__webpack_require__(42));
	}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)(module)))

/***/ },
/* 42 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_RESULT__ = function(require, exports) {
	    'use strict';

	    var base = __webpack_require__(2);
	    var angular = base.ng;
	    var utils = base.utils;

	    /** @ngInject */
	    exports.scrollingHook = function ($window) {

	        // Trying to avoid using jQuery. This is $(window).scrollTop() replacement
	        function getScrollTop() {
	            return Math.max(document.documentElement.scrollTop, document.body.scrollTop);
	        }

	        return {
	            scope: {
	                className: '=scrollClass',
	                distance: '=scrollDistance',
	                hookCallback: '='
	            },
	            link: function (scope, element, attrs) {

	                // Get current distance from top
	                var lastScrollTop = getScrollTop(),
	                    className = scope.className;

	                var doClassChange = function() {

	                    // New distance from top once scrolled
	                    var st = getScrollTop();

	                    if (st >= scope.distance) {

	                        if (lastScrollTop - st >= 5 || lastScrollTop <= 0) {
	                            // Scrolling up
	                            if (element.hasClass(className)) {
	                                element.removeClass(className);
	                            }
	                        }
	                        else if (st > lastScrollTop) {
	                            // Scrolling down
	                            if (!element.hasClass(className)) {
	                                element.addClass(className);
	                            }
	                        }
	                    }
	                    else {
	                        if (element.hasClass(className)) {
	                            // We are not low enough on the page, return to default setting
	                            element.removeClass(className);
	                        }
	                    }

	                    // Reset scrollTop to current pageYOffset
	                    lastScrollTop = st;

	                    if (scope.hookCallback) {
	                        scope.hookCallback(element);
	                    }
	                };

	                angular.element($window).on('scroll', utils.debounce(doClassChange, 10));

	            }
	        };
	    };
	    exports.scrollingHook.$inject = ["$window"];

	}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 43 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/* WEBPACK VAR INJECTION */(function(module) {!(__WEBPACK_AMD_DEFINE_RESULT__ = function(require, exports, module) {
	    'use strict';

	    var base = __webpack_require__(2);

	    module.name = 'ui.number-input';

	    module.exports = base.createModule(module.name, [])
	        .directive(__webpack_require__(44));
	}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)(module)))

/***/ },
/* 44 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_RESULT__ = function(require, exports) {
	    'use strict';

	    /** @ngInject */
	    exports.lpNumberInput = function () {
	        return {
	            scope: {
	                'lpMaxLength': '='
	            },
	            link: function(scope, element, attrs) {

	                // set the min and max values
	                var maxValue = attrs.max || Number.MAX_VALUE,
	                    minValue = attrs.min || -Number.MAX_VALUE;

	                // check for browser support of input type="number"
	                var numberInputSupported = element[0].getAttribute('type') === 'number' && element[0].type === 'number';

	                // set the max attribute depending on the length
	                var updateMaxValue = function(value) {
	                    if (value) {
	                        maxValue = Math.pow(10, value) - 1;
	                        element.attr('max', maxValue);
	                    }
	                };

	                // set the max length, in case the browser doesn't support number input fields
	                var updateMaxLength = function(value) {
	                    if (value) {
	                        element.attr('maxlength', value);
	                    }
	                };

	                // if lp-max-length is defined set the max value again
	                if (scope.lpMaxLength) {
	                    if (numberInputSupported) {
	                        updateMaxValue(scope.lpMaxLength);

	                        scope.$watch('lpMaxLength', function(newValue) {
	                            updateMaxValue(newValue);
	                        });
	                    } else {
	                        updateMaxLength(scope.lpMaxLength);

	                        scope.$watch('lpMaxLength', function(newValue) {
	                            updateMaxLength(newValue);
	                        });
	                    }
	                }

	                element.bind('keypress', function(event) {

	                    // Regular expression for numbers 0..9
	                    var digitRegex = new RegExp('(4[8-9]|5[0-7])'),
	                        isMinus = event.which === 45,
	                        digit = null,
	                        preValue,
	                        input = element[0];

	                    // if key pressed not a digit, backspace, delete, enter, tab or function key... block it
	                    if (!event.ctrlKey && !event.metaKey &&
	                        !/^(8|9|13|189|190|45)$/.test(event.keyCode) && !digitRegex.test(event.which) && !isMinus) {
	                        return false;
	                    }

	                    // if min value is 0 or higher, don't allow minus sign (ASCII code 45) to be entered
	                    if (minValue >= 0 && isMinus) {
	                        return false;
	                    }

	                    if (digitRegex.test(event.which) || isMinus) {

	                        digit = String.fromCharCode(event.which);

	                        var value = input.valueAsNumber;

	                        // Check only if it's the first chracter (this.value is "")
	                        if (isNaN(value) && !this.value) {

	                            // If minus is the very first character just don't validate
	                            if (!isMinus) {
	                                value = '';
	                            }
	                        }

	                        preValue = value || this.value;

	                        // Additional check for minus character to make sure it can only be the very first character
	                        if ( isMinus && (preValue || String(value || this.value).match(/-/g).length) ) {
	                            return false;
	                        }

	                        value = parseInt(preValue + digit, 10);

	                        // if new value out of the min..max range block the last key
	                        if (value < minValue || value > maxValue) {
	                            return false;
	                        }
	                    }
	                });
	            }
	        };
	    };

	}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 45 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/* WEBPACK VAR INJECTION */(function(module) {!(__WEBPACK_AMD_DEFINE_RESULT__ = function(require, exports, module) {
	    'use strict';

	    module.name = 'ui.modal-dialog';

	    var base = __webpack_require__(2);

	    module.exports = base.createModule(module.name, [])
	        .directive(__webpack_require__(46));
	}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)(module)))

/***/ },
/* 46 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports) {

	    'use strict';

	    var $ = window.jQuery;
	    var be = window.be;
	    var bd = window.bd;

	    var getIceContent = function (widget) {

	        var edit = function (wg) {
	            if (be && be.ice && be.ice.controller) {
	                wg.iceConfig = be.ice.config;
	                var templateUrl = String(wg.getPreference('templateUrl'));
	                if (templateUrl.match(/\/image\.html$/)) {
	                    templateUrl = templateUrl.replace(/\/image\.html$/, '/image-editorial.html');
	                }
	                return be.ice.controller.edit(wg, templateUrl)
	                    .then(function (dom) {
	                        return dom;
	                    });
	            }
	        };

	        if (bd && bd.designMode === 'true') {
	            return edit(widget);
	        }
	    };

	    // @ngInject
	    exports.modalDialog = function (widget, $templateCache) {

	        $templateCache.put('$modalDialog.html',
	            '<div class="lp-modal modal" ng-show="show">' +
	            '    <div class="ng-modal-overlay" ng-click="hideModal()"></div>' +
	            '    <div class="modal-dialog" ng-style="dialogStyle" tabindex="-1">' +
	            '        <div class="modal-content" ng-transclude=""></div>' +
	            '    </div>' +
	            '</div>');

	        return {
	            restrict: 'AE',
	            scope: {
	                show: '='
	            },
	            replace: true, // Replace with the template below
	            transclude: true, // we want to insert custom content inside the directive
	            template: $templateCache.get('$modalDialog.html'),
	            link: function (scope, element, attrs) {
	                scope.closable = attrs.closable ? scope.$parent.$eval(attrs.closable) : true;
	                scope.dialogStyle = {};
	                if (attrs.width) {
	                    scope.dialogStyle.width = attrs.width;
	                }
	                if (attrs.height) {
	                    scope.dialogStyle.height = attrs.height;
	                }

	                var bindCloseModal = function () {
	                    $(element).find('.modal-close-button').on('click', function () {
	                        scope.hideModal();
	                        scope.$apply();
	                    });
	                };

	                if (attrs.isice && widget.getPreference('templateUrl')) {
	                    var c = getIceContent(widget);
	                    if (c) {
	                        c.then(function (dom) {
	                            $(element).find('.bp-g-include').html(dom);
	                            $(element).find('[contenteditable]').on('keypress keydown', function (e) {
	                                e.stopPropagation();
	                            });
	                            bindCloseModal();
	                        });
	                    } else {
	                        bindCloseModal();
	                    }
	                }

	                scope.hideModal = function () {
	                    scope.show = false;
	                };

	                scope.focusModal = function () {
	                    element.find('.modal-dialog').focus();
	                };

	                var escapeEvent = function (event) {
	                    if (event.keyCode === 27) {
	                        event.stopPropagation();
	                        event.preventDefault();

	                        scope.hideModal();
	                        scope.$apply();
	                    }
	                };
	                scope.$watch('show', function (newValue) {
	                    if (newValue) {
	                        element.bind('keydown.modalDialog', escapeEvent);
	                        scope.focusModal();
	                    } else {
	                        element.unbind('keydown.modalDialog', escapeEvent);
	                    }
	                });
	            }
	        };
	    };
	    exports.modalDialog.$inject = ["widget", "$templateCache"];

	}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 47 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/* WEBPACK VAR INJECTION */(function(module) {!(__WEBPACK_AMD_DEFINE_RESULT__ = function(require, exports, module) {
	    'use strict';

	    module.name = 'ui.smartsuggest';

	    var base = __webpack_require__(2);
	    var core = __webpack_require__(7);

	    // Plugin needed for autosuggest
	    __webpack_require__(48);

	    var smartsuggestEngine = __webpack_require__(50);
	    var smartsuggestFormatter = __webpack_require__(56);

	    module.exports = base
	        .createModule(module.name, [
	            core.name,
	            smartsuggestEngine.name,
	            smartsuggestFormatter.name
	        ]);
	}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)(module)))

/***/ },
/* 48 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/* eslint-disable */
	/**
	 *  Ajax Autocomplete for jQuery, version 1.2.7
	 *  (c) 2013 Tomas Kirda
	 *
	 *  Ajax Autocomplete for jQuery is freely distributable under the terms of an MIT-style license.
	 *  For details, see the web site: http://www.devbridge.com/projects/autocomplete/jquery/
	 *
	 */

	/*jslint  browser: true, white: true, plusplus: true */
	/*global define, window, document, jQuery */

	// Expose plugin as an AMD module if AMD loader is present:
	(function (factory) {
		"use strict";
		if (true) {
			// AMD. Register as an anonymous module.
	        !(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(49)], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory), __WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? (__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
		} else {
			// Browser globals
			factory(window.jQuery);
		}
	}(function ($) {

		"use strict";


		var
			utils = (function () {
				return {
					escapeRegExChars: function (value) {
						return value.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
					},
					createNode: function (html) {
						var div = document.createElement("div");
						div.innerHTML = html;
						return div.firstChild;
					}
				};
			}()),

			keys = {
				ESC: 27,
				TAB: 9,
				RETURN: 13,
				LEFT: 37,
				UP: 38,
				RIGHT: 39,
				DOWN: 40
			};

		function Autocomplete(el, options) {
			var noop = function () { },
				self = this,
				defaults = {
					autoSelectFirst: false,
					circularSelect: true,
					appendTo: "body",
					serviceUrl: null,
					lookup: null,
					onSelect: null,
					width: "auto",
					minChars: 1,
					maxHeight: 300,
					deferRequestBy: 0,
					params: {},
					formatResult: Autocomplete.formatResult,
					delimiter: null,
					zIndex: 9999,
					type: "GET",
					noCache: false,
					onSearchStart: noop,
					onSearchComplete: noop,
					onClear: noop,
					onChangeModel: noop,
					containerClass: "lp-autosuggest-suggestions",
					tabDisabled: true,
					dataType: "text",
					currentRequest: null,
					paramName: "query",
					transformResult: function (response) {
						return typeof response === "string" ? $.parseJSON(response) : response;
					}
				};

			// Shared variables:
			self.element = el;
			self.el = $(el);
			self.suggestions = [];
			self.badQueries = [];
			self.selectedIndex = -1;
			self.currentValue = self.element.value;
			self.intervalId = 0;
			self.cachedResponse = [];
			self.onChangeInterval = null;
			self.onChange = null;
			self.isLocal = false;
			self.suggestionsContainer = null;
			self.options = $.extend({}, defaults, options);
			self.classes = {
				selected: "lp-autosuggest-selected",
				suggestion: "lp-autosuggest-suggestion"
			};
			self.hint = null;
			self.hintValue = "";
			self.selection = null;

			// Initialize and set options:
			self.initialize();
			self.setOptions(options);
		}

		Autocomplete.utils = utils;

		$.Autocomplete = Autocomplete;

		Autocomplete.formatResult = function (suggestion, currentValue) {
			var pattern = "(" + utils.escapeRegExChars(currentValue) + ")";

			return suggestion.value.replace(new RegExp(pattern, "gi"), "<strong>$1<\/strong>");
		};

		Autocomplete.prototype = {

			killerFn: null,

			initialize: function () {

				var self = this,
					suggestionSelector = "." + self.classes.suggestion,
					selected = self.classes.selected,
					options = self.options,
					container;

				// Remove autocomplete attribute to prevent native suggestions:
				self.element.setAttribute("autosuggest", "off");

				// Add aria attribute
				self.element.setAttribute("aria-autocomplete", "list");

				self.killerFn = function (e) {
	                // Don't hide when field has focus
					if (($(e.target).closest("." + self.options.containerClass).length === 0) && !self.el.is(":focus")) {
	                    self.killSuggestions();
						self.disableKillerFn();
					}
				};

				self.suggestionsContainer = Autocomplete.utils.createNode('<div class="' + options.containerClass + '" style="position: absolute; display: none;"></div>');

				container = $(self.suggestionsContainer);

				container.appendTo(options.appendTo);

				// Only set width if it was provided:
				if (options.width !== "auto") {
					container.width(options.width);
				}

				// Listen for mouse over event on suggestions list:
				container.on("mouseover.autosuggest", suggestionSelector, function () {
					self.activate($(this).data("index"));
				});

				// Deselect active element when mouse leaves suggestions container:
				container.on("mouseout.autosuggest", function () {
					self.selectedIndex = -1;
					container.children("." + selected).removeClass(selected);
				});

				// Listen for click event on suggestions list:
				container.on("mousedown.autosuggest touchstart.autosuggest", suggestionSelector, function () {
					self.select($(this).data("index"));
	                self.el.trigger('blur');
				});

				self.fixPosition();

				self.fixPositionCapture = function () {
					if (self.visible) {
						self.fixPosition();
					}
				};

				$(window).on("resize", self.fixPositionCapture);

				self.el.on("keydown.autosuggest", function (e) { self.onKeyPress(e); });
				self.el.on("keyup.autosuggest", function (e) { self.onKeyUp(e); });
				self.el.on("blur.autosuggest", function (e) {
	                var delay;
	                if (!e.isTrigger) {
	                    delay = setTimeout(function() {
	                        self.killerFn(e);
	                    }, 100);
	                }
	                else {
	                    clearTimeout(delay);
	                    self.killerFn(e);
	                }
	            });
				self.el.on("focus.autosuggest", function () { self.onFocus(); });
				self.el.on("change.autosuggest", function (e) { self.onKeyUp(e); });
	            self.el.on("toggle.autosuggest", function (e) { self.onToggle(e); });
			},

	        onToggle: function () {
	            if (this.visible) {
	                this.el.blur();
	            } else {
	                this.el.focus();
	            }
	        },

			onBlur: function () {
				this.enableKillerFn();
			},

			setOptions: function (suppliedOptions) {
				var self = this,
					options = self.options;

				$.extend(options, suppliedOptions);

				self.isLocal = $.isArray(options.lookup);

				if (self.isLocal) {
					options.lookup = self.verifySuggestionsFormat(options.lookup);
				}

				// Adjust height, width and z-index:
				$(self.suggestionsContainer).css({
					"max-height": options.maxHeight + "px",
					"width": options.width + "px",
					"z-index": options.zIndex
				});
			},

			clearCache: function () {
				this.cachedResponse = [];
				this.badQueries = [];
			},

			clear: function () {
				this.clearCache();
				this.currentValue = "";
				this.suggestions = [];
			},

			disable: function () {
				this.disabled = true;
			},

			enable: function () {
				this.disabled = false;
			},

			changeModel: function() {
				var self = this;
				self.options.onChangeModel.call(self.element);
			},

			fixPosition: function () {
				var self = this,
					offset;

				// Don't adjsut position if custom container has been specified:
				if (self.options.appendTo !== "body") {
					return;
				}

				offset = self.el.offset();

				$(self.suggestionsContainer).css({
					top: (offset.top + self.el.outerHeight()) + "px",
					left: offset.left + "px"
				});
			},

			enableKillerFn: function () {
				var self = this;
				$(document).on("click.autosuggest", self.killerFn);
			},

			disableKillerFn: function () {
				var self = this;
				$(document).off("click.autosuggest", self.killerFn);
			},

			killSuggestions: function () {
				var self = this;
				self.stopKillSuggestions();
				self.intervalId = window.setInterval(function () {
					self.hide();
					self.stopKillSuggestions();
				}, 100);
			},

			stopKillSuggestions: function () {
				window.clearInterval(this.intervalId);
			},

			isCursorAtEnd: function () {
				var self = this,
					valLength = self.el.val().length,
					selectionStart = self.element.selectionStart,
					range;

				if (typeof selectionStart === "number") {
					return selectionStart === valLength;
				}
				if (document.selection) {
					range = document.selection.createRange();
					range.moveStart("character", -valLength);
					return valLength === range.text.length;
				}
				return true;
			},

			onKeyPress: function (e) {
				var self = this;

				// If suggestions are hidden and user presses arrow down, display suggestions:
				if (!self.disabled && !self.visible && e.which === keys.DOWN && self.currentValue) {
					self.suggest();
					return;
				}

				if (self.disabled || !self.visible) {
					return;
				}

				switch (e.which) {
					case keys.ESC:
						self.el.val("");
						self.hide();
						self.options.onClear.call(self.element);
						break;
					case keys.RIGHT:
						if (self.hint && self.options.onHint && self.isCursorAtEnd()) {
							self.selectHint();
							break;
						}
						return;
					case keys.TAB:
						if (self.hint && self.options.onHint) {
							self.selectHint();
							return;
						}
					/* falls through */
					case keys.RETURN:
						if (self.selectedIndex === -1) {
							self.hide();
							return;
						}
						self.select(self.selectedIndex);
						if (e.which === keys.TAB && self.options.tabDisabled === false) {
							return;
						}
						break;
					case keys.UP:
						self.moveUp();
						break;
					case keys.DOWN:
						self.moveDown();
						break;
					default:
						return;
				}

				// Cancel event if function did not return:
				e.stopImmediatePropagation();
				e.preventDefault();
			},

			onKeyUp: function (e) {
				var self = this;

				if (self.disabled || e.which === keys.UP || e.which === keys.DOWN) {
					return;
				}

				clearInterval(self.onChangeInterval);

				if (self.currentValue !== self.el.val()) {
					self.findBestHint();
					if (self.options.deferRequestBy > 0) {
						// Defer lookup in case when value changes very quickly:
						self.onChangeInterval = setInterval(function () {
							self.onValueChange();
						}, self.options.deferRequestBy);
					} else {
						self.onValueChange();
					}
				}
			},

	        onFocus : function() {
	            this.currentValue = this.el.val();
	            this.fixPosition();
	            this.getSuggestions("", "focus");
	        },

			onValueChange: function () {

				var self = this,
					q;

				if (self.selection) {
					self.selection = null;
					(self.options.onInvalidateSelection || $.noop)();
				}

				clearInterval(self.onChangeInterval);
				self.currentValue = self.el.val();

				if(!self.currentValue) {
					//reset
					self.options.onClear.call(self.element);
				}

				q = self.getQuery(self.currentValue);
				self.selectedIndex = -1;

				if (q.length < self.options.minChars) {
					self.hide();
				} else {
					self.getSuggestions(q, "change");
				}
			},

			getQuery: function (value) {
				var delimiter = this.options.delimiter,
					parts;

				if (!delimiter) {
					return $.trim(value);
				}
				parts = value.split(delimiter);
				return $.trim(parts[parts.length - 1]);
			},

			getSuggestionsLocal: function (query) {
				var self = this;

				var suggestions = self.options.lookup.call(this.element, query);
				return {
					suggestions: suggestions
				};
			},

			getSuggestions: function (q, e) {
				var self = this,
					options = self.options;

				if(self.cachedResponse[q]) {
					self.suggestions = self.cachedResponse[q];
					self.suggest();

				}  else if (!self.isBadQuery(q)) {
					options.params[options.paramName] = q;
					if (options.onSearchStart.call(self.element, options.params) === false) {
						return;
					}
					var suggestions = self.getSuggestionsLocal(q);
					self.processResponse(suggestions, q, e);
					options.onSearchComplete.call(self.element, q);
				}
			},

			isBadQuery: function (q) {
				var badQueries = this.badQueries,
					i = badQueries.length;

				while (i--) {
					if (q.indexOf(badQueries[i]) === 0) {
						return true;
					}
				}

				return false;
			},

			hide: function () {
				var self = this;
				self.visible = false;
				self.selectedIndex = -1;
				$(self.suggestionsContainer).hide();
				self.signalHint(null);
			},

			suggest: function () {
				if (this.suggestions.length === 0) {
					this.hide();
					return;
				}

				var self = this,
					formatResult = self.options.formatResult,
					value = self.getQuery(self.currentValue),
					className = self.classes.suggestion,
					classSelected = self.classes.selected,
					container = $(self.suggestionsContainer),
					html = "",
					width;

				// Build suggestions inner HTML:
				$.each(self.suggestions, function (i, suggestion) {
					html += '<div class="' + className + '" data-index="' + i + '" role="option">' + formatResult(suggestion, value) + '</div>';
				});

				// If width is auto, adjust width before displaying suggestions,
				// because if instance was created before input had width, it will be zero.
				// Also it adjusts if input width has changed.
				// -2px to account for suggestions border.
				if (self.options.width === "auto") {
					width = self.el.outerWidth() - 2;
					container.width(width > 0 ? width : 300);
				}

				container.html(html).show();
				self.visible = true;

				// Select first value by default:
				if (self.options.autoSelectFirst) {
					self.selectedIndex = 0;
					container.children().first().addClass(classSelected);
				}

				self.findBestHint();
			},

			findBestHint: function () {
				var self = this,
					value = self.el.val().toLowerCase(),
					bestMatch = null;

				if (!value) {
					return;
				}

				$.each(self.suggestions, function (i, suggestion) {
					var foundMatch = suggestion.value.toLowerCase && suggestion.value.toLowerCase().indexOf(value) === 0;
					if (foundMatch) {
						bestMatch = suggestion;
					}
					return !foundMatch;
				});

				self.signalHint(bestMatch);
			},

			signalHint: function (suggestion) {
				var hintValue = "",
					self = this;
				if (suggestion) {
					hintValue = self.currentValue + suggestion.value.substr(self.currentValue.length);
				}
				if (self.hintValue !== hintValue) {
					self.hintValue = hintValue;
					self.hint = suggestion;
					(this.options.onHint || $.noop)(hintValue);
				}
			},

			verifySuggestionsFormat: function (suggestions) {
				// If suggestions is string array, convert them to supported format:
				if (suggestions.length && typeof suggestions[0] === "string") {
					return $.map(suggestions, function (value) {
						return { value: value, data: null };
					});
				}

				return suggestions;
			},

			processResponse: function (response, originalQuery, e) {
				var self = this,
					options = self.options,
					result = options.transformResult(response, originalQuery);

				result.suggestions = self.verifySuggestionsFormat(result.suggestions);

				// Cache results if cache is not disabled:
				if (!options.noCache) {
					self.cachedResponse[result[options.paramName]] = result;
					if (result.suggestions.length === 0) {
						self.badQueries.push(result[options.paramName]);
					}
				}

				// Display suggestions only if returned query matches current value:
				if (originalQuery === self.getQuery(self.currentValue) || e === "focus") {
					self.suggestions = result.suggestions;
					self.suggest();
				}
			},

			activate: function (index) {
				var self = this,
					activeItem,
					selected = self.classes.selected,
					container = $(self.suggestionsContainer),
					children = container.children();

				container.children("." + selected).removeClass(selected);

				self.selectedIndex = index;

				if (self.selectedIndex !== -1 && children.length > self.selectedIndex) {
					activeItem = children.get(self.selectedIndex);
					$(activeItem).addClass(selected);
					return activeItem;
				}

				return null;
			},

			selectHint: function () {
				var self = this,
					i = $.inArray(self.hint, self.suggestions);

				self.select(i);
			},

			select: function (i) {
				var self = this;
				self.hide();
				self.onSelect(i);
			},

			moveUp: function () {
				var self = this;

				if (self.selectedIndex === -1) {
					return;
				}

				var modifier;
				if (self.selectedIndex === 0) {
					if(self.options.circularSelect) {
						modifier = self.suggestions.length - 1;
					} else {
						$(self.suggestionsContainer).children().first().removeClass(self.classes.selected);
						self.selectedIndex = -1;
						self.el.val(self.currentValue);
	                    self.el.trigger("input");
						self.findBestHint();
						return;
					}
				} else {
					modifier = -1;
				}

				self.adjustScroll(self.selectedIndex + modifier);
			},

			moveDown: function () {
				var self = this;

				var modifier;
				if (self.selectedIndex === (self.suggestions.length - 1)) {
					if(self.options.circularSelect) {
						modifier = (self.suggestions.length - 1) * -1;
					} else {
						return;
					}
				} else {
					modifier = 1;
				}

				self.adjustScroll(self.selectedIndex + modifier);
			},

			adjustScroll: function (index) {
				var self = this,
					activeItem = self.activate(index),
					offsetTop,
					upperBound,
					lowerBound,
					heightDelta = 75;

				if (!activeItem) {
					return;
				}

				offsetTop = activeItem.offsetTop;
				upperBound = $(self.suggestionsContainer).scrollTop();
				lowerBound = upperBound + self.options.maxHeight - heightDelta;

				if (offsetTop < upperBound) {
					$(self.suggestionsContainer).scrollTop(offsetTop);
				} else if (offsetTop > lowerBound) {
					$(self.suggestionsContainer).scrollTop(offsetTop - self.options.maxHeight + heightDelta);
				}

				self.el.val(self.getValue(self.suggestions[index].value));
	            self.el.trigger("input");
				self.signalHint(null);
			},

			onSelect: function (index) {
				var self = this,
					onSelectCallback = self.options.onSelect,
					suggestion = self.suggestions[index],
	                setCurrentValue = true;

				self.currentValue = self.getValue(suggestion.value);
				self.signalHint(null);
				self.suggestions = [];
				self.selection = suggestion;

				if ($.isFunction(onSelectCallback)) {
	                if (onSelectCallback.call(self.element, suggestion) === false) {
	                    setCurrentValue = false;
	                }
				}

	            if (setCurrentValue) {
	                self.el.val(self.currentValue);
	                self.el.trigger("input");
	            }
	        },

			getValue: function (value) {
				var self = this,
					delimiter = self.options.delimiter,
					currentValue,
					parts;

				if (!delimiter) {
					return value;
				}

				currentValue = self.currentValue;
				parts = currentValue.split(delimiter);

				if (parts.length === 1) {
					return value;
				}

				return currentValue.substr(0, currentValue.length - parts[parts.length - 1].length) + value;
			},

			dispose: function () {
				var self = this;
				self.el.off(".autosuggest").removeData("autosuggest");
				self.disableKillerFn();
				$(window).off("resize", self.fixPositionCapture);
				$(self.suggestionsContainer).remove();
			}
		};

		// Create chainable jQuery plugin:
		$.fn.autosuggest = function (options, args) {
			var dataKey = "autosuggest";
			// If function invoked without argument return
			// instance of the first matched element:
			if (arguments.length === 0) {
				return this.first().data(dataKey);
			}

			return this.each(function () {
				var inputElement = $(this),
					instance = inputElement.data(dataKey);

				if (typeof options === "string") {
					if (instance && typeof instance[options] === "function") {
						instance[options](args);
					}
				} else {
					// If instance already exists, destroy it:
					if (instance && instance.dispose) {
						instance.dispose();
					}
					instance = new Autocomplete(this, options);
					inputElement.data(dataKey, instance);
				}
			});
		};
	}));


/***/ },
/* 49 */
/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_49__;

/***/ },
/* 50 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/* WEBPACK VAR INJECTION */(function(module) {/*global define */
	!(__WEBPACK_AMD_DEFINE_RESULT__ = function(require, exports, module) {
	    'use strict';

	    var base = __webpack_require__(2);
	    var core = __webpack_require__(7);
	    var util = __webpack_require__(51);
	    var builtIn = __webpack_require__(54);
	    var config = __webpack_require__(55);

	    var regex = __webpack_require__(53);

	    module.name = 'ui.smartsuggest-engine'; // launchpad/lib/ui/smartsuggest-engine

	    module.exports = base.createModule(module.name, [
	        core.name,
	        util.name,
	        config.name,
	        builtIn.name
	    ]);

	    var RANGE_REGEX = regex['RANGE_REGEX'];
	    // var NUMBER_REGEX = regex['NUMBER_REGEX'];
	    // var STRIP_ACC_FORMATTING_REGEX = regex['STRIP_ACC_FORMATTING_REGEX'];

	    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	    // The SmartSearch class
	    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

	    // @ngInject
	    var SmartSuggestFactory = function(lpCoreUtils, SmartSuggestConfig, SmartSuggestEngineUtil, SmartSuggestEngineBuiltInSuggesters) {

	        var SmartSuggest = function(options) {
	            this.options = options || {};
	            this.suggesters = [];
	        };

	        ////////////////////////////////////////////////////////////////
	        // Mixin additional Config functionality to Engine's prototype
	        ////////////////////////////////////////////////////////////////
	        lpCoreUtils.mixin(SmartSuggest, SmartSuggestConfig);

	        //////////////////////////////////////////////
	        // Built in suggestion pre-configured types
	        //////////////////////////////////////////////
	        SmartSuggest.types = SmartSuggestConfig.TYPES;

	        ////////////////////////////////////////////////////
	        // Built in suggestion pre-configured type labels
	        ////////////////////////////////////////////////////
	        SmartSuggest.labels = SmartSuggestConfig.LABELS;

	        /////////////////////////////////////////////////////////
	        // Built in suggestion pre-configured type icon classes
	        /////////////////////////////////////////////////////////
	        SmartSuggest.icons = SmartSuggestConfig.ICONS;

	        ////////////////////////////////////////
	        // Utilities
	        ////////////////////////////////////////
	        SmartSuggest.util = SmartSuggestEngineUtil;

	        ////////////////////////////////////////
	        // Built-In Suggesters
	        ////////////////////////////////////////
	        SmartSuggest.builtIn = SmartSuggestEngineBuiltInSuggesters;

	        /**
	         * Returns a list of suggestions for a search
	         * @param term
	         * @returns {Array}
	         */
	        SmartSuggest.prototype.getSuggestions = function(term) {

	            var self = this;

	            //escape html
	            term = lpCoreUtils.stripHtml(term);

	            //single value or 'value to value' range
	            var terms = [];
	            if(SmartSuggest.util.isRange(term)) {
	                terms = term.match(RANGE_REGEX);
	            } else {
	                terms[1] = term;
	            }

	            //iterate through suggesters accumulating suggestion results
	            var suggestions = [];
	            this.suggesters.forEach(function(suggester) {
	                var newSuggestions = suggester.suggest.call({
	                    data: suggester.data || null,
	                    type: suggester.type,
	                    options: suggester.options || {}
	                }, terms[1], terms[2]);
	                if (self.options.showTitles && newSuggestions.length > 0) {
	                    suggestions = suggestions.concat({
	                        type: SmartSuggest.types.TITLE,
	                        title: suggester.type
	                    });
	                }
	                suggestions = suggestions.concat(newSuggestions);
	            });

	            return suggestions;
	        };

	        /**
	         * Adds a suggester. Can be a built in or custom function
	         * @param suggester
	         */
	        SmartSuggest.prototype.addSuggester = function(suggester) {

	            // add suggest function from built-in list (if missing)
	            suggester = SmartSuggest.builtIn.addSuggestFunction(suggester);

	            //overwrite existing suggesters of the same type
	            var replaced = false;
	            for(var i = 0; i < this.suggesters.length && !replaced; i++) {
	                if(this.suggesters[i].type === suggester.type) {
	                    this.suggesters[i] = suggester;
	                    replaced = true;
	                }
	            }
	            if(!replaced) {
	                this.suggesters.push(suggester);
	            }

	            return this;
	        };

	        /**
	         * Remove all currently registered suggester functions
	         */
	        SmartSuggest.prototype.clearSuggesters = function() {
	            this.suggesters = [];
	        };

	        return SmartSuggest;
	    };
	    SmartSuggestFactory.$inject = ["lpCoreUtils", "SmartSuggestConfig", "SmartSuggestEngineUtil", "SmartSuggestEngineBuiltInSuggesters"];

	    module.exports.factory('SmartSuggestEngine', SmartSuggestFactory);

	}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)(module)))

/***/ },
/* 51 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/* WEBPACK VAR INJECTION */(function(module) {/*global define */
	!(__WEBPACK_AMD_DEFINE_RESULT__ = function(require, exports, module) {
	    'use strict';

	    var base = __webpack_require__(2);
	    var core = __webpack_require__(7);
	    var datesAdvanced = __webpack_require__(52);

	    var regex = __webpack_require__(53);

	    module.name = 'ui.smartsuggest-engine-util';

	    module.exports = base.createModule(module.name, [
	        core.name,
	        datesAdvanced.name
	    ]);

	    // @ngInject
	    var utilFactory = function (lpCoreUtils, SmartSuggestEngineUtilDatesAdvanced) {
	        var util = {};

	        var RANGE_REGEX = regex['RANGE_REGEX'];
	        var NUMBER_REGEX = regex['NUMBER_REGEX'];
	        //var STRIP_ACC_FORMATTING_REGEX = regex['STRIP_ACC_FORMATTING_REGEX'];

	        /***
	         *
	         * @param term
	         * @returns {boolean}
	         */
	        util.isRange = function (term) {
	            return RANGE_REGEX.test(term);
	        };

	        /**
	         * Special number parser for amounts
	         * @param toParse
	         * @returns {null}
	         */
	        util.parseAmount = function (toParse) {

	            var num = null;
	            if(toParse) {
	                var parseResult = toParse.match(NUMBER_REGEX);
	                if(parseResult && parseResult.length) {
	                    num = parseFloat(parseResult[0]);
	                }
	            }

	            return !isNaN(num) ? Math.abs(num) : null;
	        };

	        /**
	         * Return false if if the date is not a 4 digit numeric value between 1900 and 2100
	         * otherwise returns the parsed year
	         * @param toParse
	         * @returns {*}
	         */
	        util.isYearDate = function (toParse) {
	            var year = util.parseAmount(toParse);
	            return !isNaN(year) && year > 1900 && year < 2100 ? year : false;
	        };

	        /**
	         * Parses a date, with special rules for auto suggestions
	         * @param toParse
	         * @returns {*}
	         */
	        util.parseDate = function (toParse) {
	            var parsedDate;
	            var year = util.isYearDate(toParse);
	            var number = parseFloat(toParse);
	            if(year) {
	                parsedDate = new Date(year, 0, 1);
	            } else if(number <= 31) {
	                parsedDate = new Date(new Date().setDate(number));
	            } else {
	                parsedDate = null;
	            }
	            return parsedDate;
	        };

	        /**
	         * Get collection of dates based on advanced analysis
	         *
	         * @param term1
	         * @param term2
	         * @returns {Array}
	         */
	        util.getAdvancedDatesArray = function (term1, term2) {
	            return SmartSuggestEngineUtilDatesAdvanced.getDatesArray(term1, term2);
	        };

	        /**
	         *
	         * @param term
	         * @returns {*}
	         */
	        util.getDateTermSpecificity = function (term) {

	            var specificity;
	            var regexPatterns = regex.dateRegex;

	            //add year
	            var year = util.isYearDate(term);

	            //add a month
	            var month =
	                !year &&
	                (term.match(regexPatterns.jan) ||
	                term.match(regexPatterns.feb) ||
	                term.match(regexPatterns.mar) ||
	                term.match(regexPatterns.apr) ||
	                term.match(regexPatterns.may) ||
	                term.match(regexPatterns.jun) ||
	                term.match(regexPatterns.jul) ||
	                term.match(regexPatterns.aug) ||
	                term.match(regexPatterns.sep) ||
	                term.match(regexPatterns.oct) ||
	                term.match(regexPatterns.nov) ||
	                term.match(regexPatterns.dec) !== null);

	            if(year) {
	                specificity = 'year';
	            } else if(month) {
	                specificity = 'month';
	            } else {
	                specificity = 'day';
	            }

	            return specificity;
	        };

	        /**
	         * Makes a date, inclusive specific to milliseconds.
	         * E.g. Thursday will be converted to 1 millisecond before midnight Friday
	         * @param term
	         * @param date
	         * @returns {*}
	         */
	        util.makeToDateInclusive = function (term, date) {

	            var dateSpecificity = util.getDateTermSpecificity(term);

	            var timeToAdd;
	            if(dateSpecificity === 'year') {
	                timeToAdd = { years: 1 };
	            } else if(dateSpecificity === 'month') {
	                timeToAdd = { months: 1 };
	            } else {
	                timeToAdd = { days: 1 };
	            }
	            // migrate to momentjs
	            var inclusiveDate = lpCoreUtils.date(date).clone().add(timeToAdd).subtract(1, 'ms');

	            return inclusiveDate.toDate();
	        };

	        /**
	         * Util for suggesting a to amount if a user types a single amount
	         * @param from
	         * @returns {number}
	         */
	        util.predictToDate = function (term, from) {

	            var dateSpecificity = util.getDateTermSpecificity(term);

	            var timeToAdd;
	            if(dateSpecificity === 'year') {
	                timeToAdd = { years: 1 };
	            } else if(dateSpecificity === 'month') {
	                timeToAdd = { months: 1 };
	            } else {
	                timeToAdd = { weeks: 1 };
	            }

	            var predictedDate = lpCoreUtils.date(from).clone().add(timeToAdd).subtract(1, 'ms');

	            return predictedDate.toDate();
	        };

	        /**
	         * Util for creating a fuzzy range search from a single amount
	         * @param from
	         * @returns {{from: number, to: number}}
	         */
	        util.makeNumberFuzzy = function (from) {

	            var deviation = (from / 10) / 2;
	            var fuzzy = {
	                from: Math.floor(from - deviation),
	                to: Math.ceil(from + deviation)
	            };

	            return fuzzy;
	        };

	        /**
	         * Util for suggesting a to amount if a user types a single amount
	         * @param from
	         * @returns {number}
	         */
	        util.predictToAmount = function (from) {
	            var to = Math.ceil(from + (from / 2));
	            return to;
	        };

	        /**
	         * Get the name of type-dependent formatter function
	         *
	         * @param type
	         * @returns {*}
	         */
	        util.getFormatterFnName = function (type) {
	            return lpCoreUtils.camelCase('--format-' + (type || 'general'));
	        };

	        return util;
	    };
	    utilFactory.$inject = ["lpCoreUtils", "SmartSuggestEngineUtilDatesAdvanced"];

	    module.exports.factory('SmartSuggestEngineUtil', utilFactory);
	}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)(module)))

/***/ },
/* 52 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/* WEBPACK VAR INJECTION */(function(module) {/*global define */
	!(__WEBPACK_AMD_DEFINE_RESULT__ = function(require, exports, module) {
	    'use strict';

	    var base = __webpack_require__(2);
	    var core = __webpack_require__(7);

	    var regex = __webpack_require__(53);

	    module.name = 'ui.smartsuggest-engine-util-dates-advanced';

	    module.exports = base.createModule(module.name, [
	        core.name
	    ]);

	    // @ngInject
	    var datesAdvancedFactory = function () {
	        var methods = {};
	        //var DAYS_MAX = 31;
	        // var MONTHS_MAX = 12;
	        var DATE_PATTERN_SYMBOL = '-';
	        var YEAR_MAX = new Date().getFullYear();
	        // var datePatternMax = [DAYS_MAX, MONTHS_MAX, YEAR_MAX];
	        var dateRegex = regex.dateRegex;

	        /**
	         * Entry point: returns collection of dates based on analysis
	         * ----------------------------------------------------------
	         *
	         * @param term1
	         * @param term2
	         * @returns {Array}
	         */
	        methods.getDatesArray = function(term1, term2) {

	            // check if only one input param provided
	            if (term1 && !term2) {
	                return methods.getDatesSingleTerm(term1);
	            }

	            // default response
	            return [];
	        };

	        /**
	         * Get dates object in case we get only one input parameter
	         *
	         * @param term
	         * @returns {Array}
	         */
	        methods.getDatesSingleTerm = function(term) {
	            var month, res = [];

	            // not a pattern -- checking for month names
	            if (!methods.isDatePattern(term)) {

	                // check one month period (current year or previous)
	                month = methods.getMonthNumber(term);

	                if (month) {
	                    // month for Date object starts with 0, not 1 :(
	                    month -= 1;

	                    // current year (only if the month is current or already passed)
	                    if (month <= (new Date()).getMonth()) {
	                        res.push({
	                            from: new Date(YEAR_MAX, month, 1),
	                            to: new Date(YEAR_MAX, month, methods.daysInMonth(month, YEAR_MAX), 23, 59)
	                        });
	                    }

	                    // previous year
	                    res.push({
	                        from: new Date(YEAR_MAX - 1, month, 1),
	                        to: new Date(YEAR_MAX - 1, month, methods.daysInMonth(month, YEAR_MAX - 1), 23, 59)
	                    });
	                }

	            }
	            // else {
	                // TODO: handle date pattern like dd-mm-yyyy
	            // }

	            return res;
	        };

	        /**
	         * Check for date patterns like dd-mm-yyyy in input string
	         *
	         * @param term
	         * @returns {*}
	         */
	        methods.isDatePattern = function(term) {
	            var res = term.split(DATE_PATTERN_SYMBOL);
	            if (res.length < 2) {
	                // no pattern found
	                return false;
	            } else {
	                return res;
	            }
	        };

	        /**
	         * HELPER: Get Month number
	         *
	         * @param term
	         * @returns {*}
	         */
	        methods.getMonthNumber = function(term) {
	            var month = term.match(dateRegex.jan) ? 1 :
	                        term.match(dateRegex.feb) ? 2 :
	                        term.match(dateRegex.mar) ? 3 :
	                        term.match(dateRegex.apr) ? 4 :
	                        term.match(dateRegex.may) ? 5 :
	                        term.match(dateRegex.jun) ? 6 :
	                        term.match(dateRegex.jul) ? 7 :
	                        term.match(dateRegex.aug) ? 8 :
	                        term.match(dateRegex.sep) ? 9 :
	                        term.match(dateRegex.oct) ? 10 :
	                        term.match(dateRegex.nov) ? 11 :
	                        term.match(dateRegex.dec) ? 12 : false;

	            return month;
	        };

	        /**
	         * HELPER: returns number of days in particular month of the specific year
	         *
	         * @param month
	         * @param year
	         * @returns {number}
	         */
	        methods.daysInMonth = function(month, year) {
	            return 32 - new Date(year, month, 32).getDate();
	        };

	        return methods;
	    };

	    module.exports.factory('SmartSuggestEngineUtilDatesAdvanced', datesAdvancedFactory);
	}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)(module)))

/***/ },
/* 53 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/* eslint-disable */
	!(__WEBPACK_AMD_DEFINE_RESULT__ = function(require) {
	   'use strict';

	    var RANGE_REGEX = /^(.+)\sto\s?(.*)$/i;
	    var NUMBER_REGEX = /[\-+]?([0-9]*\.)?[0-9]+/;
	    var STRIP_ACC_FORMATTING_REGEX = /[\.+\s+\-]/g;
	    var dateRegex = {jan:/^jan(uary)?/i,feb:/^feb(ruary)?/i,mar:/^mar(ch)?/i,apr:/^apr(il)?/i,may:/^may/i,jun:/^jun(e)?/i,jul:/^jul(y)?/i,aug:/^aug(ust)?/i,sep:/^sep(t(ember)?)?/i,oct:/^oct(ober)?/i,nov:/^nov(ember)?/i,dec:/^dec(ember)?/i,sun:/^su(n(day)?)?/i,mon:/^mo(n(day)?)?/i,tue:/^tu(e(s(day)?)?)?/i,wed:/^we(d(nesday)?)?/i,thu:/^th(u(r(s(day)?)?)?)?/i,fri:/^fr(i(day)?)?/i,sat:/^sa(t(urday)?)?/i,future:/^next/i,past:/^last|past|prev(ious)?/i,add:/^(\+|aft(er)?|from|hence)/i,subtract:/^(\-|bef(ore)?|ago)/i,yesterday:/^yes(terday)?/i,today:/^t(od(ay)?)?/i,tomorrow:/^tom(orrow)?/i,now:/^n(ow)?/i,millisecond:/^ms|milli(second)?s?/i,second:/^sec(ond)?s?/i,minute:/^mn|min(ute)?s?/i,hour:/^h(our)?s?/i,week:/^w(eek)?s?/i,month:/^m(onth)?s?/i,day:/^d(ay)?s?/i,year:/^y(ear)?s?/i,shortMeridian:/^(a|p)/i,longMeridian:/^(a\.?m?\.?|p\.?m?\.?)/i,timezone:/^((e(s|d)t|c(s|d)t|m(s|d)t|p(s|d)t)|((gmt)?\s*(\+|\-)\s*\d\d\d\d?)|gmt|utc)/i,ordinalSuffix:/^\s*(st|nd|rd|th)/i,timeContext:/^\s*(\:|a(?!u|p)|p)/i};

	    return {
	        RANGE_REGEX: RANGE_REGEX,
	        NUMBER_REGEX: NUMBER_REGEX,
	        STRIP_ACC_FORMATTING_REGEX: STRIP_ACC_FORMATTING_REGEX,
	        dateRegex: dateRegex
	    };
	}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 54 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/* WEBPACK VAR INJECTION */(function(module) {/*global define */
	!(__WEBPACK_AMD_DEFINE_RESULT__ = function(require, exports, module) {
	    'use strict';

	    var base = __webpack_require__(2);
	    var core = __webpack_require__(7);

	    var config = __webpack_require__(55);
	    var util = __webpack_require__(51);
	    var regex = __webpack_require__(53);

	    module.name = 'ui.smartsuggest-engine-built-in-suggesters';

	    module.exports = base.createModule(module.name, [
	        core.name,
	        util.name,
	        config.name
	    ]);

	    var STRIP_ACC_FORMATTING_REGEX = regex['STRIP_ACC_FORMATTING_REGEX'];

	    // @ngInject
	    var builtInFactory = function (lpCoreUtils, SmartSuggestConfig, SmartSuggestEngineUtil) {
	        var builtIn = {};
	        var types = SmartSuggestConfig.TYPES;
	        var getSuggesterFnName = function (type) {
	            return lpCoreUtils.camelCase('--get-' + (type || 'general') + '-suggestions');
	        };

	        /**
	         * HELPER: Add a built-in suggest function to suggester
	         *
	         * @param suggester
	         * @returns {*}
	         */
	        builtIn.addSuggestFunction = function(suggester) {

	            // no suggest function provided -- adding here from built-in list
	            if (typeof suggester.suggest !== 'function') {
	                suggester.suggest = builtIn[getSuggesterFnName(suggester.type)];
	            }

	            // Comment: if the 'suggest' function is already in suggester, then we rely on it
	            // and presume it is ok (no validation for now)

	            return suggester;
	        };

	        // DATE
	        builtIn.getDateSuggestions = function(term1, term2) {
	            var self = this;
	            var suggestions = [];

	            var from = SmartSuggestEngineUtil.parseDate(term1);
	            var to = SmartSuggestEngineUtil.parseDate(term2);

	            //if user this is not a displayAsRange search, i.e. search on specific day or month, 'July'
	            if(from && !to) {
	                to = SmartSuggestEngineUtil.makeToDateInclusive(term1, from);
	                suggestions.push({
	                    terms: [term1, term2],
	                    type: this.type || types.DATE,
	                    displayAsRange: false,
	                    search: {
	                        from: from,
	                        to: to
	                    }
	                });
	            }

	            var predicted = false;
	            //always provide a range suggestion (predicted or user specified)
	            if(from) {
	                if(!term2 || (to && from.getTime() > to.getTime())) {
	                    to = SmartSuggestEngineUtil.predictToDate(term1, from);
	                    predicted = true;
	                } else {
	                    to = SmartSuggestEngineUtil.makeToDateInclusive(term2, to);
	                }
	                if(from.getTime() < to.getTime()) {
	                    suggestions.push({
	                        terms: [term1, term2],
	                        type: this.type,
	                        displayAsRange: true,
	                        predicted: predicted,
	                        search: {
	                            from: from,
	                            to: to
	                        }
	                    });
	                }
	            }

	            // Advanced Date suggestions
	            var dates = SmartSuggestEngineUtil.getAdvancedDatesArray(term1, term2) || [];
	            dates.forEach(function (item) {
	                if (lpCoreUtils.isDate(item.from)) {
	                    suggestions.push({
	                        terms: [term1, term2],
	                        type: self.type,
	                        displayAsRange: lpCoreUtils.isDate(item.to) ? true : false,
	                        search: {
	                            from: item.from,
	                            to: item.to
	                        }
	                    });
	                }
	            });

	            return suggestions;
	        };

	        // AMOUNT
	        builtIn.getAmountSuggestions = function(term1, term2) {

	            var suggestions = [];

	            var from = SmartSuggestEngineUtil.parseAmount(term1);
	            var to = SmartSuggestEngineUtil.parseAmount(term2);

	            //if user this is not a range search, make it a fuzzy range
	            if(from && !to) {
	                var fuzzyRange = SmartSuggestEngineUtil.makeNumberFuzzy(from);
	                suggestions.push({
	                    terms: [term1, term2],
	                    type: this.type || types.AMOUNT,
	                    displayAsRange: false,
	                    search: {
	                        original: from,
	                        from: fuzzyRange.from,
	                        to: fuzzyRange.to
	                    }
	                });
	            }

	            var predicted = false;
	            //always provide a range suggestion (predicted or user specified)
	            if(from) {
	                //if it is a range suggestion predict the to number
	                if(!term2 || (to && from > to)) {
	                    to = SmartSuggestEngineUtil.predictToAmount(from);
	                    predicted = true;
	                }
	                if(from < to) {
	                    suggestions.push({
	                        terms: [term1, term2],
	                        type: this.type,
	                        displayAsRange: true,
	                        predicted: predicted,
	                        search: {
	                            from: from,
	                            to: to
	                        }
	                    });
	                }
	            }
	            return suggestions;
	        };

	        // ACCOUNT
	        builtIn.getAccountSuggestions = function(term){
	            var self = this,
	                suggestions = [],
	                accounts = this.data || [];

	            if(term.length < 2 && !this.options.showAll) {
	                return suggestions;
	            }

	            accounts.forEach(function(account) {

	                var nameRegex = new RegExp('(' + term + ')', 'ig');
	                var nameMatch = account.name.match(nameRegex);
	                var bbanMatch = false;

	                if(!nameMatch) {
	                    var unformattedTerm = term.replace(STRIP_ACC_FORMATTING_REGEX, '');
	                    var accountRegex = new RegExp('^(' + unformattedTerm + ')', 'i');
	                    bbanMatch = (account.bban + '').match(accountRegex);
	                }
	                if((term.length < 2 && self.options.showAll) || nameMatch || bbanMatch) {
	                    suggestions.push({
	                        terms: [ term ],
	                        type: self.type || types.ACCOUNT,
	                        matchType: bbanMatch ? 'number' : 'name',
	                        account: account,
	                        search: {
	                            account: account.id
	                        }
	                    });
	                }
	            });

	            return suggestions;
	        };

	        // CONTACT
	        builtIn.getContactSuggestions = function(term) {

	            var self = this;
	            var suggestions = [];

	            if(term.length < 2 && !this.options.showAll) {
	                return suggestions;
	            }

	            var contacts = this.data || [];
	            contacts.forEach(function(contact) {
	                var nameRegex = new RegExp('(' + term + ')', 'ig');
	                var nameMatch = lpCoreUtils.isString(contact.name) && contact.name.match(nameRegex);
	                var accountMatch = false;
	                if(!nameMatch) {
	                    var unformattedTerm = term.replace(STRIP_ACC_FORMATTING_REGEX, '');
	                    var accountRegex = new RegExp('^(' + unformattedTerm + ')', 'i');
	                    accountMatch = contact.account && (contact.account + '').match(accountRegex);
	                }
	                if((term.length < 2 && self.options.showAll) || nameMatch || accountMatch) {
	                    suggestions.push({
	                        terms: [ term ],
	                        type: self.type || types.CONTACT,
	                        matchType: accountMatch ? 'account' : 'name',
	                        contact: contact,
	                        search: {
	                            contact: contact.account
	                        }
	                    });
	                }
	            });

	            return suggestions;
	        };

	        // CATEGORY
	        builtIn.getCategorySuggestions = function(rawTerm) {
	            var self = this;

	            var suggestions = [];
	            var categories = self.data || [];
	            var terms = rawTerm.split(',');
	            var minTermLength = 2;

	            var matches = [];
	            var ids = [];

	            var matchCategory = function(aTerms, categoryName) {
	                var matched = false;

	                aTerms.forEach(function(term) {
	                    if(term.length >= minTermLength && categoryName.toLowerCase().indexOf(term.toLowerCase()) === 0) {
	                        matched = true;
	                    }
	                });

	                return matched;
	            };

	            categories.forEach(function(category) {
	                if(matchCategory(terms, category.name)) {
	                    matches.push(category);
	                    ids.push(category.id);
	                }
	            });

	            if(ids.length >= 1) {
	                suggestions.push({
	                    terms: [terms],
	                    type: self.type || types.CATEGORY,
	                    category: matches, // matched categories
	                    search: {
	                        category: ids.join(',') // category ids
	                    }
	                });
	            }


	            return suggestions;
	        };

	        // GENERAL
	        builtIn.getGeneralSuggestions = function(term1, term2) {

	            var suggestions = [];

	            var term = term2 ? term1 + ' to ' + term2 : term1;

	            if(term.length >= 2) {
	                if(!SmartSuggestEngineUtil.isRange(term)) {
	                    suggestions.push({
	                        terms: [ term ],
	                        type: this.type || types.GENERAL,
	                        search: {
	                            query: term
	                        }
	                    });
	                }
	            }

	            return suggestions;
	        };

	        return builtIn;
	    };
	    builtInFactory.$inject = ["lpCoreUtils", "SmartSuggestConfig", "SmartSuggestEngineUtil"];

	    module.exports.factory('SmartSuggestEngineBuiltInSuggesters', builtInFactory);

	}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)(module)))

/***/ },
/* 55 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/* WEBPACK VAR INJECTION */(function(module) {/*global define */
	!(__WEBPACK_AMD_DEFINE_RESULT__ = function(require, exports, module) {
	    'use strict';

	    var base = __webpack_require__(2);
	    var core = __webpack_require__(7);

	    module.name = 'ui.smartsuggest-engine-config';

	    module.exports = base.createModule(module.name, [
	        core.name
	    ]);

	    /////////////////////
	    //   Main Config   //
	    /////////////////////
	    var list = {
	        DATE: {
	            type: 'date',
	            label: 'On',
	            icon: 'lp-icon-calendar'
	        },
	        AMOUNT: {
	            type: 'amount',
	            label: 'Of',
	            icon: 'lp-icon-transactions-v1'
	        },
	        ACCOUNT: {
	            type: 'account',
	            label: 'Account',
	            icon: 'lp-icon-search2'
	        },
	        CONTACT: {
	            type: 'contact',
	            label: 'Contact',
	            icon: 'lp-icon-search2'
	        },
	        CATEGORY: {
	            type: 'category',
	            label: 'Category',
	            icon: 'lp-icon-tag'
	        },
	        GENERAL: {
	            type: 'general',
	            label: 'Description',
	            icon: 'lp-icon-search2'
	        },
	        TITLE: {
	            type: 'title',
	            label: ''
	        }
	    };

	    // Factory function
	    // ----------------
	    // @ngInject
	    var configFactory = function (lpCoreUtils) {

	        /**
	         * Get an object with same keys, but with single property as a value
	         *
	         * @param prop
	         * @returns {Object}
	         */
	        var getByValue = function(prop) {
	            return lpCoreUtils.mapValues(list, function(n) {
	                return n[prop];
	            });
	        };

	        /**
	         * Get an object where different properties create key-value object
	         *
	         * @param keyName
	         * @param valueName
	         * @returns {Object}
	         */
	        var getValuesPairs = function(keyName, valueName) {
	            var res = {};
	            var keys = lpCoreUtils.pluck(list, keyName);
	            var values = lpCoreUtils.pluck(list, valueName);

	            lpCoreUtils.forEach(keys, function(k, index) {
	                res[k] = values[index];
	            });

	            return res;
	        };

	        /**
	         * Helper method, allowing customize properties in config lists for the respective type
	         *
	         * @param {Object} targetList
	         * @param {String} type
	         * @param {String} propName
	         * @param {String} newValue
	         * @returns {boolean}
	         */
	        var updateProp = function(targetList, type, propName, newValue) {
	            if (lpCoreUtils.isObject(targetList)
	                && lpCoreUtils.isObject(targetList[type])
	                && lpCoreUtils.isString(propName)
	                && lpCoreUtils.isString(newValue)) {

	                // update value
	                targetList[type][propName] = newValue;
	                return true;
	            } else {

	                // TODO: log properly
	                console.warn('updateProp: input arguments validation failed...');
	                return false;
	            }
	        };

	        // get config with types only
	        var getTypes = function() {
	            return getByValue('type');
	        };

	        // get type-label object
	        var getLabelsByType = function() {
	            return getValuesPairs('type', 'label');
	        };

	        // get type-iconClassName object
	        var getIconsByType = function() {
	            return getValuesPairs('type', 'icon');
	        };

	        // Lists to be shared
	        var TYPES = getTypes(), LABELS = getLabelsByType(), ICONS = getIconsByType();

	        // Update lists (to apply recent changes)
	        var updateLists = function () {
	            TYPES = getTypes();
	            LABELS = getLabelsByType();
	            ICONS = getIconsByType();
	        };

	        // update icon class name in a Config
	        var updateIcon = function(targetList, type, iconClassName) {
	            if (updateProp(targetList, type, 'icon', iconClassName)) {
	                updateLists();
	            }
	        };

	        // update label name in a Config
	        var updateLabel = function(targetList, type, newLabelValue) {
	            if (updateProp(targetList, type, 'label', newLabelValue)) {
	                updateLists();
	            }
	        };

	        // update type name in a Config
	        var updateType = function(targetList, type, newTypeValue) {
	            if (updateProp(targetList, type, 'type', newTypeValue)) {
	                updateLists();
	            }
	        };

	        /**
	         * Add new Config prop (not to overwrite existing ones)
	         *
	         * @param {String} prop
	         * @param {Object} item
	         */
	        var addConfigItem = function(prop, item) {
	            if (lpCoreUtils.isObject(item) && lpCoreUtils.isString(item.type) && !list[prop]) {

	                // add new config item
	                list[prop] = item;

	                // update lists
	                updateLists();
	            } else {
	                // TODO: log properly
	                console.warn('addConfigItem: input arguments validation failed...');
	            }
	        };

	        // API
	        return {
	            TYPES: TYPES,
	            LABELS: LABELS,
	            ICONS: ICONS,
	            addConfigItem: addConfigItem,
	            updateConfigIcon: updateIcon,
	            updateConfigLabel: updateLabel,
	            updateConfigType: updateType
	        };
	    };
	    configFactory.$inject = ["lpCoreUtils"];

	    module.exports.factory('SmartSuggestConfig', configFactory);
	}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)(module)))

/***/ },
/* 56 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/* WEBPACK VAR INJECTION */(function(module) {/*global define */
	!(__WEBPACK_AMD_DEFINE_RESULT__ = function(require, exports, module) {
	    'use strict';

	    var base = __webpack_require__(2);
	    var core = __webpack_require__(7);

	    module.name = 'ui.smartsuggest-formatter'; // launchpad/lib/ui/smartsuggest-formatter

	    module.exports = base.createModule(module.name, [
	        core.name
	    ]);

	    // @ngInject
	    module.exports.factory('SmartSuggestFormatter', ["SmartSuggestEngine", "lpCoreI18n", "lpCoreUtils", function(SmartSuggestEngine, lpCoreI18n, lpCoreUtils) {

	        // shrotcut to getter function from util
	        var getFormatterFnName = SmartSuggestEngine.util.getFormatterFnName;

	        /**
	         * CONSTRUCTOR
	         *
	         * @param locale
	         * @constructor
	         */
	        var SmartSuggestFormatter = function(options) {
	            this.locale = options.locale || null;
	            this.currency = options.currency || null;
	        };

	        /**
	         * Adds custom formatter.
	         * ----------------------
	         * Adds a new formatter of a certain type (or OVERWRITES existing of the type provided)
	         *
	         * @param type {string}
	         * @param formatter {function}
	         */
	        SmartSuggestFormatter.prototype.addFormatter = function(type, formatter) {
	            if (lpCoreUtils.isString(type) && lpCoreUtils.isFunction(formatter)) {
	                SmartSuggestFormatter.prototype[getFormatterFnName(type)] = formatter;
	            } else {
	                // TODO: add proper validation error handling
	                console.log('addFormatter: input arguments validation failure');
	            }
	        };

	        /**
	         *
	         */
	        SmartSuggestFormatter.prototype.format = function(suggestion) {

	            var values = [];

	            if(suggestion.displayAsRange) {
	                values[0] = this.formatValue(suggestion.search.from, suggestion.type);
	                values[1] = this.formatValue(suggestion.search.to, suggestion.type);
	            } else if(suggestion.type === SmartSuggestEngine.types.DATE) {
	                values[0] = this.formatValue(suggestion.search.from, suggestion.type);
	            } else if(suggestion.type === SmartSuggestEngine.types.AMOUNT) {
	                values[0] = this.formatValue(suggestion.search.original, suggestion.type);
	            } else if(suggestion.type === SmartSuggestEngine.types.CONTACT) {
	                values[0] = this.formatValue(suggestion.contact.name, suggestion.type);
	                values[1] = this.formatValue(suggestion.contact.account, suggestion.type);
	            } else if(suggestion.type === SmartSuggestEngine.types.CATEGORY) {
	                values[0] = this.formatValue(suggestion.category, suggestion.type);
	            } else if(suggestion.type === SmartSuggestEngine.types.ACCOUNT) {
	                values[0] = this.formatValue(suggestion.account.name, suggestion.type);
	                values[1] = this.formatValue(suggestion.account.iban, suggestion.type);
	                values[2] = this.formatAmount(suggestion.account.balance, suggestion.account.currency);
	            } else if(suggestion.type === SmartSuggestEngine.types.TITLE) {
	                values[0] = this.formatValue(suggestion.title, suggestion.type);
	            } else {
	                values[0] = this.formatValue(suggestion.search.query, suggestion.type);
	            }

	            values = lpCoreUtils.map(values, lpCoreUtils.stripHtml);

	            return values;
	        };

	        /**
	         * Format value, other then money amount
	         *
	         * IMPORTANT: formatter function name should be the following format: "formatType",
	         *            where Type is your suggester type (like 'date', 'contact', etc.)
	         *
	         * @param value
	         * @param type
	         * @returns {*}
	         */
	        SmartSuggestFormatter.prototype.formatValue = function(value, type) {
	            return lpCoreUtils.isFunction(this[getFormatterFnName(type)]) ? this[getFormatterFnName(type)](value) : value;
	        };

	        /**
	         * Format money amount (not a type-dependent)
	         *
	         * @param value
	         * @returns {*}
	         */
	        SmartSuggestFormatter.prototype.formatAmount = function(value, currency) {
	            return lpCoreI18n.formatCurrency(value, currency || this.currency);
	        };

	        /**
	         *
	         * @param value
	         * @returns {*}
	         */
	        SmartSuggestFormatter.prototype.formatDate = function(value) {
	            return lpCoreI18n.formatDate(value);
	        };

	        SmartSuggestFormatter.prototype.formatAccount = function(value) {
	            return value.name;
	        };

	        SmartSuggestFormatter.prototype.formatCategory = function(value) {
	            var categories = value;

	            return categories.map(function(category) {
	                return category.name;
	            }).join(', ');
	        };

	        /**
	         *
	         * @param value
	         * @returns {*}
	         */
	        SmartSuggestFormatter.prototype.formatGeneral = function(value) {
	            return value;
	        };

	        SmartSuggestFormatter.prototype.formatTitle = function(value) {
	            switch (value) {
	                case SmartSuggestEngine.types.ACCOUNT:
	                    return 'My accounts';
	                case SmartSuggestEngine.types.CONTACT:
	                    return 'Address Book';
	            }
	            return value;
	        };

	        /**
	         *
	         * @param suggestion
	         * @returns {*}
	         */
	        SmartSuggestFormatter.prototype.getTypeLabel = function(suggestion) {
	            var label;

	            if(suggestion.displayAsRange) {
	                label = 'Between';
	            } else {
	                label = SmartSuggestEngine.labels[suggestion.type] || 'Description';
	            }

	            return lpCoreI18n.instant(label) + ': ';
	        };

	        /**
	         * Returns icon classes set
	         *
	         * @param suggestion
	         * @returns {*}
	         */
	        SmartSuggestFormatter.prototype.getSuggestionIcon = function(suggestion, small) {
	            return 'lp-icon lp-icon-' + (small ? 'small' : 'medium') + ' ' + SmartSuggestEngine.icons[suggestion.type];
	        };

	        /**
	         *
	         * @param suggestion
	         * @returns {string}
	         */
	        SmartSuggestFormatter.prototype.getSuggestionHtml = function(suggestion) {

	            var htmlClass = 'lp-smartsuggest-' + suggestion.type;
	            var values = this.format(suggestion);

	            var html = '<div class="lp-smartsuggest-result clearfix ' + htmlClass + '">';
	            var predictedClass = suggestion.predicted ? 'lp-smartsuggest-predicted' : '';

	            //image
	            if(suggestion.type !== SmartSuggestEngine.types.ACCOUNT && suggestion.type !== SmartSuggestEngine.types.TITLE){
	                html += '<span class="lp-smartsuggest-icon">';
	                if(suggestion.type === SmartSuggestEngine.types.CONTACT && typeof suggestion.contact.photoUrl === 'string') {
	                    html += '<img src="' + decodeURIComponent(suggestion.contact.photoUrl) + '" width="35" height="35">';
	                } else if(suggestion.type === SmartSuggestEngine.types.CONTACT && suggestion.contact.initials) {
	                    html += '<span class="lp-smartsuggest-intials">' + suggestion.contact.initials + '</span>';
	                } else {
	                    var iconClass = this.getSuggestionIcon(suggestion);
	                    html += '<i class="' + iconClass + '"></i>';
	                }
	                html += '</span>';
	            }

	            html += '<div class="lp-smartsuggest-valuegroup">';
	            if(!suggestion.contact && !suggestion.account) {
	                html += '<span class="lp-smartsuggest-category">' + this.getTypeLabel(suggestion) + '</span>';
	            }
	            //formatting for contacts
	            if(suggestion.contact) {
	                html += '<span class="lp-smartsuggest-value ' + htmlClass + '-value">' + values[0] + '</span><br>';
	                html += '<span class="' + htmlClass + '-value">' + values[1] + '</span>';
	            } else if (suggestion.account) {
	                html += '<div class="lp-smartsuggest-value ' + htmlClass + '-value">' + values[0] + '</div>';
	                html += '<div><small class="' + htmlClass + '-value pull-left muted">' + values[1] + '</small>';
	                html += '<span class="' + htmlClass + '-value pull-right">' + values[2] + '</span></div>';
	            }
	            //formatting for ranges
	            else if(values.length === 2) {
	                html += '<span class="lp-smartsuggest-from lp-smartsuggest-value ' + htmlClass + '-value">' + values[0] + '</span> ' + lpCoreI18n.instant('to');
	                html += ' <span class="lp-smartsuggest-to lp-smartsuggest-value ' + htmlClass + '-value ' + predictedClass + '">' + values[1] + '</span>';

	                //formatting for single values
	            } else {
	                html += '<span class="lp-smartsuggest-value ' + htmlClass + '-value">' + values[0] + '</span>';
	            }
	            html += '</div>';
	            html += '</div>';

	            return html;
	        };

	        return SmartSuggestFormatter;
	    }]);
	}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)(module)))

/***/ },
/* 57 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/* WEBPACK VAR INJECTION */(function(module) {!(__WEBPACK_AMD_DEFINE_RESULT__ = function(require, exports, module) {
	    'use strict';

	    module.name = 'ui.touch';

	    var base = __webpack_require__(2);

	    module.exports = base.createModule(module.name, [])
	    .directive(__webpack_require__(58).directives);
	}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)(module)))

/***/ },
/* 58 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports, module) {

	    'use strict';

	    var Hammer = __webpack_require__(59);

	    /**
	     * Supported directives
	     * define Hammerjs EVENTS/RECOGNIZERS and turn them into angularjs directives
	     * http://hammerjs.github.io/getting-started/
	     * use them as human-case directive
	     * FOR Example <div on-swipe="mySwipeHandler">
	     */
	    // Hammer 2.x GestureEvents
	    var gestureDirectivesNames = [
	        // pan/drag events
	        'onPan', 'onPanUp', 'onPanDown', 'onPanLeft', 'onPanRight', 'onPanStart', 'onPanEnd', 'onPanMove', 'onPanCancel',
	        // swipe events
	        'onSwipe', 'onSwipeUp', 'onSwipeDown', 'onSwipeLeft', 'onSwipeRight',
	        // pinch events
	        'onPinch', 'onPinchIn', 'onPinchOut', 'onPinchStart', 'onPinchEnd', 'onPinchMove', 'onPinchCancel',
	        // rotate events
	        'onRotate', 'onRotateMove', 'onRotateStart', 'onRotateEnd', 'onRotateCancel',
	        // tap/press events
	        'onTap', 'onPress'
	    ];

	    // Store all Directives under a directives object
	    var directives = {};

	    /**
	     * Linking method attach touch event only if the window supports touch events
	     * @param  {string} dirName Directive name for example onSwipe... etc.
	     * @return {array}         angularjs directive
	     */
	    function linkGestureDirective(dirName) {

	        var isTouch = ('ontouchstart' in window);

	        return ['$parse', function ($parse) {

	            var eventType = dirName.substr(2).toLowerCase();

	            return {
	                link: function(scope, element, attrs) {

	                    var gesture,
	                        mc = element.data('touch'),
	                        fn = $parse(attrs[dirName]),
	                        opts = $parse(attrs.onGestureOptions)(scope, {}),
	                        listener;

	                    listener = function (ev) {
	                        scope.$apply(function () {
	                            fn(scope, {$event: event, $element: element});
	                        });
	                    };

	                    // creatxe only one instance;
	                    if (typeof Hammer !== 'undefined' && isTouch) {

	                        if (!mc) {
	                            mc = new Hammer(element[0], opts);
	                            element.data('touch', mc);
	                        }

	                        gesture = mc.on(eventType, listener);

	                        scope.$on('$destroy', function () {
	                            gesture.off(eventType, listener);
	                        });
	                    }

	                }
	            };
	        }];
	    }

	    gestureDirectivesNames.forEach(function (dirName) {
	        directives[dirName] = linkGestureDirective(dirName);
	    });

	    exports.directives = directives;

	}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 59 */
/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_59__;

/***/ },
/* 60 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/* WEBPACK VAR INJECTION */(function(module) {!(__WEBPACK_AMD_DEFINE_RESULT__ = function(require, exports, module) {
	    'use strict';

	    module.name = 'ui.placeholder';

	    var base = __webpack_require__(2);

	    // Plugin needed for placeholder
	    __webpack_require__(61);

	    var deps = [];

	    module.exports = base.createModule(module.name, deps)
	        .directive( __webpack_require__(62) );
	}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)(module)))

/***/ },
/* 61 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/* eslint-disable */
	/*! http://mths.be/placeholder v2.1.1 by @mathias */
	(function(factory) {
		if (true) {
			// AMD
			!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(49)], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory), __WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? (__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
		} else {
			// Browser globals
			factory(window.jQuery);
		}
	}(function($) {


		// Opera Mini v7 doesn't support placeholder although its DOM seems to indicate so
		var isOperaMini = Object.prototype.toString.call(window.operamini) == '[object OperaMini]';
		var isInputSupported = 'placeholder' in document.createElement('input') && !isOperaMini;
		var isTextareaSupported = 'placeholder' in document.createElement('textarea') && !isOperaMini;
		var valHooks = $.valHooks;
		var propHooks = $.propHooks;
		var hooks;
		var placeholder;

		if (isInputSupported && isTextareaSupported) {

			placeholder = $.fn.placeholder = function() {
				return this;
			};

			placeholder.input = placeholder.textarea = true;

		} else {

			var settings = {};

			placeholder = $.fn.placeholder = function(options) {

				var defaults = {customClass: 'placeholder'};
				settings = $.extend({}, defaults, options);

				var $this = this;
				$this
					.filter((isInputSupported ? 'textarea' : ':input') + '[placeholder]')
					.not('.'+settings.customClass)
					.bind({
						'focus.placeholder': clearPlaceholder,
						'blur.placeholder': setPlaceholder
					})
					.data('placeholder-enabled', true)
					.trigger('blur.placeholder');
				return $this;
			};

			placeholder.input = isInputSupported;
			placeholder.textarea = isTextareaSupported;

			hooks = {
				'get': function(element) {
					var $element = $(element);

					var $passwordInput = $element.data('placeholder-password');
					if ($passwordInput) {
						return $passwordInput[0].value;
					}

					return $element.data('placeholder-enabled') && $element.hasClass(settings.customClass) ? '' : element.value;
				},
				'set': function(element, value) {
					var $element = $(element);

					var $passwordInput = $element.data('placeholder-password');
					if ($passwordInput) {
						return $passwordInput[0].value = value;
					}

					if (!$element.data('placeholder-enabled')) {
						return element.value = value;
					}
					if (value === '') {
						element.value = value;
						// Issue #56: Setting the placeholder causes problems if the element continues to have focus.
						if (element != safeActiveElement()) {
							// We can't use `triggerHandler` here because of dummy text/password inputs :(
							setPlaceholder.call(element);
						}
					} else if ($element.hasClass(settings.customClass)) {
						clearPlaceholder.call(element, true, value) || (element.value = value);
					} else {
						element.value = value;
					}
					// `set` can not return `undefined`; see http://jsapi.info/jquery/1.7.1/val#L2363
					return $element;
				}
			};

			if (!isInputSupported) {
				valHooks.input = hooks;
				propHooks.value = hooks;
			}
			if (!isTextareaSupported) {
				valHooks.textarea = hooks;
				propHooks.value = hooks;
			}

			$(function() {
				// Look for forms
				$(document).delegate('form', 'submit.placeholder', function() {
					// Clear the placeholder values so they don't get submitted
					var $inputs = $('.'+settings.customClass, this).each(clearPlaceholder);
					setTimeout(function() {
						$inputs.each(setPlaceholder);
					}, 10);
				});
			});

			// Clear placeholder values upon page reload
			$(window).bind('beforeunload.placeholder', function() {
				$('.'+settings.customClass).each(function() {
					this.value = '';
				});
			});

		}

		function args(elem) {
			// Return an object of element attributes
			var newAttrs = {};
			var rinlinejQuery = /^jQuery\d+$/;
			$.each(elem.attributes, function(i, attr) {
				if (attr.specified && !rinlinejQuery.test(attr.name)) {
					newAttrs[attr.name] = attr.value;
				}
			});
			return newAttrs;
		}

		function clearPlaceholder(event, value) {
			var input = this;
			var $input = $(input);
			if (input.value == $input.attr('placeholder') && $input.hasClass(settings.customClass)) {
				if ($input.data('placeholder-password')) {
					$input = $input.hide().nextAll('input[type="password"]:first').show().attr('id', $input.removeAttr('id').data('placeholder-id'));
					// If `clearPlaceholder` was called from `$.valHooks.input.set`
					if (event === true) {
						return $input[0].value = value;
					}
					$input.focus();
				} else {
					input.value = '';
					$input.removeClass(settings.customClass);
					input == safeActiveElement() && input.select();
				}
			}
		}

		function setPlaceholder() {
			var $replacement;
			var input = this;
			var $input = $(input);
			var id = this.id;
			if (input.value === '') {
				if (input.type === 'password') {
					if (!$input.data('placeholder-textinput')) {
						try {
							$replacement = $input.clone().attr({ 'type': 'text' });
						} catch(e) {
							$replacement = $('<input>').attr($.extend(args(this), { 'type': 'text' }));
						}
						$replacement
							.removeAttr('name')
							.data({
								'placeholder-password': $input,
								'placeholder-id': id
							})
							.bind('focus.placeholder', clearPlaceholder);
						$input
							.data({
								'placeholder-textinput': $replacement,
								'placeholder-id': id
							})
							.before($replacement);
					}
					$input = $input.removeAttr('id').hide().prevAll('input[type="text"]:first').attr('id', id).show();
					// Note: `$input[0] != input` now!
				}
				$input.addClass(settings.customClass);
				$input[0].value = $input.attr('placeholder');
			} else {
				$input.removeClass(settings.customClass);
			}
		}

		function safeActiveElement() {
			// Avoid IE9 `document.activeElement` of death
			// https://github.com/mathiasbynens/jquery-placeholder/pull/99
			try {
				return document.activeElement;
			} catch (exception) {}
		}

	}));


/***/ },
/* 62 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_RESULT__ = function(require, exports, module) {
	    'use strict';

	    var $ = window.jQuery;

	    // @ngInject
	    exports.placeholder = function($timeout) {
	        return {
	            restrict: 'A',
	            link: function (scope, element, attrs) {
	                var placeholder = attrs.placeholder;
	                if (placeholder) {
	                    $timeout(function() {
	                        $(element).placeholder();
	                    }, 0, false);
	                }
	            }
	        };
	    };
	    exports.placeholder.$inject = ["$timeout"];
	}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 63 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/* WEBPACK VAR INJECTION */(function(module) {!(__WEBPACK_AMD_DEFINE_RESULT__ = function(require, exports, module) {
	    'use strict';

	    module.name = 'ui.color-picker';

	    var base = __webpack_require__(2);

	    var deps = [];

	    module.exports = base.createModule(module.name, deps)
	        .constant( __webpack_require__(64) )
	        .directive( __webpack_require__(65) );
	}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)(module)))

/***/ },
/* 64 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_RESULT__ = function(require, exports, module) {
	    'use strict';

	    exports.COLORS = [
	        { name: 'Cantaloupe', value: '#FFD479' },
	        { name: 'Honeydew', value: '#D4FB79' },
	        { name: 'Spindrift', value: '#73FCD6' },
	        { name: 'Sky', value: '#76D6FF' },
	        { name: 'Lavender', value: '#D783FF' },
	        { name: 'Carnation', value: '#FF8AD8' },
	        { name: 'Licorice', value: '#000000' },
	        { name: 'Snow', value: '#FFFFFF' },
	        { name: 'Salmon', value: '#FF7E79' },
	        { name: 'Banana', value: '#FFFC79' },
	        { name: 'Flora', value: '#73FA79' },
	        { name: 'Ice', value: '#73FDFF' },
	        { name: 'Orchid', value: '#7A81FF' },
	        { name: 'Bubblegum', value: '#FF85FF' },
	        { name: 'Lead', value: '#212121' },
	        { name: 'Mercury', value: '#EBEBEB' },
	        { name: 'Tangerine', value: '#FF9300' },
	        { name: 'Lime', value: '#8EFA00' },
	        { name: 'Sea Foam', value: '#00FA92' },
	        { name: 'Aqua', value: '#0096FF' },
	        { name: 'Grape', value: '#9437FF' },
	        { name: 'Strawberry', value: '#FF2F92' },
	        { name: 'Tungsten', value: '#424242' },
	        { name: 'Silver', value: '#D6D6D6' },
	        { name: 'Maraschino', value: '#FF2600' },
	        { name: 'Lemon', value: '#FFFB00' },
	        { name: 'Spring', value: '#00F900' },
	        { name: 'Turquoise', value: '#00FDFF' },
	        { name: 'Blueberry', value: '#0433FF' },
	        { name: 'Iron', value: '#5E5E5E' },
	        { name: 'Magnesium', value: '#C0C0C0' },
	        { name: 'Mocha', value: '#945200' },
	        { name: 'Fern', value: '#4F8F00' }
	    ];
	}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 65 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_RESULT__ = function(require, exports, module) {
	    'use strict';

	    // @ngInject
	    exports.lpColorPicker = function($timeout, COLORS) {
	        function lpColorPickerCtrl(scope, el, attrs) {
	            scope.colors = COLORS;

	            // focus first color
	            $timeout(function() {
	                el.find('li')[0].focus();
	            }, 0);

	            scope.keyDown = function(event, color) {
	                if (event.which === 13 || event.which === 32) {
	                    event.preventDefault();
	                    event.stopPropagation();

	                    scope.selectColor(color);
	                }
	            };
	        }

	        var tmpl = [
	            '<ul class="color-picker clearfix">',
	                '<li ng-repeat="color in colors" tabIndex="0" class="color cursor-pointer" title="{{color.name}}" ng-click="selectColor(color.value)" ng-keydown="keyDown($event, color.value)">',
	                    '<div ng-style="{\'background-color\':color.value}"></div>',
	                '</li>',
	            '</ul>'
	        ].join('');

	        function compileFn() {
	            return lpColorPickerCtrl;
	        }

	        return {
	            scope: {
	                selectColor: '='
	            },
	            restrict: 'AE',
	            compile: compileFn,
	            template: tmpl
	        };
	    };
	    exports.lpColorPicker.$inject = ["$timeout", "COLORS"];
	}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 66 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/* WEBPACK VAR INJECTION */(function(module) {!(__WEBPACK_AMD_DEFINE_RESULT__ = function(require, exports, module) {
	    'use strict';

	    var base = __webpack_require__(2);

	    module.name = 'ui.infinite-scroll';

	    module.exports = base.createModule(module.name, [])
	        .directive( __webpack_require__(67) );
	}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)(module)))

/***/ },
/* 67 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_RESULT__ = function(require, exports, module) {
	    'use strict';

	    // @ngInject
	    exports.lpInfiniteScroll = function($parse) {
	        function linkFn(scope, element, attr) {
	            var raw = element[0];
	            var isDisabled = $parse(attr.lpInfiniteScrollDisabled);
	            var isEnd = $parse(attr.lpInfiniteScrollEnd);

	            var handler = function(event) {
	                var scrollTop, yMax;
	                var disabled = isDisabled(scope);
	                if ( !isEnd(scope) ) {
	                    if (!disabled) {
	                        scrollTop = raw.scrollTop;
	                        yMax = raw.scrollHeight - raw.offsetHeight;
	                        if (scrollTop === yMax) {
	                            scope.$apply(attr.lpInfiniteScroll);
	                        }
	                    }
	                }
	            };

	            var wheelHandler = function(event) {
	                var scrollTop, yMax;

	                if( !isEnd(scope) ) {
	                    scrollTop = raw.scrollTop;
	                    yMax = raw.scrollHeight - raw.offsetHeight;
	                    if (scrollTop === yMax) {
	                        return isDisabled(scope) ? undefined : event.preventDefault();
	                    }
	                }
	            };

	            scope.$on('$destroy', function() {
	                element.unbind('scroll', handler);
	                return element.unbind('mousewheel', wheelHandler);
	            });

	            element.bind('scroll', handler);
	            element.bind('mousewheel', wheelHandler);
	        }

	        return {
	            restrict: 'A',
	            link: linkFn
	        };
	    };
	    exports.lpInfiniteScroll.$inject = ["$parse"];

	}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 68 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/* WEBPACK VAR INJECTION */(function(module) {!(__WEBPACK_AMD_DEFINE_RESULT__ = function(require, exports, module) {
	    'use strict';

	    module.name = 'ui.element-resize';

	    var base = __webpack_require__(2);

	    var deps = [];

	    module.exports = base.createModule(module.name, deps)
	        .directive( __webpack_require__(69) );
	}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)(module)))

/***/ },
/* 69 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_RESULT__ = function(require, exports, module) {
	    'use strict';

	    var angular = __webpack_require__(2).ng;

	    /**
	     * Uses the correct implementation of requestAnimationFrame,
	     *     or uses setTimeout as a fallback.
	     *
	     * @param   {Function} fn The callback function to be called
	     * @returns Returns the requestAnimationFrame function result
	     */
	    var requestFrame = function(fn) {
	        var raf = window.requestAnimationFrame ||
	            window.mozRequestAnimationFrame ||
	            window.webkitRequestAnimationFrame ||
	            function() { return window.setTimeout(fn, 20); };

	        return raf(fn);
	    };

	    /**
	     * Funtion that cancels the requestAnimationFrame callback or it's setTimeout fallback.
	     *
	     * @param  id {Object} The id of the requestAnimationFrame to be canceled
	     * @return    Returns the cancelAnimationFrame function result
	     */
	    var cancelFrame = function(id) {
	        var cancel = window.cancelAnimationFrame ||
	            window.mozCancelAnimationFrame ||
	            window.webkitCancelAnimationFrame ||
	            window.clearTimeout;

	        return cancel(id);
	    };

	    // @ngInject
	    exports.lpElementResize = function($parse) {
	        return {
	            restrict: 'A',
	            link: function(scope, element, attrs) {
	                // function to be called when a resize happens (passed in as the value for the directive attribute)
	                var callback = $parse(attrs.elementResize || attrs.lpElementResize); // 'elementResize' for backwards compat.

	                var shadowElement;
	                var resizeTarget = element[0];
	                var resizeId;
	                var previousSize = {};
	                // Interval id for initializing the shadow element when the element is visible
	                var initializeInterval;
	                // boolean value defining attachEvent/addEventListener support
	                var hasAttachEvent = false;

	                // Returns true if the size of the element has changed
	                var checkResize = function() {
	                    return resizeTarget.offsetWidth !== previousSize.width ||
	                        resizeTarget.offsetHeight !== previousSize.height;
	                };

	                // Resets the size of the resize elements after size change
	                var resetTriggers = function() {
	                    var triggers = shadowElement[0];
	                    var expand = triggers.querySelector('.expand-trigger');
	                    var contract = triggers.querySelector('.contract-trigger');
	                    var expandChild = triggers.querySelector('.expand-trigger > div');

	                    // move the scroll to it's maximum so in case of a resize it will trigger a scroll event
	                    contract.scrollLeft = contract.scrollWidth;
	                    contract.scrollTop = contract.scrollHeight;
	                    expandChild.style.width = expand.offsetWidth + 1 + 'px';
	                    expandChild.style.height = expand.offsetHeight + 1 + 'px';
	                    expand.scrollLeft = expand.scrollWidth;
	                    expand.scrollTop = expand.scrollHeight;
	                };

	                // The "resize" event callback function
	                var resizeListener = function(event) {
	                    // no need to reset the elements on IE
	                    if (!hasAttachEvent) {
	                        resetTriggers();
	                    }

	                    // if the previous callback hasn't fired yet, cancel it in favour of the new one
	                    if (resizeId) {
	                        cancelFrame(resizeId);
	                    }
	                    // schedule the callback to be called during the next browser repaint cycle
	                    resizeId = requestFrame(function() {
	                        if (checkResize()) {
	                            previousSize.width = resizeTarget.offsetWidth;
	                            previousSize.height = resizeTarget.offsetHeight;

	                            // fire the callback function with width and height as params
	                            callback(scope, { data: { element: element, width: resizeTarget.offsetWidth, height: resizeTarget.offsetHeight } });
	                        }
	                    });
	                };

	                var resizeEventInit = function() {
	                    previousSize.width = resizeTarget.offsetWidth;
	                    previousSize.height = resizeTarget.offsetHeight;

	                    // for IE lt 11 use the native element resize event
	                    resizeTarget.attachEvent('onresize', resizeListener);

	                    // fire the callback function when the directive is initialized
	                    callback(scope, { data: { element: element, width: resizeTarget.offsetWidth, height: resizeTarget.offsetHeight } });
	                };

	                var scrollEventInit = function() {
	                    // create and append to the DOM the resize helper elements
	                    shadowElement = angular.element('<div class="responsive-shadow">' +
	                        '<div class="expand-trigger"><div></div></div>' +
	                        '<div class="contract-trigger"></div>' +
	                    '</div>');
	                    element.append(shadowElement);

	                    resetTriggers();
	                    previousSize.width = resizeTarget.offsetWidth;
	                    previousSize.height = resizeTarget.offsetHeight;

	                    // for IE11 and other browsers, use scroll event to for fire the resize check
	                    resizeTarget.addEventListener('scroll', resizeListener, true);

	                    // fire the callback function when the directive is initialized
	                    callback(scope, { data: { element: element, width: resizeTarget.offsetWidth, height: resizeTarget.offsetHeight } });
	                };

	                var initialize = function() {
	                    // set the existance of attachEvent (only on IE lt 11)
	                    hasAttachEvent = !!document.attachEvent;

	                    if (hasAttachEvent) {
	                        resizeEventInit();
	                    } else {
	                        if (resizeTarget.offsetWidth === 0 && resizeTarget.offsetHeight === 0) {
	                            if (!initializeInterval) {
	                                initializeInterval = window.setInterval(function() {
	                                    if (resizeTarget.offsetWidth !== 0 && resizeTarget.offsetHeight !== 0) {
	                                        window.clearInterval(initializeInterval);
	                                        scrollEventInit();
	                                    }
	                                }, 250);
	                            }
	                        } else {
	                            scrollEventInit();
	                        }
	                    }
	                };

	                // initialization function
	                initialize();
	            }
	        };
	    };
	    exports.lpElementResize.$inject = ["$parse"];

	    /*
	     * @deprecated, will remove in LP 0.13.0
	     */
	    exports.elementResize = exports.lpElementResize; // backwards compatible.
	}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));



/***/ },
/* 70 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/* WEBPACK VAR INJECTION */(function(module) {/**
	 * UI utilities module exposed as `lpUIUtils` angular constant object.
	 * @name utils
	 * @memberof ui
	 * @ngModule
	 */

	!(__WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports, module) {

	    'use strict';

	    module.name = 'ui.utils';
	    var base = __webpack_require__(2);

	    /**
	     * @name lpUIUtils
	     * @memberof ui.utils
	     * @ngConstant
	     */

	    var utils = base.utils;

	    utils.mixin(__webpack_require__(71));
	    utils.mixin(__webpack_require__(72));

	    module.exports = base.createModule(module.name, [])
	        .constant({ 'lpUIUtils': utils });
	}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)(module)))

/***/ },
/* 71 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/**
	 * Input helpers.
	 * @module input
	 */
	!(__WEBPACK_AMD_DEFINE_RESULT__ = function(require, exports, module) {
	'use strict';

	    /**
	     * Get the selection position of an input field
	     * @param {element} input the input field to get the caret position
	     * @param {Function} formatter function to handle formatting of input field
	     */
	    exports.getSelectionPositionOfInput = function(input, formatter) {
	        var textSelection = [];
	        if (!formatter) {
	            formatter = function(_input) {
	                return _input;
	            };
	        }

	        // get the selection start and end values
	        if ('selectionStart' in input) {
	            textSelection = [formatter(input.selectionStart), formatter(input.selectionEnd)];
	        } else {
	        // < IE9 version
	            var range = document.selection.createRange();
	            if (range && range.parentElement() === input) {
	                var textInputRange = input.createTextRange();
	                textInputRange.moveToBookmark(range.getBookmark());
	                textSelection[0] = formatter(textInputRange.moveStart('character', -input.value.length));
	                textSelection[1] = formatter(textInputRange.moveEnd('character', -input.value.length));
	            }
	        }

	        return textSelection;
	    };

	    /**
	     * Gets the caret position of an input field after it has been updated
	     * @param {element} input        The input field
	     * @param {Array}   previousTextSelection  The previous selection on the input before the update
	     * @param {Number}  lengthDiff   The difference in length between the previous value and the new value
	     * @param {Boolean} isBackspace  If the last keypress was a backspace
	     */
	    exports.getNewCaretPosition = function(input, previousTextSelection, lengthDiff, isBackspace) {
	        var cursorPosition = previousTextSelection[0];

	        lengthDiff = previousTextSelection[1] - previousTextSelection[0] + lengthDiff;
	        if (lengthDiff <= 0) {
	            lengthDiff = 1;
	        }
	        // reset the selection values if input field is empty
	        if (!input.value.length) {
	            previousTextSelection = [0, 0];
	        }

	        if (previousTextSelection[0] === previousTextSelection[1]) {
	            // if the nothing is selected in the input field
	            if (isBackspace) {
	                cursorPosition = previousTextSelection[0] === 0 ? 0 : previousTextSelection[0] - 1;
	            } else {
	                cursorPosition = previousTextSelection[0] + lengthDiff;
	            }
	        } else {
	            // if something is selected
	            if (isBackspace) {
	                cursorPosition = previousTextSelection[0];
	            } else {
	                cursorPosition = previousTextSelection[0] + lengthDiff;
	            }
	        }

	        return cursorPosition;
	    };

	    /**
	     * Sets the caret position of input field an handles the scroll to have the caret centered
	     * @param {Element} input the input field to set the caret position of
	     * @param {Number} cursorPosition numeric value representing the desired caret position
	     * @param {String} content content of input field
	     * @param {Element} dummyField dummy field to measure length of text
	     */
	    exports.setCaretPositionOfInput = function(input, cursorPosition, content, dummyField) {

	        var scroll;

	        // set the correct cursor position
	        if ('setSelectionRange' in input) {
	            input.setSelectionRange(cursorPosition, cursorPosition);
	        } else {
	            // < IE9 version
	            var range = input.createTextRange();
	            range.collapse(true);
	            range.moveEnd('character', cursorPosition);
	            range.moveStart('character', cursorPosition);
	            range.select();
	        }
	        //handle input scroll
	        if (content && dummyField) {
	            if (content) {
	                dummyField.text(content.substr(0, cursorPosition));
	            } else {
	                dummyField.text('');
	            }
	            scroll = dummyField.width() - input.offsetWidth / 2;
	            input.scrollLeft = scroll;
	        }
	    };
	}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 72 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/**
	 * Images helpers.
	 * @module images
	 */
	!(__WEBPACK_AMD_DEFINE_RESULT__ = function(require, exports, module) {
	    'use strict';

	    exports.extractInitials = function(name) {
	        var initials = '';
	        name = name.split(' ');
	        for (var i = 0; i < name.length; i++) {
	            initials += name[i].substr(0, 1);
	        }
	        initials = initials.toUpperCase();
	        return initials;
	    };

	    exports.getColorFromInitials = function(initials) {
	        var a = initials.charCodeAt(0) - 64;
	        var x = a + 120;
	        var i = Math.floor((((a - 1) / (26 - 1)) * (5 - 1) + 1) - 1);
	        var colors = [
	            [ x, 210, 210 ],
	            [ x, x, 210 ],
	            [ 210, x, x ],
	            [ x, 210, x ],
	            [ 210, x, 210 ]
	        ];
	        return colors[i];
	    };

	    var defaultProfileImage = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFAAAABPCAIAAADz89W0AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyRpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoTWFjaW50b3NoKSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDo3MkVFRDI3OTJERUQxMUUzQkU4Qzk1MDlEQzAyMjFFNCIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDo3MkVFRDI3QTJERUQxMUUzQkU4Qzk1MDlEQzAyMjFFNCI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjcyRUVEMjc3MkRFRDExRTNCRThDOTUwOURDMDIyMUU0IiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjcyRUVEMjc4MkRFRDExRTNCRThDOTUwOURDMDIyMUU0Ii8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+gildPAAABRdJREFUeNrsmstKI0EUhicmRmO8IoKIgigoCoovIOhOX8m38RncuHWjG0HFjeAl4GWhoAvvUZPMZ/6ZQ9OtmUBa04OnFk2luqo9X51LnVMzqZWVlV8/qbX8+mHNgR3YgR3YgR3YgR3YgR3YgR3YgR3YgR3YgR3YgR3YgR34O1umkcWVSiX4M5VK2Yj6PDUt9Co6GPxI6MvB+U0GDlL9MZiWluBe6KkJ9iqI8RmDjVeq7cO/1TQN8wTm9fX16ekpn88/Pj5ms1kky+VyLy8vdMrlMoOtra100um0MWgLghj0mfD29mav+JnJZJKiYWuA9fb2jo2NiRYwhL64uIBf0k9NTTFHWyMY5kRtVX0msIqfPK+vr0ulUnRrmgyMHF1dXQsLCz09PYChlpubm7W1tbu7O2SFbXx8fGZmxpiZDwzToobKTwhZgmKfn5/Pz883NjaKxaJMo3FR0/Pz841/Ba0iGSSDg4MPDw/Ih27b29uPj495hbUXCoWRkRGELlYb5MDAzCv6etJ4xaD2BWzGh4aGmHl5eVnD4b8PWPpBFbK6q6ur0dFRlCxzbWtrw6sZ7OjoQNXIPTs7y2ScOVttTGCVvFTN+lI7P/kyP9k4vhkLc6NBCwmQiT76RLdbW1vLy8tyP8inp6dPT09RFHi49Pb29sDAgMyVJ+N0YI6eW6yFljkMEvyYw19pftCSQ0osheWTk5OjoyNCFLolgGHGc3Nzm5ubnZ2dbMf6+jquzvj7H85kbLOCja+xO4uLi2wWO4I5yMJjceBGMy3bcsRCOBnhzs7O/f09CmcvwJ6cnAQbWgi7u7vhyVcbVIxg1cxkOX1G6LM1eDLBWX4hS47LgWMAthiLuKgCJEx3b2+PETk2KsV1IZS7QmgeyxL5M5y5apO1M5lpds4rqicrtUS94gESZoAnJib6+/sBYBcI3ZiojqtQvik1auNub2+xDu2j3CRGS47fhzVCrEJRGCR+u7S0pIAE5/DwsDpRYEuniOe7u7vsnbKO1N8WL3MMufT74VZNIVAvHY4f/JDgjEoVYC0g84x+oVRt5WpjrX3zizTcaHloSlBKaJkjZ698WOoy3do0dfTKEmw6+DNPTbCWFA2HVC0DVpOtKsYyfnBwsL+/T4gyk+aVlC8kebuKEL1VREhWPRws8aIVrD15RWp9dnYGQyhpEZvgdUQpb5MXVAItKUHLXM4MW/KZKeotZ4/O3mipYGvVOITxZKUllmNGLxuar+HQ1QT6URqsA5noRVIZugOIOoX8glWazEdk2DF6ciZ2J7E8RC4qbPItKkTxh6wjeDeiJcQ50hVLM1G4YkGC6uEQsIWcYMWD6HaVESo8dKppnBGcWaFLsZrz2WJbEjUsEqvvTWl20RHKW2zQtsBuCKiZqCsPDw/tbiiJGpboxFskNjyJa5VgjSs73RCpzKbuJ9ksFApkMhYLkwgMGInx6uoqRZKUo6u5f2rJ/FlVhOqwvr6+GAumr9Kwkko0U7+UZtLsi2KVQoDcwbKUJPqwLiikIrmxyil5bG0N6zKEQlpHsZRsdwzJ1TAiIqhiDzmj7qssONVYq9ybtVKsrUpWLh2NQBDKaaVnRFc9XOdyqVp3l1aZJNSkLdlUTLYiIXjY1nm1EDx77QxL6DkcyoHr+QexaGYe7SRUw9EEu55z5bOFH36qaRcA/11zYAd2YAd2YAd2YAd2YAd2YAd2YAd24B/QMrH/J4qkA8f7Pyhcw+7DzW6/BRgAykJQPtOgddIAAAAASUVORK5CYII=';

	    exports.getDefaultProfileImage = function(name, width, height, color) {
	        var canvas = document.createElement('canvas');

	        if ( !canvas.getContext || !canvas.getContext('2d') ) {
	            return defaultProfileImage;
	        }

	        var initials = exports.extractInitials(name);
	        color = color || exports.getColorFromInitials(initials);

	        canvas.setAttribute('width', width);
	        canvas.setAttribute('height', height);
	        var ctx = canvas.getContext('2d');

	        var isArray = Object.prototype.toString.call(color) === '[object Array]';
	        ctx.fillStyle = isArray ? 'rgb(' + color.join(',') + ')' : color;
	        ctx.fillRect(0, 0, width, height);
	        ctx.fillStyle = 'rgb(250,250,250)';

	        var scale;
	        switch (initials.length) {
	            case 1:
	                scale = 0.6;
	                break;

	            case 2:
	                scale = 0.5;
	                break;

	            case 3:
	                scale = 0.45;
	                break;

	            default:
	                scale = 0.3;
	                break;
	        }

	        var fontSize = parseInt( scale * height, 10);
	        var marginBottom = Math.floor( 0.15 * height);
	        ctx.font = fontSize + 'px Proxima Regular, Helvetica Nueue, Helvetica, Arial, sans-serif';
	        ctx.textAlign = 'right';
	        ctx.fillText(initials, width - 3, height - marginBottom);

	        var dataUri = canvas.toDataURL('image/png');
	        return dataUri;
	    };

	    /**
	     * @param {String} photoUrl Photo Url
	     * @returns {String|Null}
	     */
	    exports.decodePhotoUrl = function(photoUrl) {
	        return photoUrl ? decodeURIComponent(photoUrl) : null;
	    };
	}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }
/******/ ])
});
;