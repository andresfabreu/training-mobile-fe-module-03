# Notifications

## Information

| name                  | version           | bundle           |
| ----------------------|:-----------------:| ----------------:|
| widget-notifications    | 2.3.6 			| Universal        |

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

## Notification structure

In order to render well, widget expects the structure of the provided notification object to have proper format. Here is a typical way to way to trigger new notification:

```
bus.publish('launchpad.add-notification', {
    notification: {
        id: 'error.transaction-list.500',
        container: {
            type: 'overlay',
            templateUrl: 'templates/retry.html'
        },
        level: 'severe', // warning, success, info
        closable: true,
        data: {
            message: 'Could not submit transaction for "{{amount}}".',
            values: {amount: 123.50}
        }
    }
});
```

### Notification configuration

* **id** {String} - Unique identification string. If notification with such id is already present, new one will overwrite previous. This can be used to update notification content, change template, container type, etc.
* **container** {Object} - Container provides configuration for the element holding rendered notifications.
    * **container.type** {String} - Type of the container. Two types are supported at the moment:
        - panel (default) - Notification is rendered as panel bar.
        - overlay - Notification is rendered in the modal-like semi-transparent overlay, covering page contents.
    * **template** {String} - Template to be used to render notification.
* **level** {String} - Type of the notification message. Background or icon color of the notification depends on this setting. Available types are:
    - severe - For error messages (red background).
    - warning - For non-error warnings (orange-brown).
    - info - Information messages.
    - success - Successful operation fulfillment.
* **closable** {Boolean} - Whether notification should render close button or not.
* **data** {Object} - Data that will be passed into notification template for rendering.
    - message {String} - Message

## Templates

Widget uses templates with the following keys:

* **type-panel** - Notification rendered as panels.
* **type-overlay** - Notifications rendered as list in modal overlay.
* **offline** - Notification template for offline message warning.
* **retry** - Template used by retry mechanism on network/service error.

To redefine template create preference with this format: widgetTemplate_{templateKey}.

For example, for panel template create property `widgetTemplate_type-panel` with the value equal to a path to load template from. The path can either be local relative path or external absolute path (http:// and https:// protocols).


## Test


## Build
