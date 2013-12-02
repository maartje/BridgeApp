define(function(require, exports, module) {
	var bidConventionModule = require("models/bid-convention");

	var BidSystem = module.exports.BidSystem = function (data) {
		this.id = data.id;
		this.bidRoot = new bidConventionModule.BidConvention(data.bidRoot || {});
		this.bidRootOpponent = new bidConventionModule.BidConvention(data.bidRootOpponent || {});
	};	

	return module.exports;
});
