define(function(require, exports, module) {
	var ko = require("knockout");
	var ko_validation = require("knockout-validation");

	var Bid = module.exports.Bid = function (data) {
		var that = this;
		that.type = ko.observable(data.type);
		that.level = ko.observable(data.level);
		that.suit = ko.observable(data.suit);

		
		that.type.extend({pattern : "PASS|DBL|REDBL|SUIT", required: true});
		
		that.level.extend({ min: 1, max: 7, digit: true, required: { onlyIf: function() { return that.type() === "SUIT"; } }});
		
		that.suit.extend({pattern : "CLUBS|DIAMONDS|HEARTS|SPADES|NOTRUMP", required: { onlyIf: function() { return that.type() === "SUIT"; } } });

		that.isValid = ko.computed(function(){
			return that.type.isValid() && that.level.isValid() && that.suit.isValid();
		});
	};	
	
	return module.exports;
});

