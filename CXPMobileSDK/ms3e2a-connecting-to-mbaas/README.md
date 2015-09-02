# Backbase Training Exercise

## CXP Mobile SDK - Module 3a: Mobile Project Development

### Exercise 2a

_note: This exercise is 2 of 12 in a series of exercises that follow on from each other and should not be used independently_

#### Description

In this exercise, you will setup your mobile app to connect to the mBaaS backend service.

#### Steps

 - In your CXP Server, create a new portal called **lpmobile**
 - Add some widget on the default page
 - Verify that mBaaS is configured properly by opening this url in your web browser:
 [http://localhost:7777/portalserver/portals/lpmobile/mobile/model](http://localhost:7777/portalserver/portals/lpmobile/mobile/model), you should see some JSON data
 - Also update the model loading order property in **AppDelegate.m**
 - In your mobile application, update configs.js to point to your CXP server and the **lpmobile** portal
 - Build & run the app. You should now only have one tab in the app called **Default Page**

#### Additional resources

#### References

 - [CXP Mobile Configuration](https://my.backbase.com/resources/documentation/mobile-sdk/0.11-beta/mobileapp_config_file.html)
