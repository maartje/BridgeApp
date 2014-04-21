/**
 * Used to unit test objects that interact with tree structured data 
 */
define(function(require, exports, module) {
    
    var FakeTreeNodeCollection = module.exports.FakeTreeNodeCollection = function(fakeNodes) {
        this._nodes = fakeNodes || [];
    };

    FakeTreeNodeCollection.prototype = function() {
        
        var getNodes = function(){
            //simplified implementation
            return this._nodes;
        };

        var getAllNodes = function(nodes){
            //simplified implementation
            return this._nodes;
        };
        
        //remove nodes that are descendants 
        //of other nodes in the collection
        //example: A-B, A-B-C-D, A-X-Y => A-B, A-X-Y
        //1) sort on length
        //2) recursively pick head, filter tail based on head
        var getTopLevelNodes = function(){
            //simplified implementation
            return this._nodes;
        };

        return {
            getNodes : getNodes,
            getAllNodes : getAllNodes,
            getTopLevelNodes : getTopLevelNodes,
        };
    }();


    var FakeTreeNode = module.exports.FakeTreeNode = function(id, children) {
        this._id = id;
        this._children = children;
        this._parent = null; //set later
    };

    FakeTreeNode.prototype = function() {


        var getAllNodes = function(){
        };

        var getChildren = function() {
            return this._children;
        };

        var getParent = function() {
            return this._parent;
        };

        var getRoot = function() {
            if (!this._parent) {
                return this;
            }
            return this._parent.getRoot();
        };
        
        var getNextSibling = function(){
            return this._nextSibling;
        };
        
        var getPreviousSibling = function(){
            return this._previousSibling;
        };

        var detach = function() {
            this.isAttached = false;
        };

        var attach = function() {
            this.isAttached = true;
        };

        return {
            getAllNodes : getAllNodes,
            getChildren : getChildren,
            getParent : getParent,
            getRoot : getRoot,
            getNextSibling : getNextSibling,
            getPreviousSibling : getPreviousSibling,
            detach : detach,
            attach : attach,
        };
    }();
    
    var initializeTestData = module.exports.initializeTestData = function(){
        var node_01001 = module.exports.node_01001 = new FakeTreeNode("node_01001", []);
        var node_0100 = module.exports.node_0100 = new FakeTreeNode("node_0100", [node_01001]);
        var node_0101 = module.exports.node_0101 = new FakeTreeNode("node_0101", []);
        var node_010 = module.exports.node_010 = new FakeTreeNode("node_010", [node_0100, node_0101]);
        var node_00 = module.exports.node_00 = new FakeTreeNode("node_00", []);
        var node_01 = module.exports.node_01 = new FakeTreeNode("node_01", [node_010]);
        var node_0 = module.exports.node_0 = new FakeTreeNode("node_0", [node_00, node_01]);

        node_01001._parent = node_0100;
        
        node_0100._parent = node_010;
        node_0100._nextSibling = node_0101;
        
        node_0101._parent = node_010;
        node_0101._previousSibling = node_0100;
        
        node_010._parent = node_01;
        
        node_00._parent = node_0;
        node_00._nextSibling = node_01;
        
        node_01._parent = node_0;
        node_01._previousSibling = node_00;
    };
    
    module.exports.initializeTestData();
 
});