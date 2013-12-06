define(function(require) {
	var assert = require('chai').assert;
	var bcModule = require("models/bid-convention");
	var bidModule = require("models/bid");

	suite('BidConvention', function() {

		setup(function() {
			// ...
		});

		suite('Construction of BidConvention objects', function() {
			// arrange
			var bcRootId = "root_id";
			var bcChild01Id = 2;
			var bcChild01Convention = "info";
			var bcChild01Bid = {
				type : "DOUBLET",
			};
			var bcData = {
				id : bcRootId,
				children : [{
					id : 1,
					bid : {
						type : "SUIT",
						suit : "CLUBS", 
						level : 1
					},
					convention : "12-19 punten. Vanaf een 3 kaart.",
					children : [{
						id : 2,
						bid : {
							type : "PASS"
						},
						convention : "bla",
						children : []}
					, { id : bcChild01Id,
						bid : bcChild01Bid,
						convention : bcChild01Convention}
					, { id : 4,
						bid : {
							type : "SUIT",
							suit : "SPADES", 
							level : 1
						},
						convention : "5+ schoppen, vanaf 5 punten."}]}]}
			var bcRoot = new bcModule.BidConvention(bcData);
			var bcChild0 = bcRoot.children[0];
			var bcChild01 = bcChild0.children[1];

			test('#BidSequence(data): creates a tree structure with parent/child relations',
					function() {
			
						// assert
						assert.isUndefined(bcRoot.parent);
						assert.lengthOf(bcRoot.children, 1);
						assert.strictEqual(bcRoot.children[0], bcChild0);
						
						assert.strictEqual(bcChild0.parent, bcRoot);
						assert.lengthOf(bcChild0.children, 3);
						assert.strictEqual(bcChild0.children[1], bcChild01);
						
						assert.strictEqual(bcChild01.parent, bcChild0);
						assert.lengthOf(bcChild01.children, 0);
					});

			test('#BidSequence(data): recursively sets id, bid, and convention properties',
				function() {
					// assert
					assert.strictEqual(bcRoot.id, bcRootId);
					assert.isUndefined(bcRoot.convention);
					assert.isUndefined(bcRoot.bid);

					assert.strictEqual(bcChild01.id, bcChild01Id);
					assert.strictEqual(bcChild01.convention, bcChild01Convention);
					assert.deepEqual(bcChild01.bid, bidModule.createBid(bcChild01Bid));
				});
		});
	});
});