/*global setup, test, suite*/

define(function(require) {
    var assert = require('chai').assert;
    var viewStatePropertyModule = require('viewmodels/view-state-property');
    var treeViewManagerModule = require('viewmodels/tree-view-manager');
    var viewStateManagerModule = require('viewmodels/view-state-manager');

    //system under test
    var target;

    //test data
    var item1 = {
        id: "1"
    };
    var item2 = {
        id: "2"
    };
    var item3 = {
        id: "3"
    };
    var items = [item1, item2, item3];

    setup(function() {
        var treeViewState = new viewStatePropertyModule.ViewStateProperty();
        var treeViewManager = new treeViewManagerModule.TreeViewManager(treeViewState);
        //target = treeViewManager;
        target = new viewStateManagerModule.ViewStateManager(null, null, treeViewManager);
    });

    suite('target', function() {
        test('items are initially closed', function() {
            assert.isFalse(target.isOpen(item1));
        });
        test('the collection of open items is initially empty', function() {
            assert.lengthOf(target.getOpenItems(), 0);
        });
        test('#open(item) opens the given item', function() {
            // act
            target.open(item1);
            target.open(item2);
            target.open(item2);

            // assert
            assert.isTrue(target.isOpen(item1));
            assert.isTrue(target.isOpen(item2));
            assert.isFalse(target.isOpen({
                id: "1"
            }));
        });
        test('#open(item), lets the item appear exactly once in the list of open items', function() {
            // arrange
            var oldLength = target.getOpenItems().length;

            // act
            target.open(item1);
            target.open(item2);
            target.open(item2);

            // assert
            assert.lengthOf(target.getOpenItems(), oldLength + 2);
            assert.include(target.getOpenItems(), item1);
            assert.include(target.getOpenItems(), item2);
        });

        test('#openAll(items) opens the given items', function() {
            target.open(item3);

            // act
            target.openAll([item1, item2]);

            // assert
            assert.isTrue(target.isOpen(item1));
            assert.isTrue(target.isOpen(item2));
            assert.isTrue(target.isOpen(item3));
            assert.isFalse(target.isOpen({
                id: "1"
            }));
            assert.lengthOf(target.getOpenItems(), 3);
        });

        test('#close(item) closes the given item', function() {
            // arrange
            target.open(item1);

            // act
            target.close(item1);
            target.close(item2);

            // assert
            assert.isFalse(target.isOpen(item1));
            assert.isFalse(target.isOpen(item2));
        });

        test('#close(item), removes the item from the list of open items', function() {
            // arrange
            target.open(item1);
            target.open(item2);
            var oldLength = target.getOpenItems().length;

            // act
            target.close(item2);

            // assert
            assert.lengthOf(target.getOpenItems(), oldLength - 1);
            assert.include(target.getOpenItems(), item1);
            assert.notInclude(target.getOpenItems(), item2);
        });

        test('#closeAll(items) closes the given items', function() {
            // arrange
            target.openAll([item1, item2, item3]);

            // act
            target.closeAll([item2, item3]);

            // assert
            assert.isTrue(target.isOpen(item1));
            assert.isFalse(target.isOpen(item2));
            assert.isFalse(target.isOpen(item3));
        });

        test('#toggleOpenClose(item) opens the given item in case it was previously closed', function() {
            // act
            target.toggleOpenClose(item1);

            // assert
            assert.isTrue(target.isOpen(item1));
        });

        test('#toggleOpenClose(item) closes the given item in case it was previously open', function() {
            // arrange
            target.open(item1);

            // act
            target.toggleOpenClose(item1);

            // assert
            assert.isFalse(target.isOpen(item1));
        });

        test('#toggleOpenClose(item) does not affect other open items', function() {
            // arrange
            target.open(item1);
            target.open(item2);

            // act
            target.toggleOpenClose(item2);
            target.toggleOpenClose(item3);

            // assert
            assert.isTrue(target.isOpen(item1));
            assert.isFalse(target.isOpen(item2));
            assert.isTrue(target.isOpen(item3));
        });

        test('#setOpenItems(items) sets the items as the open items', function() {
            // arrange
            target.open(item1);
            target.open(item2);

            // act
            target.setOpenItems([item2, item3]);

            // assert
            assert.isFalse(target.isOpen(item1));
            assert.isTrue(target.isOpen(item2));
            assert.isTrue(target.isOpen(item3));
        });


        test('#clear() closes all open items', function() {
            // arrange
            target.open(item1);
            target.open(item2);

            // act
            target.clear();

            // assert
            assert.isFalse(target.isOpen(item1));
            assert.isFalse(target.isOpen(item2));
        });

        test('#getOpenItems() returns the collection of open items', function() {
            target.setOpenItems(items);
            assert.deepEqual(target.getOpenItems(), items);
        });

    });
});
