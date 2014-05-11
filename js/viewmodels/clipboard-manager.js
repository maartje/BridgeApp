/**
 * Implements the functionality to store items on a clipboard.
 * Multiple items may be clipped at once.
 */
define(function(require, exports, module) {

    /**
     * Implements the functionality to store items on a clipboard.
     * Multiple items may be clipped at once.
     * @param {ViewStateProperty} clippedViewState
     */
    var ClipboardManager = module.exports.ClipboardManager = function(clippedViewState) {
        var clippedState = clippedViewState;
        var isCutAction = false;


        /**
         * Fills the clipboard with a collection of items,
         * to be copied by a subsequent paste action.
         * @param {[Object]} items 
         */
        function copyAll(items) {
            clipAll(items);
            isCutAction = false;
        }

        /**
         * Fills the clipboard with a collection of items,
         * to be moved by a subsequent paste action
         * @param {[Object]} items 
         */
        function cutAll(items) {
            clipAll(items);
            isCutAction = true;
        }

        /**
         * Fills the clipboard with the selected items.
         * @param {[Object]} items 
         * @private
         */
        function clipAll(items) {
            clippedState.setItems(items);
        }

        /**
         * Says whether the given item is copied,
         * i.e. clipped via a copy action.
         * @param {Object} item
         * @return {boolean}
         */
        function isCopied(item) {
            return !isCutAction && isClipped(item);
        }

        /**
         * Says whether the given item is cut,
         * i.e. clipped via a cut actionS
         * @param {Object} item
         * @return {boolean}
         */
        function isCut(item) {
            return isCutAction && isClipped(item);
        }

        /**
         * Says whether the given item is clipped
         * @param {Object} item
         * @return {boolean}
         */
        function isClipped(item) {
            return clippedState.isApplied(item);
        }

        /**
         * Returns the collection of clipped items
         * @return {[Object]}item
         */
        function getClippedItems() {
            return clippedState.getItems();
        }

        /**
         * Returns the collection of cut items, i.e. returns the 
         * clipped items when they were obtained via a copy action,
         * or an empty list otherwise.
         * @return {[Object]}item
         */
        function getCopiedItems() {
            return !isCutAction? clippedState.getItems() : [];
        }

        /**
         * Returns the collection of cut items, i.e. returns the 
         * clipped items when they were obtained via a cut action
         * or an empty list otherwise.
         * @return {[Object]}item
         */
        function getCutItems() {
            return isCutAction? clippedState.getItems() : [];
        }

        /**
         * Unclips all clipped items.
         */
        function clear() {
            isCutAction = false;
            clippedState.clear();
        }

        return {
            //modifies the state of the clipboard manager
            cutAll: cutAll, 
            copyAll: copyAll, 
            clear: clear,

            //accesses the state of the clipboard manager
            isCopied: isCopied,
            isCut: isCut,
            isClipped: isClipped,
            getClippedItems: getClippedItems,
            getCutItems: getCutItems,
            getCopiedItems: getCopiedItems,
        };
    };
});