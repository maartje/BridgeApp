/**
 * Helper functions for data persistence in the local storage
 */
define(function(require, exports, module) {

	/**
	 * Saves an object in the local storage 
	 * The object is saved as a JSON String 
	 */
	var save = module.exports.save = function(key, jsObject){
		var jsonString = JSON.stringify(jsObject);
		localStorage.setItem(key, jsonString);
	}
	
	/**
	 * Loads a JSON object from the local storage.
	 */
	var load = module.exports.load = function(key){
		var jsonString = localStorage.getItem(key);
		if (!jsonString){
			return null;
		}
		return JSON.parse(jsonString);
	}
			 
	return module.exports;
});