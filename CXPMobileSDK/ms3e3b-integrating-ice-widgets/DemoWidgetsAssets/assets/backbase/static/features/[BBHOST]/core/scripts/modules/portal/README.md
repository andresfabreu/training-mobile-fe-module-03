# Launchpad Core :: Portal Module

## Dependencies
* [Portal Client]()

## Overview

This Angular service is a layer between Launchpad widgets and portalClient.
Instead of accessing portalClient object (`b$`) directly, use this service.

## API

### lpPortal

##### .name
>String. Name of the portal.

##### .root
>String. Path to the web server root. Referred as $contextPath or $servicesPath.

``` javascript
lpPortal.root; // '/portalserver'
```

##### .linkId
>String. UUID of the link.

##### .userid
>string. uuid of the user.

##### .page
>Object. Returns objects with the following keys:  
> - name - String. Name of the page.  
> - id - String. UUID of the page.  
> - getPreference - Function. Returns preference of the current page.

``` javascript
lpPortal.page.getPreference('TemplateName'); // 'LaunchpadPageTemplate'
```

##### .designMode
>Boolean. True if page is running inside the portal manager.
