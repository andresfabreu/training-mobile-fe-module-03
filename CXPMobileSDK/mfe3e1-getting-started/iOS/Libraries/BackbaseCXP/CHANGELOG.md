### Version 2.3.0: 
* feat: ability to enable text-to-link feature in web renderers
* feat: add a WebRenderer protocol to separate functionalities only related to web rendering
* feat: mobile optimized content widget
* fix: preload of pages containing layouts failed to report all items being loaded.

### Version 2.2.0: 
* feat: Simple storage plugin added as default plugin
* feat: SimpleStorageComponent for native functionality to persist unencrypted information
* feat: navigation flow informer handles multiple kinds of external protocols (e.g. http, https, tel, mailto)
* fix: webview data detectors enabled for all types
* fix: preload timeout takes the default value if not present on the configuration file
* feat: manage targeting parameters for personalized model download
* feat: native items can be rendered using the CXPRendererFactory and the preference native on the model

### Version 2.1.1: 
* fix: preload timeout takes the default value if not present on the configuration file

### Version 2.1.0:
* fix: update synced preferences on the right scope
* fix: show title and id of the item on the webview developer menu
* fix: clearSession remove JSESSIONID and X-Auth-Token cookies to invalidate the session.
* feat: model delegate sends response on the main queue.
* feat: javascript calls to console.<level> are forward to the XCode's console
* fix: ensure webviews do not load files outside the bundles of the app
* feat: new refactored portal client mobile assets
* fix: login delegate receives a NSInteger instead of a NSNumber reference
* fix: regression problem with primitive types on plugins after xcode 7.3
* feat: SyncedPreference are no longer persisted on the user's device, memory-only.
* feat: SyncedPreferences are always read/write disregarding CXP Manager setting.
* feat: add preload timeout as a configuration

### Version 2.0.0: 
* fix: uncontrolled format string
* fix: unchecked error condition
* feat: remove jsessionid check as a method to validate the session as active
* feat: add divider type to sitemap
* fix: preload doesn't wait if there is no children on web items (pages, containers)
* feat: include bitcode flags (required for apple tv/watch compatible apps)
* feat: set force decryption default to true.
* feat: add strip-framework script to remove unnecessary architectures on compilation time
* fix: sync preferences force to handle all values as string
* feat: add support for jsessionid cookies
* feat: CXP plugins are exposed on the webviews on the global scope (window.cxp.mobile.plugins)
* feat: replace contextRoot placeholder on the sslPinning.certificates elements
* feat: remove iOS 7 support and deprecated methods
* fix: synchronous network calls outside of the main thread don't get timed out anymore
* fix: preloaded elements are properly detached from the dummy container
* feat: add itemParent method to the renderable interface

### Version 1.7.2: 
* fix: uncontrolled Format String
* fix: unchecked Error Condition

### Version 1.7.1:
* fix: synchronous network calls outside of the main thread don't get timed out anymore

### Version 1.7.0: 
* fix: purged items were retain after a second rendering
* feat: add bouncing and scrolling control flags on the renderer
* feat: add purge API to release retained items
* fix: Support ICE links by taking in account the path of the remoteContextRoot configuration

### Version 1.6.0: 
* feat: add configuration flag to block webview requests
* feat: enforce config encryption option (Default false).

### Version 1.5.0: 
* fix: NFI page id encoding properly for page rendering
* fix: NFI now deals with page id as source of a navigation event
* fix: return UA using the app visual ### Version (x.x.x) instead of the build number
* feat: SSL pinning exceptions on every request
* feat: add pinning exception field to the configuration
* feat: add custom body class to HTML template from configuration file
* feat: load local models with contextRoot that are remote URLs
* feat: support for native types Array and dictionary of passed from javascript
* feat: add stream function to promises to allow persistent events
* feat: add configuration parameter (debugAllowUntrustedCertificates) to bypass trusted root CA check.
feature: add keep parameter to not dispatch the callback when done
* feat: plugins support for concurrent calls
* feat: add CXP methods to handle plugins
* feat: add Plugin class as a replacement for the deprecated Feature

### Version 1.4.0: 
* feat: add extra information to the SSL pinning violation (host, protocol, port) and warning message if the local certificate can't be found
* fix: navigation flow informer NONE relationship returns the original target request
* feat: add redirection of the log stream to a file

### Version 1.3.2: 
* fix: report the model parsing errors properly
* feat: replace on the fly $(contextRoot) on extra-libraries and styles entries of the configuration
* fix: crash when the server URL is null adding it to the domainAccess list
* fix: forward error when config can't be loaded from the URL
* feat: add user agent compatible format with safari and uiwebview
* feat: add configuration reading from a URL (local file or remote)

### Version 1.3.1: 
* feat: add support for encrypted configuration file
* fix: $(contextRoot) was not replaced in certain circumstances

