/**
 * Implements select functionality for single and multiple items. 
 */
define(function(require, exports, module) {
    var ko = require("knockout");

    /**
     * Implements select functionality for single and multiple items. 
     */
    var SelectionManager = module.exports.SelectionManager = function() {
        this._selectedItems = [];
    };

    /**
     * Implements select, cut, copy, paste functionality. Supports selections
     * consisting of multiple items.
     */
    SelectionManager.prototype = function() {

        /**
         * Sets the given item as the single selected item
         * @param {Object} item
         */
        var select = function(item) {
            clearSelection.call(this);
            this._selectedItems.push(item);
        };

        /**
         * Toggles the selection status of the given item
         * @param {Object} item
         */
        var toggleSelect = function(item) {
            if (isSelected.call(this, item)) {
                var index = this._selectedItems.indexOf(item);
                this._selectedItems.splice(index, 1);
            }
            else {
                this._selectedItems.push(item);
            }
        };

        /**
         * Sets the given items as the collection of selected items
         * @param {[Object]} items
         */
        var selectAll = function(items) {
            clearSelection.call(this);
            for (var i = 0; i < items.length; i++) {
                var item = items[i];
                toggleSelect.call(this, item);
            }
        };

        /**
         * Selects a range of items starting with @itemStart and ending 
         * with @itemEnd. De function @fnGetItemsInRange calculates the 
         * set of items that fall in the range.
         * @param {Object} itemStart
         * @param {Object} itemEnd
         * @param {Function: (Object, Object) -> [Object]} fnGetItemsInRange
         */
        var selectRange = function(itemStart, itemEnd, fnGetItemsInRange) {
            var itemsInRange = fnGetItemsInRange(itemStart, itemEnd);
            selectAll.call(this, itemsInRange);
        };

        /**
         * Sets the given items as the collection of selected items
         * @param {[Object]} items
         */
        var setFocus = function(items) {
            selectAll.call(this, items);
        };

        /**
         * Clears the collection of selected items
         */
        var clearSelection = function() {
            this._selectedItems = [];
        };

        /**
         * Returns the collection of selected items
         * @return {[Object]}
         */
        var getSelectedItems = function() {
            return this._selectedItems;
        };

        /**
         * Says wether the given item is selected
         * @param {Object} item
         * @return {boolean}
         */
        var isSelected = function(item) {
            return this._selectedItems.indexOf(item) >= 0;
        };

        /**
         * Deselects all selected items.
         */
        var reset = function() {
            this._selectedItems = [];
        };


        return {
            //modifies the collection of selected items
            select: select,
            toggleSelect: toggleSelect,
            selectAll: selectAll,
            selectRange : selectRange,
            clearSelection: clearSelection,
            reset: reset,
            setFocus: setFocus,

            //accesses the collection of selected items
            getSelectedItems: getSelectedItems,
            isSelected: isSelected,
        };
    }();
});