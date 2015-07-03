renderWidget = function(widget_root, localContext, remoteContext, widgetModel, features){

    //TODO: make log level configurable
    var logLevel = 'info';

    var root = document.getElementById(widget_root);

    /**
     * Logs records to a buffer until they are flushed to another log stream
     * @param size
     * @constructor
     */
    var BufferedLogStream = function(size) {

        this.size = size || 1000;
        this.buffer = [];

        this.decoratedStreams = [];
    };

    /**
     * Flushing the log will write records to streams added with this method
     * @param stream
     */
    BufferedLogStream.prototype.decorateStream = function(stream) {
        this.decoratedStreams.push(stream);
    };

    /**
     * Write a record to the buffer
     * @param rec
     */
    BufferedLogStream.prototype.write = function(rec) {

        if(this.buffer.length >= this.size) {
            this.buffer.shift();
        }

        this.buffer.push(rec);
    };

    /**
     * Flushes the buffer to a stream
     */
    BufferedLogStream.prototype.flush = function() {
        var rec;
        while(rec = this.buffer.shift()) {
            this.decoratedStreams.forEach(function(stream) {
                stream.write(rec);
            })
        }
    };

    /**
     * Clears the buffer
     */
    BufferedLogStream.prototype.clear = function() {
        this.buffer = [];
    };

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

        function padZeros(number, len) {
            return Array((len + 1) - (number + '').length).join('0') + number;
        }

        console[logMethod]('[' +
            padZeros(rec.time.getHours(), 2) +
            padZeros(rec.time.getMinutes(), 2) +
            padZeros(rec.time.getSeconds(), 2) +
            padZeros(rec.time.getMilliseconds(), 4) + '] ' +
            rec.levelName + ': ' + loggerName + ': ' + rec.msg);
    };

    //console stream for normal console logging
    var consoleStream =  new ConsolePlainStream();

    //buffered log stream allows a developer to replay the log by running bufferedLogStream.flush()
    var bufferedLogStream = new BufferedLogStream();
    bufferedLogStream.decorateStream(consoleStream);
    window.bufferedLogStream = bufferedLogStream;

    //log to native via an iframe bridge
    var iframeBridgeLogStream = {
        write: function(rec) {
            var iframe = document.createElement("IFRAME");
            iframe.setAttribute("src", "log://?type="+rec.levelName+"&msg=" + rec.msg + " (" + rec.time + ")");
            document.documentElement.appendChild(iframe);
            iframe.parentNode.removeChild(iframe);
            iframe = null;
        }
    };

    var configuration = cxpConfiguration({
        contextRoot: localContext,
        contextPath: localContext,
        remoteContextRoot: remoteContext,
        logStreams: [
            { level: logLevel, stream: iframeBridgeLogStream },
            { level: logLevel, stream: consoleStream },
            { level: logLevel, stream: bufferedLogStream }
        ]
    });
    
    var renderer = cxpRenderer(configuration);
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

    var page = document.getElementsByTagName("html")[0]; //the html could contain paddings/margins
    addResizeListener(page, function(){
        Cxp.resizeTo(page.scrollWidth, page.scrollHeight);
    });
    
    renderer.start(widgetModel, root)
    .then(function(details) {
          Cxp.resizeTo(page.scrollWidth, page.scrollHeight);
          var message = 'CXPMobile Widget-Engine: Item tree rendered in ' + details.time + 'ms';
          console.log(message);
    })
    .fail(function(e) {
          console.log(e);
    });
};
