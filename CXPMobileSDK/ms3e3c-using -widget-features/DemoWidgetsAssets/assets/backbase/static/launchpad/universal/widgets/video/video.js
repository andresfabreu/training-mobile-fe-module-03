define(["jquery", "launchpad/lib/ui/responsive"], function($, Responsive) {

    "use strict";

    /**
     * Default
     *
     * @constructor
     * @extends LaunchpadWidget
     */
    var Video = function(widget) {
        this.widget = widget;
        this.$widget = $(this.widget.body);

        widget.addEventListener("preferencesSaved", function () {
            widget.refreshHTML();
        });
    };

    /**
     * Configure Responsive and start rendering
     */
    Video.prototype.init = function() {
        var self = this;

        this.responsive = Responsive.enable(this.widget.body);
        this.responsive.rule({
            any: function() {
                self.updateHeight();
            }
        });

        this.render();
    };

    /**
     * Render the video, show message if any errors thrown
     */
    Video.prototype.render = function() {
        var $video = this.$widget.find(".lp-video"),
            $error = this.$widget.find(".lp-video-error");

        try {
            $video.show().attr("src", this.getUrl());
            $error.hide();
            this.updateHeight();
        } catch (e) {
            $video.hide();
            $error.show();
        }
    };

    /**
     * Update iFrame height to provide responsiveness
     */
    Video.prototype.updateHeight = function() {
        var height = parseInt(this.widget.getPreference("height"), 10),
            width = parseInt(this.widget.getPreference("width"), 10),
            ratio = height / width;

        if (!height || !width) {
            throw "Height or Width is zero, undefined on NaN!";
        }

        this.$widget.find(".lp-video").height(Math.round(this.$widget.width() * ratio));
    };

    /**
     * Get iFrame URL
     *
     * @returns {string}
     */
    Video.prototype.getUrl = function() {
        var source = this.widget.getPreference("source"),
            videoId = this.widget.getPreference("videoId");

        if (!videoId) {
            throw "VideoID is undefined!";
        }

        switch (source) {
            case "youtube":
                return "http://www.youtube.com/embed/" + videoId;
            case "vimeo":
                return "http://player.vimeo.com/video/" + videoId;
            default:
                throw "Source is undefined or doesn't have a handler!";
        }
    };

    return function(widget) {
        var wrapper = new Video(widget);
        wrapper.init();
        return wrapper;
    };

});
