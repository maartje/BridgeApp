/**
 * Base class for commands. Provides functionality to rollback
 * the viewstate in the @undoExecute function.
 */
define(function(require, exports, module) {

    /**
     * Constructor for the BaseCommand
     * @param viewStateManager {IViewstateManager}
     */
    var BaseCommand = module.exports.BaseCommand = function(viewStateManager) {
        var _viewStateManager = viewStateManager;

        //privileged method, provides acces to private member _viewStateManager 
        this.getViewStateManager = function(){
            return _viewStateManager;
        };

    };

    BaseCommand.prototype = function() {

        /**
         * Stores the current viewstate to enable the undo operation. 
         * To be implemented in the 'derived' class.
         */
        var execute = function() {
            //sets roll back info
            this._viewStateBefore = this.getViewStateManager().getViewState();

            //modifies the data structure

            //updates the viewstate
        };

        /**
         * Resets the viewstate so that it corresponds to the state before the @execute operation.
         */
        var undoExecute = function() {
            //resets the data structure

            //resets the viewstate
            this.getViewStateManager().setViewState(this._viewStateBefore);
        };

        return {
//            getViewStateManager : getViewStateManager,
            execute : execute,
            undoExecute : undoExecute,
        };
    }();
});