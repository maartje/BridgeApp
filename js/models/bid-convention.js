define(function(require, exports, module) {

	var BidConvention = module.exports.BidConvention = function (data) {
		var that = this;

		that.addChildren = function(dataChildren){
			for ( var i = 0; i < dataChildren.length; i++) {
				var child = new BidConvention(dataChildren[i]);
				child.parent = that;
				that.children.push(child);
			}
		}
		
		that.toJSON = function() {
		    return {
		    	id : that.id,
		    	bid : that.bid,
		    	convention : that.convention,
		    	children : that.children
		    };
		}


		that.parent = data.parent || null; //BidConvention
		that.children = []; //Array with BidConventions
		that.addChildren(data.children || []); 

		that.id = data.id; //GUID TODO: new Guid if data.id not defined
		that.bid = data.bid; //Bid
		that.convention = data.convention || ""; //String (TODO: Convention with description, tags, ...)
				
	};
	

	return module.exports;
});

