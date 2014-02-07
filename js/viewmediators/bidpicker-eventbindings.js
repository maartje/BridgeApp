/**
 * Implements event handlers for the bidpicker element.
 */
define(["knockout", "jquery"], function(ko, $) {

    $(document).on('blur', '.bidpicker .bid-button', function(event) {
        console.log("blur bidpicker");
        var bidpicker = ko.contextFor(this).$data;
        bidpicker.visible(false);
    });

    $(document).on('click', '.bidpicker .bid-button', function(event) {
        //TODO more sophisticated handling of invalidates-succeeding-bids
        if (!$(this).hasClass("invalid-bid") && !$(this).hasClass("invalidates-succeeding-bids") ){ 
            var bidpicker = ko.contextFor(this).$parent;
            var bid = ko.contextFor(this).$data;
            var app = ko.contextFor(this).$root;
            //TODO handle create new bid?;
            bidpicker.replaceBid(bid);
            bidpicker.visible(false);
    
            //TODO: bidconvention should save itself to local storage (?!)
            app.saveToLocalStorage();        
        }
    });

});