/**
 * Implements event handlers for the context menu and its shortcuts.
 */
define(["knockout", "jquery", "viewmediators/ui-common", "jquery-ui", "libs/jquery.hotkeys"], function(ko, $, moduleUI) {

    $(document).bind('keydown', 'alt+t', function() {
        console.log("hotkeys alt+t");
    }); 

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


    $(".context-menu-new").click(function(e){
        var app = ko.contextFor(this).$root;
        app.showBidpickerForAddingNewChildBids(e.pageX, e.pageY); 
        $(document).one('click', function() {
            app.hideBidpicker();
        });
    });
    
    $(document).on('keyup', 'body', function(event) {
        var keyCode = event.keyCode || event.which;
        var app = ko.contextFor(this).$root;
        if (app.selectedConventions().length > 0) {
            event.stopPropagation();
            event.preventDefault();
            if (keyCode === moduleUI.keycodes.DELETE) {
                var elem = $(".bidconvention.selected:last").get(0);
                deleteBidConventions(app, elem);
            }
        }
    });
    
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
                    app.bidsystem.saveToLocalStorage();
                },
                "Cancel": function() {
                    $(this).dialog("close");
                }
            }
        });
    };
});