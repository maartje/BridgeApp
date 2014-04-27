/**
 * Used to unit test objects that depend on a viewstate manager 
 * Viewstate properties are stored on tree nodes
 */
define(function(require, exports, module) {

    var FakeViewStateManager = module.exports.FakeViewStateManager = function() {
        this._viewState = 0;
        this._selectedItems = [];
        this._openItems = [];
        this._focusedItems = [];
    };

    FakeViewStateManager.prototype = function() {
        var getViewState = function(){ 
            return this._viewState; 
        };
        
        var setViewState = function(viewState){
            this._viewState = viewState;
        };
        
        var setFocus = function(nodes){
            addViewStateProperties.call(this, this._focusedItems, nodes);
        };

        var addViewStateProperties = function(viewStateCollection, nodes){
            for (var i = 0; i < nodes.length; i++) {
                if (!hasViewStateProperty.call(this, viewStateCollection, nodes[i])) {
                    viewStateCollection.push(nodes[i]);
                    this._viewState += 1;
                }
            }
        };

        var removeViewStateProperties = function(viewStateCollection, nodes){
            for (var i = 0; i < nodes.length; i++) {
                if (hasViewStateProperty.call(this, viewStateCollection, nodes[i])) {
                    var index = viewStateCollection.indexOf(nodes[i]);
                    viewStateCollection.splice(index, 1);
                    this._viewState += 1;
                }
            }
        };
        
        var hasViewStateProperty = function(viewStateCollection, node){
            return viewStateCollection.indexOf(node) > -1;
        };

        var openAll = function(nodes){
            addViewStateProperties.call(this, this._openItems, nodes);
        };

        var open = function(node){
            openAll.call(this, [node]);
        };

        var close = function(node){
            closeAll.call(this, [node]);
        };

        var closeAll = function(nodes){
            removeViewStateProperties.call(this, this._openItems, nodes);
        };
        
        var isOpen = function(node){
            return hasViewStateProperty.call(this, this._openItems, node);
        };
        
        var getSelectedItems = function(){
            return this._selectedItems;
        };

        var getOpenItems = function(){
            return this._openItems;
        };

        var getCurrentNode = function(){
            return this.currentNode;
        };

        var setCurrentNode = function(node){
            this.currentNode = node;
        };

        var select = function (node) {
            addViewStateProperties.call(this, this._openItems, [node]);
        };
        
        var deselect = function (node) {
            removeViewStateProperties.call(this, this._selectedItems, [node]);
        };

        var isSelected = function (node) {
            return hasViewStateProperty.call(this, this._selectedItems, node);
        };

        return {
            getViewState : getViewState,
            setViewState : setViewState,
            setFocus : setFocus,
            open : open,
            openAll : openAll,
            close : close,
            closeAll : closeAll,
            isOpen : isOpen,
            select : select,
            deselect : deselect,
            isSelected : isSelected,
            getSelectedItems : getSelectedItems,
            getOpenItems : getOpenItems,
            getCurrentNode : getCurrentNode,
            setCurrentNode : setCurrentNode,
        };
    }();
});