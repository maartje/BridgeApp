define(function(require, exports, module) {

	var createBid = module.exports.createBid = function (data) {
		switch (data.type) {
		case "PASS":
			return new Pass();
		case "DOUBLET":
			return new Doublet();
		case "REDOUBLET":
			return new Redoublet();
		case "SUIT":
			return new BidInSuit(data);
		default:
			throw "unvalid bid type: " + data.type;
			break; //TODO throw exception
		}
	};	

	var Pass = function () {
		this.type = "PASS";
	};	

	var Doublet = function () {
		this.type = "DOUBLET";
	};	

	var Redoublet = function () {
		this.type = "REDOUBLET";
	};	
	
	var BidInSuit = function (data) {
		this.type = "SUIT";
		this.level = data.level;
		this.suit = data.suit;
	};	

	BidInSuit.prototype = function(){
		var suitOrdering = {
			"CLUBS" : 1,
			"DIAMONDS" : 2,
			"HEARTS" : 3,
			"SPADES" : 4,
			"NOTRUMP" : 5
		};

		var gt = function(bidInSuit){
			return this.level > bidInSuit.level ||
			       (this.level === bidInSuit.level && suitOrdering[this.suit] > suitOrdering[bidInSuit.suit]);
		};
		
		//public members		
		return {
			gt : gt
		};
	}();
	
	return module.exports;
});

