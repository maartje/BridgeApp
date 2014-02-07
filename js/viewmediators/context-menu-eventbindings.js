/**
 * Implements event handlers for the context menu and its shortcuts.
 */
define(["knockout", "jquery", "viewmediators/ui-common", "jquery-ui"], function(ko, $, moduleUI) {

    $(".context-menu-new").click(function(e){
        var app = ko.contextFor(this).$root;
        var bidconventions = app.createNewDetachedChildConventions(); 
        app.bidpicker.bidconventions(bidconventions);
        app.bidpicker.show(e.pageX, e.pageY);
        $(document).one('click', function() {
            app.bidpicker.hide();
        });
        event.stopPropagation();
    });


    $(document).on('keyup', 'body', function(event) {
        var keyCode = event.keyCode || event.which;
        if (keyCode === moduleUI.keycodes.DELETE && $(".selected:last").length > 0) {
            var elem = $(".selected:last").get(0);
            var app = ko.contextFor(this).$root;
            deleteBidConventions(app, elem);
            event.stopPropagation();
            event.preventDefault();
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