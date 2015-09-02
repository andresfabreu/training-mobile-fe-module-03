define(function(require, exports, module) {

    'use strict';

    var hasStorage = function() {
        var uid = new Date;
        var storage;
        var result;
        try {
            (storage = window.localStorage).setItem(uid, uid);
            result = storage.getItem(uid) == uid;
            storage.removeItem(uid);
            return result && storage;
        } catch (exception) {}
    };
    // @ngInject
    exports.formDataPersistence = function() {

        /**
         * Creates a new FormDataPersistenceController instance
         * @constructor
         */
        var FormDataPersistenceController = function() {
            var self = this;


        };

        /**
         * Save the form data in session storage with the form name as the key
         * @param formName a string value of the form/widget name
         * @param a JS object representing the values of the form
         */
        FormDataPersistenceController.prototype.saveFormData = function(formName, formObject) {

	        if(hasStorage()) {
		        var stringifiedFormObject = JSON.stringify(formObject);
		        sessionStorage.setItem(formName, stringifiedFormObject);
	        }
        };

        /**
         * Removes saved data from session storage by form name
         * @param formName the name of the widget form to remove
         */
        FormDataPersistenceController.prototype.removeFormData = function(formName) {
	        if(hasStorage()) {
		        sessionStorage.removeItem(formName);
	        }
        };

        /**
         * Return the stored string of the form object
         * @param widget form name
         */
        FormDataPersistenceController.prototype.getFormData = function(formName) {

            var self = this;

            var widgetForm = JSON.parse(sessionStorage.getItem(formName));

            var formatObject = function(thisObject) {
                for(var key in thisObject) {
                    if (thisObject.hasOwnProperty(key)) {
                        if (key.toLowerCase().indexOf("date") > -1 && typeof thisObject[key] !== "boolean") {
                            var testDate = new Date(thisObject[key]);
                            //TODO: investigate better approach
                            if (!isNaN(testDate.getTime())) {
                                //a valid date
                                thisObject[key] = testDate;
                            }
                        }

                        if (thisObject[key] instanceof Object) {
                            formatObject(thisObject[key]);
                        }
                    }
                }

                return thisObject;
            };

            formatObject(widgetForm);

            return widgetForm;
        };

        /**
         * Returns a flag if the form is currently saved
         * @formName the name of the widget form to check
         */
        FormDataPersistenceController.prototype.isFormSaved = function(formName) {
            var self = this;

            var saved = sessionStorage.getItem(formName);

            return saved === null ? false : true;
        };

        return {
            getInstance: function() {
                return new FormDataPersistenceController();
            }
        };
    };
});
