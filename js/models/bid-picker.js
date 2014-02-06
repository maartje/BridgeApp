define(function(require, exports, module) {
    var bidModule = require("models/bid");
    var ko = require("knockout");

    var BidPicker = module.exports.BidPicker = function(data) {
        var bpdata = data || {}; 
        this.suitBids = this.createSuitBids();
        this.specialBids = this.createSpecialBids();
        this.preselectedBid = ko.observable(bpdata.preselectedBid);
        this.bidConventions = ko.observable(bpdata.bidConventions || []);
        
        this.visible = ko.observable(bpdata.visible || false);
        this.left = ko.observable(bpdata.left || 0);
        this.top = ko.observable(bpdata.top || 0);
    };

    BidPicker.prototype = function() {
        
        var cssStyle = function(bid){
            var result = "";
            if (isPreSelectedBid.call(this, bid)){
                result += "preselected-bid ";
            }
            if (!isValidNextBid.call(this, bid)){
                result += "invalidates-current-bid "
            }
            else if (!isValidPrecedingBid.call(this, bid)) {
                result += "invalidates-succeeding-bids "
            }
            //TODO: createsInvalidChildSequences
            return result;
        };
        
        var show = function(left, top){
            this.left(left);
            this.top(top);
            this.visible(true);
        };
        
        var isPreSelectedBid = function(bid){
            return this.preselectedBid().equals(bid);
        };

        var isValidPrecedingBid = function(bid){
            var that = this;
            var invalidSequences = [];
            ko.utils.arrayForEach(that.bidConventions(), function(bc) {
                if (bc.isRoot()){
                    throw "root bid is not supposed to be changed since it is undefined by definition";
                }
                var bcInvalidSequences = bc.collectInvalidSequencesForReplacement(bid);
                invalidSequences.push.apply(invalidSequences, bcInvalidSequences);
            });
            console.log("invalid by replacement: ", invalidSequences);
            return invalidSequences.length === 0;
        };

        var isValidNextBid = function(bid){
            var that = this;
            var validationResult = true;
            ko.utils.arrayForEach(that.bidConventions(), function(bc) {
                if (bc.isRoot()){
                    throw "root bid is not supposed to be changed since it is undefined by definition";
                }
                if (!bc.parent.isValidChildBid(bid)){
                    validationResult = false;
                }
            });
            //console.log("validated: ", bid, validationResult);
            return validationResult;
        };
        
        var setSelectedBid = function(bid){
            var that = this;
            ko.utils.arrayForEach(that.bidConventions(), function(bc) {
                bc.updateBid(bid);
            });
        };

        var createSuitBids = function(){
            var suitBidArray = [];
            var suits = ["CLUBS", "DIAMONDS", "HEARTS", "SPADES", "NOTRUMP"];
            for (var level = 1; level <= 7; level++) {
                for (var suitIndex = 0; suitIndex < suits.length; suitIndex++) {
                    var suit = suits[suitIndex];
                    var bid = bidModule.createBid({type : "SUIT", suit : suit, level : level});
                    suitBidArray.push(bid);
                }
            }
            return suitBidArray;
        };

        var createSpecialBids = function(){
            return [
                new bidModule.createBid({type : "PASS"}),
                new bidModule.createBid({type : "DOUBLET"}),
                new bidModule.createBid({type : "REDOUBLET"})
            ];
        };
        
        return {
            createSuitBids : createSuitBids,
            createSpecialBids : createSpecialBids,
            show : show,
            setSelectedBid : setSelectedBid,
            isValidNextBid : isValidNextBid,
            cssStyle : cssStyle
        };

    }();

    return module.exports;
});
