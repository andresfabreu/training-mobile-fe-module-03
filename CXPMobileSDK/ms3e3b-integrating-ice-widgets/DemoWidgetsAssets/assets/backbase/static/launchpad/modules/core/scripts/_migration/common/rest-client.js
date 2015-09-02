// NOTE. Not part of common-module. Just moved from lib/common to here.

/*global Mustache */
(function($) {

	"use strict";

	var client = {};

	client._defaultContextPath = "/portalserver";
	client._defaultServer = "";

	client.http = {
		GET: "get",
		POST: "post",
		PUT: "put",
		DELETE: "delete"
	};

	client.item = {
		PORTAL: "portal",
		PAGE: "page",
		CONTAINER: "container",
		WIDGET: "widget",
		LINK: "link"
	};

///////////////////////////////////////////////////////////////////////////////////////////////////
// Templates
///////////////////////////////////////////////////////////////////////////////////////////////////

	client.tmpl = {
		PROPERTIES:
			"<properties>\n" +
				"{{#properties}}" +
				"<property name=\"{{name}}\">\n" +
					"<value type=\"{{type}}\">{{value}}</value>\n" +
					"</property>\n" +
				"{{/properties}}" +
			"</properties>\n",

		ITEM_INNER:
			"<name>{{name}}</name>\n" +
				"<contextItemName>{{contextItemName}}</contextItemName>\n" +
				"{{#parentItemName}}" +
					"<parentItemName>{{parentItemName}}</parentItemName>\n" +
				"{{/parentItemName}}" +
				"{{#extendedItemName}}" +
					"<extendedItemName>{{extendedItemName}}</extendedItemName>\n" +
				"{{/extendedItemName}}"
	};

	client.tmpl.PAGE = "<page>\n" + client.tmpl.ITEM_INNER + client.tmpl.PROPERTIES + "</page>";
	client.tmpl.CONTAINER = "<container>\n" + client.tmpl.ITEM_INNER + client.tmpl.PROPERTIES + "</container>";
	client.tmpl.WIDGET = "<widget>\n" + client.tmpl.ITEM_INNER + client.tmpl.PROPERTIES + "</widget>";
	client.tmpl.LINK = "<link>\n" + client.tmpl.ITEM_INNER + client.tmpl.PROPERTIES + "</link>";


///////////////////////////////////////////////////////////////////////////////////////////////////
// DEFAULT DATA
///////////////////////////////////////////////////////////////////////////////////////////////////

	client.defaultData = {
		PAGE: {
			properties: [{
				name:  "title",
				type: "string",
				value: "New container"
			},{
				name:  "order",
				type: "double",
				value: "0"
			}]
		},
		CONTAINER: {
			properties: [{
				name:  "title",
				type: "string",
				value: "New container"
			},{
				name:  "order",
				type: "double",
				value: "0"
			}]
		},
		WIDGET: {
			properties: [{
				name: "TemplateName",
				type: "string",
				value: "Standard_Widget"
			},{
				name:  "widgetChrome",
				type: "string",
				value: "$(contextRoot)/static/launchpad/chromes/default/chrome-default.html"
			},{
				name:  "title",
				type: "string",
				value: "New widget"
			},{
				name:  "order",
				type: "double",
				value: "0"
			}]
		},
		LINK: {
			properties: [{
				name:  "title",
				type: "string",
				value: "New container"
			},{
				name:  "order",
				type: "double",
				value: "0"
			}]
		}
	};

///////////////////////////////////////////////////////////////////////////////////////////////////
// Portal item abstractions
///////////////////////////////////////////////////////////////////////////////////////////////////

	client.makeGetCatalogRequest = function(params) {

		var query = params.modifiers ? "?" + processModifiers(params.modifiers) : "";
		var request = {
			url: client.makeRestCatalogUrl(params.server, params.contextPath, params.contextItemName, query),
			method: client.http.GET
		};
		return request;
	};

	client.makePutCatalogRequest = function(params) {

		var tmpl = null;
		if(params.itemType === client.item.WIDGET) {
			tmpl = client.tmpl.WIDGET;
		} else if(params.itemType === client.item.CONTAINER) {
			tmpl = client.tmpl.CONTAINER;
		}
		var query = params.modifiers ? "?" + processModifiers(params.modifiers) : "";
		var body = "<catalog>\n" + client.getRequestBody(tmpl, params) + "\n</catalog>";
		var request = {
			url: client.makeRestCatalogUrl(params.server, params.contextPath, params.contextItemName, query),
			method: client.http.PUT,
			body: body
		};
		return request;
	};

	/**
	 * Gets a page given the standard params
	 * @param params
	 */
	client.makeGetPortalRequest = function(params) {

		var query = typeof params.modifiers === "object" ? "?" + processModifiers(params.modifiers) : "";
		var request = {
			url: client.makeRestItemUrl(params.server, params.contextPath, params.contextItemName, null, null, query),
			method: client.http.GET
		};
		return request;
	};

	/**
	 * Gets a page given the standard params
	 * @param params
	 */
	client.makeGetPageRequest = function(params) {

		checkStandardParams(params);
		//var query = typeof modifiers === "object" ? "?" + processModifiers(modifiers) : "";
		var request = {
			url: client.makeRestItemUrl(params.server, params.contextPath, params.contextItemName, "pages", params.name),
			method: client.http.GET
		};
		return request;
	};

	/**
	 * Gets a container given the standard params
	 * @param params
	 */
	client.makeGetContainerRequest = function(params) {

		checkStandardParams(params);
		//var query = typeof modifiers === "object" ? "?" + processModifiers(modifiers) : "";
		var request = {
			url: client.makeRestItemUrl(params.server, params.contextPath, params.contextItemName, "containers", params.name),
			method: client.http.GET
		};
		return request;
	};

	/**
	 * Gets a widget given the standard params
	 * @param params
	 */
	client.makeGetWidgetRequest = function(params) {

		checkStandardParams(params);
		//var query = typeof modifiers === "object" ? "?" + processModifiers(modifiers) : "";
		var request = {
			url: client.makeRestItemUrl(params.server, params.contextPath, params.contextItemName, "widgets", params.name),
			method: client.http.GET
		};
		return request;
	};

	/**
	* Gets links given the standard params
	* @param params
	*/
	client.makeGetLinksRequest = function(params) {
		//checkStandardParams(params);
		var request = {
			url: client.makeRestItemUrl(params.server, params.contextPath, params.contextItemName, "links", params.name, params.query),
			method: client.http.GET
		};
		return request;
	};

	/**
	 * Creates a new page given the standard params
	 * @param params
	 */
	client.makePostPageRequest = function(params) {

		checkStandardParams(params);
		checkParams(params, "parentItemName");
		checkProperty(params, "TemplateName");
		params = $.extend(true, {}, client.defaultData.PAGE, params);
		params.properties = mergeProperties(client.defaultData.PAGE.properties, params.properties);

		var request = {
			url: client.makeRestItemUrl(params.server, params.contextPath, params.contextItemName, "pages"),
			method: client.http.POST,
			body: client.getRequestBody(client.tmpl.PAGE, params)
		};
		return request;
	};

	/**
	 * Creates a new container given the standard params
	 * @param params
	 */
	client.makePostContainerRequest = function(params) {

		checkStandardParams(params);
		checkParams(params, "parentItemName");
		checkProperty(params, "TemplateName");
		params = $.extend(true, {}, client.defaultData.CONTAINER, params);
		params.properties = mergeProperties(client.defaultData.CONTAINER.properties, params.properties);

		var request = {
			url: client.makeRestItemUrl(params.server, params.contextPath, params.contextItemName, "containers"),
			method: client.http.POST,
			body: client.getRequestBody(client.tmpl.CONTAINER, params)
		};
		return request;
	};

	/**
	 * Creates a new widget given the standard params
	 * @param params
	 */
	client.makePostWidgetRequest = function(params) {

		checkStandardParams(params);
		checkParams(params, "parentItemName");
		checkProperty(params, "src");
		params = $.extend(true, {}, client.defaultData.WIDGET, params);
		params.properties = mergeProperties(client.defaultData.WIDGET.properties, params.properties);

		var request = {
			url: client.makeRestItemUrl(params.server, params.contextPath, params.contextItemName, "widgets"),
			method: client.http.POST,
			body: client.getRequestBody(client.tmpl.WIDGET, params)
		};

		return request;
	};

	/**
	 * Updates a page given the standards params
	 * @param params
	 */
	client.makePutPageRequest = function(params) {

		checkStandardParams(params);
		var request = {
			url: client.makeRestItemUrl(params.server, params.contextPath, params.contextItemName, "pages", params.name),
			method: client.http.PUT,
			body: client.getRequestBody(client.tmpl.PAGE, params)
		};
		return request;
	};

	/**
	 * Updates a container given the standard params
	 * @param params
	 */
	client.makePutContainerRequest = function(params) {

		checkStandardParams(params);
		var request = {
			url: client.makeRestItemUrl(params.server, params.contextPath, params.contextItemName, "containers", params.name),
			method: client.http.PUT,
			body: client.getRequestBody(client.tmpl.CONTAINER, params)
		};
		return request;
	};

	/**
	 * Updates a widget given  the standard params
	 * @param params
	 */
	client.makePutWidgetRequest = function(params) {

		checkStandardParams(params);
		var request = {
			url: client.makeRestItemUrl(params.server, params.contextPath, params.contextItemName, "widgets", params.name),
			method: client.http.PUT,
			body: client.getRequestBody(client.tmpl.WIDGET, params)
		};
		return request;
	};

	/**
	 * Deletes a page given the standard params
	 * @param params
	 */
	client.makeDeletePageRequest = function(params) {

		checkStandardParams(params);
		var request = {
			url: client.makeRestItemUrl(params.server, params.contextPath, params.contextItemName, "pages", params.name),
			method: client.http.DELETE
		};
		return request;
	};

	/**
	 * Deletes a container given the standard params
	 * @param params
	 */
	client.makeDeleteContainerRequest = function(params) {

		checkStandardParams(params);
		var request = {
			url: client.makeRestItemUrl(params.server, params.contextPath, params.contextItemName, "containers", params.name),
			method: client.http.DELETE
		};
		return request;
	};

	/**
	 * Deletes a widget given the standard params
	 * @param params
	 */
	client.makeDeleteWidgetRequest = function(params) {

		checkStandardParams(params);
		var request = {
			url: client.makeRestItemUrl(params.server, params.contextPath, params.contextItemName, "widgets", params.name),
			method: client.http.DELETE
		};
		return request;
	};

///////////////////////////////////////////////////////////////////////////////////////////////////
// HTTP utils
///////////////////////////////////////////////////////////////////////////////////////////////////

	/**
	 * Combines a template and item data to create an xml request body
	 * @param template
	 * @param data
	 * @return {*}
	 */
	client.getRequestBody = function(template, data) {

		var renderMethod =  Mustache.render || Mustache.to_html;
		var xml = renderMethod.call(null, template, data);
		return xml;
	};

	/**
	 * Makes a rest call via an asynchronous XHR
	 * @param url
	 * @param method
	 * @param xml
	 * @param callback
	 */
	client.sendRequest = function(url, method, xml, callback) {

		var xhr = $.ajax({
			type: method,
			url: url,
			data: xml,
			processData: false,
			contentType: "application/xml; charset=UTF-8"
		});
		if(typeof callback === "function") {
			xhr.done(function(data) {
				callback(data);
			});
		}

		return xhr;
	};

	client.setDefaultContextPath = function(contextPath) {
		client._defaultContextPath = contextPath;
	};

	client.setDefaultServer = function(server) {
		client._defaultServer = server;
	};

	client.makeRestItemUrl = function(server, contextPath, portal, type, name, query) {

		name = name ? "/" + name : "";
		query = query || "";
		server = server || "";
		var url = server + contextPath + "/portals/" + portal;
		if(type && name) {
			url += "/" + type + name;
		} else if(type) {
			url += "/" + type;
		}
		url += ".xml" + query;
		return url;
	};
	client.makeItemUrl = function(server, contextPath, portal, type, name, query) {

		var url = client.makeRestItemUrl(server, contextPath, portal, type, name, query).replace(/\.xml/, "");
		return url;
	};
	client.makeRestCatalogUrl = function(server, contextPath, portal, query) {
		server = server || "";
		query = query || "";
		var url;
		if(portal) {
			url = server + contextPath + "/portals/" + portal + "/catalog.xml" + query;
		} else {
			url = server + contextPath + "/catalog.xml" + query;
		}
		return url;
	};

///////////////////////////////////////////////////////////////////////////////////////////////////
// Param validation
///////////////////////////////////////////////////////////////////////////////////////////////////

	/**
	 * Throws an error if the specified paramName does not exist
	 * @param params
	 * @param paramName
	 */
	var checkParams = function(params, paramName) {

		var message = null;

		if(!params[paramName] || typeof params[paramName] !== "string") {
			message = "Missing param [" + paramName + "]";
			throw new Error(message);
		}
	};

	var checkStandardParams = function(params) {
		checkParams(params, "name");
		checkParams(params, "contextItemName");

		params.server = params.server || client._defaultServer;
		params.contextPath = params.contextPath || client._defaultContextPath;
	};

	/**
	 * Throws an error if the specified property does not exist in the given params
	 * @param params
	 * @param propertyName
	 */
	var checkProperty = function(params, propertyName) {

		var message = null;

		if(!params.properties || !$.isArray(params.properties)) {
			message  = "No properties are set or they are not an array";
		} else {
			var found = false;
			for(var i = 0; i < params.properties.length && !found; i++) {
				if(params.properties[i].name === propertyName) {
					found = true;
				}
			}
			if(!found) {
				message = propertyName + " was not set as a property for this item";
			}
		}
		if(message) {
			throw new Error(message);
		}
	};

	var mergeProperties = function(defaultProps, newProps) {

		var finalProps = newProps.length > 0 ? newProps.slice(0) : [];
		var i, j, defaultPropName, overwritten;

		//loop through defaults
		for(i = 0; i < defaultProps.length; i++) {
			defaultPropName = defaultProps[i].name;
			overwritten = false;

			//do the new props overwrite the default
			for(j = 0; j < finalProps.length && !overwritten; j++) {
				if(finalProps[j].name === defaultPropName) {
					overwritten = true;
				}
			}

			//not overwritten, add the default the new props
			if(!overwritten) {
				finalProps.push(defaultProps[i]);
			}
		}

		return finalProps;
	};

	var processModifiers = function(modifiers) {

		var modifierStrings = [];

		//filtering
		if(modifiers.f && $.isPlainObject(modifiers.f)) {
			modifiers.f.opererator = modifiers.f.operator || "eq";
			modifierStrings.push("f=" + modifiers.f.name + "(" + modifiers.f.operator + ")" + encodeURIComponent(modifiers.f.value));
		}

		//paging
		if(modifiers.ps && $.isNumeric(modifiers.ps)) {
			modifierStrings.push("ps=" +  modifiers.ps);
		}
		if(modifiers.of && $.isNumeric(modifiers.of)) {
			modifierStrings.push("of=" +  modifiers.of);
		}

		//sorting
		if(modifiers.s && $.isPlainObject(modifiers.s)) {
			modifierStrings.push("s=" +  modifiers.s.name + "(" + modifiers.s.value + ")");
		}

		//process children
		if(modifiers.pc) {
			modifierStrings.push("pc=" + modifiers.pc);
		}

		//(OR joins not supported)
		var queryString = modifierStrings.join("&");
		return queryString;
	};

	window.lp = window.lp || {};
	window.lp.restClient = client;
})(window.jQuery);
