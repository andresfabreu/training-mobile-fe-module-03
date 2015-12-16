'use strict';

// var loginWidget = require(process.cwd() + '/scripts/index');

module.exports = function() {
	this.Given(/^I have navigated to the OLB main page$/, function (callback) {
		if (loginWidget.isLoaded()) {
			callback();
		}
	});

	this.Given(/^I am accessing the OLB on an unregisterd device$/, function (callback) {
		// if (loginWidget.isUnregisteredDevice()) {
		// 	callback();
		// }
		callback.pending();
	});

	this.When(/^I enter my username incorrectly$/, function (callback) {
	  // Write code here that turns the phrase above into concrete actions
	  callback.pending();
	});

	this.When(/^I enter my password$/, function (callback) {
	  // Write code here that turns the phrase above into concrete actions
	  callback.pending();
	});

	this.Then(/^I will not be logged in$/, function (callback) {
	  // Write code here that turns the phrase above into concrete actions
	  callback.pending();
	});

	this.Then(/^my device will not be registered$/, function (callback) {
	  // Write code here that turns the phrase above into concrete actions
	  callback.pending();
	});

	this.Then(/^I will see an error message informing me that my credentials are incorrect$/, function (callback) {
	  // Write code here that turns the phrase above into concrete actions
	  callback.pending();
	});

	this.Then(/^the number of attempts left$/, function (callback) {
	  // Write code here that turns the phrase above into concrete actions
	  callback.pending();
	});

	this.When(/^I enter my username correctly$/, function (callback) {
	  // Write code here that turns the phrase above into concrete actions
	  callback.pending();
	});

	this.When(/^I enter my password incorrectly$/, function (callback) {
	  // Write code here that turns the phrase above into concrete actions
	  callback.pending();
	});

	this.Given(/^I have entered my username correctly$/, function (callback) {
	  // Write code here that turns the phrase above into concrete actions
	  callback.pending();
	});

	this.Given(/^I have entered my password correctly$/, function (callback) {
	  // Write code here that turns the phrase above into concrete actions
	  callback.pending();
	});

	this.Given(/^I have received an OTP$/, function (callback) {
	  // Write code here that turns the phrase above into concrete actions
	  callback.pending();
	});

	this.Given(/^I have entered the OTP correctly$/, function (callback) {
	  // Write code here that turns the phrase above into concrete actions
	  callback.pending();
	});

	this.When(/^I select my device type \(private\/public\)$/, function (callback) {
	  // Write code here that turns the phrase above into concrete actions
	  callback.pending();
	});

	this.Then(/^I will be logged in$/, function (callback) {
	  // Write code here that turns the phrase above into concrete actions
	  callback.pending();
	});

	this.Then(/^my device will be registered$/, function (callback) {
	  // Write code here that turns the phrase above into concrete actions
	  callback.pending();
	});

	this.Then(/^I will see my OLB landing page$/, function (callback) {
	  // Write code here that turns the phrase above into concrete actions
	  callback.pending();
	});

	this.Given(/^I have entered the OTP incorrectly$/, function (callback) {
	  // Write code here that turns the phrase above into concrete actions
	  callback.pending();
	});

	this.Then(/^I will a message informing me about the number of attempts left$/, function (callback) {
	  // Write code here that turns the phrase above into concrete actions
	  callback.pending();
	});

	this.Then(/^I will see an option to re\-try$/, function (callback) {
	  // Write code here that turns the phrase above into concrete actions
	  callback.pending();
	});

	this.Then(/^I will see an option to request another OTP$/, function (callback) {
	  // Write code here that turns the phrase above into concrete actions
	  callback.pending();
	});

	this.Given(/^I have navigated to the OLB Main page$/, function (callback) {
	  // Write code here that turns the phrase above into concrete actions
	  callback.pending();
	});

	this.Given(/^I have reached the limit of attempts to login$/, function (callback) {
	  // Write code here that turns the phrase above into concrete actions
	  callback.pending();
	});

	this.When(/^I enter my username or password incorrectly$/, function (callback) {
	  // Write code here that turns the phrase above into concrete actions
	  callback.pending();
	});

	this.Then(/^I will see an error message informing me that the login failed$/, function (callback) {
	  // Write code here that turns the phrase above into concrete actions
	  callback.pending();
	});

	this.Given(/^I have reached the limit of attempts to submit the OTP$/, function (callback) {
	  // Write code here that turns the phrase above into concrete actions
	  callback.pending();
	});
}
