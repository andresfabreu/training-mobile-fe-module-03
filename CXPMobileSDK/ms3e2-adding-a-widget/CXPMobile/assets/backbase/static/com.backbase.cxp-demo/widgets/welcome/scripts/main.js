define(['jquery'], function ($) {
	"use strict";

	function init(widget) {



		// The widget needs to inform it's done loading so preloading works as expected
		gadgets.pubsub.publish('cxp.item.loaded', {
			id: widget.model.name
		});



	}

	return function (widget) {
		init(widget);
	}

});