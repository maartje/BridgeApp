define(["knockout", "jquery"], function(ko, $){
		
	/**
	 * Binding handler to update model values by editing the (html) content.
	 * The view element is initialized with the original model value and updated only after editing.
	 */
	ko.bindingHandlers.htmlValue = {
		init: function(element, valueAccessor, allBindingsAccessor) {
	        ko.utils.setHtml(element, valueAccessor());

	        var eventsToCatch = ["keyup"]; //"change", "blur"
	        $(element).on(eventsToCatch.join(" "), function() {
	            var modelValue = valueAccessor();
	            var elementHTML = $(element).html();
	            modelValue(elementHTML);
	        });
	    },
	    update : function(element, valueAccessor){
	    	var newHTMLString = ko.utils.unwrapObservable(valueAccessor());
	    	var oldHTMLString = $(element).html();
	    	if(oldHTMLString != newHTMLString) { //friendly updating during editing
	    		$(element).html(newHTMLString);
	    		//TODO: set cursor to end?? 
	    	}
	    }
	};
	
	/**
	 * Binding handler to update model values by editing the content.
	 * The view element is initialized with the original model value and updated only after editing.
	 */
	ko.bindingHandlers.textValue = {
		init: function(element, valueAccessor, allBindingsAccessor) {
	        ko.utils.setHtml(element, valueAccessor());

	        var eventsToCatch = ["keyup"]; //"change", "blur"
	        $(element).on(eventsToCatch.join(" "), function() {
	            var modelValue = valueAccessor();
	            var elementHTML = $(element).html();
	            modelValue(elementHTML);
	        });
	    },
	    update : function(element, valueAccessor){
	    	var newHTMLString = ko.utils.unwrapObservable(valueAccessor());
	    	var oldHTMLString = $(element).html();
	    	if(oldHTMLString != newHTMLString) { //friendly updating during editing
	    		$(element).html(newHTMLString);
	    		//TODO: set cursor to end?? 
	    	}
	    }
	};

});