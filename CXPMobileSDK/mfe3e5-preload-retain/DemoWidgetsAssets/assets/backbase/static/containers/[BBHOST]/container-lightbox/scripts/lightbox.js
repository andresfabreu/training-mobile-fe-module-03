/*globals window, console, $, launchpad, b$, bd, lp, gadgets*/

(function (b$, gadgets, lp, bd, window, $) {
	'use strict';
	var FADE_OUT = 0,
		autoHeight = false,
		percentageHeight = false,
		percentageWidth = false;

	var Container = b$.bdom.getNamespace('http://backbase.com/2013/portalView').getClass('container');

	Container.extend(function (bdomDocument, node) {
		Container.apply(this, arguments);
		this.isPossibleDragTarget = true;
	}, {
		localName: 'LightboxContainer',
		namespaceURI: 'launchpad',
		DOMReady: function () {
			this.init();
		},

		setLightboxPos: function () {
			var $lightbox = $(this.htmlNode);
			var $lightboxArea = $lightbox.find('> .lp-lightbox-inner > .lp-lightbox-area');
			var $window = $(window);
			var windowWidth = $window.width();
			var windowHeight = $window.height();

			var lightboxWidth = parseInt(this.getPreference('width'), 10);
			var lightboxHeight = parseInt(this.getPreference('height'), 10);
			var lightboxPaddingX = 30;

			if (this.getPreference('height').match(/(%)$/)) {
				percentageHeight = true;
			}
			if (this.getPreference('width').match(/(%)$/)) {
				percentageWidth = true;
			}
			if (lightboxHeight===0) {
				autoHeight = true;
			}


			var width;
			if (windowWidth - lightboxPaddingX < lightboxWidth) {
				width = windowWidth - lightboxPaddingX;
			} else {
				width = lightboxWidth > 0 ? lightboxWidth : 'auto';
			}

			if (autoHeight) {
				$lightboxArea.css({
					maxHeight: windowHeight / 2,
					overflow: 'auto'
				});
			} else {
				$lightboxArea.css({
					height: percentageHeight ? (lightboxHeight / 100) * windowHeight : lightboxHeight,
					overflow: 'auto'
				});
			}

			$lightbox.css({
				width:  percentageWidth ? (lightboxWidth / 100) * windowWidth : width
			});
		},

		//lightbox closing
		hideLightbox: function () {
			// lp.util.hideBackdrop();
			var self = this;
			var $body = $('body');
			var $lightbox = $(this.htmlNode).parent();

			// TODO: append to a right position, now appending to the end
			$lightbox.detach().appendTo(this.parent);

			if ($('.lp-lightbox-on').not($lightbox).length===0) {
				this.hideOverlay();
			}



			$lightbox.fadeOut(FADE_OUT, function () {
				$lightbox.css({
					width:  '',
					minHeight: '',
					left:   '',
					top:    '',
					display: ''
				});
				$lightbox.removeClass('lp-lightbox-on');
				$body.css('overflow', '');

				if (bd.designMode) {
					// $lightbox.show();
					self.$wrapper.css('display', '');
					self.$lightbox.css('width', '');
				}
			});
		},

		//lightbox launching
		showLightbox: function () {

			var $lightbox = $(this.htmlNode).parent();
			this.parent = $lightbox.parent();

			$lightbox.detach()
				.appendTo('#main')
				.addClass('lp-lightbox-on')
				.show()
				.find('.lp-springboard-widget-body')
				.show();

			this.showOverlay();
			this.setLightboxPos();
			// $('body').css('overflow', 'hidden');
		},


		/**
		 * Checks if container editable or not
		 * @return {Boolean}
		 */
		isEditable: function (){
			var page = this;
			while (page.model.tag.toLowerCase() !== 'page' && page.model.tag.toLowerCase() !== 'portal' && page.model.tag.toLowerCase() !== 'application') {
				page = page.parentNode;
			}
			var onMasterPage = page.pageType !== 'inherited';
			var editable = (!onMasterPage && (!this.model.manageable || this.model.manageable === 'true')) || onMasterPage;

			return editable;
		},


		init: function (){
			if(!this.initialized){
				this.initialized = true;

				var self = this;
				var title = this.getPreference('title');
				var $lightbox = $(this.htmlNode);
				var showClose = this.getPreference('show-close');
				var openTriggers = this.getPreference('open-trigger').split(' ');
				var hideHeader = this.getPreference('hide-header');

				self.$lightbox = $lightbox;
				self.$wrapper = $('<div class="lp-aligner" />');

				$lightbox.wrap(self.$wrapper);

                if (hideHeader) {
                    $lightbox.find(".panel-heading").first().addClass("hidden");
                }

				openTriggers.push(this.model.name + '_open');

				$(window).on('resize', function () {
					if ($lightbox.hasClass('lp-lightbox-on')) {
						self.setLightboxPos();
					}
				});


				var i, len = openTriggers.length;
				for (i = 0; i < len; i++) {
					var openTrigger = openTriggers[i];
					if (openTrigger.toLowerCase() === 'onload') {
						//special triggers
						$(window).ready($.proxy(this, 'showLightbox'));
					} else {
						//user triggers
						gadgets.pubsub.subscribe(openTriggers[i], $.proxy(this, 'showLightbox'));
					}
				}


				var closeTriggers = this.getPreference('close-trigger').split(' ');
				closeTriggers.push(this.model.name + '_close');
				len = openTriggers.length;


				for (i = 0; i < len; i++) {
					gadgets.pubsub.subscribe(closeTriggers[i], $.proxy(this, 'hideLightbox'));
				}

				$('.lp-lightbox-close', $lightbox).first().on('click', $.proxy(this, 'hideLightbox'));

				//design mode tools
				if (bd.designMode && this.isEditable()) {

					var previewHtml = $('<div class="lp-lightbox-preview lp-nonfunc-item"/>').text(title);
					$lightbox.prepend(previewHtml);

					$lightbox.on('click', '.lp-lightbox-preview', $.proxy(this, 'showLightbox'));
				}

				if (!bd.designMode && showClose === false || showClose === 'false') {
					$lightbox.find('.lp-lightbox-close').hide();
				}

				// set the lightbox chrome title
				$lightbox.find('.lp-widget-title').first().text(title);

			}

		},


		/**
		 * TODO: split and simplify init function
		 * Add lightbox handlers
		 */
		addHandlers: function(){

		},


		/**
		 * Show Lightbox overlay
		 * @private
		 */
		showOverlay:function () {
			if (!this.overlay) {
				var overlay = $('#lp-lighbox-overlay');
				this.overlay = overlay.length ? overlay :
					$('<div id="lp-lighbox-overlay" class="lp-overlay" style="display: none;" />').appendTo('#main');
				this.overlay.on('click', $.proxy(this, 'hideLightbox'));
			}
			this.overlay.fadeIn('fast');
		},

		/**
		 *
		 * @private
		 */
		hideOverlay:function () {
			if (this.overlay) {
				this.overlay.fadeOut('fast');
			}
		},

		/**
		 * Destroy callback
		 */
		destroy: function () {
			this.hideOverlay();
			return Container.prototype.destroy.call(this);
		}



	}, {
		template: function (json) {
			var data = {item: json.model.originalItem};
			var sTemplate = window['templates_' + this.localName][this.localName](data);
			return sTemplate;
		},
		handlers: {
			'preferencesSaved': function(ev){
				if(ev.target.nodeName === 'LightboxContainer'){
					var self = ev.currentTarget;

					var newTitle = self.getPreference('title');
					self.$lightbox.find('.lp-widget-title').first().text(newTitle);

					if (bd.designMode) {
						self.$lightbox.children('.lp-lightbox-preview').text(newTitle);
					}

				}
			}
		}
	});


})(b$, gadgets, lp, bd, window, $);
