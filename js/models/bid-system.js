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
	    var bidsystemJS = localStorageModule.load(bidSystemId);
	    if(!bidsystemJS){
	        return null;
	    }
		return new BidSystem(bidsystemJS);
	}

	
	var BidSystem = module.exports.BidSystem = function (data) {
		this.id = data.id;
		this.bidRoot = ko.observable(new bidConventionModule.BidConvention(data.bidRoot || {}));
		this.bidRootOpponent = ko.observable(new bidConventionModule.BidConvention(data.bidRootOpponent || {}));
		this.selectedConventions = typeof data.selectedConventions != 'undefined'? ko.observableArray(data.selectedConventions) : ko.observableArray([]);
		this.clippedConventions = typeof data.clippedConventions != 'undefined'? ko.observableArray(data.clippedConventions) : ko.observableArray([]);
		this.selectedRoot = data.isDealer === false? ko.observable(this.bidRootOpponent()) : ko.observable(this.bidRoot());
		this.isCutAction = false;

		//TODO: Mag weg!
		this.consoleLog = function(){
			console.log(this);
			console.log("         root", this.bidRoot().children());			
			console.log("opponent root", this.bidRootOpponent().children());
			console.log("selected root", this.selectedRoot().children());
			console.log("selectedConventions", this.selectedConventions());
			console.log("clippedConventions", this.clippedConventions());
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

		//TODO: conditions when paste action is valid for all pairs clipped/selected 
		var paste = function(){
			var that = this;
			ko.utils.arrayForEach(that.clippedConventions(), function(clippedBC) {
				ko.utils.arrayForEach(that.selectedConventions(), function(selectedBC) {
					if (that.isCutAction) {
						clippedBC.parent.children.remove(clippedBC);
					}
					selectedBC.createChild(clippedBC.toJSON());
				});
			});
		};
		
		var copySelection = function(){
			this.isCutAction = false;
			clipSelection.call(this);
		};

		var cutSelection = function(){
			this.isCutAction = true;
			clipSelection.call(this);
		};

		var clipSelection = function(){
			var that = this;
			that.clippedConventions.removeAll();
			ko.utils.arrayForEach(that.selectedConventions(), function(bc) {
				that.clippedConventions.push(bc);
			});
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
			console.log(bidconvention);
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
		
		var saveToLocalStorage = function() {
	        localStorageModule.save(this.id, this);
		}

		
		//public members		
		return {
			toggleIsDealer : toggleIsDealer,
			toJSON : toJSON,
			clearSelection : clearSelection,
			select : select,
			addToSelection : addToSelection,
			removeFromSelection : removeFromSelection,
			isSelected : isSelected,
			setSelectedRoot : setSelectedRoot,
			copySelection : copySelection,
			cutSelection : cutSelection,
			paste : paste,
			saveToLocalStorage : saveToLocalStorage
		};
	}();

	return module.exports;
});
