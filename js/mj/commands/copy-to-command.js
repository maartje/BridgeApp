/**
 * Represents the action to copy a set of 'clipped' nodes and 
 * insert these copies as siblings of a set of 'selected' nodes.
 * The command is used to implement a 'copy + paste' action on 
 * multiple selected and clipped nodes.
 */
define(function(require, exports, module) {

    /**
     * Constructor for the CopyToCommand
     * @param viewStateManager {IViewstateManager}
     * @param clippedNodes {[TreeNode]}
     * @param selectedNodes {[TreeNode]}
     */
    var CopyToCommand = module.exports.CopyToCommand = function(commandFactory, viewStateManager, selectedNodes, clippedNodes) {
        this._commandFactory = commandFactory;
        this._viewStateManager = viewStateManager;
        this._selectedNodes = selectedNodes;
        this._clippedNodes = clippedNodes;
    };

    CopyToCommand.prototype = function() {

        /**
         * Copies the clippedNodes and inserts these copies
         * as siblings of the selectedNodes.
         * The copied nodes get focus in the view state.
         * The function returns a command to 'undo' the data structure modifications.
         * @return {DeleteCommand}
         */
        var execute = function() {
            var copiedNodes = [];

            //modifies the data structure
            for (var indexSelected = 0; indexSelected < this._selectedNodes.length; indexSelected++) {
                for (var indexClipped = 0; indexClipped < this._clippedNodes.length; indexClipped++) {
                    var selectedNode = this._selectedNodes[indexSelected];
                    var clippedNode = this._clippedNodes[indexClipped]
                    var copiedNode = clippedNode.copyTo(selectedNode);
                    copiedNodes.push(copiedNode);
                }
            }

            //updates the viewstate
            this._viewStateManager.setFocus(copiedNodes);
            return this._commandFactory.createCommand("delete", copiedNodes);
        };

        return {
            execute: execute,
        };
    }();
});