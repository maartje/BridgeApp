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
        event.stopPropagation();
        var keyCode = event.keyCode || event.which;
        if (keyCode === moduleUI.keycodes.ENTER) {
            event.preventDefault();
            $(event.target).blur();
        }
    });

    $(document).on('keyup', 'body', function(event) {
        var keyCode = event.keyCode || event.which;
        if (keyCode === moduleUI.keycodes.DELETE) {
            event.stopPropagation();
            event.preventDefault();
            var bidsystem = ko.contextFor(this).$root;
            bidsystem.deleteSelection();
            bidsystem.saveToLocalStorage();
            console.log("TODO: show dialog for deleting selected bidconventions");
        }
    });
    
    $(".cm-delete").click(function(){
        var bidsystem = ko.contextFor(this).$root;
        bidsystem.deleteSelection();
        bidsystem.saveToLocalStorage();
        console.log("TODO: show dialog for deleting selected bidconventions");
        //TODO: delete selected, or better: show DELETE dialog
    });

    //click: select a bid convention
    $(document).on('mousedown', '.bidconvention', function(event) {
        ko.contextFor(this).$root.select(ko.contextFor(this).$data);
        console.log("TODO: shift, ctrl, toggleIsSelected/addToSelection/setSelection");
        event.stopPropagation();
        event.preventDefault();
        return false;
    });

    //click: deselect a bid convention
    $(document).on('mousedown', 'body', function(event) {
        console.log(this);
        ko.contextFor(this).$root.clearSelection();
    });

    $(document).on('contextmenu', '.bidconvention', function(event) {
        event.stopPropagation();
        event.preventDefault();

        var bidsystem = ko.contextFor(this).$root;
        var bidconvention = ko.contextFor(this).$data;
        if (bidsystem.selectedConventions().length <= 1) {
            bidsystem.select(bidconvention);
        }
        //console.log("TODO: open context menu for selected");
        return false;
    });
});