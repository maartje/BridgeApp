/**
 * Implements event handlers for the context menu and its shortcuts.
 * Supported:
 * - Deleting selected bid conventions
 * - Adding new child conventions
 * - Adding new sibling conventions
 */
define(["knockout", "jquery", "viewmediators/ui-common", "jquery-ui", "libs/jquery.hotkeys"], function(ko, $, moduleUI) {

    $(document).bind('keydown', 'alt+t', function() {
        //console.log("keydown", "document", "alt + t");
        //console.log("TODO: set as current bid, i.e. selected root");
    }); 

    /**
     * Alt + N opens a bidpicker allowing the user to add
     * new child bids to the selected bids
     */
    $(document).bind('keydown', 'alt+n', function() {
        console.log("keydown", "document", "alt + n");
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
        console.log("keydown", "document", "alt + s");
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
        console.log("click", "cm-new");
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
        console.log("click", "cm-new-sib");
        var app = ko.contextFor(this).$root;
        app.showBidpickerForAddingNewSiblingBids(e.pageX, e.pageY); 
        $(document).one('click', function() {
            app.hideBidpicker();
        });
    });
    
    /**
     * '.context-menu-delete' opens a confirmation dialog
     * that allows the user to delete all selected bids
     */
    $(".context-menu-delete").click(function(){
        //console.log("click", "cm-delete");
        // event.stopPropagation();
        var app = ko.contextFor(this).$root;
        deleteBidConventions(app, this);
    });

    /**
     * Pressing the delete key opens a confirmation dialog
     * that allows the user to delete all selected bids
     */
    $(document).on('keydown', 'body', function(event) {
        //console.log("keydown", "body");
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
    
    /**
     * '.context-menu-copy' copies the selected bidconventions
     * to the 'clipboard'. After paste, the original bidconventions
     * remain in the bidsystem.
     */
    $(".context-menu-copy").click(function(){
        //console.log("click", "cm-copy");
        // event.stopPropagation();
        var app = ko.contextFor(this).$root;
        app.copySelection();
    });

    /**
     */
    $(document).bind('keydown', 'ctrl+c', function(e) {
    	//TODO extract method handleEditAction
    	if ($(e.target).hasClass("description")){
    		e.stopPropagation();
    		return;
    	}
        var treeViewElem = $("#tree-view").get(0);
        var app = ko.contextFor(treeViewElem).$root;
        app.copySelection();    	
    });

    /**
     * '.context-menu-cut' copies the selected bidconventions
     * to the 'clipboard'. After paste, the original bidconventions
     * are removed from the bidsystem.
     */
    $(".context-menu-cut").click(function(){
        //console.log("click", "cm-cut");
        // event.stopPropagation();
        var app = ko.contextFor(this).$root;
        app.cutSelection();
    });
    
    /**
     */
    $(document).bind('keydown', 'ctrl+x', function(e) {
    	if ($(e.target).hasClass("description")){
    		e.stopPropagation();
    		return;
    	}
        var treeViewElem = $("#tree-view").get(0);
        var app = ko.contextFor(treeViewElem).$root;
        app.cutSelection();
    });


    /**
     * '.context-menu-paste' copies the 'clipped' bidconventions
     * to the selected bidconventions. The original bidconventions
     * are removed iff they where clipped with a cut action.
     */
    $(".context-menu-paste").click(function(){
        //console.log("click", "cm-paste");
        // event.stopPropagation();
        var app = ko.contextFor(this).$root;
        app.pasteClippedToSelection();
    });
    
    /**
     */
    $(document).bind('keydown', 'ctrl+v', function(e) {
    	if ($(e.target).hasClass("description")){
    		e.stopPropagation();
    		return;
    	}
        var treeViewElem = $("#tree-view").get(0);
        var app = ko.contextFor(treeViewElem).$root;
        app.pasteClippedToSelection();    	
    });
    
    $(".context-menu-select").click(function(){
    	//TODO: only enable when exactly one bid selected
        var app = ko.contextFor(this).$root;
        app.setSelectedAsTop();
    });
});