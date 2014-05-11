/**
 * Represents a node in a tree structure 
 */
define(function(require, exports, module) {

    /**
     * Constructor function for tree structures.
     * The tree structure is reconstructed from JSON data.
     * @example data {id : 1, content : "hello", children : [{id:1, children : []}]}
     * @param {JSON} data
     */
    var TreeNode = module.exports.TreeNode = function(data) {
        this._id = data.id;
        this._content = data.content;
        this._parent = data.parent || null;
        this._children = []; //TODO: treenode collection???
        createChildren.call(this, data.children || []);

        function createChildren (dataChildren) {
            for (var i = 0; i < dataChildren.length; i++) {
                createChild.call(this, dataChildren[i]);
            }
        };

        function createChild (dataChild) {
            var child = new TreeNode(dataChild);
            child._parent = this;
            child.attach();
        };

    };

    TreeNode.prototype = function() {

        var getId = function() {
            return this._id;
        };

        var getContent = function() {
            return this._content;
        };

        var getChildren = function() {
            return this._children;
        };

        var getParent = function() {
            return this._parent;
        };
        
        
        //TODO: treenode collection???
        var collectSubterms = function() {
            var result = [this];
            var children = getChildren.call(this);
            for (var i = 0; i < children.length; i++) {
                var subResult = collectSubterms.call(children[i]);
                result = result.concat(subResult);
            }
            return result;
        };

        var getRoot = function() {
            if (!getParent.call(this)) {
                return this;
            }
            var parent = getParent.call(this);
            return getRoot.call(parent);
        };
        
        var getNextSibling = function(){
            if (isRoot.call(this)){
                return null;
            }
            var indexNextSibling = getChildIndex.call(this) + 1;
            var parent = getParent.call(this);
            return getChildAt.call(parent, indexNextSibling);
        };

        var getPreviousSibling = function(){
            if (isRoot.call(this)){
                return null;
            }
            var indexPreviousSibling = getChildIndex.call(this) - 1;
            var parent = getParent.call(this);
            return getChildAt.call(parent, indexPreviousSibling);
        };

        /**
         * @private
         **/
        var getChildAt = function(index) {
            var children = getChildren.call(this);
            if (index < 0 || children.length - 1 < index){
                return null;
            }
            return children[index];
        };

        /**
         * @private
         **/
        var getChildIndex = function() {
            if (isRoot.call(this)){
                return 0;
            }
            var parent = getParent.call(this);
            var children = getChildren.call(parent);
            return children.indexOf(this);
        };
        
        var isRoot = function(){
            return getRoot.call(this) === this;
        }

        //current node or strict subterm        
        var isSubtermOf = function(node){
            if (this === node) {
                return true;
            }
            if (!this._parent) {
                return false;
            }
            return isSubtermOf.call(this._parent, node);
        };

        var length = function() {
            if (isRoot.call(this)) {
                return 0;
            }
            return 1 + length.call(getParent.call(this));
        };

        var detach = function() {
            if (isRoot.call(this)) {
                throw "The root node can not be deleted"
            }
            else {
                var index = getChildIndex.call(this);
                var siblings = getChildren.call(getParent.call(this));
                siblings.splice(index, 1);
            }
            return this;
        };

        //overwrite to take order into account
        var attach = function() {
            if (isRoot.call(this)) {
                throw "The root node can not be inserted"
            }
            var siblings = this.getParent().getChildren();
            if (siblings.indexOf(this) < 0) {
                siblings.push(this);
            }
            return this;
        };

        return {
            getId : getId,
            getContent : getContent,
            collectSubterms : collectSubterms,
            getChildren : getChildren,
            getParent : getParent,
            getRoot : getRoot,
            getNextSibling : getNextSibling,
            getPreviousSibling : getPreviousSibling,
            isRoot : isRoot,
            isSubtermOf : isSubtermOf,
            detach : detach,
            attach : attach,
            length : length,
        };
    }();
});