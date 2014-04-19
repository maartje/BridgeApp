/**
 * Represents the action to delete a set of nodes 
 * from the data structure.
 * Provides the functionality to undo the delete operation.
 */
define(function(require, exports, module) {
    var mixinModule = require("util/mixin");

    /**
     * Constructor for the DeleteCommand
     * @param baseCommand {BaseCommand}
     * @param nodes {[TreeNodeCollection]}
     */
    var DeleteCommand = module.exports.DeleteCommand = function(baseCommand, treeNodeCollection) {
        mixinModule.MIXIN(baseCommand, this);
        this._baseCommand = baseCommand;
        this._treeNodeCollection = treeNodeCollection;
    };

    DeleteCommand.prototype = function() {

        /**
         * Deletes a given set of nodes from the data structure.
         * Updates the viewstate so that a nearby node is focused for each deleted node.
         */
        var execute = function() {
            //stores the viewstate to enable rollback
            this._baseCommand.execute(); 
            
            //modifies the data structure
            console.log(this._treeNodeCollection);
            var nodes = this._treeNodeCollection.getTopLevelNodes();
            var nearbyNodes = [];
            for (var i = 0; i < nodes.length; i++) {
                var node = nodes[i];
                var nearbyNode = node.getNextSibling() || node.getPreviousSibling() || node.getParent();
                node.detach();
                if (nearbyNode){
                   nearbyNodes.push(nearbyNode);
                }
            }

            // //updates the viewstate
            this.getViewStateManager().setFocus(nearbyNodes);
        };

        /**
         * Undo the delete operation by inserting the deleted nodes into the data structure.
         * The nodes are inserted based on their parent pointer.
         * Resets the viewstate so that it corresponds to the state before the insert operation.
         */
        var undoExecute = function() {
            //resets the data structure
            var nodes = this._treeNodeCollection.getTopLevelNodes();
            for (var i = 0; i < nodes.length; i++) {
                var node = nodes[i];
                node.attach();
            }

            //resets the viewstate
            this._baseCommand.undoExecute();
        };

        return {
            execute : execute,
            undoExecute : undoExecute,
        };
    }();
});