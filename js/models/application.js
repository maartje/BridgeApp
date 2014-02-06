define(function(require, exports, module) {
    var bidSystemModule = require("models/bid-system");
    var bidPickerModule = require("models/bid-picker");
    var ko = require("knockout");
    require("viewmediators/event-bindings");
	require("viewmediators/binding-handlers");

    var Application = module.exports.Application = function(data) {
        this.bidsystem = new bidSystemModule.BidSystem(data.bidsystem || {});
        this.selectedRoot = data.isDealer === false ? ko.observable(this.bidsystem.bidRootOpponent) : ko.observable(this.bidsystem.bidRoot);
        this.selectedConventions = typeof data.selectedConventions != 'undefined' ? ko.observableArray(data.selectedConventions) : ko.observableArray([]);
        this.clippedConventions = typeof data.clippedConventions != 'undefined' ? ko.observableArray(data.clippedConventions) : ko.observableArray([]);
        this.openedConventions = typeof data.openedConventions != 'undefined' ? ko.observableArray(data.openedConventions) : ko.observableArray([]);
        this.isCutAction = false;
        this.bidpicker = new bidPickerModule.BidPicker();
    };

    Application.prototype = function() {

        // methods that query the data structure for presentation (or other) purpose
        
        var jstreeStyle = function(bidconvention) {
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


        var bidConventionStyle = function(bidconvention) {
            var cssStyle = "";
            if (this.isOpponentBid.call(this, bidconvention)) {
                cssStyle += "opponent-bid ";
            }
            if (this.isSelected.call(this, bidconvention)) {
                cssStyle += "selected";
            }
            if (this.isSuccessorOfSelected.call(this, bidconvention)) {
                cssStyle += "successor-of-selected";
            }
            return cssStyle;
        };

        var isOpponentBid = function(bidconvention) {
            var isOpponentRoot = bidconvention.getRoot() === this.bidRootOpponent;
            return bidconvention.isOpponentBid(isOpponentRoot);
        };

        var isSuccessorOfSelected = function(bidconvention) {
            if (bidconvention.isRoot()) {
                return false;
            }
            if (this.isSelected.call(this, bidconvention.parent)) {
                return true;
            }
            return this.isSuccessorOfSelected.call(this, bidconvention.parent);
        };

        var isSelected = function(bidconvention) {
            return this.selectedConventions.indexOf(bidconvention) >= 0;
        };

        var isOpen = function(bidconvention) {
            return this.openedConventions.indexOf(bidconvention) >= 0;
        };

        var isClipped = function(bidconvention) {
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

        var addToCollection = function(bidconvention, bcCollection) {
            if (bcCollection.indexOf(bidconvention) === -1) {
                bcCollection.push(bidconvention);
            }
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


        // methods that manipulate the tree structure

        //TODO: test cases
        var validatePaste = function() {
            var that = this;
            var invalidConventions = [];
            ko.utils.arrayForEach(that.clippedConventions(), function(clippedBC) {
                ko.utils.arrayForEach(that.selectedConventions(), function(selectedBC) {
                    //TODO: clone
                    clippedBC.parent = selectedBC;
                    invalidConventions.push.apply(invalidConventions, clippedBC.collectInvalidBids());
                });
            });
            //TODO: strip invalid conventions?
            console.log(invalidConventions);
        };

        var paste = function() {
            //TODO condition paste action is valid for all pairs clipped/selected 
            var that = this;
            ko.utils.arrayForEach(that.clippedConventions(), function(clippedBC) {
                ko.utils.arrayForEach(that.selectedConventions(), function(selectedBC) {
                    if (that.isCutAction) {
                        clippedBC.parent.children.remove(clippedBC);
                    }
                    selectedBC.createChild(clippedBC.toJSON());
                });
            });
        };

        var deleteSelection = function() {
            ko.utils.arrayForEach(this.selectedConventions(), function(bc) {
                bc.remove();
            });
            clearSelection.call(this);
        };

        var createNew = function(bid) {
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
		var toggleOpenClose = function(bidconvention){
            if (this.openedConventions.indexOf(bidconvention) === -1) {
                this.openedConventions.push(bidconvention);
            }
            else {
                this.openedConventions.remove(bidconvention);
            }
		};

        var setSelectedRoot = function() {
            //TODO condition: exactly 1 bc in selection
            var bidconvention = this.selectedConventions()[0];
            this.selectedConventions([]);
            this.selectedRoot(bidconvention);
        };

        var toggleIsDealer = function() {
            if (this.selectedRoot().getRoot() === this.bidsystem.bidRoot) {
                this.selectedRoot(this.bidsystem.bidRootOpponent);
            }
            else {
                this.selectedRoot(this.bidsystem.bidRoot);
            }
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
            toggleIsDealer: toggleIsDealer,
            clearSelection: clearSelection,
            select: select,
            addToSelection: addToSelection,
            removeFromSelection: removeFromSelection,
            isSelected: isSelected,
            setSelectedRoot: setSelectedRoot,
            copySelection: copySelection,
            cutSelection: cutSelection,
            paste: paste,
            validatePaste: validatePaste,
            createNew: createNew,
            deleteSelection: deleteSelection,
            isOpponentBid: isOpponentBid,
            jstreeStyle : jstreeStyle,
            bidConventionStyle: bidConventionStyle,
            isSuccessorOfSelected: isSuccessorOfSelected,
            saveToLocalStorage: saveToLocalStorage,
            loadFromLocalStorage: loadFromLocalStorage,
            toggleOpenClose : toggleOpenClose
        };
    }();

    return module.exports;
});
