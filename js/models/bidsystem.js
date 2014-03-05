/**
 * Represents a bidsystem containing conventions for certain bidsequences
 */
define(function(require, exports, module) {
    var bidconventionModule = require("models/bidconvention");
    var localStorageModule = require("storage/local-storage");

    var Bidsystem = module.exports.Bidsystem = function(data) {
        var bsdata = data || {};
        this.id = bsdata.id;
        this.bidRoot = new bidconventionModule.Bidconvention(bsdata.bidRoot || {});
        this.bidRootOpponent = new bidconventionModule.Bidconvention(bsdata.bidRootOpponent || {});
    };

    Bidsystem.prototype = function() {

        //methods for persistence of the bid system data

        var toJSON = function() {
            return {
                id: this.id,
                bidRoot: this.bidRoot? this.bidRoot.toJSON() : null,
                bidRootOpponent: this.bidRootOpponent? this.bidRootOpponent.toJSON() : null
            };
        };

        var saveToLocalStorage = function() {
            localStorageModule.save(this.id, this);
        }

        var loadFromLocalStorage = function() {
            var bidsystemJS = localStorageModule.load(this.id);
            if (!bidsystemJS) {
                return null;
            }
            this.bidRoot = new bidconventionModule.Bidconvention(bidsystemJS.bidRoot || {});
            this.bidRootOpponent = new bidconventionModule.Bidconvention(bidsystemJS.bidRootOpponent || {});
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
