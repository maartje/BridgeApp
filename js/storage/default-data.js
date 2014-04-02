/**
 * Default bidsystem defined as JSON data
 */
define(function(require, exports, module) {
    var localStorageModule = require("storage/local-storage");

	var saveToLocalStorage = module.exports.saveToLocalStorage = function(key){
		var jsonString = JSON.stringify(defaultBiddingSystem);
		localStorage.setItem(key, jsonString);
	}

    /**
     * JSON data that represents the bidding system that is shown in case no other
     * bidding system is set.
     */
    var defaultBiddingSystem = module.exports.defaultBiddingSystem = {
        bidRoot: {
            children: [{
                bid: {
                    type: "SUIT",
                    suit: "CLUBS",
                    level: 1
                },
                convention: {
                    description: "3+ kaart &clubs;, 12-19 punten"
                }
            }, {
                bid: {
                    type: "SUIT",
                    suit: "DIAMONDS",
                    level: 1
                },
                convention: {
                    description: "4+ kaart <span style='color : red'>&diams;</span>, 12-19 punten"
                }
            }, {
                bid: {
                    type: "SUIT",
                    suit: "HEARTS",
                    level: 1
                },
                convention: {
                    description: "5+ kaart <span style='color : red'>&hearts;</span>, 12-19 punten"
                }
            }, {
                bid: {
                    type: "SUIT",
                    suit: "SPADES",
                    level: 1
                },
                convention: {
                    description: "5+ kaart &spades;, 12-19 punten"
                }
            }, {
                bid: {
                    type: "SUIT",
                    suit: "NOTRUMP",
                    level: 1
                },
                convention: {
                    description: "sans-atout verdeling, 15-17 punten"
                },
                children: [{
                    bid: {
                        type: "PASS"
                    },
                    children: [{
                        bid: {
                            type: "SUIT",
                            suit: "CLUBS",
                            level: 2
                        },
                        convention: {
                            description: "stayman"
                        }
                    }]
                }]
            }]
        }
    };

    return module.exports;
});
