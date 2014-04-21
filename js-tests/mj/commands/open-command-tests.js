define(function(require) {
    var assert = require('chai').assert;
    var baseCommandModule = require('mj/commands/base-command');
    var openCommandModule = require('mj/commands/open-command');
    var fakeViewStateManagerModule = require('../../fake-objects/fake-viewstate-manager');
    var fakeNodeModule = require('../../fake-objects/fake-tree-node');

    //system under test
    var baseCommand;
    var openCommand;
    
    //mock and stub objects
    var fakeViewstateManager;

    setup(function() {
        fakeViewstateManager = new fakeViewStateManagerModule.FakeViewStateManager();
        fakeNodeModule.initializeTestData();
        baseCommand = new baseCommandModule.BaseCommand(fakeViewstateManager);
        var fakeTreeNodeCollection = new fakeNodeModule.FakeTreeNodeCollection([]);
        openCommand = new openCommandModule.OpenCommand(baseCommand, fakeTreeNodeCollection, false);
    });


    suite('OpenCommand', function() {
        test('#execute() opens only the nodes in the collection, given that @includeDescendantNodes is false', function() {
            //arrange
            var nodes = [fakeNodeModule.node_00, fakeNodeModule.node_0100];
            var fakeTreeNodeCollection = new fakeNodeModule.FakeTreeNodeCollection(nodes);
            openCommand = new openCommandModule.OpenCommand(baseCommand, fakeTreeNodeCollection, false);

            // act
            openCommand.execute();

            // assert
            assert.isTrue(fakeViewstateManager.isOpen(fakeNodeModule.node_00));
            assert.isTrue(fakeViewstateManager.isOpen(fakeNodeModule.node_0100));
        });

        test('#execute() opens all nodes including their descendants, given that @includeDescendantNodes is true', function() {
            //arrange
            var nodes = [fakeNodeModule.node_00, fakeNodeModule.node_0100];
            var fakeTreeNodeCollection = new fakeNodeModule.FakeTreeNodeCollection(nodes);
            openCommand = new openCommandModule.OpenCommand(baseCommand, fakeTreeNodeCollection, true);
            var allNodes = [
                    fakeNodeModule.node_00, 
                    fakeNodeModule.node_0100,
                    fakeNodeModule.node_01001
                ];
            fakeTreeNodeCollection.getAllNodes = function(nodes){
                return allNodes; 
            };

            // act
            openCommand.execute();

            // assert
            assert.isTrue(fakeViewstateManager.isOpen(allNodes[0]));
            assert.isTrue(fakeViewstateManager.isOpen(allNodes[1]));
            assert.isTrue(fakeViewstateManager.isOpen(allNodes[2]));
        });

        test('#undoExecute() resets the viewstate', function() {
            //arrange
            var nodes = [fakeNodeModule.node_00, fakeNodeModule.node_0100];
            var fakeTreeNodeCollection = new fakeNodeModule.FakeTreeNodeCollection(nodes);
            openCommand = new openCommandModule.OpenCommand(baseCommand, fakeTreeNodeCollection);
            var expectedViewState = fakeViewstateManager.getViewState();

            // act
            openCommand.execute();
            openCommand.undoExecute();

            // assert
            assert.equal(fakeViewstateManager.getViewState(), expectedViewState);
        });

    });
});