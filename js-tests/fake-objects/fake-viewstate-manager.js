/**
 * Used to unit test objects that depend on a viewstate manager 
 * Viewstate properties are stored on tree nodes
 */
define(function(require, exports, module) {

    var FakeViewStateManager = module.exports.FakeViewStateManager = function() {
        this._viewState = 0;
    };

    FakeViewStateManager.prototype = function() {
        var getViewState = function(){ 
            return this._viewState; 
        };
        
        var setViewState = function(viewState){
            this._viewState = viewState;
        };
        
        var setFocus = function(nodes){
            setViewStateProperty.call(this, nodes, "hasFocus", true);
        };
        
        var setViewStateProperty = function(nodes, prop, value){
            for (var i = 0; i < nodes.length; i++) {
                var node = nodes[i];
                node[prop] = value;
            }
            this._viewState += 1;
        }

        var openAll = function(nodes){
            setViewStateProperty.call(this, nodes, "isOpen", true);
        };

        var open = function(node){
            setViewStateProperty.call(this, [node], "isOpen", true);
        };

        var closeAll = function(nodes){
            setViewStateProperty.call(this, nodes, "isOpen", false);
        };
        
        var isOpen = function(node){
            return node.isOpen? true : false;
        };

        return {
            getViewState : getViewState,
            setViewState : setViewState,
            setFocus : setFocus,
            open : open,
            openAll : openAll,
            closeAll : closeAll,
            isOpen : isOpen,
        };
    }();
});