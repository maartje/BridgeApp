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
     * @param treeNodeCollection {TreeNodeCollection}
     */
    var DeleteCommand = module.exports.DeleteCommand = function(baseCommand, treeNodeCollection) {
        mixinModule.MIXIN(baseCommand, this);
        this._baseCommand = baseCommand;
        this._nodes = treeNodeCollection.getTopLevelNodes();
    };

    DeleteCommand.prototype = function() {
        
        /**
         * Checks if the deletion is not applied to the root node
         * @return {boolean}
         */
        var canExecute = function() {
            for (var i = 0; i < this._nodes.length; i++) {
                if (this._nodes[i].isRoot()){
                    return false;
                }
            }
            return this._baseCommand.canExecute();
        };


        /**
         * Deletes a given set of nodes from the data structure.
         * Updates the viewstate so that a nearby node is focused for each deleted node.
         */
        var execute = function() {
            //stores the viewstate to enable rollback
            this._baseCommand.execute(); 
            
            //modifies the data structure
            var nearbyNodes = [];
            for (var i = 0; i < this._nodes.length; i++) {
                var node = this._nodes[i];
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
            for (var i = 0; i < this._nodes.length; i++) {
                var node = this._nodes[i];
                node.attach();
            }

            //resets the viewstate
            this._baseCommand.undoExecute();
        };

        return {
            canExecute : canExecute,
            execute : execute,
            undoExecute : undoExecute,
        };
    }();
});