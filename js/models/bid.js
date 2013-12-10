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
			break;
		}
	};	
	
	var Bid = {
		succeeds: function(bid) {
			return this.ordering > bid.ordering;
		}
	};


	var Pass = function () {
		this.type = "PASS";
		this.ordering = 0;
	};	
	
	Pass.prototype = Bid;

	var Doublet = function () {
		this.type = "DOUBLET";
		this.ordering = 1;
	};	
	
	Doublet.prototype = Bid;


	var Redoublet = function () {
		this.type = "REDOUBLET";
		this.ordering = 2;
	};	

	Redoublet.prototype = Bid;

	var suitOrdering = {
		"CLUBS" : 1,
		"DIAMONDS" : 2,
		"HEARTS" : 3,
		"SPADES" : 4,
		"NOTRUMP" : 5
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
		
		this.ordering = 2 + suitOrdering[this.suit] + (this.level - 1)*5;

	};	

	BidInSuit.prototype = function(){

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
	
	//TODO: how to inherit from Bid?!
	BidInSuit.prototype.succeeds = Bid.succeeds;
	
	return module.exports;
});

