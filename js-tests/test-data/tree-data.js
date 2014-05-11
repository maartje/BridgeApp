/**
 * Testdata in JSON format
 */
define(function(require, exports, module) {
    var treeNodeModule = require('models/tree-node');

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

    var initializeTestData = module.exports.initializeTestData = function(){
        var node_0 = module.exports.node_0 = new treeNodeModule.TreeNode(testData);
        var node_00 = module.exports.node_00 = node_0.getChildren()[0];
        var node_01 = module.exports.node_01 = node_0.getChildren()[1];
        var node_010 = module.exports.node_010 = node_01.getChildren()[0];
        var node_0100 = module.exports.node_0100 = node_010.getChildren()[0];
        var node_01000 = module.exports.node_01000 = node_0100.getChildren()[0];
        var node_0101 = module.exports.node_0101 = node_010.getChildren()[1];
    };
    
    initializeTestData();

    return module.exports;
});