/**
 * Implements functionality to manage a viewstate property. 
 * (internally used by viewstate managers) 
 */
define(function(require, exports, module) {

    /**
     * Stores the state of a viewstate property 
     */
    var ViewStateProperty = module.exports.ViewStateProperty = function() {
        var items = [];
        
        /**
         * Applies the viewstate property to the given item
         * @param {Object} item
         **/
        function applyTo(item) {
            if (!isApplied(item)) {
                items.push(item);
            }
        }

        /**
         * Unapplies the viewstate property to the given item
         * @param {Object} item
         **/
        function unapplyTo(item) {
            if (isApplied(item)) {
                var index = items.indexOf(item);
                items.splice(index, 1);
            }
        }

        /**
         * Applies the viewstate property to all given items
         * @param {[Object]} items
         **/
        function applyToAll(items) {
            for (var i = 0; i < items.length; i++) {
                var item = items[i];
                applyTo(item);
            }
        }

        /**
         * Unapplies the viewstate property to all given items
         * @param {[Object]} items
         **/
        function unapplyToAll(items) {
            for (var i = 0; i < items.length; i++) {
                var item = items[i];
                unapplyTo(item);
            }
        }

        /**
         * Toggles the viewstate property for the given item
         * @param {Object} item
         **/
        function toggle(item) {
            if (isApplied(item)) {
                unapplyTo(item);
            }
            else {
                applyTo(item);
            }
        }

        /**
         * Says whether the viewstate property applies to the given item
         * @param {Object} item
         **/
        function isApplied(item) {
            return items.indexOf(item) >= 0;
        }

        /**
         * Returns the collection of items for which the given viewstate property applies
         * @return {[Object]} item
         **/
        function getItems() {
            return items;
        }

        /**
         * Sets the collection of items with the given viewstate property
         * @param {[Object]} item
         **/
        function setItems(lstItems) {
            items = lstItems;
        }

        /**
         * Clears the collection of items with the given viewstate property
         **/
        function clear() {
            items = [];
        }

        return {
            //modifies the viewstate
            applyTo : applyTo,
            unapplyTo : unapplyTo,
            applyToAll : applyToAll,
            unapplyToAll : unapplyToAll,
            toggle : toggle,
            setItems : setItems,
            clear : clear,
            
            //accesses the viewstate
            getItems : getItems,
            isApplied : isApplied,
        };
    };
});