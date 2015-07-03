define(['jquery'], function ($) {
	"use strict";

	function init(widget) {

		var $wBody = $(widget.body);

		function getStarted(data) {
			console.log('getStarted', data)
			// Send a pub/sub event to the application that will use this event by checking if there's a matching page in the behaviour map
			gadgets.pubsub.publish("ToDos", data || null);
		}

		// The widget needs to inform it's done loading so preloading works as expected
		gadgets.pubsub.publish('cxp.item.loaded', {
			id: widget.model.name
		});

		$wBody.on('click', '.get-started', function (ev) {
			getStarted();
		});

		$wBody.on('click', '.todo-add', function (ev) {
			var data = $wBody.find('.todo-new').val();
			if (data && data.length) {
				getStarted({description: data});
			}

		});

	}

	return function (widget) {
		init(widget);
	}

});