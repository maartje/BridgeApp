define(["knockout", "jquery", "viewmediators/ui-common"], function(ko, $, moduleUI){
		
	/**
	 * Binding handler to update model values by editing the (html) content.
	 * The view element is initialized with the original model value and updated only after editing.
	 */
	ko.bindingHandlers.htmlValue = {
		init: function(element, valueAccessor, allBindingsAccessor) {
	        //ko.utils.setHtml(element, valueAccessor());
            //ko.utils.setTextContent(element, valueAccessor());
    	    var htmlString = ko.utils.unwrapObservable(valueAccessor());
	        $(element).html(htmlString);

	        var eventsToCatch = ["keyup", "change"];
	        $(element).on(eventsToCatch.join(" "), function() {
	            var modelValue = valueAccessor();
	            var elementHTML = $(element).text();
	            modelValue(elementHTML);
	        });
	        
	        $(element).on("blur", function() {
    	    	var htmlString = ko.utils.unwrapObservable(valueAccessor());
	            $(element).html(htmlString);
	        });

	        $(element).on("click", function() {
    	    	var htmlString = ko.utils.unwrapObservable(valueAccessor());
	            $(element).text(htmlString);
	            moduleUI.setCursorToEndOfContenteditable(element);
	        });

	    },
	    update : function(element, valueAccessor){
	    	var htmlString = ko.utils.unwrapObservable(valueAccessor());
	    	if(!$(element).is(":focus")){ //prevent updating when in edit mode
	    	    $(element).html(htmlString);
	    	}
	    }
	};
});