/*global setup, test, suite*/

define(function(require) {
    var assert = require('chai').assert;
    var baseCommandModule = require('mj/commands/base-command');
    var deleteCommandModule = require('mj/commands/delete-command');
    var fakeViewStateManagerModule = require('../../fake-objects/fake-viewstate-manager');
    var fakeNodeModule = require('../../fake-objects/fake-tree-node');

    //system under test
    var baseCommand;
    var deleteCommand;
    
    //mock and stub objects
    var fakeViewstateManager;

    setup(function() {
        fakeViewstateManager = new fakeViewStateManagerModule.FakeViewStateManager();
        fakeNodeModule.initializeTestData();
        baseCommand = new baseCommandModule.BaseCommand(fakeViewstateManager);
        var fakeTreeNodeCollection = new fakeNodeModule.FakeTreeNodeCollection([]);
        deleteCommand = new deleteCommandModule.DeleteCommand(baseCommand, fakeTreeNodeCollection);
    });


    suite('DeleteCommand', function() {
        test('#execute() detachs the given set of nodes from the data structure', function() {
            // arrange
            var nodes = [fakeNodeModule.node_00, fakeNodeModule.node_0100];
            var fakeTreeNodeCollection = new fakeNodeModule.FakeTreeNodeCollection(nodes);
            deleteCommand = new deleteCommandModule.DeleteCommand(baseCommand, fakeTreeNodeCollection);

            // act
            deleteCommand.execute();

            // assert
            assert.isFalse(fakeNodeModule.node_00.isAttached);
            assert.isFalse(fakeNodeModule.node_0100.isAttached);
        });
        
        test('#execute() only detachs the top nodes in case ancestor relations exists between the given nodes', function() {
            // arrange
            var nodes = [fakeNodeModule.node_00, fakeNodeModule.node_010, fakeNodeModule.node_01001];
            var fakeTreeNodeCollection = new fakeNodeModule.FakeTreeNodeCollection(nodes);
            var topNodes = [fakeNodeModule.node_00, fakeNodeModule.node_010];
            fakeTreeNodeCollection.getTopLevelNodes = function(){
                return topNodes;
            };
            deleteCommand = new deleteCommandModule.DeleteCommand(baseCommand, fakeTreeNodeCollection);

            // act
            deleteCommand.execute();

            // assert
            assert.isFalse(fakeNodeModule.node_00.isAttached);
            assert.isFalse(fakeNodeModule.node_010.isAttached);
            assert.isUndefined(fakeNodeModule.node_01001.isAttached);
        });


        test('#execute() sets the focus of the viewstate on A) next sibling nodes', function() {
            // arrange
            var nodes = [fakeNodeModule.node_00, fakeNodeModule.node_0100];
            var fakeTreeNodeCollection = new fakeNodeModule.FakeTreeNodeCollection(nodes);
            deleteCommand = new deleteCommandModule.DeleteCommand(baseCommand, fakeTreeNodeCollection);

            // act
            deleteCommand.execute();

            // assert
            assert.isTrue(fakeNodeModule.node_00.getNextSibling().hasFocus);
            assert.isTrue(fakeNodeModule.node_0100.getNextSibling().hasFocus);
        });

        test('#execute() sets the focus of the viewstate on B) previous sibling nodes', function() {
            // arrange
            var nodes = [fakeNodeModule.node_01, fakeNodeModule.node_0101];
            var fakeTreeNodeCollection = new fakeNodeModule.FakeTreeNodeCollection(nodes);
            deleteCommand = new deleteCommandModule.DeleteCommand(baseCommand, fakeTreeNodeCollection);

            // act
            deleteCommand.execute();

            // assert
            assert.isTrue(fakeNodeModule.node_01.getPreviousSibling().hasFocus);
            assert.isTrue(fakeNodeModule.node_0101.getPreviousSibling().hasFocus);
        });

        test('#execute() sets the focus of the viewstate on C) parent nodes', function() {
            // arrange
            var nodes = [fakeNodeModule.node_010];
            var fakeTreeNodeCollection = new fakeNodeModule.FakeTreeNodeCollection(nodes);
            deleteCommand = new deleteCommandModule.DeleteCommand(baseCommand, fakeTreeNodeCollection);

            // act
            deleteCommand.execute();

            // assert
            assert.isTrue(fakeNodeModule.node_010.getParent().hasFocus);
        });

        test('#execute() sets the focus of the viewstate on nearby nodes (A, B, or C)', function() {
            // arrange
            var nodes = [fakeNodeModule.node_00, fakeNodeModule.node_01001];
            var fakeTreeNodeCollection = new fakeNodeModule.FakeTreeNodeCollection(nodes);
            deleteCommand = new deleteCommandModule.DeleteCommand(baseCommand, fakeTreeNodeCollection);

            // act
            deleteCommand.execute();

            // assert
            assert.isTrue(fakeNodeModule.node_00.getNextSibling().hasFocus);
            assert.isTrue(fakeNodeModule.node_01001.getParent().hasFocus);
        });
        test('#execute() does NOT set focus on nodes in a detached subtree', function() {
            // arrange
            var nodes = [fakeNodeModule.node_00, fakeNodeModule.node_010, fakeNodeModule.node_01001];
            var fakeTreeNodeCollection = new fakeNodeModule.FakeTreeNodeCollection(nodes);
            var topNodes = [fakeNodeModule.node_00, fakeNodeModule.node_010];
            fakeTreeNodeCollection.getTopLevelNodes = function(){
                return topNodes;
            };
            deleteCommand = new deleteCommandModule.DeleteCommand(baseCommand, fakeTreeNodeCollection);


            // act
            deleteCommand.execute();

            // assert
            assert.isFalse(fakeNodeModule.node_010.isAttached);
            assert.isUndefined(fakeNodeModule.node_01001.getParent().hasFocus);
        });

        test('#undoExecute() resets the viewstate', function() {
            //arrange
            var nodes = [fakeNodeModule.node_00, fakeNodeModule.node_0100];
            var fakeTreeNodeCollection = new fakeNodeModule.FakeTreeNodeCollection(nodes);
            deleteCommand = new deleteCommandModule.DeleteCommand(baseCommand, fakeTreeNodeCollection);
            var expectedViewState = fakeViewstateManager.getViewState();

            // act
            deleteCommand.execute();
            deleteCommand.undoExecute();

            // assert
            assert.equal(fakeViewstateManager.getViewState(), expectedViewState);
        });

        test('#undoExecute() restores the data structure by attaching all detached nodes', function() {
            //arrange
            var nodes = [fakeNodeModule.node_00, fakeNodeModule.node_0100];
            var fakeTreeNodeCollection = new fakeNodeModule.FakeTreeNodeCollection(nodes);
            deleteCommand = new deleteCommandModule.DeleteCommand(baseCommand, fakeTreeNodeCollection);

            // act
            deleteCommand.execute();
            deleteCommand.undoExecute();

            // assert
            assert.isTrue(fakeNodeModule.node_00.isAttached);
            assert.isTrue(fakeNodeModule.node_0100.isAttached);
            
        });

        test('#undoExecute() restores the data structure, also in case ancestor relations exists between the given nodes', function() {
            // arrange
            var nodes = [fakeNodeModule.node_00, fakeNodeModule.node_010, fakeNodeModule.node_01001];
            var fakeTreeNodeCollection = new fakeNodeModule.FakeTreeNodeCollection(nodes);
            var topNodes = [fakeNodeModule.node_00, fakeNodeModule.node_010];
            fakeTreeNodeCollection.getTopLevelNodes = function(){
                return topNodes;
            };
            deleteCommand = new deleteCommandModule.DeleteCommand(baseCommand, fakeTreeNodeCollection);

            // act
            deleteCommand.execute();
            deleteCommand.undoExecute();

            // assert
            assert.isTrue(topNodes[0].isAttached);
            assert.isTrue(topNodes[1].isAttached);
            assert.isUndefined(fakeNodeModule.node_01001.isAttached);
        });

    });
});