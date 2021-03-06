define(function(require) {
	var assert = require('chai').assert;
	var bcModule = require("models/bid-convention");
	var bidModule = require("models/bid");

	suite('BidConvention', function() {

		setup(function() {
			// ...
		});
		
		var constructBidSequence = function(bidArray){
			var bcRoot = new bcModule.BidConvention({});
			return addBidSequence(bcRoot, bidArray);
		};
		
		var addBidSequence = function(bcNode, bidArray){
			while (bidArray.length > 0){
				var nextBid = bidArray.shift();
				bcNode = bcNode.createChild({bid : nextBid});
			}
			return bcNode;
		};
		
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
					convention : "5+ schoppen, vanaf 5 punten."}]}]};
		var bcRoot = new bcModule.BidConvention(bcData);
		var bcChild0 = bcRoot.children()[0];
		var bcChild01 = bcChild0.children()[1];

		suite('Construction of BidConvention objects', function() {
			test('#collectInvalidBids(bidConventions): returns invalid bids in the given structure based on the parent of the root of the structure',
				function() {
					//arrange
					//[1c, pass, 1s]
					//[1c, pass, 2c]
					//[1c, 1s]
					//[1c, 1h, 1s]
					//[1c, 1h, 2c]
					//[1c, 2c]
					var bcData = {
						children : [
							{
								bid : {
									type : "SUIT",
									suit : "CLUBS", 
									level : 1
								},
								children : [
									{
										bid : { type : "PASS"}, //valid
										children : [
											{
												bid : {	type : "SUIT", suit : "SPADES", level : 1 } //invalid
											},
											{
												bid : {	type : "SUIT", suit : "CLUBS", level : 2 } //valid
											}
										]
									},
									{
										bid : {	type : "SUIT", suit : "SPADES", level : 1 } //invalid
									},
									{
										bid : {	type : "SUIT", suit : "HEARTS", level : 1 }, //invalid
										children : [
											{
												bid : {	type : "SUIT", suit : "SPADES", level : 1 } 
											},
											{
												bid : {	type : "SUIT", suit : "CLUBS", level : 2 } 
											}
										]
									},
									{
										bid : {	type : "SUIT", suit : "CLUBS", level : 2 } //valid
									}
								]
							}
						]
					};

					var bcTree_1_clubs = new bcModule.BidConvention(bcData);
					var clonedBids = bcTree_1_clubs.children()[0].children();
					
					assert.lengthOf(bcModule.collectInvalidBids(clonedBids), 0);
					assert.lengthOf(bcModule.collectInvalidBids([bcTree_1_clubs]), 0);

					//[1nt, pass, 1s]  XX
					//[1nt, pass, 2c]
					//[1nt, 1s]        XG
					//[1nt, 1h, 1s]    XX
					//[1nt, 1h, 2c]    XX
					//[1nt, 2c]
					var bc_1_nt = constructBidSequence([
						{type : "SUIT", level : 1, suit : "SPADES"}
					]);
					for (var i = 0; i < clonedBids.length; i++) {
						clonedBids[i].parent = bc_1_nt;
					}

					// assert
					var invalidBids = bcModule.collectInvalidBids(clonedBids);
					assert.lengthOf(invalidBids, 3);
					assert.include(invalidBids, clonedBids[0].children()[0]);
					assert.include(invalidBids, clonedBids[1]);
					assert.include(invalidBids, clonedBids[2]);
			});
		});

		// suite('Construction of BidConvention objects', function() {

		// 	test('#BidSequence(data): creates a tree structure with parent/child relations',
		// 			function() {
			
		// 				// assert
		// 				assert.isUndefined(bcRoot.parent);
		// 				assert.lengthOf(bcRoot.children(), 1);
		// 				assert.strictEqual(bcRoot.children()[0], bcChild0);
						
		// 				assert.strictEqual(bcChild0.parent, bcRoot);
		// 				assert.lengthOf(bcChild0.children(), 3);
		// 				assert.strictEqual(bcChild0.children()[1], bcChild01);
						
		// 				assert.strictEqual(bcChild01.parent, bcChild0);
		// 				assert.lengthOf(bcChild01.children(), 0);
		// 			});

		// 	test('#BidSequence(data): recursively sets id, bid, and convention properties',
		// 		function() {
		// 			// assert
		// 			assert.strictEqual(bcRoot.id, bcRootId);
		// 			assert.isUndefined(bcRoot.convention);
		// 			assert.isUndefined(bcRoot.bid);

		// 			assert.strictEqual(bcChild01.id, bcChild01Id);
		// 			assert.strictEqual(bcChild01.convention, bcChild01Convention);
		// 			assert.deepEqual(bcChild01.bid, bidModule.createBid(bcChild01Bid));
		// 		});
		// 	test('#BidSequence(data): by default "isOpen" is set "true" for root elements, "false" otherwise.',
		// 			function() {
		// 				// assert
		// 				assert.isTrue(bcRoot.isOpen());
		// 				assert.isFalse(bcChild01.isOpen());
		// 			});
		// 	test('#BidSequence(data): "isOpen" is set to data.isOpen if defined.',
		// 			function() {
		// 				// assert
		// 				assert.isFalse(new bcModule.BidConvention({parent: bcRoot}).isOpen());
		// 				assert.isTrue(new bcModule.BidConvention({parent: bcRoot, isOpen: true}).isOpen());
		// 				assert.isFalse(new bcModule.BidConvention({parent: bcRoot, isOpen: false}).isOpen());
		// 				assert.isTrue(new bcModule.BidConvention({}).isOpen());
		// 				assert.isFalse(new bcModule.BidConvention({isOpen: false}).isOpen());
		// 				assert.isTrue(new bcModule.BidConvention({isOpen: true}).isOpen());
		// 			});

		// 	test('#BidSequence(data): "jstreeStyle" correctly sets to "jstree-leaf", "jstree-open" or "jstree-closed".',
		// 			function() {
		// 				// assert
		// 				assert.include(bcChild01.jstreeStyle(), "jstree-leaf");
		// 				assert.include(bcRoot.jstreeStyle(), "jstree-open");
		// 				assert.include(bcChild0.jstreeStyle(), "jstree-closed");
		// 			});
		// 	test('#BidSequence(data): "jstreeStyle" correctly sets "jstree-last".',
		// 			function() {
		// 				var bcChild02 = bcChild0.children()[2];
						
		// 				// assert
		// 				assert.notInclude(bcChild01.jstreeStyle(), "jstree-last");
		// 				assert.include(bcChild02.jstreeStyle(), "jstree-last");
		// 				assert.include(bcRoot.jstreeStyle(), "jstree-last");
		// 			});

		// 	test('#BidSequence(data): puts the child conventions in proper order.',
		// 			function() {
		// 				// arrange
						
		// 				var bcData = {
		// 						id : "root",
		// 						children : [
		// 						    {
		// 								id : "1h",
		// 								bid : {
		// 									type : "SUIT",
		// 									suit : "HEARTS", 
		// 									level : 1
		// 								}},
		// 						    {
		// 								id : "1c",
		// 								bid : {
		// 									type : "SUIT",
		// 									suit : "CLUBS", 
		// 									level : 1
		// 								}},
		// 						    {
		// 								id : "pass",
		// 								bid : {
		// 									type : "PASS"
		// 								}}
		// 						]};
		// 				var bc = new bcModule.BidConvention(bcData);
						
		// 				// assert
		// 				assert.equal(bc.children()[0].id, "pass");
		// 				assert.equal(bc.children()[1].id, "1c");
		// 				assert.equal(bc.children()[2].id, "1h");
		// 			});
		// 	test('#BidSequence(data): throws an exception in case the bidsystem contains an invalid bidsequence',
		// 			function() {
		// 				// arrange
		// 				var invalidData = {
		// 					id : bcRootId,
		// 					children : [{
		// 						id : 1,
		// 						bid : {
		// 							type : "SUIT",
		// 							suit : "CLUBS", 
		// 							level : 1
		// 						},
		// 						convention : "12-19 punten. Vanaf een 3 kaart.",
		// 						children : [{
		// 							id : 2,
		// 							bid : {
		// 								type : "PASS"
		// 							},
		// 							convention : "bla",
		// 							children : []}
		// 						, { id : bcChild01Id,
		// 							bid : bcChild01Bid,
		// 							convention : bcChild01Convention}
		// 						, { id : 4,
		// 							bid : {
		// 								type : "SUIT",
		// 								suit : "SPADES", 
		// 								level : 1
		// 							},
		// 							convention : "5+ schoppen, vanaf 5 punten.",
		// 							children : [{
		// 								id : 10,
		// 								bid : {type : "REDOUBLET"}
		// 							}]}]}]};
		// 				// assert
		// 				assert.throw(function(){new bcModule.BidConvention(invalidData);}, 'unvalid bid: {"type":"REDOUBLET"}');
		// 			});
		// 	test('#BidSequence(data): throws an exception in case the bidsequence does not contain a root',
		// 			function() {
		// 				// arange
		// 				var invalidData = {
		// 						id : 1,
		// 						bid : {
		// 							type : "SUIT",
		// 							suit : "CLUBS", 
		// 							level : 1
		// 						},
		// 						convention : "12-19 punten. Vanaf een 3 kaart.",
		// 						children : [{
		// 							id : 2,
		// 							bid : {
		// 								type : "SUIT",
		// 								suit : "CLUBS", 
		// 								level : 2
		// 							},
		// 							convention : "bla",
		// 							children : []}]};
		// 				// assert
		// 				assert.throw(function(){new bcModule.BidConvention(invalidData);}, 'A newly created bid system must contain a root node for which the bid is "undefined"');
		// 			});
		// 	test('#BidSequence(data): throws an exception in case the bidsequence contains an invalid bid',
		// 			function() {
		// 				// arange
		// 				var invalidData = {
		// 					id : bcRootId,
		// 					children : [{
		// 						id : 1,
		// 						bid : {
		// 							type : "SUIT",
		// 							suit : "CLUBS", 
		// 							level : 1
		// 						},
		// 						convention : "12-19 punten. Vanaf een 3 kaart.",
		// 						children : [{
		// 							id : 2,
		// 							bid : {
		// 								type : "PASS"
		// 							},
		// 							convention : "bla",
		// 							children : []}
		// 						, { id : bcChild01Id,
		// 							bid : bcChild01Bid,
		// 							convention : bcChild01Convention}
		// 						, { id : 4,
		// 							bid : {
		// 								type : "XXXSUIT",
		// 								suit : "SPADES", 
		// 								level : 1
		// 							},
		// 							convention : "5+ schoppen, vanaf 5 punten.",
		// 							children : []}]}]};
		// 				// assert
		// 				assert.throw(function(){new bcModule.BidConvention(invalidData);}, 'unvalid bid: {"type":"XXXSUIT","suit":"SPADES","level":1}');
		// 			});

		// });
		// suite('Validation of BidConvention objects', function() {
		// 	suite('Validation of BidConvention objects: Bidding Finished', function() {
		// 		test('#isValidChildBid(bid): "[PASS, PASS, PASS, PASS, ***]" is not valid.',
		// 			function() {			
		// 				// arrange
		// 				var pass_pass_pass_pass = constructBidSequence([
		// 				    {type : "PASS"},
		//     			    {type : "PASS"},
		//     			    {type : "PASS"},
		//     			    {type : "PASS"}
		// 			    ]);
		// 				var suitBid = {type : "SUIT", level : 2, suit : "SPADES"};
		// 				var pass = {type : "PASS"}
		// 				var dbl = {type : "DOUBLET"}
		// 				var redbl = {type : "REDOUBLET"}
						
		// 				// assert
		// 				assert.isFalse(pass_pass_pass_pass.isValidChildBid(suitBid));
		// 				assert.isFalse(pass_pass_pass_pass.isValidChildBid(pass));
		// 				assert.isFalse(pass_pass_pass_pass.isValidChildBid(dbl));
		// 				assert.isFalse(pass_pass_pass_pass.isValidChildBid(redbl));
	
		// 		});
		// 		test('#isValidChildBid(bid): "[..., SUIT, PASS, PASS, PASS, ***]" is not valid.',
		// 			function() {			
		// 				// arrange
		// 				var _1nt_pass_pass_pass = constructBidSequence([
		//     			    {type : "SUIT", level : 1, suit : "NOTRUMP"},
		//     			    {type : "PASS"},
		//     			    {type : "PASS"},
		//     			    {type : "PASS"}
		// 			    ]);
		// 				var suitBid = {type : "SUIT", level : 2, suit : "SPADES"};
		// 				var pass = {type : "PASS"}
		// 				var dbl = {type : "DOUBLET"}
		// 				var redbl = {type : "REDOUBLET"}
						
		// 				// assert
		// 				assert.isFalse(_1nt_pass_pass_pass.isValidChildBid(suitBid));
		// 				assert.isFalse(_1nt_pass_pass_pass.isValidChildBid(pass));
		// 				assert.isFalse(_1nt_pass_pass_pass.isValidChildBid(dbl));
		// 				assert.isFalse(_1nt_pass_pass_pass.isValidChildBid(redbl));	
		// 		});
		// 		test('#isValidChildBid(bid): "[..., DBL, PASS, PASS, PASS, ***]" is not valid.',
		// 			function() {			
		// 				// arrange
		// 				var _1nt_dbl_pass_pass_pass = constructBidSequence([
		//     			    {type : "SUIT", level : 1, suit : "NOTRUMP"},
		//     			    {type : "DOUBLET"},
		//     			    {type : "PASS"},
		//     			    {type : "PASS"},
		//     			    {type : "PASS"}
		// 			    ]);
		// 				var suitBid = {type : "SUIT", level : 2, suit : "SPADES"};
		// 				var pass = {type : "PASS"}
		// 				var dbl = {type : "DOUBLET"}
		// 				var redbl = {type : "REDOUBLET"}
						
		// 				// assert
		// 				assert.isFalse(_1nt_dbl_pass_pass_pass.isValidChildBid(suitBid));
		// 				assert.isFalse(_1nt_dbl_pass_pass_pass.isValidChildBid(pass));
		// 				assert.isFalse(_1nt_dbl_pass_pass_pass.isValidChildBid(dbl));
		// 				assert.isFalse(_1nt_dbl_pass_pass_pass.isValidChildBid(redbl));	
		// 		});
		// 		test('#isValidChildBid(bid): "[..., REDBL, PASS, PASS, PASS, ***]" is not valid.',
		// 			function() {			
		// 				// arrange
		// 				var _1nt_dbl_redbl_pass_pass_pass = constructBidSequence([
		//     			    {type : "SUIT", level : 1, suit : "NOTRUMP"},
		//     			    {type : "DOUBLET"},
		//     			    {type : "REDOUBLET"},
		//     			    {type : "PASS"},
		//     			    {type : "PASS"},
		//     			    {type : "PASS"}
		// 			    ]);
		// 				var suitBid = {type : "SUIT", level : 2, suit : "SPADES"};
		// 				var pass = {type : "PASS"}
		// 				var dbl = {type : "DOUBLET"}
		// 				var redbl = {type : "REDOUBLET"}
						
		// 				// assert
		// 				assert.isFalse(_1nt_dbl_redbl_pass_pass_pass.isValidChildBid(suitBid));
		// 				assert.isFalse(_1nt_dbl_redbl_pass_pass_pass.isValidChildBid(pass));
		// 				assert.isFalse(_1nt_dbl_redbl_pass_pass_pass.isValidChildBid(dbl));
		// 				assert.isFalse(_1nt_dbl_redbl_pass_pass_pass.isValidChildBid(redbl));	
		// 		});
		// 	});
		// 	suite('Validation of BidConvention objects: PASS', function() {
		// 		test('#isValidChildBid(bid): "[PASS]" is valid.',
		// 				function() {			
		// 					// arrange
		// 					var root = constructBidSequence([
		// 				    ]);
							
		// 					// assert
		// 					assert.isTrue(root.isValidChildBid({type : "PASS"}));
		// 			});
		// 		test('#isValidChildBid(bid): "[..., PASS, PASS]" is valid.',
		// 				function() {			
		// 					// arrange
		// 					var pass = constructBidSequence([
		// 					   {type : "PASS"}
		// 				    ]);
							
		// 					// assert
		// 					assert.isTrue(pass.isValidChildBid({type : "PASS"}));
		// 			});
		// 		test('#isValidChildBid(bid): "[..., DBL, PASS]" is valid.',
		// 				function() {			
		// 					// arrange
		// 					var _1nt_dbl = constructBidSequence([
  //   		       			    {type : "SUIT", level : 1, suit : "NOTRUMP"},
  //   		       			    {type : "DOUBLET"}
		// 				    ]);
							
		// 					// assert
		// 					assert.isTrue(_1nt_dbl.isValidChildBid({type : "PASS"}));
		// 			});
		// 		test('#isValidChildBid(bid): "[..., REDOUBLET, PASS]" is valid.',
		// 				function() {			
		// 					// arrange
		// 					var _1nt_dbl_redbl = constructBidSequence([
  //   		       			    {type : "SUIT", level : 1, suit : "NOTRUMP"},
  //   		       			    {type : "DOUBLET"},
  //   		       			    {type : "REDOUBLET"}
		// 				    ]);
							
		// 					// assert
		// 					assert.isTrue(_1nt_dbl_redbl.isValidChildBid({type : "PASS"}));
		// 			});
		// 		test('#isValidChildBid(bid): "[..., SUIT, PASS]" is valid.',
		// 				function() {			
		// 					// arrange
		// 					var _1nt = constructBidSequence([
  //   		       			    {type : "SUIT", level : 1, suit : "NOTRUMP"}
		// 				    ]);
							
		// 					// assert
		// 					assert.isTrue(_1nt.isValidChildBid({type : "PASS"}));
		// 			});				
		// 	});
		// 	suite('Validation of BidConvention objects: SUIT', function() {
		// 		test('#isValidChildBid(bid): "[SUIT]" is valid.',
		// 				function() {			
		// 					// arrange
		// 					var root = constructBidSequence([
		// 				    ]);
							
		// 					// assert
		// 					assert.isTrue(root.isValidChildBid({type : "SUIT", level : 1, suit : "NOTRUMP"}));
		// 			});
		// 		test('#isValidChildBid(bid): "[..., PASS, SUIT]" is valid iff SUIT increases the bid level.',
		// 				function() {			
		// 					// arrange
		// 					var pass = constructBidSequence([
		// 					   {type : "PASS"}
		// 				    ]);
		// 					var _2s_pass = constructBidSequence([
  //                            {type : "SUIT", level : 2, suit : "SPADES"},
  //                            {type : "PASS"}
  //						    ]);
							
		// 					// assert
		// 					assert.isTrue(pass.isValidChildBid({type : "SUIT", level : 1, suit : "NOTRUMP"}));
		// 					assert.isTrue(_2s_pass.isValidChildBid({type : "SUIT", level : 3, suit : "CLUBS"}));
		// 					assert.isTrue(_2s_pass.isValidChildBid({type : "SUIT", level : 2, suit : "NOTRUMP"}));
		// 					assert.isFalse(_2s_pass.isValidChildBid({type : "SUIT", level : 2, suit : "SPADES"}));
		// 					assert.isFalse(_2s_pass.isValidChildBid({type : "SUIT", level : 1, suit : "NOTRUMP"}));
		// 					assert.isFalse(_2s_pass.isValidChildBid({type : "SUIT", level : 2, suit : "CLUBS"}));
		// 			});
		// 		test('#isValidChildBid(bid): "[..., DBL, SUIT]" is valid iff SUIT increases the bid level.',
		// 				function() {			
		// 					// arrange
		// 					var _2s_dbl = constructBidSequence([
  //                               {type : "SUIT", level : 2, suit : "SPADES"},
  //                               {type : "DOUBLET"}
  //   						]);
   							
  // 							// assert
  // 							assert.isTrue(_2s_dbl.isValidChildBid({type : "SUIT", level : 3, suit : "CLUBS"}));
  // 							assert.isTrue(_2s_dbl.isValidChildBid({type : "SUIT", level : 2, suit : "NOTRUMP"}));
  // 							assert.isFalse(_2s_dbl.isValidChildBid({type : "SUIT", level : 2, suit : "SPADES"}));
  // 							assert.isFalse(_2s_dbl.isValidChildBid({type : "SUIT", level : 1, suit : "NOTRUMP"}));
  // 							assert.isFalse(_2s_dbl.isValidChildBid({type : "SUIT", level : 2, suit : "CLUBS"}));
		// 			});
		// 		test('#isValidChildBid(bid): "[..., REDBL, SUIT]" is valid iff SUIT increases the bid level.',
		// 				function() {			
		// 					// arrange
		// 					var _2s_dbl_redbl = constructBidSequence([
  //                               {type : "SUIT", level : 2, suit : "SPADES"},
  //                               {type : "DOUBLET"},
  //                               {type : "REDOUBLET"}
  //   						]);
   							
  // 							// assert
  // 							assert.isTrue(_2s_dbl_redbl.isValidChildBid({type : "SUIT", level : 3, suit : "CLUBS"}));
  // 							assert.isTrue(_2s_dbl_redbl.isValidChildBid({type : "SUIT", level : 2, suit : "NOTRUMP"}));
  // 							assert.isFalse(_2s_dbl_redbl.isValidChildBid({type : "SUIT", level : 2, suit : "SPADES"}));
  // 							assert.isFalse(_2s_dbl_redbl.isValidChildBid({type : "SUIT", level : 1, suit : "NOTRUMP"}));
  // 							assert.isFalse(_2s_dbl_redbl.isValidChildBid({type : "SUIT", level : 2, suit : "CLUBS"}));
		// 			});
		// 		test('#isValidChildBid(bid): "[..., SUIT, SUIT]" is valid iff the last SUIT increases the bid level.',
		// 				function() {			
		// 					// arrange
		// 					var _1s__2s = constructBidSequence([
  //                               {type : "SUIT", level : 1, suit : "SPADES"},
  //                               {type : "SUIT", level : 2, suit : "SPADES"}
  //   						]);
   							
  // 							// assert
  // 							assert.isTrue(_1s__2s.isValidChildBid({type : "SUIT", level : 3, suit : "CLUBS"}));
  // 							assert.isTrue(_1s__2s.isValidChildBid({type : "SUIT", level : 2, suit : "NOTRUMP"}));
  // 							assert.isFalse(_1s__2s.isValidChildBid({type : "SUIT", level : 2, suit : "SPADES"}));
  // 							assert.isFalse(_1s__2s.isValidChildBid({type : "SUIT", level : 1, suit : "NOTRUMP"}));
  // 							assert.isFalse(_1s__2s.isValidChildBid({type : "SUIT", level : 2, suit : "CLUBS"}));
		// 			});
		// 	});

		// 	suite('Validation of BidConvention objects: REDOUBLET', function() {
		// 		test('#isValidChildBid(bid): "[REDBL]" is invalid.',
		// 				function() {			
		// 					// arrange
		// 					var root = constructBidSequence([]);
							
		// 					// assert
		// 					assert.isFalse(root.isValidChildBid({type : "REDOUBLET"}));
		// 			});
		// 		test('#isValidChildBid(bid): "[..., SUIT, REDBL]" and "[..., REDBL, REDBL]" are invalid.',
		// 			function() {			
		// 				// arrange
		// 				var _1nt = constructBidSequence([
		//       			    {type : "SUIT", level : 1, suit : "NOTRUMP"}
		//   			    ]);
		// 				var _1nt_dbl_redbl = constructBidSequence([
  // 		    			    {type : "SUIT", level : 1, suit : "NOTRUMP"},
  // 		    			    {type : "DOUBLET"},
  // 		    			    {type : "REDOUBLET"}
  // 					    ]);
						
		// 				// assert
		// 				assert.isFalse(_1nt.isValidChildBid({type : "REDOUBLET"}));
		// 				assert.isFalse(_1nt_dbl_redbl.isValidChildBid({type : "REDOUBLET"}));
		// 		});
		// 		test('#isValidChildBid(bid): "[..., DBL,  REDBL]" is valid.',
		// 			function() {			
		// 				// arrange
		// 				var _1nt_dbl = constructBidSequence([
	 //	    			    {type : "SUIT", level : 1, suit : "NOTRUMP"},
		//     			    {type : "DOUBLET"}
		//   			    ]);
							
		// 				// assert
		// 				assert.isTrue(_1nt_dbl.isValidChildBid({type : "REDOUBLET"}));
		// 		});
	
		// 		test('#isValidChildBid(bid): and "[..., SUIT, PASS, REDBL]", "[..., DBL, PASS, REDBL]" and "[..., REDBL, PASS, REDBL]" are invalid.',
		// 			function() {			
		// 				// arrange
		// 				var _1nt_pass = constructBidSequence([
	 // 		    			{type : "SUIT", level : 1, suit : "NOTRUMP"},
	 // 	    			    {type : "PASS"}
	 // 	   			    ]);
		// 				var _1nt_dbl_pass = constructBidSequence([
		// 	    			{type : "SUIT", level : 1, suit : "NOTRUMP"},
		//     			    {type : "DOUBLET"},
		//     			    {type : "PASS"}
		//   			    ]);
		// 				var _1nt_dbl_redbl_pass = constructBidSequence([
		//     			    {type : "SUIT", level : 1, suit : "NOTRUMP"},
		//     			    {type : "DOUBLET"},
		//     			    {type : "REDOUBLET"},
		//     			    {type : "PASS"}
		// 			    ]);
							
		// 				// assert
		// 				assert.isFalse(_1nt_pass.isValidChildBid({type : "REDOUBLET"}));
		// 				assert.isFalse(_1nt_dbl_pass.isValidChildBid({type : "REDOUBLET"}));
		// 				assert.isFalse(_1nt_dbl_redbl_pass.isValidChildBid({type : "REDOUBLET"}));
		// 		});
				
		// 		test('#isValidChildBid(bid): "[..., DBL, PASS, PASS, REDBL]" is valid.',
		// 			function() {			
		// 				// arrange
		// 				var _1nt_dbl_pass_pass = constructBidSequence([
		// 	    			{type : "SUIT", level : 1, suit : "NOTRUMP"},
		//     			    {type : "DOUBLET"},
		//     			    {type : "PASS"},
	 // 	    			    {type : "PASS"}
		//   			    ]);
							
		// 				// assert
		// 				assert.isTrue(_1nt_dbl_pass_pass.isValidChildBid({type : "REDOUBLET"}));
		// 		});
	
		// 		test('#isValidChildBid(bid): and "[..., PASS, PASS, PASS, REDBL]", "[..., DBL, PASS, PASS, REDBL]" and "[..., REDBL, PASS, PASS, REDBL]" are invalid.',
		// 				function() {			
		// 					// arrange
		// 					var pass_pass_pass = constructBidSequence([
	 //  	  	    			    {type : "PASS"},
		//   	    			    {type : "PASS"},
		//   	    			    {type : "PASS"}
		//   	   			    ]);
		// 					var _1nt_dbl_redbl_pass_pass = constructBidSequence([
		// 	    			    {type : "SUIT", level : 1, suit : "NOTRUMP"},
		// 	    			    {type : "DOUBLET"},
		// 	    			    {type : "REDOUBLET"},
		// 	    			    {type : "PASS"},
		//   	    			    {type : "PASS"}
		// 				    ]);
		// 					var _1nt_pass_pass = constructBidSequence([
  //   		       			    {type : "SUIT", level : 1, suit : "NOTRUMP"},
  //   		       			    {type : "PASS"},
  //   		       			    {type : "PASS"}
  //   		   			    ]);
								
		// 					// assert
		// 					assert.isFalse(pass_pass_pass.isValidChildBid({type : "REDOUBLET"}));
		// 					assert.isFalse(_1nt_dbl_redbl_pass_pass.isValidChildBid({type : "REDOUBLET"}));
		// 					assert.isFalse(_1nt_pass_pass.isValidChildBid({type : "REDOUBLET"}));
		// 		});
		// 	});
		// 	suite('Validation of BidConvention objects: DOUBLET', function() {
		// 		test('#isValidChildBid(bid): "[DBL]" is invalid.',
		// 				function() {			
		// 					// arrange
		// 					var root = constructBidSequence([]);
							
		// 					// assert
		// 					assert.isFalse(root.isValidChildBid({type : "DOUBLET"}));
		// 			});
		// 		test('#isValidChildBid(bid): "[..., SUIT, DBL]" is valid.',
		// 			function() {			
		// 				// arrange
		// 				var _1nt = constructBidSequence([
		//       			    {type : "SUIT", level : 1, suit : "NOTRUMP"}
		//   			    ]);
						
		// 				// assert
		// 				assert.isTrue(_1nt.isValidChildBid({type : "DOUBLET"}));
		// 		});
		// 		test('#isValidChildBid(bid): "[..., DBL,  DBL]" and "[..., REDBL, DBL]" are invalid.',
		// 			function() {			
		// 				// arrange
		// 				var _1nt_dbl = constructBidSequence([
	 //	    			    {type : "SUIT", level : 1, suit : "NOTRUMP"},
		//     			    {type : "DOUBLET"}
		//   			    ]);
		// 				var _1nt_dbl_redbl = constructBidSequence([
		//     			    {type : "SUIT", level : 1, suit : "NOTRUMP"},
		//     			    {type : "DOUBLET"},
		//     			    {type : "REDOUBLET"}
		// 			    ]);
							
		// 				// assert
		// 				assert.isFalse(_1nt_dbl.isValidChildBid({type : "DOUBLET"}));
		// 				assert.isFalse(_1nt_dbl_redbl.isValidChildBid({type : "DOUBLET"}));
		// 		});
	
		// 		test('#isValidChildBid(bid): and "[..., SUIT, PASS, DBL]", "[..., DBL, PASS, DBL]" and "[..., REDBL, PASS, DBL]" are invalid.',
		// 			function() {			
		// 				// arrange
		// 				var _1nt_pass = constructBidSequence([
	 // 		    			{type : "SUIT", level : 1, suit : "NOTRUMP"},
	 // 	    			    {type : "PASS"}
	 // 	   			    ]);
		// 				var _1nt_dbl_pass = constructBidSequence([
		// 	    			{type : "SUIT", level : 1, suit : "NOTRUMP"},
		//     			    {type : "DOUBLET"},
		//     			    {type : "PASS"}
		//   			    ]);
		// 				var _1nt_dbl_redbl_pass = constructBidSequence([
		//     			    {type : "SUIT", level : 1, suit : "NOTRUMP"},
		//     			    {type : "DOUBLET"},
		//     			    {type : "REDOUBLET"},
		//     			    {type : "PASS"}
		// 			    ]);
							
		// 				// assert
		// 				assert.isFalse(_1nt_pass.isValidChildBid({type : "DOUBLET"}));
		// 				assert.isFalse(_1nt_dbl_pass.isValidChildBid({type : "DOUBLET"}));
		// 				assert.isFalse(_1nt_dbl_redbl_pass.isValidChildBid({type : "DOUBLET"}));
		// 		});
				
		// 		test('#isValidChildBid(bid): "[..., SUIT, PASS, PASS, DBL]" is valid.',
		// 			function() {			
		// 				// arrange
		// 				var _1nt_pass_pass = constructBidSequence([
		//       			    {type : "SUIT", level : 1, suit : "NOTRUMP"},
		//       			    {type : "PASS"},
		//       			    {type : "PASS"}
		//   			    ]);
							
		// 				// assert
		// 				assert.isTrue(_1nt_pass_pass.isValidChildBid({type : "DOUBLET"}));
		// 		});
	
		// 		test('#isValidChildBid(bid): and "[..., PASS, PASS, PASS, DBL]", "[..., DBL, PASS, PASS, DBL]" and "[..., REDBL, PASS, PASS, DBL]" are invalid.',
		// 				function() {			
		// 					// arrange
		// 					var pass_pass_pass = constructBidSequence([
	 //  	  	    			    {type : "PASS"},
		//   	    			    {type : "PASS"},
		//   	    			    {type : "PASS"}
		//   	   			    ]);
		// 					var _1nt_dbl_pass_pass = constructBidSequence([
		// 		    			{type : "SUIT", level : 1, suit : "NOTRUMP"},
		// 	    			    {type : "DOUBLET"},
		// 	    			    {type : "PASS"},
		//   	    			    {type : "PASS"}
		// 	   			    ]);
		// 					var _1nt_dbl_redbl_pass_pass = constructBidSequence([
		// 	    			    {type : "SUIT", level : 1, suit : "NOTRUMP"},
		// 	    			    {type : "DOUBLET"},
		// 	    			    {type : "REDOUBLET"},
		// 	    			    {type : "PASS"},
		//   	    			    {type : "PASS"}
		// 				    ]);
								
		// 					// assert
		// 					assert.isFalse(pass_pass_pass.isValidChildBid({type : "DOUBLET"}));
		// 					assert.isFalse(_1nt_dbl_pass_pass.isValidChildBid({type : "DOUBLET"}));
		// 					assert.isFalse(_1nt_dbl_redbl_pass_pass.isValidChildBid({type : "DOUBLET"}));
		// 		});
		// 	});
		// 	suite('Helper functions', function() {
		// 		test('#getRoot: returns the root bid.',
		// 				function() {
		// 					assert.equal(bcRoot.getRoot(), bcRoot);
		// 					assert.equal(bcChild01.getRoot(), bcRoot);
		// 				});				
		// 		test('#isRoot: says whether a bid convention is the root.',
		// 				function() {
		// 					assert.isTrue(bcRoot);
		// 					assert.isFalse(bcChild01);
		// 				});				
		// 	});
		// 	suite('View-model functions', function() {
		// 		test('#toggleOpenClose: toggles the isOpen property.',
		// 			function() {			
		// 				var _1nt_dbl_pass = constructBidSequence([
		// 	    			{type : "SUIT", level : 1, suit : "NOTRUMP"},
		//     			    {type : "DOUBLET"},
		//     			    {type : "PASS"}
		//   			    ]);
		// 				assert.isFalse(_1nt_dbl_pass.parent.isOpen());
		// 				_1nt_dbl_pass.parent.toggleOpenClose();
		// 				assert.isTrue(_1nt_dbl_pass.parent.isOpen());
		// 				_1nt_dbl_pass.parent.toggleOpenClose();
		// 				assert.isFalse(_1nt_dbl_pass.parent.isOpen());
		// 			});
		// 	});
		// 	suite('Serialization of bidsystem structure', function() {
		// 		test('#toJSON: "BidConvention -> JSONString -> BidConvention" is identity.',
		// 			function() {			
		// 				// arrange
		// 				var jsBefore = {
		// 					id : 0,
		// 					children : [{
		// 						id : 1,
		// 						bid : {
		// 							type : "SUIT",
		// 							suit : "CLUBS", 
		// 							level : 1
		// 						},
		// 						convention : "12-19 punten. Vanaf een 3 kaart.",
		// 						children : [{
		// 							id : 2,
		// 							bid : {
		// 								type : "PASS"
		// 							},
		// 							convention : "bla",
		// 							children : []}
		// 						, { id : 4,
		// 							bid : {
		// 								type : "SUIT",
		// 								suit : "SPADES", 
		// 								level : 1
		// 							},
		// 							convention : "5+ schoppen, vanaf 5 punten."}]}]};
		// 				var bcRootBefore = new bcModule.BidConvention(jsBefore);
		// 				var jsAfter1 = JSON.stringify(bcRootBefore);
		// 				var bcRootAfter1 = new bcModule.BidConvention(JSON.parse(jsAfter1));
		// 				var jsAfter2 = JSON.stringify(bcRootAfter1);
		// 				var bcRootAfter2 = new bcModule.BidConvention(JSON.parse(jsAfter2));
													
		// 				// assert
		// 				assert.strictEqual(jsAfter1, jsAfter2);						
		// 			});
		// 		test('#toJSON: the following properties are serialized: id, bid, convention, children.',
		// 				function() {
		// 					// arrange
		// 					var jsData = {
		// 						id : 0,
		// 						children : [{
		// 							id : 1,
		// 							bid : {
		// 								type : "SUIT",
		// 								suit : "CLUBS", 
		// 								level : 1
		// 							},
		// 							convention : "12-19 punten. Vanaf een 3 kaart.",
		// 							children : [{
		// 								id : 2,
		// 								bid : {
		// 									type : "PASS"
		// 								},
		// 								convention : "bla",
		// 								children : []}
		// 							, { id : 4,
		// 								bid : {
		// 									type : "SUIT",
		// 									suit : "SPADES", 
		// 									level : 1
		// 								},
		// 								convention : "5+ schoppen, vanaf 5 punten."}]}]};
		// 					var bcRoot = new bcModule.BidConvention(jsData);
							
		// 					//act
		// 					var jsonString = JSON.stringify(bcRoot);
		// 					var json = JSON.parse(jsonString);
		// 					var jsonChild = json.children[0];
														
		// 					// assert
		// 					assert.equal(json.id, bcRoot.id);
		// 					assert.isDefined(jsonChild.bid);
		// 					assert.isDefined(jsonChild.convention);
		// 					assert.isDefined(jsonChild.children);
		// 					assert.isUndefined(jsonChild.isOpen);
		// 					assert.isUndefined(jsonChild.jstreeStyle);
		// 				});
		// 		test('#toJSON: Serialization ignores the isOpen property.',
		// 				function() {			
		// 					// arrange
		// 					var jsBefore = {
		// 						id : 0,
		// 						children : []};
		// 					var bcRootBefore = new bcModule.BidConvention(jsBefore);
		// 					assert.isTrue(bcRootBefore.isOpen());
							
		// 					//act
		// 					bcRootBefore.isOpen(false)
							
		// 					var jsAfter = bcRootBefore.toJSON();
		// 					var jsStringAfter = JSON.stringify(bcRootBefore);
		// 					var bcRootAfter = new bcModule.BidConvention(JSON.parse(jsStringAfter));
														
		// 					// assert
		// 					assert.isUndefined(jsAfter.isOpen);
		// 					assert.isTrue(bcRootAfter.isOpen());						
		// 				});
		// 	});
		// 	suite('Manipulation of bidsystem structure', function() {
		// 		test('#remove(): Removes the bid from the bid structure and returns the bid.',
		// 				function() {			
		// 					// arrange
		// 					var bid = constructBidSequence([
  //				    			{type : "SUIT", level : 1, suit : "NOTRUMP"},
  //			    			    {type : "DOUBLET"},
  //			    			    {type : "PASS"}
  //			   			    ]);
							
		// 					//act
		// 					var _1nt = bid.parent.parent;
		// 					var dbl_pass = bid.parent.remove();

		// 					// assert
		// 					assert.lengthOf(_1nt.children(), 0);
		// 					assert.equal(dbl_pass.parent, _1nt);
		// 					assert.equal(dbl_pass.bid.type, "DOUBLET");
		// 					assert.equal(dbl_pass.children()[0].bid.type, "PASS");
		// 		});
		// 		test('#remove(): Removes all children when applied to the root of the bid structure.',
		// 				function() {			
		// 					// arrange
		// 					var bid = constructBidSequence([
  //				    			{type : "SUIT", level : 1, suit : "NOTRUMP"},
  //			    			    {type : "DOUBLET"},
  //			    			    {type : "PASS"}
  //			   			    ]);
							
		// 					//act
		// 					var root = bid.parent.parent.parent;
		// 					var _root = root.remove();

		// 					// assert
		// 					assert.lengthOf(root.children(), 0);
		// 					assert.equal(root, _root);
		// 		});
		// 		test('#createChild(childData): Creates a child convention from the given child data.',
		// 				function() {			
		// 					// arrange
		// 					var _1nt_dbl_pass = constructBidSequence([
		// 		    			{type : "SUIT", level : 1, suit : "NOTRUMP"},
		// 	    			    {type : "DOUBLET"},
		// 	    			    {type : "PASS"}
		// 	   			    ]);
							
		// 					//act
		// 					var _2c_child = _1nt_dbl_pass.createChild({
		// 						id : 10,
		// 						bid : {type : "SUIT", suit: "CLUBS", level: 2},
		// 						convention : "5+ clubs",
		// 						children : [{
		// 							id : 11,
		// 							bid : {type : "SUIT", suit: "CLUBS", level: 3},
		// 							convention : "onzin",
		// 							children : []									
		// 						}]
		// 					});
								
		// 					// assert
		// 					assert.strictEqual(_1nt_dbl_pass.children()[0], _2c_child);
		// 					assert.strictEqual(_2c_child.id, 10);
		// 					assert.strictEqual(_2c_child.bid.suit, "CLUBS");
		// 					assert.strictEqual(_2c_child.convention, "5+ clubs");
		// 					assert.strictEqual(_2c_child.children()[0].id, 11);});
		// 		test('#createChild(childData): preserves the ordering of child bids.',
		// 				function() {			
		// 					// arrange
		// 					var _1nt_dbl_pass_2s = constructBidSequence([
		// 		    			{type : "SUIT", level : 1, suit : "NOTRUMP"},
		// 	    			    {type : "DOUBLET"},
		// 	    			    {type : "PASS"},
		// 						{type : "SUIT", suit: "SPADES", level: 2}
		// 	   			    ]);
							
		// 					//act
		// 					_1nt_dbl_pass_2s.parent.createChild({
		// 						bid : {type : "SUIT", suit: "CLUBS", level: 2}
		// 					});
		// 					_1nt_dbl_pass_2s.parent.createChild({
		// 						bid : {type : "SUIT", suit: "NOTRUMP", level: 2}
		// 					});
								
		// 					// assert
		// 					assert.equal(_1nt_dbl_pass_2s.parent.children()[0].bid.suit, "CLUBS");
		// 					assert.equal(_1nt_dbl_pass_2s.parent.children()[1].bid.suit, "SPADES");
		// 					assert.equal(_1nt_dbl_pass_2s.parent.children()[2].bid.suit, "NOTRUMP");
		// 		});
		// 		test('#createChild(childData): throws an exception in case the created child sequence is invalid.',
		// 				function() {			
		// 					// arrange
		// 					var _1nt_dbl_pass = constructBidSequence([
		// 		    			{type : "SUIT", level : 1, suit : "NOTRUMP"},
		// 	    			    {type : "DOUBLET"},
		// 	    			    {type : "PASS"}
		// 	   			    ]);
							
		// 					//act + assert
		// 					assert.throw(function(){
		// 						_1nt_dbl_pass.createChild({
		// 							id : 10,
		// 							bid : {type : "SUIT", suit: "CLUBS", level: 1},
		// 							convention : "5+ clubs",
		// 							children : [{
		// 								id : 11,
		// 								bid : {type : "SUIT", suit: "CLUBS", level: 3},
		// 								convention : "onzin",
		// 								children : []									
		// 							}]
		// 						});
		// 					}, 'unvalid bid: {"type":"SUIT","suit":"CLUBS","level":1}');});
		// 		test('#createChildren(childData): Creates multiple child conventions from the given child data.',
		// 				function() {			
		// 					// arrange
		// 					var _1nt_dbl_pass = constructBidSequence([
		// 		    			{type : "SUIT", level : 1, suit : "NOTRUMP"},
		// 	    			    {type : "DOUBLET"},
		// 	    			    {type : "PASS"}
		// 	   			    ]);
							
		// 					//act
		// 					_1nt_dbl_pass.parent.createChildren([
		// 					    {
		// 							id : 10,
		// 							bid : {type : "SUIT", suit: "CLUBS", level: 2},
		// 							convention : "5+ clubs",
		// 							children : [{
		// 								id : 11,
		// 								bid : {type : "SUIT", suit: "CLUBS", level: 3},
		// 								convention : "onzin",
		// 								children : []}]},
		// 					    {
		// 							id : 20,
		// 							bid : {type : "SUIT", suit: "SPADES", level: 2},
		// 							convention : "5+ spades",
		// 							children : []},
		// 					]);
								
		// 					// assert
		// 					assert.lengthOf(_1nt_dbl_pass.parent.children(), 3);
		// 		});
		// 		test('#createChildren(childData): preserves the ordering of child bids.',
		// 				function() {			
		// 					// arrange
		// 					var _1nt_dbl_pass_2s = constructBidSequence([
		// 		    			{type : "SUIT", level : 1, suit : "NOTRUMP"},
		// 	    			    {type : "DOUBLET"},
		// 	    			    {type : "PASS"},
		// 						{type : "SUIT", suit: "SPADES", level: 3}
		// 	   			    ]);
							
		// 					//act
		// 					_1nt_dbl_pass_2s.parent.createChildren([
		// 				       {bid : {type : "SUIT", suit: "SPADES", level: 2}},
		// 				       {bid : {type : "SUIT", suit: "SPADES", level: 4}, convention : "a ..."},
		// 				       {bid : {type : "SUIT", suit: "SPADES", level: 5}},
		// 				       {bid : {type : "SUIT", suit: "SPADES", level: 4, convention : "b ..."}}
		// 					 ]);
								
		// 					// assert
		// 					assert.equal(_1nt_dbl_pass_2s.parent.children()[0].bid.level, 2);
		// 					assert.equal(_1nt_dbl_pass_2s.parent.children()[1].bid.level, 3);
		// 					assert.equal(_1nt_dbl_pass_2s.parent.children()[2].bid.level, 4);
		// 					assert.equal(_1nt_dbl_pass_2s.parent.children()[3].bid.level, 4);
		// 					assert.equal(_1nt_dbl_pass_2s.parent.children()[4].bid.level, 5);
		// 		});
								
		// 	});
		// });
	});
});