define(function(require, exports, module) {
    var bidsystemModule = require("models/bidsystem");
    var bidpickerModule = require("models/bidpicker");
    var ko = require("knockout");
    require("viewmediators/event-bindings");
	require("viewmediators/binding-handlers");

    var Application = module.exports.Application = function(data) {
        this.bidsystem = new bidsystemModule.Bidsystem(data.bidsystem || {});
        this.selectedRoot = data.isDealer === false ? ko.observable(this.bidsystem.bidRootOpponent) : ko.observable(this.bidsystem.bidRoot);
        this.selectedConventions = typeof data.selectedConventions != 'undefined' ? ko.observableArray(data.selectedConventions) : ko.observableArray([]);
        this.clippedConventions = typeof data.clippedConventions != 'undefined' ? ko.observableArray(data.clippedConventions) : ko.observableArray([]);
        this.openedConventions = typeof data.openedConventions != 'undefined' ? ko.observableArray(data.openedConventions) : ko.observableArray([]);
        this.isCutAction = false;
        this.bidpicker = new bidpickerModule.Bidpicker();
    };

    Application.prototype = function() {

        // methods that query the data structure for presentation (or other) purpose
        
        var cssTreeNode = function(bidconvention) {
			var style = "";
			if(bidconvention.children().length === 0){
				style =  "jstree-leaf";
			}
			else if(isOpen.call(this, bidconvention)){
				style = "jstree-open";
			}
			else {
				style = "jstree-closed";
			}
			var bcParent = bidconvention.parent; 
			if(!bcParent || bcParent.children()[bcParent.children().length - 1] === bidconvention){
				style = style + " jstree-last";
			}
			return style;
        };		


        var cssBidconvention = function(bidconvention) {
            var cssStyle = "";
            if (isOpponentBid.call(this, bidconvention)) {
                cssStyle += "opponent-bid ";
            }
            if (isSelected.call(this, bidconvention)) {
                cssStyle += "selected";
            }
            if (isSuccessorOfSelected.call(this, bidconvention)) {
                cssStyle += "successor-of-selected";
            }
            return cssStyle;
        };

         function isOpponentBid(bidconvention) {
            var isEven = bidconvention.length() % 2 === 0;
            var isOpponentRoot = bidconvention.getRoot() === this.bidsystem.bidRootOpponent;
            return isEven != isOpponentRoot;
        };

        function isSelected(bidconvention) {
            return this.selectedConventions.indexOf(bidconvention) >= 0;
        };

        function isSuccessorOfSelected(bidconvention) {
            if (bidconvention.isRoot()) {
                return false;
            }
            if (isSelected.call(this, bidconvention.parent)) {
                return true;
            }
            return isSuccessorOfSelected.call(this, bidconvention.parent);
        };

        function isOpen(bidconvention) {
            return this.openedConventions.indexOf(bidconvention) >= 0;
        };

        function isClipped(bidconvention) {
            return this.clippedConventions.indexOf(bidconvention) >= 0;
        };


        // methods that manipulate the collection of selected bids

        var clearSelection = function() {
            this.selectedConventions.removeAll();
        };

        var select = function(bidconvention) {
            this.selectedConventions.removeAll();
            this.selectedConventions.push(bidconvention);
        };

        var addToSelection = function(bidconvention) {
            addToCollection(bidconvention, this.selectedConventions);
        };

        var removeFromSelection = function(bidconvention) {
            this.selectedConventions.remove(bidconvention);
        };


        // methods that check or manipulate the collection of clipped bids

        var copySelection = function() {
            clipSelection.call(this);
            this.isCutAction = false;
        };

        var cutSelection = function() {
            clipSelection.call(this);
            this.isCutAction = true;
        };

        var clipSelection = function() {
            var that = this;
            that.clippedConventions.removeAll();
            ko.utils.arrayForEach(that.selectedConventions(), function(bc) {
                that.clippedConventions.push(bc);
            });
            this.isCutAction = false;
        };

        // helper method
        var addToCollection = function(bidconvention, bcCollection) {
            if (bcCollection.indexOf(bidconvention) === -1) {
                bcCollection.push(bidconvention);
            }
        };


        // methods that manipulate the tree structure

        var deleteSelection = function() {
            ko.utils.arrayForEach(this.selectedConventions(), function(bc) {
                bc.remove();
            });
            clearSelection.call(this);
        };

        var pasteClippedToSelection = function() {
            //TODO condition paste action is valid for all pairs clipped/selected 
            var that = this;
            ko.utils.arrayForEach(that.clippedConventions(), function(clippedBC) {
                ko.utils.arrayForEach(that.selectedConventions(), function(selectedBC) {
                    if (that.isCutAction) {
                        clippedBC.remove();
                    }
                    selectedBC.createChild(clippedBC.toJSON());
                });
            });
        };

        var addNewChildToSelection = function(bid) {
            //TODO: throw exception when bid is not valid
            var that = this;
            var createdBidConventions = [];
            ko.utils.arrayForEach(this.selectedConventions(), function(bc) {
                createdBidConventions.push(bc.createChild({bid : bid}));
                addToCollection(bc, that.openedConventions);
            });
            this.selectedConventions(createdBidConventions);
        };


        //methods that affect the view without affecting the data
        
        var toggleIsDealer = function() {
            if (this.selectedRoot().getRoot() === this.bidsystem.bidRoot) {
                this.selectedRoot(this.bidsystem.bidRootOpponent);
            }
            else {
                this.selectedRoot(this.bidsystem.bidRoot);
            }
        };
        
		var toggleOpenClose = function(bidconvention){
            if (this.openedConventions.indexOf(bidconvention) === -1) {
                this.openedConventions.push(bidconvention);
            }
            else {
                this.openedConventions.remove(bidconvention);
            }
		};

        var setSelectedAsTop = function() {
            //TODO condition: exactly 1 bc in selection
            var bidconvention = this.selectedConventions()[0];
            this.selectedConventions([]);
            this.selectedRoot(bidconvention);
        };

        
        // save and load methods
        
        var saveToLocalStorage = function() {
            this.bidsystem.saveToLocalStorage();
        }

        var loadFromLocalStorage = function() {
            this.bidsystem.loadFromLocalStorage();
            this.selectedRoot(this.bidsystem.bidRoot);
        }


        //public members		
        return {
            //css styles
            cssTreeNode : cssTreeNode,
            cssBidconvention: cssBidconvention,

            //methods that affect the view
            toggleIsDealer: toggleIsDealer,
            toggleOpenClose : toggleOpenClose,
            setSelectedAsTop: setSelectedAsTop,
            
            //methods that affect the collection of selected bids
            select: select,
            clearSelection: clearSelection,
            addToSelection: addToSelection,
            removeFromSelection: removeFromSelection,
            
            //methods that affect the collection of clipped bids
            copySelection: copySelection,
            cutSelection: cutSelection,
    
            //methods that modify the bidsystem data 
            pasteClippedToSelection: pasteClippedToSelection,
            deleteSelection: deleteSelection,
            addNewChildToSelection: addNewChildToSelection,
            
            //methods for loading and saving data
            saveToLocalStorage: saveToLocalStorage,
            loadFromLocalStorage: loadFromLocalStorage
        };
    }();

    return module.exports;
});
