Backbase Training Exercise
==========================

CXP Mobile SDK - Module 3a: iOS/Android Project Development
-----------------------------------------------------------

### Exercise 1

*note: This exercise is 1 of 10 in a series of exercises that follow on from
each other and should not be used independently*

#### Description

In this exercise, you will scaffold, build and run your first iOS/Android
project using Backbase CXP Mobile SDK.

#### We will:

###### iOS platform

-   Become familiar with xCode;

-   Learn about the iOS project folder structure;

###### Android platform

-   Become familiar with Android Studio;

-   Learn about the Android project folder structure;

#### Steps

###### iOS platform

-   Download mobile template for iOS version 2.3

-   Copy content of the template into iOS folder

-   Open **iOS** folder

-   Double-click on **CXPMobile.xcodeproj** to open the template in xCode

-   Reassign assets to a folder ../DemoWidgetsAssets:

    -   Click on the DemoWidgetsAssets folder in the projects tree

    -   On the right panel find the Location section and click the “folder” icon

    -   Navigate up to ../DemoWidgetsAssets and select that folder entirely

    -   Now you can remove iOS/DemoWidgetsAssets folder from the template as
        unused folder

-   Build the project and run it in the iOS simulator(if you get errors on build
    clean the project - Product/Clean)

###### Android platform

-   Download mobile template for Android version 2.3

-   Run Android Studio

-   Click **Open an existing Android Studio project** menu item

-   Select **Android** folder in the unzipped templates folder

-   Reassign assets to a folder ../DemoWidgetsAssets:

    -   Find the app’s build.gradle file

    -   Add following lines to the gradle in the **android** section like this:

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
android {
    ...
    sourceSets {
        main.assets.srcDirs  += ['../../DemoWidgetsAssets/assets']
    }
}
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
-   Now you can remove Android/app/src/main/assets/static folder from the
    template as unused folder
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

-   Build the project and run it in the Android simulator(if you get errors on
    build clean the project - Build/Clean Project)

#### References

-   [Download Android App
    Templates](<https://bitbucket.org/backbase/mobile-demo-app-android/src/?at=2.3.0>)

-   [Download iOS App
    Templates](<https://bitbucket.org/backbase/mobile-demo-app-ios/src/?at=2.3.0>)
