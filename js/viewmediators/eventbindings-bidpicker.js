/**
 * Implements event handlers for the bidpicker element.
 */
define(["knockout", "jquery"], function(ko, $) {

    $(document).on('click', '.bidconvention .bid', function(e) {
        e.stopPropagation();
        console.log("click bid");
        var app = ko.contextFor(this).$root;
        var bidconvention = ko.contextFor(this).$data;
        app.showBidpickerForReplacingBids([bidconvention], e.pageX, e.pageY);
        $(document).one('click', function() {
            console.log("hide bidpicker");
            app.hideBidpicker();
        });
    });

    $(document).on('click', '.bidpicker .bid-button', function(event) {
        //TODO more sophisticated handling of invalidates-succeeding-bids
        if (!$(this).hasClass("invalid-bid") && !$(this).hasClass("invalidates-succeeding-bids") ){ 
            var app = ko.contextFor(this).$root;
            var bid = ko.contextFor(this).$data;
            app.handleBidpicking(bid);
        }
        event.stopPropagation();
    });

});