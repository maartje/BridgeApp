define(function(require) {
	var assert = require('chai').assert;
	var bidSystemModule = require("models/bid-system");

	suite('BidSystem', function() {
		var bidSystemData = {
			id : "maartje_wim",
			bidRoot : {
				id : "root_id",
				children : [{
					id : 1,
					bid : {
						type : "SUIT",
						suit : "NOTRUMP", 
						level : 1
					},
					convention : "12-19 punten. Vanaf een 3 kaart.",
					children : [{
						id : 2,
						bid : {
							type : "PASS",
						},
						convention : "",
						children : []}
					, { id : 3,
						bid : {
							type : "DOUBLET"
						},
						convention : "informatie doublet"}
					, { id : 4,
						bid : {
							type : "SUIT",
							suit : "SPADES", 
							level : 2
						},
						convention : "volgbod"}]}]}
		};

		setup(function() {
			// ...
		});

		suite('Construction of BidSystem objects', function() {
			test('#BidSystem(data): constructs a bidsystem from json data, setting the properties: id, bidRoot, bidRootOpponent.',
				function() {
					// arrange
					var bidsystem = new bidSystemModule.BidSystem(bidSystemData);

					// assert
					assert.strictEqual(bidsystem.id, "maartje_wim");
					assert.strictEqual(bidsystem.bidRoot.id, "root_id");
					assert.isDefined(bidsystem.bidRootOpponent);
			});
		});
		suite('Local storage of BidSystem objects', function() {
			test('#save, #load: saves and loads a bid system in and from the local storage.',
				function() {
					// arrange
					var bidSystemId = bidSystemData.id;
					localStorage.clear();
					assert.isNull(localStorage.getItem(bidSystemId));
					
					var bsBefore = new bidSystemModule.BidSystem(bidSystemData);
					bidSystemModule.save(bsBefore);
					var bsAfter = bidSystemModule.load(bidSystemId);
					
//					console.log(bsBefore);
//					console.log(bsAfter);

					// assert
					assert.isNotNull(localStorage.getItem(bidSystemId));
					assert.equal(JSON.stringify(bsBefore), JSON.stringify(bsAfter));
					localStorage.clear();
			});
		});
	});
});