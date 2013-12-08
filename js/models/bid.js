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
		if(this.level < 1 || 7 < this.level || typeof this.level !== 'number' || this.level % 1 !== 0){
			throw "invalid bid level: " + this.level;
		}
		var regex = new RegExp("^(CLUBS|DIAMONDS|HEARTS|SPADES|NOTRUMP)$");
		if(!regex.test(this.suit)){
			throw "invalid suit: " + this.suit;			
		}
	};	

	BidInSuit.prototype = function(){
		var suitOrdering = {
			"CLUBS" : 1,
			"DIAMONDS" : 2,
			"HEARTS" : 3,
			"SPADES" : 4,
			"NOTRUMP" : 5
		};

		var eq = function(bidInSuit){
			return this.level === bidInSuit.level && this.suit === bidInSuit.suit;
		};

		var gt = function(bidInSuit){
			return this.level > bidInSuit.level ||
			       (this.level === bidInSuit.level && suitOrdering[this.suit] > suitOrdering[bidInSuit.suit]);
		};
		
		var lt = function(bidInSuit){
			return !gt.call(this, bidInSuit) && !eq.call(this, bidInSuit);
		};
		
		//public members		
		return {
			gt : gt,
			lt : lt,
			eq : eq
		};
	}();
	
	return module.exports;
});

