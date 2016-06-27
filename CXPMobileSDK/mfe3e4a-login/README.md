Backbase Training Exercise
==========================

CXP Mobile SDK - Module 3a: Mobile Project Development
------------------------------------------------------

### Exercise 4a

*note: This exercise is 6 of 10 in a series of exercises that follow on from
each other and should not be used independently*

#### Description

In this exercise, you will learn how to create a login widget to authenticate
the users of your mobile app.

#### Steps

-   Scaffold a new Launchpad 5.6 Widget with BB-CLI, call it **mobile-login**;
    import it to the Enterprise Catalog

-   This widget should have two input fields (username, password) and a submit
    button

-   When the button is clicked, it should make an ajax call to
    **j\_spring\_security\_check** endpoint, passing the **Req-X-Auth-Token**
    header

-   Place this widget on the **Default Page** in your **lpmobile** portal

-   Update the page permissions; the **Default Page** should only be visible to
    **Anonymous** users, and all other pages should only be visible by
    **Authenticated** users

-   Add the logic in the template to reload the model upon successful
    authentication

-   Build & run the app; test that you can login and that the model is reloaded
    properly

#### Tips

-   For **iOS** please check ln112 of the AppDelegate, it creates an event
    listener for the "login-success" event. On ln261 there is the method
    implementation;

-   For **Android** please check ln80 of the MainActivity.java, it creates an
    event listener for the "login-success" event. On ln153 there is the method
    implementation;

#### Additional resources

-   [Widget mobile-login](<../../Resources/widgets/mobile-login>)

#### References
