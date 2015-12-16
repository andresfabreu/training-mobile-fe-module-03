# Login Multifactor

## Information

| name                  | version           | bundle           |
| ----------------------|:-----------------:| ----------------:|
| widget-login-multifactor    | 2.7.5 			| Universal        |

## Brief Description
Provides the ability to login using both simple authentication or 2-step authentication. The second step of the authentication is based on TOTP. Optionally, it also allows the user to register the device where he/she is accessing the application.

## Dependencies

* base
* core
* ui
* module-users

## Dev Dependencies

* angular-mocks ~1.2.28
* config

## Preferences

Get widget preference `widget.getPreference(string)`


* **prefixSessionUrl**: 
* **initiateEndPoint**:
* **otpEndPoint**:
* **serverRoot**:
* **portalName**:
* **pageName**:
* **timerSeconds**: total time for OTP. Defaults to 60
* **timerHideSeconds**: time that timer remains hidden. Thus the timer countdown is for (timerSeconds - timerHideSeconds). Defaults to 0.
   

##Events

_This widget does not publish or subscribe to any events._
