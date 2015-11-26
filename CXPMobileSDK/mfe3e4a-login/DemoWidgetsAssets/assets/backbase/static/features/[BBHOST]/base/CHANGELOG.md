### v2.8.0 - `01/09/2015, 6:06pm`
* bugfix/LF-227-refactor-session-timeout-handler-for: - console.log is removed  
* bugfix/LF-227-refactor-session-timeout-handler-for: - bugs are fixed - logout function is changed  
* bugfix/LF-227-refactor-session-timeout-handler-for: - log dependency is changed  
* bugfix/LF-227-refactor-session-timeout-handler-for: - session handler is moved from trunk to base - session processing is changed  


### v2.7.0 - `01/09/2015, 2:28pm`
* LF-177: Add queue module, and event initialisation in startup portal.  


### v2.6.4 - `31/08/2015, 3:33pm`
* Fix the exposing the NS as string instead of the launchpad object  


### v2.6.3 - `31/08/2015, 1:47pm`
* fix checking the b$ on mobile SDK if is mocked or not with isb$Mocked utility  


### v2.6.2 - `28/08/2015, 6:09pm`
#### fix-custom-launchpad-chromes  


### v2.6.1 - `26/08/2015, 2:57pm`
#### add tag to info.json for styleguide filtering  
* add tag to info.json for styleguide menu filtering  


### v2.6.0 - `20/08/2015, 6:47pm`
#### add base modules structures and some utilities from core

### v2.5.0 - `11/08/2015, 9:25am`
#### added new modules to base   
* startPortal
* backbase-extention 
* session-handler  
* update lodash to 3.10.0

### v2.4.3 - `11/08/2015, 5:41pm`
#### Fix model.xml format.  
* LF-211: Add model.xml for feature definition.  


### v2.4.2 - `11/08/2015, 1:38pm`
#### Add model.xml for feature definition.  

### v2.4.1 - `10/08/2015, 6:05pm`
#### Remove repository from bower.json  


### v2.4.0 - `28/07/2015, 3:46pm`
#### Support packaging templates into main widget module main.js.  


## [2.3.1] - 2015-07-13
 - Prevent deprecation console.warn messages in case if minfied code is used

## [2.2.1] - 2015-06-30
 - configure lpCoreTemplateProvider with template paths from widget proprties

## [2.2.0] - 2015-06-22
 - add base.inject helper function

## [2.1.2] - 2015-06-16 
 - add launchpad.getWidgetsInfo() function on global.launchpad NS
 - fix remove deps on base and core in requireWidget function for non angular widgets
 
## [2.0.0] - 2015-05-12 (note: generated from git logs)

 - use own require-widget function
 - Add jquery as dependency
 - Use one require widget function and load it as script tag
