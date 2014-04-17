define(function(require) {
	var assert = require('chai').assert;
	var selectionManagerModule = require('mj/selection-manager');
	var clipboardManagerModule = require('mj/clipboard-manager');
	
	//system under test
	var clipboardManager; 
	
	//test data
	var item1 = {id : "1"};
	var item2 = {id : "2"};
	var item3 = {id : "3"};
	var items = [item1, item2, item3];

	setup( function(){ 
		//TODO: run this suite for selectionManager, clipboardManager, treeviewManager, ...
		var selectionManager = new selectionManagerModule.SelectionManager();
		clipboardManager = new clipboardManagerModule.ClipboardManager(selectionManager);
	});

	suite('SelectionManager', function() {
		test('items are initially unselected', function() {
			assert.isFalse(clipboardManager.isSelected(item1));
		});
		test('the collection of selected items is initially empty', function() {
			assert.lengthOf(clipboardManager.getSelectedItems(), 0);
		});
		test('#select(item) selects the given item, in case it was previously unselected', function() {
			// act
			clipboardManager.select(item1);

			// assert
			assert.isTrue(clipboardManager.isSelected(item1));
			assert.isFalse(clipboardManager.isSelected({id : "1"}));
		});
		test('#select(item) selects the given item, also in case it was already selected', function() {
			// arrange
			clipboardManager.select(item1);

			// act
			clipboardManager.select(item1);

			// assert
			assert.isTrue(clipboardManager.isSelected(item1));
		});
		test('#select(item) deselects other selected items', function() {
			// arrange
			clipboardManager.select(item1);

			// act
			clipboardManager.select(item2);

			// assert
			assert.isFalse(clipboardManager.isSelected(item1));
			assert.isTrue(clipboardManager.isSelected(item2));
		});
		test('#toggleSelect(item) selects the given item in case it was previously unselected', function() {
			// act
			clipboardManager.toggleSelect(item1);

			// assert
			assert.isTrue(clipboardManager.isSelected(item1));
		});
		test('#toggleSelect(item) deselects the given item in case it was previously selected', function() {
			// arrange
			clipboardManager.toggleSelect(item1);

			// act
			clipboardManager.toggleSelect(item1);

			// assert
			assert.isFalse(clipboardManager.isSelected(item1));
		});

		test('#toggleSelect(item) does not affect other selected items', function() {
			// arrange
			clipboardManager.toggleSelect(item1);
			clipboardManager.toggleSelect(item2);

			// act
			clipboardManager.toggleSelect(item2);
			clipboardManager.toggleSelect(item3);

			// assert
			assert.isTrue(clipboardManager.isSelected(item1));
			assert.isFalse(clipboardManager.isSelected(item2));
			assert.isTrue(clipboardManager.isSelected(item3));
		});

		test('#selectAll(items) selects all items in the given selection', function() {
			// arrange
			clipboardManager.toggleSelect(item1);

			// act
			clipboardManager.selectAll(items);

			// assert
			assert.isTrue(clipboardManager.isSelected(item1));
			assert.isTrue(clipboardManager.isSelected(item2));
			assert.isTrue(clipboardManager.isSelected(item3));
		});

		test('#selectRange(start, end, fnGetRange) selects all items in a range', function() {
			// arrange
			clipboardManager.toggleSelect(item1);
			var fnGetRange = function(a, b){
			    return [a, item2, b]
			} 

			// act
			clipboardManager.selectRange(item1, item3, fnGetRange);

			// assert
			assert.isTrue(clipboardManager.isSelected(item1));
			assert.isTrue(clipboardManager.isSelected(item2));
			assert.isTrue(clipboardManager.isSelected(item3));
		});

		test('#setFocus(items) selects all items in the given selection', function() {
			// arrange
			clipboardManager.toggleSelect(item1);

			// act
			clipboardManager.setFocus(items);

			// assert
			assert.isTrue(clipboardManager.isSelected(item1));
			assert.isTrue(clipboardManager.isSelected(item2));
			assert.isTrue(clipboardManager.isSelected(item3));
		});

		test('#selectAll(items) deselects all items that are not in the given collection', function() {
			// arrange
			clipboardManager.toggleSelect(item2);
			clipboardManager.toggleSelect(item3);

			// act
			clipboardManager.selectAll([item1, item2]);

			// assert
			assert.isTrue(clipboardManager.isSelected(item1));
			assert.isTrue(clipboardManager.isSelected(item2));
			assert.isFalse(clipboardManager.isSelected(item3));
		});

		test('#clearSelection() deselects all selected items', function() {
			// arrange
			clipboardManager.toggleSelect(item1);
			clipboardManager.toggleSelect(item2);

			// act
			clipboardManager.clearSelection();

			// assert
			assert.isFalse(clipboardManager.isSelected(item1));
			assert.isFalse(clipboardManager.isSelected(item2));
		});		
		test('#getSelectedItems returns the collection of selected items', function() {
			clipboardManager.selectAll(items);
			assert.deepEqual(clipboardManager.getSelectedItems(), items);
		});
		test('#reset() deselects all selected items', function() {
			// arrange
			clipboardManager.select(item1);
			clipboardManager.toggleSelect(item2);

			clipboardManager.reset();

			assert.isFalse(clipboardManager.isSelected(item1));
			assert.lengthOf(clipboardManager.getSelectedItems(), 0);
		});
	});
});

