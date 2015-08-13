define(['angular'], function (angular) {
	"use strict";

	var app = angular.module('mobile-test', []);

	var ITEMSAPI = 'https://hacker-news.firebaseio.com/v0/topstories.json';
	var config = {
		numberPpage: 10
	};

	app.controller('sampleCtrl', ['$scope', 'widget', '$http',
		function ($scope, widget, $http) {

			$scope.title = widget.getPreference('title');

			$scope.itemUrl = 'https://news.ycombinator.com/item?id=';
			$scope.model = {};
			$scope.model.page = 0;
			$scope.model.items = [];
			$scope.model.loadedItems = [];

			$scope.getMore = function(){

				pageItems($scope.model.items, $scope.model.page)
			};

			var promisse = $http.get(ITEMSAPI);
			promisse.then(function (res) {
				$scope.model.items = res.data;
				pageItems($scope.model.items, $scope.model.page);
				// The widget needs to inform it's done loading so preloading works as expected
				gadgets.pubsub.publish('cxp.item.loaded', {
					id: widget.model.name
				});
			});




			function getItem(item) {
				var itemApi = 'https://hacker-news.firebaseio.com/v0/item/' + item + '.json';
				var promisse = $http.get(itemApi);

				promisse.then(function (res) {
					$scope.model.loadedItems.push(res.data);
				});
			}

			function pageItems(items, page){
				var pageStart = page * config.numberPpage;
				var pageItems = items.slice(pageStart, pageStart + config.numberPpage)

				console.log(pageStart, pageStart + config.numberPpage, pageItems);

				$scope.model.page++;
				pageItems.forEach(function (item, i) {
					getItem(item);
				});
			}

			$scope.loadLink = function (el, ev) {
				console.log(el, ev);
			}


		}]);


	function addListeners(widget) {

		window.addEventListener('orientationchange', function (ev) {
			handleOrientation(ev)
		});
	}

	function handleOrientation(ev) {
		console.log(ev);
	};

	addListeners();

	return function (widget) {
		app.value("widget", widget);
		console.log(widget)

		angular.bootstrap(widget.body, ['mobile-test']);
		addListeners(widget);
		gadgets.pubsub.publish ('cxp.item.loaded', {id:widget.model.name});
	}
});

