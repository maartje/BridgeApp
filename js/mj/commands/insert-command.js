/**
 * Represents the action to insert a given set of nodes 
 * into the data structure.
 * The nodes are inserted based on their parent pointer.
 * Provides the functionality to undo the insert operation.
 * Remark: used as a base class for other commands such as
 * @CopyToCommand, @MoveToCommand, @CreateChildCommand and @CreateSiblingCommand 
 */
define(function(require, exports, module) {
    var mixinModule = require("util/mixin");

    /**
     * Constructor for the InsertCommand
     * @param baseCommand {BaseCommand}
     * @param treeNodeCollection {TreeNodeCollection}
     */
    var InsertCommand = module.exports.InsertCommand = function(baseCommand, treeNodeCollection) {
        mixinModule.MIXIN(baseCommand, this);
        this._baseCommand = baseCommand;
        this._nodes = treeNodeCollection.getNodes();
    };

    InsertCommand.prototype = function() {

        /**
         * Checks if the parent of the inserted nodes is defined,
         * and checks if the insert operation does not create
         * cycles in the tree structure
         * @return {boolean}
         */
        var canExecute = function() {
            for (var i = 0; i < this._nodes.length; i++) {
                if (!this._nodes[i].parent || this._nodes[i].parent.isSubtermOf(this._nodes[i])){
                    return false;
                }
            }
            return this._baseCommand.canExecute();
        };

        /**
         * Inserts a given set of nodes into the data structure;
         * the nodes are inserted based on their parent pointer.
         * Updates the viewstate so that the inserted nodes are focused.
         */
        var execute = function() {
            //stores the viewstate to enable undo
            this._baseCommand.execute();

            //modifies the data structure
            for (var i = 0; i < this._nodes.length; i++) {
                var node = this._nodes[i];
                node.attach();
            }
            
            //updates the viewstate
            this.getViewStateManager().setFocus(this._nodes);
        };

        /**
         * Undo the insert operation by removing the inserted nodes from the data structure.
         * Resets the viewstate so that it corresponds to the state before the insert operation.
         */
        var undoExecute = function() {
            //resets the data structure
            for (var i = 0; i < this._nodes.length; i++) {
                var node = this._nodes[i];
                node.detach();
            }

            //resets the viewstate
            this._baseCommand.undoExecute();
        };
        
        /**
         * Sets the nodes that will be inserted
         */
        var setTreeNodeCollection = function(treeNodeCollection) {
           this._nodes = treeNodeCollection.getNodes();
     };

        return {
            setTreeNodeCollection : setTreeNodeCollection,
            canExecute : canExecute,
            execute : execute,
            undoExecute : undoExecute,
        };
    }();
});