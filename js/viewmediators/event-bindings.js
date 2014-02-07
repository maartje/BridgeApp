/**
 * Implements event handlers for user actions on the tree view.
 */
define(["knockout", "jquery", "viewmediators/ui-common", "jquery-ui"], function(ko, $, moduleUI) {

    $(document).on('blur', '.bidpicker', function(event) {
        var app = ko.contextFor(this).$root;
        app.bidpicker.visible(false);
    });

    $(document).on('click', '.bid-button', function(event) {
        var app = ko.contextFor(this).$root;
        var bid = ko.contextFor(this).$data;
        //app.createNew(bid);
        app.bidpicker.replaceBid(bid);
        app.bidsystem.saveToLocalStorage();        
        app.bidpicker.visible(false);
    });

    $(document).on('click', '.jstree-icon', function(event) {
        var app = ko.contextFor(this).$root;
        var bidconvention = ko.contextFor(this).$data;
        app.toggleOpenClose(bidconvention);
    });

    $(document).on('click', '.bid', function(e) {
        var app = ko.contextFor(this).$root;
        var bc = ko.contextFor(this).$data;
        app.bidpicker.currentBid(bc.bid());
        app.bidpicker.bidconventions([bc]);
        app.bidpicker.show(e.pageX, e.pageY);
        //TODO: show bidpicker at click location
        //app.bidpicker.show(x,y) => set x position, y position, isVisible
    });

    //blur: save 'description' of bid conventions
    $(document).on('blur', '.description', function(event) {
        var app = ko.contextFor(this).$root;
        app.bidsystem.saveToLocalStorage();
    });

    //enter: save 'description' of bid conventions
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