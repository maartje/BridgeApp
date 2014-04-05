define(function(require) {
	var assert = require('chai').assert;
	var treeViewManagerModule = require('mj/tree-view-manager');

	suite('TreeViewManager', function() {
		test('nodes are initially closed', function() {
			// arrange
			var treeViewManager = new treeViewManagerModule.TreeViewManager();
			var node = {id : "1"};

			// assert
			assert.isFalse(treeViewManager.isOpen(node));
		});
		test('#toggleOpenClose(node) openens a node that was previously closed', function() {
			// arrange
			var treeViewManager = new treeViewManagerModule.TreeViewManager();
			var node = {id : "1"};

			// act
			treeViewManager.toggleOpenClose(node);

			// assert
			assert.isTrue(treeViewManager.isOpen(node));
		});
		test('#toggleOpenClose(node) closes a node that was previously open', function() {
			// arrange
			var treeViewManager = new treeViewManagerModule.TreeViewManager();
			var node = {id : "1"};
			treeViewManager.toggleOpenClose(node);

			// act
			treeViewManager.toggleOpenClose(node);

			// assert
			assert.isFalse(treeViewManager.isOpen(node));
		});
		test('#toggleOpenClose(node, fnGetChildNodes) recursively closes a node that was previously open, including its descendant nodes', function() {
			// arrange
			var treeViewManager = new treeViewManagerModule.TreeViewManager();
			var grandChildNode = { id : "010", children : [{id : "0100"}, {id : "0101"}] };
			var childNode1 = { id : "00", children : [{id : "000"}] };
			var childNode2 = { id : "01", children : [grandChildNode] };
			var node = { id : "0", children : [childNode1, childNode2] };
			treeViewManager.toggleOpenClose(node);
			treeViewManager.toggleOpenClose(childNode2);
			treeViewManager.toggleOpenClose(grandChildNode);

			var fnGetChildren = function(n){
				return n.children;
			}
			// act
			treeViewManager.toggleOpenClose(node, fnGetChildren);

			// assert
			assert.isFalse(treeViewManager.isOpen(node));
			assert.isFalse(treeViewManager.isOpen(childNode1));
			assert.isFalse(treeViewManager.isOpen(childNode2));
			assert.isFalse(treeViewManager.isOpen(grandChildNode));
		});
		test('#toggleOpenClose(node, fnGetChildNodes) recursively opens a node that was previously closed, including its descendant nodes', function() {
			// arrange
			var treeViewManager = new treeViewManagerModule.TreeViewManager();
			var grandChildNode = { id : "010", children : [{id : "0100"}, {id : "0101"}] };
			var childNode1 = { id : "00", children : [{id : "000"}] };
			var childNode2 = { id : "01", children : [grandChildNode] };
			var node = { id : "0", children : [childNode1, childNode2] };
			treeViewManager.toggleOpenClose(childNode1);

			var fnGetChildren = function(n){
				return n.children;
			}
			// act
			treeViewManager.toggleOpenClose(node, fnGetChildren);

			// assert
			assert.isTrue(treeViewManager.isOpen(node));
			assert.isTrue(treeViewManager.isOpen(childNode1));
			assert.isTrue(treeViewManager.isOpen(childNode2));
			assert.isTrue(treeViewManager.isOpen(grandChildNode));
		});
		test('#close(node, fnGetChildNodes) recursively closes a node, including its descendant nodes', function() {
			// arrange
			var treeViewManager = new treeViewManagerModule.TreeViewManager();
			var grandChildNode = { id : "010", children : [{id : "0100"}, {id : "0101"}] };
			var childNode1 = { id : "00", children : [{id : "000"}] };
			var childNode2 = { id : "01", children : [grandChildNode] };
			var node = { id : "0", children : [childNode1, childNode2] };
			treeViewManager.toggleOpenClose(node);
			treeViewManager.toggleOpenClose(childNode2);
			treeViewManager.toggleOpenClose(grandChildNode);

			var fnGetChildren = function(n){
				return n.children;
			}
			// act
			treeViewManager.close(node, fnGetChildren);

			// assert
			assert.isFalse(treeViewManager.isOpen(node));
			assert.isFalse(treeViewManager.isOpen(childNode1));
			assert.isFalse(treeViewManager.isOpen(childNode2));
			assert.isFalse(treeViewManager.isOpen(grandChildNode));
		});
		test('#toggleOpenClose(node, fnGetChildNodes) recursively opens a node, including its descendant nodes', function() {
			// arrange
			var treeViewManager = new treeViewManagerModule.TreeViewManager();
			var grandChildNode = { id : "010", children : [{id : "0100"}, {id : "0101"}] };
			var childNode1 = { id : "00", children : [{id : "000"}] };
			var childNode2 = { id : "01", children : [grandChildNode] };
			var node = { id : "0", children : [childNode1, childNode2] };
			treeViewManager.toggleOpenClose(childNode1);

			var fnGetChildren = function(n){
				return n.children;
			}
			// act
			treeViewManager.open(node, fnGetChildren);

			// assert
			assert.isTrue(treeViewManager.isOpen(node));
			assert.isTrue(treeViewManager.isOpen(childNode1));
			assert.isTrue(treeViewManager.isOpen(childNode2));
			assert.isTrue(treeViewManager.isOpen(grandChildNode));
		});

	});
});