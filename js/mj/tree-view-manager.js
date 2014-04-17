/**
 * Extends the functionality of a @ClipboardManager to 
 * manage open and close state for nodes in a tree view.
 * Also manages the top node of the tree view.
 * Remark: works on items that implement the 
 * functions @getChildren(), @getParent(), and @getRoot();
 */
define(function(require, exports, module) {
    var ko = require("knockout");
    var mixinModule = require("util/mixin");


    /**
     * Extends the functionality of a @ClipboardManager to 
     * manage open and close state for nodes in a tree view.
     * Also manages the top node of the tree view.
     * @param {ClipBoardManager} clipboardManager
     * @param {TreeNode} root 
     */
    var TreeViewManager = module.exports.TreeViewManager = function(clipboardManager, root) {
        this._clipboardManager = clipboardManager;
        mixinModule.MIXIN(clipboardManager, this);
        this._root = root;
        this._openNodes = this._root? [this._root] : [];
    };

    TreeViewManager.prototype = function() {
        
        /**
         * Sets the given node as the top node of the tree view,
         * Ensures that all nodes are closed, except the new root node,
         * Deselects all selected nodes
         * @param {TreeNode} node
         */
        var setRoot = function(node) {
            if (this._root === node) {
                return;
            }
			this._root = node;
			this._clipboardManager.clearSelection();
			//TODO: this._openNodes = ...;
		};

        /**
         * Returns the top node of the tree view
         * @return {TreeNode} node
         */
		var getRoot = function() {
			return this._root;
		};


        /**
         * Opens a closed node, or closes an open node.
         * When a node is closed, all its descendant nodes are also closed.
         * @param {TreeNode} node
         */
        var toggleOpenClose = function(node) {
            if (isOpen.call(this, node)) {
                close.call(this, node, true);
            }
            else {
                open.call(this, node, false);
            }
        };

        /**
         * Opens the given node, @includeDescendantNodes 
         * specifies whether descendant nodes are also opened.
         * @param {TreeNode} node 
         * @param {boolean} includeDescendantNodes 
         */
        var open = function(node, includeDescendantNodes) {
            if (!isOpen.call(this, node)) {
                this._openNodes.push(node);
            }
            if (includeDescendantNodes) {
                var children = node.getChildren();
                for (var i = 0; i < children.length; i++) {
                    open.call(this, children[i], true);
                }
            }
        };

        /**
         * Closes the given node, @includeDescendantNodes 
         * specifies whether descendant nodes are also closed.
         * @param {TreeNode} node
         * @param {boolean} includeDescendantNodes 
         */
        var close = function(node, includeDescendantNodes) {
            if (isOpen.call(this, node)) {
                var index = this._openNodes.indexOf(node);
                this._openNodes.splice(index, 1);
            }
            if (includeDescendantNodes) {
                var children = node.getChildren();
                for (var i = 0; i < children.length; i++) {
                    close.call(this, children[i], true);
                }
            }
        };

        /**
         * Ensures that all selected nodes are open, @includeDescendantNodes 
         * specifies whether their descendant nodes are also opened.
         * @param {boolean} includeDescendantNodes 
         */
        var openSelected = function(includeDescendantNodes) {
            var selectedItems = this.getSelectedItems();
            for (var i = 0; i < selectedItems.length; i++) {
                open.call(this, selectedItems[i], includeDescendantNodes);
            }
        };


        /**
         * Ensures that all selected nodes are closed, @includeDescendantNodes 
         * specifies whether their descendant nodes are also closed.
         * @param {boolean} includeDescendantNodes  
         */
        var closeSelected = function(includeDescendantNodes) {
            if (typeof(includeDescendantNodes) === "undefined"){
                includeDescendantNodes = true;
            }
            var selectedItems = this.getSelectedItems();
            for (var i = 0; i < selectedItems.length; i++) {
                close.call(this, selectedItems[i], includeDescendantNodes);
            }
        };

        /**
         * Returns true iff the given node is open
         * @param node {TreeNode} 
         */
        var isOpen = function(node) {
            return this._openNodes.indexOf(node) >= 0;
        };

        /**
         * Sets the data tree root as the root of the view,
         * closes all open nodes,
         * unclips all nodes stored on the clipboard,
         * deselects all selected nodes.
         */
        var reset = function() {
            this._root = this._root.getRoot();
			this._openNodes = [this._root];
            this._clipboardManager.reset();
        };

        /**
         * Ensures that the given node and all its ancestors
         * are open.
         * @param {[TreeNode]} nodes
         */ 
        var openAncestorChain = function(node){
            if (node && node !== getRoot.call(this)){
                open.call(this, node, false);
                openAncestorChain.call(this, node.getParent());
            }
        }
        
        /**
         * Sets the given items as the collection of selected items
         * @param {[TreeNode]} nodes 
         */
        var setFocus = function(nodes) { 
            var commonAncestor = this._root.getRoot(); //TODO: find lowest common ancestor
            setRoot.call(this, commonAncestor);
            for (var i = 0; i < nodes.length; i++) {
                openAncestorChain.call(this, nodes[i].getParent());
            }
            this._clipboardManager.setFocus(nodes);
        };

        return {
            // open and close functionality
            toggleOpenClose: toggleOpenClose,
            openSelected: openSelected,  
            closeSelected: closeSelected,
            isOpen: isOpen,

            // rootNode
            setRoot: setRoot,
            getRoot: getRoot,

            //mixed        
            setFocus: setFocus,
            reset: reset,
        };
    }();
});
