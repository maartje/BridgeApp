/**
 * Extends the functionality of a @SelectionManager with
 * functionality to store items on a clipboard.
 * Multiple items may be clipped at once.
 */
define(function(require, exports, module) {
    var ko = require("knockout");
    var mixinModule = require("util/mixin");

    /**
     * Extends the functionality of a @SelectionManager with
     * functionality to store items on a clipboard.
     * Multiple items may be clipped at once.
     */
    var ClipboardManager = module.exports.ClipboardManager = function(selectionManager) {
        this._clippedItems = [];
        this._isCutAction = false;
        this._selectionManager = selectionManager;
        mixinModule.MIXIN(selectionManager, this);
    };

    /**
     * Implements select, cut, copy, paste functionality. 
     * Supports selections consisting of multiple items.
     */
    ClipboardManager.prototype = function() {

        /**
         * Fills the clipboard with the collection of selected items, a subsequent
         * paste action will move the items to a new position
         */
        var cut = function() {
            _clip.call(this);
            this._isCutAction = true;
        };

        /**
         * Fills the clipboard with the collection of selected items, a subsequent
         * paste action will copy the items to a new position
         */
        var copy = function() {
            _clip.call(this);
            this._isCutAction = false;
        };

        /**
         * Fills the clipboard with the selected items.
         * @private
         */
        var _clip = function() {
            this._clippedItems = [];
            for (var i = 0; i < this.getSelectedItems().length; i++) {
                var selectedItem = this.getSelectedItems()[i];
                this._clippedItems.push(selectedItem);
            }
        }

        /**
         * Says whether the given item is cut
         * @param {Object} item
         * @return {boolean}
         */
        var isCut = function(item) {
            return this._isCutAction && this._clippedItems.indexOf(item) >= 0;
        };

        /**
         * Returns the collection of clipped items
         * @return {[Object]}item
         */
        var getClippedItems = function() {
            return this._clippedItems;
        };

        /**
         * Says whether the clipped items where obtained
         * via a cut action.
         * @return {boolean}
         */
        var isCutAction = function() {
            return this._isCutAction;
        };

        /**
         * Deselects all selected items, and
         * unclips all clipped items.
         */
        var reset = function() {
            this._isCutAction = false;
            this._clippedItems = [];
            this._selectionManager.reset();
        };

        return {
            //modifies the state of the clipboard manager
            cut: cut, 
            copy: copy, 
            reset: reset,

            //accesses the state of the clipboard manager
            isCut: isCut,
            isCutAction: isCutAction,
            getClippedItems: getClippedItems,
        };

    }();
});