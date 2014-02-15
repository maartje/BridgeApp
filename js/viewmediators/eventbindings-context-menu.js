/**
 * Implements event handlers for the context menu and its shortcuts.
 * Supported:
 * - Deleting selected bid conventions
 * - Adding new child conventions
 * - Adding new sibling conventions
 */
define(["knockout", "jquery", "viewmediators/ui-common", "jquery-ui", "libs/jquery.hotkeys"], function(ko, $, moduleUI) {

    $(document).bind('keydown', 'alt+t', function() {
        console.log("TODO: set as current bid, i.e. selected root");
    }); 

    /**
     * Alt + N opens a bidpicker allowing the user to add
     * new child bids to the selected bids
     */
    $(document).bind('keydown', 'alt+n', function() {
        var treeViewElem = $("#tree-view").get(0);
        var app = ko.contextFor(treeViewElem).$root;
        if (app.selectedConventions().length > 0) {
            var elem = $(".bidconvention.selected:last");
            var left = elem.offset().left + elem.width();
            var top = elem.offset().top + elem.height();
            app.showBidpickerForAddingNewChildBids(left, top); 
            $(document).one('click', function() {
                app.hideBidpicker();
            });
        }
    });

    /**
     * Alt + S opens a bidpicker allowing the user to add
     * new sibling bids to the selected bids
     */
    $(document).bind('keydown', 'alt+s', function() {
        var treeViewElem = $("#tree-view").get(0);
        var app = ko.contextFor(treeViewElem).$root;
        if (app.selectedConventions().length > 0) {
            var elem = $(".bidconvention.selected:last");
            var left = elem.offset().left + elem.width();
            var top = elem.offset().top + elem.height();
            app.showBidpickerForAddingNewSiblingBids(left, top); 
            $(document).one('click', function() {
                app.hideBidpicker();
            });
        }
    });


    /**
     * '.context-menu-new' opens a bidpicker allowing the user to add
     * new child bids to the selected bids
     */
    $(".context-menu-new").click(function(e){
        var app = ko.contextFor(this).$root;
        app.showBidpickerForAddingNewChildBids(e.pageX, e.pageY); 
        $(document).one('click', function() {
            app.hideBidpicker();
        });
    });

    /**
     * '.context-menu-new-sib' opens a bidpicker allowing the user to add
     * new sibling bids to the selected bids
     */
    $(".context-menu-new-sib").click(function(e){
        var app = ko.contextFor(this).$root;
        app.showBidpickerForAddingNewSiblingBids(e.pageX, e.pageY); 
        $(document).one('click', function() {
            app.hideBidpicker();
        });
    });
    
    /**
     * Pressing the delete key opens a confirmation dialog
     * that allows the user to delete all selected bids
     */
    $(document).on('keyup', 'body', function(event) {
        var keyCode = event.keyCode || event.which;
        var app = ko.contextFor(this).$root;
        if (app.selectedConventions().length > 0) {
            if (keyCode === moduleUI.keycodes.DELETE) {
                var elem = $(".bidconvention.selected:last").get(0);
                deleteBidConventions(app, elem);
                event.stopPropagation();
                event.preventDefault();
            }
        }
    });
    
    /**
     * '.context-menu-delete' opens a confirmation dialog
     * that allows the user to delete all selected bids
     */
    $(".context-menu-delete").click(function(){
        event.stopPropagation();
        var app = ko.contextFor(this).$root;
        deleteBidConventions(app, this);
    });
    
    function deleteBidConventions(app, elem) {
        $("#dialog-confirm-delete-bid-convention").dialog({
            position: {
                my: "left top",
                at: "right bottom",
                of: elem
            },
            show: {
                effect: 'fadeIn',
                duration: 500
            },
            hide: {
                effect: 'fadeOut',
                duration: 500
            },
            resizable: false,
            height: 240,
            width: 400,
            modal: true,
            buttons: {
                "Ok": function() {
                    $(this).dialog("close");
                    app.deleteSelection();
                },
                "Cancel": function() {
                    $(this).dialog("close");
                }
            }
        });
    };
});