### Version 1.3.0: 
* fix: logs coming from the webviews don't break on = signs
* fix: scroll view to display textfield (on webview) that was covered by keyboard
* feat: keep log level set before initialisation
* feat: behaviour mapping populated from the pages' preferences
* fix: compatibility for C++/Objective-C++
* feat: exposed sitemap structure as a whole

### Version 1.2.0: 
* feat: add public API to default login mechanism
* feat: default login method
* fix: allow double scrolling (horizontal + vertical) in the page rendering
* fix: typo on CXP postNavigationRequest
* feat: add standarized user agent to the http/https requests
* feat: replace contextRoot placeholder in the path of the local model
* feat: add scroll handling support for page rendering
* fix: preload model for a second time uses speed-boost solution
* feat: expose only declared method on the feature protocol to the javascript interface

### Version 1.1.0: 
* fix: memory management issue with the timer invalidation
* fix: using rangeOfString instead of containsString to support iOS7
* feat: add support for preload on runtime on app's preferences level
* fix: page preload performance improvement
* feat: remove fastclick dependency
* feat: preload on runtime is initiated from predefined pubsub events in the model
* fix: sitemap subpages return an array of strings with ids instead of an array of sitemap item children
* feat: add initialize method to set parameters after the feature has been created
* feat: add method to retrieve currently registered instances by type
* feat: add preload item(s) on demand via the CXPRendererFactory
* fix: focus being lost on page rendering when a DOM manipulation occurs

### Version 1.0.0: 
* feat: add bb:uuid to the model
* fix: navigation flow informer incorrect relationship reporter between sitemaps roots intents
* fix: improve preload performance using rendered window as canvas.
* feat: remove model from the cache when invalidating the model
* feat: expose sdk ### Version in the facade

### Version 0.12.0: 
* feat: add SSL Pinning capabilities
* feat: add method to the CXPRendererFactory to check if a renderer is ready or has to be created from scratch.
* fix: whitelist data: protocol by default
* feat: report any SSL violations
* feat: add ViolationDelegate to the public interface
* feat: add facade method to load the policy http checker
* feat: add whitelist configurations and filtering
* feat: add method to the CXP object to set a session cookie

### Version 0.11.1: 
* feat: add widget id to be visible on the safari developer menu
* fix: hold-to-reload triggers when the time has passed and time reduced to 1sec
* fix: full support for unicode characters on the pubsub payloads
* feat: add check of the template presence on the renderer.
* feat: add check for the widget template during initialization
* fix: session check has to happen after the CXP is initialized + test cases
* feat: add performance measurement capabilities to the facade.
* feat: custom performance logging mechanism using pubsub messages

### Version 0.11.0: 
* feat: add sendMessage method to renderer interface
* feat: add sendMessage method to renderer interface
* fix: compatibility with the expected type of the page tags
* fix: problem with the load timer and notification causing a crash because the page was already released
* feat: add performance configuration to enable the performance reporting
* feat: add reload widget feature
* feat: automatically set log level based on debug setting
* fix: webview's scrollview's insets and offset weren't reset if reused.
* feat: add a session manager and a method to verify the validity of the current session cookie
* fix: page renderer loading twice the widgets

### Version 0.10.0: 
* feat: new SyncedPreferences
* fix: memory issues related to timeouts and wrongly released objects
* feat: add status checker
* feat: add performance measurements for the model parsing/mapping
* feat: model reload when the login-success message is received.
* feat: add ModelDelegate method to notify about the new coming model load.
* fix: incorrect page height detection.
* fix: encoding spaces as + was breaking the payload.
* feat: features are implemented as Promises for javascript usage.
* feat: set widget engine debug level to match native log level.
* feat: add support for remote widgets on the widget rendering via debug configurations
* feat: add configuration parameters for remoteContextRoot and debugContextRoot
* feat: add synchronous currentModel to the facade to retrieve an already loaded model.

### Version 0.9.0: 
* feat: add current ### Version constant to the CXPConstants and automatic generarion during deployment.
* fix: all preload completed sending wrong message when nothing to preload.
* fix: bug when the page / widget leave the memory before the preload timeout has expired.
* fix: problems with nested bundles and location of icons (ios8 and 7)
* feat: add debug flag to config file and change setupLongPressReload in CXPWebChildRenderer
* fix: icons for iOS7 don't rely on the imageNamed function. A best effort approach is taken.
* fix: add isHref verification on top of fireNodeForItem in the navigation flow informer
* fix: add url encoding for href requests in order to pass payloads to the navigation flow informer
* feat: add preload completed if there is no items with preload enabled.
* fix: allPreloadItems return every element with the preload property to true
* feat: add support for icons on the Renderable objects
* fix: preload behavior on recurrent objects.
* feat: add warn log when items time out during loading.
* feat: extend navigation flow informer with beahviour mapping

