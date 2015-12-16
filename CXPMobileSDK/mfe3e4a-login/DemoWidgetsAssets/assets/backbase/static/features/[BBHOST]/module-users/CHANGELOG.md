### v2.5.1 - `29/09/2015, 3:36pm`
* LF-370: removed jquery.param to lpCoreUtils.buildQueryString  
* LF-370: moved jquery param fn  
* LF-370: Added put method with custom url as an argument  

### v2.5.0 - `29/09/2015, 11:30am`
* NGUSEOLB-305: Add change password service

### v2.4.2 - `23/09/2015, 9:27am`
* NOJIRA: Undo last commit, no need param in verifyOTP service

### v2.4.1 - `22/09/2015, 3:05pm`
* Add default deliveryMethod param to resendOTP endpoint

### v2.4.0 - `22/09/2015, 2:43pm`
* Add delivery method to resend OTP code

### v2.3.0 - `18/09/2015, 3:36pm`
* NGUSEOLB-503 Add error message for too many active sesions


### v2.2.8 - `26/08/2015, 2:57pm`
#### add tag to info.json for styleguide filtering
* add tag to info.json for styleguide menu filtering


### v2.2.7 - `24/08/2015, 11:24am`
* LF-183 fix a bug where the logout API call did a get but a POST is now required in CXP.


### v2.2.6 - `11/08/2015, 5:41pm`
#### Fix model.xml format.
* LF-211: Add model.xml for feature definition.


### v2.2.5 - `11/08/2015, 1:38pm`
#### Add model.xml for feature definition.


### v2.2.4 - `10/08/2015, 6:05pm`
#### Remove repository from bower.json


### v 1.0.0
* Initial release
## [2.0.0] - 2015-05-12 (note: generated from git logs)

 - LPES-3536: Remove unused locationProvider.
 - NOJIRA: add 403 error when security risk in otp login
 - LPES-3568: handle disconnections and show nice 500 error message
 - Added testing for isVerified on authentication API.
 - Change status check functions to be case insensitive.
 - remove console
 - use dist
 - add setConfig and getConfig in API
 - ignore .bower.json

## 2.2.2
- Make page reload optional
