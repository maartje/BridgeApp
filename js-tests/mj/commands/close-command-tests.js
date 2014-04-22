/*global setup, test, suite*/

define(function(require) {
    var assert = require('chai').assert;
    var baseCommandModule = require('mj/commands/base-command');
    var closeCommandModule = require('mj/commands/close-command');
    var fakeViewStateManagerModule = require('../../fake-objects/fake-viewstate-manager');
    var fakeNodeModule = require('../../fake-objects/fake-tree-node');

    //system under test
    var baseCommand;
    var closeCommand;
    
    //mock and stub objects
    var fakeViewstateManager;

    setup(function() {
        fakeViewstateManager = new fakeViewStateManagerModule.FakeViewStateManager();
        fakeNodeModule.initializeTestData();
        baseCommand = new baseCommandModule.BaseCommand(fakeViewstateManager);
        var fakeTreeNodeCollection = new fakeNodeModule.FakeTreeNodeCollection([]);
        closeCommand = new closeCommandModule.CloseCommand(baseCommand, fakeTreeNodeCollection, false);
    });


    suite('CloseCommand', function() {
        test('#execute() closes only the nodes in the collection, given that @includeDescendantNodes is false', function() {
            //arrange
            var nodes = [fakeNodeModule.node_00, fakeNodeModule.node_0100];
            var fakeTreeNodeCollection = new fakeNodeModule.FakeTreeNodeCollection(nodes);
            closeCommand = new closeCommandModule.CloseCommand(baseCommand, fakeTreeNodeCollection, false);
            var allNodes = [
                    fakeNodeModule.node_00, 
                    fakeNodeModule.node_0100,
                    fakeNodeModule.node_01001
                ];
            fakeTreeNodeCollection.getAllNodes = function(nodes){
                return allNodes;
            };
            fakeViewstateManager.openAll(allNodes);

            // act
            closeCommand.execute();

            // assert
            assert.isFalse(fakeViewstateManager.isOpen(allNodes[0]));
            assert.isFalse(fakeViewstateManager.isOpen(allNodes[1]));
            assert.isTrue(fakeViewstateManager.isOpen(allNodes[2]));
        });

        test('#execute() closes all nodes including their descendants, given that @includeDescendantNodes is true', function() {
            //arrange
            var nodes = [fakeNodeModule.node_00, fakeNodeModule.node_0100];
            var fakeTreeNodeCollection = new fakeNodeModule.FakeTreeNodeCollection(nodes);
            closeCommand = new closeCommandModule.CloseCommand(baseCommand, fakeTreeNodeCollection, true);
            var allNodes = [
                    fakeNodeModule.node_00, 
                    fakeNodeModule.node_0100,
                    fakeNodeModule.node_01001
                ];
            fakeTreeNodeCollection.getAllNodes = function(nodes){
                return allNodes;
            };
            fakeViewstateManager.openAll(allNodes);

            // act
            closeCommand.execute();

            // assert
            assert.isFalse(fakeViewstateManager.isOpen(allNodes[0]));
            assert.isFalse(fakeViewstateManager.isOpen(allNodes[1]));
            assert.isFalse(fakeViewstateManager.isOpen(allNodes[2]));
        });

        test('#undoExecute() resets the viewstate', function() {
            //arrange
            var nodes = [fakeNodeModule.node_00, fakeNodeModule.node_0100];
            var fakeTreeNodeCollection = new fakeNodeModule.FakeTreeNodeCollection(nodes);
            closeCommand = new closeCommandModule.CloseCommand(baseCommand, fakeTreeNodeCollection);
            var expectedViewState = fakeViewstateManager.getViewState();

            // act
            closeCommand.execute();
            closeCommand.undoExecute();

            // assert
            assert.equal(fakeViewstateManager.getViewState(), expectedViewState);
        });
        
        test('#canExecute() returns true since the data structure is not modified', function() {
            assert.isTrue(closeCommand.canExecute());
        });


    });
});