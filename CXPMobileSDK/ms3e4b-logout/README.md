# Backbase Training Exercise

## CXP Mobile SDK - Module 3a: Mobile Project Development

### Exercise 4b

_note: This exercise is 8 of xxx in a series of exercises that follow on from each other and should not be used independently_

#### Description

In this exercise, you will learn how to create a logout widget.

#### Steps

 - In your **mobile-training** bundle, scaffold a new Launchpad Widget structure with BB-CLI, call it **mobile-logout**; import it to the Enterprise Catalog
 - This widget should have a submit button
 - When the button is clicked, it should make an ajax call to **j_spring_security_logout** endpoint
 - Create a page called **logout** in your **lpmobile** portal
 - Update the page permissions; it should only be visible by **Authenticated** users
 - Add the logic in the template to reload the model upon successful logout
 - Build & run the app; test that you can logout and that the model is reloaded properly

#### Additional resources

#### References

 - [How to create bundles](https://my.backbase.com/resources/how-to-guides/what-are-bundles-how-can-they-help-me-and-how-do-i-make-them/)
 - [BB-CLI: Getting Started](https://my.backbase.com/resources/how-to-guides/bb-cli-the-one-cli-to-rule-them-all/)
 - [Widget Features](https://my.backbase.com/resources/documentation/mobile-sdk/0.11-beta/mobileapp_widgetfeatures.html)
