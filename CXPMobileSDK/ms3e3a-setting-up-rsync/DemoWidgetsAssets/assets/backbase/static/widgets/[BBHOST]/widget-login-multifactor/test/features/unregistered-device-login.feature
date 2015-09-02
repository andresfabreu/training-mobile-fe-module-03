Feature: Login on an unregistered device
  As a customer
  I want to be able to login from an unregistered device
  So that I can access my OLB

  Background:
    Given I am accessing the OLB on an unregisterd device

  Scenario: Customer provides invalid username
    Given I have navigated to the OLB main page
    When I enter my username incorrectly
    And I enter my password
    Then I will not be logged in
    And my device will not be registered
    And I will see an error message informing me that my credentials are incorrect
    And the number of attempts left

  Scenario: Customer provices invalid password
    Given I have navigated to the OLB main page
    When I enter my username correctly
    And I enter my password incorrectly
    Then I will not be logged in
    And my device will not be registered
    And I will see an error message informing me that my credentials are incorrect
    And the number of attempts left

  Scenario: Customer is successfully logged in
    Given I have navigated to the OLB main page
    And I have entered my username correctly
    And I have entered my password correctly
    And I have received an OTP
    And I have entered the OTP correctly
    When I select my device type (private/public)
    Then I will be logged in
    And my device will be registered
    And I will see my OLB landing page

  Scenario: Customer provides invalid OTP
    Given I have navigated to the OLB main page
    And I have entered my username correctly
    And I have entered my password correctly
    And I have received an OTP
    And I have entered the OTP incorrectly
    Then I will not be logged in
    And my device will not be registered
    And I will a message informing me about the number of attempts left
    And I will see an option to re-try
    And I will see an option to request another OTP

  Scenario: Customer exceeds number of attempts to login
    Given I have navigated to the OLB Main page
    And I have reached the limit of attempts to login
    When I enter my username or password incorrectly
    Then I will not be logged in
    And my device will not be registered
    And I will see an error message informing me that the login failed

  Scenario: Customer exceeds number of attempts to submit the OTP
    Given I have navigated to the OLB Main page
    And I have reached the limit of attempts to submit the OTP
    And I have entered my username correctly
    And I have entered my password correctly
    And I have received an OTP
    And I have entered the OTP incorrectly
    Then I will not be logged in
    And my device will not be registered
    And I will see an error message informing me that the login failed
