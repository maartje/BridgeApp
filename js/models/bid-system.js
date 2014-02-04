define(function(require, exports, module) {
    var bidConventionModule = require("models/bid-convention");
    var localStorageModule = require("storage/local-storage");

    var BidSystem = module.exports.BidSystem = function(data) {
        this.id = data.id;
        this.bidRoot = new bidConventionModule.BidConvention(data.bidRoot || {});
        this.bidRootOpponent = new bidConventionModule.BidConvention(data.bidRootOpponent || {});
    };

    BidSystem.prototype = function() {

        //methods for persistence of the bid system data

        var toJSON = function() {
            return {
                id: this.id,
                bidRoot: this.bidRoot,
                bidRootOpponent: this.bidRootOpponent
            };
        };

        var saveToLocalStorage = function() {
            localStorageModule.save(this.id, this);
        }

        var loadFromLocalStorage = function() {
            //TODO: what if ls does not exist?
            var bidsystemJS = localStorageModule.load(this.id);
            if (!bidsystemJS) {
                return null;
            }
            this.bidRoot = new bidConventionModule.BidConvention(bidsystemJS.bidRoot || {});
            this.bidRootOpponent = new bidConventionModule.BidConvention(bidsystemJS.bidRootOpponent || {});
        }

        //public members		
        return {
            toJSON: toJSON,
            saveToLocalStorage: saveToLocalStorage,
            loadFromLocalStorage: loadFromLocalStorage
        };
    }();

    return module.exports;
});
