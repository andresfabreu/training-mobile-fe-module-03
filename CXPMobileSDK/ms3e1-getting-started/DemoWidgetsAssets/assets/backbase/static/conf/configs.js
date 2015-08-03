{
    "debug": true,
    "portal": "test",
    "serverURL": "",
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
        	"static/launchpad/launchpad-setup.js",
            "static/launchpad/modules/angular/angular.min.js",
            "static/launchpad/support/requirejs/require.js", 
            "static/launchpad/modules/config/requirejs.conf.js",
            "static/launchpad/modules/base/scripts/require-widget.js"
        ],
        "launchpad-dependencies": []
    },
    "behaviourMap": [
        {
            "behaviour": "getStartedClicked",
            "target": "/backbase/overview"
        },
        {
            "behaviour": "versionClicked",
            "target": "/backbase/changelog/version"
        }
    ],
    "syncedPreferences": {
        "versionClicked": ""
    }
}