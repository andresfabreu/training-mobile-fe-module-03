# widget-alert-messages
Backbase Launchpad widget based on angularjs

#Information
| name                     | version       | bundle     |
| -------------------------|:-------------:| ----------:|
| widget-alert-messages    | 1.0.0         | launchpad  |


## Brief Description
Widget is designed to provide a user an ability to manage 'automations' for his activity.
For the purposes of this widget 'automation' stands for a server-side db record, which is
a shorthand to several services, which provide some extra functionality to user: for example, user
wants to be notified by e-mail if account is being loaded with transfers with a certain amount, etc.

## Create new automation
To start creation a new automation you should click a right-top button. After that the list of 
current automations will be hidden and the 'create new' form appears. The form allows you to choose 
a type of the automation, 'selector' (e.g. account), automation's rules (less then certain amount,
transfer form a certain counterpart, etc.), alerting transport (sms, e-mail, etc.) and save 
the automation.

The form is based on a specific model, which the widget gets from API (list of specifications).  

##Dependencies
* [base](http://stash.backbase.com:7990/projects/lpm/repos/foundation-base/browse/)
* [core](http://stash.backbase.com:7990/projects/lpm/repos/foundation-/browse/)
* [ui](http://stash.backbase.com:7990/projects/lpm/repos/ui/browse/)
* [module-automation](ssh://git@stash.backbase.com:7999/LPM/module-automation.git)
* [module-accounts](ssh://git@stash.backbase.com:7999/LPM/module-accounts.git)

## Run
* Install and run widget
  - `npm i && npm start`
  - Starts and runs on http://localhost:3000/
  
## API Endpoints
* POST `/v1/recipes/create` Create a new automation
* GET `/v1/specification/recipes` Get a list of specifications
* PUT `/v1/party/{partyId}/recipe/{recipeId}/activation_request` Activate the automation
* PUT `/v1/party/{partyId}/recipe/{recipeId}/deactivation_request` Deactivate the automation
* DELETE `v1/party/{partyId}/recipe/{recipeId}` Delete one automation
   
   