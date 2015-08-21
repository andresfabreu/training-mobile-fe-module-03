# Backbase Training Exercise

## CXP Mobile SDK - Module 3a: Mobile Project Development

### Exercise 3c

_note: This exercise is 6 of 12 in a series of exercises that follow on from each other and should not be used independently_

#### Description

In this exercise, you will learn how to access Widget Features from your widget's JavaScript code.

#### Steps

 - In your CXP Server, create a new bundle following the bundle how-to guide; call it **mobile-training**
 - In this new bundle, scaffold a Launchpad 12 Widget structure, using **BB-CLI**; call this widget **contact-email**
 - Import this widget in the Enterprise Catalog using the **bb sync** command
 - Update the build phase in your mobile project to also copy the assets from this bundle to your app's workspace
 - This widget should contain one button; when you click on it, it should use the default **ContactFeature** to trigger the iOS e-mail client
 - Create a new page in your **lpmobile** portal called **Contact**, and drop the contact-email widget on the page
 - Add  the **contactFeature** as a preferences of the page in CXP Explorer
 - Build & run your app; make sure the feature works as expected

#### Additional resources

#### References

 - [How to create bundles](https://my.backbase.com/resources/how-to-guides/what-are-bundles-how-can-they-help-me-and-how-do-i-make-them/)
 - [BB-CLI: Getting Started](https://my.backbase.com/resources/how-to-guides/bb-cli-the-one-cli-to-rule-them-all/)
 - [Widget Features](https://my.backbase.com/resources/documentation/mobile-sdk/0.11-beta/mobileapp_widgetfeatures.html)
