CXP Mobile Demo
======

This repo contains:
+ Collection of Mobile App demo widgets
+ Required resources to succesfully run demo widgets in Mobile App
+ Mobile Demo page template to visualize demo widgets in [Backbase CXP](http://backbase.com)
+ Master page to be used with Mobile Demo page template

To create a Page containing Demo widgets in Backbase CXP Manager, a number of preparation steps have to be done:
1. [Import demo widgets](#import-widgets) into CXP
2. [Import page template](#import-template)
3. [Import master page](#import-page)
4. [Import mobile configuration dependencies](#import-dependencies)
5. [Configure master page](#configure-page)

After all these steps are done, multiple new items will be created in Enterprise Catalog - CXP Mobile Demo Template (page template), CXP Mobile Demo (master page) and a number of Demo Widgets. They can be added to any Portal Catalog and used to create new Page with mobile demo widgets on it. Use [documentation](https://my.backbase.com/resources/documentation/portal/5.6.0/cxpmanager.html) for details.

## Requirements

- [Node.js](http://nodejs.org/)
- [Backbase CLI tools](https://github.com/Backbase/bb-cli)

## Install prerequisites

Before importing widgets and templates, prerequisites have to be installed. This can be done by running `npm i` command in the root repo folder.

## <a name="import-widgets"></a>Import demo widgets

Before importing widgets to CXP Manager, widget packages have to be prepared for import. This can be done by navigating in console to the root repo folder and running command:

```
npm run build-widgets
```

After this, widgets can be imported in either manual way or with use of CLI tool.

### a. Import widgets with CLI

To import demo widgets, navigate in console to the root repo folder and run following command for each widget in `static/widgets/[BBHOST]` folder:

```
bb import-item -t 'static/widgets/[BBHOST]/{widget-name}'
```
or simply run this shortcut command, which will do the same:

```
npm run import-widgets
```

This will create package for each demo widget and then will import all widget packages to CXP Manager. bb cli tool defaults CXP Manager's url to `http://localhost:7777/portalserver`. To import to a different url, additional parameters can provided to bb cli tool. Use this command for details:

```
bb import-item -h
```

### b. Import widgets manually
To import demo widgets to CXP Manager manually follow these steps:
1. Navigate to each folder in `static/widgets/[BBHOST]/...` and create zip package with content of each folder
2. In browser go to CXP Manager you want to import to
3. Follow [this documentation](https://my.backbase.com/resources/documentation/portal/5.6.0/catalogitems_importviacxp.html) to import all previously created packages to CXP Manager

## <a name="import-template"></a>Import page template

Page template can be imported to CXP Manager in two different ways – using CLI or manually.

### a. Import page template with CLI

To import page template in CLI, navigate in console to the root repo folder and run command:

```
bb import-item -t 'static/templates/[BBHOST]/mobile-page-template'
```
or simply run this shortcut command, which will do the same:

```
npm run import-pt
```

This will import page template to CXP Manager. bb cli tool defaults CXP Manager's url to `http://localhost:7777/portalserver`. To import to a different url, additional parameters can provided to bb cli tool. Use this command for details:

```
bb import-item -h
```

### b. Import page template manually

To import page template to CXP Manager manually follow these steps:
1. Navigate to `static/templates/[BBHOST]/mobile-page-template` and zip content of this folder
2. In browser go to CXP Manager you want to import to
3. Follow [this documentation](https://my.backbase.com/resources/documentation/portal/5.6.0/catalogitems_importviacxp.html) to import previously created package to CXP Manager

## <a name="import-page"></a>Import master page

Master page can be imported to CXP Manager in two different ways – using CLI or manually.

### a. Import master page with CLI

To import master page in CLI, navigate in console to the root repo folder and run command:

```
bb import-item -t 'static/pages/[BBHOST]/mobile-master-page'
```
or simply run this shortcut command, which will do the same:
```
npm run import-mp
```

This will import master page to CXP Manager. bb cli tool defaults CXP Manager's url to `http://localhost:7777/portalserver`. To import to a different url, additional parameters can provided to bb cli tool. Use this command for details:

```
bb import-item -h
```

### b. Import master page manually

To import master page to CXP Manager manually follow these steps:
1. Navigate to `static/pages/[BBHOST]/mobile-master-page` and zip content of this folder
2. In browser go to CXP Manager you want to import to
3. Follow [this documentation](https://my.backbase.com/resources/documentation/portal/5.6.0/catalogitems_importviacxp.html) to import previously created package to CXP Manager

## <a name="import-dependencies"></a>Import mobile configuration dependencies

Mobile page template contains functionality to load Mobile configuration file, parse it and include style/script resource out of it to the page. All resources from mobile configuration file have to be available from the portal server. Thus they have to be imported to CXP Manager upfront.

`conf/configs-ios.json` or `conf/configs-android.json` file in this repository uses the following resources (which are not part of Launchpad and have to be imported explicitly):
* `static/features/[BBHOST]/theme-mobile-demo`
* `static/features/[BBHOST]/fastclick`
* `static/features/[BBHOST]/launchpad`

Those resources can be imported to CXP Manager in two different ways – using CLI or manually.

### a. Import dependencies with CLI

To import mobile configuration dependencies in CLI, navigate in console to the root repo folder and run the following command for each dependency from the list above:

```
bb import-item -t '[PATH_TO_DEPENDENCY_RESOURCE]'
```
or simply run this shortcut command, which will do the same:
```
npm run import-dependencies
```

This will import mobile configuration dependencies to CXP Manager. bb cli tool defaults CXP Manager's url to `http://localhost:7777/portalserver`. To import to a different url, additional parameters can provided to bb cli tool. Use this command for details:

```
bb import-item -h
```

### b. Import dependencies manually

To import dependency resources to CXP Manager manually follow these steps:
1. Navigate to each folder from the list above and zip content of context folder
2. In browser go to CXP Manager you want to import to
3. Follow [this documentation](https://my.backbase.com/resources/documentation/portal/5.6.0/catalogitems_importviacxp.html) to import all previously created packages to CXP Manager

## <a name="configure-page"></a>Configure master page

Mobile page template contains functionality to load Mobile configuration file, parse it and include style/script resource out of it to the page. Thus we should provide a **path to mobile configuration file** and one more additional configuration property - **mobile context root**. Mobile context root - is path to static assets on mobile environment. For example, for `conf/configs-ios.json` or `conf/configs-android.json` file in this repository, mobie context root will be `demo-widgets`.

To configure master page follow these steps (because of [BACKLOG-9674](https://backbase.atlassian.net/browse/BACKLOG-9674), for now it can only be done from Portal Catalog):
1. Open browser and navigate to CXP Manager. Open Portal you want to use.
2. Browse to Portal Catalog and look for `CXP Mobile Master Page`. If it's not there yet, add it from Enterprise Catalog.
3. Open Settings dialog and go to Properties tab.
4. Find `Mobile Configuration URL` property and fill it with URL to mobile configuration file. It can be absolute URL or realative to portal server (with use of $(contextRoot) ).
5. Find `Mobile Context Root` property and fill it with correct value.
6. Save settings.