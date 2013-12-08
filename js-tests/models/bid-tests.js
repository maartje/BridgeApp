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
			test('#createBid({type: SUIT}): throws an exception in case the bid level is not an integer between 1 and 7',
					function() {
						//assert: not throw
						assert.doesNotThrow(function(){bidModule.createBid({type : "SUIT", suit : "HEARTS", level : 1});});
						assert.doesNotThrow(function(){bidModule.createBid({type : "SUIT", suit : "HEARTS", level : 7});});
		
						// assert
						assert.throw(function(){bidModule.createBid({type : "SUIT", suit : "HEARTS", level : 0});}, 'invalid bid level: 0');
						assert.throw(function(){bidModule.createBid({type : "SUIT", suit : "HEARTS", level : 8});}, 'invalid bid level: 8');
						assert.throw(function(){bidModule.createBid({type : "SUIT", suit : "HEARTS", level : 2.5});}, 'invalid bid level: 2.5');
						assert.throw(function(){bidModule.createBid({type : "SUIT", suit : "HEARTS", level : "hoi"});}, 'invalid bid level: hoi');
					});
			test('#createBid({type: SUIT}): throws an exception in case the bid suit is not CLUBS, DIAMONDS, HEARTS, SPADES or NOTRUMP',
					function() {
						//assert: not throw
						assert.doesNotThrow(function(){bidModule.createBid({type : "SUIT", suit : "CLUBS", level : 2});});
						assert.doesNotThrow(function(){bidModule.createBid({type : "SUIT", suit : "DIAMONDS", level : 3});});
						assert.doesNotThrow(function(){bidModule.createBid({type : "SUIT", suit : "HEARTS", level : 4});});
						assert.doesNotThrow(function(){bidModule.createBid({type : "SUIT", suit : "SPADES", level : 5});});
						assert.doesNotThrow(function(){bidModule.createBid({type : "SUIT", suit : "NOTRUMP", level : 6});});
		
						// assert
						assert.throw(function(){bidModule.createBid({type : "SUIT", suit : " HEARTS", level : 1});}, 'invalid suit:  HEARTS');
						assert.throw(function(){bidModule.createBid({type : "SUIT", suit : "HEARTS ", level : 1});}, 'invalid suit: HEARTS ');
						assert.throw(function(){bidModule.createBid({type : "SUIT", suit : "XX", level : 1});}, 'invalid suit: XX');
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
						assert.isTrue(_2spades.gt({type : "SUIT", suit: "CLUBS", level : 2}));
					});
			test('#lt(bidInSuit): returns true if the current bid has a lower level than the bid passed as an argument',
					function() {
						// arrange
						var _2spades = bidModule.createBid({type : "SUIT", suit: "SPADES", level : 2})
						var _3clubs = bidModule.createBid({type : "SUIT", suit: "CLUBS", level : 3})

						// assert
						assert.isFalse(_3clubs.lt(_2spades));
						assert.isTrue(_2spades.lt(_3clubs));
						assert.isTrue(_2spades.lt({type : "SUIT", suit: "CLUBS", level : 3}));
					});
			test('#lt(bidInSuit): returns true if the current bid has the same level and a lower suit than the bid passed as an argument',
					function() {
						// arrange
						var _2spades = bidModule.createBid({type : "SUIT", suit: "SPADES", level : 2})
						var _2clubs = bidModule.createBid({type : "SUIT", suit: "CLUBS", level : 2})

						// assert
						assert.isTrue(_2clubs.lt(_2spades));
						assert.isTrue(_2clubs.lt({type : "SUIT", suit: "SPADES", level : 2}));
						assert.isFalse(_2spades.lt(_2clubs));
					});
			test('#eq(bidInSuit): returns true iff the current bid has the same level and the same suit as the bid passed as an argument',
					function() {
						// arrange
						var _2spades = bidModule.createBid({type : "SUIT", suit: "SPADES", level : 2})
						var _2clubs = bidModule.createBid({type : "SUIT", suit: "CLUBS", level : 2})
						var _3clubs = bidModule.createBid({type : "SUIT", suit: "CLUBS", level : 3})

						// assert
						assert.isTrue(_2clubs.eq(_2clubs));
						assert.isTrue(_2clubs.eq({type : "SUIT", suit: "CLUBS", level : 2}));
						assert.isFalse(_2spades.eq(_2clubs));
						assert.isFalse(_3clubs.eq(_2clubs));
					});
		});
	});
});