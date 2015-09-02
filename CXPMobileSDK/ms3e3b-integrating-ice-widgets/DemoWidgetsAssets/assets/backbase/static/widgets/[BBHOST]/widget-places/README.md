# Places

## Information

| name                  | version           | bundle           |
| ----------------------|:-----------------:| ----------------:|
| widget-places         | 2.3.6 			| Universal        |

## Brief Description

Provides the ability to display a set of places on a map supplied from a specified data source. Inside the widget you will find a Google places autocomplete that allows the user to move on the map by just specifying an address. Additionally, it also able to display detailed information about a given place, such as type (for instance, ATM or branch), opening hours, and services available.

## Dependencies

* base
* core
* ui
* module-places

## Dev Dependencies

* angular-mocks ~1.2.28
* config

## Preferences

Get widget preference `widget.getPreference(string)`

* **placesDataSrc**: The end-point URL for locations data.
* **filterDataSrc**: The end-point URL for filter drop-down data
* **currentPosition**: If `true` and user's device allows to read his current position, the initial
coordinates will be defined by this.
* **panControl**: Whether to show the pan control.
* **showPOI**: Whether other POI are showed on map. These points are clickable.
* **zoom**: The initial zoom level
* **maxZoomOut**: Max zoom out level
* **latitude**: The initial center latitude of the map. (Can be overridden by `currentPosition`)
* **longitude**: The initial center longitude of the map. (Can be overridden by `currentPosition`)
* **staticMapApiUrl**: The end-point URL for static map
* **staticMapZoom**: The default zoom value for static map
* **staticMapThumbSize**: The size of the map thumbnail
* **directionApiUrl**: The end-point URL for directions
* **placesPageSize**: The amount of Places returned for each page
* **placesFilterRadius**: The radius in KM used from the current location used to filter out places
* **sticky**: The property to set the widget fixed to the top.

##Events

The following is a list of pub/sub event which the widget subscribes to:

* **launchpad-retail.places.loadMore** - When this message is received, additional places are loaded


The following is a list of pub/sub event which the widget publishes to:

_This widget does not publish any events._
