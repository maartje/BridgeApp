/**
 * Implements select functionality for single and multiple items. 
 */
define(function(require, exports, module) {

    /**
     * Manages the selection state of items in a view.
     * @param {ViewStateProperty} selectionViewState
     */
    var SelectionManager = module.exports.SelectionManager = function(selectionViewState) {
        var selectionState = selectionViewState;

        /**
         * Ensures that the given item is selected
         * @param {Object} item
         */
        function select(item) {
            selectionState.applyTo(item);
        }

        /**
         * Ensures that the given item is deselected
         * @param {Object} item
         */
        function deselect(item) {
            selectionState.unapplyTo(item);
        }

        /**
         * Toggles the selection state of the given item
         * @param {Object} item
         */
        function toggleSelect(item) {
            selectionState.toggle(item);
        }

        /**
         * Sets the given item as the single selected item
         * @param {Object} item
         */
        function singleSelect(item) {
            selectionState.setItems([item]);
        }

        /**
         * Sets the given items as the collection of multiple selected items
         * @param {[Object]} items
         */
        function setSelectedItems(items) {
            selectionState.setItems(items);
        }

        /**
         * Selects a range of items starting with @itemStart and ending 
         * with @itemEnd. De function @fnGetItemsInRange calculates the 
         * set of items that fall in the range.
         * @param {Object} itemStart
         * @param {Object} itemEnd
         * @param {Function: (Object, Object) -> [Object]} fnGetItemsInRange
         */
        function selectRange(itemStart, itemEnd, fnGetItemsInRange) {
            var itemsInRange = fnGetItemsInRange(itemStart, itemEnd);
            selectionState.setItems(itemsInRange);
        }

        /**
         * Clears the collection of selected items
         */
        function clear() {
            selectionState.clear();
        }

        /**
         * Says wether the given item is selected
         * @param {Object} item
         * @return {boolean}
         */
        function isSelected(item) {
            return selectionState.isApplied(item);
        }

        /**
         * Returns the collection of selected items
         * @return {[Object]}
         */
        function getSelectedItems() {
            return selectionState.getItems();
        }

        return {
            //modifies the collection of selected items
            singleSelect : singleSelect,
            select : select,
            deselect : deselect,
            toggleSelect : toggleSelect,
            selectRange : selectRange,
            setSelectedItems : setSelectedItems,
            clear : clear,

            //accesses the collection of selected items
            isSelected : isSelected,
            getSelectedItems : getSelectedItems,
        };
    };
});