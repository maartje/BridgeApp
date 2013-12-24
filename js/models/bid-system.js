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
		this.selectedConventions = typeof data.selectedConventions != 'undefined'? ko.observableArray(data.selectedConventions) : ko.observableArray([]);
		this.selectedRoot = data.isDealer === false? ko.observable(this.bidRootOpponent()) : ko.observable(this.bidRoot());

		//TODO: Mag weg!
		this.consoleLog = function(){
			console.log(this);
			console.log("         root", this.bidRoot().children());			
			console.log("opponent root", this.bidRootOpponent().children());
			console.log("selected root", this.selectedRoot().children());
			console.log("selectedConventions", this.selectedConventions());
		};
	};	
	
	BidSystem.prototype = function(){

		//ui methods

		var isSelected = function(bidconvention){
			return this.selectedConventions.indexOf(bidconvention) >= 0;
		};

		var clearSelection = function(){
			this.selectedConventions.removeAll();
		};

		var select = function(bidconvention){
			this.selectedConventions.removeAll();
			this.selectedConventions.push(bidconvention);
		};

		var addToSelection = function(bidconvention){
			if (this.selectedConventions.indexOf(bidconvention) === -1){
				this.selectedConventions.push(bidconvention);
			}
		};

		var removeFromSelection = function(bidconvention){
			this.selectedConventions.remove(bidconvention);
		};
		
		var setSelectedRoot = function(bidconvention){
			this.selectedRoot(bidconvention);
		};

		var toggleIsDealer = function(){
			if (this.selectedRoot().getRoot() === this.bidRoot()){ 
				this.selectedRoot(this.bidRootOpponent());
			}
			else {
				this.selectedRoot(this.bidRoot());
			}
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
			toJSON : toJSON,
			clearSelection : clearSelection,
			select : select,
			addToSelection : addToSelection,
			removeFromSelection : removeFromSelection,
			isSelected : isSelected,
			setSelectedRoot : setSelectedRoot
		};
	}();

	return module.exports;
});
