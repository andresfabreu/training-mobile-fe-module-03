define(['jquery'], function($) {
    "use strict";

    function init(widget) {

        console.log('WIDGET', widget)

        function getStarted() {
            console.log('getStarted')
            // Send a pub/sub event to the application that will use this event by checking if there's a matching page in the behaviour map
            gadgets.pubsub.publish("getStartedClicked");
        };

        // The widget needs to inform it's done loading so preloading works as expected
        gadgets.pubsub.publish('cxp.item.loaded', {
            id: widget.model.name
        });

        $(widget.body).on('click', '.get-started', function(ev){
            console.log(ev)
            getStarted()
        })

    }

    return function(widget) {
        init(widget);
    }

});