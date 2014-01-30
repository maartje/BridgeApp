define(function(require, exports, module) {
	var bidConventionModule = require("models/bid-convention");
	var bidModule = require("models/bid");
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

		// methods that check or manipulate the collection of selected bids

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
		

		// methods that check or manipulate the collection of clipped bids
		
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
		

		// methods that manipulate the tree structure

        //TODO: test cases
        var validatePaste = function(){
			var that = this;
		    var invalidConventions = [];
		    ko.utils.arrayForEach(that.clippedConventions(), function(clippedBC) {
				ko.utils.arrayForEach(that.selectedConventions(), function(selectedBC) {
				    //TODO: clone
				    clippedBC.parent = selectedBC;
        			invalidConventions.push.apply(invalidConventions, clippedBC.collectInvalidBids());
				});
			});
			//TODO: strip invalid conventions?
			console.log(invalidConventions);
        };
        
		var paste = function(){
    		//TODO condition paste action is valid for all pairs clipped/selected 
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
		
		var deleteSelection = function(){
			ko.utils.arrayForEach(this.selectedConventions(), function(bc) {
				bc.remove();
			});
			clearSelection.call(this);
		};

		var createNew = function(){
			//TODO: no bidding ended in selection
			ko.utils.arrayForEach(this.selectedConventions(), function(bc) {
			    var passData = {bid : {type : "PASS"}};
				bc.createChild(passData); //TODO: edit-mode
			});
		};

		//methods that affect the view without affecting the data

		var setSelectedRoot = function(){
		    //TODO condition: only 1 bc in selection
			var bidconvention = this.selectedConventions()[0];
			this.selectedConventions([]);
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


		//methods for persistence of the bid system data
		
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
			saveToLocalStorage : saveToLocalStorage,
			validatePaste : validatePaste,
			createNew : createNew,
			deleteSelection : deleteSelection
		};
	}();

	return module.exports;
});
