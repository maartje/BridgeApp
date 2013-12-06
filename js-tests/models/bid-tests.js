define(function(require) {
	var assert = require('chai').assert;
	var bidModule = require("models/bid");

	suite('Bid', function() {

		setup(function() {
			// ...
		});

		suite('Construction of Bid objects', function() {
			test('#createBid({type : "PASS"}): creates a bid with type "PASS"',
				function() {
					// arrange
					var pass = bidModule.createBid({type : "PASS"})

					// assert
					assert.strictEqual(pass.type, "PASS");
				});
			test('#createBid({type : "DOUBLET"}): creates a bid with type "DOUBLET"',
					function() {
						// arrange
						var dbl = bidModule.createBid({type : "DOUBLET"})

						// assert
						assert.strictEqual(dbl.type, "DOUBLET");
					});
			test('#createBid({type : "REDOUBLET"}): creates a bid with type "REDOUBLET"',
					function() {
						// arrange
						var redbl = bidModule.createBid({type : "REDOUBLET"})

						// assert
						assert.strictEqual(redbl.type, "REDOUBLET");
					});
			test('#createBid({type : "SUIT", suit: "SPADES", level : 2}): creates a bid with give type, level and suit',
					function() {
						// arrange
						var _2spades = bidModule.createBid({type : "SUIT", suit: "SPADES", level : 2})

						// assert
						assert.strictEqual(_2spades.type, "SUIT");
						assert.strictEqual(_2spades.level, 2);
						assert.strictEqual(_2spades.suit, "SPADES");
					});
			test('#createBid({type : "XXX"}): throws an exception',
					function() {
						// assert
						assert.throw(function(){bidModule.createBid({type : "XX"});}, "unvalid bid type: XX");
					});
		});
		suite('BidInSuit methods', function() {
			test('#gt(bidInSuit): returns true if the current bid has a higher level than the bid passed as an argument',
					function() {
						// arrange
						var _2spades = bidModule.createBid({type : "SUIT", suit: "SPADES", level : 2})
						var _3clubs = bidModule.createBid({type : "SUIT", suit: "CLUBS", level : 3})

						// assert
						assert.isTrue(_3clubs.gt(_2spades));
						assert.isFalse(_2spades.gt(_3clubs));
					});
			test('#gt(bidInSuit): returns true if the current bid has the same level and a higher suit than the bid passed as an argument',
					function() {
						// arrange
						var _2spades = bidModule.createBid({type : "SUIT", suit: "SPADES", level : 2})
						var _2clubs = bidModule.createBid({type : "SUIT", suit: "CLUBS", level : 2})

						// assert
						assert.isFalse(_2clubs.gt(_2spades));
						assert.isTrue(_2spades.gt(_2clubs));
					});
		});
	});
});