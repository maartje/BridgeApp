/**
 * Default bidsystem defined as JSON data
 */
define(function(require, exports, module) {

	/**
	 * JSON data that represents the bidding system that is shown in case no other
	 * bidding system is set.
	 */
	var defaultBiddingSystem = module.exports.defaultBiddingSystem = {
		bidRoot : {
			children : [
			    {
					bid : {
						type : "SUIT",
						suit : "CLUBS", 
						level : 1
					}
			    },
		        {
					bid : {
						type : "SUIT",
						suit : "DIAMONDS", 
						level : 1
					}
			    },
		        {
					bid : {
						type : "SUIT",
						suit : "HEARTS", 
						level : 1
					}
			    },
		        {
					bid : {
						type : "SUIT",
						suit : "SPADES", 
						level : 1
					}
			    },
		        {
					bid : {
						type : "SUIT",
						suit : "NOTRUMP", 
						level : 1
					},
					convention : "15-17 punten, sans-atout verdeling",
					children : [{
					    bid : {type : "PASS"},
    					children : [
            			    {
            					bid : {
            						type : "SUIT",
            						suit : "CLUBS", 
            						level : 2
            					},
            					convention : "stayman"
            			    },
            		        {
            					bid : {
            						type : "SUIT",
            						suit : "DIAMONDS", 
            						level : 2
            					},
            					convention : "jacoby"
            			    },
            		        {
            					bid : {
            						type : "SUIT",
            						suit : "HEARTS", 
            						level : 2
            					},
            					convention : "jacoby"
            			    }
            			]
					}]
			    }
		    ]
		}
	}

	return module.exports;
});