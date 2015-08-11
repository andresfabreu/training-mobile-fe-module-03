!function(e,t){"object"==typeof exports&&"object"==typeof module?module.exports=t(require("core"),require("base"),require("ui"),require("async!http://maps.google.com/maps/api/js?libraries=places&sensor=true&")):"function"==typeof define&&define.amd?define(["core","base","ui","async!http://maps.google.com/maps/api/js?libraries=places&sensor=true&"],t):"object"==typeof exports?exports["module-places"]=t(require("core"),require("base"),require("ui"),require("async!http://maps.google.com/maps/api/js?libraries=places&sensor=true&")):e["module-places"]=t(e.core,e.base,e.ui,e["async!http://maps.google.com/maps/api/js?libraries=places&sensor=true&"])}(this,function(e,t,n,a){return function(e){function t(a){if(n[a])return n[a].exports;var r=n[a]={exports:{},id:a,loaded:!1};return e[a].call(r.exports,r,r.exports,t),r.loaded=!0,r.exports}var n={};return t.m=e,t.c=n,t.p="",t(0)}([function(e,t,n){var a;(function(e){a=function(require,e,t){"use strict";t.name="module-places";var a=n(1),r=n(2),i=n(3);n(5),n(4);var o=[a.name,i.name,"AngularGM"];t.exports=r.createModule(t.name,o).constant(n(6)).service(n(7)).directive(n(8)).directive(n(9))}.call(t,n,t,e),!(void 0!==a&&(e.exports=a))}).call(t,n(10)(e))},function(t,n,a){t.exports=e},function(e,n,a){e.exports=t},function(e,t,a){e.exports=n},function(e,t,n){e.exports=a},function(e,t,n){!function(){"use strict";angular.module("AngularGM",[]).factory("angulargmDefaults",function(){return{precision:3,markerConstructor:google.maps.Marker,polylineConstructor:google.maps.Polyline,mapOptions:{zoom:8,center:new google.maps.LatLng(46,-120),mapTypeId:google.maps.MapTypeId.ROADMAP}}})}(),function(){"use strict";angular.module("AngularGM").directive("gmInfoWindow",["$parse","$compile","$timeout","angulargmUtils",function(e,t,n,a){function r(t,a,r,o){var s=angular.extend({},t.$eval(r.gmInfoWindowOptions));s.content=a[0];var l=e(r.gmInfoWindow),u=l(t);u||(u=new google.maps.InfoWindow(s),l.assign(t,u));var c=i(r);angular.forEach(c,function(e,a){google.maps.event.addListener(u,a,function(){n(function(){e(t,{infoWindow:u})})})}),a.replaceWith("<div></div>");var g=u.open;u.open=function(e,t){g.call(u,e,t)}}var i=a.getEventHandlers;return{restrict:"A",priority:100,scope:!1,link:r}}])}(),function(){"use strict";angular.module("AngularGM").directive("gmMap",["$timeout","angulargmUtils",function(e,t){function n(t,n,r,i){if(angular.isDefined(t.gmCenter)||(t.center={}),angular.isDefined(t.gmBounds)||(t.bounds={}),!angular.isDefined(t.gmMapId))throw"angulargm must have non-empty gmMapId attribute";var o=!1,s=!1,l=!1,u=!1;r.hasOwnProperty("gmCenter")&&(o=!0),r.hasOwnProperty("gmZoom")&&(s=!0),r.hasOwnProperty("gmBounds")&&(l=!0),r.hasOwnProperty("gmMapTypeId")&&(u=!0);var c=function(){e(function(){(o||s||l||u)&&t.$apply(function(e){if(o&&(t.gmCenter=i.center),s&&(t.gmZoom=i.zoom),l){var n=i.bounds;n&&(t.gmBounds=n)}u&&(t.gmMapTypeId=i.mapTypeId)})})};i.addMapListener("drag",c),i.addMapListener("zoom_changed",c),i.addMapListener("center_changed",c),i.addMapListener("bounds_changed",c),i.addMapListener("maptypeid_changed",c),i.addMapListener("resize",c);var g=i.getMap(r.gmMapId),p=a(r);angular.forEach(p,function(n,a){i.addMapListener(a,function(a){var r={map:g};void 0!==a&&(r.event=a),e(function(){n(t.$parent,r)})})}),o&&t.$watch("gmCenter",function(e,t){var n=e!==t;if(n&&!i.dragging){var a=e;a&&i._map.panTo(a)}},!0),s&&t.$watch("gmZoom",function(e,t){var n=null!=e&&!isNaN(e);n&&e!==t&&(i.zoom=e)}),l&&t.$watch("gmBounds",function(e,t){var n=e!==t;if(n&&!i.dragging){var a=e;a&&(i.bounds=a)}}),u&&t.$watch("gmMapTypeId",function(e,t){var n=e!==t;n&&e&&(i.mapTypeId=e)}),t.$on("gmMapResize",function(e,n){t.gmMapId()===n&&i.mapTrigger("resize")}),i.addMapListenerOnce("idle",function(){t.$emit("gmMapIdle",t.gmMapId())}),i.mapTrigger("resize")}var a=t.getEventHandlers;return{restrict:"AE",priority:100,template:'<div><div id="" style="width:100%;height:100%;"></div><div ng-transclude></div></div>',transclude:!0,replace:!0,scope:{gmCenter:"=",gmZoom:"=",gmBounds:"=",gmMapTypeId:"=",gmMapOptions:"&",gmMapId:"&"},controller:"angulargmMapController",link:n}}])}(),function(){"use strict";angular.module("AngularGM").directive("gmMarkers",["$log","$parse","$timeout","angulargmUtils","angulargmShape",function(e,t,n,a,r){function i(e,t,n,a){if(!("gmPosition"in n))throw"gmPosition attribute required";var i=function(t){var n=e.gmPosition({object:t}),a=o(n);if(null==a)return null;var r=e.gmMarkerOptions({object:t}),i={};return angular.extend(i,r,{position:a}),i};r.createShapeDirective("marker",e,n,a,i)}var o=a.objToLatLng;return{restrict:"AE",priority:100,scope:{gmObjects:"&",gmId:"&",gmPosition:"&",gmMarkerOptions:"&",gmEvents:"&"},require:"^gmMap",link:i}}])}(),function(){"use strict";angular.module("AngularGM").directive("gmPolylines",["$parse","$compile","$timeout","$log","angulargmUtils","angulargmShape",function(e,t,n,a,r,i){function o(e,t,n,r){if(!("gmPath"in n))throw"gmPath attribute required";var o=function(t){var n=e.gmPath({object:t}),r=[];angular.forEach(n,function(e){var t=s(e);return null==t?void a.warn("Unable to generate lat/lng from ",e):void r.push(t)});var i=e.gmPolylineOptions({object:t}),o={};return angular.extend(o,i,{path:r}),o};i.createShapeDirective("polyline",e,n,r,o)}var s=r.objToLatLng;return{restrict:"AE",priority:100,scope:{gmObjects:"&",gmId:"&",gmPath:"&",gmPolylineOptions:"&",gmEvents:"&"},require:"^gmMap",link:o}}])}(),function(){"use strict";angular.module("AngularGM").factory("angulargmContainer",["$q",function(e){function t(e,t){if(!(t instanceof google.maps.Map))throw"map not a google.maps.Map: "+t;if(e in o)throw"already contain map with id "+e;o[e]=t,e in s&&s[e].resolve(t)}function n(e){return o[e]}function a(t){var n=s[t]||e.defer();return s[t]=n,n.promise}function r(e){e in o&&delete o[e],e in s&&delete s[e]}function i(){o={},s={}}var o={},s={};return{addMap:t,getMap:n,getMapPromise:a,removeMap:r,clear:i}}])}(),function(){"use strict";angular.module("AngularGM").factory("angulargmShape",["$timeout","angulargmUtils",function(e,t){function n(e){if(!("gmObjects"in e))throw"gmObjects attribute required";if(!("gmId"in e))throw"gmId attribute required"}function a(e,t){var n={};return angular.forEach(t,function(t){var a=e.gmId({object:t});n[a]=t}),n}function r(t,n,a,r,i,o){angular.forEach(i,function(i,s){var l=a.getElement(t,n.$id,s),u=o(i);null!=u&&(l?a.updateElement(t,n.$id,s,u):(a.addElement(t,n.$id,s,u),l=a.getElement(t,n.$id,s),angular.forEach(r,function(r,o){a.addListener(l,o,function(){e(function(){var e={object:i};e[t]=l,r(n.$parent.$parent,e)})})})))})}function i(e,t,n,a){var r=[];n.forEachElementInScope(e,t.$id,function(e,t){t in a||r.push(t)}),angular.forEach(r,function(a){n.removeElement(e,t.$id,a)})}function o(e,t){var n=t.charAt(0).toUpperCase()+t.slice(1)+"s";return e.replace("Shapes",n)}function s(t,n,a,r,i){n.$watch("gmObjects().length",function(e,t){null!=e&&e!==t&&i(n,n.gmObjects())}),n.$watch("gmObjects()",function(e,t){null!=e&&e!==t&&i(n,n.gmObjects())}),n.$watch("gmEvents()",function(a,i){null!=a&&a!==i&&angular.forEach(a,function(a){var i=a.event,o=a.ids;angular.forEach(o,function(a){var o=r.getElement(t,n.$id,a);null!=o&&e(angular.bind(this,r.trigger,o,i))})})}),n.$on(o("gmShapesRedraw",t),function(e,t){(null==t||t===a.gmObjects)&&(i(n),i(n,n.gmObjects()))}),n.$on(o("gmShapesUpdate",t),function(e,t){(null==t||t===a.gmObjects)&&i(n,n.gmObjects())})}function l(l,u,c,g,p){n(c);var m=function(e,n){var s=a(e,n),u=t.getEventHandlers(c);r(l,e,g,u,s,p),i(l,e,g,s),e.$emit(o("gmShapesUpdated",l),c.gmObjects)};s(l,u,c,g,m),e(angular.bind(null,m,u,u.gmObjects()))}return{createShapeDirective:l}}])}(),function(){"use strict";angular.module("AngularGM").factory("angulargmUtils",["$parse",function(e){function t(){var e=!1;try{Object.defineProperty({},"x",{})}catch(t){e=!0}return e}function n(e,t){return Math.abs(e-t)<1e-6}function a(e,t){return e instanceof google.maps.LatLng&&t instanceof google.maps.LatLng?n(e.lat(),t.lat())&&n(e.lng(),t.lng()):!1}function r(e,t){if(!(e instanceof google.maps.LatLngBounds&&t instanceof google.maps.LatLngBounds))return!1;var n=e.getSouthWest(),r=t.getSouthWest(),i=e.getNorthEast(),o=t.getNorthEast();return a(n,r)&&a(i,o)}function i(e){if(!(e instanceof google.maps.LatLng))throw"latLng not a google.maps.LatLng";return{lat:e.lat(),lng:e.lng()}}function o(e){if(null!=e){var t=e.lat,n=e.lng,a=!(null==t||null==n||isNaN(t)||isNaN(n));if(a)return new google.maps.LatLng(t,n)}return null}function s(e){if(!(e instanceof google.maps.LatLng))throw"latLng must be a google.maps.LatLng";var t=null==e.lat()||null==e.lng(),n=isNaN(e.lat())||isNaN(e.lng());return t||n}function l(t){var n={};return angular.forEach(t,function(t,a){if(0===a.lastIndexOf("gmOn",0)){var r=angular.lowercase(a.substring(4).replace(/(?!^)([A-Z])/g,"_$&")),i=e(t);n[r]=i}}),n}function u(e,t){if(void 0===e||null===e)throw t?t+" was: "+e:"value was: "+e}return{isOldBrowser:t,latLngEqual:a,boundsEqual:r,latLngToObj:i,objToLatLng:o,hasNaN:s,getEventHandlers:l,assertDefined:u}}])}(),function(){"use strict";angular.module("AngularGM").controller("angulargmMapController",["$scope","$element","angulargmUtils","angulargmDefaults","angulargmContainer",function(e,t,n,a,r){var i=n.latLngEqual,o=n.boundsEqual,s=n.hasNaN,l=n.assertDefined,u=function(e,t){var l=e.gmMapId();if(!l)throw"angulargm must have non-empty gmMapId attribute";var u=angular.element(t[0].firstChild);u.attr("id",l);var c=this._getConfig(e,a);this._map=this._createMap(l,u,c,r,e),this._elements={},this._listeners={},this.dragging=!1;var g=n.isOldBrowser();g||Object.defineProperties(this,{precision:{value:a.precision,writeable:!1},center:{get:function(){return this._map.getCenter()},set:function(e){if(s(e))throw"center contains null or NaN";var t=!i(this.center,e);t&&this._map.panTo(e)}},zoom:{configurable:!0,get:function(){return this._map.getZoom()},set:function(e){if(null==e||isNaN(e))throw"zoom was null or NaN";var t=this.zoom!==e;t&&this._map.setZoom(e)}},bounds:{configurable:!0,get:function(){return this._map.getBounds()},set:function(e){var t=!s(e.getSouthWest())&&!s(e.getNorthEast());if(!t)throw"bounds contains null or NaN";var n=!o(this.bounds,e);n&&this._map.fitBounds(e)}},mapTypeId:{configurable:!0,get:function(){return this._map.getMapTypeId()},set:function(e){if(null==e)throw"mapTypeId was null or unknown";var t=this.mapTypeId!==e;t&&this._map.setMapTypeId(e)}}}),this._initDragListeners(),e.$on("$destroy",angular.bind(this,this._destroy))};this._getConfig=function(e,t){var n=t.mapOptions,a={};return angular.extend(a,n,e.gmMapOptions()),a},this._createMap=function(e,t,n,a){var r=a.getMap(e);if(r){var i=r.getDiv();t.replaceWith(i),this._map=r,this.mapTrigger("resize"),r.setOptions(n)}else r=new google.maps.Map(t[0],n),a.addMap(e,r);return r},this._initDragListeners=function(){var e=this;this.addMapListener("dragstart",function(){e.dragging=!0}),this.addMapListener("idle",function(){e.dragging=!1}),this.addMapListener("drag",function(){e.dragging=!0})},this._destroy=function(){angular.forEach(this._listeners,function(e){angular.forEach(e,function(e){google.maps.event.removeListener(e)})}),this._listeners={};var e=this,t=Object.keys(this._elements);angular.forEach(t,function(t){var n=Object.keys(e._getElements(t));angular.forEach(n,function(n){e.forEachElementInScope(t,n,function(a,r){e.removeElement(t,n,r)})})})},this.addMapListener=function(e,t){var n=google.maps.event.addListener(this._map,e,t);void 0===this._listeners[e]&&(this._listeners[e]=[]),this._listeners[e].push(n)},this.addMapListenerOnce=function(e,t){google.maps.event.addListenerOnce(this._map,e,t)},this.addListener=function(e,t,n){google.maps.event.addListener(e,t,n)},this.addListenerOnce=function(e,t,n){google.maps.event.addListenerOnce(e,t,n)},this.mapTrigger=function(e){google.maps.event.trigger(this._map,e)},this.trigger=function(e,t){google.maps.event.trigger(e,t)},this._newElement=function(e,t){if("marker"===e){if(!(t.position instanceof google.maps.LatLng))throw"markerOptions did not contain a position";return new a.markerConstructor(t)}if("polyline"===e){if(!(t.path instanceof Array))throw"polylineOptions did not contain a path";return new a.polylineConstructor(t)}throw"unrecognized type "+e},this._getElements=function(e){return e in this._elements||(this._elements[e]={}),this._elements[e]},this.addElement=function(e,t,n,a){if(l(e,"type"),l(t,"scopeId"),l(n,"id"),l(a,"elementOptions"),this.hasElement(e,t,n))return!1;var r=this._getElements(e);null==r[t]&&(r[t]={});var i={};angular.extend(i,a);var o=this._newElement(e,i);return r[t][n]=o,o.setMap(this._map),!0},this.updateElement=function(e,t,n,a){l(e,"type"),l(t,"scopeId"),l(n,"id"),l(a,"elementOptions");var r=this.getElement(e,t,n);return r?(r.setOptions(a),!0):!1},this.hasElement=function(e,t,n){return l(e,"type"),l(t,"scopeId"),l(n,"id"),null!=this.getElement(e,t,n)},this.getElement=function(e,t,n){l(e,"type"),l(t,"scopeId"),l(n,"id");var a=this._getElements(e);return null!=a[t]&&n in a[t]?a[t][n]:null},this.removeElement=function(e,t,n){l(e,"type"),l(t,"scopeId"),l(n,"id");var a=this._getElements(e),r=!1,i=a[t][n];return i&&(i.setMap(null),r=!0),a[t][n]=null,delete a[t][n],r},this.forEachElement=function(e,t){l(e,"type"),l(t,"fn");var n=this._getElements(e),a=Object.keys(n),r=a.reduce(function(e,t){return angular.forEach(n[t],function(t){e.push(t)}),e},[]);angular.forEach(r,function(e,n){null!=e&&t(e,n)})},this.forEachElementInScope=function(e,t,n){l(e,"type"),l(t,"scopeId"),l(n,"fn");var a=this._getElements(e);angular.forEach(a[t],function(e,t){null!=e&&n(e,t)})},this.getMap=function(){return this._map},angular.bind(this,u)(e,t)}])}()},function(e,t,n){var a;a=function(require,e,t){"use strict";e.lpPlacesUtils={maxLengthLabel:3,markerColorPool:["#FF8355","#6FADD4","#E69215","#74AED3","#C73935","#443647","#38706D","#1D415B"],markerWidth:25,markerHeight:35,markerFontFamily:"Arial",titleField:"name",alertTimeout:5e3,isCanvasSupported:function(){return!!document.createElement("canvas").getContext}}}.call(t,n,t,e),!(void 0!==a&&(e.exports=a))},function(e,t,n){var a;a=function(require,e,t){"use strict";e.lpPlaces=function(e){var t=function(e,t,n){var a=t/2;e.beginPath(),e.moveTo(a,n),e.arc(a,a,a,0,Math.PI,!0),e.closePath(),e.fill(),e.stroke()};this.getFilterOptions=function(e){var t=e.types||[],n=e.services||[];return t.concat(n)},this.googleIcon=function(e,t){return"#"===t.charAt(0)&&(t=t.substring(1)),"http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld="+e.charAt(0)+"|"+(t||"FF0000")},this.canvasIcon=function(n,a,r,i){var o=document.createElement("canvas"),s=o.getContext("2d");r=r||e.markerWidth,i=i||e.markerHeight,o.width=r,o.height=i,s.clearRect(0,0,r,i),s.fillStyle=a,s.strokeStyle=a,t(s,r,i),s.fillStyle="white",s.strokeStyle="black";var l=10-n.length;s.font="normal "+l+"pt "+e.markerFontFamily,s.textBaseline="top";var u=s.measureText(n);return s.fillText(n,Math.floor(r/2-u.width/2),4),o.toDataURL()}},e.lpPlaces.$inject=["lpPlacesUtils"]}.call(t,n,t,e),!(void 0!==a&&(e.exports=a))},function(e,t,n){var a;a=function(require,e,t){"use strict";e.placesAutocomplete=function(){var e=n(2).ng,t=window.google;return{restrict:"A",require:"ngModel",scope:{onPlaceChange:"&placesAutocomplete"},replace:!1,link:function(n,a,r,i){var o=new t.maps.places.Autocomplete(a[0]);t.maps.event.addListener(o,"place_changed",function(){var t=o.getPlace(),r=!!t.geometry,s={place:t};if(r){var l=t.geometry.location;e.extend(s,{lat:l.lat(),lng:l.lng()})}n.$apply(function(){i.$setValidity("place",r),i.$setViewValue(a.val()),n.onPlaceChange(s)})}),a.bind("keydown",function(e){13===e.keyCode&&e.preventDefault()})}}}}.call(t,n,t,e),!(void 0!==a&&(e.exports=a))},function(e,t,n){var a;a=function(require,e,t){"use strict";var a=n(2),r=window.lp.util,i=a.ng;e.placesList=function(e,t){var n=t;return{restrict:"A",replace:!0,scope:{places:"=placesObjects",map:"=mapObject",filters:"=filterObject"},controller:["$scope","$element","angulargmUtils",function(e,t,a){function r(e){var t,n=e.split("-");return t=n[0].substring(0,2)+":"+n[0].substring(2),t+=" - "+n[1].substring(0,2)+":"+n[1].substring(2)}function o(t){t.openingHours.formattedPeriods=[],i.forEach(t.openingHours.periods,function(n){t.openingHours.formattedPeriods.push({day:e.weekdays[n.day],time:r(n.time)})})}function s(){n.enable(t).rule({"max-width":420,then:function(){e.css.detailSection="col-md-12 col-xs-12"}}).rule({"min-width":421,then:function(){e.css.detailSection="col-md-6 col-xs-6"}})}e.isOldBrowser=a.isOldBrowser(),e.weekdays=["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"],e.css={detailSection:"col-md-6 col-xs-6"},e.openDetails=function(t){(t.showDetails===!1||void 0===t.showDetails)&&(t.showDetails=!0,t.mapUrl=e.map.staticMapApiUrl+"?zoom="+e.map.staticMapZoom+"&size="+e.map.staticMapThumbSize+"&markers=color:red%7C"+t.location.latitude+","+t.location.longitude,t.directionUrl=e.map.directionApiUrl+"?daddr="+t.location.latitude+","+t.location.longitude,o(t))},e.closeDetails=function(e,t){t.stopPropagation(),e.showDetails=!1},e.loadMorePlaces=function(){gadgets.pubsub.publish("launchpad-retail.places.loadMore",{},!0)},s()}],templateUrl:r.widgetBaseUrl(e)+"/templates/placesList.html"}},e.placesList.$inject=["lpWidget","lpUIResponsive"]}.call(t,n,t,e),!(void 0!==a&&(e.exports=a))},function(e,t,n){e.exports=function(e){return e.webpackPolyfill||(e.deprecate=function(){},e.paths=[],e.children=[],e.webpackPolyfill=1),e}}])});