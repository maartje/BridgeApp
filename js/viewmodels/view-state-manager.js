/**
 * Manages the viewstate of the application.
 * Extends the functionality of a @SelectionManager, 
 * @ClipboardManager and @TreeViewManager.
 */
define(function(require, exports, module) {
    var mixinModule = require("util/mixin");

    var ViewStateManager = module.exports.ViewStateManager = function(selectionManager, clipboardManager, treeViewManager, currentNode) {
        this._currentNode = currentNode;
        this._selectionManager = selectionManager;
        this._clipboardManager = clipboardManager;
        this._treeViewManager = treeViewManager;
        mixinModule.MIXIN(this._selectionManager, this);
        mixinModule.MIXIN(this._clipboardManager, this);
        mixinModule.MIXIN(this._treeViewManager, this);
    };

    ViewStateManager.prototype = function() {

        function getCurrentNode() {
            return this._currentNode;
        }

        function setCurrentNode(node) {
            this._currentNode = node;
        }

        function getViewState() {
            return {
                currentNode : this.getCurrentNode(),
                selectedItems : this.getSelectedItems(),
                openItems : this.getOpenItems(),
                cutItems : this.getCutItems(),
                copiedItems : this.getCopiedItems(),
            };
        }

        function setViewState(viewState) {
            this.setCurrentNode(viewState.currentNode);
            this.setSelectedItems(viewState.selectedItems);
            this.setOpenItems(viewState.openItems);
            //The currently clipped items remain clipped,
            //their cut status is preserved iff they were already cut 
            //in the old viewstate
            if (viewState.cutItems == this.getCutItems()){
                return;
            }
            this.copyAll(this.getClippedItems());
        }

        function clearViewState() {
            this.setCurrentNode(null);
            this._selectionManager.clear();
            this._clipboardManager.clear();
            this._treeViewManager.clear();
        }

        return {
            getCurrentNode : getCurrentNode,
            setCurrentNode : setCurrentNode,

            getViewState : getViewState,
            setViewState : setViewState,
            clearViewState : clearViewState,

        };
    }();
});