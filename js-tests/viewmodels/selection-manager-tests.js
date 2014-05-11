/*global setup, test, suite*/

define(function(require) {
    var assert = require('chai').assert;
    var viewStatePropertyModule = require('viewmodels/view-state-property');
    var selectionManagerModule = require('viewmodels/selection-manager');
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
        var selectionState = new viewStatePropertyModule.ViewStateProperty();
        var selectionManager = new selectionManagerModule.SelectionManager(selectionState);
        //target = selectionManager;
        target = new viewStateManagerModule.ViewStateManager(selectionManager);
    });

    suite('target', function() {
        test('items are initially unselected', function() {
            assert.isFalse(target.isSelected(item1));
        });
        test('the collection of selected items is initially empty', function() {
            assert.lengthOf(target.getSelectedItems(), 0);
        });
        test('#select(item) selects the given item', function() {
            // act
            target.select(item1);
            target.select(item2);
            target.select(item2);

            // assert
            assert.isTrue(target.isSelected(item1));
            assert.isTrue(target.isSelected(item2));
            assert.isFalse(target.isSelected({
                id: "1"
            }));
        });
        test('#select(item), let the item appear exactly once in the list of selected items', function() {
            // arrange
            var oldLength = target.getSelectedItems().length;

            // act
            target.select(item1);
            target.select(item2);
            target.select(item2);

            // assert
            assert.lengthOf(target.getSelectedItems(), oldLength + 2);
            assert.include(target.getSelectedItems(), item1);
            assert.include(target.getSelectedItems(), item2);
        });

        test('#deselect(item) deselects the given item', function() {
            // arrange
            target.select(item1);

            // act
            target.deselect(item1);
            target.deselect(item2);

            // assert
            assert.isFalse(target.isSelected(item1));
            assert.isFalse(target.isSelected(item2));
        });

        test('#deselect(item), removes the item from the list of selected items', function() {
            // arrange
            target.select(item1);
            target.select(item2);
            var oldLength = target.getSelectedItems().length;

            // act
            target.deselect(item2);

            // assert
            assert.lengthOf(target.getSelectedItems(), oldLength - 1);
            assert.include(target.getSelectedItems(), item1);
            assert.notInclude(target.getSelectedItems(), item2);
        });

        test('#toggleSelect(item) selects the given item in case it was previously unselected', function() {
            // act
            target.toggleSelect(item1);

            // assert
            assert.isTrue(target.isSelected(item1));
        });

        test('#toggleSelect(item) deselects the given item in case it was previously selected', function() {
            // arrange
            target.toggleSelect(item1);

            // act
            target.toggleSelect(item1);

            // assert
            assert.isFalse(target.isSelected(item1));
        });

        test('#toggleSelect(item) does not affect other selected items', function() {
            // arrange
            target.toggleSelect(item1);
            target.toggleSelect(item2);

            // act
            target.toggleSelect(item2);
            target.toggleSelect(item3);

            // assert
            assert.isTrue(target.isSelected(item1));
            assert.isFalse(target.isSelected(item2));
            assert.isTrue(target.isSelected(item3));
        });

        test('#singleSelect(item) sets the item as the single selected item', function() {
            // arrange
            target.select(item1);
            target.select(item2);

            // act
            target.singleSelect(item3);

            // assert
            assert.isFalse(target.isSelected(item1));
            assert.isTrue(target.isSelected(item3));
            assert.lengthOf(target.getSelectedItems(), 1);
        });

        test('#setSelectedItems(items) sets the items as the selected items', function() {
            // arrange
            target.select(item1);
            target.select(item2);

            // act
            target.setSelectedItems([item2, item3]);

            // assert
            assert.isFalse(target.isSelected(item1));
            assert.isTrue(target.isSelected(item2));
            assert.isTrue(target.isSelected(item3));
        });

        test('#selectRange(start, end, fnGetRange) selects all items in a range', function() {
            // arrange
            target.toggleSelect(item1);
            var fnGetRange = function(a, b) {
                return [a, item2, b];
            };

            // act
            target.selectRange(item1, item3, fnGetRange);

            // assert
            assert.isTrue(target.isSelected(item1));
            assert.isTrue(target.isSelected(item2));
            assert.isTrue(target.isSelected(item3));
        });

        test('#clear() deselects all selected items', function() {
            // arrange
            target.select(item1);
            target.select(item2);

            // act
            target.clear();

            // assert
            assert.isFalse(target.isSelected(item1));
            assert.isFalse(target.isSelected(item2));
        });

        test('#getSelectedItems() returns the collection of selected items', function() {
            target.setSelectedItems(items);
            assert.deepEqual(target.getSelectedItems(), items);
        });

    });
});
