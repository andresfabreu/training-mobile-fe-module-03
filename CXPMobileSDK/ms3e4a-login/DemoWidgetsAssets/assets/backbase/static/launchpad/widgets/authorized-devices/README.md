# widget-authorized-devices

Widget that displays authorized devices.

# Information
| name                           | version       | bundle     |
| -------------------------------|:-------------:| ----------:|
| widget-authorized-devices      | 1.0.0         | launchpad  |


# Widget Checklist

[ ] Fault Tolerance: Widget gracefully behaves/fails with loss of connection.

[ ] Fault Tolerance: Widget gracefully fails if session is lost.

[ ] Fault Tolerance: Widget gracefully and productively handles error responses.

[ ] Extensibility: Look and feel is manageable via theming.

[ ] Security: Secure from XSS.

[ ] Security: Secure from CSRF.

[ ] Accessibility: Support for color blind users.

[ ] Accessibility: Support for users with motor-inability (keyboard navigation).

[ ] Accessibility: Support for users who are blind (screen reader).

[ ] i18n: All UI messages are externalized and localizable.

[ ] i18n: All dates and numbers are localized.

[ ] i18n: Works RTL.

[ ] Mobile: SDK compatible.

[ ] Mobile: Widget is responsive to mobile & tablet.

[ ] Documentation: Reference files linked from README.

[ ] Documentation: Dependencies (bower & UI components used) listed in README.

[ ] Documentation: Modules/classes JSDoc.

[ ] Documentation: Widget feature list documented.

[ ] Testing: Distribution folder


# Dependencies

* [base](http://stash.backbase.com:7990/projects/lpm/repos/foundation-base/browse/)
* [core](http://stash.backbase.com:7990/projects/lpm/repos/foundation-core/browse/)
* [ui](http://stash.backbase.com:7990/projects/lpm/repos/ui/browse/)
* [module-devices](http://stash.backbase.com:7990/projects/lpm/repos/module-devices/browse/)


# Preferences

* **devicesEndpoint**

> points to the location from where data is obtained

> The actual data provider is [Devices API](http://stash.backbase.com:7990/projects/lpm/repos/module-devices/browse/)

* **locale**

> sets up the language used e.g. 'nl-NL'

# Components Used

* [lp-card](https://stash.backbase.com/projects/LPM/repos/ui/browse/scripts/components/card) in [ui](http://stash.backbase.com:7990/projects/lpm/repos/ui/browse/)


# Develop Standalone

## Build

`npm run build`

## Run

**Start the Data API**

* Install and run [api](http://stash.backbase.com:7990/projects/lp/repos/api/browse/) to feed data into your widget.

> `npm i && npm start` in the corresponding project folder

> The data API is obtained from http://[your_host]:3030/api/v1/authorized-devices


**Start the widget**

> `npm i && bower i && npm start`


## Test

`npm test`
