// NOTE. Not part of common-module. Just moved from lib/common to here.

/*global require window b$ */
/**
 * "noDup!" plugin.
 *
 * Checks if PortalClient has already loaded the script. 
 * If not - loads it with RequireJS and adds entry to PortalClient.
 */
define(function(){

	"use strict";

	/**
	 * Checks if script is already loaded by PortalClient
	 */
	var isLoaded = function(url){
		var resources = b$._private.resourceManager.resources,
			length = resources.length,
			i;

		for (i = 0; i < length; i++) {
			if (resources[i].uri === url) {
				return true;
			}
		}
		return false;
	};

	/**
	 *	Gets global object by name
	 */
	var getGlobal = function(value) {

		// Speed up
        if (value in window) {
            return window[value];
        }

        var current = window,
            parts = value.split('.'),
            length = parts.length,
            i;

        for (i = 0; i < length; i++) {
            current = current[parts[i]];
        }
        return current;
    };

	return {
		load : function (name, parentRequire, load, config) {
			
			// get script URL
			var url = parentRequire.toUrl(name);

			// check if PortalClient already loaded it
			if (!isLoaded(url)) {
				require([name], function(value) {

					// Adding an entry to PortalClient resources list
					// TODO: change to open API when PortalClient has one
					if (config.shim[name]) {
						b$._private.resourceManager.resources.push({

							uri : url,
							
							equals : function(other){
								return this.uri === other.uri;
							},
							
							isPending : function() {
								return false;
							},
							
							isLoading : function() {
								return false;
							},
							
							isLoaded : function() {
								return true;
							},
							
							evaluate : function() {
								// Already evaluated
							},

							callbacks : []
						
						});
					}

					load(value);
				});
			} else {
                var global = config.shim[name].exports;
                if (global) {
                    load(getGlobal(global));
                } else {
                    load();
                }
			}
		}

	};

});
