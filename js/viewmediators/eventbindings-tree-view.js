/**
 * Implements event handlers for user actions on the tree view.
 */
define(["knockout", "jquery", "viewmediators/ui-common", "jquery-ui"], function(ko, $, moduleUI) {
    

    $(document).on('click', '.selected-bidsequence .bid', function(event) {
        console.log("click", ".bid");
        var app = ko.contextFor(this).$root;
        var bidconvention = ko.contextFor(this).$data;
        app.setBidsequenceAsTop(bidconvention);

    });

    $(document).on('click', '.player.we', function(event) {
        var app = ko.contextFor(this).$root;
        app.setRootAsTop();
    });

    $(document).on('click', '.player.them', function(event) {
        var app = ko.contextFor(this).$root;
        app.setOpponentRootAsTop();
    });
    
    $(document).on('dblclick', '.bidconvention-tree-node', function(e) {
        var app = ko.contextFor(this).$root;
        app.setSelectedAsTop();
    });

	
    /**
     * Clicking on the '.jstree-icon' toggles the open/close
     * rendering of the tree node view.
     */
    $(document).on('click', '.jstree-icon', function(event) {
        //console.log("click, .jstree-icon");
        var app = ko.contextFor(this).$root;
        var bidconvention = ko.contextFor(this).$data;
        app.toggleOpenClose(bidconvention);
    });

    /**
     * Clicking on a bid element in a single(!) selected bidconvention, 
     * shows the bidpicker element that allows the user to replace the 
     * clicked bid with another valid bid.
     * Remark: mousedown is used because of its interaction with mousedown that selects.
     */
    $(document).on('click', '.bidconvention .bid', function(event) {
        console.log("click", ".bid");
        var app = ko.contextFor(this).$root;
        var bidconvention = ko.contextFor(this).$data;
        if (app.isSingleSelected(bidconvention)) {
            app.showBidpickerForReplacingBids(event.pageX, event.pageY);
            $(document).one('click', function() {
                //console.log("click", "document");
                app.hideBidpicker();
            });
        }
    });


    /**
     * Clicking on a 'bid-button' in the bidpicker element inserts
     * or replaces a bid in the bidsystem model iff the bid associated
     * to the clicked button does not invalidates the bidsystem
     */
    $(document).on('click', '.bidpicker .bid-button', function(event) {
        var app = ko.contextFor(this).$root;
        var bidpicker = app.bidpicker;
        var bid = ko.contextFor(this).$data;
        //TODO more sophisticated handling of invalidates-succeeding-bids
        if (!bidpicker.invalidatesCurrentBidsequence(bid)){ 
            app.handleBidpicking(bid);
        }
    });

    /**
     * Mouse down on a bid convention marks the convention as selected 
     * in case 0 or 1 bidconventions are in the current selection.
     * (right button prevents the description going to edit mode)
     */
    $(document).on('click', '.bidconvention', function(event) {
        console.log("click", ".bidconvention");
        console.log("e.wich", event.which);
        var app = ko.contextFor(this).$root;
        var bidconvention = ko.contextFor(this).$data;
        
        if (event.ctrlKey || !app.isSingleSelected(bidconvention)){
            //HACK: prevents description element goint to edit mode when bidconvention
            //is not yet selected.
            //TODO: maybe introduce viewstate telling which descriptions are in edit mode?
            var descriptionElement = $(".description", this);
            descriptionElement.blur();        	
        }        
        if (event.shiftKey) {
        	//TODO: select range
            event.stopPropagation();
            event.preventDefault();
        }
        if (event.ctrlKey) {
            app.toggleSelected(bidconvention);
            event.stopPropagation();
            event.preventDefault();
        }
        else {
        	app.select(bidconvention);
        }        	
    });
    
    //cm and click seem to be captured. Therefore mousedown and which===3 are used.
    $(document).on('mousedown', '.bidconvention', function(event) {
    	if (event.which === 3) {	
	        var app = ko.contextFor(this).$root;
	        var bidconvention = ko.contextFor(this).$data;
	        if (event.ctrlKey) {
	            app.addToSelection(bidconvention);            	
	        }
	        else if (!app.isSelected(bidconvention)){
	        	app.select(bidconvention);
	        }
	        //HACK: prevents description element goint to edit mode when bidconvention
	        //is not yet selected.
	        //TODO: maybe introduce viewstate telling which descriptions are in edit mode?    	
	        var descriptionElement = $(".description", this);
	        descriptionElement.blur();
	        descriptionElement.one('focus', function(){descriptionElement.blur();});
	    }
    });

    /**
     * Blur on '.description' makes the possible changed description persistent
     * by triggering the storage of the model in the local storage
     */
    $(document).on('blur', '.bidconvention .description', function(event) {
        var app = ko.contextFor(this).$root;
        app.bidsystem.saveToLocalStorage();
    });

    /**
     * Pressing the enter key on '.description' triggers the blur event
     * on the '.description' element
     */
    $(document).on('keydown', '.bidconvention .description', function(event) {
        //console.log("keydown", ".description");
        var keyCode = event.keyCode || event.which;
        if (keyCode === moduleUI.keycodes.ENTER) {
            event.preventDefault();
            $(event.target).blur();
        }
        if (keyCode === moduleUI.keycodes.DELETE) {
            event.stopPropagation();
        }
    });

});