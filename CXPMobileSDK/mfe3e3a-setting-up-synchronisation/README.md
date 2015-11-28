Backbase Training Exercise
==========================

CXP Mobile SDK - Module 3a: Mobile Project Development
------------------------------------------------------

### Exercise 3a

*note: This exercise is 4 of 12 in a series of exercises that follow on from
each other and should not be used independently*

#### Description

In this exercise, you will learn how to setup Rsync for Xcode and Gradle for
Android Studio to sync the widgets assets into your mobile app's workspace.

#### Steps

#### iOS Platform and Rsync

-   You should have your **Todo** widget added to your portal;

-   Copy the folder DemoWidgetsAssets/assets/backbase/static/conf to the parent
    folder(backbase);

-   Adjust paths for pointing to configs.json in
    CXPMobile/Resources/AppDelegate.m ln83;

-   Run, it will fail to load resources;

-   We still have to deal with path changes, go to configs.json and adjust paths
    to scripts or other resources;

-   Note that some scripts may not be present in your portal "features" folder,
    like launchpad-setup.js or fastclick.js, you may need to keep them outside
    of static folder:

    -   Create folder DemoWidgetsAssets/assets/backbase/libs for mobile specific
        libraries;

    -   Copy fastclick folder from
        static/com.backbase.cxp-demo/libraries/fastclick to the created
        directory;

    -   Copy launchpad/launchpad-setup.js from
        static/com.backbase.cxp-demo/libraries/launchpad/launchpad-setup.js to
        the created directory as libs/launchpad/launchpad-setup.js;

-   Then you need to setup **Rsync** for Build Phases:

    -   Select DemoWidgetsAssets bundle;

        -   Go to the **Build Phases** tab

        -   Click the **+** button, and choose **new run script phase**

        -   Add a script and and type something like

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
rsync -rtvu --delete /[path_to_your_portal]/training-cxp-portal-5.6/statics/dist/itemRoot/static/
DemoWidgetsAssets/assets/backbase/static/
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Adjust accordingly to your setup;

-   The script should run before the "Copy bundle resources" phase;

#### Android platform and Gradle

-   You should have your **Todo** widget added to your portal;

-   Copy the folder DemoWidgetsAssets/assets/backbase/static/conf to the parent
    folder(backbase);

-   Adjust paths for pointing to configs.json in BackbaseApplication.java ln9;

-   Run, it will fail to load resources;

-   We still have to deal with path changes, go to configs.json and adjust paths
    to scripts or other resources;

-   Note that some scripts may not be present in your portal "features" folder,
    like launchpad-setup.js or fastclick.js, you may need to keep them outside
    of static folder:

    -   Create folder DemoWidgetsAssets/assets/backbase/libs for mobile specific
        libraries;

    -   Copy fastclick folder from
        static/com.backbase.cxp-demo/libraries/fastclick to the created
        directory;

    -   Copy launchpad/launchpad-setup.js from
        static/com.backbase.cxp-demo/libraries/launchpad/launchpad-setup.js to
        the created directory as libs/launchpad/launchpad-setup.js;

-   Then you need to setup Gradle task to sync static resources, add these lines
    to the end of the /app/build.Gradle file:

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
def staticsMobile = '../../DemoWidgetsAssets/assets/backbase/static'

def staticsPortal = '../../../training-cxp-portal-5.6/statics/dist/itemRoot/static'

task syncStatics(type: Copy){
    delete "$staticsMobile"
    from "$staticsPortal"
    into "$staticsMobile"
}

gradle.projectsEvaluated {
    syncStatics.execute();
}
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Most probably you need to adjust paths to the statics of your portal and mobile.

-   Run Gradle

-   Let’s test how it works, for that please do fillowing:

    -   Go to the portals static collection

    -   Add some lines to the **Todo** widget

    -   Run bb-cli to import widget

    -   Check in the browser how it looks like

    -   Buid & Run your mobile project, it will sync static folder of the portal
        with the mobile statics

    -   Check the page with Todo widget in the Emulator

#### Tips

-   If you need to exclude some static non-mobile resources for Android use
    Gradle command:

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
exclude 'ext/react'
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    For Xcode use flag:

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
--exclude 'libs/ext/react'
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

#### Additional resources

#### References

-   [Rsync](<https://rsync.samba.org/documentation.html>)

-   [Gradle](<https://docs.gradle.org/current/userguide/userguide.html>)
