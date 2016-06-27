# Profile Preferences

## Information

| name                  | version           | bundle           |
| ----------------------|:-----------------:| ----------------:|
| widget-profile-preferences    | 2.2.5 			| Universal        |

## Brief Description

Provides an easy way for user to update preferences related to the Portal experience and Internet Banking.

## Dependencies

* base
* core
* ui
* module-accounts

## Dev Dependencies

* angular-mocks ~1.2.28
* config

## Preferences

* **preferenceService**: The end-point URL to store users preferences
* **accountsDataSrc**: The end-point URL to retrieve user accounts data
   

##Events

_This widget does not subscribe/publish to any events._

## Templates

Widget uses templates with the following keys:

* profile-preferences - Main widget template.

To redefine template create preference with this format: widgetTemplate_{templateKey}.

For example, for main template create property `widgetTemplate_profile-preferences` with the value equal to a path to load template from. The path can either be local relative path or external absolute path (http:// and https:// protocols).