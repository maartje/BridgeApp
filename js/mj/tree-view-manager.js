/**
 * Manages open and close state for nodes in a tree view
 */
define(function(require, exports, module) {
    var ko = require("knockout");

    var TreeViewManager = module.exports.TreeViewManager = function() {
    	this.openNodes = [];
    };

    TreeViewManager.prototype = function() {

    	/**
    	 * Opens a closed item, closes an open node. @fnGetChildren 
    	 * ensures that descendant nodes are
    	 * opened, respectively closed, together with the parent node.
    	 * @node {Object} 
    	 * @fnGetChildren {Function(Object) -> [Object]} (optional)
    	 */
    	var toggleOpenClose = function(node, fnGetChildren) {
    		if (isOpen.call(this, node)){
    			close.call(this, node, fnGetChildren);
    		}
    		else {
    			open.call(this, node, fnGetChildren);
    		}
        };

    	/**
    	 * Ensures that the given node is open. @fnGetChildren 
    	 * ensures that all its descendant nodes are also opened.
    	 * @node {Object} 
    	 * @fnGetChildren {Function(Object) -> [Object]} (optional)
    	 */
        var open = function(node, fnGetChildren){
    		if (!isOpen.call(this, node)){
    			this.openNodes.push(node);
    		}
        	if (fnGetChildren && fnGetChildren(node)){
        		var children = fnGetChildren(node);
        		for ( var i = 0; i < children.length; i++) {
					open.call(this, children[i], fnGetChildren);
				}
        	}
        };

    	/**
    	 * Ensures that the given node is closed. @fnGetChildren 
    	 * ensures that all its descendant nodes are also closed.
    	 * @node {Object} 
    	 * @fnGetChildren {Function(Object) -> [Object]} (optional)
    	 */
        var close = function(node, fnGetChildren){
    		if (isOpen.call(this, node)){
    			var index = this.openNodes.indexOf(node);
    			this.openNodes.splice(index, 1);
    		}
        	if (fnGetChildren && fnGetChildren(node)){
        		var children = fnGetChildren(node);
        		for ( var i = 0; i < children.length; i++) {
					close.call(this, children[i], fnGetChildren);
				}
        	}
        };

    	/**
    	 * Ensures that the given node is closed. @fnGetChildren 
    	 * ensures that all its descendant nodes are also closed.
    	 * @node {Object} 
    	 */
    	var isOpen = function(node) {
    		return this.openNodes.indexOf(node) >= 0;
        };

        return {
        	// open and close functionality
        	toggleOpenClose : toggleOpenClose,
        	open : open,
        	close : close,

        	//query open/close state
        	isOpen : isOpen,
        };
    }();
});

