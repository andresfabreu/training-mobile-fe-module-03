# Notifications

## Information

| name                  | version           | bundle           |
| ----------------------|:-----------------:| ----------------:|
| widget-notifications    | 2.0.1 			| Universal        |

## Brief Description

Provides a platform to display notifications to a user in a portal page.
Messages are pushed to the user(s) by displaying them on the portal page they are currently visit. Typically, the widget will be placed outside a manageable area within a master page, so it appears by default on every page, although it could be used in other contexts.
The mechanism can be fed with messages from various sources. The Notifications widget can be configured to access notifications via a remote endpoint or it may receive messages via a pubsub channel.

## Dependencies

* base
* core
* ui


## Dev Dependencies

* angular-mocks ~1.2.28
* config

## Preferences

Get widget preference `widget.getPreference(string)`

* **fixedBar**: Enable/disables sticky notification on top
* **notificationsEndpoint**: The endpoint to retrieve notifications
* **closeNotificationEndpoint**: If a user closes a message, a PUT request containing the message id should be sent to this URI to sync closing the message with the server, so it will not be sent again
* **allowPubsub**: Enables/disables the widget to listen for notifications via a pubsub channel
* **pollInterval**: Interval (in miliseconds) at which to poll the _messagesEndpoint_ for new notifications. If value is set to zero (value=0); polling will be turned off



##Events

The following is a list of pub/sub event which the widget subscribes to:

* **launchpad.add-notification** - When this message is received, a new notification is added
* **launchpad.remove-notification** - When this message is received, the notification is removed
* **launchpad-retail.offsetTopCorrection** -


The following is a list of pub/sub event which the widget publishes to:

_TODO_

## Test


## Build
