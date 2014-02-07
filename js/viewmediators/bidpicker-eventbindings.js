/**
 * Implements event handlers for the bidpicker element.
 */
define(["knockout", "jquery"], function(ko, $) {

    $(document).on('blur', '.bidpicker', function(event) {
        var bidpicker = ko.contextFor(this).$data;
        bidpicker.visible(false);
    });

    $(document).on('click', '.bidpicker .bid-button', function(event) {
        var bidpicker = ko.contextFor(this).$parent;
        var bid = ko.contextFor(this).$data;
        var app = ko.contextFor(this).$root;
        //TODO handle create new bid?;
        bidpicker.replaceBid(bid);
        bidpicker.visible(false);

        //TODO: bidconvention should save itself to local storage (?!)
        app.saveToLocalStorage();        
    });

});