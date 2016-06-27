Backbase Training Exercise
==========================

CXP Mobile SDK - Module 3a: Mobile Project Development
------------------------------------------------------

### Exercise 3c

*note: This exercise is 5 of 10 in a series of exercises that follow on from
each other and should not be used independently*

#### Description

In this exercise, you will learn how to access Widget Plugins from your
widget's JavaScript code.

#### Steps

-   In this new bundle, scaffold a Launchpad 5.6 Widget structure, using
    **BB-CLI**; call this widget **contact-email**

-   Import this widget in the Enterprise Catalog using the **bb import-item**
    command

-   This widget should contain one button; when you click on it, it should use
    the default **ContactPlugin** to trigger the iOS/Android e-mail client

-   Create a new page in your **lpmobile** portal called **Contact**, and drop
    the contact-email widget on the page

-   In CXP Explorer **feature.ContactPlugin** as a preference of the widget
    instance with the value **true**.

-   Build & run your app; make sure the feature works as expected

#### Additional resources

-   [Widget contact-email](<../../Resources/widgets/contact-email>)

#### References

-   [BB-CLI: Getting
    Started](<https://my.backbase.com/resources/how-to-guides/bb-cli-the-one-cli-to-rule-them-all/>)

-   [Widget
    Plugins](<https://my.backbase.com/docs/product-documentation/documentation/mobile-sdk/latest/mobileapp_plugins.html>)
