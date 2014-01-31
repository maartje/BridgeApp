define(function(require, exports, module) {
	var ko = require("knockout");
	require("viewmediators/binding-handlers");

	var Convention = module.exports.Convention = function (data) {
	    //description
	    //tags
	    //...
	    this.description = ko.observable(data.description || "");
	    if (typeof data.isEditable != 'undefined') {
			this.isEditable = ko.observable(data.isEditable);
		}
		else {
			this.isEditable = ko.observable(false);
		}
		
		//TODO isEditable non-persistence
	};
});