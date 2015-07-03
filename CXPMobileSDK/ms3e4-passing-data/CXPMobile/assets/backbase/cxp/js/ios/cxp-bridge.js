window.Cxp = {
    resizeTo: function (width, height) {
        var iframe = document.createElement("IFRAME");
        iframe.setAttribute("src", "cxp-resize://?w=" + width + "&h=" + height);
        document.documentElement.appendChild(iframe);
        iframe.parentNode.removeChild(iframe);
        iframe = null;
    },

    publish: function (event, payload, eventType) {
        var iframe = document.createElement("IFRAME");
        iframe.setAttribute("src", "cxp-publish://?event=" + event + "&type="+eventType + "&payload=" + payload);
        document.documentElement.appendChild(iframe);
        iframe.parentNode.removeChild(iframe);
        iframe = null;
    },

    subscribe: function (event) {
        var iframe = document.createElement("IFRAME");
        iframe.setAttribute("src", "cxp-subscribe://?event=" + event);
        document.documentElement.appendChild(iframe);
        iframe.parentNode.removeChild(iframe);
        iframe = null;
    },

    unsubscribe: function (event) {
        var iframe = document.createElement("IFRAME");
        iframe.setAttribute("src", "cxp-unsubscribe://?event=" + event);
        document.documentElement.appendChild(iframe);
        iframe.parentNode.removeChild(iframe);
        iframe = null;
    },
    
    executeFeature: function(){
        if (arguments.length === 0) return;
        var args = [];
        Array.prototype.push.apply( args, arguments );
        
        var feature=args.shift();
        var method=args.shift();
        var params=args;
        
        var iframe = document.createElement("IFRAME");
        iframe.setAttribute("src", "cxp-feature://?feature=" + feature + "&method=" + method +
                            "&params=" + params.join("&params="));
        document.documentElement.appendChild(iframe);
        iframe.parentNode.removeChild(iframe);
        iframe = null;
    }
};