define(function(require, exports, module) {
	var bidModule = require("models/bid");

	var BidConvention = module.exports.BidConvention = function (data) {

		this.id = data.id; //GUID TODO: new Guid if data.id not defined
		this.bid = data.bid? new bidModule.Bid(data.bid) : undefined; //Bid
		this.convention = data.convention; //String (TODO: Convention with description, tags, ...)
				
		this.parent = data.parent; //BidConvention
		this.children = []; //Array with BidConventions
		this.addChildren(data.children || []); 
	};
	
	BidConvention.prototype = function(){
		//private members
		var addChildren = function(dataChildren){
			for ( var i = 0; i < dataChildren.length; i++) {
				addChild.call(this, dataChildren[i]);
			}
		}

		var addChild = function(dataChild){
			var child = new BidConvention(dataChild);
			child.parent = this;
			this.children.push(child);
		}

		var toJSON = function() {
		    return {
		    	id : this.id,
		    	bid : this.bid,
		    	convention : this.convention,
		    	children : this.children
		    };
		}
		
		//public members		
		return {
			addChildren : addChildren,
			toJSON : toJSON
		}
	}();


	return module.exports;
});

