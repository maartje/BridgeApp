/**
 * Represents a node in a tree structure
 */
define(function(require, exports, module) {
    var ko = require("knockout");

    var getRange = module.exports.getRange = function(startNode, endNode) {
    	//TODO
    };

    var TreeNode = module.exports.TreeNode = function() {
    };

    TreeNode.prototype = function() {

        return {
        	//modify structure
        	createChild : createChild,
        	createChildren : createChildren,
        	createSibling : createSibling,
        	addChild : addChild, 
        	addChildren : addChildren, 
        	addSibling : addSibling, 
        	
        	//clipboard functionality
        	remove : remove,
        	copyTo : copyTo,
        	moveTo : moveTo,
        	
        	//access structure
        	getChildren : getChildren,
        	getParent : getParent,
            getRoot : getRoot,
            isRoot : isRoot,
        	getDescendants : getDescendants,
        	getAncestors : getAncestors,
        };
    }();
});

