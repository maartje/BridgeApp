define(function(require, exports, module) {
	var bidConventionModule = require("models/bid-convention");
	var localStorageModule = require("storage/local-storage");

	/**
	 * Saves a bid system model in the local storage 
	 * The object is saved as a JSON String 
	 */
	var save = module.exports.save = function(bidSystem){
		localStorageModule.save(bidSystem.id, bidSystem);
	}
	
	/**
	 * Loads a bid system model from the local storage.
	 */
	var load = module.exports.load = function(bidSystemId){
		return new BidSystem(localStorageModule.load(bidSystemId));
	}

	
	var BidSystem = module.exports.BidSystem = function (data) {
		this.id = data.id;
		this.bidRoot = new bidConventionModule.BidConvention(data.bidRoot || {});
		this.bidRootOpponent = new bidConventionModule.BidConvention(data.bidRootOpponent || {});
	};	

	return module.exports;
});
