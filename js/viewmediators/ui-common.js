define(function(require, exports, module) {

	var setCursorToEndOfContenteditable = module.exports.setCursorToEndOfContenteditable = function(contentEditableElement)
	{
	    var range,selection;
	    if(document.createRange)//Firefox, Chrome, Opera, Safari, IE 9+
	    {
	        range = document.createRange();//Create a range (a range is a like the selection but invisible)
	        range.selectNodeContents(contentEditableElement);//Select the entire contents of the element with the range
	        range.collapse(false);//collapse the range to the end point. false means collapse to end rather than the start
	        selection = window.getSelection();//get the selection object (allows you to change selection)
	        selection.removeAllRanges();//remove any selections already made
	        selection.addRange(range);//make the range you have just created the visible selection
	    }
	    else if(document.selection)//IE 8 and lower
	    { 
	        range = document.body.createTextRange();//Create a range (a range is a like the selection but invisible)
	        range.moveToElementText(contentEditableElement);//Select the entire contents of the element with the range
	        range.collapse(false);//collapse the range to the end point. false means collapse to end rather than the start
	        range.select();//Select the range (make it the visible selection
	    }
	}
	
	var keycodes = module.exports.keycodes = {
		ENTER : 13,
		TAB : 9,
		SHIFT : 16,
		LEFT_ARROW : 37,
		UP_ARROW : 38,
		RIGHT_ARROW : 39,
		DOWN_ARROW : 40		
	}

	return module.exports;
});