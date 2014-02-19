/**
 * Implements event handlers for user actions on the tree view.
 */
define(["knockout", "jquery", "viewmediators/ui-common", "jquery-ui"], function(ko, $, moduleUI) {
    
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
        if (!bidpicker.invalidatesCurrentBidsequence(bid) && !bidpicker.invalidatesSubsequentBidsequences(bid) ){ 
            app.handleBidpicking(bid);
        }
    });

    /**
     * Mouse down on a bid convention marks the convention as selected 
     * in case 0 or 1 bidconventions are in the current selection.
     * (right button prevents the description going to edit mode)
     */
    $(document).on('mousedown', '.bidconvention', function(event) {
        //console.log("mousedown", ".bidconvention");
        var app = ko.contextFor(this).$root;
        var bidconvention = ko.contextFor(this).$data;
        if (event.which === 1 || event.which === 2) { //left or middle mouse button
            app.select(bidconvention);
        }
        if (event.which === 3) { //right mouse button
            if (app.selectedConventions().length <= 1) {
                app.select(bidconvention);
            }
            //HACK: prevent description element goint to edit mode when
            //the context-menu is opened
            //TODO: maybe introduce viewstate telling which descriptions are in edit mode?
            var descriptionElement = $(".description", this);
            descriptionElement.blur();
            descriptionElement.one("focus", function(){descriptionElement.blur()});
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
    });

});