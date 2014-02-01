/**
 * Implements event handlers for user actions on the tree view.
 */
define(["knockout", "jquery", "viewmediators/ui-common"], function(ko, $, moduleUI) {

    //blur: save 'description' of bid conventions
    $(document).on('blur', '.description', function(event) {
        ko.contextFor(this).$root.saveToLocalStorage();
    });

    //blur: save 'description' of bid conventions
    $(document).on('keyup', '.description', function(event) {
        var keyCode = event.keyCode || event.which;
        if (keyCode === moduleUI.keycodes.ENTER) {
            event.stopPropagation();
            event.preventDefault();
            $(event.target).blur();
        }
    });

    //click: select a bid convention
    $(document).on('click', '.bidconvention', function(event) {
        ko.contextFor(this).$root.select(ko.contextFor(this).$data);
        console.log("TODO: shift, ctrl, toggleIsSelected/addToSelection/setSelection");
        event.stopPropagation();
        event.preventDefault();
        return false;
    });

    //click: deselect a bid convention
    $(document).on('click', 'body', function(event) {
        console.log(this);
        ko.contextFor(this).$root.clearSelection();
    });

    $(document).on('contextmenu', '.bidconvention', function(event) {
        event.stopPropagation();
        event.preventDefault();

        var bidsystem = ko.contextFor(this).$root;
        var bidconvention = ko.contextFor(this).$data;
        if (bidsystem.selectedConventions().length === 0) {
            bidsystem.select(bidconvention);
        }
        console.log("TODO: open context menu for selected");
        return false;
    });
});