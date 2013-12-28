define(function(require) {
	var assert = require('chai').assert;
	var bidSystemModule = require("models/bid-system");
	
	/*global suite setup test*/

	suite('BidSystem', function() {
		var bidSystemData = {
			id : "maartje_wim",
			bidRoot : {
				id : "root_id",
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
						convention : "volgbod"}]},
				{
					id : 1,
					bid : {
						type : "SUIT",
						suit : "HEARTS", 
						level : 1
					}
				},
				{
					id : 1,
					bid : {
						type : "SUIT",
						suit : "SPADES", 
						level : 1
					}
				}
				]}
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
			test('#BidSystem(data): by default, selected root is bidroot.',
					function() {
						// arrange
						var bidsystem = new bidSystemModule.BidSystem(bidSystemData);

						// assert
						assert.equal(bidsystem.selectedRoot(), bidsystem.bidRoot());
				});
			test('#BidSystem(data): selectedRoot is set from data if property isDealer is defined.',
					function() {
						// arrange
						var bidsystem1 = new bidSystemModule.BidSystem({isDealer : true});
						var bidsystem2 = new bidSystemModule.BidSystem({isDealer : false});

						// assert
						assert.equal(bidsystem1.selectedRoot(), bidsystem1.bidRoot());
						assert.equal(bidsystem2.selectedRoot(), bidsystem2.bidRootOpponent());
				});
			test('#BidSystem(data): by default, selectedConventions is set as an empty array.',
					function() {
						// arrange
						var bidsystem = new bidSystemModule.BidSystem(bidSystemData);

						// assert
						assert.lengthOf(bidsystem.selectedConventions(), 0);
				});
			test('#BidSystem(data): by default, clippedConventions is set as an empty array.',
					function() {
						// arrange
						var bidsystem = new bidSystemModule.BidSystem(bidSystemData);

						// assert
						assert.lengthOf(bidsystem.clippedConventions(), 0);
				});
			test('#BidSystem(data): isCutAction is false.',
					function() {
						// arrange
						var bidsystem = new bidSystemModule.BidSystem(bidSystemData);

						// assert
						assert.isFalse(bidsystem.isCutAction);
				});
		});
		suite('Functionality BidSystem objects', function() {
			test('#toggleIsDealer: sets the selected root to the root, switsching between bidRoot and bidRootOpponent.',
					function() {
						// arrange
						var bidsystem = new bidSystemModule.BidSystem(bidSystemData);
						
						//act + assert
						assert.equal(bidsystem.selectedRoot(), bidsystem.bidRoot());
						bidsystem.toggleIsDealer();
						assert.equal(bidsystem.selectedRoot(), bidsystem.bidRootOpponent());
						bidsystem.toggleIsDealer();
						assert.equal(bidsystem.selectedRoot(), bidsystem.bidRoot());
						
						
						bidsystem.selectedRoot(bidsystem.bidRoot().children()[0]);
						bidsystem.toggleIsDealer();
						assert.equal(bidsystem.selectedRoot(), bidsystem.bidRootOpponent());
					});
			test('#clearSelection: clears the list of selected bid conventions.',
					function() {
						// arrange
						var bidsystem = new bidSystemModule.BidSystem(bidSystemData);
						bidsystem.selectedConventions.push(bidsystem.bidRoot());
						bidsystem.selectedConventions.push(bidsystem.bidRoot().children[0]);
						
						//act
						bidsystem.clearSelection()

						// assert
						assert.lengthOf(bidsystem.selectedConventions(), 0);
					});
			test('#setSelectedRoot(bc): sets the bid convention as the selected root.',
					function() {
						// arrange
						var bidsystem = new bidSystemModule.BidSystem(bidSystemData);
						var expectedBC = bidsystem.bidRoot().children()[0];
						
						//act
						bidsystem.setSelectedRoot(expectedBC);

						// assert
						assert.equal(bidsystem.selectedRoot(), expectedBC);
					});
			test('#select(bc): sets the bid convention as the only selected item.',
					function() {
						// arrange
						var bidsystem = new bidSystemModule.BidSystem(bidSystemData);
						bidsystem.selectedConventions.push(bidsystem.bidRoot());
						bidsystem.selectedConventions.push(bidsystem.bidRoot().children[0]);
						
						//act
						bidsystem.select(bidsystem.bidRootOpponent());

						// assert
						assert.lengthOf(bidsystem.selectedConventions(), 1);
						assert.equal(bidsystem.selectedConventions()[0], bidsystem.bidRootOpponent());
					});
			test('#addToSelection(bc): adds the bid convention to the list of selected items.',
					function() {
						// arrange
						var bidsystem = new bidSystemModule.BidSystem(bidSystemData);
						bidsystem.selectedConventions.push(bidsystem.bidRoot());
						bidsystem.selectedConventions.push(bidsystem.bidRoot().children[0]);
						
						//act
						bidsystem.addToSelection(bidsystem.bidRootOpponent());

						// assert
						assert.lengthOf(bidsystem.selectedConventions(), 3);
						assert.include(bidsystem.selectedConventions(), bidsystem.bidRootOpponent());
					});
			test('#addToSelection(bc): only adds a bid convention once.',
					function() {
						// arrange
						var bidsystem = new bidSystemModule.BidSystem(bidSystemData);
						
						//act
						bidsystem.addToSelection(bidsystem.bidRootOpponent());
						bidsystem.addToSelection(bidsystem.bidRootOpponent());
						bidsystem.addToSelection(bidsystem.bidRootOpponent());

						// assert
						assert.lengthOf(bidsystem.selectedConventions(), 1);
						assert.include(bidsystem.selectedConventions(), bidsystem.bidRootOpponent());
					});
			test('#removeFromSelection(bc): removes a bid convention from the list of selected conventions.',
					function() {
						// arrange
						var bidsystem = new bidSystemModule.BidSystem(bidSystemData);
						bidsystem.addToSelection(bidsystem.bidRootOpponent());
						bidsystem.addToSelection(bidsystem.bidRoot());
						
						//act
						bidsystem.removeFromSelection(bidsystem.bidRootOpponent());

						// assert
						assert.lengthOf(bidsystem.selectedConventions(), 1);
						assert.notInclude(bidsystem.selectedConventions(), bidsystem.bidRootOpponent());
					});
			test('#removeFromSelection(bc): does nothing in case the bid convention is not in the selection.',
					function() {
						// arrange
						var bidsystem = new bidSystemModule.BidSystem(bidSystemData);
						bidsystem.addToSelection(bidsystem.bidRoot());
						
						//act
						bidsystem.removeFromSelection(bidsystem.bidRootOpponent());

						// assert
						assert.lengthOf(bidsystem.selectedConventions(), 1);
						assert.include(bidsystem.selectedConventions(), bidsystem.bidRoot());
					});
			test('#isSelected(bc): returns true iff the bid convention is in the selection.',
					function() {
						// arrange
						var bidsystem = new bidSystemModule.BidSystem(bidSystemData);
						bidsystem.addToSelection(bidsystem.bidRoot());
						
						// assert
						assert.isTrue(bidsystem.isSelected(bidsystem.bidRoot()));
						assert.isFalse(bidsystem.isSelected(bidsystem.bidRootOpponent()));
					});
			test('#copySelection + paste: implements copy > paste functionality.',
					function() {
						var bidsystem = new bidSystemModule.BidSystem(bidSystemData);
						var expectedJSParent = bidsystem.bidRoot().children()[0].toJSON();
						var expectedLength = bidsystem.bidRoot().children()[0].children().length;
						var copied_1 = bidsystem.bidRoot().children()[0].children()[0];
						var copied_2 = bidsystem.bidRoot().children()[0].children()[1];
						bidsystem.addToSelection(copied_1);
						bidsystem.addToSelection(copied_2);
						bidsystem.isCutAction = true;
						
						bidsystem.copySelection();
						assert.isFalse(bidsystem.isCutAction);
						assert.include(bidsystem.clippedConventions(), copied_1);
						assert.include(bidsystem.clippedConventions(), copied_2);
						assert.lengthOf(bidsystem.clippedConventions(), bidsystem.selectedConventions().length);

						var selected_1 = bidsystem.bidRoot().children()[1];
						var selected_2 = bidsystem.bidRoot().children()[2];
						bidsystem.select(selected_1);
						bidsystem.addToSelection(selected_2);
						bidsystem.paste();
						
						assert.lengthOf(selected_1.children(), 2)
						assert.deepEqual(selected_1.children()[0].toJSON(), copied_1.toJSON());
						assert.deepEqual(selected_1.children()[1].toJSON(), copied_2.toJSON());
						assert.lengthOf(selected_2.children(), 2)
						assert.deepEqual(selected_2.children()[0].toJSON(), copied_1.toJSON());
						assert.deepEqual(selected_2.children()[1].toJSON(), copied_2.toJSON());
						
						assert.lengthOf(bidsystem.bidRoot().children()[0].children(), expectedLength); 
						assert.deepEqual(bidsystem.bidRoot().children()[0].toJSON(), expectedJSParent); //copy keeps original

					});
			test('#cutSelection + paste: implements cut > paste functionality.',
					function() {
						var bidsystem = new bidSystemModule.BidSystem(bidSystemData);
						var copied_1 = bidsystem.bidRoot().children()[0].children()[0];
						var copied_2 = bidsystem.bidRoot().children()[0].children()[1];
						var expectedLength = bidsystem.bidRoot().children()[0].children().length - 2;
						bidsystem.addToSelection(copied_1);
						bidsystem.addToSelection(copied_2);
						bidsystem.isCutAction = false;
						
						bidsystem.cutSelection();
						assert.isTrue(bidsystem.isCutAction);
						assert.include(bidsystem.clippedConventions(), copied_1);
						assert.include(bidsystem.clippedConventions(), copied_2);
						assert.lengthOf(bidsystem.clippedConventions(), bidsystem.selectedConventions().length);

						var selected_1 = bidsystem.bidRoot().children()[1];
						var selected_2 = bidsystem.bidRoot().children()[2];
						bidsystem.select(selected_1);
						bidsystem.addToSelection(selected_2);
						bidsystem.paste();
						
						assert.lengthOf(selected_1.children(), 2)
						assert.deepEqual(selected_1.children()[0].toJSON(), copied_1.toJSON());
						assert.deepEqual(selected_1.children()[1].toJSON(), copied_2.toJSON());
						assert.lengthOf(selected_2.children(), 2)
						assert.deepEqual(selected_2.children()[0].toJSON(), copied_1.toJSON());
						assert.deepEqual(selected_2.children()[1].toJSON(), copied_2.toJSON());
						
						assert.lengthOf(bidsystem.bidRoot().children()[0].children(), expectedLength); //cut deletes original

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
			test('#load: returns null in case the key does not exist.',
				function() {
					// arrange
					localStorage.clear();
					assert.isNull(bidSystemModule.load("non_existing_key"));
			});

		});
	});
});