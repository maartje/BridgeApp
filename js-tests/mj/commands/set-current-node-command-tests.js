/*global setup, test, suite*/

define(function(require) {
    var assert = require('chai').assert;
    var baseCommandModule = require('mj/commands/base-command');
    var setCurrentNodeCommandModule = require('mj/commands/set-current-node-command');
    var fakeViewStateManagerModule = require('../../fake-objects/fake-viewstate-manager');
    var fakeNodeModule = require('../../fake-objects/fake-tree-node');

    //system under test
    var setCurrentNodeCommand;
    
    //mock and stub objects
    var fakeViewstateManager;

    suite('SetCurrentNodeCommand', function() {

        setup(function() {
            fakeViewstateManager = new fakeViewStateManagerModule.FakeViewStateManager();
            fakeNodeModule.initializeTestData();
            var baseCommand = new baseCommandModule.BaseCommand(fakeViewstateManager);
            fakeViewstateManager.setCurrentNode(fakeNodeModule.node_0);
            setCurrentNodeCommand = new setCurrentNodeCommandModule.SetCurrentNodeCommand(baseCommand, fakeNodeModule.node_010);
        });

        test('#execute() deselects all selected items that are not in scope of the new root', function() {
            //arrange
            fakeViewstateManager._selectedItems = [fakeNodeModule.node_01];
            
            // act
            setCurrentNodeCommand.execute();

            // assert 
            assert.isFalse(fakeViewstateManager.isSelected(fakeNodeModule.node_01));
        });

        test('#execute() does not deselect items that are in scope of the new root', function() {
            //arrange
            fakeViewstateManager._selectedItems = [fakeNodeModule.node_0100];
            
            // act
            setCurrentNodeCommand.execute();

            // assert 
            assert.isTrue(fakeViewstateManager.isSelected(fakeNodeModule.node_0100));
        });

        test('#execute() closes all open items that are not in scope of the new root', function() {
            //arrange
            fakeViewstateManager._openItems = [fakeNodeModule.node_01];
            
            // act
            setCurrentNodeCommand.execute();

            // assert 
            assert.isFalse(fakeViewstateManager.isOpen(fakeNodeModule.node_01));
        });

        test('#execute() does not close items that are in scope of the new root', function() {
            //arrange
            fakeViewstateManager._openItems = [fakeNodeModule.node_0100, fakeNodeModule.node_01001];
            
            // act
            setCurrentNodeCommand.execute();

            // assert 
            assert.isTrue(fakeViewstateManager.isOpen(fakeNodeModule.node_0100));
            assert.isTrue(fakeViewstateManager.isOpen(fakeNodeModule.node_01001));
        });

        test('#execute() ensures that the new root itself is open', function() {
            //arrange

            // act
            setCurrentNodeCommand.execute();

            // assert 
            assert.isTrue(fakeViewstateManager.isOpen(fakeNodeModule.node_010));
        });

        test('#execute() opens the ancestors of the old root that are subterms of the new root', function() {
            //arrange
            fakeViewstateManager.setCurrentNode(fakeNodeModule.node_01001);

            // act
            setCurrentNodeCommand.execute();

            // assert 
            assert.isTrue(fakeViewstateManager.isOpen(fakeNodeModule.node_0100));
        });

        test('#execute() sets the new root', function() {
            //arrange

            // act
            setCurrentNodeCommand.execute();

            // assert 
            assert.equal(fakeViewstateManager.getCurrentNode(), fakeNodeModule.node_010);
        });

        test('#undoExecute() resets the viewstate', function() {
            //arrange
            var expectedViewState = fakeViewstateManager.getViewState();

            // act
            setCurrentNodeCommand.execute();
            setCurrentNodeCommand.undoExecute();

            // assert
            assert.equal(fakeViewstateManager.getViewState(), expectedViewState);
        });
        
        test('#canExecute() returns true since the data structure is not modified', function() {
            assert.isTrue(setCurrentNodeCommand.canExecute());
        });


    });
});