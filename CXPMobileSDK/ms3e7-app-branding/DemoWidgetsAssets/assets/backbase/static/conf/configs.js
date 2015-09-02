{
    "debug": true,
    "portal": "lpmobile",
    "serverURL": "http://localhost:7777/portalserver",
    "localModelPath": "assets/backbase/static/conf/model.json",
    "template": {
        "styles": [
            "static/theme/themes/default/base.css",
            "static/com.backbase.cxp-demo/theme/css/global.css",
            "static/com.backbase.cxp-demo/theme/css/ios.css",
            "static/com.backbase.cxp-demo/theme/css/android.css",
        ],
        "scripts": [],
        "extra-libraries": [
            "static/com.backbase.cxp-demo/libraries/jquery/jquery-1.8.3.min.js",
        	"static/launchpad/launchpad-setup.js",
            "static/launchpad/modules/angular/angular.min.js",
            "static/launchpad/support/requirejs/require.js", 
            "static/launchpad/modules/config/requirejs.conf.js",
            "static/launchpad/modules/base/scripts/require-widget.js"
        ]
    },
    "behaviourMap": [
        {
            "behaviour": "account-details",
            "target": "/lpmobile/accounts/details"
        }
    ],
    "syncedPreferences": {},
    "domainAccess":[],
    "pinnedCertificates":[]
}