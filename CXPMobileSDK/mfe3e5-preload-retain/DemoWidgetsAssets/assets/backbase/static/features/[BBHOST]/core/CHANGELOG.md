### v2.12.4 - `29/09/2015, 10:19am`
* LF-370: moved service to deprecated from migration
* LF-370: removed dependencies
* LF-370: Moved ProfileContactService to deprecated

### v2.12.3 - `28/09/2015, 7:13pm`
* warn if local storage is not working
* LF-375 remove unused modules

### v2.12.2 - `28/09/2015, 5:51pm`
* add deprecated modules
* deprecate formDataPersistance

### v2.12.1 - `24/09/2015, 3:37pm`
* LF-361-migrate-profile-details-service

### v2.12.0 - `23/09/2015, 4:15pm`
* LF-358 Migrate PreferenceService to the lpUsersPreference in module-users.

### v2.11.4 - `23/09/2015, 3:03pm`
* Add variable replacement if the i18n path is set in the Launchpad object

### v2.11.3 - `10/09/2015, 6:01pm`
* LF-68: moved preconfigure logic into service providers from base require-widget, added widget provider


### v2.11.2 - `03/09/2015, 3:32pm`
* LF-132: Renamed lpCoreTemplate API, added respolvePath method, moved directive getTemplate function


### v2.11.1 - `01/09/2015, 6:11pm`
* ignore 401 and 403 status from being notifiable


### v2.11.0 - `01/09/2015, 2:31pm`
* LF-177 Added contextId parameter to retryObject for notification grouping.
* LF-177 HTTP interceptor method for configuring notification and retry queue behavior. Documentation updated.


### v2.10.3 - `31/08/2015, 10:33am`
* add missing module accounts properties


### v2.10.2 - `26/08/2015, 4:19pm`
* add tag to info.json for styleguide menu filtering
* bugfix/LF-241-new-transfer-widget-all-the-accounts: - new validation function is added into core/utils/is (it is moved from         _migration)
* Add angular helper methods
* adding i18n menu instructions for client portal
* bugfix - remove util deps, detect localstorage suport
* remove util global from migration some files
* LF-211: Fix model.xml format.
* LF-211: Add model.xml for feature definition.
* Remove stash repository from bower.json
* add defaultLandingPage property to lpPortal
* NOJIRA: Add function to check if string is valid UUID
* LPMAINT-8 URL decode lpTemplate src path.
* Fix problem with hardcoded value of url to use setConfig


### v2.10.1 - `26/08/2015, 2:57pm`
#### add tag to info.json for styleguide filtering
* add tag to info.json for styleguide menu filtering


### v2.10.0 - `25/08/2015, 11:19am`
* Add angular helper methods
* adding i18n menu instructions for client portal


### v2.9.6 - `12/08/2015, 1:25pm`
* bugfix - remove util deps, detect localstorage suport
* remove util global from migration some files


### v2.9.5 - `12/08/2015, 12:01pm`
* remove util global from migration some files


### v2.9.4 - `11/08/2015, 5:41pm`
#### Fix model.xml format.
* LF-211: Add model.xml for feature definition.


### v2.9.3 - `11/08/2015, 1:38pm`
#### Add model.xml for feature definition.


### v2.9.2 - `10/08/2015, 6:05pm`
#### Remove repository from bower.json
* Add distribution file.
* Add code review suggestions.
* Fix problem with hardcoded value of url to use setConfig


### v2.9.1 - `07/08/2015, 2:46pm`
* add defaultLandingPage property to lpPortal
* Rebuild dist
* NOJIRA: Bump version no
* NOJIRA: clean up unit tests
* NOJIRA: Add function to check if string is valid UUID
* LPMAINT-8 URL decode lpTemplate src path.
* LF-136 fix exception if there is no portalView
* fixed i18n locale event order (it was a 'pub' before a 'sub')


### v2.9.0 - `31/07/2015, 10:44am`
* NOJIRA: Add function to check if string is valid UUID


##v 2.5.0
- updated documentation

##v 2.3.1
- adding **lpCoreError.assert** method

##v 2.7.0
- removing element-resize directive (but it has moved to UI 2.4.0).

##v 2.8.4
- LF-136 fix exception if there is no portalView
