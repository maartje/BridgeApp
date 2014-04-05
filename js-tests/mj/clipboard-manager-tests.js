define(function(require) {
	var assert = require('chai').assert;
	var clipboardManagerModule = require('mj/clipboard-manager');
	
	suite('ClipboardManager', function() {
		suite('initial situation', function() {
			test('items are initially not cut', function() {
				// arrange
				var clipboardManager = new clipboardManagerModule.ClipboardManager();
				var item = {id : "1"};
				
				assert.isFalse(clipboardManager.isCut(item));
			});
			test('items are initially unselected', function() {
				// arrange
				var clipboardManager = new clipboardManagerModule.ClipboardManager();
				var item = {id : "1"};
				
				assert.isFalse(clipboardManager.isSelected(item));
			});
		});
		suite('manage selected items', function() {
			test('#select(item) selects the given item, in case it was previously unselected', function() {
				// arrange
				var clipboardManager = new clipboardManagerModule.ClipboardManager();
				var item = {id : "1"};
	
				// act
				clipboardManager.select(item);
	
				// assert
				assert.isTrue(clipboardManager.isSelected(item));
				assert.isFalse(clipboardManager.isSelected({id : "1"}));
			});
			test('#select(item) selects the given item, also in case it was already selected', function() {
				// arrange
				var clipboardManager = new clipboardManagerModule.ClipboardManager();
				var item = {id : "1"};
				clipboardManager.select(item);
	
				// act
				clipboardManager.select(item);
	
				// assert
				assert.isTrue(clipboardManager.isSelected(item));
			});
			test('#select(item) deselects other selected items', function() {
				// arrange
				var clipboardManager = new clipboardManagerModule.ClipboardManager();
				var item1 = {id : "1"};
				var item2 = {id : "2"};
				clipboardManager.select(item1);
	
				// act
				clipboardManager.select(item2);
	
				// assert
				assert.isFalse(clipboardManager.isSelected(item1));
				assert.isTrue(clipboardManager.isSelected(item2));
			});
			test('#toggleSelect(item) selects the given item in case it was previously unselected', function() {
				// arrange
				var clipboardManager = new clipboardManagerModule.ClipboardManager();
				var item1 = {id : "1"};
	
				// act
				clipboardManager.toggleSelect(item1);
	
				// assert
				assert.isTrue(clipboardManager.isSelected(item1));
			});
			test('#toggleSelect(item) deselects the given item in case it was previously selected', function() {
				// arrange
				var clipboardManager = new clipboardManagerModule.ClipboardManager();
				var item1 = {id : "1"};
				clipboardManager.toggleSelect(item1);
	
				// act
				clipboardManager.toggleSelect(item1);
	
				// assert
				assert.isFalse(clipboardManager.isSelected(item1));
			});
	
			test('#toggleSelect(item) does not affect other selected items', function() {
				// arrange
				var clipboardManager = new clipboardManagerModule.ClipboardManager();
				var item1 = {id : "1"};
				var item2 = {id : "2"};
				var item3 = {id : "3"};
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
	
			test('#selectRange(itemsInRange) selects all items in the given range', function() {
				// arrange
				var clipboardManager = new clipboardManagerModule.ClipboardManager();
				var item1 = {id : "x1"};
				var item2 = {id : "x2"};
				var item3 = {id : "x3"};
				clipboardManager.toggleSelect(item1);
	
				// act
				clipboardManager.selectRange([item1, item2, item3]);
	
				// assert
				assert.isTrue(clipboardManager.isSelected(item1));
				assert.isTrue(clipboardManager.isSelected(item2));
				assert.isTrue(clipboardManager.isSelected(item3));
			});
	
			test('#selectRange(itemsInRange) deselects all items that are not in the given range', function() {
				// arrange
				var clipboardManager = new clipboardManagerModule.ClipboardManager();
				var item1 = {id : "1"};
				var item2 = {id : "2"};
				var item3 = {id : "3"};
				clipboardManager.toggleSelect(item2);
				clipboardManager.toggleSelect(item3);
	
				// act
				clipboardManager.selectRange([item1, item2]);
	
				// assert
				assert.isTrue(clipboardManager.isSelected(item1));
				assert.isTrue(clipboardManager.isSelected(item2));
				assert.isFalse(clipboardManager.isSelected(item3));
			});
	
	
			test('#clearSelection() deselects all selected items', function() {
				// arrange
				var clipboardManager = new clipboardManagerModule.ClipboardManager();
				var item1 = {id : "1"};
				var item2 = {id : "2"};
				clipboardManager.toggleSelect(item1);
				clipboardManager.toggleSelect(item2);
	
				// act
				clipboardManager.clearSelection();
	
				// assert
				assert.isFalse(clipboardManager.isSelected(item1));
				assert.isFalse(clipboardManager.isSelected(item2));
			});		
		});		
		suite('clipboard behavior: delete, cut, copy, paste', function() {
			test('#delete(fnDeleteItem) applies fnDeleteItem to all selected items', function() {
				// arrange
				var clipboardManager = new clipboardManagerModule.ClipboardManager();
				var item1 = {id : "1"};
				var item2 = {id : "2"};
				clipboardManager.toggleSelect(item1);
				clipboardManager.toggleSelect(item2);
				
				var deletedItems = [];
				var fn = function(item){
					deletedItems.push(item);
				}
	
				// act
				clipboardManager.deleteSelection(fn);
	
				// assert
				assert.isTrue(deletedItems.indexOf(item1) >= 0);
				assert.isTrue(deletedItems.indexOf(item2) >= 0);
			});
			test('#delete(fnDeleteItem) deselects the deleted items', function() {
				// arrange
				var clipboardManager = new clipboardManagerModule.ClipboardManager();
				var item1 = {id : "1"};
				var item2 = {id : "2"};
				clipboardManager.toggleSelect(item1);
				clipboardManager.toggleSelect(item2);
	
				// act
				clipboardManager.deleteSelection(function(){});
	
				// assert
				assert.isFalse(clipboardManager.isSelected(item1));
				assert.isFalse(clipboardManager.isSelected(item2));
			});
			test('#cut(fnDeleteItem) applies fnDeleteItem to all selected items (in case fnDelete is defined)', function() {
				// arrange
				var clipboardManager = new clipboardManagerModule.ClipboardManager();
				var item1 = {id : "1"};
				var item2 = {id : "2"};
				clipboardManager.toggleSelect(item1);
				clipboardManager.toggleSelect(item2);
				
				var deletedItems = [];
				var fn = function(item){
					deletedItems.push(item);
				}
	
				// act
				clipboardManager.cut(fn);
	
				// assert
				assert.isTrue(deletedItems.indexOf(item1) >= 0);
				assert.isTrue(deletedItems.indexOf(item2) >= 0);
			});

			test('#isCut(item) says wether the given item is cut', function() {
				// arrange
				var clipboardManager = new clipboardManagerModule.ClipboardManager();
				var item1 = {id : "1"};
				var item2 = {id : "2"};
				clipboardManager.toggleSelect(item1);
				clipboardManager.toggleSelect(item2);
					
				// act
				clipboardManager.cut();
				clipboardManager.toggleSelect(item2);
	
				// assert
				assert.isTrue(clipboardManager.isCut(item1));
				assert.isTrue(clipboardManager.isCut(item2));
			});

			test('#copy(); #paste(fnPasteItem): applies fnPasteItem(selected, copied) to all pairs of selected and copied items', function() {
				// arrange
				//copied items
				var clipboardManager = new clipboardManagerModule.ClipboardManager();
				var copied1 = {id : "c1"};
				var copied2 = {id : "c2"};

				//selected items
				var selected1 = {id : "s1"};
				var selected2 = {id : "s2"};
				var selected3 = {id : "s3"};
				
				//fnPasteItem(selected, copied) function
				var copyPastePairs = [];
				var fnPasteItem = function(container, item){
					copyPastePairs.push({container: container, item: item});
				};

				// act
				clipboardManager.selectRange([copied1, copied2]);
				clipboardManager.copy();
				clipboardManager.selectRange([selected1, selected2, selected3]);
				clipboardManager.paste(fnPasteItem);
	
				// assert
				assert.lengthOf(copyPastePairs, 6);
			});	
			test('#cut(); #paste(fnPasteItem): applies fnPasteItem(selected, copied) to all pairs of selected and cut items', function() {
				// arrange
				//copied items
				var clipboardManager = new clipboardManagerModule.ClipboardManager();
				var cut1 = {id : "c1"};
				var cut2 = {id : "c2"};

				//selected items
				var selected1 = {id : "s1"};
				var selected2 = {id : "s2"};
				var selected3 = {id : "s3"};
				
				//fnPasteItem(selected, copied) function
				var cutPastePairs = [];
				var fnPasteItem = function(container, item){
					cutPastePairs.push({container: container, item: item});
				};

				// act
				clipboardManager.selectRange([cut1, cut2]);
				clipboardManager.cut();
				clipboardManager.selectRange([selected1, selected2, selected3]);
				clipboardManager.paste(fnPasteItem);
	
				// assert
				assert.lengthOf(cutPastePairs, 6);
			});	

			test('#copy(); #paste(fnPasteItem, fnDeleteItem): does not apply fnDeleteItem(item) to copied items', function() {
				// arrange
				//copied items
				var clipboardManager = new clipboardManagerModule.ClipboardManager();
				var copied1 = {id : "c1"};
				var copied2 = {id : "c2"};

				//selected items
				var selected1 = {id : "s1"};
				var selected2 = {id : "s2"};
				var selected3 = {id : "s3"};

				//fnDeleteItem(copied)
				var cutItems = [];
				var fnDeleteItem = function(item){
					cutItems.push(item);
				};

				// act
				clipboardManager.selectRange([copied1, copied2]);
				clipboardManager.copy();
				clipboardManager.selectRange([selected1, selected2, selected3]);
				clipboardManager.paste(function(){}, fnDeleteItem);
	
				// assert
				assert.lengthOf(cutItems, 0);
			});		

			test('#cut(); #paste(fnPasteItem, fnDeleteItem): does apply fnDeleteItem(item) to cut items', function() {
				// arrange
				//copied items
				var clipboardManager = new clipboardManagerModule.ClipboardManager();
				var cut1 = {id : "c1"};
				var cut2 = {id : "c2"};

				//selected items
				var selected1 = {id : "s1"};
				var selected2 = {id : "s2"};
				var selected3 = {id : "s3"};

				//fnDeleteItem(copied)
				var cutItems = [];
				var fnDeleteItem = function(item){
					cutItems.push(item);
				};

				// act
				clipboardManager.selectRange([cut1, cut2]);
				clipboardManager.cut();
				clipboardManager.selectRange([selected1, selected2, selected3]);
				clipboardManager.paste(function(){}, fnDeleteItem);
	
				// assert
				assert.lengthOf(cutItems, 2);
			});		
			test('#cut()(fndelete): deleted items are removed from the selection', function() {
				var clipboardManager = new clipboardManagerModule.ClipboardManager();
				var cut1 = {id : "c1"};
				var cut2 = {id : "c2"};

				// act
				clipboardManager.selectRange([cut1, cut2]);
				clipboardManager.cut(function(){});
	
				// assert
				assert.isFalse(clipboardManager.isSelected(cut1));
				assert.isFalse(clipboardManager.isSelected(cut2));
			});
			test('#cut(); paste(fnPasteItem, fndeleteItem): deleted items are removed from the selection', function() {
				var clipboardManager = new clipboardManagerModule.ClipboardManager();
				var cut1 = {id : "c1"};
				var cut2 = {id : "c2"};
				var cutselected1 = {id : "cs1"};
				var selected1 = {id : "s1"};

				// act
				clipboardManager.selectRange([cut1, cut2, cutselected1]);
				clipboardManager.cut();
				clipboardManager.selectRange([cutselected1, selected1]);
				clipboardManager.paste(function(){}, function(){});
	
				// assert
				assert.isFalse(clipboardManager.isSelected(cut1));
				assert.isFalse(clipboardManager.isSelected(cut2));
				assert.isFalse(clipboardManager.isSelected(cutselected1));
				assert.isTrue(clipboardManager.isSelected(selected1));
			});
		});		
	});
});