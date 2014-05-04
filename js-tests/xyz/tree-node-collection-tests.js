/*global setup, test, suite*/

define(function(require) {
    var assert = require('chai').assert;
    var treeNodeModule = require('xyz/tree-node');
    var treeNodeCollectionModule = require('xyz/tree-node-collection');

    //system under test
    var node_0;
    var node_00;
    var node_01;
    var node_010;
    var node_0100;
    var node_01000;
    var node_0101;

    suite('TreeNodeCollection', function() {
        setup(function() {
            var testData = {
                id : "n0",
                content : "n0_content",
                children : [
                    {
                        id : "n00",
                        content : "n00_content",
                        children : []
                        
                    },
                    {
                        id : "n01",
                        content : "n01_content",
                        children : [
                            {
                                id : "n010",
                                content : "n010_content",
                                children : [
                                    {
                                        id : "n0100",
                                        content : "n0100_content",
                                        children : [
                                            {
                                                id : "n01001",
                                                content : "n01001_content",
                                                children : []
                                            },
                                        ]
                                        
                                    },
                                    {
                                        id : "n0101",
                                        content : "n0101_content",
                                        children : []
                                    },
                                ]
                                
                            },
                        ]
                        
                    },
                ]
            };
            node_0 = new treeNodeModule.TreeNode(testData);
            node_00 = node_0.getChildren()[0];
            node_01 = node_0.getChildren()[1];
            node_010 = node_01.getChildren()[0];
            node_0100 = node_010.getChildren()[0];
            node_01000 = node_0100.getChildren()[0];
            node_0101 = node_010.getChildren()[1];
        });

        suite('TreeNodeCollection', function() {
            test('#getNodes() returns the nodes array', function() {
                var nodes = [node_0, node_010];
                var tnc = new treeNodeCollectionModule.TreeNodeCollection(nodes);
                assert.deepEqual(tnc.getNodes(), nodes);
            });
            test('#getTopLevelNodes() returns only the nodes that are not subnodes of other nodes in the collection', function() {
                var nodes = [node_00, node_01000, node_010, node_0101, node_00];
                var tnc = new treeNodeCollectionModule.TreeNodeCollection(nodes);
                assert.deepEqual(tnc.getTopLevelNodes().getNodes(), [node_00,node_010]);
            });
        });
    });
});