/*global setup, test, suite*/

define(function(require) {
    var assert = require('chai').assert;
    var viewStatePropertyModule = require('viewmodels/view-state-property');
    var selectionManagerModule = require('viewmodels/selection-manager');
    var clipboardManagerModule = require('viewmodels/clipboard-manager');
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
    var item4 = {
        id: "4"
    };


    setup(function() {
        var selectionState = new viewStatePropertyModule.ViewStateProperty();
        var selectionManager = new selectionManagerModule.SelectionManager(selectionState);
        var clippedState = new viewStatePropertyModule.ViewStateProperty();
        var clipboardManager = new clipboardManagerModule.ClipboardManager(clippedState);
        var treeViewState = new viewStatePropertyModule.ViewStateProperty();
        var treeViewManager = new treeViewManagerModule.TreeViewManager(treeViewState);
        target = new viewStateManagerModule.ViewStateManager(
        selectionManager, clipboardManager, treeViewManager, item1);
    });

    suite('target', function() {
        test('#ViewStateManager(..., node) sets the current node', function() {
            assert.equal(target.getCurrentNode(), item1);
        });

        test('#setCurrentNode(node) sets the current node', function() {
            target.setCurrentNode(item2);
            assert.equal(target.getCurrentNode(), item2);
        });

        test('#getViewState() followed by #setViewState() restores the current node', function() {
            target.setCurrentNode(item2);
            var viewState = target.getViewState();
            target.setCurrentNode(item3);
            target.setViewState(viewState);
            assert.equal(target.getCurrentNode(), item2);
        });

        test('#getViewState() followed by #setViewState() restores the selected items', function() {
            var items = [item2, item3];
            target.setSelectedItems(items);
            var viewState = target.getViewState();
            target.deselect(item3);
            target.select(item4);
            target.setViewState(viewState);
            assert.equal(target.getSelectedItems(), items);
        });

        test('#getViewState() followed by #setViewState() restores the open items', function() {
            var items = [item2, item3];
            target.setOpenItems(items);
            var viewState = target.getViewState();
            target.close(item3);
            target.open(item4);
            target.setViewState(viewState);
            assert.equal(target.getOpenItems(), items);
        });

        test('#getViewState() followed by #setViewState() keeps the current clipped items', function() {
            var items = [item2, item3];
            target.cutAll(items);
            var viewState = target.getViewState();
            target.cutAll([item3]);
            target.setViewState(viewState);
            assert.deepEqual(target.getClippedItems(), [item3]);
        });

        test('#getViewState() followed by #setViewState() keeps the cut state if the clipped items were cut in both the old and the new state', function() {
            var items = [item2, item3];
            target.cutAll(items);
            var viewState = target.getViewState();
            target.open(item3);
            target.setViewState(viewState);
            assert.deepEqual(target.getCutItems(), items);
            assert.isTrue(target.isCut(item3));
        });

        test('#getViewState() followed by #setViewState() changes the cut status to copied in case the items in old and new were not both cut', function() {
            var items = [item2, item3];
            target.cutAll(items);
            var viewState = target.getViewState();
            target.cutAll([item3]);
            target.setViewState(viewState);
            assert.deepEqual(target.getCopiedItems(), [item3]);
            assert.deepEqual(target.getClippedItems(), [item3]);
            assert.deepEqual(target.getCutItems(), []);
            assert.isTrue(target.isCopied(item3));
            assert.isFalse(target.isCut(item3));
        });

        test('#clearViewState() sets the current node to null', function() {
            target.setCurrentNode(item2);
            target.clearViewState();
            assert.equal(target.getCurrentNode(), null);
        });

        test('#clearViewState() deselects all selected items', function() {
            target.select(item2);
            target.clearViewState();
            assert.lengthOf(target.getSelectedItems(), 0);
        });

        test('#clearViewState() closes all open items', function() {
            target.open(item2);
            target.toggleOpenClose(item3);
            target.clearViewState();
            assert.lengthOf(target.getOpenItems(), 0);
        });

        test('#clearViewState() unclippes all clipped items', function() {
            target.setCurrentNode(item2);
            target.clearViewState();
            assert.equal(target.getCurrentNode(), null);
        });

    });
});