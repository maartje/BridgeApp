define(function(require, exports, module) {

	var Bid = module.exports.Bid = function (data) {
		this.type = data.type;
		this.level = data.type === "SUIT"? data.level : undefined;
		this.suit = data.type === "SUIT"? data.suit : undefined;
	};	

	return module.exports;
});

