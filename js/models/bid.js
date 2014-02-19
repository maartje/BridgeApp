/**
 * Represent bids, i.e. Pass, Doublet, Redoublet, and 1 clubs ... 7 notrump.
 */
define(function(require, exports, module) {

	var createBid = module.exports.createBid = function(data) {
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
		}
	};

	var Bid = {
		succeeds: function(bid) {
			return this.ordering > bid.ordering;
		},
		equals: function(bid) {
			return this.ordering === bid.ordering;
		}
	};


	var Pass = function() {
		this.type = "PASS";
		this.ordering = 0;
	};

	Pass.prototype.succeeds = Bid.succeeds;

	Pass.prototype.equals = Bid.equals;

	Pass.prototype.htmlString = function() {
		return "pass";
	};

	Pass.prototype.toJSON = function() {
		return { type : this.type };
	};

	var Doublet = function() {
		this.type = "DOUBLET";
		this.ordering = 1;
	};

	Doublet.prototype.succeeds = Bid.succeeds;

	Doublet.prototype.equals = Bid.equals;

	Doublet.prototype.htmlString = function() {
		return "dbl";
	};

	Doublet.prototype.toJSON = function() {
		return { type : this.type };
	};

	var Redoublet = function() {
		this.type = "REDOUBLET";
		this.ordering = 2;
	};

	Redoublet.prototype.succeeds = Bid.succeeds;

	Redoublet.prototype.equals = Bid.equals;

	Redoublet.prototype.htmlString = function() {
		return "redbl";
	};
	
	Redoublet.prototype.toJSON = function() {
		return { type : this.type };
	};


	var suitOrdering = {
		"CLUBS": 1,
		"DIAMONDS": 2,
		"HEARTS": 3,
		"SPADES": 4,
		"NOTRUMP": 5
	};

	var BidInSuit = function(data) {
		this.type = "SUIT";
		this.level = data.level;
		this.suit = data.suit;
		if (typeof this.level !== 'number' || this.level % 1 !== 0 || this.level < 1 || 7 < this.level) {
			throw "invalid bid level: " + this.level;
		}
		var regex = new RegExp("^(CLUBS|DIAMONDS|HEARTS|SPADES|NOTRUMP)$");
		if (!regex.test(this.suit)) {
			throw "invalid suit: " + this.suit;
		}
		this.ordering = 2 + suitOrdering[this.suit] + (this.level - 1) * 5;
	};

	BidInSuit.prototype = function() {

		var htmlString = function() {
			switch (this.suit) {
			case "CLUBS":
				return this.level + "<span>&clubs;</span>";
			case "DIAMONDS":
				return this.level + "<span style='color:red'>&diams;</span>";
			case "HEARTS":
				return this.level + "<span style='color:red'>&hearts;</span>";
			case "SPADES":
				return this.level + "<span>&spades;</span>";
			case "NOTRUMP":
				return this.level + "<span>nt</span>";
			default:
				throw "invalid suit: " + this.suit;
			}
		};

		var eq = function(bidInSuit) {
			return this.level === bidInSuit.level && this.suit === bidInSuit.suit;
		};

		var gt = function(bidInSuit) {
			return this.level > bidInSuit.level || (this.level === bidInSuit.level && suitOrdering[this.suit] > suitOrdering[bidInSuit.suit]);
		};

		var lt = function(bidInSuit) {
			return !gt.call(this, bidInSuit) && !eq.call(this, bidInSuit);
		};

		var toJSON = function() {
			return {
				type : this.type,
				suit : this.suit,
				level : this.level
			};
		};

		//public members		
		return {
			gt: gt,
			lt: lt,
			eq: eq,
			htmlString: htmlString,
			toJSON : toJSON
		};
	}();

	//TODO: how to inherit from Bid?!
	BidInSuit.prototype.succeeds = Bid.succeeds;
	BidInSuit.prototype.equals = Bid.equals;

	return module.exports;
});
