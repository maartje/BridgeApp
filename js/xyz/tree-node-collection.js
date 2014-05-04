/**
 * Represents a collection of nodes in a tree structure 
 */
define(function(require, exports, module) {
    
    var TreeNodeCollection = module.exports.TreeNodeCollection = function(nodes) {
        this._nodes = nodes || [];
    };

    TreeNodeCollection.prototype = function() {
        
        var getNodes = function(){
            return this._nodes;
        };


        //remove nodes that are descendants 
        //of other nodes in the collection
        //example: A-B, A-B-C-D, A-X-Y => A-B, A-X-Y
        //1) sort on length
        //2) recursively pick head, filter tail based on head
        var getTopLevelNodes = function(){
            var nodes = this._nodes.slice(0);
            nodes.sort(function (n1, n2) {
                return n1.length() - n2.length();
            });
            
            var result = nodes.reduce(function(topLevelNodes, n){
                var isAncestorOf = function(node){
                    return n.isSubtermOf(node); 
                };
                if(!topLevelNodes.some(isAncestorOf)) {
                    topLevelNodes.push(n)
                }
                return topLevelNodes;
            }, []);
            return new TreeNodeCollection(result);
        };


        return {
            //unwrap function
            getNodes : getNodes,

            //tree structure functions
            getTopLevelNodes : getTopLevelNodes,
        };
    }();
});