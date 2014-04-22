/*global setup, test, suite*/

define(function(require) {
    var assert = require('chai').assert;
    var baseCommandModule = require('mj/commands/base-command');
    var toggleOpenCloseCommandModule = require('mj/commands/toggle-open-close-command');
    var fakeViewStateManagerModule = require('../../fake-objects/fake-viewstate-manager');
    var fakeNodeModule = require('../../fake-objects/fake-tree-node');

    //system under test
    var toggleOpenCloseCommand;
    
    //mock and stub objects
    var fakeViewstateManager;
    var fakeNode;

    setup(function() {
        fakeViewstateManager = new fakeViewStateManagerModule.FakeViewStateManager();
        fakeNodeModule.initializeTestData();
        var baseCommand = new baseCommandModule.BaseCommand(fakeViewstateManager);
        fakeNode = fakeNodeModule.node_01;
        fakeNode.getAllNodes = function(){
            return [
                fakeNodeModule.node_01,
                fakeNodeModule.node_010,
                fakeNodeModule.node_0100,
                fakeNodeModule.node_01001,
                fakeNodeModule.node_0101,
            ];
        };
        toggleOpenCloseCommand = new toggleOpenCloseCommandModule.ToggleOpenCloseCommand(baseCommand, fakeNode);
    });


    suite('ToggleOpenCloseCommand', function() {
        test('#execute() opens a closed node', function() {
            // act
            toggleOpenCloseCommand.execute();

            // assert
            assert.isTrue(fakeViewstateManager.isOpen(fakeNode));
        });

        test('#execute() does NOT affect the open/close state of the descendants if a node is opened', function() {
            // act
            toggleOpenCloseCommand.execute();

            // assert
            assert.isTrue(fakeViewstateManager.isOpen(fakeNode));
            assert.isFalse(fakeViewstateManager.isOpen(fakeNode.getChildren()[0]));
        });

        test('#execute() closes an open node', function() {
            // act
            toggleOpenCloseCommand.execute();
            toggleOpenCloseCommand.execute();

            // assert
            assert.isFalse(fakeViewstateManager.isOpen(fakeNode));
        });

        test('#execute() also closes the descendants of a closed node', function() {
            // act
            fakeViewstateManager.open(fakeNode);
            fakeViewstateManager.open(fakeNode.getChildren()[0]);

            toggleOpenCloseCommand.execute();

            // assert
            assert.isFalse(fakeViewstateManager.isOpen(fakeNode));
            assert.isFalse(fakeViewstateManager.isOpen(fakeNode.getChildren()[0]));
        });

        test('#undoExecute() resets the viewstate', function() {
            //arrange
            var expectedViewState = fakeViewstateManager.getViewState();

            // act
            toggleOpenCloseCommand.execute();
            toggleOpenCloseCommand.undoExecute();

            // assert
            assert.equal(fakeViewstateManager.getViewState(), expectedViewState);
        });
        
        test('#canExecute() returns true since the data structure is not modified', function() {
            assert.isTrue(toggleOpenCloseCommand.canExecute());
        });


    });
});