define(function(require) {
	var assert = require('chai').assert;
	var clipboardManagerModule = require('mj/clipboard-manager');
	var selectionManagerModule = require('mj/selection-manager');
	
	//system under test
	var clipboardManager; 

	//test data
	var item1 = {id : "1"};
	var item2 = {id : "2"};
	var item3 = {id : "3"};
	var item4 = {id : "4"};
	
	
	setup( function(){ 
		var selectionManager = new selectionManagerModule.SelectionManager();
		clipboardManager = new clipboardManagerModule.ClipboardManager(selectionManager);
	});

	suite('ClipboardManager', function() {
		test('items are initially not cut', function() {
			assert.isFalse(clipboardManager.isCut(item1));
		});

		test('#cut() stores the selected items on the clipboard as cut items', function() {
			// arrange
			clipboardManager.toggleSelect(item1);
			clipboardManager.toggleSelect(item2);
				
			// act
			clipboardManager.cut();
			clipboardManager.toggleSelect(item2);

			// assert
			assert.isTrue(clipboardManager.isCut(item1));
			assert.isTrue(clipboardManager.isCut(item2));
			assert.isTrue(clipboardManager.isCutAction());
			assert.deepEqual(clipboardManager.getClippedItems(), [item1, item2]);
		});
		test('#copy() stores the selected items on the clipboard as copied items', function() {
			// arrange
			clipboardManager.toggleSelect(item1);
			clipboardManager.toggleSelect(item2);
				
			// act
			clipboardManager.copy();
			clipboardManager.toggleSelect(item2);

			// assert
			assert.isFalse(clipboardManager.isCut(item1));
			assert.isFalse(clipboardManager.isCut(item2));
			assert.isFalse(clipboardManager.isCutAction());
			assert.deepEqual(clipboardManager.getClippedItems(), [item1, item2]);
		});

		test('#cut() and #copy() overwrite the existing selection of clipped items', function() {
			// arrange
			clipboardManager.toggleSelect(item1);
			clipboardManager.toggleSelect(item2);
			clipboardManager.copy();
			assert.deepEqual(clipboardManager.getClippedItems(), [item1, item2]);
			
			clipboardManager.select(item3);
			clipboardManager.cut();
			assert.deepEqual(clipboardManager.getClippedItems(), [item3]);
			assert.isTrue(clipboardManager.isCutAction());

			clipboardManager.selectAll([item2, item4]);
			clipboardManager.copy();
			assert.deepEqual(clipboardManager.getClippedItems(), [item2, item4]);
			assert.isFalse(clipboardManager.isCutAction());
		});

		test('#reset() unclips all clipped items', function() {
			// arrange
			clipboardManager.toggleSelect(item1);
			clipboardManager.toggleSelect(item2);
			clipboardManager.cut();
			
			clipboardManager.reset();

			assert.isFalse(clipboardManager.isCutAction());
			assert.isFalse(clipboardManager.isCut(item1));
			assert.lengthOf(clipboardManager.getClippedItems(), 0);
		});
		test('#reset() deselects all selected items', function() {
			// arrange
			clipboardManager.toggleSelect(item1);
			clipboardManager.toggleSelect(item2);
			clipboardManager.copy();
			
			clipboardManager.reset();

			assert.isFalse(clipboardManager.isSelected(item1));
			assert.lengthOf(clipboardManager.getSelectedItems(), 0);
		});

	});
});