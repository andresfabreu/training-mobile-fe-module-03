define(['jquery'], function ($) {
	"use strict";

	function init(widget) {

		// The widget needs to inform it's done loading so preloading works as expected
		gadgets.pubsub.publish('cxp.item.loaded', {
			id: widget.model.name
		});

		var $wBody = $(widget.body);	

		$wBody.on('click', '.get-started', function (ev) {
			gadgets.pubsub.publish("ToDos");
		});
	}

	return function (widget) {
		init(widget);
	}

});