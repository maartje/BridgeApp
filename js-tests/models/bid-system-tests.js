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
					assert.strictEqual(bidsystem.bidRoot().id, "root_id");
					assert.isDefined(bidsystem.bidRootOpponent());
			});
			test('#BidSystem(data): by default, isDealer is set to true.',
					function() {
						// arrange
						var bidsystem = new bidSystemModule.BidSystem(bidSystemData);

						// assert
						assert.isTrue(bidsystem.isDealer());
				});
			test('#BidSystem(data): isDealer is set from data if property isDealer is defined.',
					function() {
						// arrange
						var bidsystem1 = new bidSystemModule.BidSystem({isDealer : true});
						var bidsystem2 = new bidSystemModule.BidSystem({isDealer : false});

						// assert
						assert.isTrue(bidsystem1.isDealer());
						assert.isFalse(bidsystem2.isDealer());
				});
		});
		suite('Functionality BidSystem objects', function() {
			test('#toggleIsDealer: toggles the dealer member.',
					function() {
						// arrange
						var bidsystem = new bidSystemModule.BidSystem(bidSystemData);
						var isDealer1 = bidsystem.isDealer()
						
						//act
						bidsystem.toggleIsDealer();
						var isDealer2 = bidsystem.isDealer()
						bidsystem.toggleIsDealer();
						var isDealer3 = bidsystem.isDealer()
						
						// assert
						assert.equal(isDealer1, !isDealer2);
						assert.equal(isDealer1, isDealer3);
					});
			test('#selectedRoot: depends on isDealer.',
					function() {
						// arrange
						var bidsystem = new bidSystemModule.BidSystem(bidSystemData);

						// assert
						bidsystem.isDealer(true);
						assert.equal(bidsystem.selectedRoot(), bidsystem.bidRoot());
						bidsystem.isDealer(false);
						assert.equal(bidsystem.selectedRoot(), bidsystem.bidRootOpponent());
					});
			
		});
		suite('Serialization of BidSystem objects', function() {
			test('#toJSON: the following properties are serialized: id, bidRoot, bidRootOpponent.',
					function() {
						// arrange
						var bidsystem = new bidSystemModule.BidSystem(bidSystemData);
						
						//act
						var jsonString = JSON.stringify(bidsystem);
						var json = JSON.parse(jsonString);
						
						// assert
						assert.equal(json.id, bidsystem.id);
						assert.isDefined(json.bidRoot);
						assert.isDefined(json.bidRootOpponent);
						assert.isUndefined(json.isDealer);
						assert.isUndefined(json.selectedRoot);
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
					
					// assert
					assert.isNotNull(localStorage.getItem(bidSystemId));
					assert.equal(JSON.stringify(bsBefore), JSON.stringify(bsAfter));
					localStorage.clear();
			});
		});
	});
});