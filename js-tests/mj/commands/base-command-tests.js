/*global setup, test, suite*/

define(function(require) {
    var assert = require('chai').assert;
    var commandModule = require('mj/commands/base-command');
    var fakeViewStateManagerModule = require('../../fake-objects/fake-viewstate-manager');

    //system under test
    var baseCommand;
    
    //mock and stub objects
    var fakeViewstateManager;

    suite('BaseCommand', function() {
        setup(function() {
            fakeViewstateManager = new fakeViewStateManagerModule.FakeViewStateManager();
            fakeViewstateManager.setViewState(2);
            baseCommand = new commandModule.BaseCommand(fakeViewstateManager);
        });

        test('#execute() does not modify the viewstate', function() {
            //arrange
            var oldViewState = fakeViewstateManager.getViewState();

            // act
            baseCommand.execute();

            // assert
            assert.equal(fakeViewstateManager.getViewState(), oldViewState);
        });

        test('#undoExecute() resets the viewstate', function() {
            //arrange
            var oldViewState = fakeViewstateManager.getViewState();

            // act
            baseCommand.execute();
            fakeViewstateManager.setViewState(3); //for example selects a node which is not implemented as a command
            baseCommand.undoExecute();

            // assert
            assert.equal(fakeViewstateManager.getViewState(), oldViewState);
        });
        
        test('#canExecute() returns true since the data structure is not modified by the base command', function() {
            assert.isTrue(baseCommand.canExecute());
        });

    });
});