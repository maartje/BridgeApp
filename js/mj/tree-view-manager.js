/**
 * Manages the open/close state of tree nodes.
 */
define(function(require, exports, module) {
    var ko = require("knockout");

    var TreeViewManager = module.exports.TreeViewManager = function() {
        this._openNodes = [];
    };

    TreeViewManager.prototype = function() {

        /**
         * Opens a closed node, or closes an open node.
         * @param node {Object} 
         */
        var toggleOpenClose = function(node) {
            if (isOpen.call(this, node)) {
                close.call(this, node);
            }
            else {
                open.call(this, node);
            }
        };

        /**
         * Ensures that the given node is open 
         * @param node {Object} 
         */
        var open = function(node) {
            if (!isOpen.call(this, node)) {
                this._openNodes.push(node);
            }
        };

        /**
         * Ensures that all nodes in the given collection are open 
         * @param nodes {[Object]} 
         */
        var openAll = function(nodes) {
            for (var i = 0; i < nodes.length; i++) {
                open.call(this, nodes[i]);
            }
        };

        /**
         * Ensures that the given node is closed 
         * @param node {Object} 
         */
        var close = function(node) {
            if (isOpen.call(this, node)) {
                var index = this._openNodes.indexOf(node);
                this._openNodes.splice(index, 1);
            }
        };

        /**
         * Ensures that all nodes in the given collection are closed
         * @param nodes {[Object]} 
         */
        var closeAll = function(nodes) {
            for (var i = 0; i < nodes.length; i++) {
                close.call(this, nodes[i]);
            }
        };

        /**
         * Returns true iff the given node is open
         * @param node {Object} 
         */
        var isOpen = function(node) {
            return this._openNodes.indexOf(node) >= 0;
        };

        return {
            // open and close functionality
            toggleOpenClose: toggleOpenClose,
            open: open,
            openAll : openAll,
            close: close,
            closeAll : closeAll,
            isOpen: isOpen,
        };
    }();
});
