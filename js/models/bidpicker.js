define(function(require, exports, module) {
    var bidModule = require("models/bid");
    var ko = require("knockout");

    var Bidpicker = module.exports.Bidpicker = function(data) {
        var bpdata = data || {};
        this.suitBids = createSuitBids();
        this.specialBids = createSpecialBids();
        this.currentBid = ko.observable(bpdata.currentBid);
        this.bidconventions = ko.observable(bpdata.bidconventions || []);

        this.visible = ko.observable(bpdata.visible || false);
        this.left = ko.observable(bpdata.left || 0);
        this.top = ko.observable(bpdata.top || 0);

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

        var cssBidButton = function(bid) {
            var result = "";
            if (isCurrentBid.call(this, bid)) {
                result += "current-bid ";
            }
            if (invalidatesCurrentBidsequence.call(this, bid)) {
                result += "invalid-bid "
            }
            else if (invalidatesSubsequentBidsequences.call(this, bid)) {
                result += "invalidates-succeeding-bids "
            }
            return result;
        };
        
        var isCurrentBid = function(bid) {
            return this.currentBid() && this.currentBid().equals(bid);
        };

        var invalidatesSubsequentBidsequences = function(bid) {
            for (var i = 0; i < this.bidconventions().length; i++) {
                var bc = this.bidconventions()[i];
                if (bc.repLacementInvalidatesSubsequentBidsequences(bid)){
                    return true;
                }
            }
            return false;
        };
        
        var validBids = function(){
            var that = this;
            var validBids = [];

            for (var i = 0; i < that.specialBids.length; i++) {
                var specialBid = that.specialBids[i];
                if (!invalidatesSubsequentBidsequences.call(that, specialBid)){
                    validBids.push(specialBid);
                }
            }
            for (var i = 0; i < that.suitBids.length; i++) {
                var suitBid = that.suitBids[i];
                if (!invalidatesSubsequentBidsequences.call(that, suitBid)){
                    validBids.push(suitBid);
                }
            }
            return validBids;
        };

        //TODO: to disable the new item in the context menu 
        //we need to know if there are valid 'child bids' for the
        //selected bid conventions instead of valid 'replace bids'
        var hasValidBids = function(){
            var that = this;
            for (var i = 0; i < that.specialBids.length; i++) {
                var specialBid = that.specialBids[i];
                if (!invalidatesSubsequentBidsequences.call(that, specialBid)){
                    console.log("has-valid-bids", specialBid);
                    return true;
                }
            }
            for (var i = 0; i < that.suitBids.length; i++) {
                var suitBid = that.suitBids[i];
                if (!invalidatesSubsequentBidsequences.call(that, suitBid)){
                    console.log("has-valid-bids", suitBid);
                    return true;
                }
            }
            console.log("NOT has-valid-bids");
            return false;
        };

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
        
        var show = function(left, top) {
            this.left(left);
            this.top(top);
            this.visible(true);
        };

        var hide = function() {
            this.visible(false);
        };

        var setSelectedBid = function(bid) {
            var that = this;
            ko.utils.arrayForEach(that.bidconventions(), function(bc) {
                bc.replaceBid(bid);
            });
        };


        return {
            cssBidButton: cssBidButton,
            show: show,
            hide : hide,
            setSelectedBid: setSelectedBid,
            isCurrentBid : isCurrentBid,
            validBids : validBids,
            hasValidBids : hasValidBids
        };
    }();

    return module.exports;
});
