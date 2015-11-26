# module-badges

##Adding badges to widget
- Add `‘badges’` dependency to module.
- Add an element to widget’s wrapper, like this – `<span lp-badges="notifications" position="right-top" theme="info"></span>`
- In directive’s name you should specify the type of the badges we will display (and keeping an eye on).
- Also you can choose the theme of the badge (alert, info, success), depending on your purpose.
- You can decide where the badge will appear -- use position attribute for this (default value is ‘right-top’). Available values (‘left’, ‘right’, etc.) described in the Functionality part below.
- The above (a) - (d) is enough to ‘show’ badge on the widget’s, but some JS is required to make badges ‘disappear’ once the items are being ‘read’ or ‘viewed’. To make this happen you should trigger the ‘lpBadgesRead’ event and attach to it an object with the structure like this: {type: ‘orders’, delta: 0}. In that object the ‘type’ property defines the badge type you want to influence, and the delta property (positive number) defines on how many items you want to reduce the total unread badges count (passing 0 means you ‘read’ all items and badge will be hidden at once).  
- To be also mentioned, the badge will appear on the widget’s in 30 sec after a web page is loaded (dependence on session requests, see below). If you want to have badges appeared ‘at once’, you could trigger the ‘lpBadgesGetItems’ event from your widget.
- You can add the multiple badges within one widget. The only requirement for this is to place the badges directive declaration inside the desired wrapper element. For example, if we want to attach a badge to an icon within the widget, we can make it happen like this: `<div class="icon-wrapper"><span lp-badges="notifications" position="right-top" theme="info"></span><img src="path/to/icon"/></div>`. If the mentioned "icon-wrapper" wraps the icon image "tight" (no padding and margins), then the badge will appear as if it is attached to the icon itself. 

##Functionality
- The ‘badges’ component implements the ability to display number of ‘unread’ items of certain type and react on ‘read’ events.
- The types of items are not pre-defined and it is completely on the implementation discretion.
- Positioning -- customisable: all corners -- ‘left’, ‘right’, ‘top’, ‘bottom’. Also ‘middle’ and ‘follow’ (middle of the wrapper and relative to the wrapper’s content); Component expects pairs like ‘left-bottom’, ‘right-top’, etc.; 
- Badge size is pre-defined -- 10px.
- Styling -- available badge “themes” (alert, info, success); The Bootstrap’s ‘badge’ class is used, yet some custom CSS as well. The default theme is alert. To choose another one please use ‘theme’ attribute once declaring the directive.
- Some animation added -- badge fade-in/out.
- To refresh badges the system uses session’s polling, but not in regular way -- once the session poll requests arrives, the ‘lpBadgesGetItems’ event is being triggered and the badges-resource.js initiates the GET request to have most recent list of unread items. So, we use session timings, but run our own API requests.
- Once we read (viewed) the items, we should notify the server about this fact and change the view locally. So the system marks the badges as ‘read’ locally (by using the ‘lpBadgesRead’ event) and, at the same time, it initiates the PUT API request to update the server data (by using ‘lpBadgesReadNotify’ event).
- System can mark ‘read’ all items (delta: 0) or specific numbers (i.e. delta: 1). So, trigger the ‘lpBadgesRead’ event and attach to it an object with the structure like this: {type: ‘alerts’, delta: 0} - to mark ‘read’ all alerts, or  {type: ‘notifications’, delta: 1} - to mark as ‘read’ just one notification.

##API description
- GET ‘/services/rest/v1/badges’. Returns the collection of unread items in the following format: `[{type: "messages", unread:2}, {type: "priority", unread:1}]`.
- PUT ‘/services/rest/v1/badges’. Accepts the data object of the following type: `{type: "messages", delta:0}`, where the ‘type’ property is an item type, ‘delta’ property is a positive number (if we want to mark specified number of items) or zero (0) (if we want to mark as ‘read’ all items).
 

##EVENTS LIST
- `‘lpBadgesGetItems’` (public publish).  Initiates reading the current server state and updating the view accordingly.
- `‘lpBadgesUnreadServer’`. Gets a raw collection of unread items from resource and updates the main MODEL with new updates. After that the callback emits type-specific update events.
- `‘lpBadgesUnread.<type>’` (public subscribe). Type-specific event, notifies the listening widgets, which should update the badges’ view. Sends the number of unread items of certain type.
- `‘lpBadgesRead’` (public publish). Notifies the controller about the items to be marked as ‘read’. Initiate from widget with specification of type and number of items ({type: ‘messages’, delta: 0});
- `‘lpBadgesReadNotify’`. Notifies the resource to initiate the PUT request, which should change server model of unread items.

