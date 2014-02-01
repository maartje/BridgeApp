/**
 * Implements event handlers for user actions on the tree view.
 */
define(["knockout", "jquery", "viewmediators/ui-common"], function(ko, $, moduleUI){

	  //blur: save 'description' of bid conventions
	  $(document).on('blur', '.description', function (event) {
	    ko.contextFor(this).$root.saveToLocalStorage();
	  });

	  //blur: save 'description' of bid conventions
	  $(document).on('keyup', '.description', function (event) {
    	var keyCode = event.keyCode || event.which;
    	if (keyCode === moduleUI.keycodes.ENTER) {
    	    event.stopPropagation();
    	    event.preventDefault();
    	    $(event.target).blur();
    	}
	      
	  });
});