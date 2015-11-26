/*global b$, gadgets, bd, window, jQuery, require */

(function (b$, gadgets, bd, $) {
	'use strict';
	// b$.view.url2state.active = false;

	var EVENT_NOTIFY_PANEL_OPEN = 'lp-launcher-panel-open';
	var EVENT_NOTIFY_PANEL_CLOSE = 'lp-launcher-panel-close';

	// var EVENT_PANEL_LOADED = 'DeckPanelLoaded';
	var EVENT_CONTEXT_CHANGED = 'launchpad-retail.activeContextChanged';

	var EVENT_TOGGLE_MENU = 'launchpad-retail.toggleLauncherMenu';
	var EVENT_CLOSE_ACTIVE_PANEL = 'launchpad-retail.closeActivePanel';
	var EVENT_SET_OFFSET = 'launchpad-retail.offsetTopCorrection';
	var EVENT_ADD_NOTIFICATION = 'launchpad.add-notification';


	/**
	 * Checks if element is editable or form element
	 * @param  {HTMLElement} inspected element
	 * @return {Boolean}
	 */
	var isEditable = function(el) {
		var tagName = el.tagName.toLowerCase();
		var editable = el.getAttribute('contenteditable');
		return editable || ['input', 'textarea', 'select', 'button', 'label'].indexOf(tagName) > -1;
	};


	/**
	 * <p>Returns true if:
	 * <ol>
	 *  <li>the value is a boolean and true<br>
	 *  <li>the value is a number and not 0<br>
	 *  <li>the value is a string and equal to 'true' (after trimming and ignoring case)
	 * </ol>
	 * @memberOf util
	 * @param {*} val The value to parse
	 * @return {boolean} A boolean value depending on the parsing result
	 */
	var parseBoolean = function(val) {
		return (typeof val === 'boolean' && val) ||
			(typeof val === 'string' && /\s*true\s*/i.test(val)) ||
			(typeof val === 'number' && val !== 0);
	};



	var DeckContainer = b$.bdom.getNamespace('launchpad').getClass('DeckContainer');
//  ----------------------------------------------------------------
	DeckContainer.extend(function (bdomDocument, node) {
		DeckContainer.apply(this, arguments);
		this.isPossibleDragTarget = false;
	}, {
		localName: 'LauncherDeckContainer',
		namespaceURI: 'launchpad',

		/**
		 * Sets up the container by creating 2 initial panels inside the container
		 * @constructor
		 */
		DOMReady: function(ev) {
			var initialized = parseBoolean(this.getPreference('initialized'));

			if(!initialized){
				// Initialize Launcher Container
				this._initialize(ev);
			} else {
				// Initialize Deck Container
				DeckContainer.prototype.DOMReady.call(this, ev);
				this._addHandlers();
			}
		},


		_initialize: function() {
			var defaultPanelName = this._getNewPanelName();
			this.setPreference('initialized', true);
			this.setPreference('defaultPanel', defaultPanelName);
			this.model.save();


			// Add 2 initial panels
			this.addPanel(this._getNewPanelData({
				id: defaultPanelName,
				order: '0',
				panel: 'mainhidden',
				title: 'Default panel',
				loadChildren: 'true'
			}));

			this.addPanel(this._getNewPanelData({order: '1'}));
		},


		/**
		 * Add launcher handlers
		 */
		_addHandlers: function(){
			var self = this;
			var UI = this._getUI();
			this.dir = document.dir || document.getElementsByTagName('html')[0].getAttribute('dir');

			require(['hammerjs'], function(Hammer) {

				// Enable mobile-device events
				if(typeof Hammer !== 'undefined' && !bd.designMode && ('ontouchstart' in window)) {
					var element = document.body;
					var eventType = 'swipe';
					var mc = $(element).data('touch');
					if (!mc) {
						mc = new Hammer( element, {
							'swipe_velocity': 0.4
						});
						$(element).data('touch', mc);
					}
					mc.on(eventType, self._swipeHandler.bind(self));
				}
			});

			UI.container.on('click', '[data-action="lp-tab-open"]', $.proxy(this, '_tabClickHandler'));
			UI.container.on('click', '[data-action="lp-tab-hide"]', $.proxy(this, '_closeActivePanel'));

			gadgets.pubsub.subscribe(EVENT_TOGGLE_MENU, $.proxy(this, '_toggleLauncherMenu'));
			gadgets.pubsub.subscribe(EVENT_CLOSE_ACTIVE_PANEL, $.proxy(this, '_closeActivePanel'));
			gadgets.pubsub.subscribe(EVENT_SET_OFFSET, $.proxy(this, '_offsetTopCorrection'));
			gadgets.pubsub.subscribe(EVENT_ADD_NOTIFICATION, $.proxy(this, '_sessionHandler'));

		},

		_offsetTopCorrection: function(offset){
			if(offset && offset.offsetTopCorrection){
				$(this.htmlNode).css({
					'margin-top': offset.isStatic ? '' : offset.offsetTopCorrection
				});
			}
		},

		_notifyChildren: function(eventName, panel){
			function notifyChildren (vc) {
				$.each(vc.childNodes || [], function () {
					if (this.childNodes && this.childNodes.length) {
						notifyChildren(this);
					} else {
						this.dispatchCustomEvent(eventName, panel);
					}
				});

			}
			if (panel) {
				notifyChildren(panel);
			}
		},

		_swipeHandler: function(ev){
			var eventType = ev.type;
			var dir = ev.direction;
			// prevent left/right swipes from scrolling page
			ev.preventDefault();

			// Check both LTR and RTL
			if(eventType === 'swipe' && (dir === 4 || dir === 2) ) {
				var toggleClass = (dir === 4 && this.dir === 'ltr' || dir === 2 && this.dir === 'rtl');
				this._toggleLauncherMenu(toggleClass);
			}
		},


		_tabClickHandler: function(ev){
			if (!$(ev.currentTarget).hasClass('external-link')){
				ev.preventDefault();
				var id = $(ev.currentTarget).closest('[data-panel]').data('panel') || 0;
				this.showPanel(id, true);
			}
		},

		/**
		 * Lazy loading for panels + enable design tools in the CXP Manager
		 * @param  {object} panel object
		 */
		_loadChildren: function(panel) {
			// enable design tools recursively
			function enableTools (item){
				if(bd && bd.designMode && item && item.showDesignTools) {
					item.showDesignTools();
					$.each(item.childNodes || [], function(){
						enableTools(this);
					});
				}
			}

			if(panel && panel.loadChildren){
				panel.loadChildren(null, enableTools);
			}
		},

		/**
		 * make sure user will see sidebar with login screen after get logged out
		 * @param  {object} pubsub message
		 */
		_sessionHandler: function(data) {
			if(data && data.notification && data.notification.id === 'session-expired'){
				this._toggleLauncherMenu(true);
			}
		},


		_getUI: function() {
			var container = $(this.htmlNode),
				content = this.getDisplay('content');

			this._ui = {
				container: container,
				main: this.getDisplay('main'),
				left: this.getDisplay('left'),
				content: content,
				areas: $(content).children('.lp-launcher-area')
			};

			return this._ui;
		},


		refreshHTML: function(callback, errCallback) {
			// console.log('refreshHTML');
			this._hideOverlay();
			// var t1 = new Date().getTime();
			$(this.htmlNode).addClass('lp-lc-refresh');
			DeckContainer.prototype.refreshHTML.call(this, function(bres, res){
				// var t2 = new Date().getTime();
				// console.log('refreshed',  t2 - t1, 'ms');
				if(typeof callback === 'function'){
					callback(bres, res);
				}
			}, errCallback);
		},

		_getDefaultPanel: function() {
			var defaultPanel = this.getPreference('defaultPanel');
			// check if element is extended from the Masterpage
			var name = this.model && this.model.name.split('~');
			return this.getPanel(defaultPanel + (name.length === 2 ? '~' + name[1] : ''));
		},

		_toggleTab: function(tab, toggle) {
			var UI = this._getUI();
			var $tab = $(tab);
			var panel = tab && this.getPanel($tab.data('panel'));
			var $tabs = $(UI.left).children();
			var fn = function($el, val){
				$el.children('.lp-launcher-tab')
					.toggleClass('active', val)
					.find('.lp-launcher-tab-arrow > i')
					.toggleClass('lp-icon-cross', val);
			};


			// notify child items about closing a panel
			var activePanel = this.getPanel(UI.areas.filter(function(el){
				return $(this).hasClass('active');
			}).data('panel'));

			if(activePanel){
				this._notifyChildren(EVENT_NOTIFY_PANEL_CLOSE, activePanel);
			}
			if (tab && toggle) {
				this._notifyChildren(EVENT_NOTIFY_PANEL_OPEN, panel);
			}


			// remove all active tabs
			fn($tabs, false);

			// toggle tab if passed
			fn($tab, toggle);
		},

		/**
		 * Displays a panel given an index or a name. Launcher Container specific.
		 * Launcher Container might have several "active" (visible) panels
		 *  @param panelId: (string) name or index of the panel to be shown
		 */
		showPanel: function(panelId, clicked) {
			var self = this;
			var panel = this.getPanel(panelId);
			var UI = this._getUI();
			var area, tab;
			var defaultPanel = this.getPreference('defaultPanel');
			var isDefault = defaultPanel && panel && panel.model.name.indexOf(defaultPanel) > -1;
			var isActive, isHidden;
			var $defaultPanel = $(this.getDisplay('default'));

			if(panel){
				panelId = panel.model.name;

				area = this._getArea(panelId);
				tab = this._getTab(panelId);

				this._loadChildren(panel);

				if(tab.hasClass('lp-launcher-slide')){
					tab.toggleClass('lp-launcher-open lp-launcher-close')
						.addClass('lp-launcher-animating');

					setTimeout(function() {
						tab.removeClass('lp-launcher-animating');
					}, 500);
				}
				else {

					if(tab.children('a.lp-lc-tab-inlinehidden').length > 0){
						return;
					}
					isActive = area.hasClass('active');
					isHidden = area.hasClass('lp-launcher-area-mainhidden');

					if(isDefault || isActive && (!isHidden || isHidden && clicked)){
						this._closeActivePanel();

						if ($defaultPanel.hasClass('lp-launcher-area-fixed')) {
							setTimeout(function() {
								$defaultPanel.parent().css('min-height', $defaultPanel.outerHeight());
							}, 100);
						}
					} else {
						this._toggleTab(tab, true);
						self._showOverlay();

						// After animation is over focus will be returned to the last focused element
						setTimeout(function() {
							area.focus();
							self._fixOverflow();
						}, 400);

						UI.areas.hide().removeClass('active');
						area.show().addClass('active');
						if ($defaultPanel.hasClass('lp-launcher-area-fixed')) {
							$defaultPanel.show();
						}

						UI.container.removeClass('lp-launcher-left');
						self._animateScrollToElement(0);

						// Update state and URL
						self.state = panelId;
						self.pageTitle = panel.model.getPreference('title');
						self._updateState(self.pageTitle);

						// Attach keyboard listeners - use document for ie8
						$(document).on('keydown.launcherKeys', $.proxy(this, '_keydownHandler'));

						// Fire events
						// gadgets.pubsub.publish(EVENT_PANEL_LOADED, panelId);
					}
				}
			}
		},

		/**
		 * Overwrite Deck
		 * @return {[type]} [description]
		 */

		removePanel: function(id) {
			var self = this;
			var panel = this.getPanel(id);
			panel.model.destroyAndSave(function(){
				self.refreshHTML();
			});
		},

		enhancePreferenceForm: function(ev){
			ev.stopPropagation();
		},


		getPanel: function(panelId) {
			return (panelId && panelId.model) ? panelId :
				DeckContainer.prototype.getPanel.call(this, panelId);
		},

		/**
		 * fix negative margin (view cropping) issue
		 */
		_fixOverflow: function() {
			var container = $(this.htmlNode);
			container.css('overflow', 'visible').css('overflow', '');
		},


		_getTab: function(panelId) {
			var ui = this._getUI();
			return $(ui.left).children('[data-panel="' + panelId + '"]');
		},

		_getArea: function(panelId) {
			var container = $(this.htmlNode);
			return container.find('.lp-launcher-area[data-panel="' + panelId + '"]');
		},


		/**
		 * Extend Deck function which provides data for panel creation
		 * @param  {object} data Default values
		 * @return {object}
		 */
		_getNewPanelData: function(data){
			var order = this._getPanels().length;
			data = data || {};
			return {
				area: data.order || order,
				order: data.order || order,
				id: data.id || this._getNewPanelName(),
				properties: [{
					name: 'icon',
					description: '',
					value: data.icon || 'star',
					label: 'Icon',
					viewHint: 'text-input,designModeOnly,manager'
				}, {
					name: 'customClasses',
					description: '',
					value: data.customClasses || '',
					label: 'Custom Classes',
					viewHint: 'text-input,designModeOnly,manager'
				}, {
					name: 'title',
					label: 'Title',
					value: data.title || this.PANEL_NAME_PREFIX + ( order + 1 ),
					viewHint: 'text-input,designModeOnly,manager'
				}, {
					name: 'panel',
					label: 'Content (and tab type)',
					value: data.panel || 'main',
					viewHint: 'text-input,designModeOnly,manager'
				}, {
					type: 'boolean',
					name: 'loadChildren',
					label: 'Preload content',
					value: data.loadChildren || 'false',
					viewHint: 'checkbox,designModeOnly,manager'
				}, {
					type: 'boolean',
					name: 'hideChrome',
					label: 'Hide Chrome',
					value: data.hideChrome || 'false',
					viewHint: 'checkbox,designModeOnly,manager'
				}]
			};
		},


		/**
		 * Overwrite Deck _displayInitialPanel
		 * @return {[type]} [description]
		 */
		_displayInitialPanel: function() {
			var self = this;
			this.state = this.getPreference('state');
			this.state = this.state || this.getPreference('defaultPanel');

			// If preloading is turned off we need to lazy load visible inline panels
			$.each(this.childNodes || [], function(){
				var type = this.getPreference('panel');
				var loadChildren = this.getPreference('loadChildren');

				// Trigger loading for panels
				if(type && ['inlinehidden', 'inlineopen'].indexOf(type) > -1 && loadChildren === 'false'){
					self._loadChildren(this);
				}
			});

			if (this.state) {
				this.showPanel(this.state);
			}
		},

		/**
		 * Overwrite Deck updateUrl
		 */
		updateUrl: function(){
			// DeckContainer.prototype.updateUrl.call(this);
		},

		_toggleLauncherMenu: function(value){
			$(this.htmlNode).toggleClass('lp-launcher-left', value);
		},

		_closeActivePanel: function() {
			var UI = this._getUI();
			this._hideOverlay();

			this._toggleTab(null, false);

			UI.areas.hide().removeClass('active');
			$(this.getDisplay('default')).show();

			this.state = null;
			this._updateState();

			// Remove keyboard listeners when widget closes
			$(document).off('.launcherKeys');
			this._fixOverflow();
		},


		/**
		 * Publish message with new title for Navbar
		 * @private
		 */
		_updateState: function(pageTitle) {
			// console.log('_updateState', pageTitle);
			gadgets.pubsub.publish(EVENT_CONTEXT_CHANGED, { newActiveContext: pageTitle || ''});

			// this._updateTitle(pageTitle);
			// b$.view.url2state.active = false;
			// this.updateUrl();
		},


		/**
		 * Update window title
		 * @private
		 */
		_updateTitle: function(pageTitle) {
			var title = document.getElementsByTagName('title')[0];
			if(title && title.innerText){
				title.innerText = pageTitle ? pageTitle : 'Home';
			}
		},


		/**
		 * Disable dnd
		 * @private
		 */
		_setDND: function (value) {
			// disable/restore DND behind overlay
			function setDND (vc, val){
				var parent = vc && vc.parentNode;
				if (parent){
					if(!val){
						parent.isPossibleDragTargetCache = parent.isPossibleDragTarget;
					}
					if(typeof parent.isPossibleDragTargetCache !== 'undefined'){
						parent.isPossibleDragTarget = val ? parent.isPossibleDragTargetCache : false;
					}
					setDND(parent, val);
				}
			}

			// disable/restore DND to the Default panel while other panel is active
			function setDNDChildren (vc, val){
				var children = vc && vc.childNodes || [];
				if(!val){
					vc.isPossibleDragTargetCache = vc.isPossibleDragTarget;
				}
				if(typeof vc.isPossibleDragTargetCache !== 'undefined'){
					vc.isPossibleDragTarget = val ? vc.isPossibleDragTargetCache : false;
				}

				$.each(children, function(){
					setDNDChildren(this, val);
				});
			}


			var defaultPanel = this._getDefaultPanel();
			if(defaultPanel) {
				setDNDChildren(defaultPanel, value);
			}

			setDND(this, value);
		},


		/**
		 * Show Launcher overlay
		 * @private
		 */
		_showOverlay: function () {
			if (!this.overlay) {
				var overlay = $('.lp-launcher-overlay');
				this.overlay = overlay.length ? overlay :
					$('<div class="lp-overlay lp-launcher-overlay" style="display: none;" />').appendTo('#main');
			}
			this.overlay.fadeIn('fast');
			$(this.htmlNode).addClass('lp-launcher-overlay-open');

			// disable dnd for all parent items if overlay is open
			this._setDND(false);
		},

		/**
		 * Handle Escape button
		 */
		_keydownHandler: function(ev) {
			// need to use keyCode for ie8
			if (ev.keyCode === 27) {

				var notEditable = !isEditable(document.activeElement || ev.target);
				// Close panel only if current element is not editable
				if(notEditable){
					this._closeActivePanel();
				}
			}
		},


		/**
		 *
		 * @private
		 */
		_hideOverlay: function () {
			if (this.overlay) {
				this.overlay.fadeOut('fast');
				$(this.htmlNode).removeClass('lp-launcher-overlay-open');
			}
			// restore dnd for parent items
			this._setDND(true);
		},


		/**
		 * Scroll to specific element on the page or the value.
		 * @param element
		 * @private
		 */
		_animateScrollToElement: function(el) {
			var top = el ? (typeof el === 'number' ? el : $(el).offset().top) : 0;
			var body = $('html, body');
			var self = this;

			body.css({scrollLeft: 0})
				.animate({scrollTop: top}, 200, 'swing', function(){
					// it not always scrolls to the top well
					self._fixOverflow();
					body.scrollTop(top);
				});
		},

		/**
		 * Destroy callback
		 */
		destroy: function () {
			this._hideOverlay();
			return DeckContainer.prototype.destroy.call(this);
		},

		/**
		 * Owerwrite portalclient to not reshuffle children based on area property
		 * @return {[type]} [description]
		 */
		insertDisplayChild: function(){}
	}, {
		template: function(json) {
			var data = {item: json.model.originalItem};
			var sTemplate = window['templates_' + this.localName][this.localName](data);
			return sTemplate;
		},
		handlers: {
			'preferencesSaved': function(ev){
				// console.log('preferencesSaved', ev);
				var isParentLauncher = ev.target.parentNode.nodeName === 'LauncherDeckContainer';
				var isPanel = ev.target.nodeName === 'PanelContainer';
				var isLauncher = ev.target.nodeName === 'LauncherDeckContainer';
				if(isLauncher || isPanel && isParentLauncher){
					ev.currentTarget.refreshHTML(function(){
						// console.log('done');
					});
				}
			},
			// 'savePreferenceForm': function(ev){
			// 	console.log('savePreferenceForm', ev);
			// },
			// 'preferenceFormReady': function(ev){
			// 	console.log('preferenceFormReady', ev);
			// },
			'preferences-form': function(ev){
				// console.log('preferences-form', this);


				var prefs, aPrefs,
					aNewPrefs = [],
					target = ev.target,
					panels = [];

				// Extend Panel preference form
				if(target.nodeName === 'PanelContainer'){

					prefs = target.model.preferences.array;
					aPrefs = b$.portal.portalModel.filterPreferences(prefs);
					aNewPrefs = [];

					$.each(aPrefs, function(){
						if (this.name === 'panel') {
							this.inputType.name = 'select-one';
							this.inputType.options = [
								{label: 'Side panel (with expanded tab)', value: 'inlineopen'},
								{label: 'Side panel (with collapsed tab)', value: 'inline'},
								{label: 'Side panel (tab without chrome)', value: 'inlinehidden'},
								{label: 'Main panel (with simple tab)', value: 'main'},
								{label: 'Main panel (with hidden tab)', value: 'mainhidden'}
							];
						}
						aNewPrefs.push(this);
					});

					ev.detail.customPrefsModel = aNewPrefs;
				}

				// Extend Launcher preference form
				if(target.nodeName === 'LauncherDeckContainer'){
					prefs = target.model.preferences.array;
					aPrefs = b$.portal.portalModel.filterPreferences(prefs);


					$.each(target.childNodes, function(){
						var panel = this;
						if(panel.model){
							panels.push({
								value: panel.model.name,
								label: panel.model.getPreference('title')
							});
						}
					});

					$.each(aPrefs, function(){
						if (this.name === 'defaultPanel') {
							this.inputType.name = 'select-one';
							this.inputType.options = panels;
						}
						aNewPrefs.push(this);
					});

					ev.detail.customPrefsModel = aNewPrefs;
				}
			}
		}
	});
})(b$, gadgets, bd, window.jQuery);
