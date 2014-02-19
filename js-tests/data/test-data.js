/**
 * Testdata in JSON format
 */
define(function(require, exports, module) {
    var bidModule = require("models/bid");
    var bidsystemModule = require('models/bidsystem');
    var bidconventionModule = require('models/bidconvention');

    var bidRootData = module.exports.bidRootData = {"convention":{"description":""},"children":[{"bid":{"type":"SUIT","level":1,"suit":"NOTRUMP","ordering":7},"convention":{"description":"15-17 punten, sans-atout verdeling"},"children":[{"bid":{"type":"PASS","ordering":0},"convention":{"description":""},"children":[{"bid":{"type":"SUIT","level":2,"suit":"CLUBS","ordering":8},"convention":{"description":"stayman"},"children":[{"bid":{"type":"PASS","ordering":0},"convention":{"description":""},"children":[{"bid":{"type":"SUIT","level":2,"suit":"DIAMONDS","ordering":9},"convention":{"description":"geen 4 kaart hoog"},"children":[]},{"bid":{"type":"SUIT","level":2,"suit":"HEARTS","ordering":10},"convention":{"description":"4 kaar harten, mogelijk ook een 4 kaart schoppen"},"children":[]},{"bid":{"type":"SUIT","level":2,"suit":"SPADES","ordering":11},"convention":{"description":"4 kaart schoppen, geen 4 kaart harten"},"children":[]}]}]},{"bid":{"type":"SUIT","level":2,"suit":"DIAMONDS","ordering":9},"convention":{"description":"jocoby, 5+ <span style=\"color:red\">&hearts;</span>"},"children":[]},{"bid":{"type":"SUIT","level":2,"suit":"HEARTS","ordering":10},"convention":{"description":"jacoby, 5+ &spades;"},"children":[]}]}]}]};

    /**
     * JSON data that represents a bidsystem for basic 1NT and subsequent biddings
     */
    var biddingSystemData = module.exports.biddingSystemData = {
        "id" : "test_data_id", 
        "bidRoot" : bidRootData,
        "bidRootOpponent" : {"convention":{"description":""},"children":[]}
    };
    
    var bidRoot = module.exports.bidRoot = new bidconventionModule.Bidconvention(bidRootData);
    
    var biddingSystem = module.exports.biddingSystem = new bidsystemModule.Bidsystem(biddingSystemData);
    
    var bc_1nt = module.exports.bc_1nt = bidRoot.children()[0];
    var bc_1nt_pass = module.exports.bc_1nt_pass = bc_1nt.children()[0];
    var bc_1nt_pass_2c = module.exports.bc_1nt_pass_2c = bc_1nt_pass.children()[0];
    var bc_1nt_pass_2d = module.exports.bc_1nt_pass_2d = bc_1nt_pass.children()[1];
    var bc_1nt_pass_2h = module.exports.bc_1nt_pass_2h = bc_1nt_pass.children()[2];

    
    var pass = module.exports.pass = new bidModule.createBid({
        type: "PASS"
    });

    var dbl = module.exports.dbl = new bidModule.createBid({
        type: "DOUBLET"
    });

    var redbl = module.exports.redbl = new bidModule.createBid({
        type: "REDOUBLET"
    });

    var bid_1c = module.exports.bid_1c = new bidModule.createBid({
        type : "SUIT",
        suit : "CLUBS",
        level : 1
    });

    var bid_2c = module.exports.bid_2c = new bidModule.createBid({
        type : "SUIT",
        suit : "CLUBS",
        level : 2
    });
    
    return module.exports;
});