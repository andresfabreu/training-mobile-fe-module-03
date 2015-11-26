# Backbase Training Exercise

## CXP Mobile SDK - Module 3a: Mobile Project Development

### Exercise 6a

_note: This exercise is 10 of 12 in a series of exercises that follow on from each other and should not be used independently_

#### Description

In this exercise, you will learn how to setup preload and retain properties on your widget, and how to implement the pub/sub event informing the SDK of the loading of a given widget.

#### Steps

 - Create two new Launchpad 5.6 widgets using BB-CLI: **account-list** and **account-details**; import them to your portal
 - Create a new page called **Accounts**, add the **account-list** widget on that page
 - Create a sub page called **Details**, add the **account-details** widgets on it
 - The account-list widget should read data from an angular service returning the data provided in [Resources/accounts-list.json](../../Resources/accounts-list.json) and display the accounts in a list (use Twitter Bootstrap's **list-group** styles)
 - When clicking on one of the accounts in the account-list widget, it should send a pubsub event **account-details**
 - In **DemoWidgetsAssets/assets/backbase/static/conf/configs.js**, add a behaviour to map the **account-details** behaviour to the **/lpmobile/accounts/details** target - [**this changed in 1.3**](https://my.backbase.com/resources/documentation/mobile-sdk/1.3/mobileapp_nav_informer.html#mobileapp_behaviormap) - the model can now declare the navigation mapping.
 - Build & run your app; make sure that it lists the accounts, and when clicking on them, you are redirected to the details view

#### Additional resources

 * [Account List JSON data](../../Resources/accounts-list.json)
 * [Behaviour Mapping](https://my.backbase.com/resources/documentation/mobile-sdk/1.2/mobileapp_nav_informer.html)   

#### References
