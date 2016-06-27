### v2.3.13 - `30/09/2015, 3:05pm`
* - lazy loaded Angular custom directives are broken in IE8  
* Change clicks to use from utils  
* Formatting  
* Merge branch 'master' into feature/allow-custom-markers  
* Updating marker function per @Tomas comments  
* Allowing for custom map markers to be sent in Base64 format from the backend.  

### v2.3.12 - `04/09/2015, 1:03pm`
* Added fix to skip the loop looking for geolocation in iOS. 


### v2.3.11 - `03/09/2015, 1:36pm`
* Add timeout option to may it fail after 5 seconds, if not the mobile app gets stuck forever... 


### v2.3.10 - `03/09/2015, 1:35pm` 
* Add error handler for widget places when the user denies permissions or the gps is disabled.  


### v2.3.9 - `02/09/2015, 3:25pm`
* Add the error handler when the geolocation exist but it fails to retrieve the location. It fallbacks to use the latitude and longitude set in the preferences of the widget.

### v2.3.8 - `28/08/2015, 2:46pm`
* Fix chrome property in model.xml  
* Updating css paths  


### v2.3.7 - `26/08/2015, 11:12am`
* Add auto fit height of the viewport if the user has set the property in the model. Adding it to the preferences the behaviour of the widget will no change if you don't need it.  


### v2.3.6 - `25/08/2015, 10:42pm`
#### add tag into info.json for styleguide filtering  
* add tag for styleguide menu filtering  


### v2.3.5 - `20/08/2015, 4:17pm`
* Add cxp.item.loaded event Build dist assets  
* Add cxp.item.loaded  


### v2.3.4 - `12/08/2015, 2:31pm`
#### Add theme to bower and rebuild dist.  


### v2.3.3 - `10/08/2015, 5:59pm`
#### Remove repository from bower.json  


### v2.3.2 - `30/07/2015, 5:29pm`
#### Update icon preference to use itemRoot.  
* Add minimum height to places list  


### v2.3.1 - `29/07/2015, 6:29pm`
* Fix reference to chrome in model.xml  
* LF-156: Clean up model.xml for 5.6 compatability.  


### v2.3.0 - `29/07/2015, 5:39pm`
#### Update model.xml for CXP 5.6 compatibility  
* LF-156: Clean up model.xml for 5.6 compatability.  


### v2.2.2 - `23/07/2015, 12:10pm`
* NGUSEOLB-133: fix error handling messages  
* Add sticky property to set the widget fixed to the top of the viewport.  
* Fix minified version  
* Fix search  


## [2.2.1] - 2015-07-01
- fix map info-window single click issue

## [2.2.0] - 2015-06-30
- add i18n for label 'Get Directions'
- fix 'Get Directions' link in the map info window
- hide 'Set Up Appointment' button

## [2.1.0] - 2015-06-15
- added maxZoomOut preference

## [2.0.4] - 2015-06-12
- fix error handling

## [2.0.3] - 2015-05-29
- correct branch details in map view to be same as list view

## [2.0.1] - 2015-05-26
 - Standalone develop support
 - add places-list directive back in from module-places

## [2.0.0] - 2015-05-12 (note: generated from git logs)

 - LPES-3657: i18n: added sk-SK
 - remove git marks
 - use lpWidget

## [1.0.0]
* Initial release
