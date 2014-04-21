/**
 * Represents the action to toggle the open/close state of a tree node. 
 * Provides the functionality to undo the operation.
 */
define(function(require, exports, module) {
    var mixinModule = require("util/mixin");

    /**
     * Constructor for the ToggleOpenCloseCommand
     * @param baseCommand {BaseCommand}
     * @param treeNode {TreeNode}
     */
    var ToggleOpenCloseCommand = module.exports.ToggleOpenCloseCommand = function(baseCommand, treeNode) {
        mixinModule.MIXIN(baseCommand, this);
        this._baseCommand = baseCommand;
        this._node = treeNode;
    };

    ToggleOpenCloseCommand.prototype = function() {

        /**
         * Toggles the open close/state of a node.
         * In case a node is closed, then all its descendants
         * are also closed.
         */
        var execute = function() {
            //stores the viewstate to enable rollback
            this._baseCommand.execute(); 
            
            //modifies the view state
            if (this.getViewStateManager().isOpen(this._node)) {
                var allNodes = this._node.getAllNodes();
                this.getViewStateManager().closeAll(allNodes);
            }
            else {
                this.getViewStateManager().open(this._node);
            }
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