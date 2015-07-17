define(function(require, exports, module) {
    'use strict';

    var gadgets = window.gadgets; // todo: refactor to use lpCoreUtils.bus.
    var $ = window.jQuery;

    /**
     *  To get badges info we will use session-timeout.js transport, however
     *  for updating server about 'read' items we need a separate channel
     */
    // @ngInject
    exports.lpBadgesResource = function(httpService) {
        var contextPath = 'http://localhost:3000'; //window.b$.portal.config.serverRoot;
        var endPoint = contextPath + '/services/rest/v1/badges';
        var badgeService = httpService.getInstance({
            endpoint: endPoint,
            cacheTimeout: 0
        });

        /**
         * Get badges from a raw response data and forward it along
         *
         * We expect from server the following collection:
         * [{type: "messages", unread:2}, {type: "priority", unread:1}, {type: "orders", unread:0}]
         *
         * @param response
         * @returns {*}
         */
        var checkBadgesResponse = function(response) {
            var badges = response.data;

            if (badges && badges.length > 0 && 'type' in badges[0] && 'unread' in badges[0]) {
                return badges;
            } else {
                return [];
            }
        };

        var getBadgesList = function() {
            var listPromise = badgeService.read();
            listPromise.then(function(response) {
                gadgets.pubsub.publish('lpBadgesUnreadServer', checkBadgesResponse(response));
            });
        };

        // send PUT request to update server's state re. 'viewed' items of
        // respective type
        gadgets.pubsub.subscribe('lpBadgesReadNotify', function(data) { badgeService.update({
            contentType: 'application/json',
            data: data
        }); });

        // separate way to get badges (other then session polling)
        // session polling just initiate this request
        gadgets.pubsub.subscribe('lpBadgesGetItems', getBadgesList);

        return {
            getBadgesList: getBadgesList
        };
    };

    exports.badgesUtils = function() {
        // Positioning handlers
        var posFn = {

            right: function($badge){
                var width = Math.abs($badge.outerWidth() / 2);
                $badge.css('right', '-' + width + 'px');
            },

            top: function($badge){
                var height = Math.abs($badge.outerHeight() / 2);
                $badge.css('top', '-' + height + 'px');
            },

            left: function($badge){
                var width = Math.abs($badge.outerWidth() / 2);
                $badge.css('left', '-' + width + 'px');
            },

            bottom: function($badge){
                var height = Math.abs($badge.outerHeight() / 2);
                $badge.css('bottom', '-' + height + 'px');
            },

            middle: function($badge){
                $badge.css({'top': '50%', 'transform': 'translateY(-50%)'});
            },

            follow: function($badge) {
                $badge.css({'position': 'relative'});
            }
        };

        /**
         * Position badge on a LeftTop of the container
         *
         * @param wrapper
         */
        var position = function(wrapper, pos){
            var posArr = pos.split('-');
            var $badge = $(wrapper).find('span');
            $badge.hide().removeClass('showBadge');
            setTimeout(function(){
                posArr.forEach(function(fn) { posFn[fn]($badge); });
                $badge.addClass('showBadge').show();
            }, 0);
        };

        return {
            position: position
        };
    };
});
