/*globals window, b$ */
(function () {
    "use strict";

    /**
     * Preference constants
     *
     * @enum {String}
     */
    var prefs = {
        NUM_SLIDES: "numSlides",
        EFFECT: "effect",
        PAGINATION: "pagination",
        NAVIGATION: "navigation",
        AUTOPLAY: "autoplay",
        AUTOPLAY_DURATION: "autoplayDuration",
        AUTOPLAY_PAUSE_HOVER: "autoplayPauseOnHover",
        TRANSITION_SPEED: "transitionSpeed",
        EASING: "easing"
    };

    /**
     * Design mode controls
     * @const (String)
     */
    var html = {
        SLIDE:
            "<div class='bp-area lp-carousel-slide'></div>",
        PAGINATION_WRAP:
            "<div class='lp-carousel-control lp-carousel-pagination pagination'><ul class='pagination pagination-sm'></ul></div>",
        BTN_PREV:
            "<a class='lp-carousel-prev lp-carousel-control' data-dir=prev>" +
            "<i class='lp-icon lp-icon-large lp-icon-angle-left' title='Previous'></i>" +
            "</a>",
        BTN_NEXT:
            "<a class='lp-carousel-next lp-carousel-control' data-dir=next>" +
            "<i class='lp-icon lp-icon-large lp-icon-angle-right' title='Next'></i>" +
            "</a>",
        DESIGN_CONTROLS_HTML:
            "<div class='bd-carousel-design-controls'>" +
            "<button class='lp-carousel-prev' data-dir=prev>&lt;</button>" +
            "<span class='lp-carousel-index'>1 / {{numSlides}}</span>" +
            "<button class='lp-carousel-next' data-dir=next>&gt;</button>" +
            "</div>"
    };

    var Container = b$.bdom.getNamespace('http://backbase.com/2013/portalView').getClass('container');

    // utils / globals

    var $ = window.jQuery;

    var parseBoolean = function(val) {
        return JSON.parse(val || false);
    };

    var isDesignMode = function() {
        return window.bd.designMode;
    };


    var modal = Container.extend(function (bdomDocument, node) {
        Container.apply(this, arguments);
        this.isPossibleDragTarget = true;
    }, {
        localName: 'CarouselContainer',
        namespaceURI: 'launchpad',
        DOMReady: function () {
            var self = this;
            this.$body = $(this.htmlNode);

            //get preferences
            var numSlides = this.getPreference(prefs.NUM_SLIDES);
            var effect = this.getPreference(prefs.EFFECT);
            var pagination = parseBoolean(this.getPreference(prefs.PAGINATION));
            var navigation = parseBoolean(this.getPreference(prefs.NAVIGATION));
            var autoplay = isDesignMode() ? false : parseBoolean(this.getPreference(prefs.AUTOPLAY));
            var autoplayDuration = parseFloat(this.getPreference(prefs.AUTOPLAY_DURATION));
            var autoplayPauseHover = parseBoolean(this.getPreference(prefs.AUTOPLAY_PAUSE_HOVER));
            var transitionSpeed = parseFloat(this.getPreference(prefs.TRANSITION_SPEED));
            var easing = this.getPreference(prefs.EASING);

            var options = {
                autoplay: autoplay,
                autoplayDuration: autoplayDuration,
                autoplayPauseHover: autoplayPauseHover,
                transitionSpeed: transitionSpeed,
                easing: easing
            };

            //choose a carousel implementation
            var $slidesWrapper = this.$body.children(".lp-carousel-slides");
            if(effect === "slide") {
                self.carousel = new SlidingCarousel($slidesWrapper, this.htmlAreas, options);
            } else {
                self.carousel = new FadingCarousel($slidesWrapper, this.htmlAreas, options);
            }

            //handle preference changes
            this.addEventListener("preferencesSaved", function (event) {
                //update the areas of this container if the number of slides change
                var newNumSlides = self.getPreference(prefs.NUM_SLIDES);
                if(newNumSlides > self.htmlAreas.length) {
                    //add areas
                    var i, area, diff = newNumSlides - self.htmlAreas.length;
                    for(i = 0; i < diff; i++) {
                        area = html.SLIDE;
                        self.htmlAreas.push(area);
                    }
                } else if(newNumSlides < self.htmlAreas.length) {
                    //remove areas
                    self.htmlAreas = self.htmlAreas.slice(0, newNumSlides);
                }

                self.model.save(function() {
                    self.refreshHTML();
                });
            });

            // If you try to delete the widget after the preferences of the container are saved
            // and the html is refreshed, it breaks
            // savePreferenceForm is triggered before that, so it is safer to do it at this point
            this.addEventListener("savePreferenceForm", function (event) {
                // new prefs are here, but not saved to model yet
                var newNumSlides = self.getPreference(prefs.NUM_SLIDES);
                if(newNumSlides < self.htmlAreas.length) {
                    var child, i, totalWidgets = 0, widgetsDeleted = 0;

                    // iteration to find how many widgets we need to delete
                    for (i in self.model.get_childElements()) {
                        if (self.model.get_childElements().hasOwnProperty(i)) {
                            child = self.model.get_childElements()[i];
                            if (child.getPreference("area")>=newNumSlides) {
                                totalWidgets++;
                            }
                        }
                    }

                    // If there are widgets to delete, we need to prevent the event propagation
                    // if the container does a model.save() before all widgets are removed and
                    // some requests are still running, then everthing breaks
                    if (totalWidgets > 0) {
                        event.stopPropagation();
                    }
                    var cb = function (deleted) {
                        return function () {
                            // when every widget has been deleted, we dispatch the same event
                            // from the beginning. There are no more widgets to delete, so this
                            // process will be skipped the second time we dispatch the event
                            if (deleted===totalWidgets) {
                                event.target.dispatchCustomEvent('savePreferenceForm', true, true, event.detail);
                            }
                        };
                    };
                    for (i in self.model.get_childElements()) {
                        if (self.model.get_childElements().hasOwnProperty(i)) {
                            child = self.model.get_childElements()[i];
                            if (child.getPreference("area")>=newNumSlides) {
                                child.destroyAndSave(cb(++widgetsDeleted));
                            }
                        }
                    }
                }
            });


            //container only inserted into the dom at the end of current execution
            window.setTimeout(function() {

                //add navigation controls
                if(navigation) {
                    var $prevButton = $(html.BTN_PREV);
                    var $nextButton = $(html.BTN_NEXT);
                    self.$body.prepend($nextButton);
                    self.$body.prepend($prevButton);
                }

                //add pagination controls
                if(pagination) {
                    var $pagination = $(html.PAGINATION_WRAP);
                    var $paginationList = $pagination.find("ul");
                    var i;
                    for(i = 0; i < numSlides; i++) {
                        $paginationList.append("<li><a data-page=" + i + ">" + (i + 1) + "</a></li>");
                    }
                    self.$body.append($pagination);
                    self.carousel.on("change-slide", function(e, index, dir) {
                        $paginationList.find("li").removeClass("active").eq(index).addClass("active");
                    });
                }

                //pause auto play on hover
                if(autoplay && autoplayPauseHover) {
                    self.$body.on("mouseenter", function() {
                        self.carousel.stopAutoplay();
                    });
                    self.$body.on("mouseleave", function() {
                        self.carousel.startAutoplay();
                    });
                }

                //nav events
                self.$body.on("click", ".lp-carousel-prev, .lp-carousel-next", function() {
                    var fn = $(this).data("dir");
                    self.carousel[fn].call(self.carousel);
                });
                self.$body.on("click", ".lp-carousel-pagination a", function() {
                    var index = $(this).data("page");
                    self.carousel.show(index, 0);
                });

                if(isDesignMode()) {
                    self._buildDesignControls(numSlides);
                }

                self.carousel.init();
            },0);

            this.carousel.on("change-slide", function(e, index) {
                if(self.htmlAreas) {
                    var slide = $(self.htmlAreas[index]).find(".bp-widget");
                    // send 'deferred' event
                    slide.attr("data-event", "launchpad:show");
                    slide.trigger("launchpad:show");
                }
            });
        },
        /**
         * Add the design mode controls to the display
         */
        _buildDesignControls: function(numSlides) {

            var $controls = $(html.DESIGN_CONTROLS_HTML.replace("{{numSlides}}", numSlides));
            this.$body
                .append($controls)
                .on("mouseenter",function () {
                    $controls.fadeIn();
                }).on("mouseleave", function () {
                    $controls.fadeOut();
                });
            this.carousel.on("change-slide", function(e, index, dir) {
                $controls.find(".lp-carousel-index").html((index + 1) + " / " + numSlides);
            });
        }
    }, {
        template: function (json) {
            var data = {item: json.model.originalItem};
            var sTemplate = window['templates_' + this.localName][this.localName](data);
            return sTemplate;
        }
    });

    /**
     * Base Carousel implementation
     * @param slides
     * @param options
     * @constructor
     * @abstract
     */
    var Carousel = function(slides, options) {

        if(options) {
            this.speed = options.transitionSpeed || 500;
            this.autoplay = options.autoplay || false;
            this.autoplayDuration = options.autoplayDuration || 5000;
            this.pauseOnHover = options.autoplayPauseHover || false;
            this.easing = options.easing || "swing";
        }
        if(slides) {
            this.slides = slides;
            this.$slides = $(this.slides);
        }

        this.o = this.o || $({});
        this.index = 0;
    };

    /**
     * Shows the first slide and starts autoplay
     */
    Carousel.prototype.init = function() {

        $(this.slides[this.index]).show();
        this.o.trigger.call(this.o, "change-slide", [ this.index, 0]);
        if(this.autoplay && isDesignMode()) {
            this.startAutoplay();
        }
    };

    /**
     * Subscription method to carousel events.
     * @param event
     * @param callback
     */
    Carousel.prototype.on = function(event, callback) {

        this.o.on(event, callback);
    };

    /**
     * Stops/pauses autoplay
     */
    Carousel.prototype.stopAutoplay = function() {

        if(this._playing) {
            window.clearInterval(this._playing);
            this._playing = null;
        }
    };

    /**
     * Starts/resumes autoplay
     */
    Carousel.prototype.startAutoplay = function() {

        var self = this;
        if(!this._playing) {
            this._playing = window.setInterval(function() {
                self.next();
            }, this.autoplayDuration);
        }
    };

    /**
     * Displays the next slide
     */
    Carousel.prototype.next = function() {

        var newIndex = this.index + 1 > this.slides.length - 1 ? 0 : this.index + 1;
        this.show(newIndex, 1);
    };

    /**
     * Displays the previous slide
     */
    Carousel.prototype.prev = function() {

        var newIndex = this.index - 1 < 0 ? this.slides.length - 1 : this.index - 1;
        this.show(newIndex, -1);
    };

    /**
     * Shows a slide given an index
     * @abstract
     * @param {number} newIndex The index of the slide to show
     * @param {number} dir The direction to slide to the new index, use -1 for back or +1 for forward
     */
    Carousel.prototype.show = function(newIndex, dir) {

        this.o.trigger.call(this.o, "change-slide", [ newIndex, dir]);
    };

    /**
     * Fading carousel implementation
     * Slides fade from one to the next
     * @param $wrapper A jQuery object containing the parent element which wraps the slides
     * @param slides A list of slide elements
     * @param options
     * @constructor
     */
    var FadingCarousel = function($wrapper, slides, options) {

        Carousel.call(this, slides, options);

        this.$wrapper = $wrapper;

    };

    //extend carousel
    FadingCarousel.prototype = new Carousel();

    /**
     * Initialize
     */
    FadingCarousel.prototype.init = function() {
        this.$wrapper.addClass("lp-slides-fadewrapper");
        Carousel.prototype.init.call(this);
    };

    /**
     * Fade in a slide with the given index
     * @param newIndex
     */
    FadingCarousel.prototype.show = function(newIndex) {
        var self = this;
        if(this.fading) {
            return;
        }

        Carousel.prototype.show.call(this, newIndex, 0);

        this.fading = true;
        this.$slides.not(this.$slides.eq(newIndex)).fadeOut(this.speed);
        this.$slides.eq(newIndex).addClass("lp-carousel-fading-in").fadeIn(this.speed, function() {
            self.$slides.eq(newIndex).removeClass("lp-carousel-fading-in");
            self.fading = false;
        });
        this.index = newIndex;
    };

    /**
     * Slide carousel implementation
     * @param $wrapper A jQuery object containing the parent element which wraps the slides
     * @param slides A list of slide elements
     * @param options
     * @constructor
     */
    var SlidingCarousel = function($wrapper, slides, options) {
        Carousel.call(this, slides, options);
        this.$wrapper = $wrapper;
    };

    //extend carousel
    SlidingCarousel.prototype = new Carousel();

    /**
     * Initialize
     */
    SlidingCarousel.prototype.init = function() {

        var self = this;

        this.slideWidth = this.$wrapper.closest(".bp-container").width();
        this.$wrapper.addClass("lp-slides-slidewrapper");
        this.$slides.each(function() {
            $(this).css({
                display: "block",
                width: self.slideWidth
            });
        });

        Carousel.prototype.init.call(this);

        //WHY?????????.(width is still 0 on init in design mode)
        if(isDesignMode()) {
            window.setTimeout(function() {
                self.init();
            },100);
        }
    };

    /**
     * Slides in the next slide with circular sliding
     * @param newIndex
     * @param dir
     */
    SlidingCarousel.prototype.show = function(newIndex, dir) {

        //don't do anything if an animation is in progress
        if(this.$wrapper.is(":animated")) {
            return;
        }

        Carousel.prototype.show.call(this, newIndex, dir);
        var self = this;

        var slideWrapperLeft, circular;
        if(this.index === this.slides.length - 1 && newIndex === 0 && dir > 0) {
            //currently on the last slide and sliding forward to the first
            //this temporarily moves the first slide to the end and puts a space in its place
            //when the slide is complete slide is moved back to the start and the wrapper is reset.
            var $spacer = $("<div class='lp-carousel-slide lp-carousel-spacer'></div>");
            $spacer.width(this.slideWidth);

            var $first = this.$slides.first();
            $first.after($spacer);
            this.$slides.last().after($first);

            slideWrapperLeft = (this.slideWidth * this.slides.length) * -1;
            circular = true;
        } else if(this.index === 0 && newIndex === this.slides.length - 1 && dir < 0) {
            //currently on the first slide and sliding backwards to the last
            //this adds the last slide before the first slide and uses negative margin to prevent the first slide
            //from moving position
            var $last = this.$slides.last();
            $last.css("margin-left", this.slideWidth * -1);
            this.$slides.first().before($last);

            slideWrapperLeft = this.slideWidth;
            circular = true;
        } else {
            //regular slide
            slideWrapperLeft = (this.slideWidth * newIndex) * -1;
            circular = false;
        }

        this.$wrapper.animate({
            left: slideWrapperLeft
        },{
            duration: this.transitionSpeed,
            easing: this.easing,
            complete: function() {
                //reset the strange things done by circular trickery
                if(circular && newIndex === 0) {
                    self.$wrapper.prepend($first);
                    $spacer.remove();
                    self.$wrapper.css("left", 0);
                } else if(circular && newIndex === self.slides.length - 1) {
                    $last.css("margin-left", 0);
                    self.$wrapper.append($last);
                    self.$wrapper.css("left", ((self.slides.length -1)* self.slideWidth) * -1);
                }
            }
        });
        this.index = newIndex;
    };
})();
