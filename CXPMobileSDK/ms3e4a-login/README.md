# Backbase Training Exercise

## CXP Mobile SDK - Module 3a: Mobile Project Development

### Exercise 4a

_note: This exercise is 7 of 12 in a series of exercises that follow on from each other and should not be used independently_

#### Description

In this exercise, you will learn how to create a login widget to authenticate the users of your mobile app.

#### Steps

 - In your **mobile-training** bundle, scaffold a new Launchpad Widget structure with BB-CLI, call it **mobile-login**; import it to the Enterprise Catalog
 - This widget should have two input fields (username, password) and a submit button
 - When the button is clicked, it should make an ajax call to **j_spring_security_check** endpoint, passing the **Req-X-Auth-Token** header
 - Place this widget on the **Default Page** in your **lpmobile** portal
 - Update the page permissions; the **Default Page** should only be visible to **Anonymous** users, and all other pages should only be visible by **Authenticated** users
 - Add the logic in the template to reload the model upon successful authentication
 - Build & run the app; test that you can login and that the model is reloaded properly

#### Additional resources

#### References
