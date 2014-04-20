/**
 * Used to unit test objects that depend on a viewstate manager 
 */
define(function(require, exports, module) {

    var FakeViewStateManager = module.exports.FakeViewStateManager = function() {
        this._viewState = {};
    };

    FakeViewStateManager.prototype = function() {
        var getViewState = function(){ 
            return this._viewState; 
        };
        
        var setViewState = function(viewState){
            this._viewState = viewState;
        };
        
        var setFocus = function(nodes){
            this._viewState.focusedNodes = nodes;
        };

        var openAll = function(nodes){
            this._viewState.openNodes = nodes;
        };

        return {
            getViewState : getViewState,
            setViewState : setViewState,
            setFocus : setFocus,
            openAll : openAll,
        };

    }();
});