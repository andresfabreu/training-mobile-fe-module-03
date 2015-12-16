Backbase Training Exercise
==========================

CXP Mobile SDK - Module 3a: Mobile Project Development - setup MBAAS.
---------------------------------------------------------------------

### Exercise 2a

*note: This exercise is 2 of 12 in a series of exercises that follow on from
each other and should not be used independently*

#### Description

In this exercise, you will setup MBAAS and your mobile app to connect to the
mBaaS backend service.

#### We will:

-   Learn about MBAAS;

-   Learn how to use it;

-   Learn about the model and how it is used;

#### Steps

-   Configure MBAAS following the guide [Installing the
    MBaaS](<https://my.backbase.com/resources/documentation/mobile-sdk/1.2/mobileapp_install_backend.html>)

-   In your CXP Server, create a new portal called **lpmobile**;

-   Change Page Template of the Master Page to **Launchpad Page Template**

-   Add **Todo** widget on the **Default page**;

-   Verify that mBaaS is configured properly by opening this url in your web
    browser: <http://localhost:7777/portalserver/portals/lpmobile/mobile/model>,
    you should see some JSON data;

-   In your mobile application, update configs.js to point to your CXP server
    and the **lpmobile** portal

-   Copy statics with the **Todo** widget from the portal into the assets folder
    of your mobile app.

-   Build & run the app. You should now only have one tab in the app called
    **Default Page** with **Todo** widget on it;

#### Tips

-   To start CXP Server please unzip
    [training-cxp-portal-5.6.zip](<../../Resources/training-cxp-portal-5.6.zip>)
    archive, then from the root directory of the portal run install.sh (MacOS)
    or install.bat (Windows) and then run run.sh (MacOS) or run.bat (Windows);

-   To access the server from the emulator please use for Android emulator
    10.0.2.2 for the Genymotion emulator 10.0.3.2 To access the server from the
    iOS emulator use localhost:

    -   "serverURL": "http://localhost:7777/portalserver", //iOS Emulator

    -   "serverURL": "http://10.0.2.2:7777/portalserver", //Android Emulator

    -   "serverURL": "http://10.0.3.2:7777/portalserver", //Genymotion Emulator

-   To point the model to the remote CXP server for the **Android** you need to
    change **ModelSource** in the MainActivity in the loadModel() method
    ModelSource.LOCAL to **ModelSource.SERVER**

-   First time you run it probably it won't work. The log will say that
    something is wrong with the model. This is related with permissions, your
    portal must allow anonymous users to view;

-   If you don't see changes reflecting in the generated json model you probably
    need to clean the eh\_cache
    <http://localhost:7777/portalserver/ps_statistics/ehcache>
    mobileModelGroupCache and mobileModelCache

#### Additional resources

-   [training-cxp-portal-5.6.zip](<../../Resources/training-cxp-portal-5.6.zip>)

#### References

-   [Installing the
    MBaaS](<https://my.backbase.com/resources/documentation/mobile-sdk/1.2/mobileapp_install_backend.html>)
