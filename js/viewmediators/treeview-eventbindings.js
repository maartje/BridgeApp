/**
 * Implements event handlers for user actions on the tree view.
 */
define(["knockout", "jquery", "viewmediators/ui-common", "jquery-ui"], function(ko, $, moduleUI) {

    $(document).on('click', '.jstree-icon', function(event) {
        var app = ko.contextFor(this).$root;
        var bidconvention = ko.contextFor(this).$data;
        app.toggleOpenClose(bidconvention);
    });


    //blur: save 'description' of bid conventions
    $(document).on('blur', '.bidconvention .description', function(event) {
        var app = ko.contextFor(this).$root;
        app.bidsystem.saveToLocalStorage();
    });

    //enter: save 'description' of bid conventions
    $(document).on('keyup', '.bidconvention .description', function(event) {
        event.stopPropagation();
        var keyCode = event.keyCode || event.which;
        if (keyCode === moduleUI.keycodes.ENTER) {
            event.preventDefault();
            $(event.target).blur();
        }
    });


    //click: select a bid convention
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

    $(document).on('contextmenu', '.bidconvention', function(event) {
        event.stopPropagation();
        event.preventDefault();
        var app = ko.contextFor(this).$root;
        var bidconvention = ko.contextFor(this).$data;
        if (app.selectedConventions().length <= 1) {
            app.select(bidconvention);
        }
    });
});