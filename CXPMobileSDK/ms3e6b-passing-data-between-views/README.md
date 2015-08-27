# Backbase Training Exercise

## CXP Mobile SDK - Module 3a: Mobile Project Development

### Exercise 6b

_note: This exercise is 11 of 12 in a series of exercises that follow on from each other and should not be used independently_

#### Description

In this exercise, you will learn how to pass data between webviews using the pub/sub mechanism.

#### Steps

 - Update the **account-list** widget to pass the id of the selected account, along with the user information, in the pub/sub event triggering the detail view
 - Add an event listener in the **account-details** widget to catch the data passed in the pub/sub event sent by the **account-list** widget
 - Select the current account's info from the user info based on the account id you passed in the pub/sub event
 - Retrieve the transaction history for the current account by calling a service exposing the data provided in [Resources/transactions-history.json](../../Resources/transactions-history.json)
 - Update the template for **account-details** to display:
    - Basic User info
    - The IBAN of the current account
    - The list of recent transactions for the current account

#### Additional resources

 - [Transaction History JSON data](../../Resources/transactions-history.json)

#### References
