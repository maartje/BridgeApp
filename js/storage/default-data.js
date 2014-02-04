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
                }
            }, {
                bid: {
                    type: "SUIT",
                    suit: "DIAMONDS",
                    level: 1
                }
            }, {
                bid: {
                    type: "SUIT",
                    suit: "HEARTS",
                    level: 1
                },
                convention: {
                    description: "5 kaart <span style='color : red'>&hearts;</span>"
                }
            }, {
                bid: {
                    type: "SUIT",
                    suit: "SPADES",
                    level: 1
                }
            }, {
                bid: {
                    type: "SUIT",
                    suit: "NOTRUMP",
                    level: 1
                },
                convention: {
                    description: "15-17 punten, sans-atout verdeling"
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
                    }, {
                        bid: {
                            type: "SUIT",
                            suit: "DIAMONDS",
                            level: 2
                        },
                        convention: {
                            description: "5+ <span>&hearts;</span>"
                        }
                    }, {
                        bid: {
                            type: "SUIT",
                            suit: "HEARTS",
                            level: 2
                        },
                        convention: {
                            description: "jacoby"
                        }
                    }]
                }]
            }]
        }
    };

    return module.exports;
});