define(function(require) {
    var assert = require('chai').assert;
    var commandModule = require('mj/commands/copy-to-command');

    //system under test
    var copyToCommand;

    //mock functions
    var copyToPairs;
    var fnCopyTo = function(selected) {
        copyToPairs.push({
            to: selected,
            copied: this
        });
        return {
            id: this.id,
            copied : true
        };
    };

    //data
    var selected1 = {
        id: "s1",
        copyTo: fnCopyTo
    };
    var selected2 = {
        id: "s2",
        copyTo: fnCopyTo
    };
    var selected3 = {
        id: "s3",
        copyTo: fnCopyTo
    };
    var clipped1 = {
        id: "c1",
        copyTo: fnCopyTo
    };
    var clipped2 = {
        id: "c2",
        copyTo: fnCopyTo
    };

    var selectedNodes = [selected1, selected2, selected3];
    var clippedNodes = [clipped1, clipped2];

    var focusedNodes;
    var fnSetFocus = function(nodes) {
        focusedNodes = nodes;
    }
    var viewstateManager = {
        setFocus: fnSetFocus
    };


    var fnCreateCommand = function(commandName, selectedNodes, clippedNodes) {
        return {
            commandName: commandName,
            commandArgs: [selectedNodes, clippedNodes]
        };
    }
    var commandFactory = {
        createCommand: fnCreateCommand
    };

    setup(function() {
        copyToCommand = new commandModule.CopyToCommand(commandFactory, viewstateManager, selectedNodes, clippedNodes);
        copyToPairs = [];
        focusedNodes = [];
    });


    suite('CopyToCommand', function() {
        test('#execute() copies the clippedNodes to the selectedNodes', function() {
            // act
            copyToCommand.execute();

            // assert
            assert.lengthOf(copyToPairs, 6);
            assert.equal(copyToPairs[0].to, selected1);
            assert.equal(copyToPairs[0].copied, clipped1);
        });
        test('#execute() focusus the view on the newly created copied nodes', function() {
            // act
            copyToCommand.execute();

            // assert
            assert.lengthOf(focusedNodes, 6);
            assert.deepEqual(focusedNodes[0], clipped1.copyTo(selected1));
        });
        test('#execute() returns a @DeleteCommand as undo command', function() {
            // act
            var command = copyToCommand.execute();

            // assert
            assert.equal(command.commandName, "delete");
            assert.lengthOf(command.commandArgs[0], 6);
            assert.deepEqual(command.commandArgs[0][0], clipped1.copyTo(selected1));
        });
        test('#execute() the returned @DeleteCommand applies to the copied nodes', function() {
            // act
            var command = copyToCommand.execute();

            // assert
            assert.equal(command.commandName, "delete");
            assert.lengthOf(command.commandArgs[0], 6);
            assert.deepEqual(command.commandArgs[0][0], clipped1.copyTo(selected1));
        });
    });
});