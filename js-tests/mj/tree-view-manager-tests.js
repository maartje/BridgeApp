define(function(require) {
	var assert = require('chai').assert;
	var treeViewManagerModule = require('mj/tree-view-manager');

	//system under test
	var treeViewManager; 

	//test data
	var node1 = {id : "1"};
	var node2 = {id : "2"};
	var node3 = {id : "3"};
	var node4 = {id : "4"};
	var nodes = [node1, node2, node3, node4];

	
	setup( function(){ 
		treeViewManager = new treeViewManagerModule.TreeViewManager();
	});

	suite('TreeViewManager', function() {

		test('nodes are initially closed', function() {
			assert.isFalse(treeViewManager.isOpen(node1));
		});
		test('#toggleOpenClose(node) opens a node that was previously closed', function() {
			treeViewManager.close(node2);

			// act
			treeViewManager.toggleOpenClose(node1);
			treeViewManager.toggleOpenClose(node2);

			// assert
			assert.isTrue(treeViewManager.isOpen(node1));
			assert.isTrue(treeViewManager.isOpen(node2));
		});
		test('#toggleOpenClose(node) closes a node that was previously open', function() {
			// arrange
			treeViewManager.toggleOpenClose(node1);
			treeViewManager.open(node2);

			// act
			treeViewManager.toggleOpenClose(node1);
			treeViewManager.toggleOpenClose(node2);

			// assert
			assert.isFalse(treeViewManager.isOpen(node1));
			assert.isFalse(treeViewManager.isOpen(node2));
		});
		test('#close(node) ensures that the given node is closed', function() {
			treeViewManager.toggleOpenClose(node1);
			treeViewManager.close(node2);
			treeViewManager.open(node3);
			treeViewManager.open(node3);

			treeViewManager.close(node1);
			treeViewManager.close(node2);
			treeViewManager.close(node3);

			assert.isFalse(treeViewManager.isOpen(node1));
			assert.isFalse(treeViewManager.isOpen(node2));
			assert.isFalse(treeViewManager.isOpen(node3));
		});

		test('#closeAll(nodes) ensures that all given nodes are closed', function() {
			// arrange
			treeViewManager.toggleOpenClose(node1);
			treeViewManager.open(node2);
			treeViewManager.open(node2);
			treeViewManager.close(node3);

			// act
			treeViewManager.closeAll(nodes);

			// assert
			assert.isFalse(treeViewManager.isOpen(node1));
    		assert.isFalse(treeViewManager.isOpen(node2));
			assert.isFalse(treeViewManager.isOpen(node3));
			assert.isFalse(treeViewManager.isOpen(node4));
		});


		test('#open(node) ensures that the given node is open', function() {
		    // arrange
		    treeViewManager.open(node2);
		    treeViewManager.close(node3);
		    treeViewManager.close(node3);
		    
			// act
			treeViewManager.open(node1);
			treeViewManager.open(node2);
			treeViewManager.open(node3);

			// assert
			assert.isTrue(treeViewManager.isOpen(node1));
			assert.isTrue(treeViewManager.isOpen(node2));
			assert.isTrue(treeViewManager.isOpen(node3));
		});

		test('#openAll(nodes) ensures that all given nodes are open', function() {
			// arrange
			treeViewManager.toggleOpenClose(node1);
			treeViewManager.close(node1);
			treeViewManager.open(node2);
			treeViewManager.open(node2);
			treeViewManager.close(node3);
			treeViewManager.close(node3);

			// act
			treeViewManager.openAll(nodes);

			// assert
			assert.isTrue(treeViewManager.isOpen(node1));
    		assert.isTrue(treeViewManager.isOpen(node2));
			assert.isTrue(treeViewManager.isOpen(node3));
			assert.isTrue(treeViewManager.isOpen(node4));
		});

	});
});