### Version 0.8.2: 
* fix: format of the navigation flow informer parameters.

### Version 0.8.1: 
* feat: add preload completed event.
* feat: exposing navigation relationships constants.
* feat: navigation flow informer sends query string as payload if present.

### Version 0.8.0: 
* fix: preload cache flushed when new model is loaded
* feat: enable cookies on the webviews.
* fix: improve debug reload of webviews
* fix: reduce the timeout time to 10 seconds instead of 20secs
* fix: ensure all web view js execution happens in the main thread.
* feat: implement preload feature and unit tests
* feat: initial comits for preloading
* fix: remove conflicting dealloc
* fix: page re-render doesn't create the renderers again (retained pages)
* feat: web item retaining
* fix: notification breaking for not fully deallocated references.
* feat: expose children in renderable items
* feat: add exposure of the root element of the model.
* feat: add preferenceForKey and allPreferences to the Renderable interface.

### Version 0.7.0: 
* fix: internal fixes and improvements

### Version 0.6.0: 
* fix: case sensitive paths for the devices
* fix: change order of inclusion of the b-modules to make pub-sub work properly
* feat: add (get)item method to the Renderer so the Renderable method can be retrieved and used.
* feat: promote resolvePageIdForWidgetId to the model
* fix: widget engine paths
* feat: add reload function to renderers. On WebChildRenderer will call the webview reload method
* fix: fix comments from the code review
* feat: promote CXPRendererFactory to the public interface and remove CXPRenderer from the project.
* feat: add Facade to initialize the internal states and provide single entry point to the library
* feat: add replacement for custom script (inline script) placeholder.
* feat: add replacement for extra libraries placeholder.
* feat: add replacement for custom styles placeholder.
* feat: add replacement for launchpad dependencies placeholder.
* feat: add configuration parameters for template injection.
* feat: add replacement for platform dependent placeholder.
* feat: add replacement of default dependencies in the widget template.
* feat: add readonly property to the preferences.
* fix: change crop-at-bottom problem, forward delegate to resize events in page.
* feat: add function forwarding from the CXPRenderer to the concrete instance. The instance can be used for manipulations.

### Version 0.5.1: 
* feat: refactor the interface to retrieve information from the site map.
* fix: allow serverURL to use custom paths for the context (portalserver or something else, including empty or deeper)
* feat: add long press to refresh the webview allowing debuging capabilities in safari
* feat: implement navigation flow informer
* fix: pubsub infinite loop
* fix: add count of subscribers per pubsub event in the native part. Ensures proper unsubcription.
* fix: widget template width no longer matches the device width
* fix: disable bounce on Page rendering

### Version 0.5.0: 
* feat: refactor the interface to retrieve information from the site map.
* fix: allow serverURL to use custom paths for the context (portalserver or something else, including empty or deeper)
* feat: add long press to refresh the webview allowing debuging capabilities in safari
* feat: implement navigation flow informer
* fix: pubsub infinite loop
* fix: add count of subscribers per pubsub event in the native part. Ensures proper unsubcription.
* fix: widget template width no longer matches the device width
* fix: disable bounce on Page rendering

### Version 0.4.1: 
* feat: add methods to the Renderable interface to expose the name and identifier of the element
* feat: add support for features to the widget engine.
* feat: add callback mechanism to notify the widget of the success/failure of the execution.
* feat: add support to execute native features.
* feat: add feature interface and basic methods of interaction.

### Version 0.4.0: 
* feat: add support for features to the widget engine.
* feat: add callback mechanism to notify the widget of the success/failure of the execution.
* feat: add support to execute native features.
* feat: add feature interface and basic methods of interaction.

### Version 0.3.1: 
* feat(CXPWebChildRenderer): implement pubsub

### Version 0.3.0: 
* feat(CXPWebChildRenderer): implement pubsub
* feat: add widget engine with support for ICE widgets.

### Version 0.2.0: 
* fix: remove early exit to list nested layouts
* fix: change background color of page renderer.

### Version 0.1.9: 
* feat: add sitemap methods to retrieve pages in a recursive way.
* feat: add native layout/widget classes to complete the implementation
* fix: small fixes for the CMN-66
* feat: add decision making to the CXPRendererFactory to create objects of the right type
* feat: add CXPChildRenderer as an intermediate abstraction layer
* feat: add isHTML method to determine the type of renderer to be created
* feat: add model's function to retrieve layouts
* fix: fix child local/remote function to ignore the fact of being a widget or a container
* fix: improve CXPLogger coverage
* fix: widget engine passing the remoteContextRoot along
* fix: add dependencies for the widget engine and fixing path resolutions
* fix: issue logging nil properties and iOS 7 private keys.

