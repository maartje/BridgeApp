/*global setup, test, suite*/

define(function(require) {
	var assert = require('chai').assert;
    var viewStatePropertyModule = require('viewmodels/view-state-property');
    var clipboardManagerModule = require('viewmodels/clipboard-manager');
    var viewStateManagerModule = require('viewmodels/view-state-manager');
	
	//system under test
	var target; 

	//test data
	var item1 = {id : "1"};
	var item2 = {id : "2"};
	var item3 = {id : "3"};
	var item4 = {id : "4"};
	
	
	setup( function(){ 
        var clippedState = new viewStatePropertyModule.ViewStateProperty();
        var clipboardManager = new clipboardManagerModule.ClipboardManager(clippedState);
        target = new viewStateManagerModule.ViewStateManager(null, clipboardManager);
	});

	suite('target', function() {
		test('items are initially not clipped', function() {
			assert.isFalse(target.isCut(item1));
			assert.isFalse(target.isCopied(item1));
			assert.isFalse(target.isClipped(item1));
			assert.lengthOf(target.getClippedItems(), 0);
		});

		test('#cutAll(items) stores the items on the clipboard as cut items', function() {
			// arrange

			// act
			target.cutAll([item1, item2]);

			// assert
			assert.isTrue(target.isClipped(item1));
			assert.isTrue(target.isClipped(item2));
			assert.isTrue(target.isCut(item1));
			assert.isTrue(target.isCut(item2));
			assert.isFalse(target.isCopied(item1));
			assert.isFalse(target.isCopied(item2));
			assert.deepEqual(target.getClippedItems(), [item1, item2]);
		});
		test('#copyAll(items) stores the items on the clipboard as copied items', function() {
			// arrange

			// act
			target.copyAll([item1, item2]);

			// assert
			assert.isTrue(target.isClipped(item1));
			assert.isTrue(target.isClipped(item2));
			assert.isFalse(target.isCut(item1));
			assert.isFalse(target.isCut(item2));
			assert.isTrue(target.isCopied(item1));
			assert.isTrue(target.isCopied(item2));
			assert.deepEqual(target.getClippedItems(), [item1, item2]);
		});

		test('#cutAll(items) and #copyAll(items) overwrite the existing selection of clipped items', function() {
			// arrange
			target.copyAll([item1, item2]);
			target.cutAll([item3]);
			assert.deepEqual(target.getClippedItems(), [item3]);
			target.copyAll([item2, item4]);
			assert.deepEqual(target.getClippedItems(), [item2, item4]);
		});

		test('#clear() unclips all clipped items', function() {
			// arrange
			target.cutAll([item1, item2]);
			
			target.clear();

			assert.isFalse(target.isCut(item1));
			assert.lengthOf(target.getClippedItems(), 0);
		});

		test('#getClippedItems(), #getCopiedItems(), #getCutItems() return respectively clipped, copied, and cut items', function() {
			// arrange

			// act
			target.copyAll([item1, item2]);

			// assert
			assert.deepEqual(target.getClippedItems(), [item1, item2]);
			assert.deepEqual(target.getCopiedItems(), [item1, item2]);
			assert.deepEqual(target.getCutItems(), []);

			// act
			target.cutAll([item1, item3]);

			// assert
			assert.deepEqual(target.getClippedItems(), [item1, item3]);
			assert.deepEqual(target.getCopiedItems(), []);
			assert.deepEqual(target.getCutItems(), [item1, item3]);
		});

		test('#isClipped(item), #isCopied(item), #isCut(item) say whether an item is respectively clipped, copied, or cut', function() {
			// arrange

			// act
			target.copyAll([item1, item2]);

			// assert
			assert.isTrue(target.isClipped(item1));
			assert.isTrue(target.isCopied(item1));
			assert.isFalse(target.isCut(item1));


			// act
			target.cutAll([item1, item3]);

			// assert
			assert.isTrue(target.isClipped(item1));
			assert.isFalse(target.isCopied(item1));
			assert.isTrue(target.isCut(item1));

		});


	});
});