Backbase Training Exercise
==========================

CXP Mobile SDK - Module 3a: Mobile Project Development
------------------------------------------------------

### Exercise 4b

*note: This exercise is 7 of 10 in a series of exercises that follow on from
each other and should not be used independently*

#### Description

In this exercise, you will learn how to create a logout widget.

#### Steps

-   For CXP 5.6.2 or below, make sure **CSRF protection** is disabled in backbase.properties

-   Scaffold a new Launchpad 5.6 Widget with BB-CLI, call it **mobile-logout**;
    import it to the Enterprise Catalog

-   This widget should have a submit button

-   When the button is clicked, it should make an ajax call to
    **j\_spring\_security\_logout** endpoint

-   Create a page called **Logout** in your **lpmobile** portal

-   Update the page permissions; it should only be visible by **Authenticated**
    users

-   Add the logic in the template to reload the model upon successful logout

-   Build & run the app; test that you can logout and that the model is reloaded
    properly

#### Additional resources

-   [Widget mobile-logout](<../../Resources/widgets/mobile-logout>)

#### References
