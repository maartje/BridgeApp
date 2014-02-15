/**
 * Represents bidconventions in a bid system given as a tree structure
 */
define(function(require, exports, module) {
    var bidModule = require("models/bid");
    var conventionModule = require("models/convention");
    var ko = require("knockout");

    var Bidconvention = module.exports.Bidconvention = function(data) {
        data = data || {};
        this.bid = ko.observable(data.bid ? bidModule.createBid(data.bid) : undefined);
        this.convention = new conventionModule.Convention(data.convention);

        this.parent = data.parent; //BidConvention
        this.children = ko.observableArray([]); //Array with BidConventions		
        this.createChildren(data.children || []);
    };

    Bidconvention.prototype = function() {


        // methods that expose information about the bidsequence

        /**
         * Says whether this bidconvention is the root convention, i.e. does not have a parent
         * 
         * @return {Boolean}
         */
        var isRoot = function() {
            return !this.parent;
        };

        /**
         * Returns the root of the bid sequence
         * 
         * @return {Bidconvention}
         */
        var getRoot = function() {
            if (isRoot.call(this)) {
                return this;
            }
            return getRoot.call(this.parent);
        };

        /**
         * Returns the length of the bidsequence
         * 
         * @return {Number}
         */
        var length = function() {
            if (isRoot.call(this)) {
                return 0;
            }
            return 1 + length.call(this.parent);
        };


        // validation methods

        /**
         * Returns true iff the given bid data represents a valid subsequent bid
         * for the given bidsequence
         * 
         * @param {Bid} bidData
         * @return {Boolean}
         */
        var isValidSubsequentBid = function(bidData) {
            var bidSuffix = getSuffixBids.call(this, 4);
            return verifySubsequentBid(bidSuffix, bidData);
        };

        /**
         * Returns all subsequent bidconventions (including this bid convention) that become invalid in case
         * the bid at backward position 'backwardPosition' is replaced by the new bid 'newBid'.
         * Remark: only the shortest invalid prefixes are returned
         * 
         * @param {Bid} newBid
         * @param {Number} backwardPosition
         * @return {Bidconvention[]}
         */
        var collectSubsequentBidsequencesInvalidatedByReplacement = function(newBid, backwardPosition){
            backwardPosition = backwardPosition || 0;
            if (backwardPosition >= 4) {
                return []; //replacement more than 4 bids back can not invalidate the current bid
            }
            if (replacementInvalidatesCurrentBidsequence.call(this, newBid, backwardPosition)){
                return [this];
            } 
            var result = [];
            for (var i = 0; i < this.children().length; i++) {
                var child = this.children()[i];
                var invalidSequencesForChild = collectSubsequentBidsequencesInvalidatedByReplacement.call(child, newBid, backwardPosition + 1);
                result.push.apply(result, invalidSequencesForChild);
            }
            return result;
        };

        /**
         * Checks if a subsequent bidconvention becomes invalid in case
         * the bid at backward position 'backwardPosition' is replaced by the new bid 'newBid'. 
         * 
         * @param {Bid} newBid
         * @param {Number} backwardPosition
         * @return {Boolean}
         */
        var repLacementInvalidatesSubsequentBidsequences = function(newBid, backwardPosition){
            backwardPosition = backwardPosition || 0;
            if (backwardPosition >= 4) {
                return false; //replacement more than 4 bids back can not invalidate the current bid
            }
            if (replacementInvalidatesCurrentBidsequence.call(this, newBid, backwardPosition)){
                return true;
            } 
            for (var i = 0; i < this.children().length; i++) {
                var child = this.children()[i];
                if (repLacementInvalidatesSubsequentBidsequences.call(child, newBid, backwardPosition + 1)) {
                    return true;
                }
            }
            return false;
        };

        /**
         * Checks if replacing the bid at backward position 'backwardPosition'
         * invalidates the current bid.
         * 
         * @param {Bid} newBid
         * @param {Number} backwardPosition
         * @return {Boolean}
         */
        var replacementInvalidatesCurrentBidsequence = function(newBid, backwardPosition){
            //TODO backwardPosition < length
            //TODO root
            if (backwardPosition >= 4) {
                return false; //replacement more than 4 bids back can not invalidate the current bid
            }
            //[b4, b3, b2, b1, b0]
            //[1c, 1s, pass, pass, 2s], 1s => pass invalidates 2s, 1c is needed to check this
            var bidSuffix = getSuffixBids.call(this, 5);
            bidSuffix[bidSuffix.length - 1 - backwardPosition] = newBid;
            var lastBid = bidSuffix.pop();
            return !verifySubsequentBid.call(this, bidSuffix, lastBid);
        };

        /**
         * Returns true iff the bidsuffix 'bidSuffix' verifies that the 
         * next bid 'nextBid' is a valid subsequent bid.
         * We assume that the bidSuffix is long enough to verify
         * or falsify the bid.
         * 
         * @param {Bid[]} bidSuffix
         * @param {Bid} nextBid
         * @return {Boolean}
         */
        function verifySubsequentBid(bidSuffix, nextBid) {
            
            // Returns true in case the array with bid types 'actualTypes' ends
            // with the given bid type array 'expectedSuffixTypes'
            var checkSuffixBidTypes = function(expectedSuffixTypes, actualTypes){
                var _checkSuffixBidTypes = function(expectedSuffixTypes, actualTypes){
                    if (expectedSuffixTypes.length === 0) {
                        return true;
                    }
                    if (actualTypes.length === 0) {
                        return false; //not verified, i.e. bidSuffix is too short to verify the next bid
                    }
                    var lastExpected = expectedSuffixTypes.pop();
                    var lastActual = actualTypes.pop();
                    return lastExpected === lastActual && _checkSuffixBidTypes(expectedSuffixTypes, actualTypes);
                };
                return _checkSuffixBidTypes(expectedSuffixTypes.slice(0), actualTypes.slice(0));
            };

            // Returns the highest (latest) suit bid in the bid array
            // 'bids' that represents a bidsequence
            var bidLevel = function(bids) {
                var _bidLevel = function(bids) {
                    if (bids.length === 0) {
                        return null;
                    }
                    var lastBid = bids.pop();
                    if (lastBid.type === "SUIT") {
                        return lastBid;
                    }
                    return _bidLevel(bids);
                };
                return _bidLevel(bids.slice(0));
            };

            var bidSuffixTypes = ko.utils.arrayMap(bidSuffix, function(b) { return b.type;}); 

            //The next bid is invalid in case the bidding is finished.
            if (bidSuffix.length >= 4 && checkSuffixBidTypes(["PASS", "PASS", "PASS"], bidSuffixTypes)) {
                return false; //sequence passed out
            }

            bidSuffixTypes.push(nextBid.type);
            var bidLevelSuffix = bidLevel(bidSuffix); //undefined if only passes

            //true iff last bid is verified against a suffix that is long enough
            return checkSuffixBidTypes(["SUIT", "DOUBLET"], bidSuffixTypes) || 
                checkSuffixBidTypes(["SUIT", "PASS", "PASS", "DOUBLET"], bidSuffixTypes) || 
                checkSuffixBidTypes(["DOUBLET", "REDOUBLET"], bidSuffixTypes) || 
                checkSuffixBidTypes(["DOUBLET", "PASS", "PASS", "REDOUBLET"], bidSuffixTypes) || 
                checkSuffixBidTypes(["PASS"], bidSuffixTypes) || 
                (checkSuffixBidTypes(["SUIT"], bidSuffixTypes) && (!bidLevelSuffix || bidLevelSuffix.lt(nextBid)));
        };

        
        /**
         * Returns an array of bids that represent the last 'maxLength' bids
         * of the bidsequence.
         * @param {Number} maxLength
         * @return {Bid[]}
         */
        var getSuffixBids = function(maxLength) {
            if (maxLength === 0) {
                return [];
            }
            if (isRoot.call(this)) {
                return [];
            }
            var suffixBids = getSuffixBids.call(this.parent, maxLength - 1);
            suffixBids[suffixBids.length] = this.bid();
            return suffixBids;
        };


        //methods that modify the tree structure

        /**
         * Removes this bidsequence from the list of children of its parent
         * and thus from the tree structure
         * 
         * @return {Bidconvention}
         */
        var remove = function() {
            if (isRoot.call(this)) {
                this.children.removeAll();
            }
            else {
                this.parent.children.remove(this);
            }
            return this;
        };

        /**
         * Creates children from the given JSON data and adds them
         * to the list of child conventions. 
         * Returns itself.
         * 
         * @param {[JSON Bidconvention]}
         * @return {Bidconvention}
         */
        var createChildren = function(dataChildren) {
            for (var i = 0; i < dataChildren.length; i++) {
                createChild.call(this, dataChildren[i]);
            }
            return this;
        };

        /**
         * Creates a child from the given JSON data and adds it
         * to the list of child conventions. 
         * Returns the created child.
         * 
         * @param {JSON Bidconvention}
         * @return {Bidconvention}
         */
        var createChild = function(dataChild) {
            dataChild.parent = this;
            var child = new Bidconvention(dataChild);
            insertChild.call(this, child);
            return child;
        };
        
        //helper function to insert a child at the right position in the list
        var insertChild = function(child){
            var index = this.children().length;
            while (index > 0 && this.children()[index - 1].bid().succeeds(child.bid())) {
                index--;
            }
            this.children.splice(index, 0, child);
            return this;
        };

        /**
         * Replaces the bid with the given bid and relocate
         * the bidconvention in the list of children of the parent convention.
         * Returns itself.
         * 
         * @param {Bid}
         * @return {Bidconvention}
         */
        var replaceBid = function(bid) {
            if (this.isRoot()){
                throw "bid of root must be undefined";
            }
            this.bid(bid);
            remove.call(this); // recalculating the child index
            insertChild.call(this.parent, this);
            return this;
        };


        //methods for converting data to JS object that can be serialized

        /**
         * Returns the relevant properties as JSON data
         */
        var toJSON = function() {
            return {
                id: this.id,
                bid: this.bid(),
                convention: this.convention,
                children: this.children()
            };
        };


        //public members		
        return {
            //methods that modify the data
            createChild: createChild,
            createChildren: createChildren,
            replaceBid : replaceBid,
            remove: remove,
            
            //validation methods
            isValidSubsequentBid: isValidSubsequentBid,
            repLacementInvalidatesSubsequentBidsequences : repLacementInvalidatesSubsequentBidsequences,
            collectSubsequentBidsequencesInvalidatedByReplacement : collectSubsequentBidsequencesInvalidatedByReplacement,
            
            //properties of the structure
            getRoot: getRoot,
            isRoot: isRoot,
            length : length,

            //serialization
            toJSON: toJSON
        };
    }();


    return module.exports;
});
