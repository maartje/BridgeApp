/**
 * Represents the view state of the bidpicker that allows to pick a valid bid
 * TODO: refactor to bidbutton model???
 */
define(function(require, exports, module) {
    var bidModule = require("models/bid");
    var ko = require("knockout");

    var Bidpicker = module.exports.Bidpicker = function() {
        this.suitBids = createSuitBids();
        this.specialBids = createSpecialBids();
        this.visible = ko.observable(false);
        this.left = ko.observable(-1000);
        this.top = ko.observable(-1000);
        
        this.preselectedBid = ko.observable(undefined);
        this.bidconventions = ko.observable([]);

        function createSuitBids() {
            var suitBidArray = [];
            var suits = ["CLUBS", "DIAMONDS", "HEARTS", "SPADES", "NOTRUMP"];
            for (var level = 1; level <= 7; level++) {
                for (var suitIndex = 0; suitIndex < suits.length; suitIndex++) {
                    var suit = suits[suitIndex];
                    var bid = bidModule.createBid({
                        type: "SUIT",
                        suit: suit,
                        level: level
                    });
                    suitBidArray.push(bid);
                }
            }
            return suitBidArray;
        };

        function createSpecialBids() {
            return [
                new bidModule.createBid({
                    type: "PASS"
                }),
                new bidModule.createBid({
                    type: "DOUBLET"
                }),
                new bidModule.createBid({
                    type: "REDOUBLET"
                })
            ];
        };

    };

    Bidpicker.prototype = function() {

        /**
         * Returns the css class that represents the style of a given bid button, 
         * i.e. current-bid, invalid-bid, invalidates-succeeding-bids
         * 
         * @param {Bid} bid
         * @return {String}
         */
        var cssBidButton = function(bid) {
            var result = "";
            if (isPreselectedBid.call(this, bid)) {
                result += "preselected-bid ";
            }
            if (invalidatesCurrentBidsequence.call(this, bid)) {
                result += "invalid-bid "
            }
            else if (invalidatesSubsequentBidsequences.call(this, bid)) {
                result += "invalidates-succeeding-bids "
            }
            return result;
        };
        
        /**
         * Says whether the given bid is shown as preselected 
         * 
         * @param {Bid} bid
         * @return {Boolean}
         */
        var isPreselectedBid = function(bid) {
            return this.preselectedBid() && this.preselectedBid().equals(bid);
        };

        
        /**
         * Says whether the given bid is invalid or invalidates
         * descendant bid conventions
         * 
         * @param {Bid} bid
         * @return {Boolean}
         */
        var invalidatesSubsequentBidsequences = function(bid) {
            for (var i = 0; i < this.bidconventions().length; i++) {
                var bc = this.bidconventions()[i];
                if (bc.repLacementInvalidatesSubsequentBidsequences(bid)){
                    return true;
                }
            }
            return false;
        };

        /**
         * Says whether the given bid is invalid for the current bidsequence
         * 
         * @param {Bid} bid
         * @return {Boolean}
         */
        var invalidatesCurrentBidsequence = function(bid) {
            for (var i = 0; i < this.bidconventions().length; i++) {
                var bc = this.bidconventions()[i];
                if (bc.isRoot()) {
                    return true; //root does not have a bid
                }
                if (!bc.parent.isValidSubsequentBid(bid)){
                    return true;
                }
            }
            return false;
        };
        
        // var validBids = function(){
        //     var that = this;
        //     var validBids = [];

        //     for (var i = 0; i < that.specialBids.length; i++) {
        //         var specialBid = that.specialBids[i];
        //         if (!invalidatesSubsequentBidsequences.call(that, specialBid)){
        //             validBids.push(specialBid);
        //         }
        //     }
        //     for (var i = 0; i < that.suitBids.length; i++) {
        //         var suitBid = that.suitBids[i];
        //         if (!invalidatesSubsequentBidsequences.call(that, suitBid)){
        //             validBids.push(suitBid);
        //         }
        //     }
        //     return validBids;
        // };

        // //TODO: to disable the new item in the context menu 
        // //we need to know if there are valid 'child bids' for the
        // //selected bid conventions instead of valid 'replace bids'
        // var hasValidBids = function(){
        //     var that = this;
        //     for (var i = 0; i < that.specialBids.length; i++) {
        //         var specialBid = that.specialBids[i];
        //         if (!invalidatesSubsequentBidsequences.call(that, specialBid)){
        //             console.log("has-valid-bids", specialBid);
        //             return true;
        //         }
        //     }
        //     for (var i = 0; i < that.suitBids.length; i++) {
        //         var suitBid = that.suitBids[i];
        //         if (!invalidatesSubsequentBidsequences.call(that, suitBid)){
        //             console.log("has-valid-bids", suitBid);
        //             return true;
        //         }
        //     }
        //     console.log("NOT has-valid-bids");
        //     return false;
        // };

        /**
         * Sets the visible property to true, and sets other relevant properties,
         * namely: the left and top screen coordinates in pixels, the bidconventions
         * for which a new bid is picked, the preselected bid.
         * 
         * @param {Number} left
         * @param {Number} top
         * @param {[Bidconvention]} bidconventions
         * @param {Bid} bid
         */
        var show = function(left, top, bidconventions, bid) {
            this.visible(true);
            this.left(left);
            this.top(top);
            this.bidconventions(bidconventions);
            this.preselectedBid(bid);
        };
        
        /**
         * Sets the visible property to false
         */
        var hide = function() {
            this.visible(false);
        };

        /**
         * Replaces the bid property of the bidconventions with the
         * given bid, and sets the visible property to false.
         * @param {Bid} bid
         */
        var handleBidpicking = function(bid) {
            ko.utils.arrayForEach(this.bidconventions(), function(bc) {
                bc.replaceBid(bid);
            });
            hide.call(this);
            this.bidconventions([]);
            this.preselectedBid(null);
        };


        return {
            cssBidButton: cssBidButton,
            show: show,
            hide: hide,
            handleBidpicking: handleBidpicking,
            invalidatesSubsequentBidsequences : invalidatesSubsequentBidsequences,
            invalidatesCurrentBidsequence : invalidatesCurrentBidsequence
            // validBids : validBids,
            // hasValidBids : hasValidBids
        };
    }();

    return module.exports;
});
