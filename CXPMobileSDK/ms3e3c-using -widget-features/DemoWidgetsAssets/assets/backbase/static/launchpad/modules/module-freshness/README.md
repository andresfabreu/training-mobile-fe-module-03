#data freshness module
 

##API structure (status codes, etc.);
Freshness API goes with session poll and it is a flag property `TheDataIsMostRecent` and it could be true or false.

##Architecture.
- On arrival from the API, the flag is being handled by session-timeout.js component and it returns out two status codes: 0 (data is in actual state) or 1 (some data is updating). It emits a ‘lpDataFreshnessValidate’ event to notify system a status code arrived.
- Above codes go to freshness-validate.js component, which handles arrived status code (validate codes and transform its values into string values to be emitted all over the system). Current string codes are: ‘actual’, ‘updating’ and a special one ‘refresh’ (which means only that the ‘updating’ code transforms to ‘actual’ and system should refresh data models).
- The freshness-validate.js component emits two pubsub events: (1) ‘lpDataFreshnessChanged’ -- which indicates the status is changed (status, which is the same as the previous, will not trigger any event at all) and (2) ‘lpDataFreshnessRefresh’ -- which indicates the status is changed from ‘updating’ to ‘actual’ and the system should refresh data (at the moment we refresh accounts and transactions only).
- To show messages about the current status of the data we use the ‘lpFreshnessMessage’ directive (from freshness-status.js). It shows the different messages depending on the satus code. At the moment the directive injected into transactions wisget (list.html). The ‘updating’ message is permanent (yet could be hidden by the user), other messages will be auto hidden in a certain time (default is 7 seconds and could be overwritten by directive attribute).
- Once the ‘lpDataFreshnessRefresh’ event is being triggered, the system updates the data model (and the view also changes) of two widgets -- accounts and transactions. As the accounts data is being retrieved in two different places, we need to update accounts’ info twice: in transactions widget -- to change the dropdown of accounts, and in accounts widget -- to change the accounts’ navbar on the left of the layout.
