define(function(require, exports, module) {

	var Pass = module.exports.Pass = function () {};

	var Doublet = module.exports.Doublet = function () {};

	var Redoublet = module.exports.Redoublet = function () {};

	var Bid = module.exports.Bid = function (data) {
		var that = this;
		that.level = data.level;
		that.suit = data.suit;
	};	

	return module.exports;
});

