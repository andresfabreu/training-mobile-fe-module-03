window.Cxp = {
	loaded: function(time){
		var iframe = document.createElement("IFRAME");
		iframe.setAttribute("src", "cxp-loaded://?time="+time);
		document.documentElement.appendChild(iframe);
		iframe.parentNode.removeChild(iframe);
		iframe = null;
	},
	reload: function () {
		var iframe = document.createElement("IFRAME");
		iframe.setAttribute("src", "cxp-reload://");
		document.documentElement.appendChild(iframe);
		iframe.parentNode.removeChild(iframe);
		iframe = null;
	},
	resizeTo: function (width, height) {
		var iframe = document.createElement("IFRAME");
		iframe.setAttribute("src", "cxp-resize://?w=" + width + "&h=" + height);
		document.documentElement.appendChild(iframe);
		iframe.parentNode.removeChild(iframe);
		iframe = null;
	},

	publish: function (event, payload, eventType) {
		var iframe = document.createElement("IFRAME");
		iframe.setAttribute("src", "cxp-publish://?event=" + encodeURIComponent(event) + "&type=" + encodeURIComponent(
			eventType) + "&payload=" + encodeURIComponent(payload));
		document.documentElement.appendChild(iframe);
		iframe.parentNode.removeChild(iframe);
		iframe = null;
	},

	subscribe: function (event) {
		var iframe = document.createElement("IFRAME");
		iframe.setAttribute("src", "cxp-subscribe://?event=" + encodeURIComponent(event));
		document.documentElement.appendChild(iframe);
		iframe.parentNode.removeChild(iframe);
		iframe = null;
	},

	unsubscribe: function (event) {
		var iframe = document.createElement("IFRAME");
		iframe.setAttribute("src", "cxp-unsubscribe://?event=" + encodeURIComponent(event));
		document.documentElement.appendChild(iframe);
		iframe.parentNode.removeChild(iframe);
		iframe = null;
	},

	executeFeature: function () {
		if (arguments.length === 0) return;
		var args = [];
		Array.prototype.push.apply(args, arguments);

		var feature = args.shift();
		var method = args.shift();
		var params = args;
		for (var i = 0; i < params.length; i++)
			params[i] = encodeURIComponent(params[i]);

		var iframe = document.createElement("IFRAME");
		iframe.setAttribute("src", "cxp-feature://?feature=" + encodeURIComponent(feature) + "&method=" +
			encodeURIComponent(method) + "&params=" + params.join("&params="));
		document.documentElement.appendChild(iframe);
		iframe.parentNode.removeChild(iframe);
		iframe = null;
	}
};
