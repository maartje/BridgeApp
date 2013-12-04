define(function(require, exports, module) {
	var bidModule = require("models/bid");
	var ko = require("knockout");

	var BidConvention = module.exports.BidConvention = function (data) {

		this.id = data.id; //GUID TODO: new Guid if data.id not defined
		this.bid = data.bid? bidModule.createBid(data.bid) : undefined; //Bid
		this.convention = data.convention; //String (TODO: Convention with description, tags, ...)
				
		this.parent = data.parent; //BidConvention
		this.children = []; //Array with BidConventions
		this.addChildren(data.children || []); 
	};
	
	BidConvention.prototype = function(){
		
		//helper methods
		var isRoot = function(){
			return !this.parent;
		};
		
		var length = function(){
			if(isRoot.call(this)){
				return 0;
			}
			return 1 + length.call(this.parent);
		};
		
		//methods for validation

		var isValidChildBid = function(bid){
			var child = createChild.call(this, {bid : bid});
			return isValidBidSequenceHead.call(child);
		};

		var isValidBidSequence = function(){
			return isValidBidSequenceHead.call(this) && 
			       (isRoot.call(this) || isValidBidSequence.call(this.parent));
		};
		
		var isValidBidSequenceHead = function(){
			if (isRoot.call(this)){
				return true; //empty sequence is valid
			}
			if (hasSuffixBidTypes.call(this.parent, ["PASS", "PASS", "PASS"]) && length.call(this) > 4){
				return false; //bidding is finished
			}
			
			return hasSuffixBidTypes.call(this, ["SUIT", "DOUBLET"]) ||
			       hasSuffixBidTypes.call(this, ["SUIT", "PASS", "PASS","DOUBLET"]) ||
			       hasSuffixBidTypes.call(this, ["DOUBLET", "REDOUBLET"]) ||
			       hasSuffixBidTypes.call(this, ["DOUBLET", "PASS", "PASS", "REDOUBLET"]) ||
			       hasSuffixBidTypes.call(this, ["PASS"]) ||
			       (hasSuffixBidTypes.call(this, ["SUIT"]) && (!bidLevel.call(this.parent) || bidLevel.call(this).gt(bidLevel.call(this.parent))));
		};
		
		var bidLevel = function(){
			if (isRoot.call(this)){
				return null;
			}
			if (this.bid.type === "SUIT"){
				return this.bid;
			}
			return bidLevel.call(this.parent);
		};

		var hasSuffixBidTypes = function(bidTypes){
			var bidSuffix = getSuffixBids.call(this, bidTypes.length);			
			var bidTypeSuffix = ko.utils.arrayMap(bidSuffix, function(b){
				return b.type;
			});
			return bidTypeSuffix.toString() === bidTypes.toString();
		};

		var getSuffixBids = function(maxLength){
			if (maxLength === 0){
				return [];
			}
			if (isRoot.call(this)){
				return [];
			}
			var suffixBidsOfParent = getSuffixBids.call(this.parent, maxLength - 1);
			suffixBidsOfParent[suffixBidsOfParent.length] = this.bid; 
			return suffixBidsOfParent;
		};
		
		//methods that modify the tree structure
		
		var addChildren = function(dataChildren){
			for ( var i = 0; i < dataChildren.length; i++) {
				createChild.call(this, dataChildren[i]);
			}
			return this;
		};

		var createChild = function(dataChild){
			var child = new BidConvention(dataChild);
			child.parent = this;
			this.children.push(child);
			return child;
		};

		
		//methods for converting data to JS object that can be serialized
		
		var toJSON = function() {
		    return {
		    	id : this.id,
		    	bid : this.bid,
		    	convention : this.convention,
		    	children : this.children
		    };
		};
		
		//public members		
		return {
			addChildren : addChildren,
			createChild : createChild,
			toJSON : toJSON,
			length : length,
			isValidBidSequence : isValidBidSequence
		};
	}();


	return module.exports;
});

