define(function(require, exports, module) {
    'use strict';

	exports.overviewHeaderController = function($scope, widget) {

		// The widget needs to inform it's done loading so preloading works as expected
		gadgets.pubsub.publish('cxp.item.loaded', {id:widget.id});
	};
})