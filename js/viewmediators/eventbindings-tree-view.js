/**
 * Implements event handlers for user actions on the tree view.
 */
define(["knockout", "jquery", "viewmediators/ui-common", "jquery-ui"], function(ko, $, moduleUI) {
    
    /**
     * Clicking on the '.jstree-icon' toggles the open/close
     * rendering of the tree node view.
     */
    $(document).on('click', '.jstree-icon', function(event) {
        var app = ko.contextFor(this).$root;
        var bidconvention = ko.contextFor(this).$data;
        app.toggleOpenClose(bidconvention);
        event.preventDefault();
        event.stopPropagation();
    });


    /**
     * Clicking on a bid element in the bid tree view shows the bidpicker element
     * that allows the user to replace the clicked bid with another valid bid.
     */
    $(document).on('click', '.bidconvention .bid', function(event) {
        var app = ko.contextFor(this).$root;
        var bidconvention = ko.contextFor(this).$data;
        app.select(bidconvention);
        app.showBidpickerForReplacingBids(event.pageX, event.pageY);
        $(document).one('click', function() {
            app.hideBidpicker();
        });
        event.preventDefault();
        event.stopPropagation();
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
        event.preventDefault();
        event.stopPropagation();
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
    $(document).on('keyup', '.bidconvention .description', function(event) {
        var keyCode = event.keyCode || event.which;
        if (keyCode === moduleUI.keycodes.ENTER) {
            event.preventDefault();
            $(event.target).blur();
        }
        event.stopPropagation();
    });

    /**
     * Mousedown marks a bid convention as selected
     */
    $(document).on('mousedown', '.bidconvention', function(event) {
        var app = ko.contextFor(this).$root;
        var bidconvention = ko.contextFor(this).$data;
        app.select(bidconvention);
        console.log("TODO: shift, ctrl, toggleIsSelected/addToSelection/setSelection");
        event.stopPropagation();
        event.preventDefault();
    });

    // $("#tree-view").on('mouseup', function(event) {
    //     event.stopPropagation();
    // });

    // //click: deselect a bid convention
    // $("body").on('mouseup', function(event) {
    //     var app = ko.contextFor(this).$root;
    //     app.clearSelection();
    // });

    /**
     * Rightmouse click on a bid convention opens the context menu.
     * The bid convention is marked as selected in case 0 or 1
     * bidconventions are in the current selection.
     */
    $(document).on('contextmenu', '.bidconvention', function(event) {
        var app = ko.contextFor(this).$root;
        var bidconvention = ko.contextFor(this).$data;
        if (app.selectedConventions().length <= 1) {
            app.select(bidconvention);
        }
        event.stopPropagation();
        event.preventDefault();
    });
});