# Backbase Training Exercise

## CXP Mobile SDK - Module 3a: Mobile Project Development  - setup MBAAS.

### Exercise 2a

_note: This exercise is 2 of 12 in a series of exercises that follow on from each other and should not be used independently_

#### Description

In this exercise, you will setup MBAAS and your mobile app to connect to the mBaaS backend service.

#### We will:
* Learn about MBAAS;
* Learn how to use it;
* Learn about the model and how it is used;

#### Steps

 - In your CXP Server, create a new portal called **lpmobile**;
 - Add some widget on the default page;
 - Verify that mBaaS is configured properly by opening this url in your web browser:
 [http://localhost:7777/portalserver/portals/lpmobile/mobile/model](http://localhost:7777/portalserver/portals/lpmobile/mobile/model), you should see some JSON data;
 - In your mobile application, update configs.js to point to your CXP server and the **lpmobile** portal;
 - Build & run the app. You should now only have one tab in the app called **Default Page**;

#### Tips

* First time you run it probably it won't work. The log will say that something is wrong with the model. This is related with permissions, your portal must allow anonymous users to view;

#### References

 - [Installing the MBaaS](https://my.backbase.com/resources/documentation/mobile-sdk/1.2/mobileapp_install_backend.html)
