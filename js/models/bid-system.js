define(function(require, exports, module) {
	var bidConventionModule = require("models/bid-convention");
	var localStorageModule = require("storage/local-storage");
	var ko = require("knockout");

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
		this.bidRoot = ko.observable(new bidConventionModule.BidConvention(data.bidRoot || {}));
		this.bidRootOpponent = ko.observable(new bidConventionModule.BidConvention(data.bidRootOpponent || {}));
		this.isDealer = typeof data.isDealer != 'undefined'? ko.observable(data.isDealer) : ko.observable(true);
		
		this.selectedRoot = ko.computed(function() {
			if (this.isDealer()){
				return this.bidRoot();
			}
			return this.bidRootOpponent();
		}, this);
		
		//TODO: Mag weg!
		this.consoleLog = function(){
			console.log(this);
			console.log("         root", this.bidRoot().children());			
			console.log("opponent root", this.bidRootOpponent().children());
			console.log("selected root", this.selectedRoot().children());
		};
	};	
	
	BidSystem.prototype = function(){

		//view methods

		var toggleIsDealer = function(){
			this.isDealer(!this.isDealer());
		};
		
		//methods for converting data to JS object that can be serialized
		
		var toJSON = function() {
		    return {
		    	id : this.id,
		    	bidRoot : this.bidRoot(),
		    	bidRootOpponent : this.bidRootOpponent()
		    };
		};

		
		//public members		
		return {
			toggleIsDealer : toggleIsDealer,
			toJSON : toJSON
		};
	}();

	return module.exports;
});
