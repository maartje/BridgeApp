/**
 * Manages the state of the tree-view component
 */
define(function(require, exports, module) {
    var bidsystemModule = require("models/bidsystem");
    var bidpickerModule = require("models/bidpicker");
    var bidconventionModule = require("models/bidconvention");
    var ko = require("knockout");
	require("viewmediators/binding-handlers");
    require("viewmediators/eventbindings-tree-view");
    require("viewmediators/eventbindings-context-menu");

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

        /**
         * Returns the css class that represents the style of the tree node
         * for a given bidconvention, i.e. open/closed, leaf, last
         * 
         * @param {BidConvention} bidconvention
         * @return {String}
         */
        var cssTreeNode = function(bidconvention) {
            function isOpen(bidconvention) {
                return this.openedConventions.indexOf(bidconvention) >= 0;
            };
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

        /**
         * Returns the css class that represents the style of a given bidconvention 
         * in the tree view, i.e. opponent-bid, selected, successor of selected
         * 
         * @param {BidConvention} bidconvention
         * @return {String}
         */
        var cssBidconvention = function(bidconvention) {
            function isCut(bidconvention) {
                //TODO: special styling for cut conventions (clipped and cut action)?
                return this.isCutAction && this.clippedConventions.indexOf(bidconvention) >= 0;
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

        // methods that manipulate the collection of selected bids

        /**
         * Removes all bidconventions from the collection
         * of selected conventions
         */
        var clearSelection = function() {
            this.selectedConventions.removeAll();
        };

        /**
         * Sets the given bidconvention as the only element in the
         * collection of selected bidconventions
         * @param {BidConvention} bidconvention
         */
        var select = function(bidconvention) {
            clearSelection.call(this);
            addToCollection(this.selectedConventions, bidconvention);
        };

        /**
         * Adds the given bidconvention to the set of selected conventions
         * in case it was not already selected.
         * @param {BidConvention} bidconvention
         */
        var addToSelection = function(bidconvention) {
            addToCollection(this.selectedConventions, bidconvention);
        };

        /**
         * Removes the given bidconvention from the set of selected conventions
         * @param {BidConvention} bidconvention
         */
        var removeFromSelection = function(bidconvention) {
            this.selectedConventions.remove(bidconvention);
        };


        // methods that check or manipulate the collection of clipped bids

        /**
         * Marks the selected bid conventions as copied (clipped + cutaction === false)
         */
        var copySelection = function() {
            clipSelection.call(this, false);
        };

        /**
         * Marks the selected bid conventions as cut (clipped + cutaction === true)
         */
        var cutSelection = function() {
            clipSelection.call(this, true);
        };

        //helper function that marks the selected conventions as clipped
        var clipSelection = function(isCutAction) {
            this.clippedConventions.removeAll();
            addAllToCollection(this.clippedConventions, this.selectedConventions);
            this.isCutAction = isCutAction;
        };

        // helper methods
        
        //adds an element to the collection iff it is not already in the collection
        //returns true iff the element is added
        var addToCollection = function(collection, elem) {
            if (collection.indexOf(elem) === -1) {
                collection.push(elem);
                return true;
            }
            return false;
        };

        //adds elements to the given collection iff they are not already in the collection
        var addAllToCollection = function(collection, elems) {
            for (var i = 0; i < elems.length; i++) {
                addToCollection(collection, elems[i]);
            }
        };


        // methods that manipulate the tree structure


        /**
         * Removes the selected bid conventions from the tree structure,
         * and from the set of selected conventions, clipped conventions, open conventions
         */
        var deleteSelection = function() {
            ko.utils.arrayForEach(this.selectedConventions(), function(bc) {
                bc.remove();
            });
            this.openedConventions.removeAll(this.selectedConventions());
            this.clippedConventions.removeAll(this.selectedConventions());
            clearSelection.call(this);
            this.bidsystem.saveToLocalStorage();
        };

        /**
         * Adds clones of the clipped conventions as children to the selected conventions.
         * The ancestors of the newly added conventions are opened,
         * the added conventions are the newly selected conventions,
         * if cut action, the clipped conventions are removed from the tree structure,
         * the selection of clipped conventions is emptied,
         * the cut action is set to false.
         */
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

        /**
         * Adds new childbidconventions to the selected bidconventions.
         * The child bidconventions have the given bid as bid.
         * The newly added child conventions are the new set of selected conventions
         * The ancestors of the newly added child conventions are opened.
         * @param {Bid} bid
         */
        var addNewChildToSelection = function(bid) {
            //TODO: throw exception when bid is not valid
            var createdBidConventions = [];
            ko.utils.arrayForEach(this.selectedConventions(), function(bc) {
                createdBidConventions.push(bc.createChild({bid : bid}));
            });
            addAllToCollection(this.openedConventions, getAllAncestorBidconventions(createdBidConventions));
            this.selectedConventions(createdBidConventions);
        };

        /**
         * Sets the visibility property of the bidpicker to false
         */
        var hideBidpicker = function() {
            this.bidpicker.hide();
        };
        
        /**
         * Shows the bidpicker at the given screen positions (in pixels).
         * Unconnected candidate child bids are created for the selected conventions
         * and set as bidconventions for the bidpicker.
         * 
         * @param {Number} left
         * @param {Number} top
         */
        var showBidpickerForAddingNewChildBids = function(left, top) {
            var createdBidConventions = [];
            ko.utils.arrayForEach(this.selectedConventions(), function(bc) {
                var newChild = new bidconventionModule.Bidconvention({parent : bc});
                createdBidConventions.push(newChild);
            });
            this.bidpicker.show(left, top, createdBidConventions);
        };

        /**
         * Shows the bidpicker at the given scrren positions (in pixels).
         * Unconnected candidate sibling bids are created for the selected conventions
         * and set as bidconventions for the bidpicker.
         * 
         * @param {Number} left
         * @param {Number} top
         */
        var showBidpickerForAddingNewSiblingBids = function(left, top) {
            var createdBidConventions = [];
            ko.utils.arrayForEach(this.selectedConventions(), function(bc) {
                var newSibChild = new bidconventionModule.Bidconvention({parent : bc.parent});
                createdBidConventions.push(newSibChild);
            });
            this.bidpicker.show(left, top, createdBidConventions);
        };

        /**
         * Shows the bidpicker at the given screen positions (in pixels).
         * The selected bidconventions are set as bidconventions for the bidpicker,
         * the current bid is set iff all selected bid conventions have the same bid
         * 
         * @param {Number} left
         * @param {Number} top
         */
        var showBidpickerForReplacingBids = function(left, top) {
            var currentBids = ko.utils.arrayMap(this.selectedConventions(), function(bc) {
                return bc.bid();
            });
            var currentBid = currentBids.length === 1? currentBids[0] : null;
            this.bidpicker.show(left, top, this.selectedConventions(), currentBid);
        };

        /**
         * Sets the chosen bid for the bidconventions in the bidpicker,
         * and add these conventions to the tree structure 
         * (if they were not already contained in the tree structure).
         * Sets these conventions as the selected conventions, and
         * opens all ancestor bids of these conventions.
         * Makes the modification persistence by saving to local storage.
         * 
         * @param {Bid} bid
         */
        var handleBidpicking = function(bid) {
            var bidconventions = this.bidpicker.bidconventions();
            this.bidpicker.handleBidpicking(bid);
            this.selectedConventions(bidconventions); 
            addAllToCollection(this.openedConventions, getAllAncestorBidconventions(bidconventions)); 
            this.bidsystem.saveToLocalStorage();
        };

        //helper to get unique ancestors
        var getAllAncestorBidconventions = function(bidconventions){
            var ancestors = [];
            var ancestorCandidates = ko.utils.arrayMap(bidconventions, function(bc){
                return bc.parent;
            });
            while (ancestorCandidates.length > 0) {
                var candidate = ancestorCandidates.pop();
                if (!candidate.isRoot() && addToCollection(ancestors, candidate)){
                    ancestorCandidates.push(candidate.parent);
                }
            }
            return ancestors;
        };


        //methods that affect the view without affecting the data
        
        /**
         * Switches to the bidsystem with the other pair as dealer
         */
        var toggleIsDealer = function() {
            if (this.selectedRoot().getRoot() === this.bidsystem.bidRoot) {
                this.selectedRoot(this.bidsystem.bidRootOpponent);
            }
            else {
                this.selectedRoot(this.bidsystem.bidRoot);
            }
        };
        
        /**
         * Switches the tree node between open and closed
         */
        var toggleOpenClose = function(bidconvention) {
            if (!addToCollection(this.openedConventions, bidconvention)) {
                this.openedConventions.remove(bidconvention);
            }
        };
        
        /**
         * Sets the selected convention as the current convention
         * shown as tree top
         */
        var setSelectedAsTop = function() {
            //TODO condition: exactly 1 bc in selection
            var bidconvention = this.selectedConventions()[0];
            this.selectedConventions([]);
            this.selectedRoot(bidconvention);
        };

        
        // save and load methods
        
        /**
         * Saves the state to local storage
         */
        var saveToLocalStorage = function() {
            this.bidsystem.saveToLocalStorage();
        }
        
        /**
         * Loads the state from local storage
         */
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
            showBidpickerForAddingNewChildBids : showBidpickerForAddingNewChildBids,
            showBidpickerForReplacingBids : showBidpickerForReplacingBids,
            showBidpickerForAddingNewSiblingBids : showBidpickerForAddingNewSiblingBids,
            hideBidpicker : hideBidpicker,
            handleBidpicking : handleBidpicking,
            
            //methods for loading and saving data
            saveToLocalStorage: saveToLocalStorage,
            loadFromLocalStorage: loadFromLocalStorage
        };
    }();

    return module.exports;
});
