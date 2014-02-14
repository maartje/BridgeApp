define(["knockout", "jquery", "viewmediators/ui-common"], function(ko, $, moduleUI) {

    /**
     * Binding handler to update model value strings that may contain html.
     * The model value is shown as html and edited as text. 
     */
    ko.bindingHandlers.htmlValue = {
        init: function(element, valueAccessor, allBindingsAccessor) {
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
                //TODO: more sophisticated cursor handling (click in the middle should result in a cursor in the middle)
            });

        },
        update: function(element, valueAccessor) {
            var htmlString = ko.utils.unwrapObservable(valueAccessor());
            if (!$(element).is(":focus")) { //prevent updating when in edit mode
                $(element).html(htmlString);
            }
        }
    };
});