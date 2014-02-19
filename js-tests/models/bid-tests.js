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
		suite('Serialization of Bid objects', function() {
		    test('#toJSON for special bids serializes the type', function() {
				var pass = bidModule.createBid({type : "PASS"})
				var dbl = bidModule.createBid({type : "DOUBLET"})
				var redbl = bidModule.createBid({type : "REDOUBLET"})

		        assert.deepEqual(pass.toJSON(), {type : pass.type});
		        assert.deepEqual(dbl.toJSON(), {type : dbl.type});
		        assert.deepEqual(redbl.toJSON(), {type : redbl.type});
		    });
		    test('#toJSON for suit bids serializes suit, level and type', function() {
				var _2spades = bidModule.createBid({type : "SUIT", suit: "SPADES", level : 2})
				var jsonActual = _2spades.toJSON()
				var jsonExpected = {
				    type : _2spades.type,
				    suit : _2spades.suit,
				    level : _2spades.level
				}
		        assert.deepEqual(jsonActual, jsonExpected);
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

		suite('HTML String representation', function() {
			test('#htmlString(): PASS => "pass"',
					function() {
						// arrange
						var pass = bidModule.createBid({type : "PASS"})

						//assert
						assert.equal(pass.htmlString(), "pass");
					});
			test('#htmlString(): DOUBLET => "dbl"',
					function() {
						// arrange
						var dbl = bidModule.createBid({type : "DOUBLET"})

						//assert
						assert.equal(dbl.htmlString(), "dbl");
					});
			test('#htmlString(): REDOUBLET => "redbl"',
					function() {
						// arrange
						var redbl = bidModule.createBid({type : "REDOUBLET"})

						//assert
						assert.equal(redbl.htmlString(), "redbl");
					});
			test('#htmlString(): 1clubs => "1<span>&clubs;</span>"',
					function() {
						// arrange
						var _1clubs = bidModule.createBid({type : "SUIT", suit : "CLUBS", level : 1})

						//assert
						assert.equal(_1clubs.htmlString(), "1<span>&clubs;</span>");
					});
			test('#htmlString(): 2diamonds => "<span style=color:red>&diams;</span>"',
					function() {
						// arrange
						var _2d = bidModule.createBid({type : "SUIT", suit : "DIAMONDS", level : 2})

						//assert
						assert.equal(_2d.htmlString(), "2<span style='color:red'>&diams;</span>");
					});
			test('#htmlString(): 3hearts => "3<span style=color:red>&hearts;</span>"',
					function() {
						// arrange
						var _3h = bidModule.createBid({type : "SUIT", suit : "HEARTS", level : 3})

						//assert
						assert.equal(_3h.htmlString(), "3<span style='color:red'>&hearts;</span>");
					});
			test('#htmlString(): 4spades => "4<span>&spades;</span>"',
					function() {
						// arrange
						var _4s = bidModule.createBid({type : "SUIT", suit : "SPADES", level : 4})

						//assert
						assert.equal(_4s.htmlString(), "4<span>&spades;</span>");
					});
			test('#htmlString(): 7notrump => "7<span>nt</span>"',
					function() {
						// arrange
						var _7nt = bidModule.createBid({type : "SUIT", suit : "NOTRUMP", level : 7})

						//assert
						assert.equal(_7nt.htmlString(), "7<span>nt</span>");
					});
		});
		suite('Equals methode', function() {
			test('#equals(bid): says whether two bid objects represent the same bid', function() {
				var _2h_1 = bidModule.createBid({type : "SUIT", level : 2, suit : "HEARTS"})
				var _2h_2 = bidModule.createBid({type : "SUIT", level : 2, suit : "HEARTS"})
				var _2s_1 = bidModule.createBid({type : "SUIT", level : 2, suit : "SPADES"})
				var _2s_2 = bidModule.createBid({type : "SUIT", level : 2, suit : "SPADES"})
				var redbl_1 = bidModule.createBid({type : "REDOUBLET"})
				var dbl_1 = bidModule.createBid({type : "DOUBLET"})
				var pass_1 = bidModule.createBid({type : "PASS"})
				var redbl_2 = bidModule.createBid({type : "REDOUBLET"})
				var dbl_2 = bidModule.createBid({type : "DOUBLET"})
				var pass_2 = bidModule.createBid({type : "PASS"})
				
				assert.isTrue(_2h_1.equals(_2h_2));
				assert.isTrue(pass_1.equals(pass_2));
				assert.isTrue(dbl_1.equals(dbl_2));
				assert.isTrue(redbl_1.equals(redbl_2));

				assert.isFalse(_2h_1.equals(_2s_1));
				assert.isFalse(_2h_1.equals(pass_1));
				assert.isFalse(pass_1.equals(dbl_1));
				assert.isFalse(dbl_1.equals(redbl_1));
				assert.isFalse(redbl_1.equals(_2h_1));
			    
			})
		});
		suite('Ordering of Bid objects', function() {
			test('#succeeds(bid): "Suit > Redoublet" > "Doublet" > "Pass".',
					function() {
						// arrange
						var suit = bidModule.createBid({type : "SUIT", level : 2, suit : "HEARTS"})
						var redbl = bidModule.createBid({type : "REDOUBLET"})
						var dbl = bidModule.createBid({type : "DOUBLET"})
						var pass = bidModule.createBid({type : "PASS"})

						// assert
						
						//pass
						assert.isTrue(suit.succeeds(pass));
						assert.isFalse(pass.succeeds(suit));
						assert.isTrue(redbl.succeeds(pass));
						assert.isFalse(pass.succeeds(redbl));
						assert.isTrue(dbl.succeeds(pass));
						assert.isFalse(pass.succeeds(dbl));
						assert.isFalse(pass.succeeds(pass));
						
						//dbl
						assert.isTrue(suit.succeeds(dbl));
						assert.isFalse(dbl.succeeds(suit));
						assert.isTrue(redbl.succeeds(dbl));
						assert.isFalse(dbl.succeeds(redbl));
						assert.isFalse(dbl.succeeds(dbl));

						//redbl
						assert.isTrue(suit.succeeds(redbl));
						assert.isFalse(redbl.succeeds(suit));
						assert.isFalse(redbl.succeeds(redbl));

						//suit
						assert.isFalse(suit.succeeds(suit));

			});
			test('#succeeds(bid): "SUIT_1 > SUIT_2 iff SUIT_1 has a higher bidlevel than SUIT_2.',
					function() {
						// arrange
						var _2h = bidModule.createBid({type : "SUIT", level : 2, suit : "HEARTS"})
						var _2nt = bidModule.createBid({type : "SUIT", level : 2, suit : "NOTRUMP"})

						// assert
						assert.isTrue(_2nt.succeeds(_2h));
						assert.isFalse(_2h.succeeds(_2nt));});
		});

	});
});