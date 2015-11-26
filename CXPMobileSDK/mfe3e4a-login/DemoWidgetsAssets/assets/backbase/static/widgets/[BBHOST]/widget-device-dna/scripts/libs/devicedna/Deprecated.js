/*eslint-disable */
/******* NOTE ********
The APIs for the RiskMinder client have changed.
This file is to retain older APIs for backward compatibility.
It should not be included in the next release of the client.

Functional methods
-----------------------
Following methods still work appropriately:

1)ArcotRFClient() //to enable instantiation
2)load() //to enable callback function only
3)setFlashCookie(), getFlashCookie(), getFlashCookieValue(), getBrowserCookie(), setBrowserCookie(), deleteBrowserCookie()
//These will internally use the default storage mechanism (and not necessarily flash/browser cookies
4) analyzeDeviceDNA
//Processes DeviceDNA
5) getDNAString
//Returns DeviceDNA string in JSON format
6) formatAsHTML
//Returns DeviceDNA as HTML string
7) getDNAExecutionTime
//Returns time taken to execute DDNA

Dummy methods
-----------------------
Following methods are set to return string 0, because something needs to be returned
1) getMESCValue
2) getMESCIterationsCompleted
3) getDESCValue

Following methods dont' do anything now
1) setDNAConfiguration
2) setMESCConfiguration
3) setDESCConfiguration
4) setJavaAppletPathURL
4) setFlashParams


*/

if (typeof arcotrf == "undefined") {
   var arcotrf = {};
}

arcotrf.ArcotRFClient = function() {
	this.client = new ca.rm.Client();
};

arcotrf.ArcotRFClient.prototype.client;
arcotrf.ArcotRFClient.prototype.callback;
arcotrf.ArcotRFClient.prototype.lsoVal;


arcotrf.ArcotRFClient.prototype.load = function(callbackFunc, wrapperDivId, flashCookie, dna, flashDNA, javaDNA, pluginDNA, wrapperDivDisplayStyle) {
	if(callbackFunc){
		callbackFunc();
	}
};

arcotrf.ArcotRFClient.prototype.getError = function(){
	return "This method is deprecated";
};

arcotrf.ArcotRFClient.prototype.getLog = function(){
	return "This method is deprecated";
};

arcotrf.ArcotRFClient.prototype.setFlashCookie = function(cookieNm,cookieVal,onDone) {
	this.client.setProperty("didname", cookieNm);
	this.client.setDID(cookieVal);
	if(onDone){
		onDone();
	}
};

arcotrf.ArcotRFClient.prototype.getFlashCookie = function(cookieNm,onDone) {
	this.client.setProperty("didname", cookieNm);
	this.lsoVal = this.client.getDID();
	if(onDone){
		onDone();
	}
};

arcotrf.ArcotRFClient.prototype.getFlashCookieValue = function() {
	return this.lsoVal;
};

arcotrf.ArcotRFClient.prototype.getBrowserCookie = function(name) {
	this.client.setProperty("didname", name);
	return this.client.getDID();
};

arcotrf.ArcotRFClient.prototype.setBrowserCookie = function(name, value, days2live, domain) {
	this.client.setProperty("didname", name);
	this.client.setDID(value);
};

arcotrf.ArcotRFClient.prototype.deleteBrowserCookie = function(name){
	this.client.setProperty("didname", name);
	this.client.deleteDID();
};


arcotrf.ArcotRFClient.prototype.analyzeDeviceDNA =  function(onDone, maxDurationMSec){
	this.client.processDNA();
	if(onDone){
		onDone();
	}
};

arcotrf.ArcotRFClient.prototype.getDNAString =  function(formatCode){
	this.client.setProperty("format", "json");
	return this.client.getDNA();
};

arcotrf.ArcotRFClient.prototype.formatAsHTML =  function(){
	this.client.setProperty("format", "html");
	return this.client.getDNA();
};

arcotrf.ArcotRFClient.prototype.getDNAExecutionTime =  function(){
	return this.client.getTimeTaken();
};

arcotrf.ArcotRFClient.prototype.getMESCValue =  function(){
	//Return dummy data
	return -1;
};

arcotrf.ArcotRFClient.prototype.getMESCIterationsCompleted =  function(){
	//Return dummy data
	return -1;
};

arcotrf.ArcotRFClient.prototype.getDESCValue =  function(){
	//Return dummy data
	return -1;
};

arcotrf.ArcotRFClient.prototype.setDNAConfiguration = function(externalIPAddr, internalIPDivID, macDivID, ieClientCapsDivId){
	//Does nothing
};

arcotrf.ArcotRFClient.prototype.setMESCConfiguration = function(isMESCOn, numberOfIterations, calibrationDuration, intervalDelay) {
	//Does nothing
};

arcotrf.ArcotRFClient.prototype.setDESCConfiguration = function(isDESCOn, numberOfIterations, calibrationDuration, neverUseFlash) {
	//Does nothing
};

arcotrf.ArcotRFClient.prototype.setJavaAppletPathURL = function(appletBaseURL) {
	//Does nothing
};

arcotrf.ArcotRFClient.prototype.setFlashParams = function(flashDivId, movieUrl, maxRetries, retryPeriodMSec){
	//Does nothing
};

