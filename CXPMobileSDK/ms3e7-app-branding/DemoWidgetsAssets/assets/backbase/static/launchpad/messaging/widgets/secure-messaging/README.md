# Secure Messaging

## Information

| name                  | version           | bundle           |
| ----------------------|:-----------------:| ----------------:|
| widget-secure-messaging    | 1.0.0 			| Messaging        |

## Brief Description

Displays conversation threads of secure messages between the bank and the customer, similar to an e-mail application. Provide functionalities such as List of Unread Messages, Draft Messages, Read Messages, Archived Messages and also actions to Reply, Archive, Delete a Message.

## Dependencies

* base
* core
* ui
* module-useres

## Dev Dependencies

* angular-mocks ~1.2.28
* config

## Preferences

Get widget preference `widget.getPreference(string)`

* **recipientsSrc**: The endpoint URL to the recipients data
* **letterSrc**: The endpoint URL to the letter (messages) data
* **threadSrc**: The endpoint URL to the thread data
* **categoryList**: Comma-separated list of categories
   

##Events

_This widget does not subscribe/publish any events._