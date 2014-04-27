/**
 * Represents the action to set the root node of the treeview. 
 * The root node may, or may not be the actual root of a tree structure.
 * Provides the functionality to undo the operation.
 */
define(function(require, exports, module) {
    var mixinModule = require("util/mixin");

    /**
     * Constructor for the SetCurrentNodeCommand
     * @param baseCommand {BaseCommand}
     * @param treeNode {TreeNode}
     */
    var SetCurrentNodeCommand = module.exports.SetCurrentNodeCommand = function(baseCommand, treeNode) {
        mixinModule.MIXIN(baseCommand, this);
        this._baseCommand = baseCommand;
        this._node = treeNode;
    };

    SetCurrentNodeCommand.prototype = function() {

        /**
         * Sets current node which serves as the root of the tree view
         * and make sure that the viewstate is updated appropriately, i.e. 
         * - 1) set the root of the view
         * - 2) deselect all nodes that are not in the subtree of the view root
         * - 3) closes all nodes that are not in the subtree of the view root
         * - 4) ensures that the newly set view root is open
         * - 5) in case that the old root is a descendant of the new root:
         *   nodes in the ancestor chain from the old root to the new root are opened
         *   (select old root ???)
         */
        var execute = function() {
            //stores the viewstate to enable rollback
            this._baseCommand.execute(); 
            
            //modifies the view state
            
            //2. deselects all items that are not in scope
            var selectedItems = this.getViewStateManager().getSelectedItems();
            for (var i = 0; i < selectedItems.length; i++) {
                var selectedItem = selectedItems[i];
                if (!selectedItem.isSubtermOf(this._node)) {
                    this.getViewStateManager().deselect(selectedItem);
                }
            }

            //3. closes all items that are not in scope
            var openItems = this.getViewStateManager().getOpenItems();
            for (var i = 0; i < openItems.length; i++) {
                var openItem = openItems[i];
                if (!openItem.isSubtermOf(this._node)) {
                    this.getViewStateManager().close(openItem);
                }
            }
            
            // //4. opens the newly set view root
            this.getViewStateManager().open(this._node);
            
            // //5. opens the ancestor nodes
            var oldRootAncestor = this.getViewStateManager().getCurrentNode();
            while (oldRootAncestor.isSubtermOf(this._node)) {
                this.getViewStateManager().open(oldRootAncestor);
                oldRootAncestor = oldRootAncestor.getParent();
            }
            
            // //1. sets the root of the view
            this.getViewStateManager().setCurrentNode(this._node);

        };

        /**
         * Resets the viewstate so that it corresponds to the state before the 
         * 'set current node' operation was executed.
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