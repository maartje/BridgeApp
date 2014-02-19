/**
 * Testdata in JSON format
 */
define(function(require, exports, module) {


    var bidRoot = module.exports.bidRoot = {"convention":{"description":""},"children":[{"bid":{"type":"SUIT","level":1,"suit":"NOTRUMP","ordering":7},"convention":{"description":"15-17 punten, sans-atout verdeling"},"children":[{"bid":{"type":"PASS","ordering":0},"convention":{"description":""},"children":[{"bid":{"type":"SUIT","level":2,"suit":"CLUBS","ordering":8},"convention":{"description":"stayman"},"children":[{"bid":{"type":"PASS","ordering":0},"convention":{"description":""},"children":[{"bid":{"type":"SUIT","level":2,"suit":"DIAMONDS","ordering":9},"convention":{"description":"geen 4 kaart hoog"},"children":[]},{"bid":{"type":"SUIT","level":2,"suit":"HEARTS","ordering":10},"convention":{"description":"4 kaar harten, mogelijk ook een 4 kaart schoppen"},"children":[]},{"bid":{"type":"SUIT","level":2,"suit":"SPADES","ordering":11},"convention":{"description":"4 kaart schoppen, geen 4 kaart harten"},"children":[]}]}]},{"bid":{"type":"SUIT","level":2,"suit":"DIAMONDS","ordering":9},"convention":{"description":"jocoby, 5+ <span style=\"color:red\">&hearts;</span>"},"children":[]},{"bid":{"type":"SUIT","level":2,"suit":"HEARTS","ordering":10},"convention":{"description":"jacoby, 5+ &spades;"},"children":[]}]}]}]};

    /**
     * JSON data that represents a bidsystem for basic 1NT and subsequent biddings
     */
    var testBiddingSystem = module.exports.testBiddingSystem = {
        "id" : "test_data_id", 
        "bidRoot" : bidRoot,
        "bidRootOpponent" : {"convention":{"description":""},"children":[]}
    };
    
    return module.exports;
});