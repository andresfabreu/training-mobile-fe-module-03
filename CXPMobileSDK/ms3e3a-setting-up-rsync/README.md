# Backbase Training Exercise

## CXP Mobile SDK - Module 3a: Mobile Project Development

### Exercise 3a

_note: This exercise is 4 of 12 in a series of exercises that follow on from each other and should not be used independently_

#### Description

In this exercise, you will learn how to setup rsync in xCode to sync the widgets assets into your mobile app's workspace.

#### Steps

* You should have your "todo" widget from the FE training added to your portal;
* Copy the folder DemoWidgetsAssets/assets/backbase/static/conf to the parent folder(backbase);
* Adjust paths for pointing to configs.json in CXPMobile/Resources/AppDelegate.m ln83; 
* In xCode, click on the project name to open the project info;
* Select DemoWidgetsAssets bundle;
    * Go to the **Build Phases** tab
    * Click the **+** button, and choose **new run script phase**
    * Add a script and and type something like "rsync -rtvu --delete /Users/carlos/bb/training/lp56/statics/dist/itemRoot/static/ DemoWidgetsAssets/assets/backbase/static/" - Adjust accordingly to your setup;
    * The script should run before the "Copy bundle resources" phase;
* Run, it will fail to load resources; 
* We still have to deal with path changes, go to configs.json and adjust paths to scripts or other resources; 
* Note that some scripts may not be present in your portal "features" folder, like launchpad-setup.js


#### Additional resources

#### References

 - [rsync](https://rsync.samba.org/documentation.html)
 
 