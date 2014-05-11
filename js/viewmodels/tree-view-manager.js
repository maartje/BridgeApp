/**
 * Manages the open/close state of nodes in a tree view.
 */
define(function(require, exports, module) {

    /**
     * Manages the open/close state of nodes in a tree view.
     * @param {ViewStateProperty} opened
     */
    var TreeViewManager = module.exports.TreeViewManager = function(openNodeState) {
        var openState = openNodeState;

        /**
         * Ensures that the given item is open
         * @param {Object} item
         */
        function open(item) {
            openState.applyTo(item);
        }

        /**
         * Ensures that the given item is closed
         * @param {Object} item
         */
        function close(item) {
            openState.unapplyTo(item);
        }

        /**
         * Ensures that the given items are open
         * @param {[Object]} items
         */
        function openAll(items) {
            openState.applyToAll(items);
        }

        /**
         * Ensures that the given items are closed
         * @param {[Object]} items
         */
        function closeAll(items) {
            openState.unapplyToAll(items);
        }

        /**
         * Toggles the open/close state of the given item
         * @param {Object} item
         */
        function toggleOpenClose(item) {
            openState.toggle(item);
        }

        /**
         * Sets the given items as the collection of open items
         * @param {[Object]} items
         */
        function setOpenItems(items) {
            openState.setItems(items);
        }

        /**
         * Clears the collection of open items
         */
        function clear() {
            openState.clear();
        }

        /**
         * Says wether the given item is open
         * @param {Object} item
         * @return {boolean}
         */
        function isOpen(item) {
            return openState.isApplied(item);
        }

        /**
         * Returns the collection of open items
         * @return {[Object]}
         */
        function getOpenItems() {
            return openState.getItems();
        }

        return {
            //modifies the collection of open items
            open : open,
            openAll : openAll,
            close : close,
            closeAll : closeAll,
            toggleOpenClose : toggleOpenClose,
            clear : clear,
            setOpenItems : setOpenItems,

            //accesses the collection of open items
            isOpen : isOpen,
            getOpenItems : getOpenItems,
        };
    };
});