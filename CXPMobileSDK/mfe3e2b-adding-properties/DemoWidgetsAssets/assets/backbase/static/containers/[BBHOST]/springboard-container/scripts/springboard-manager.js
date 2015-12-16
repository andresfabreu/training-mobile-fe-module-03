/*globals window, console, jQuery, $ , launchpad, b$, bd, lp*/

/**
 * Springboard Layout
 * @author philip@backbase.com
 */
(function($, window){

    'use strict';

    /**
    /**
     * Events triggered by springboard
     *
     * @enum {String}
     */
    var events = {
        AREA_CHANGED : 'area-changed',
        AREA_ADDED: 'area-added'
    };

    /**
     * Classes used
     *
     * @enum {String}
     */
    var classes = {
        OCCUPIED : 'lp-springboard-occupied',
        SMALL_CELL: 'lp-springboard-smallcell',
        MANAGEABLE : 'lp-springboard-manageable'
    };

    /**
     * Various html templates
     *
     * @enum {String}
     */
    var templates = {
        CONTAINER_ROOT : '<div class="lp-springboard"></div>',
        AREA : '<div class="lp-springboard-area-holder"><div class="lp-springboard-area bp-area --area"></div></div>'
    };

    /**
     * If a cell is resized  below this width, it should be given this class to help themes manager widgets/chromes
     * in tile sized cells
     * @const
     * @type {number}
     */
    var SMALL_CELL_THRESHOLD = 200;

    /**
     * Springboard constructor
     *
     * Creates a Springboard instance.
     * You must call build() to construct the internal model,
     * Then call getHtmlElement() to get rendered html which can inject into a dom
     *
     * @constructor
     * @param {Object} config configuration options
     */
    function Springboard (config) {

        this.options = $.extend({
            rows : 3,
            cols : 7,
            height : 160 * 3,
            isManageable : false
        }, config);

        // jquery object to act as an observable
        this.observable = $({});

        // map of areas key = area id, value = area value
        this.areas = [];

        // jquery object holding the current html of the container
        this.$springboard = $(templates.CONTAINER_ROOT);

        //total height of the springboard
        this.height = this.options.height;

        // number of rows and cols
        this.rows = this.options.rows;
        this.cols = this.options.cols;

        // standard cell width and height
        this.cellWidth = this.options.cellWidth || this.$springboard.width() / this.cols;
        this.cellHeight = this.options.cellHeight;

        this.$areaCache = {};
    }

    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // Public
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    /**
     * Initial rendering of the springboard. (call in buildHTML)
     * Creates the internal springboard model
     */
    Springboard.prototype.build = function(serializedModel) {

        this.areas = serializedModel ? this._createModelFromImport(serializedModel) : this._createDefaultModel();

        // flag managable on springboard root.
        this.$springboard.toggleClass(classes.MANAGEABLE, this.options.isManageable);

        this._buildAreas();
    };

    /**
     * Initial rendering of the springboard. (call in buildHTML)
     * Creates the internal springboard model
     */
    Springboard.prototype.render = function() {

        this.$springboard.height(this.height);

        //TODO: don't hardcode the 10
        this.cellWidth = this.$springboard.width() / this.cols;
        this.cellHeight = this.height / this.rows;

        this._renderAreas();
    };

    /**
     * Adds resizable behaviour to each springboard area. (call in readyHTML)
     */
    Springboard.prototype.makeResizable = function() {

        this._forEachArea(function(area) {
            this._makeAreaResizable(area);
        });
    };

    /**
     * Gets the springboard as an html element
     */
    Springboard.prototype.getHtmlElement = function() {

        return this.$springboard[0];
    };

    /**
     * Gets the springboard as an html element
     */
    Springboard.prototype.getAreaHtmlElements = function() {

        var areaElements = [];
        this._forEachArea(function(area) {
            var $area = this._getArea$(area.id).children('.bp-area');
            areaElements.push($area[0]);
        });

        return areaElements;
    };

    /**
     * Binds a callback to the springboard invoked when an event is triggered
     */
    Springboard.prototype.listen = function() {

        this.observable.on.apply(this.observable, arguments);
    };

    /**
     * Triggers an event on the springboard object (use with listen)
     */
    Springboard.prototype.trigger = function() {

        this.observable.trigger.apply(this.observable, arguments);
    };

    /**
     * Set an area as being occupied by a child item
     */
    Springboard.prototype.markAreaOccupied = function(areaId) {

        var area = this._getArea(areaId);
        if(area) {
            area.occupied = true;
        }
        this._getArea$(areaId).addClass(classes.OCCUPIED);
    };

    /**
     * Set an area as being without a child item
     */
    Springboard.prototype.markAreaEmpty = function(areaId) {

        var area = this._getArea(areaId);
        area.occupied = false;
        this._getArea$(areaId).removeClass(classes.OCCUPIED);
    };

    /**
     * Determines if an area is occupied by a child item
     * @return {Boolean} true of the area is occupied
     */
    Springboard.prototype.isAreaOccupied = function(areaId) {

        return this._getArea(areaId).occupied;
    };

    /**
     * Exports the area model array as a json string
     * @deprecated prefer custom serialize method for smaller data size
     * @return {String} a json string of areas
     */
    Springboard.prototype.exportJSON = function() {

        return JSON.stringify(this.areas);
    };

    /**
     * Serialzies the springboard container in a custom format
     * x,y,w,h;x,y,w,h;x,y,w,h;x,y,w,h
     * @return {String} a json string of areas
     */
    Springboard.prototype.serialize = function() {

        var serializedAreas = [];
        this._forEachArea(function(area) {
            var serializedArea = [ area.x, area.y, area.width, area.height ].join(',');
            serializedAreas.push(serializedArea);
        });
        return serializedAreas.join(';');
    };

    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // Private
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    /**
     * Builds all areas of the springboard
     * @private
     */
    Springboard.prototype._buildAreas = function() {

        this._forEachArea(function(area) {
            this._buildArea(area);
        });
    };

    /**
     * Builds all areas of the springboard
     * @private
     */
    Springboard.prototype._renderAreas = function() {

        this._forEachArea(function(area) {
            this._renderArea(area);
        });
    };

    /**
     * Renders a single area of the springboard
     * @private
     */
    Springboard.prototype._buildArea = function(area) {

        var $html = $(templates.AREA);
        $html.prop('id', area.id);
        this.$springboard.append($html);
    };

    Springboard.prototype._renderArea = function(area) {

        var props = {
            top : this.cellHeight * area.y,
            left : this.cellWidth * area.x,
            width : this.cellWidth * area.width,
            height : this.cellHeight * area.height
        };

        var $area = this._getArea$(area.id);
        $area.prop('id', area.id);
        $area.css(props);

        $area.toggleClass(classes.SMALL_CELL, props.width <= SMALL_CELL_THRESHOLD);

        this.trigger(events.AREA_ADDED, [ area, $area ]);
    };

    /**
     * Utility function to loop through each area in the model like Array.prototype.forEach. Each callback invoked
     * in the context of this springboard
     * @private
     */
    Springboard.prototype._forEachArea = function(callback) {

        for ( var i = 0; i < this.areas.length; i++) {
            callback.call(this, this.areas[i], i);
        }
    };

    /**
     * Gets an area from the model by id
     * @private
     * @return {Object} null if the area doesn't exist
     */
    Springboard.prototype._getArea = function(areaId) {

        for ( var i = 0; i < this.areas.length; i++) {
            if(this.areas[i].id === areaId) {
                return this.areas[i];
            }
        }
        throw new Error('Area not found, id: ' + areaId);
    };

    /**
     * Creates a default model, a grid of areas
     * @private
     * @return {Array} return the model, an array of areas
     */
    Springboard.prototype._createDefaultModel = function() {

        var x, y, area, areas = [];
        for (y = 0; y < this.rows; y++) {
            for (x = 0; x < this.cols; x++) {
                area = new Area({
                    x : x,
                    y : y,
                    width : 1,
                    height : 1
                });
                areas.push(area);
            }
        }
        return areas;
    };

    /**
     * Creates a model from a (custom serializatiomn format) that was previously exported by the springboard
     * @private
     * @return {Array} return the model, an array of areas
     */
    Springboard.prototype._createModelFromImport = function(serializedModel) {

        var obj = serializedModel.split(';');
        var i, area, areas = [];
        for (i = 0; i < obj.length; i++) {
            var serializedArea = obj[i].split(',');
            area = new Area({
                x : parseInt(serializedArea[0], 10),
                y : parseInt(serializedArea[1], 10),
                width : parseInt(serializedArea[2], 10),
                height : parseInt(serializedArea[3], 10)
            });
            areas.push(area);
        }
        return areas;
    };

    /**
     * Creates a model using a json string, that was previously exported by the springboard
     * @deprecated Prefer createModelFromImport, using a mroe compact data format
     * @private
     * @return {Array} return the model, an array of areas
     */
    Springboard.prototype._createModelFromJSON = function(json) {

        var obj = JSON.parse(json);
        var i, area, areas = [];
        for (i = 0; i < obj.length; i++) {
            area = new Area({
                x : obj[i].x,
                y : obj[i].y,
                width : obj[i].width,
                height : obj[i].height,
                id : obj[i].id
            });
            areas.push(area);
        }
        return areas;
    };

    /**
     * Remove an area from the model and dom
     * @private
     */
    Springboard.prototype._removeArea = function(area) {

        // remove from model
        var indexToRemove = -1;
        this._forEachArea(function(otherArea, index) {
            if (area.equals(otherArea)) {
                indexToRemove = index;
            }
        });
        if (indexToRemove > -1) {
            this.areas.splice(indexToRemove, 1);
        }

        this._getArea$(area.id).remove();
        delete this.$areaCache[area.id];

        this.trigger('area-removed', area);
    };

    /**
     * Makes an area resizable
     * Includes logic to determine how far an area can be resized. When an a resize operation stops, methods
     * to fix area collisions and gaps are called.
     * @private
     */
    Springboard.prototype._makeAreaResizable = function(area) {

        var self = this;

        /**
         * Used by the resizable to calculate how far a side can be dragged
         */
        function calcResizeMaxDimension (a, dir) {

            var i, b, maxDim = 0, overlap = false;

            //springboard bounds
            if(dir === 'e') {
                maxDim = self.cols - a.x;
            } else if(dir === 'w'){
                maxDim = a.x  + area.width;
            } else if(dir === 'n') {
                maxDim = a.y  + area.height;
            } else if(dir === 's'){
                maxDim = self.rows - a.y;
            }

            //look for occupied areas on both axis
            for (i = 0; i < self.areas.length; i++) {
                b = self.areas[i];

                if(dir === 'e' || dir === 'w') {
                    overlap = !b.equals(a) && !(a.y >= b.y + b.height || a.y + a.height <= b.y);
                } else if(dir === 'n' || dir === 's') {
                    overlap = !b.equals(a) && !(a.x + a.width <= b.x || a.x >= b.x + b.width);
                }

                if(overlap && b.occupied) {
                    if(b.x > a.x && dir === 'e') {
                        maxDim = Math.min(b.x - a.x, maxDim);
                    } else if(b.x < a.x && dir === 'w'){
                        maxDim = Math.min((a.x + a.width) - (b.x + b.width) , maxDim);
                    } else if(b.y < a.y && dir === 'n') {
                        maxDim = Math.min((a.y + a.height) - (b.y + b.height) , maxDim);
                    } else if(b.y > a.y && dir === 's'){
                        maxDim = Math.min(b.y - a.y, maxDim);
                    }
                }
            }

            return maxDim;
        }

        //jquery ui resizable
        var $area = this._getArea$(area.id);
        $area.resizable({
            grid : [ this.cellWidth, this.cellHeight ],
            handles : 'n,s,e,w',
            minWidth : this.cellWidth,
            minHeight : this.cellHeight,
            start : function(e, ui) {

                var axis = $(this).data('resizable').axis;

                var maxDim = calcResizeMaxDimension(area, axis);
                var resizeOption = {};
                if(axis === 'e' || axis === 'w') {
                    resizeOption.maxWidth = maxDim * self.cellWidth;
                } else if(axis === 'n' || axis === 's') {
                    resizeOption.maxHeight = maxDim * self.cellHeight;
                }
                $(this).resizable(resizeOption);
            },
            stop : function(e, ui) {

                var oldWidth = area.width;
                var oldHeight = area.height;

                //these are the dimensions as number of cells
                area.width = Math.round(ui.element.width() / self.cellWidth);
                area.height = Math.round(ui.element.height() / self.cellHeight);

                //these are the dimensions as pixels
                area.actualWidth = area.width * self.cellWidth;
                area.actualHeight = area.height * self.cellHeight;

                //the x and y corodinates of the cell relative to the grid
                area.x = Math.round(ui.position.left / self.cellWidth);
                area.y = Math.round(ui.position.top / self.cellHeight);

                //only fix collisions if the the cell has grown
                if (oldWidth < area.width || oldHeight < area.height) {
                    self._fixCollisions(area);
                }

                //always fix gaps for good measure
                self._fixGaps();
                self.trigger(events.AREA_CHANGED, [area, $area]);

                $area.toggleClass(classes.SMALL_CELL, area.actualWidth <= SMALL_CELL_THRESHOLD);
            }
        });
    };

    /**
     * Loops through a grid. For each cell in the springboard grid loop through all the areas to determine which
     * cells are not filled. Then create areas for each empty cell and then merge adjacent areas
     * @private
     */
    Springboard.prototype._fixGaps = function() {

        // loop through each coordinate in the grid
        // loop through each area.
        // if that grid unit is is not covered add it to the cellsToFill array
        var i, x, y, a, occupied = false, cellsToFill = [];
        for (y = 0; y < this.rows; y++) {
            for (x = 0; x < this.cols; x++) {
                for (i = 0; i < this.areas.length; i++) {
                    a = this.areas[i];
                    if ((a.x <= x && a.x + a.width >= x + 1) && (a.y <= y && a.y + a.height >= y + 1)) {
                        occupied = true;
                    }
                }
                if (!occupied) {
                    cellsToFill.push({
                        x : x,
                        y : y,
                        width : 1,
                        height : 1
                    });
                }
                occupied = false;
            }
        }

        // merge cells to fill function
        function mergeCells (cellsToMerge, axis) {
            var mergedCells = [];
            if (cellsToMerge.length > 0) {
                mergedCells.push(cellsToMerge[0]);
                var curr, prev;
                for (i = 1; i < cellsToMerge.length; i++) {
                    curr = cellsToMerge[i];
                    prev = mergedCells[mergedCells.length - 1];

                    if (axis === 'h' && curr.x === prev.x + prev.width && curr.y === prev.y && curr.height === prev.height) {
                        prev.width = prev.width + curr.width;
                    } else if (axis === 'v' && curr.y === prev.y + prev.height && curr.x === prev.x && curr.width === prev.width) {
                        prev.height = prev.height + curr.height;
                    } else {
                        mergedCells.push(curr);
                    }
                }
            }
            return mergedCells;
        }

        var mergedCells = mergeCells(cellsToFill, 'h');
        mergedCells = mergeCells(mergedCells, 'v');

        //create an new area object for the merged celss
        var newAreas = [];
        for (i = 0; i < mergedCells.length; i++) {
            var area = new Area({
                x : mergedCells[i].x,
                y : mergedCells[i].y,
                width : mergedCells[i].width,
                height : mergedCells[i].height
            });
            newAreas.push(area);
        }
        //merge with main areas array and order
        this.areas = this.areas.concat(newAreas);

        //render the new areas
        for (i = 0; i < newAreas.length; i++) {
            this._buildArea(newAreas[i]);
            this._renderArea(newAreas[i]);
            this._makeAreaResizable(newAreas[i]);
        }
    };

    /**
     * Remove areas which overlap with the given area
     * @param {Object} a    Look for collisions with this area
     * @private
     */
    Springboard.prototype._fixCollisions = function(a) {

        var areasToRemove = [];
        this._forEachArea(function(b) {

            var overlap =
                !b.equals(a) && !(a.x + a.width <= b.x || a.y + a.height <= b.y || a.x >= b.x + b.width || a.y >= b.y + b.height);

            if (overlap) {
                areasToRemove.push(b);
            }
        });

        for (var i = areasToRemove.length -1; i >= 0 ; i--) {
            this._removeArea(areasToRemove[i]);
        }
    };

    /**
     * Method to ensure the model is synced with the view
     */
    Springboard.prototype.syncModel = function() {

        this._forEachArea(function(area) {
            var $area = this._getArea$(area.id);
            var viewOccupied = !$area.children('.bp-area').is(':empty');
            if(!area.occupied && viewOccupied) {
                //if the area model is incorrectly marked as empty
                this.markAreaOccupied(area.id);
            } else if (area.occupied && !viewOccupied) {
                //if the area model is incorrectly marked as occupied
                this.markAreaEmpty(area.id);
            }
        });
    };

    /**
     * Simple cache method to get and store jQuery area nodes.
     */
    Springboard.prototype._getArea$ = function(areaId) {

        if(areaId in this.$areaCache) {
            return this.$areaCache[areaId];
        } else {
            var $area = $('#' + areaId, this.$springboard);
            if($area.length === 0) {
                return null;
            } else {
                this.$areaCache[areaId] = $area;
                return $area;
            }
        }
    };

    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // Area object
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    /**
     * Simple bean to hold area info
     * @constructor
     * @param {Object} attrs initial attributes which override default settings
     */
    function Area (attrs) {

        this.x = attrs.x || 0;
        this.y = attrs.y || 0;
        this.width = attrs.width || 1;
        this.height = attrs.height || 1;
        this.id = attrs.id || (Math.random() + '').split('.')[1];
        this.occupied = attrs.occupied || false;
        this.locked = attrs.locked || false;
    }

    /**
     * Determine if two areas are equal (by id)
     * @return  {boolean}
     */
    Area.prototype.equals = function(anotherArea) {

        return this.id === anotherArea.id;
    };

    //expose
    window.launchpad = window.launchpad || {};
    window.launchpad.Springboard = Springboard;

}(jQuery, window));
