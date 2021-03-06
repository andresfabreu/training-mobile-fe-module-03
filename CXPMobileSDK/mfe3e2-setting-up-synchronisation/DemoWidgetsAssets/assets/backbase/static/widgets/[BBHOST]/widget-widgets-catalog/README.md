# Widgets Catalog
TODO: description

# Information

| name                  | version           | bundle           |
| ----------------------|:-----------------:| ----------------:|
| widget-widgets-catalog| 1.1.4             | Launchpad        |

# Widget Checklist

 - [ ] Fault Tolerance: Widget gracefully behaves/fails with loss of connection.
 - [ ] Fault Tolerance: Widget gracefully fails if session is lost.
 - [ ] Fault Tolerance: Widget gracefully and productively handles error responses.
 - [ ] Extensibility: Look and feel is manageable via theming.
 - [ ] Security: Secure from XSS.
 - [ ] Security: Secure from CSRF.
 - [ ] Accessibility: Support for color blind users.
 - [ ] Accessibility: Support for users with motor-inability (keyboard navigation).
 - [ ] Accessibility: Support for users who are blind (screen reader).
 - [ ] i18n: All UI messages are externalized and localizable.
 - [ ] i18n: All dates and numbers are localized.
 - [ ] i18n: Works RTL.
 - [ ] Mobile: SDK compatible.
 - [ ] Mobile: Widget is responsive to mobile & tablet.
 - [ ] Documentation: Reference files linked from README.
 - [ ] Documentation: Dependencies (bower & UI components used) listed in README.
 - [ ] Documentation: Modules/classes JSDoc.
 - [ ] Documentation: Widget feature list documented.
 - [ ] Testing: Distribution folder

## Dependencies

* [base][base-url]
* [core][core-url]
* [ui][ui-url]

## Dev Dependencies

* [angular-mocks ~1.2.28][angular-mocks]
* [config][config-url]

## Preferences
- List of widget preferences

## Custom Components
- list of widget custom components (if any) 

## Develop standalone

```bash
git clone <repo-url> && cd <widget-path>
bb install -l
```

## Test

```bash
$ bb start
```

with watch flag
```
bb test -w
```


## Build

```bash
$ bb build
```


with watch flag
```
bb test -w
```



[base-url]:http://stash.backbase.com:7990/projects/lpm/repos/foundation-base/browse/
[core-url]: http://stash.backbase.com:7990/projects/lpm/repos/foundation-core/browse/
[ui-url]: http://stash.backbase.com:7990/projects/lpm/repos/ui/browse/
[config-url]: https://stash.backbase.com/projects/LP/repos/config/browse
[api-url]:http://stash.backbase.com:7990/projects/LPM/repos/api/browse/
[angular-mocks]:https://github.com/angular/bower-angular-mocks
