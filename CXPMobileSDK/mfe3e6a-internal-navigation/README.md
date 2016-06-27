Backbase Training Exercise
==========================

CXP Mobile SDK - Module 3a: Mobile Project Development
------------------------------------------------------

### Exercise 6a

*note: This exercise is 9 of 10 in a series of exercises that follow on from
each other and should not be used independently*

#### Description

In this exercise, you will learn how to setup internal navigation between pages.

#### Steps

-   Create two new Launchpad 5.6 widgets using BB-CLI: **account-list** and
    **account-details**; import them to your portal

-   Create a new page called **Accounts**, add the **account-list** widget on
    that page

-   Create a sub page called **Details**, add the **account-details** widgets on
    it

-   The account-list widget should read data from an angular service returning
    the data provided in
    [Resources/accounts-list.json](../../Resources/accounts-list.json) and
    display the accounts in a list (use Twitter Bootstrap's **list-group**
    styles)

-   When clicking on one of the accounts in the account-list widget, it should
    send a pubsub event **account-details**

-   In the CXP Manager open Explorer tool, navigate to the details page and
    create property called **navigation** with the value **account-details**.
    The value is equal to the name of the event triggered for opening that page.

-   Build & run your app; make sure that it lists the accounts, and when
    clicking on them, you are redirected to the details view

#### Additional resources

-   [Account List JSON
    data](../../Resources/accounts-list.jsonhttps://my.backbase.com/docs/product-documentation/documentation/mobile-sdk/latest/mobileapp_nav_informer.html)

#### References
