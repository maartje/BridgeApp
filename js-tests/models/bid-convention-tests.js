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
						convention : "5+ schoppen, vanaf 5 punten."}]}]};
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
		suite('Validation of BidConvention objects', function() {
			
			var constructBidSequence = function(bidArray){
				var bcRoot = new bcModule.BidConvention({});
				var bcNode = bcRoot;
				while (bidArray.length > 0){
					var nextBid = bidArray.shift();
					bcNode = bcNode.createChild({bid : nextBid});
				}
				return bcNode;
			};

			suite('Validation of BidConvention objects: Bidding Finished', function() {
				test('#isValidChildBid(bid): "[PASS, PASS, PASS, PASS, ***]" is not valid.',
					function() {			
						// arrange
						var pass_pass_pass_pass = constructBidSequence([
						    {type : "PASS"},
		    			    {type : "PASS"},
		    			    {type : "PASS"},
		    			    {type : "PASS"}
					    ]);
						var suitBid = {type : "SUIT", level : 2, suit : "SPADES"};
						var pass = {type : "PASS"}
						var dbl = {type : "DOUBLET"}
						var redbl = {type : "REDOUBLET"}
						
						// assert
						assert.isFalse(pass_pass_pass_pass.isValidChildBid(suitBid));
						assert.isFalse(pass_pass_pass_pass.isValidChildBid(pass));
						assert.isFalse(pass_pass_pass_pass.isValidChildBid(dbl));
						assert.isFalse(pass_pass_pass_pass.isValidChildBid(redbl));
	
				});
				test('#isValidChildBid(bid): "[SUIT, PASS, PASS, PASS, ***]" is not valid.',
					function() {			
						// arrange
						var _1nt_pass_pass_pass = constructBidSequence([
		    			    {type : "SUIT", level : 1, suit : "NOTRUMP"},
		    			    {type : "PASS"},
		    			    {type : "PASS"},
		    			    {type : "PASS"}
					    ]);
						var suitBid = {type : "SUIT", level : 2, suit : "SPADES"};
						var pass = {type : "PASS"}
						var dbl = {type : "DOUBLET"}
						var redbl = {type : "REDOUBLET"}
						
						// assert
						assert.isFalse(_1nt_pass_pass_pass.isValidChildBid(suitBid));
						assert.isFalse(_1nt_pass_pass_pass.isValidChildBid(pass));
						assert.isFalse(_1nt_pass_pass_pass.isValidChildBid(dbl));
						assert.isFalse(_1nt_pass_pass_pass.isValidChildBid(redbl));	
				});
				test('#isValidChildBid(bid): "[DBL, PASS, PASS, PASS, ***]" is not valid.',
					function() {			
						// arrange
						var _1nt_dbl_pass_pass_pass = constructBidSequence([
		    			    {type : "SUIT", level : 1, suit : "NOTRUMP"},
		    			    {type : "DOUBLET"},
		    			    {type : "PASS"},
		    			    {type : "PASS"},
		    			    {type : "PASS"}
					    ]);
						var suitBid = {type : "SUIT", level : 2, suit : "SPADES"};
						var pass = {type : "PASS"}
						var dbl = {type : "DOUBLET"}
						var redbl = {type : "REDOUBLET"}
						
						// assert
						assert.isFalse(_1nt_dbl_pass_pass_pass.isValidChildBid(suitBid));
						assert.isFalse(_1nt_dbl_pass_pass_pass.isValidChildBid(pass));
						assert.isFalse(_1nt_dbl_pass_pass_pass.isValidChildBid(dbl));
						assert.isFalse(_1nt_dbl_pass_pass_pass.isValidChildBid(redbl));	
				});
				test('#isValidChildBid(bid): "[REDBL, PASS, PASS, PASS, ***]" is not valid.',
					function() {			
						// arrange
						var _1nt_dbl_redbl_pass_pass_pass = constructBidSequence([
		    			    {type : "SUIT", level : 1, suit : "NOTRUMP"},
		    			    {type : "DOUBLET"},
		    			    {type : "REDOUBLET"},
		    			    {type : "PASS"},
		    			    {type : "PASS"},
		    			    {type : "PASS"}
					    ]);
						var suitBid = {type : "SUIT", level : 2, suit : "SPADES"};
						var pass = {type : "PASS"}
						var dbl = {type : "DOUBLET"}
						var redbl = {type : "REDOUBLET"}
						
						// assert
						assert.isFalse(_1nt_dbl_redbl_pass_pass_pass.isValidChildBid(suitBid));
						assert.isFalse(_1nt_dbl_redbl_pass_pass_pass.isValidChildBid(pass));
						assert.isFalse(_1nt_dbl_redbl_pass_pass_pass.isValidChildBid(dbl));
						assert.isFalse(_1nt_dbl_redbl_pass_pass_pass.isValidChildBid(redbl));	
				});
			});
			suite('Validation of BidConvention objects: REDOUBLET', function() {
				test('#isValidChildBid(bid): "[SUIT, REDBL]" and "[REDBL, REDBL]" are invalid.',
					function() {			
						// arrange
						var _1nt = constructBidSequence([
		       			    {type : "SUIT", level : 1, suit : "NOTRUMP"}
		   			    ]);
						var _1nt_dbl_redbl = constructBidSequence([
   		    			    {type : "SUIT", level : 1, suit : "NOTRUMP"},
   		    			    {type : "DOUBLET"},
   		    			    {type : "REDOUBLET"}
   					    ]);
						
						// assert
						assert.isFalse(_1nt.isValidChildBid({type : "REDOUBLET"}));
						assert.isFalse(_1nt_dbl_redbl.isValidChildBid({type : "REDOUBLET"}));
				});
				test('#isValidChildBid(bid): "[DBL,  REDBL]" is valid.',
					function() {			
						// arrange
						var _1nt_dbl = constructBidSequence([
	 	    			    {type : "SUIT", level : 1, suit : "NOTRUMP"},
		    			    {type : "DOUBLET"}
		   			    ]);
							
						// assert
						assert.isTrue(_1nt_dbl.isValidChildBid({type : "REDOUBLET"}));
				});
	
				test('#isValidChildBid(bid): and "[SUIT, PASS, REDBL]", "[DBL, PASS, REDBL]" and "[REDBL, PASS, REDBL]" are invalid.',
					function() {			
						// arrange
						var _1nt_pass = constructBidSequence([
	  		    			{type : "SUIT", level : 1, suit : "NOTRUMP"},
	  	    			    {type : "PASS"}
	  	   			    ]);
						var _1nt_dbl_pass = constructBidSequence([
			    			{type : "SUIT", level : 1, suit : "NOTRUMP"},
		    			    {type : "DOUBLET"},
		    			    {type : "PASS"}
		   			    ]);
						var _1nt_dbl_redbl_pass = constructBidSequence([
		    			    {type : "SUIT", level : 1, suit : "NOTRUMP"},
		    			    {type : "DOUBLET"},
		    			    {type : "REDOUBLET"},
		    			    {type : "PASS"}
					    ]);
							
						// assert
						assert.isFalse(_1nt_pass.isValidChildBid({type : "REDOUBLET"}));
						assert.isFalse(_1nt_dbl_pass.isValidChildBid({type : "REDOUBLET"}));
						assert.isFalse(_1nt_dbl_redbl_pass.isValidChildBid({type : "REDOUBLET"}));
				});
				
				test('#isValidChildBid(bid): "[DBL, PASS, PASS, REDBL]" is valid.',
					function() {			
						// arrange
						var _1nt_dbl_pass_pass = constructBidSequence([
			    			{type : "SUIT", level : 1, suit : "NOTRUMP"},
		    			    {type : "DOUBLET"},
		    			    {type : "PASS"},
	  	    			    {type : "PASS"}
		   			    ]);
							
						// assert
						assert.isTrue(_1nt_dbl_pass_pass.isValidChildBid({type : "REDOUBLET"}));
				});
	
				test('#isValidChildBid(bid): and "[PASS, PASS, PASS, REDBL]", "[DBL, PASS, PASS, REDBL]" and "[REDBL, PASS, PASS, REDBL]" are invalid.',
						function() {			
							// arrange
							var pass_pass_pass = constructBidSequence([
	   	  	    			    {type : "PASS"},
		  	    			    {type : "PASS"},
		  	    			    {type : "PASS"}
		  	   			    ]);
							var _1nt_dbl_redbl_pass_pass = constructBidSequence([
			    			    {type : "SUIT", level : 1, suit : "NOTRUMP"},
			    			    {type : "DOUBLET"},
			    			    {type : "REDOUBLET"},
			    			    {type : "PASS"},
		  	    			    {type : "PASS"}
						    ]);
							var _1nt_pass_pass = constructBidSequence([
     		       			    {type : "SUIT", level : 1, suit : "NOTRUMP"},
     		       			    {type : "PASS"},
     		       			    {type : "PASS"}
     		   			    ]);
								
							// assert
							assert.isFalse(pass_pass_pass.isValidChildBid({type : "REDOUBLET"}));
							assert.isFalse(_1nt_dbl_redbl_pass_pass.isValidChildBid({type : "REDOUBLET"}));
							assert.isFalse(_1nt_pass_pass.isValidChildBid({type : "REDOUBLET"}));
				});
			});
			suite('Validation of BidConvention objects: DOUBLET', function() {
				test('#isValidChildBid(bid): "[SUIT, DBL]" is valid.',
					function() {			
						// arrange
						var _1nt = constructBidSequence([
		       			    {type : "SUIT", level : 1, suit : "NOTRUMP"}
		   			    ]);
						
						// assert
						assert.isTrue(_1nt.isValidChildBid({type : "DOUBLET"}));
				});
				test('#isValidChildBid(bid): "[DBL,  DBL]" and "[REDBL, DBL]" are invalid.',
					function() {			
						// arrange
						var _1nt_dbl = constructBidSequence([
	 	    			    {type : "SUIT", level : 1, suit : "NOTRUMP"},
		    			    {type : "DOUBLET"}
		   			    ]);
						var _1nt_dbl_redbl = constructBidSequence([
		    			    {type : "SUIT", level : 1, suit : "NOTRUMP"},
		    			    {type : "DOUBLET"},
		    			    {type : "REDOUBLET"}
					    ]);
							
						// assert
						assert.isFalse(_1nt_dbl.isValidChildBid({type : "DOUBLET"}));
						assert.isFalse(_1nt_dbl_redbl.isValidChildBid({type : "DOUBLET"}));
				});
	
				test('#isValidChildBid(bid): and "[SUIT, PASS, DBL]", "[DBL, PASS, DBL]" and "[REDBL, PASS, DBL]" are invalid.',
					function() {			
						// arrange
						var _1nt_pass = constructBidSequence([
	  		    			{type : "SUIT", level : 1, suit : "NOTRUMP"},
	  	    			    {type : "PASS"}
	  	   			    ]);
						var _1nt_dbl_pass = constructBidSequence([
			    			{type : "SUIT", level : 1, suit : "NOTRUMP"},
		    			    {type : "DOUBLET"},
		    			    {type : "PASS"}
		   			    ]);
						var _1nt_dbl_redbl_pass = constructBidSequence([
		    			    {type : "SUIT", level : 1, suit : "NOTRUMP"},
		    			    {type : "DOUBLET"},
		    			    {type : "REDOUBLET"},
		    			    {type : "PASS"}
					    ]);
							
						// assert
						assert.isFalse(_1nt_pass.isValidChildBid({type : "DOUBLET"}));
						assert.isFalse(_1nt_dbl_pass.isValidChildBid({type : "DOUBLET"}));
						assert.isFalse(_1nt_dbl_redbl_pass.isValidChildBid({type : "DOUBLET"}));
				});
				
				test('#isValidChildBid(bid): "[SUIT, PASS, PASS, DBL]" is valid.',
					function() {			
						// arrange
						var _1nt_pass_pass = constructBidSequence([
		       			    {type : "SUIT", level : 1, suit : "NOTRUMP"},
		       			    {type : "PASS"},
		       			    {type : "PASS"}
		   			    ]);
							
						// assert
						assert.isTrue(_1nt_pass_pass.isValidChildBid({type : "DOUBLET"}));
				});
	
				test('#isValidChildBid(bid): and "[PASS, PASS, PASS, DBL]", "[DBL, PASS, PASS, DBL]" and "[REDBL, PASS, PASS, DBL]" are invalid.',
						function() {			
							// arrange
							var pass_pass_pass = constructBidSequence([
	   	  	    			    {type : "PASS"},
		  	    			    {type : "PASS"},
		  	    			    {type : "PASS"}
		  	   			    ]);
							var _1nt_dbl_pass_pass = constructBidSequence([
				    			{type : "SUIT", level : 1, suit : "NOTRUMP"},
			    			    {type : "DOUBLET"},
			    			    {type : "PASS"},
		  	    			    {type : "PASS"}
			   			    ]);
							var _1nt_dbl_redbl_pass_pass = constructBidSequence([
			    			    {type : "SUIT", level : 1, suit : "NOTRUMP"},
			    			    {type : "DOUBLET"},
			    			    {type : "REDOUBLET"},
			    			    {type : "PASS"},
		  	    			    {type : "PASS"}
						    ]);
								
							// assert
							assert.isFalse(pass_pass_pass.isValidChildBid({type : "DOUBLET"}));
							assert.isFalse(_1nt_dbl_pass_pass.isValidChildBid({type : "DOUBLET"}));
							assert.isFalse(_1nt_dbl_redbl_pass_pass.isValidChildBid({type : "DOUBLET"}));
				});
			});
		});
	});
});