/*global setup, test, suite*/

define(function(require) {
    var assert = require('chai').assert;
    var treeNodeModule = require('xyz/tree-node');

    //system under test
    var node_0;
    var node_00;
    var node_01;
    var node_010;
    var node_0100;
    var node_01000;
    var node_0101;

    suite('TreeNode', function() {
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

        suite('Constructor', function() {
            test('#TreeNode(data) constructs a tree structure consisting of nodes with children', function() {
                assert.lengthOf(node_0.getChildren(), 2);
                assert.lengthOf(node_00.getChildren(), 0);
                assert.lengthOf(node_01.getChildren(), 1);
                assert.lengthOf(node_010.getChildren(), 2);
                assert.lengthOf(node_0100.getChildren(), 1);
                assert.lengthOf(node_01000.getChildren(), 0);
                assert.lengthOf(node_0101.getChildren(), 0);
            });
    
            test('#TreeNode(data) sets the parent pointers in the constructed tree structure', function() {
                assert.isNull(node_0.getParent());
                assert.equal(node_00.getParent(), node_0);
                assert.equal(node_01.getParent(), node_0);
                assert.equal(node_010.getParent(), node_01);
                assert.equal(node_0100.getParent(), node_010);
                assert.equal(node_01000.getParent(), node_0100);
                assert.equal(node_0101.getParent(), node_010);
            });
            test('#TreeNode(data) sets the id and content properties', function() {
                assert.deepEqual(node_010.getId(), "n010");
                assert.deepEqual(node_010.getContent(), "n010_content");
            });
        });
        suite('Behavior', function() {
            test('#collectSubterms() collects all subterms', function() {
                var subterms = node_010.collectSubterms();
                assert.include(subterms, node_010);
                assert.include(subterms, node_0100);
                assert.include(subterms, node_01000);
                // assert.include(subterms, node_0101);
                assert.lengthOf(subterms, 4);
            });
            test('#getRoot() returns the root', function() {
                assert.equal(node_010.getRoot(), node_0);
            });
            test('#getNextSibling() returns the next sibling or null', function() {
                assert.equal(node_00.getNextSibling(), node_01);
                assert.isNull(node_0.getNextSibling());
                assert.isNull(node_01.getNextSibling());
            });
            test('#getPreviousSibling() returns the previous sibling or null', function() {
                assert.equal(node_01.getPreviousSibling(), node_00);
                assert.isNull(node_0.getPreviousSibling());
                assert.isNull(node_00.getPreviousSibling());
            });
            test('#isRoot() returns true iff the parent of a node is null', function() {
                assert.isTrue(node_0.isRoot());
                assert.isFalse(node_00.isRoot());
            });
            test('#isSubtermOf(node) returns true for the node itself', function() {
                assert.isTrue(node_0.isSubtermOf(node_0));
                assert.isTrue(node_010.isSubtermOf(node_010));
            });
            test('#isSubtermOf(node) returns true for descendants of a node', function() {
                assert.isTrue(node_010.isSubtermOf(node_0));
                assert.isTrue(node_0100.isSubtermOf(node_010));
            });
            test('#isSubtermOf(node) returns false for non-subterm nodes', function() {
                assert.isFalse(node_0.isSubtermOf(node_010));
                assert.isFalse(node_010.isSubtermOf(node_0100));
                assert.isFalse(node_010.isSubtermOf(node_00));
            });
            test('#detach removes a node from its parent children', function() {
                node_01.detach();
                
                assert.lengthOf(node_0.getChildren(), 1);
                assert.equal(node_0.getChildren()[0], node_00);
            });
            test('#detach returns the node itself', function() {
                var node = node_01.detach();
                
                assert.equal(node, node_01);
            });
            test('#detach throws an exeption when called on the root', function() {
                assert.throw (node_0.detach, 'The root node can not be deleted');
            });
            test('#attach adds a node to (the list of children of) its parent', function() {
                var node_02 = new treeNodeModule.TreeNode({
                    id : "n02",
                    content : "n02_content",
                    parent : node_0,
                    children : [],
                });
                
                node_02.attach();
                assert.lengthOf(node_0.getChildren(), 3);
                assert.equal(node_0.getChildren()[2], node_02);
            });
            test('#attach does nothing when the node is already attached', function() {
                node_01.attach();
                assert.lengthOf(node_0.getChildren(), 2);
            });
            test('#attach throws an exception when called on a root node', function() {
                assert.throw (node_0.attach, 'The root node can not be inserted');
            });
        });
    });
});