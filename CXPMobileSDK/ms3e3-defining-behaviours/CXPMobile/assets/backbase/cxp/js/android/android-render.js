
renderWidget = function(widget_root, localContext, remoteContext, widgetModel, features){

    //TODO: make log level configurable
    var logLevel = 'info';

    var root = document.getElementById(widget_root);

    function ConsolePlainStream() {}
    ConsolePlainStream.prototype.write = function (rec) {

        var loggerName = rec.childName ? rec.name + '/' + rec.childName : rec.name;

        var logMethod;
        if (rec.level < 30) {
            logMethod = 'log';
        } else if (rec.level < 40) {
            logMethod = 'info';
        } else if (rec.level < 50) {
            logMethod = 'warn';
        } else {
            logMethod = 'error';
        }

        console[logMethod](loggerName + ': ' + rec.msg);
    };

    var config = cxpConfiguration({
        contextRoot: localContext,
        remoteContextRoot: remoteContext,
        logStreams: [
            { level: logLevel, stream: new ConsolePlainStream() }
        ]
    });
    var renderer = cxpRenderer(config);
    renderer.addPlugin({
        postRead: function(widgetModel) {
            var templatePref = widgetModel.preferences.filter(function(pref) {
                return pref.name === 'templateUrl';
            })[0];
            if(templatePref) {
                templatePref._ignoreReplace = true;
            }
            return widgetModel;
        }
    });


    for (var i=0; i < features.length; i++) {
        renderer.addFeature(features[i]);
    }
    renderer.start(widgetModel, root).then(function(details) {
        var message = 'Item tree rendered in ' + details.time + 'ms',
            resizeElement = document.getElementsByTagName("html")[0]; //the html could contain paddings/margins
        resizeCallback = function() {
            Cxp.resize(resizeElement.scrollHeight);
        };
        addResizeListener(resizeElement, resizeCallback);
        console.log(message);
        Cxp.itemLoaded();
    }).fail(function(e) {
        console.log(e);
    });
};

