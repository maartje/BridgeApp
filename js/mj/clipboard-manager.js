/**
 * Implements select, cut, copy, paste functionality.
 * Supports selections consisting of multiple items. 
 */
define(function(require, exports, module) {
    var ko = require("knockout");

    /**
     * Implements select, cut, copy, paste functionality.
     * Supports selections consisting of multiple items. 
     */
    var ClipboardManager = module.exports.ClipboardManager = function() {
    	this.selectedItems = [];
    	this.clippedItems = [];
    	this.isCutAction = false;
    };

    /**
     * Implements select, cut, copy, paste functionality.
     * Supports selections consisting of multiple items. 
     */
    ClipboardManager.prototype = function() {    	

    	/**
    	 * Sets the given item as the single selected item
    	 * @param {Object}item
    	 */
    	var select = function(item) {
    		clearSelection.call(this);
    		this.selectedItems.push(item);
        };

    	/**
    	 * Toggles the selection status of the given item
    	 * @param {Object}item
    	 */
    	var toggleSelect = function(item) {
    		if (isSelected.call(this, item)){
    			var index = this.selectedItems.indexOf(item);
    			this.selectedItems.splice(index, 1);
    		}
    		else {
    			this.selectedItems.push(item);
    		}
        };

    	/**
    	 * Sets the given range as the collection of selected items
    	 * @param {[Object]}item
    	 */
        var selectRange = function(itemsInRange) {
        	clearSelection.call(this);
        	for ( var i = 0; i < itemsInRange.length; i++) {
				var item = itemsInRange[i];
 				toggleSelect.call(this, item);				
			}
        };

    	/**
    	 * Clears the collection of selected items
    	 */
        var clearSelection = function() {
        	this.selectedItems = [];
        };
    	        
    	/**
    	 * Applies the @fnDeleteItem(item) function to all selected items
    	 * The deleted items are also removed from the collection of selected items
    	 * @param {Function(Object)} fnDeleteItem
    	 */
        var deleteSelection = function(fnDeleteItem){        	
        	for ( var i = 0; i < this.selectedItems.length; i++) {
				var item = this.selectedItems[i];
				fnDeleteItem(item);
			}
        	clearSelection.call(this);
        };
        
    	/**
    	 * Adds the collection of selected items to the clipboard. 
    	 * Applies the @fnDeleteItem(item) function to all selected items
    	 * The deleted items are also removed from the collection of selected items
    	 * @param {Function(Object)} fnDeleteItem (optional)
    	 */
        var cut = function(fnDeleteItem){
        	clip.call(this);
        	this.isCutAction = true;
        	if (fnDeleteItem){
				for ( var i = 0; i < this.selectedItems.length; i++) {
					var selectedItem = this.selectedItems[i];
    				fnDeleteItem(selectedItem);
    			}
				clearSelection.call(this);
        	}
        };
        
    	/**
    	 * Adds the collection of selected items to the clipboard. 
    	 */
        var copy = function(){
        	clip.call(this);
        	this.isCutAction = false;
        };
        
        //private
        var clip = function(){
			//this.clippedItems = [];
        	for ( var i = 0; i < this.selectedItems.length; i++) {
				var selectedItem = this.selectedItems[i];
				this.clippedItems.push(selectedItem);
			}        	
        }

    	/**
    	 * Applies the function @fnPasteItem(selected, clipped) to all combinations consisting
    	 * of a selected item and a clipped item. 
    	 * Applies the @fnDeleteItem(clipped) function to all clipped items
    	 * that were clipped with the @cut function.
    	 * The deleted items are also removed from the collection of selected items
    	 * @param {Function(Object, Object)} fnPasteItem
    	 * @param {Function(Object)} fnDeleteItem (optional)
    	 */
        var paste = function(fnPasteItem, fnDeleteItem){   
        	for ( var i = 0; i < this.selectedItems.length; i++) {
            	for ( var j = 0; j < this.clippedItems.length; j++) {
    				var selectedItem = this.selectedItems[i];
    				var clippedItem = this.clippedItems[j];
    				fnPasteItem(selectedItem, clippedItem);
    			}
			}
			if (this.isCutAction && fnDeleteItem){
				for ( var k = 0; k < this.clippedItems.length; k++) {
    				var clippedItem = this.clippedItems[k];
    				fnDeleteItem(clippedItem);
    				if (isSelected.call(this, clippedItem)) {
    					var indexInSelected = this.selectedItems.indexOf(clippedItem);
    					this.selectedItems.splice(indexInSelected, 1);
    				}
    			}
			}
        };

    	/**
    	 * Says wether the given item is selected
    	 * @param {[Object]}item
    	 */
        var isSelected = function(item){
        	return this.selectedItems.indexOf(item) >= 0;
        };

    	/**
    	 * Says whether the given item is cut
    	 * @param {[Object]}item
    	 */
        var isCut = function(item){   
        	return this.isCutAction && this.clippedItems.indexOf(item) >= 0;
        };

        return {
        	//manage the collection of selected items
        	select : select, //click
        	toggleSelect : toggleSelect, //Ctrl click
        	selectRange : selectRange, //Shift click
        	clearSelection : clearSelection, //'blur'
        	
        	//apply actions to the collection of selected items
        	deleteSelection : deleteSelection, //delete
        	cut : cut, //Ctrl X
        	copy : copy, //Ctrl C
        	paste : paste, //Ctrl V
        	
        	//query state
        	isSelected : isSelected,
        	isCut : isCut        	
        };

    }();
});