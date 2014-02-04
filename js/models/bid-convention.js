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
        this.bid = data.bid ? bidModule.createBid(data.bid) : undefined; //Bid
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

        var collectInvalidBids = function() {
            if (!isRoot.call(this) && !isValidChildBid.call(this.parent, this.bid)) {
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
            return (isRoot.call(this) && !this.bid) || (isValidChildBid.call(this.parent, this.bid) && isValidBidSequence.call(this.parent));
        };

        var isValidChildBid = function(bidData) {
            //compares the bid types at the end of the bidsequence
            var hasSuffixBidTypes = function(bidTypes) {
                var getSuffixBids = function(maxLength) {
                    if (maxLength === 0) {
                        return [];
                    }
                    if (isRoot.call(this)) {
                        return [];
                    }
                    var suffixBids = getSuffixBids.call(this.parent, maxLength - 1);
                    suffixBids[suffixBids.length] = this.bid;
                    return suffixBids;
                };

                var bidSuffix = getSuffixBids.call(this, bidTypes.length);
                var bidTypeSuffix = ko.utils.arrayMap(bidSuffix, function(b) {
                    return b.type;
                });
                return bidTypeSuffix.toString() === bidTypes.toString();
            };

            //checks the suffix of the bidsequence that would be created by adding the given next bid
            var checkNewSuffix = function(bidTypes) {
                var lastBidType = bidTypes.pop();
                return hasSuffixBidTypes.call(this, bidTypes) && lastBidType === bidData.type;
            };

            //The next bid is invalid in case the bidding is finished.
            if (hasSuffixBidTypes.call(this, ["PASS", "PASS", "PASS"]) && length.call(this) >= 4) {
                return false;
            }

            //checks if the last bid respects the bridge bidding rules 
            return checkNewSuffix.call(this, ["SUIT", "DOUBLET"]) || checkNewSuffix.call(this, ["SUIT", "PASS", "PASS", "DOUBLET"]) || checkNewSuffix.call(this, ["DOUBLET", "REDOUBLET"]) || checkNewSuffix.call(this, ["DOUBLET", "PASS", "PASS", "REDOUBLET"]) || checkNewSuffix.call(this, ["PASS"]) || (checkNewSuffix.call(this, ["SUIT"]) && (!bidLevel.call(this) || bidLevel.call(this).lt(bidData)));
        };

        var bidLevel = function() {
            if (isRoot.call(this)) {
                return null;
            }
            if (this.bid.type === "SUIT") {
                return this.bid;
            }
            return bidLevel.call(this.parent);
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

            var index = this.children().length;
            while (index > 0 && this.children()[index - 1].bid.succeeds(child.bid)) {
                index--;
            }

            this.children.splice(index, 0, child);
            return child;
        };

        //methods for converting data to JS object that can be serialized

        var toJSON = function() {
            return {
                id: this.id,
                bid: this.bid,
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
            isOpponentBid: isOpponentBid
        };
    }();


    return module.exports;
});
