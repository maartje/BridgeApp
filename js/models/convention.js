/**
 * Represents the meaning of a given bidsequence
 */
define(function(require, exports, module) {
    var ko = require("knockout");

    var Convention = module.exports.Convention = function(data) {
        var cdata = data || {};
        this.description = ko.observable(cdata.description || "");
    };

    Convention.prototype = function() {
        var toJSON = function() {
            return {
                description: this.description()
            };
        };

        return {
            toJSON: toJSON
        };

    }();
});