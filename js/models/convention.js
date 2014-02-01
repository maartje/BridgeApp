define(function(require, exports, module) {
	var ko = require("knockout");
	require("viewmediators/binding-handlers");

	var Convention = module.exports.Convention = function (data) {
	    //description
	    //tags
	    //...
	    this.description = ko.observable(data.description || "");
	};
	
	Convention.prototype = function(){
	    var toJSON = function() {
		    return {
		    	description : this.description()
		    };
		};
		
		return {
		    toJSON : toJSON    
		};

	}();
});