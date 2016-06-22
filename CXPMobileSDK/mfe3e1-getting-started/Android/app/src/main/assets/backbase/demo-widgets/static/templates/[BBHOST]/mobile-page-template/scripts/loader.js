(function() {
	'use strict';

	var scriptNode;
	var contextRoot;
	var mobileRoot;

	/*
	 * Main entry point.
	*/
	function main () {
		var script = getScriptNode();
		contextRoot = script.getAttribute('data-context-root');
		contextRoot = contextRoot ? encodeURI(contextRoot) : "";

		mobileRoot = script.getAttribute('data-mobile-root');
		mobileRoot = mobileRoot ? encodeURI(mobileRoot) : "";

		var confUrl = getConfigUrl();
		if(confUrl) {
			getTemplate(confUrl).then(function(template) {
				template = template || {};

				injectStyles(template.styles);
				injectClassNames(template['body-classes']);

				$.when(injectScripts(template['extra-libraries']))
					.then(function(){
						// Inject script blocks only after all extra libraries are loaded
						injectScriptBlocks(template.scripts)
					});
			});
		}
	}

	/*
	 * Returns this script node
	 * @returns {Object} Script node
	*/
	function getScriptNode () {
		if(scriptNode !== null) {
			var head = document.head || document.getElementsByTagName('head')[0];
			scriptNode = head.querySelector('script[data-mobile-config][data-mobile-root]') || null;
		}
		return scriptNode;
	}

	/*
	 * Returns mobile configuration file url.
	 * Configuration file url taken from 'data-config' attribute of script node.
	 * @returns {String} Mobile configuration file url
	*/
	function getConfigUrl () {
		var script = getScriptNode();
		if(script){
			var configUrl = script.getAttribute('data-mobile-config');

			// Replace $(contextRoot) parameter, because it will not be replaced automatically
			return configUrl ? encodeURI(configUrl.replace('$(contextRoot)', contextRoot)) : null;
		}
		return null;
	}

	/*
	 * Loads configuration file and returns template part of it
	 * @param {String} url Configuration file url
	 * @returns {Object} Mobile template configuration promise
	*/
	function getTemplate (url) {
		return $.get(url)
			.then(function(config){
				return config.template;
			})
			.fail(function(err) {
				console.error(err);
			});
	}

	/*
	 * Injects style files in the head section of the document
	 * @param {Array} styles An array of style files
	*/
	function injectStyles (styles) {
		$.each(styles || [], function(i, url) {
			var style = document.createElement('link');
			style.type = 'text/css';
			style.rel = 'stylesheet';
			style.href = getAbsoluteUrl(url);

			insertNode(style);
		});
	}

	/**
	 * Adds serarated with space class names to body element
	 * @param  {String} classNames Class names. Separated with a space.
	 */
	function injectClassNames(classNames) {
		if(classNames && classNames.length > 0) {
			$(document.body).addClass(classNames);
		}
	}

	/*
	 * Injects script files in the head section of the document
	 * @param {Array} scripts An array of script files
	*/
	function injectScripts (scripts) {
		var defered = [];
		$.each(scripts || [], function(index, url) {
			var d = $.Deferred();
			var script = document.createElement('script');
			script.type = 'text/javascript';
			script.onload = $.proxy(d.resolve, d);
			script.async = false;
			script.src = getAbsoluteUrl(url);

			insertNode(script);
			defered.push(d);
		});

		// Return Defer object, which is resolved when all the defered are resolved
		return $.when.apply(null, defered);
	}

	/*
	 * Injects script blocks in the head section of the document
	 * @param {Array} scripts An array of script blocks
	*/
	function injectScriptBlocks (blocks) {
		$.each(blocks || [], function(i, code) {
			var script = document.createElement('script');
			script.async = false;
			script.text = code;

			insertNode(script);
		});
	}

	/*
	 * Returns absolute url of the resource from configuration file
	 * @param {String} url Mobile configuration resource url
	 * @returns {String} An absolute resource url
	*/
	function getAbsoluteUrl (url) {
		return url.replace(mobileRoot, contextRoot);
	}

	/*
	 * Injects provided node in the head section of the document
	 * @param {Object} node A node to inject
	*/
	function insertNode (node) {
		var script = getScriptNode();
		script.parentNode.insertBefore(node, script);
	}

	main();
})();