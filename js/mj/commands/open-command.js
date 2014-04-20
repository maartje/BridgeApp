/**
 * Represents the action to ensure that a given set of nodes is open. 
 * Provides the functionality to undo the operation.
 */
define(function(require, exports, module) {
    var mixinModule = require("util/mixin");

    /**
     * Constructor for the OpenCommand
     * @param baseCommand {BaseCommand}
     * @param treeNodeCollection {TreeNodeCollection}
     * @param includeDescendantNodes {boolean}
     */
    var OpenCommand = module.exports.OpenCommand = function(baseCommand, treeNodeCollection, includeDescendantNodes) {
        mixinModule.MIXIN(baseCommand, this);
        this._baseCommand = baseCommand;
        this._treeNodeCollection = treeNodeCollection;
        this._includeDescendantNodes = includeDescendantNodes;
    };

    OpenCommand.prototype = function() {

        /**
         * Opens a set of nodes, @includeDescendantNodes
         * specifies whether their descendant nodes are also opened.
         */
        var execute = function() {
            //stores the viewstate to enable rollback
            this._baseCommand.execute(); 
            
            //modifies the view state
            var nodes = this._includeDescendantNodes? this._treeNodeCollection.getAllNodes() : this._treeNodeCollection.getNodes();
            this.getViewStateManager().openAll(nodes);
        };

        /**
         * Resets the viewstate so that it corresponds to the state before the 
         * open operation was executed.
         */
        var undoExecute = function() {
            //resets the data structure

            //resets the viewstate
            this._baseCommand.undoExecute();
        };
   
        return {
            execute : execute,
            undoExecute : undoExecute,
        };
    }();
});