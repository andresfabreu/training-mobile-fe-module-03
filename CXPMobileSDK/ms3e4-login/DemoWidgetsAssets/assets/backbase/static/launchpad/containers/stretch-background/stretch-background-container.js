/*global b$, bd, lp */
(function(window, b$, bd, lp, $) {

	"use strict";

	b$.module("b$.portal.view.bdom.container.original", function() {

		var DefaultView = b$.require('b$.portal.view.bdom.default');
		var NS = DefaultView.NS;
		var Container = NS.classes.container;

		NS.registerElement("StretchBackgroundContainer", Container.extend(

			function(bbDocument, namespaceURI, localName, node) {
				Container.call(this, bbDocument, namespaceURI, localName, node);
				this.isPossibleDragTarget = true;
			}, {
				buildHTML: function(htmlElement) {

					return Container.prototype.buildHTML.call(this, htmlElement);
				},
				DOMReady: function () {

					//jquery breaks in iframe! http://bugs.jquery.com/ticket/6151
					var getOffset = function(node) {

						var curleft = 0;
						var curtop = 0;
						if (node.offsetParent) {
							do {
								curleft += node.offsetLeft;
								curtop += node.offsetTop;
							} while ((node = node.offsetParent));
						}
						return {
							left: curtop,
							top: curtop
						};
					};

					var self = this;
					var $bg;
					window.setTimeout(function() {
						self.$container = $(self.htmlNode);
						$bg = self.$container.children(".lp-stretch-background");
						$("#main").prepend($bg);
					},0);

					var currTop = 0;
					var currHeight = 0;

					var positionBackground = function() {

						var height = self.$container.height();
						var top = getOffset(self.htmlNode).top;

						if(lp.util.isDesignMode()) {
							top = top - $(".bd-mobile-close-wrapper").height();
						}

						if(top !== currTop || height !== currHeight) {
							currTop = top;
							currHeight = height;
							$bg.css({
								top: top,
								height: height
							}).show();
						}
					};

					window.setInterval(function() {
						positionBackground();
					}, 100);
				}
			}));
	});
})(window, b$, bd, lp, jQuery);
