define(function(require, exports, module) {
    'use strict';


    var Mustache = window.Mustache; // #TODO UMD-ify
    var b$ = window.b$;// #TODO UMD-ify

    // @ngInject
    exports.WidgetCatalog = function(lpWidget, lpCoreUtils, lpCoreI18n, lpCoreBus, $translate) {
        var $ = window.jQuery; //#TODO UMD-ify
        var widget = lpWidget;
        var templates = {
            widget: null,
            preview: null
        };

        var serverRoot = lpCoreUtils.getPortalProperty('serverRoot');
        var portalName = b$ && b$ && b$.portal.portalName;
        var URL_CATALOG = serverRoot + '/portals/' + encodeURI(portalName) + '/catalog.xml?f=type(eq)WIDGET&ps=100';

        var bus = lpCoreBus;


        function WidgetCatalog(w) {

                var self = this;

                self.widget = w;

                self.$body = $(w.body);
                self.$preview = $('.lp-catalog-preview', self.$body);

                self.paginationAfterLoading = false;
                self.buildingCatalog = false;

                self.catalog = {};
        }
            /**
             * Init method added for the wrapper
             */
        WidgetCatalog.prototype.init = function() {
            var self = this;

            // portal client needs to know that this widget is a catalog for d&d
            self.widget.isCatalog = true;
            self.paginationAfterLoading = true;

            templates.widget = self.$body.find('script[data-template=widget]').html();
            templates.preview = self.$body.find('script[data-template=preview]').html();

            // if already loaded or if it's still loading, don't load the catalog again
            if (!$('.lp-catalog-page', self.$body).length) {
                if (!self.buildingCatalog) {
                    self.buildCatalog();
                }
            } else {
                self.buildingCatalog = false;
            }

            self.bindEvents();

            this.currentContainer = null;
            bus.subscribe('containerReadyForCatalog', function(container) {
                self.currentContainer = container;
            });

            bus.publish('widgetCatalogLoaded', self.widget);
        };

        /**
         * Load the catalog xml and build it.
         */
        WidgetCatalog.prototype.buildCatalog = function() {

            var self = this;

            var url = self.getCatalogRequestURL();
            self.buildingCatalog = true;

            var xhr = $.get(url);
            xhr.done(function(data) {
                self.renderCatalog(b$.portal.portalServer.itemXMLDOC2JSON(data).children);
                self.buildingCatalog = false;

                if (self.paginationAfterLoading) {
                    self.buildPagination();
                } else {
                    self.stopLoading();
                }
            });
        };

        WidgetCatalog.prototype.bindEvents = function() {
            var self = this;

            self.$body.on('click', '.lp-catalog-item .lp-catalog-add', function(e) {
                e.preventDefault();
                self.addToContainer($(this).data('catalogid'));
            });


            // prevent drag when clicking on install button
            self.$body.on('mousedown', '.lp-catalog-item .lp-catalog-add', function(e) {
                e.stopImmediatePropagation();
                e.stopPropagation();
            });

            self.$body.on('click', '.lp-catalog-item .lp-catalog-showPreview', function(e) {
                e.preventDefault();
                self.showPreview($(this).data('catalogid'));
            });

            self.$body.on('click', '.lp-catalog-preview .lp-catalog-back', function(e) {
                e.preventDefault();
                self.$preview.fadeOut();
            });
        };

        /**
         * Return the url to the catalog, using the preference filterByTag
         * @return {String}
         */
        WidgetCatalog.prototype.getCatalogRequestURL = function() {

            var url = URL_CATALOG;
            var filter = this.widget.model.getPreference('filterByTag');

            //TODO: why should filter be equal to the string undefined?
            if (filter && filter !== 'undefined') {
                url += '&f=tag.name(like)' + encodeURI(filter);
            }

            return url;
        };

        /**
         * Create the html from the list of json catalog items
         * @param items
         */
        WidgetCatalog.prototype.renderCatalog = function(items) {
            var self = this,
                currentPage,
                currentRow;



            $.each(items, function(i, item) {

                if (i % (3 * 3) === 0) {
                    currentPage = $('<div class="lp-catalog-page lp-slides-page"></div>');
                    $('.lp-catalog-content', self.$body).append(currentPage);

                    currentRow = $('<div class="lp-catalog-row row-fluid clearfix"></div>');
                    currentPage.append(currentRow);
                }

                var icon = item.preferences.icon.value ? item.preferences.icon.value : item.extendedItemName.replace('widget-', '').replace('-v1', '');

                var $item = $(Mustache.to_html(templates.widget, {
                    uuid: item.uuid,
                    //icon: (item.preferences.icon) ? b$.portal.config.serverRoot + item.preferences.icon.value : '',
                    icon: icon,
                    title: lpCoreI18n.instant(item.preferences.title.value)
                }));
                //console.log(item.preferences.title.value);

                self.catalog[item.uuid] = item;

                currentRow.append($item);
            });
        };
        console.log(lpCoreI18n.instant('Video'), $translate.preferredLanguage());

        /**
         * Build the slides / pagination
         */
        WidgetCatalog.prototype.buildPagination = function() {
            var self = this;
            // do not build twice the slides
            if (this.$body.find('.slides_control').length > 0) {
                return;
            }

            var numberOfPages = this.$body.find('.lp-slides-page').length;

            if (numberOfPages > 1) {
                var $pagination = this.$body.find('.lp-catalog-pagination');
                this.$body.find('.lp-catalog-bottom').show();

                for (var i = 0; i < numberOfPages; i++) {
                    $pagination.append(
                        $('<li><a href="#"" data-slidesjs-item=' + i + '>' + (i + 1) + '</a></li>')
                    );
                }

                $pagination.find('li:nth-child(1)').addClass('current');

                $pagination.find('a').click(function(e) {
                    e.preventDefault();
                    $('.lph-slides-pagination li').removeClass('current');
                    self.$body.find('.lph-slides-container').slidesjs('stop', true);
                    self.$body.find('.lph-slides-container').slidesjs('goto', ($(e.currentTarget).attr('data-slidesjs-item') * 1) + 1);
                    $(e.currentTarget.parentElement).addClass('current');
                });

                $('.lph-slides-container', this.$body).slidesjs({
                    width: 900,
                    height: 355,
                    navigation: {
                        active: false
                    },
                    pagination: {
                        active: false
                    }
                });
            }

            this.$body.find('.lp-catalog-loading').fadeOut();

            this.stopLoading();
        };

        /**
         * Remove the loading overlay from the slides area
         */
        WidgetCatalog.prototype.stopLoading = function() {

            $('.lp-catalog-loading', this.$body).hide();
        };

        /**
         * Method to add a widget to the parent container without drag and drop.
         * This is used by the install button.
         * It will fire a AddCatalogItemToDashboard model event
         * @param id
         */
        WidgetCatalog.prototype.addToContainer = function(id) {

            var item = this.catalog[id];

            if (this.currentContainer && typeof this.currentContainer.addItem === 'function') {
                this.currentContainer.addItem(item);
            }
        };

        /**
         *
         * @param itemId
         */
        WidgetCatalog.prototype.showPreview = function(itemId) {

            var item = this.catalog[itemId];
            var title = (item.preferences) ? item.preferences.title.value : '';
            var description = (item.preferences.Description) ? item.preferences.Description.value : '';
            var preview = (item.preferences.previewUrl) ? item.preferences.previewUrl.value.replace('$(contextRoot)', serverRoot) : '';
            this.$preview.html(Mustache.to_html(templates.preview, {
                uuid: item.uuid,
                title: title,
                icon: (item.preferences.icon) ? serverRoot + item.preferences.icon.value : '',
                description: description,
                preview: preview
            }));

            this.$preview.fadeIn();
        };

        return WidgetCatalog;
    };
});
