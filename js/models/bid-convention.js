define(function(require, exports, module) {

	var BidConvention = module.exports.BidConvention = function (data) {
		var that = this;
		that.id = data.id; //GUID TODO: new Guid if data.id not defined
		that.parent = data.parent; //BidConvention
		that.bid = data.bid; //Bid
		that.convention = data.convention; //String (TODO: Convention with description, tags, ...)
		that.isOpponentBid = data.isOpponentBid; //boolean, must be opposite of parent.isOpponentBid
	};	

	return module.exports;
});

