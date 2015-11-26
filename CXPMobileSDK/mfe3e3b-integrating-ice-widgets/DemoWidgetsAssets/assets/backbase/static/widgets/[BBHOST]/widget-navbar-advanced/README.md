 # Advanced Navbar

## Information

| name                  | version           | bundle           |
| ----------------------|:-----------------:| ----------------:|
| widget-navbar-advanced| 3.1.3 			| Universal        |

## Brief Description

Offers an integrated navigation pattern, when combined with the Launcher container.

## Dependencies

* base
* core
* ui
* jquery

## Dev Dependencies

* angular-mocks ~1.2.28
* config

## Preferences

Get widget preference `widget.getPreference(string)`


* **navRoot**: The portal root to display the nav links from
* **navLevel**: Defines if navigation level starts from "Self with siblings", or "Children" links only
* **navDepth**: Defines how many levels of nested links to resolve
* **navTemplate**: Mustache template for rendering navigation widget
* **navShow**: Shows/hides the Navbar
* **navSticky**: Set the Navbar sticky
* **showPageTitle**: Show/hide page title
* **scrollSetting**: Page scroll settings
* **launcherIcon**: Icon for Launcher menu
* **logoURL**: The URL for the logo
* **mobileLogoURL**: The URL for the mobile logo
* **navigationIconAnimationHook**: The navigation menu icon animation hook
* **containerType**: Container type selector (options: fixed or fluid)
* **showNotificationsBadge**: Shows/hides Notifications badges inside the Launcher Toggle



##Events

The following is a list of pub/sub event which the widget subscribes to:

* **launchpad-retail.activeContextChanged** - When this message is received, the widget updates the active context


The following is a list of pub/sub event which the widget publishes to:

* **launchpad-retail.stickyNavBar** - Published if preference `navSticky` was selected
* **launchpad-retail.offsetTopCorrection** - Published the size of the widget is updated
Arguments: `{ isStatic: isStatic, offsetTopCorrection: $scope.elementHeight }`
* **launchpad-retail.toggleLauncherMenu** - Published when the launcher menu is toggled (open or close)
