/*global setup, test, suite*/

define(function(require) {
    var assert = require('chai').assert;
    var baseCommandModule = require('mj/commands/base-command');
    var insertCommandModule = require('mj/commands/insert-command');
    var fakeViewStateManagerModule = require('../../fake-objects/fake-viewstate-manager');
    var fakeNodeModule = require('../../fake-objects/fake-tree-node');

    //system under test
    var insertCommand;
    
    //mock and stub objects
    var fakeViewstateManager;
    var node_000;
    var node_001;
    

    suite('InsertCommand', function() {
        setup(function() {
            fakeViewstateManager = new fakeViewStateManagerModule.FakeViewStateManager();
            fakeNodeModule.initializeTestData();
            var baseCommand = new baseCommandModule.BaseCommand(fakeViewstateManager);
            var fakeTreeNodeCollection = new fakeNodeModule.FakeTreeNodeCollection([]);
            insertCommand = new insertCommandModule.InsertCommand(baseCommand, fakeTreeNodeCollection);
    
            node_000 = new fakeNodeModule.FakeTreeNode("000", []);
            node_001 = new fakeNodeModule.FakeTreeNode("000", []);
            node_000.parent = fakeNodeModule.node_00;
            node_001.parent = fakeNodeModule.node_00;
            var treeNodeCollection = new fakeNodeModule.FakeTreeNodeCollection([node_000, node_001]);
            insertCommand.setTreeNodeCollection(treeNodeCollection);
    
        });

        test('#execute() attachs the given set of nodes to the data structure', function() {
            // act
            insertCommand.execute();

            // assert
            assert.isTrue(node_000.isAttached);
            assert.isTrue(node_001.isAttached);
        });
        
        test('#execute() sets the focus of the viewstate on the inserted nodes', function() {
            // act
            insertCommand.execute();

            // assert
            assert.deepEqual(fakeViewstateManager._focusedItems, [node_000, node_001]);
        });


        test('#undoExecute() resets the viewstate', function() {
            // arrange
            var expectedViewState = fakeViewstateManager.getViewState();

            // act
            insertCommand.execute();
            insertCommand.undoExecute();

            // assert
            assert.equal(fakeViewstateManager.getViewState(), expectedViewState);
        });

        test('#undoExecute() restores the data structure by attaching all detached nodes', function() {
            // arrange

            // act
            insertCommand.execute();
            insertCommand.undoExecute();

            // assert
            assert.isFalse(node_000.isAttached);
            assert.isFalse(node_001.isAttached);
        });
        
        test('#canExecute() returns true in case the insertion does not break the tree structure', function() {
            assert.isTrue(insertCommand.canExecute());
        });

        test('#canExecute() returns false in case the inserted nodes are not associated to a parent node', function() {
           var nodeWithoutParent = new fakeNodeModule.FakeTreeNode("no_parent", []);
        var treeNodeCollection = new fakeNodeModule.FakeTreeNodeCollection([node_001, nodeWithoutParent]);
            insertCommand.setTreeNodeCollection(treeNodeCollection);

            assert.isFalse(insertCommand.canExecute());
        });

        test('#canExecute() returns false in case the insertion introduces cycles', function() {
            fakeNodeModule.node_01.parent = fakeNodeModule.node_0100; //create cycle
            fakeNodeModule.node_01.parent.isSubtermOf = function(n){
                if (n === fakeNodeModule.node_01) {
                    return true;
                }
                return false;
            };
            var treeNodeCollection = new fakeNodeModule.FakeTreeNodeCollection([fakeNodeModule.node_01, node_001]);
            insertCommand.setTreeNodeCollection(treeNodeCollection);
            assert.isFalse(insertCommand.canExecute());
        });

    });
});