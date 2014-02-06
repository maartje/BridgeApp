define(function(require, exports, module) {
    var bidModule = require("models/bid");
    var conventionModule = require("models/convention");
    var ko = require("knockout");

    var collectInvalidBids = module.exports.collectInvalidBids = function(bidConventions) {
        var invalidConventions = [];
        for (var i = 0; i < bidConventions.length; i++) {
            invalidConventions.push.apply(invalidConventions, bidConventions[i].collectInvalidBids());
        }
        return invalidConventions;
    };

    var BidConvention = module.exports.BidConvention = function(data) {
        if (!data.parent && data.bid) {
            throw 'A newly created bid system must contain a root node for which the bid is "undefined"';
        }
        this.id = data.id; //GUID TODO: new Guid if data.id not defined
        this.bid = ko.observable(data.bid ? bidModule.createBid(data.bid) : undefined);
        this.convention = new conventionModule.Convention(data.convention || {});

        this.parent = data.parent; //BidConvention
        this.children = ko.observableArray([]); //Array with BidConventions		
        this.createChildren(data.children || []);
    };

    BidConvention.prototype = function() {

        //helper methods

        var isRoot = function() {
            return !this.parent;
        };

        var getRoot = function() {
            if (isRoot.call(this)) return this;
            return getRoot.call(this.parent);
        };

        var length = function() {
            if (isRoot.call(this)) {
                return 0;
            }
            return 1 + length.call(this.parent);
        };

        var isOpponentBid = function(isOpponentRoot) {
            if (isRoot.call(this)) {
                return !isOpponentRoot;
            }
            return !isOpponentBid.call(this.parent);
        };

        //methods for validation
        
        var collectInvalidSequencesForReplacement = function(newBid, level){
            level = level || 0;
            if (!isValidSequenceForReplacement.call(this, newBid, level)){
                return [this];
            } 
            var result = [];
            for (var i = 0; i < this.children().length; i++) {
                var child = this.children()[i];
                var invalidSequencesForChild = collectInvalidSequencesForReplacement.call(child, newBid, level + 1);
                result.push.apply(result, invalidSequencesForChild);
            }
            return result;
        };

        var isValidSequenceForReplacement = function(newBid, level){
            if (level >= 4) {
                return true; //replacement more than a bidround back can not invalidate the current bid
            }
            //[b4, b3, b2, b1, b0]
            //[1c, 1s, pass, pass, dbl], 1s => pass invalidates dbl
            var bidSuffix = getSuffixBids.call(this, 5);
            //TODO root
            bidSuffix[bidSuffix.length - 1 - level] = newBid;
            var lastBid = bidSuffix.pop();
            return verifyNextBid.call(this, bidSuffix, lastBid);
        };

        var collectInvalidBids = function() {
            if (!isRoot.call(this) && !isValidChildBid.call(this.parent, this.bid())) {
                return [this];
            }
            var invalidChildConventions = [];
            for (var i = 0; i < this.children().length; i++) {
                var child = this.children()[i];
                invalidChildConventions.push.apply(invalidChildConventions, collectInvalidBids.call(child));
            }
            return invalidChildConventions;
        };

        var isValidBidSequence = function() {
            return (isRoot.call(this) && !this.bid()) || (isValidChildBid.call(this.parent, this.bid()) && isValidBidSequence.call(this.parent));
        };

        //helper function that returns true iff 'bidSuffix' verifies 'nextBid'.
        //That is: if [..., bidSuffix] is valid, then [..., bidSuffix, nextBid] is also valid.
        var verifyNextBid = function(bidSuffix, nextBid) {

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

            var bidSuffixTypes = ko.utils.arrayMap(bidSuffix, function(b) {
                return b.type;
            }); 

            //The next bid is invalid in case the bidding is finished.
            if (bidSuffix.length >= 4 && checkSuffixBidTypes(["PASS", "PASS", "PASS"], bidSuffixTypes)) {
                return false; //sequence passed out
            }

            var bidLevelSuffix = bidLevel(bidSuffix); //undefined if only passes
            bidSuffixTypes.push(nextBid.type);

            //true iff last bid is verified against a suffix that is long enough
            return checkSuffixBidTypes(["SUIT", "DOUBLET"], bidSuffixTypes) || 
                checkSuffixBidTypes(["SUIT", "PASS", "PASS", "DOUBLET"], bidSuffixTypes) || 
                checkSuffixBidTypes(["DOUBLET", "REDOUBLET"], bidSuffixTypes) || 
                checkSuffixBidTypes(["DOUBLET", "PASS", "PASS", "REDOUBLET"], bidSuffixTypes) || 
                checkSuffixBidTypes(["PASS"], bidSuffixTypes) || 
                (checkSuffixBidTypes(["SUIT"], bidSuffixTypes) && (!bidLevelSuffix || bidLevelSuffix.lt(nextBid)));
        };

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

        var isValidChildBid = function(bidData) {
            var bidSuffix = getSuffixBids.call(this, 4);
            return verifyNextBid.call(this, bidSuffix, bidData);
        };

        //methods that modify the tree structure

        var remove = function() {
            if (isRoot.call(this)) {
                this.children.removeAll();
            }
            else {
                this.parent.children.remove(this);
            }
            return this;
        };

        var createChildren = function(dataChildren) {
            for (var i = 0; i < dataChildren.length; i++) {
                createChild.call(this, dataChildren[i]);
            }
            return this;
        };

        var createChild = function(dataChild) {
            if (!isValidChildBid.call(this, dataChild.bid)) {
                throw "unvalid bid: " + JSON.stringify(dataChild.bid);
                //TODO: "unvalid bidsequence: 2c - 2r - 1s"
            }
            dataChild.parent = this;
            var child = new BidConvention(dataChild);
            insertChild.call(this, child);
            return child;
        };
        
        var insertChild = function(child){
            var index = this.children().length;
            while (index > 0 && this.children()[index - 1].bid().succeeds(child.bid())) {
                index--;
            }
            this.children.splice(index, 0, child);
            return child;
        };

        var updateBid = function(bid) {
            if (this.isRoot()){
                throw "bid of the root can not be updated since it is supposed to be undefined";
            }
            var parent = this.parent;
            if (!isValidChildBid.call(parent, bid)) {
                throw "unvalid bid: " + JSON.stringify(bid);
                //TODO: "unvalid bidsequence: 2c - 2r - 1s"
            }
            this.bid(bid);
            remove.call(this);
            insertChild.call(parent, this);
            return this;
        };

        //methods for converting data to JS object that can be serialized

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
            createChild: createChild,
            createChildren: createChildren,
            toJSON: toJSON,
            collectInvalidBids: collectInvalidBids,
            isValidChildBid: isValidChildBid,
            remove: remove,
            getRoot: getRoot,
            isRoot: isRoot,
            isOpponentBid: isOpponentBid,
            updateBid : updateBid,
            collectInvalidSequencesForReplacement : collectInvalidSequencesForReplacement
        };
    }();


    return module.exports;
});
