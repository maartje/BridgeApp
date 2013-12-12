define(function(require, exports, module) {
	var bidModule = require("models/bid");
	var ko = require("knockout");

	var BidConvention = module.exports.BidConvention = function (data) {
		if(!data.parent && data.bid){
			throw 'A newly created bid system must contain a root node for which the bid is "undefined"';
		}
		this.id = data.id; //GUID TODO: new Guid if data.id not defined
		this.bid = data.bid? bidModule.createBid(data.bid) : undefined; //Bid
		this.convention = data.convention; //String (TODO: Convention with description, tags, ...)
				
		this.parent = data.parent; //BidConvention
		this.children = []; //Array with BidConventions		
		this.addChildren(data.children || []); 
		
		if (typeof data.isOpen != 'undefined') {
			this.isOpen = ko.observable(data.isOpen);
		}
		else {
			this.isOpen = ko.observable(typeof this.parent == 'undefined');
		}

		this.jstreeStyle = ko.computed(function() {
			var style = "";
			if(this.children.length === 0){
				style =  "jstree-leaf";
			}
			else if(this.isOpen()){
				style = "jstree-open";
			}
			else {
				style = "jstree-closed";
			}
//			if(!this.parent || this.parent.children[this.parent.children.length - 1] === this){
//				console.log("this: ", this);
//				if(this.parent)
//					console.log(this.parent.children);
//				style = style + " jstree-last";
//			}
			return style;
	    }, this);		
	};
	
	BidConvention.prototype = function(){

		//view methods

		var toggleOpenClose = function(){
			this.isOpen(!this.isOpen());
		};

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
		
		var isValidBidSequence = function(){
			return (isRoot.call(this) && !this.bid) ||
			       (isValidChildBid.call(this.parent, this.bid) && isValidBidSequence.call(this.parent));
		};

		var isValidChildBid = function(bidData){
			//compares the bid types at the end of the bidsequence
			var hasSuffixBidTypes = function(bidTypes){
				var getSuffixBids = function(maxLength){
					if (maxLength === 0){
						return [];
					}
					if (isRoot.call(this)){
						return [];
					}
					var suffixBids = getSuffixBids.call(this.parent, maxLength - 1);
					suffixBids[suffixBids.length] = this.bid;
					return suffixBids;
				};

				var bidSuffix = getSuffixBids.call(this, bidTypes.length);
				var bidTypeSuffix = ko.utils.arrayMap(bidSuffix, function(b){
					return b.type;
				});
				return bidTypeSuffix.toString() === bidTypes.toString();
			};
			
			//checks the suffix of the bidsequence that would be created by adding the given next bid
			var checkNewSuffix = function(bidTypes){
				var lastBidType = bidTypes.pop();
				return hasSuffixBidTypes.call(this, bidTypes) && lastBidType === bidData.type;
			};

			//The next bid is invalid in case the bidding is finished.
			if (hasSuffixBidTypes.call(this, ["PASS", "PASS", "PASS"]) && length.call(this) >= 4){
				return false; 
			}
			
			//checks if the last bid respects the bridge bidding rules 
			return checkNewSuffix.call(this, ["SUIT", "DOUBLET"]) ||
			       checkNewSuffix.call(this, ["SUIT", "PASS", "PASS","DOUBLET"]) ||
			       checkNewSuffix.call(this, ["DOUBLET", "REDOUBLET"]) ||
			       checkNewSuffix.call(this, ["DOUBLET", "PASS", "PASS", "REDOUBLET"]) ||
			       checkNewSuffix.call(this, ["PASS"]) ||
			       (checkNewSuffix.call(this, ["SUIT"]) && (!bidLevel.call(this) || bidLevel.call(this).lt(bidData)));
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
		
		//methods that modify the tree structure
		
		var addChildren = function(dataChildren){
			for ( var i = 0; i < dataChildren.length; i++) {
				createChild.call(this, dataChildren[i]);
			}
			return this;
		};

		var createChild = function(dataChild){
			if(!isValidChildBid.call(this, dataChild.bid)){
				throw "unvalid bid: " + JSON.stringify(dataChild.bid);
				//TODO: "unvalid bidsequence: 2c - 2r - 1s"
			}
			dataChild.parent = this;
			var child = new BidConvention(dataChild);
			
			var index = this.children.length;
			while(index > 0 && this.children[index-1].bid.succeeds(child.bid)){
				index --;
			}
			
			this.children.splice(index, 0, child);
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
			createChild : createChild,
			addChildren : addChildren,
			toJSON : toJSON,
			isValidChildBid : isValidChildBid,
			toggleOpenClose : toggleOpenClose
		};
	}();


	return module.exports;
});

