/**
 *  ----------------------------------------------------------------
 *  Author : Backbase R&D - Amsterdam - New York
 *  Filename : content.js
 *  Description:
 *
 *  Source code for CXP Universal Content Widget
 *  ----------------------------------------------------------------
 */

b$ = b$ || {};
b$.universal = b$.universal || {};
b$.universal.widgets = b$.universal.widgets || {};
b$.universal.widgets.contentWidget = (function($, bd) {
    'use strict';

    return {
        /**
         * Initialize content widget
         * @param  {Object} oWidget Backbase widget object
         */
        start: function(oWidget) {

            var delayed = false;
            var renderICEWidget = function(){
                if (!be.ice) {
                    $('img[src=""], img:not([src])', oWidget.body).addClass('be-ice-hide-image');
                    $(oWidget.body).addClass('be-ice-widget-rendered');
                    return;
                }
                oWidget.iceConfig = be.ice.config;

                var isMasterpage = be.utils.module('top.bd.PageMgmtTree.selectedLink').isMasterPage,
                    isManageable = isMasterpage || (
                        // .model.manageable === true means widget belongs to master page
                        // and is made manageable. In this case content still shouldn't be editable
                        oWidget.model.manageable === '' ||
                        oWidget.model.manageable === undefined
                    );

                if (isManageable && be.ice.controller && /(?:ADMIN|CREATOR)/.test(oWidget.model.securityProfile)) {
                    var templateUrl = String(oWidget.getPreference('templateUrl')),
                        enableEditing = function() {

                            // it is possible to swap template for editorial
                            // here is an example for image template
                            if (templateUrl.match(/\/image\.html$/)) {
                                templateUrl = templateUrl.replace(/\/image\.html$/, '/image-editorial.html');
                            }

                            return be.ice.controller.edit(oWidget, templateUrl)
                                .then(function(dom) {
                                    $(oWidget.body).find('.bp-g-include').html(dom);

                                    return dom;
                                });
                        };

                    oWidget.addEventListener('preferences-form', function(event) {
                        var aPrefs = b$.portal.portalModel.filterPreferences(oWidget.model.preferences.array);
                        for (var i = aPrefs.length - 1; i >= 0; i--) {
                            if (aPrefs[i].label == 'Template') {
                                var sTemplateVariants = oWidget.getPreference('templateList');
                                var arr = sTemplateVariants.split(',');
                                for (var j=0, k=0; j < arr.length; j++, k++) {
                                    aPrefs[i].inputType.options[k] = {
                                        label: arr[j],
                                        value: arr[j + 1]
                                    };
                                    j++;
                                }
                            }
                        }
                    });

                    // this widget has property rendering example (template: simple.html)
                    // so we need to refresh widget after property 'title' modified
                    oWidget.model.addEventListener('PrefModified', function(oEvent) {
                        if (oEvent.attrName === 'title') {
                            enableEditing();
                        }
                    }, false, oWidget);

                    return enableEditing();
                } else {
                    $(oWidget.body).addClass('be-ice-widget-rendered');
                }
            };

            // Extend widget in design mode
            if (be.ice && bd && bd.designMode == 'true') {
                renderICEWidget();
            } else if (!delayed){
                // ICE library not loaded yet, delay rendering
                delayed = true;
                setTimeout(renderICEWidget, 500);
            } else {
                // Hide broken images on live
                $('img[src=""], img:not([src])', oWidget.body).addClass('be-ice-hide-image');
                $(oWidget.body).addClass('be-ice-widget-rendered');
            }

        }
    };
}(window.jQuery, window.bd));
