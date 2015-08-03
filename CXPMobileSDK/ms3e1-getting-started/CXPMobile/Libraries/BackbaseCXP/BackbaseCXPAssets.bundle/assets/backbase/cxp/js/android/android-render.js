renderWidget = function(widget_root, localContext, remoteContext, widgetModel, features, logLevel, syncPreferences){


    console.log("Log level set to "+logLevel);

    //Promise polyfill.
    window.Promise = window.Promise || cxpRenderer.Q.Promise;

     window.syncPreferences = {
          listeners: [],
          update: function(action, key, value) {
            this.listeners.forEach(function(listener) {
              listener.call(null, action, key, value);
            });
          },
          addListener: function(callback) {
            this.listeners.push(callback);
          }
        };

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

        // inject the "SyncedPreferences" into the model.
        features.forEach(function(obj){
          if(obj.name === 'SyncedPreferences'){
            widgetModel.features.push(obj);
          }
        });

        return widgetModel;
      },
      postRender: function(widgetInstance, widgetRenderer, widgetModel) {
        // initialization with the given syncPreferences
        widgetModel.preferences.forEach(function (pref) {
          // update only if the preference is defined and not readonly.
          if (!pref.readonly && pref.name in syncPreferences) {
            if(syncPreferences[pref.name] === '__null__')
              syncPreferences[pref.name] = null;
            widgetInstance.preferences.setItem(pref.name, syncPreferences[pref.name]);
          }
        });

        // listening to changes in the preferences externally
        window.syncPreferences.addListener(function (action, key, value) {
          // only affect the preferences in the syncPreferences list
          if (widgetInstance.preferences.hasOwnProperty(key) && (key in syncPreferences)) {
            widgetInstance.preferences._eventsEnabled = false;
            try {
              if (action === 'setItem') {
                widgetInstance.preferences.setItem(key, value);
              } else if (action === 'removeItem') {
                widgetInstance.preferences.setItem(key, null);
              }
            } catch (e) { // it might be readonly.
              console.log(e);
            }
            widgetInstance.preferences._eventsEnabled = true;
          }
        });

        // broadcasting changes in the preferences
        widgetInstance.addEventListener('storage', function(ev) {
          if(ev.key in syncPreferences) {
            var value = ev.newValue;
            var feature = widgetInstance.features['SyncedPreferences'];
            if(feature){
              feature.setItem(ev.key, value);
            }
          }
        });
        return widgetInstance;
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

